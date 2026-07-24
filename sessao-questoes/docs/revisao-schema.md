# Revisão do schema — decisões e perguntas em aberto

Documento de apoio à revisão das quatro migrations em `supabase/migrations/`. O rascunho da §5 do brief foi preservado na intenção; abaixo, tudo o que foi **refinado** e o porquê.

> **Atualização 1 (amostra .docx — UC1, 4ª fase).** Os quatro `.docx` estão em `docs/anexos/`, com nota de calibração da Porta B. As 40 questões reais foram extraídas e carregadas com 0 erros.
>
> **Atualização 2 (SCHEMA_OUTPUT encontrado — reconciliação grande).** O 1º anexo da §10 estava dentro da skill `capi-questoes-enamed`: é o `schema_questao_med_unidavi.json` (v2026.1/v3.1). Copiei-o, com a taxonomia, o banco de OAs, exemplos e o validador, para `docs/anexos/schema-institucional/`. **Pela §10 o anexo prevalece, então realinhei o schema ao contrato canônico** — mudança substancial descrita na seção "Reconciliação com o SCHEMA_OUTPUT" abaixo. As 40 questões foram recarregadas no formato canônico e o fluxo inteiro revalidado sob RLS (embaralhamento de alternativas, gabarito oculto, versionamento) — tudo passa. Também incorporei as respostas do coordenador (admins, domínio de e-mail).

## Reconciliação com o SCHEMA_OUTPUT (o anexo prevalece)

O contrato canônico é bem mais rico que o rascunho da §5. Ajustes feitos, todos por regra da §10 (não por preferência):

1. **Alternativas viram tabela-filha `questao_alternativas`** `(letra, texto, correta, justificativa)`, fiel ao array canônico — em vez de `alt_a..alt_d` + `gabarito` + `just_a..just_d` achatados. Correção = alternativa com `correta = true` (não se assume letra fixa).
2. **Convenção "correta em A" + embaralhamento.** O gerador institucional emite sempre a correta na letra A (o validador `CORRETA_A` exige isso); a exibição embaralha. Implementei `sessao_questoes.ordem_alternativas` (ex.: `{C,A,D,B}`): a projeção e o aluno veem as alternativas em ordem embaralhada por item, e a convenção A não vaza. Questão vinda da Porta B (.docx) tem a correta na letra autoral (B/A/C…) — o mesmo mecanismo cobre os dois casos.
3. **Campos canônicos** adotados com os nomes do contrato: `uc_slug`, `sp_referencia` (slugs `med_unidavi_fXX_ucYY_...`, não texto livre), `texto_base` (era `vinheta`), `fase_alvo`, `tema`, `subtema`, `area_clinica`, `nivel_bloom`, `dificuldade_editorial`, `competencia_dcn_2025 text[]`, `oa_slugs text[]`, `tags`, `referencia`, `fonte_geracao`, `disponibilidade`.
4. **Enums corrigidos:** `status` → `pendente|curado|suspenso|arquivado` (era `curada`); `dificuldade_editorial` → `facil|medio|dificil` (era `media`). `area_clinica` e `nivel_bloom` como CHECK contra os enums canônicos.
5. **`payload jsonb`** guarda o documento canônico completo (fidelidade de ida-e-volta). Metadados que só o ecossistema usa — `uso_em_avaliacoes`, `performance`/TRI, `auditoria`, `imagens_anexadas`, `cenario_origem` — ficam no payload, **não** viram coluna nesta fatia ("uma fatia, não a plataforma").
6. **Campos exigidos pelo canônico ficam NULLABLE** quando a Porta B não os traz (`tema`, `area_clinica`, `nivel_bloom`): questão `pendente` pode estar incompleta; a curadoria os completa. Um gate pode exigir preenchimento antes de `curado`. **Não inventei** area/bloom/competência/OA para a amostra .docx (§4).
7. **"Justificativa geral" do .docx** (que o canônico não tem) é **dobrada na justificativa da alternativa correta** na importação — preserva o dado sem coluna não-canônica.
8. **`versao` e `questao_versoes`** preservados; o snapshot agora inclui a linha + as alternativas (`fn_snapshot_questao`).

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

## Resolvido pelo coordenador

- ✅ **SCHEMA_OUTPUT** encontrado (dentro da skill) e adotado — ver reconciliação acima.
- ✅ **Domínio de e-mail:** todos `@unidavi.edu.br`. Restrição documentada em `seed.sql` (configurar no Auth do Supabase).
- ✅ **Admins:** `itairan.terres@`, `luiz.zanis@`, `tatiane.barbosa@unidavi.edu.br` — no `seed.sql`.
- ✅ **Fonte de OAs:** existe (`oas_med_unidavi_2026_1.json`, 810 OAs, fases 1–8, slug `..._spZZ_oaNN`). Mas é 2026.1 e **os manuais estão sendo atualizados (hoje/segunda)** — então a fonte de OAs/SPs será **importável** (docente sobe o manual), não cravada no arquivo 2026.1. `oa_slugs` e `sp_referencia` referenciam esses slugs.

## Perguntas em aberto

1. **Manuais docentes atualizados:** não consigo acessar o OneDrive local (`C:\Users\...`) deste ambiente — preciso que os manuais novos sejam **enviados aqui** (como os .docx/skill). Enquanto isso, uso a taxonomia/OAs 2026.1 da skill como referência provisória.
2. **SP da amostra .docx não bate com a taxonomia 2026.1.** A UC casa (`med_unidavi_f04_uc01_proliferacao_celular`), mas os títulos de SP da amostra ("O que eu fiz de errado?", "Quando o tempo é decisivo…") não existem em f04/uc01 da taxonomia 2026.1 (que lista "Cavalo de Tróia", "Ata de Reunião"…). Provável efeito da atualização dos manuais. **Não cravei `sp_referencia` da amostra** (fica null). Confirmar com os manuais novos qual o slug de SP correto.
3. **Tipografia:** §11 pede DM Sans; o design system do ecossistema usa IBM Plex Sans. Recomendo IBM Plex Sans (alinhar ao ecossistema). Confirmar. (Ver `docs/anexos/tokens-unidavi.md`.)
4. **Turma/fase do aluno:** autodeclarada no primeiro acesso, ou admin importa a matrícula? Schema aceita ambos.
5. Confirmar os pontos de curadoria: edição de conteúdo volta status a `pendente`? Card só de questão respondida? Professor vê só agregados (nunca resposta nominal), inclusive no dashboard pós-sessão?
