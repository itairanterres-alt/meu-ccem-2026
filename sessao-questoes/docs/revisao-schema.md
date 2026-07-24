# Revisão do schema — decisões e perguntas em aberto

Documento de apoio à revisão das quatro migrations em `supabase/migrations/`. O rascunho da §5 do brief foi preservado na intenção; abaixo, tudo o que foi **refinado** e o porquê.

## O que ficou exatamente como o rascunho

- Todas as tabelas do rascunho existem com os mesmos nomes: `profiles`, `questoes`, `questao_versoes`, `sessoes`, `sessao_questoes`, `respostas`, `cards`.
- 4 alternativas fixas (`alt_a..alt_d`), gabarito com CHECK em A–D, justificativa obrigatória (NOT NULL) por alternativa, inclusive distratores.
- `UNIQUE (sessao_id, questao_id, aluno_id)` em respostas — uma resposta por aluno por item, sem UPDATE (imutável após envio).
- Enums de status conforme o rascunho (`pendente/curada`, `rascunho/aberta/em_andamento/encerrada`, `aguardando/aberta/travada/discutida`).
- Campos FSRS em `cards` (`due, stability, difficulty, reps, lapses, state`).

## Refinamentos técnicos (intenção preservada)

**1. Tabela nova: `sessao_participantes`.** Registra quem entrou pelo código. Três razões: (a) o contador de conectados da projeção precisa de fonte persistente; (b) o aluno que entrou mas não respondeu algum item ainda precisa rever a sessão depois — sem essa tabela, o vínculo aluno↔sessão só existiria via `respostas`; (c) as RLS de "participante da sessão" ancoram nela. Inserção só via `rpc_entrar_sessao`.

**2. Versionamento por trigger, linha vigente em `questoes`.** "Editar gera nova versão, não sobrescreve": a linha em `questoes` é sempre a versão vigente; o trigger `questao_versionar` grava o snapshot (jsonb da linha inteira) da versão anterior em `questao_versoes` e incrementa `versao` — automaticamente, em qualquer edição de conteúdo, sem depender do frontend lembrar de fazer isso. Decisão embutida: **edição de conteúdo devolve `status` a `'pendente'`** (a curadoria valeu para o texto anterior). Mudança só de status (marcar como curada) não gera versão. *Confirmar se a volta a 'pendente' é o comportamento desejado.*

**3. Gabarito protegido por RPC, não por RLS.** RLS do Postgres é por **linha**, não por coluna — se o aluno pudesse fazer SELECT em `questoes` durante o item aberto, veria o gabarito e as justificativas. Solução: durante `aberta`, o aluno recebe o item via `rpc_ver_item`, que omite gabarito/justificativas; após `travada/discutida`, o RPC completa a resposta e a RLS passa a permitir SELECT direto na questão (para revisão pós-sessão e flashcards). Este é o ponto mais importante do desenho de segurança junto com o §4 abaixo.

**4. Professor sem SELECT em `respostas` — nem depois da sessão.** O brief exige que a resposta individual nunca chegue ao professor durante a sessão e que o professor leia "agregados da própria turma". Implementado no nível mais estrito: professor não tem policy de SELECT em `respostas`; tudo o que ele vê passa por RPCs agregados (`rpc_distribuicao` — só após travar; `rpc_contagem_respostas` — "N de M" enquanto aberto, sem distribuição). Admin lê tudo. Os RPCs de dashboard (passo 4) seguirão o mesmo padrão. *Confirmar: no dashboard pós-sessão o professor deve ver desempenho por aluno nominal, ou só agregados? O desenho atual assume só agregados; abrir por aluno é mudança de uma policy.*

**5. Respostas só via `rpc_responder`.** Valida no servidor: sessão `em_andamento`, item `aberta`, aluno participante. Resposta fora da janela (item travado, sessão encerrada) é rejeitada mesmo que o cliente tente. Sem policy de INSERT direto.

**6. Código da sessão.** 6 caracteres, alfabeto sem I/L/O/0/1 (legibilidade de longe na projeção), gerado por trigger com verificação de unicidade. ~29⁶ ≈ 594 milhões de combinações.

**7. Campos adicionais pequenos:** `sessoes.aberta_em/encerrada_em` e `sessao_questoes.aberta_em/travada_em` (carimbo dos momentos-chave — barato agora, impossível de reconstituir depois); `questoes.atualizado_em`; `cards.last_review` e `UNIQUE (aluno_id, questao_id)` (um card por questão por aluno).

**8. Cards só de questões respondidas.** A policy de INSERT em `cards` exige que exista resposta do próprio aluno àquela questão — "banco pessoal de flashcards gerados a partir das próprias questões". *Confirmar: questão que o aluno viu na sessão mas não respondeu pode virar card? O desenho atual diz não.*

**9. Perfis.** Trigger cria o profile no primeiro login (magic link) com role `'aluno'`; admin promove professores (troca de role protegida por trigger — só admin). Aluno edita o próprio `nome/turma/fase`, não `role/email`. Os 3 admins são promovidos por SQL no seed.

**10. Realtime.** `sessoes` e `sessao_questoes` na publication — aluno e projeção acompanham o lockstep por eventos (RLS se aplica: aluno só recebe eventos de sessão em que é participante). `respostas` **fora** da publication (evento de INSERT vazaria a resposta individual); o "N de M responderam" do professor é polling leve do RPC.

## Perguntas em aberto — respondam antes ou junto com a aprovação

1. **Anexos da §10 não chegaram ao repositório** (SCHEMA_OUTPUT, amostra .docx, tokens visuais). O schema de `questoes` segue o rascunho da §5; como o anexo prevalece, a importação (passo 3) e eventuais renomeações de campos ficam pendentes do `SCHEMA_OUTPUT`. Enviem os três arquivos — idealmente commitados em `sessao-questoes/docs/anexos/`.
2. **OAs do SP (§8):** para sinalizar "OAs do SP sem item", preciso da lista oficial de OAs de cada SP. De onde ela vem — tabela importada por docente, ou digitada pelo professor ao criar a sessão? (Não vou inventar OA; sem fonte, a tela mostra só os OAs presentes nas questões selecionadas, sem detecção de lacuna.)
3. **Domínios de e-mail institucionais** para o magic link: qual(is) domínio(s) exatos de aluno e de docente (ex.: `@unidavi.edu.br`? alunos têm domínio próprio?). A restrição é configurada no Auth do Supabase.
4. **Turma/fase do aluno:** o aluno declara a própria turma no primeiro acesso (autosserviço), ou admin importa a lista de matrícula? O schema aceita ambos; muda só o fluxo de onboarding.
5. **UC e SP como texto livre** (`text`), conforme rascunho. Se a nomenclatura institucional tiver códigos canônicos (e o SCHEMA_OUTPUT sugerir isso), promovemos a tabelas de referência antes do piloto — mudar depois custa migração de dados.
6. Confirmar os três pontos marcados em itálico nos refinamentos 2, 4 e 8.
