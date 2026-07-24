# Revisão do schema — decisões e perguntas em aberto

Documento de apoio à revisão das quatro migrations em `supabase/migrations/`. O rascunho da §5 do brief foi preservado na intenção; abaixo, tudo o que foi **refinado** e o porquê.

> **Atualização (amostra real recebida — UC1, 4ª fase, SP1+SP2).** Os quatro `.docx` da §10 estão agora em `docs/anexos/`, com a nota de calibração da Porta B (`docs/anexos/README.md`). Dois campos novos entraram no schema por causa da amostra (`nivel`, `justificativa_geral`); as 40 questões reais foram extraídas e carregadas na tabela `questoes` sob RLS com **0 erros** de validação. Detalhes nos refinamentos 11–12 abaixo. O `SCHEMA_OUTPUT` (contrato do gerador, 1º item da §10) **ainda não chegou** — segue pendente.

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

**11. Campo novo `nivel` (enum `facil|media|dificil`).** A amostra marca cada questão com `(Nível: Fácil|Média|Difícil)` — metadado institucional real. Capturado como enum nullable (nem toda origem informará). "O dado é o produto": descartá-lo perderia informação que o gerador já produz.

**12. Campo novo `justificativa_geral` (nullable).** O gabarito traz, além das 4 justificativas por alternativa, uma "Justificativa geral" — explicação global da resposta correta, distinta dos comentários por alternativa e útil na discussão em sala. Adicionado; `rpc_ver_item` passa a devolvê-lo após o travamento. Nullable porque texto colado na Porta B pode não trazê-lo.

**Calibração da Porta B (impacto no passo 3).** A amostra revelou que questões e gabarito são **dois documentos separados**, casados pelo número da questão — a Porta B precisa aceitar os dois textos (colados juntos ou em dois campos) e a IA junta. Não há `vinheta` separada na origem (o caso vem no corpo do enunciado) nem `oa_tags`. Mapeamento completo em `docs/anexos/README.md`.

## Perguntas em aberto — respondam antes ou junto com a aprovação

1. **Falta o `SCHEMA_OUTPUT`** (contrato do gerador institucional, 1º item da §10). A amostra `.docx` (2º item) chegou e está em `docs/anexos/`; os tokens visuais (3º item) também faltam. Como o anexo prevalece sobre a §5, a Porta A (CSV/JSON) e eventuais renomeações de campo seguem pendentes do `SCHEMA_OUTPUT`. **Pergunta concreta:** o `justificativa_geral` e o `nivel` que descobri na amostra estão no `SCHEMA_OUTPUT`? Se os nomes de campo divergirem, o anexo manda.
2. **OAs do SP (§8):** confirmado pela amostra que **os OAs não estão nos documentos de questões** — a única âncora é a Matriz INEP 478/2025. Para sinalizar "OAs do SP sem item" preciso da lista oficial de OAs de cada SP. De onde ela vem — tabela importada por docente, ou digitada ao criar a sessão? Sem fonte, a tela mostra só os OAs presentes nas questões, sem detecção de lacuna.
3. **Domínios de e-mail institucionais** para o magic link: qual(is) domínio(s) exatos de aluno e de docente (ex.: `@unidavi.edu.br`? alunos têm domínio próprio?). A restrição é configurada no Auth do Supabase.
4. **Turma/fase do aluno:** o aluno declara a própria turma no primeiro acesso (autosserviço), ou admin importa a lista de matrícula? O schema aceita ambos; muda só o fluxo de onboarding.
5. **UC e SP como texto livre** (`text`), conforme rascunho. Se a nomenclatura institucional tiver códigos canônicos (e o SCHEMA_OUTPUT sugerir isso), promovemos a tabelas de referência antes do piloto — mudar depois custa migração de dados.
6. Confirmar os três pontos marcados em itálico nos refinamentos 2, 4 e 8.
