# O que fazer, na prática

A auditoria acabou. Este arquivo é a resposta operacional: o que já está pronto, o
que falta, quem faz, e em que ordem. Nada aqui é diagnóstico novo — é execução.

---

## Estado atual

| Item | Estado |
|---|---|
| Skill `capi-questoes-enamed` **v2.0** | ✅ atualizada, instalada em `~/.claude/skills/` e publicada |
| Banco de OAs **2026.2** (109 SPs, 867 OAs) | ✅ pronto e em uso pela skill |
| Matriz ENAMED 478/2025 como referência | ✅ integrada |
| Perfil empírico do item ENAMED | ✅ medido e integrado (§4a da SKILL.md) |
| Validador v2.0 (+ correções de precisão) | ✅ em uso |
| Ferramentas de manutenção (`banco.py`) | ✅ **novas** — id, migrar, tags, refs |
| Três auditorias | ✅ concluídas |

**A skill em si está pronta para uso hoje.** O que falta é do ecossistema em volta
dela — e é lá que estão as falhas que você percebeu.

---

## Uma correção honesta antes do plano

Eu disse na conversa que as fases 4 e 5 estavam "a uma migração de distância", com
560 questões prontas no seed do app. **Isso estava otimista demais.** Rodando a
migração de verdade:

```
migradas: 839
   839  area_clinica deduzida da taxonomia
   839  PENDENTE de classificação: tema
   839  PENDENTE de classificação: nivel_bloom
   839  PENDENTE de classificação: competencia_dcn_2025
   prontas para validar: 0 de 839
```

Trocar o envelope é automático. Mas `tema`, `nivel_bloom` e `competencia_dcn_2025`
são obrigatórios no schema e estão nulos em 839 de 839 — e são **julgamento sobre o
conteúdo**, não dedução. A ferramenta se recusa a inventá-los; é o que separa migrar
de fabricar. A auditoria que reportou "818/839 passam" tinha preenchido esses
campos antes de medir.

Então o desbloqueio das fases 4 e 5 é: **migração automática + um passo de
classificação**. O passo de classificação é exatamente o que a skill faz bem — pode
ser rodado em lote por ela, com curadoria docente por amostragem.

---

## Ordem de execução

### Bloco 1 — Fundação (sem isto, o resto não se sustenta)

**1.1 Congelar o schema como contrato.** *Owner: você / quem mexe no pipeline.*
Dois estágios (`aplicar_especialidade.py:77`, `aplicar_matriz.py:53`) reescrevem o
schema em disco, com definições incompatíveis do mesmo campo. Enquanto isso existir,
"o banco valida" não significa nada.
- Tornar `skills/capi-questoes-enamed/references/schema_questao_med_unidavi.json` a
  única cópia canônica; as outras viram link ou cópia gerada.
- Remover as duas escritas; se um estágio precisa de campo novo, ele altera o schema
  canônico **no mesmo commit**, por mão humana.
- Rodar `banco.py refs --comparar <outras cópias>` no CI para pegar divergência.

**1.2 Fazer os scripts falharem alto.** *Owner: quem mexe no pipeline.*
22 dos 23 nunca retornam código de erro, e um `except Exception` já engoliu uma
questão inteira. Trocar `except Exception: pass` por log + `sys.exit(1)`.

**1.3 Adotar `id_questao`.** *Owner: eu, se você quiser — a ferramenta já existe.*
```bash
python3 skills/capi-questoes-enamed/scripts/banco.py id <banco>.json --escrever
```
UUIDv5 determinístico sobre o conteúdo normalizado. Rodado sobre o seed do app,
detectou sozinho os **40 grupos de reingestão** que a auditoria havia encontrado.
Sem isso, correção de docente não se propaga entre acervos e reingestão não é
detectável.

**1.4 Versionar a régua.** *Owner: processo.*
`banco.py refs` emite o carimbo `capi-questoes-enamed 2.0 · schema 8649d7c0104c`.
Toda medição de qualidade do banco deve registrar esse carimbo — durante esta
auditoria o mesmo banco passou de 168 para 161 reprovações porque o validador mudou,
sem uma linha de questão ser editada.

### Bloco 2 — Régua única

**2.1 Eliminar `validacaoQuestao.ts` como *gate*.** *Owner: quem mantém o app.*
Ele não reprova nenhuma das 1.753 questões que o validador canônico reprova, e tem
dois sinais invertidos: trata `assinale` como **prova de qualidade** (o canônico
bloqueia — são os mesmos 160 itens) e avisa quando o gabarito **não** é A (o canônico
avisa quando concentra). Caminho: gerar a validação do JSON Schema via `ajv`, ou
chamar o validador Python na importação. Manter o TS só para feedback de UI, nunca
como decisão de aceitação.

**2.2 Decidir a convenção de gabarito.** *Owner: **você** — está em aberto desde a v2.0.*
Hoje a skill grava a correta sempre em A; o banco de 914 itens reais armazena
posição randomizada (A 224 · B 234 · C 226 · D 230); o app avisa quando não é A.
Três convenções, três lugares. **Recomendo randomizar na geração e gravar a letra** —
alinha com o banco maior e com o ENAMED real, e elimina o ponto único de falha da
randomização na emissão. Não fiz porque mexe em backend e telas de curadoria.

### Bloco 3 — Cobertura (o que o aluno sente)

**3.1 Migrar o seed do app.** *Owner: eu (automático) + skill (classificação).*
```bash
python3 skills/capi-questoes-enamed/scripts/banco.py migrar seed.json \
        --perfil sessao-questoes -o migrado.json
```
Depois, rodar a skill em lote sobre as 839 para preencher `tema`, `nivel_bloom` e
`competencia_dcn_2025`, com curadoria docente por amostragem. Ganho: **fases 4 e 5
saem do zero**.

**3.2 Desacoplar `fase_alvo` de `area_clinica`.** *Owner: você (é critério, não código).*
Hoje `fase_alvo` é uma tabela de conversão da área — por isso as fases 1, 3, 5 e 7
são impossíveis de preencher, mesmo depois de 3.1. Enquanto uma questão de pediatria
for automaticamente "9ª fase", metade do curso fica sem banco. Decidir: a fase é
atribuída pelo conteúdo do item (ancorado em OA/SP) ou continua derivada?

**3.3 Fechar as fases 1, 3 e 7.** Depois de 3.2, gerar com a skill ancorando nos OAs
2026.2 dessas fases — que agora existem e estão corretos.

### Bloco 4 — Qualidade do que entra

**4.1 Porteiro por procedência.** *Owner: quem mexe no pipeline.*
Taxa de defeito por fonte: item reescrito pela fábrica 3%, ENAMED oficial 6%,
Revalida 17%, `.docx` institucionais 18%, TP 2022 25%, TPMed 2025 28%, Simulados
2026 31%. Gravar `qualidade_origem` e `defeitos_herdados` no item, para a curadoria
priorizar. Um simulado com 31% de defeito não pode entrar com o mesmo rótulo do
ENAMED.

**4.2 Corrigir o prompt de adaptação.** *Owner: eu, quando você apontar onde ele vive.*
O estágio de adaptação produz os melhores itens (3% de defeito) **e** converte 60%
de completamento em 87% de pergunta direta — descaracteriza o padrão ENAMED que
deveria preservar. É a mesma causa que corrigi na §4a da SKILL.md.

**4.3 Estender a adaptação** às fontes de pior taxa. Cobre hoje 16% do acervo e é o
estágio que mais agrega.

**4.4 Normalizar tags.** *Owner: eu — ferramenta pronta.*
```bash
python3 skills/capi-questoes-enamed/scripts/banco.py tags <banco>.json \
        --escrever --vocabulario vocab.json
```
Medido: 2.754 tags para 914 questões, 299 conceitos com grafia concorrente, **73%
das questões afetadas**. Acrescentar `pattern` ao schema para não regredir.

### Bloco 5 — Enxugar o pipeline (por último, de propósito)

**23 scripts → 11 arquivos, ~20 → 8 estágios.** Provado por reprodução que dá o
mesmo resultado: rodando o montador genérico sobre as entradas dos dedicados,
Simulados sai 84/84 idêntico e ENAMED 90/90. Duplicação evitável: 517 de 4.748
linhas (10,9%).

Vem por último porque **encolher não conserta nada sozinho**: se o schema continuar
sendo escrito pelo pipeline e os scripts continuarem saindo com código 0 em falha,
os 11 scripts produzem as mesmas falhas que os 23.

---

## O caminho mais curto, se você quiser só um próximo passo

1. **1.1 + 1.2** (congelar o schema, falhar alto) — sem isso nenhuma medição vale.
2. **2.2** (decidir a convenção de gabarito) — é a única coisa que depende só de você
   e está bloqueando alinhamento em três lugares.
3. **3.1** (migrar o seed) — é o maior ganho visível para o aluno.

Diga qual e eu executo a parte que é código.
