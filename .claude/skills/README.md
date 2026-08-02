# Skills do ecossistema MED-UNIDAVI

Este diretório versiona as *skills* (agentes especializados) usadas na operação do
curso de Medicina da UNIDAVI. Elas rodam a partir de `~/.claude/skills/`; a cópia
aqui é a **fonte versionada** — é daqui que se instala e é aqui que se revisa.

## `capi-questoes-enamed`

Gera e reformula questões de múltipla escolha no padrão ENAMED/ABDC, ancoradas nos
Manuais Docentes, na Matriz de Referência do ENAMED (Portaria Inep nº 478/2025) e
nas 27 competências da DCN 2025.

| Arquivo | Papel |
|---|---|
| `SKILL.md` | As instruções do agente. |
| `ANALISE-CRITICA-2026-2.md` | Relatório da análise crítica com simulações que originou a v2.0. |
| `references/oas_med_unidavi_2026_2.json` | Banco de Objetivos de Aprendizagem — 109 SPs, 867 OAs, fases 1–8. |
| `references/taxonomia_med_unidavi_2026_2.json` | Catálogo de autoridade: UCs, competências DCN, enums. |
| `references/matriz_enamed_478_2025.json` | Matriz de Referência do ENAMED: 7 áreas, 15 competências, 6 cenários, 21 conteúdos. |
| `references/perfil_estilo_enamed.md` | Perfil empírico do item ENAMED, medido sobre as provas oficiais. |
| `references/schema_questao_med_unidavi.json` | Schema canônico da questão. |
| `scripts/validate_questao.py` | Validador executável. |

### Onde ela vive

Este diretório é `.claude/skills/` **de propósito**: o Claude Code carrega
automaticamente as skills que encontra aqui. Qualquer sessão aberta neste
repositório já usa a versão deste commit — não há passo de instalação, e não existe
uma segunda cópia para sair de sincronia. Esta é a versão de uso geral.

Para usá-la **fora** deste repositório (outra máquina, outro projeto):

```bash
cp -r .claude/skills/capi-questoes-enamed ~/.claude/skills/
```

Atenção: o validador resolve as referências por padrão glob e escolhe a de nome mais
alto (`..._2026_2` vence `..._2026_1`). Se você mantiver bancos de semestres
anteriores na pasta, confirme no cabeçalho do relatório do validador qual foi
efetivamente usada — ele imprime isso a cada execução.

### Validar um lote de questões

```bash
python3 .claude/skills/capi-questoes-enamed/scripts/validate_questao.py lote.json
```

Códigos de saída: `0` sem erros · `1` ao menos um erro · `2` referência
institucional ausente (o script se recusa a validar sem taxonomia e banco de OAs,
para não aprovar questão com UC ou objetivo inexistente).

## `avaliacao-blueprint`

Monta o blueprint de cobertura temática de uma avaliação: mapeia as questões dos
tutores contra os Objetivos de Aprendizagem (OAs) de uma UC, identifica lacunas e
redundâncias, e orienta a `capi-questoes-enamed` a gerar questões para as lacunas.
Depende diretamente dos bancos da `capi-questoes-enamed` acima — por isso as duas
skills precisam ser mantidas juntas e atualizadas na mesma migração de semestre.

| Arquivo | Papel |
|---|---|
| `SKILL.md` | As instruções do agente. |
| `references/estrutura_oas.md` | Como navegar o banco de OAs e a taxonomia. |
| `references/leitura_arquivos.md` | Como ler provas em .docx/.xlsx (export do Forms). |
| `references/criterios_diagnostico.md` | Critérios de status de cobertura e redundância. |
| `references/dimensoes_analise.md` | Bloom, competência DCN, dificuldade e Matriz ENAMED 478/2025. |
| `scripts/gerar_matriz_pdf.py` | Gerador de PDF da matriz de cobertura. |

Mesma regra da `capi-questoes-enamed`: resolve os bancos de OAs/taxonomia por
padrão glob (nunca por nome fixo de semestre) e imprime qual arquivo foi usado.

Para usá-la fora deste repositório:

```bash
cp -r .claude/skills/avaliacao-blueprint ~/.claude/skills/
```
