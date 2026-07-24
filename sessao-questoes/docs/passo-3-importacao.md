# Passo 3 — Importação (Porta A e Porta B)

Duas portas de entrada para o banco de questões, além das 40 fixas no código (`questoes-seed.ts`,
dado de teste do passo 2). Rotas: `/#/importacao` (escolha), `/#/importacao/porta-a`,
`/#/importacao/porta-b`. Toda questão importada nasce **pendente** e passa por uma tela de
conferência antes de confirmar — nenhuma entra no banco sem essa parada.

## Porta A — JSON já estruturado

Cola ou envia um `.json`: um objeto-questão, um array, ou `{"questoes": [...]}` (mesma flexibilidade
de entrada do `validate_questao.py` institucional). Útil para quem já tem as questões no formato
canônico (`schema_questao_med_unidavi.json`).

## Porta B — colar do formato real da coordenação

Cola dois textos — o documento de questões e o de gabarito — no formato que a coordenação já usa
hoje (confirmado pela amostra em `docs/anexos/`): um cabeçalho, e por questão:

```
QUESTÃO 1  (Nível: Fácil)
<enunciado>
(A) ...
(B) ...
(C) ...
(D) ...
```

e no gabarito, por questão:

```
QUESTÃO 1  (Nível: Fácil)
Resposta correta: (B) ...
Justificativa geral: <explicação global>
Análise de todas as alternativas:
(A) incorreta — ...
(B) CORRETA — ...
```

`src/lib/parseColado.ts` é uma porta para TypeScript de `docs/anexos/parse_enamed.py` (o script que
produziu as 40 questões da amostra, 0 erros de validação) — **determinística, sem IA**. O brief
(§6) previa estruturação assistida por IA para texto fora deste formato; isso fica para quando
houver uma função de borda com a chave da Anthropic API no servidor (este repo ainda não tem
backend próprio além do Supabase). Hoje a Porta B resolve o formato que está de fato em uso.

## Conferência (as duas portas convergem aqui)

`src/features/importacao/RevisaoQuestoes.tsx`: lista cada questão reconhecida com validação
mecânica (`src/lib/validacaoQuestao.ts`, espelha a fração objetivável de `validate_questao.py` —
exatamente 4 alternativas, exatamente 1 correta, uc_slug no padrão, "todas/nenhuma das
anteriores" bloqueado). Questão com erro vem com a caixa de seleção desabilitada — não é possível
importá-la sem corrigir a origem. Campos de curadoria (tema, subtema, área clínica, nível de
Bloom, competências DCN 2025) são opcionais nesta tela — completáveis aqui ou depois; nenhum
bloqueia a importação (só bloqueia a transição futura `pendente` → `curado`, ver
`pendenciasParaCurar` em `validacaoQuestao.ts`).

## Onde entra no schema

`SessaoClient.importarQuestoes(rascunhos, autorId)` — um método novo no mesmo contrato do passo 2
(`src/lib/api.ts`). Implementado nos dois clientes:

- **demoClient**: acrescenta ao banco em memória (agora persistido em `localStorage` como o resto
  do estado mutável — uma questão importada numa aba aparece nas outras, mesma mecânica do
  passo 2).
- **supabaseClient**: insert direto em `questoes` + `questao_alternativas` (a policy RLS "staff
  importa" já cobre isso desde a migration 3 — não precisou de RPC nem migration nova). A coluna
  `payload` recebe o documento canônico completo, incluindo os campos que a tabela não projeta
  (`uso_em_avaliacoes`, `performance`, `auditoria`).

`NovaSessao.tsx` ganhou um seletor de fase (1ª–12ª, era fixo em 4) para que questões importadas em
qualquer fase fiquem utilizáveis para montar sessão — e um atalho para `/importacao` quando o
banco da fase escolhida está vazio.

## Verificação

Rodado de ponta a ponta com Playwright contra o build de produção (`vite preview`):

- Porta B: exemplo embutido → Estruturar → revisão mostra o enunciado certo e a alternativa (B)
  marcada como correta → confirmar → banco da 4ª fase passa de 40 para 41 questões, visível em
  Nova Sessão.
- Porta A: JSON válido (fase 5, UC nova) → Analisar → revisão → confirmar → sucesso.
- Porta A: JSON com defeito estrutural (2 alternativas, nenhuma marcada correta) → revisão mostra
  o erro mecânico, caixa de seleção correspondente vem desabilitada, botão de confirmar fica
  desabilitado com 0 selecionadas — não é possível importar dado quebrado.
- `npm run build` e `tsc -b --noEmit` limpos.

## O que falta (fora do escopo deste passo)

- Estruturação assistida por IA na Porta B, para texto fora do formato QUESTÃO/gabarito (precisa
  de função de borda com `ANTHROPIC_API_KEY` no servidor).
- Tela de curadoria dedicada (`pendente` → `curado`, histórico de edição via `questao_versoes`) —
  a conferência da importação cobre a entrada; a curadoria continuada é trabalho futuro (passo 4
  toca dashboards, que é onde isso naturalmente se encaixa).
- `supabaseClient.importarQuestoes` não testado contra projeto Supabase ao vivo (mesma ressalva do
  passo 2 — nenhum projeto provisionado ainda).
