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

> ⚠️ Estes NÃO são o `SCHEMA_OUTPUT` (contrato do gerador institucional, 1º item da §10), que ainda não chegou. São a amostra real (2º item), para calibrar a estruturação de texto colado.

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

## Mapeamento para o schema

| Campo do schema | Origem |
|---|---|
| `enunciado` | parágrafos entre `QUESTÃO n` e a primeira alternativa (doc de questões) |
| `vinheta` | não separado na origem — vem embutido no enunciado (ver observação 1) |
| `alt_a..alt_d` | linhas `(A)..(D)` do doc de questões |
| `gabarito` | letra em `Resposta correta:` do gabarito |
| `just_a..just_d` | linhas `(A)..(D)` da "Análise de todas as alternativas" |
| `justificativa_geral` | linha `Justificativa geral:` (**campo novo no schema**) |
| `nivel` | `(Nível: Fácil\|Média\|Difícil)` (**campo novo no schema** → enum `facil\|media\|dificil`) |
| `fase`, `uc`, `sp` | 4ª fase (informado pelo docente); UC e SP do cabeçalho |
| `oa_tags` | **ausente na origem** (ver observação 3) |

## Observações que alimentaram decisões de schema

1. **Não há vinheta separada.** Nas questões clínicas o caso vem no corpo do enunciado ("Mulher de 41 anos..."); nas conceituais o enunciado é direto. O campo `vinheta` do schema fica nullable e, nesta amostra, sempre null — o texto do caso está em `enunciado`. Se o `SCHEMA_OUTPUT` separar vinheta de comando, ajustamos a extração.
2. **A alternativa já traz um descritor.** Ex.: `(A) RAS, proto-oncogene ativado por mutações de ganho de função.` — a alternativa embute uma mini-explicação, e o gabarito ainda traz a justificativa completa em `just_a`. São campos distintos; ambos preservados.
3. **Nenhum OA nos documentos.** A única âncora curricular é a "Matriz de Referência Comum (Portaria INEP nº 478/2025)", citada nas instruções — não há tag de OA por questão. Confirma a pergunta em aberto: a fonte dos OAs por SP (§8) precisa vir de outro lugar. `oa_tags` fica `{}` na importação até essa fonte existir.

## Observação de conteúdo para os autores (não é bug do app)

Distribuição do gabarito nas 40 questões: **A=8, B=29, C=3, D=0**. Nenhuma questão tem D como resposta; 72,5% são B. Uma chave tão enviesada permite acerto por padrão (marcar sempre B) e reduz o valor diagnóstico — vale rebalancear na curadoria. O app **não** altera conteúdo; fica como sinalização para a coordenação/autores.
