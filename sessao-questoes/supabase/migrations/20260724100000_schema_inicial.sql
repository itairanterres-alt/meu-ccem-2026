-- ============================================================
-- Sessão Semanal de Questões — UNIDAVI Medicina
-- Migration 1/4: extensões, tipos e tabelas
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- Tipos ----------

create type public.user_role as enum ('admin', 'professor', 'aluno');

-- Enums alinhados ao contrato institucional schema_questao_med_unidavi.json
-- (v2026.1/v3.1) — ver docs/anexos/schema-institucional/. O anexo prevalece
-- sobre o rascunho da §5 (regra da §10).

-- status_curadoria canônico: nasce 'pendente'; só docente marca 'curado'.
create type public.questao_status as enum ('pendente', 'curado', 'suspenso', 'arquivado');

-- disponibilidade para uso (backend do ecossistema gere 'em_descanso' etc.)
create type public.questao_disponibilidade as enum ('disponivel', 'em_descanso', 'arquivada', 'suspensa');

-- dificuldade_editorial canônica: facil | medio | dificil (note 'medio', não 'media')
create type public.questao_dificuldade as enum ('facil', 'medio', 'dificil');

create type public.sessao_status as enum ('rascunho', 'aberta', 'em_andamento', 'encerrada');

-- estado de um item dentro da sessão (lockstep)
create type public.item_estado as enum ('aguardando', 'aberta', 'travada', 'discutida');

-- estados FSRS
create type public.card_state as enum ('new', 'learning', 'review', 'relearning');

-- ---------- profiles ----------

create table public.profiles (
  id        uuid primary key references auth.users (id) on delete cascade,
  nome      text not null default '',
  email     text not null unique,
  role      public.user_role not null default 'aluno',
  turma     text,                                   -- T07..T18
  fase      int check (fase between 1 and 12),
  criado_em timestamptz not null default now()
);

-- ---------- questoes (banco institucional) ----------
-- Alinhada ao schema_questao_med_unidavi.json. Estratégia: colunas
-- projetadas (os campos que ESTA fatia usa — sessão, dashboard, cobertura
-- de OA, importação) + `payload` jsonb com o documento canônico completo
-- para fidelidade de ida-e-volta (metadados que só o ecossistema usa —
-- uso_em_avaliacoes, performance/TRI, auditoria, imagens_anexadas,
-- cenario_origem — ficam no payload, não viram coluna nesta fatia).
--
-- As ALTERNATIVAS ficam em questao_alternativas (abaixo), fiéis ao array
-- canônico [{letra, texto, correta, justificativa}].

create table public.questoes (
  id            uuid primary key default gen_random_uuid(),
  -- documento canônico completo (validado contra o schema na importação)
  payload       jsonb not null default '{}'::jsonb,
  -- --- projeções consultáveis ---
  enunciado     text not null,
  texto_base    text,                              -- vinheta/caso; null em questão conceitual
  fase_alvo     int not null check (fase_alvo between 1 and 12),
  uc_slug       text not null,                     -- med_unidavi_fXX_ucYY_slug
  sp_referencia text,                              -- med_unidavi_fXX_ucYY_spZZ (null se não vinculada)
  -- Campos que o contrato canônico exige, mas que a Porta B (texto colado)
  -- pode não trazer: ficam NULLABLE porque uma questão 'pendente' pode estar
  -- incompleta; a curadoria (status -> 'curado') os completa. Um gate de
  -- curadoria pode exigir que estejam preenchidos antes de marcar 'curado'.
  tema          text,
  subtema       text,
  area_clinica  text,                              -- enum canônico (CHECK abaixo)
  nivel_bloom   text,                              -- enum canônico (CHECK abaixo)
  dificuldade_editorial public.questao_dificuldade,
  competencia_dcn_2025  text[] not null default '{}',  -- dcn2025_comp_01..27
  oa_slugs      text[] not null default '{}',      -- med_unidavi_fXX_ucYY_spZZ_oaNN
  tags          text[] not null default '{}',
  referencia    text,
  fonte_geracao text not null default 'humano',
  status        public.questao_status not null default 'pendente',
  disponibilidade public.questao_disponibilidade not null default 'disponivel',
  versao        int not null default 1,
  criado_por    uuid not null references public.profiles (id),
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint questoes_area_clinica_chk check (area_clinica in (
    'ciclo_basico','clinica_medica','cirurgia','ginecologia_obstetricia',
    'pediatria','medicina_familia_comunidade','saude_mental','urgencia_emergencia')),
  constraint questoes_nivel_bloom_chk check (nivel_bloom in (
    'conhecimento','compreensao','aplicacao','analise','sintese','avaliacao'))
);

create index questoes_fase_uc_sp_idx on public.questoes (fase_alvo, uc_slug, sp_referencia);
create index questoes_oa_idx on public.questoes using gin (oa_slugs);
create index questoes_competencia_idx on public.questoes using gin (competencia_dcn_2025);

-- ---------- questao_alternativas (array canônico) ----------
-- Uma linha por alternativa. `correta` marca o gabarito — NÃO se assume que
-- é sempre a letra A: o gerador institucional emite a correta em A por
-- convenção de banco (a exibição embaralha), mas questão colada na Porta B
-- (dos .docx) tem a correta em qualquer letra. Correção = alternativa cuja
-- `correta` é true. A ordem de exibição na sessão é embaralhada por item
-- (ver sessao_questoes.ordem_alternativas) para não vazar a convenção A.

create table public.questao_alternativas (
  id            uuid primary key default gen_random_uuid(),
  questao_id    uuid not null references public.questoes (id) on delete cascade,
  letra         char(1) not null check (letra in ('A','B','C','D')),
  texto         text not null,
  correta       boolean not null default false,
  justificativa text not null,
  unique (questao_id, letra)
);

create index questao_alt_questao_idx on public.questao_alternativas (questao_id);

-- exatamente uma correta por questão
create unique index questao_alt_uma_correta_idx
  on public.questao_alternativas (questao_id) where correta;

-- ---------- questao_versoes (histórico) ----------
-- A linha em `questoes` é sempre a versão vigente; cada edição de conteúdo
-- grava aqui o snapshot da versão anterior (via trigger, migration 2).

create table public.questao_versoes (
  id         uuid primary key default gen_random_uuid(),
  questao_id uuid not null references public.questoes (id) on delete cascade,
  versao     int not null,
  snapshot   jsonb not null,
  editado_por uuid references public.profiles (id),
  editado_em timestamptz not null default now(),
  unique (questao_id, versao)
);

-- ---------- sessoes ----------

create table public.sessoes (
  id           uuid primary key default gen_random_uuid(),
  professor_id uuid not null references public.profiles (id),
  titulo       text not null,
  fase         int not null check (fase between 1 and 12),
  uc_slug      text not null,                      -- med_unidavi_fXX_ucYY_slug
  sp_referencia text,                              -- med_unidavi_fXX_ucYY_spZZ (null se avulsa)
  turma        text not null,
  codigo       text not null unique,               -- 6 caracteres, gerado por trigger
  status       public.sessao_status not null default 'rascunho',
  questao_atual uuid,                              -- FK para sessao_questoes, adicionada abaixo
  criado_em    timestamptz not null default now(),
  aberta_em    timestamptz,
  encerrada_em timestamptz
);

-- ---------- sessao_questoes (itens da sessão, com ordem e estado) ----------

create table public.sessao_questoes (
  id         uuid primary key default gen_random_uuid(),
  sessao_id  uuid not null references public.sessoes (id) on delete cascade,
  questao_id uuid not null references public.questoes (id),
  ordem      int not null,
  estado     public.item_estado not null default 'aguardando',
  -- ordem de exibição das alternativas neste item, ex.: {C,A,D,B} — mapeia
  -- posição na tela → letra canônica. Embaralhada por item para não vazar a
  -- convenção "correta em A" do banco. Definida ao montar/abrir o item.
  ordem_alternativas char(1)[] not null default '{A,B,C,D}',
  aberta_em  timestamptz,
  travada_em timestamptz,
  unique (sessao_id, questao_id)
);

create index sessao_questoes_sessao_ordem_idx on public.sessao_questoes (sessao_id, ordem);

alter table public.sessoes
  add constraint sessoes_questao_atual_fkey
  foreign key (questao_atual) references public.sessao_questoes (id) on delete set null;

-- ---------- sessao_participantes ----------
-- Registra quem entrou pelo código: alimenta o contador de conectados e
-- garante ao aluno acesso de revisão pós-sessão mesmo se não respondeu tudo.

create table public.sessao_participantes (
  sessao_id uuid not null references public.sessoes (id) on delete cascade,
  aluno_id  uuid not null references public.profiles (id) on delete cascade,
  entrou_em timestamptz not null default now(),
  primary key (sessao_id, aluno_id)
);

-- ---------- respostas ----------

create table public.respostas (
  id            uuid primary key default gen_random_uuid(),
  sessao_id     uuid not null references public.sessoes (id) on delete cascade,
  questao_id    uuid not null references public.questoes (id),
  aluno_id      uuid not null references public.profiles (id),
  alternativa   char(1) not null check (alternativa in ('A', 'B', 'C', 'D')),
  respondido_em timestamptz not null default now(),
  unique (sessao_id, questao_id, aluno_id)         -- uma resposta por aluno por item
);

create index respostas_sessao_questao_idx on public.respostas (sessao_id, questao_id);
create index respostas_aluno_idx on public.respostas (aluno_id);

-- ---------- cards (flashcards pessoais, FSRS) ----------

create table public.cards (
  id          uuid primary key default gen_random_uuid(),
  aluno_id    uuid not null references public.profiles (id) on delete cascade,
  questao_id  uuid not null references public.questoes (id) on delete cascade,
  due         timestamptz not null default now(),
  stability   double precision not null default 0,
  difficulty  double precision not null default 0,
  reps        int not null default 0,
  lapses      int not null default 0,
  state       public.card_state not null default 'new',
  last_review timestamptz,
  unique (aluno_id, questao_id)
);

create index cards_aluno_due_idx on public.cards (aluno_id, due);
