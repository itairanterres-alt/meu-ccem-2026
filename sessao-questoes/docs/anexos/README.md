# Anexos — amostra real e calibração da Porta B

Amostra da §10 do brief: banco ENAMED da **UC I (Proliferação Celular), 4ª fase**, SP1 e SP2, com gabaritos. Usada para calibrar a importação por texto colado (Porta B, §6).

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| `UC1_SP1_Questoes_ENAMED.docx` | 20 questões SP1 (enunciado + alternativas A–D) |
| `UC1_SP1_Gabarito_ENAMED.docx` | Gabarito comentado SP1 |
| `UC1_SP2_Questoes_ENAMED.docx` | 20 questões SP2 |
| `UC1_SP2_Gabarito_ENAMED.docx` | Gabarito comentado SP2 |
| `UC1_fase4_extraido.json` | As 40 questões reestruturadas no schema de `questoes` (0 erros de validação) |
| `parse_enamed.py` | Parser que produziu o JSON — referência de mapeamento para a Porta B |

| `UC1_fase4_canonico.json` | As 40 questões no formato **canônico** (array de alternativas, `uc_slug`, correta na letra autoral) — dado de teste do passo 2 |
| `schema-institucional/` | O **SCHEMA_OUTPUT** e fontes de verdade curriculares (ver abaixo) |
| `tokens-unidavi.{md,js}` | Tokens visuais UNIDAVI (3º anexo da §10) |

## `schema-institucional/` — o contrato canônico (1º anexo da §10)

Estava dentro da skill `capi-questoes-enamed`. **Fonte de verdade; o anexo prevalece (§10).**

| Arquivo | O que é |
|---|---|
| `schema_questao_med_unidavi.json` | **SCHEMA_OUTPUT** — JSON Schema canônico da questão (v2026.1/v3.1) |
| `oas_med_unidavi_2026_1.json` | 810 OAs por SP, fases 1–8 (fonte para §8; **sendo atualizado**) |
| `taxonomia_med_unidavi_2026_1.json` | UCs, 27 competências DCN 2025, enums fechados |
| `exemplo_questao_preenchida.json` | Exemplo canônico com vinheta (validado, 0 erros) |
| `exemplo_questao_enunciado_direto.json` | Exemplo conceitual sem vinheta (`texto_base: null`) |
| `validate_questao.py` | Validador executável institucional (requer `jsonschema`) |
| `SKILL_VERSION` | Versão da skill geradora (1.3) |

O schema do app (`supabase/migrations/`) foi realinhado a este contrato — ver `docs/revisao-schema.md`, seção "Reconciliação com o SCHEMA_OUTPUT".

## Formato de origem (o que a Porta B precisa engolir)

**São dois documentos por SP, não um.** O casamento é pelo número da questão:

- **Documento de questões:** cabeçalho (`UC` na 1ª linha, `SP` na 2ª), instruções, e então, por questão:
  ```
  QUESTÃO 1  (Nível: Fácil)
  <enunciado, um ou mais parágrafos>
  (A) <alternativa A>
  (B) <alternativa B>
  (C) <alternativa C>
  (D) <alternativa D>
  ```
- **Documento de gabarito:** por questão:
  ```
  QUESTÃO 1  (Nível: Fácil)
  Resposta correta: (B) ...
  Justificativa geral: <explicação global>
  Análise de todas as alternativas:
  (A) incorreta — <justificativa A>
  (B) CORRETA — <justificativa B>
  (C) incorreta — <justificativa C>
  (D) incorreta — <justificativa D>
  ```

## Mapeamento para o schema (canônico)

| Campo canônico | Origem no .docx |
|---|---|
| `enunciado` | parágrafos entre `QUESTÃO n` e a primeira alternativa (doc de questões) |
| `texto_base` | `null` — sem vinheta separada; o caso vem no enunciado (ver observação 1) |
| `alternativas[].texto` | linhas `(A)..(D)` do doc de questões |
| `alternativas[].correta` | `true` na letra de `Resposta correta:` do gabarito |
| `alternativas[].justificativa` | linhas `(A)..(D)` da "Análise de todas as alternativas"; na correta, prefixada pela "Justificativa geral" (ver observação 4) |
| `dificuldade_editorial` | `(Nível: Fácil\|Média\|Difícil)` → `facil\|medio\|dificil` |
| `fase_alvo`, `uc_slug` | 4ª fase; UC confirmada na taxonomia = `med_unidavi_f04_uc01_proliferacao_celular` |
| `sp_referencia` | **null** — SP da amostra não bate com a taxonomia 2026.1 (ver revisao-schema §perguntas) |
| `tema`, `area_clinica`, `nivel_bloom`, `competencia_dcn_2025`, `oa_slugs` | **ausentes na origem** — docente completa na curadoria (§6); não inventados (obs. 3) |

## Observações que alimentaram decisões de schema

1. **Não há vinheta separada.** O caso vem no corpo do enunciado ("Mulher de 41 anos…"); `texto_base` fica null nesta amostra.
2. **A alternativa já traz um descritor** (ex.: `(A) RAS, proto-oncogene…`) além da justificativa completa no gabarito — ambos preservados (`alternativas[].texto` e `.justificativa`).
3. **Nenhum OA/competência/área nos documentos.** A única âncora é a Matriz INEP 478/2025. Porta B (.docx) produz questão **parcial**; area_clinica/nivel_bloom/competencia/OA/SP são completados pelo docente na tela de conferência (§6). Não inventados (§4).
4. **"Justificativa geral" dobrada na correta.** O schema canônico não tem esse campo; para não perder o dado, o texto é prefixado na `justificativa` da alternativa correta na importação.

## Observação de conteúdo para os autores (não é bug do app)

Distribuição do gabarito nas 40 questões: **A=8, B=29, C=3, D=0**. Nenhuma questão tem D como resposta; 72,5% são B. Uma chave tão enviesada permite acerto por padrão (marcar sempre B) e reduz o valor diagnóstico — vale rebalancear na curadoria. O app **não** altera conteúdo; fica como sinalização para a coordenação/autores.
