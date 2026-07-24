-- ============================================================
-- Sessão Semanal de Questões — UNIDAVI Medicina
-- Migration 1/4: extensões, tipos e tabelas
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- Tipos ----------

create type public.user_role as enum ('admin', 'professor', 'aluno');

create type public.questao_status as enum ('pendente', 'curada');

-- nível de dificuldade declarado pelo autor no banco institucional
-- (Fácil / Média / Difícil, conforme os .docx de origem)
create type public.questao_nivel as enum ('facil', 'media', 'dificil');

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

create table public.questoes (
  id         uuid primary key default gen_random_uuid(),
  enunciado  text not null,
  vinheta    text,
  alt_a      text not null,
  alt_b      text not null,
  alt_c      text not null,
  alt_d      text not null,
  gabarito   char(1) not null check (gabarito in ('A', 'B', 'C', 'D')),
  -- justificativa por alternativa, inclusive distratores (obrigatórias)
  just_a     text not null,
  just_b     text not null,
  just_c     text not null,
  just_d     text not null,
  -- explicação global da resposta correta ("Justificativa geral" no gabarito),
  -- distinta das justificativas por alternativa; nullable porque texto colado
  -- na Porta B pode não trazê-la
  justificativa_geral text,
  nivel      public.questao_nivel,               -- opcional; nem toda origem informa
  fase       int not null check (fase between 1 and 12),
  uc         text not null,
  sp         text not null,
  oa_tags    text[] not null default '{}',
  status     public.questao_status not null default 'pendente',
  versao     int not null default 1,
  criado_por uuid not null references public.profiles (id),
  criado_em  timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index questoes_fase_uc_sp_idx on public.questoes (fase, uc, sp);
create index questoes_oa_tags_idx on public.questoes using gin (oa_tags);

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
  uc           text not null,
  sp           text not null,
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
