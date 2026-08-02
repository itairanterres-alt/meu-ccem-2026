# Limitações conhecidas — capi-questoes-enamed v2.0

Registradas para transparência e priorização. Referenciadas pela §15 da Skill.

## Decisões abertas, que dependem do coordenador

- **Posição do gabarito: convenção inconsistente no ecossistema.** A Skill grava a
  correta sempre na letra A e delega a randomização à emissão (backend). O banco de
  provas reais já adequadas (914 itens de ENAMED/Revalida/TP/simulados) armazena a
  posição **já randomizada** (A 224 · B 234 · C 226 · D 230), e o ENAMED real é
  uniforme. Ou seja: hoje convivem duas convenções no mesmo ecossistema. Além disso,
  "sempre A" transforma a randomização da emissão num **ponto único de falha** — se
  ela não rodar, um lote inteiro sai com gabarito A — e enviesa a curadoria humana,
  que sempre lê a correta na primeira posição.
  *Recomendação: unificar. Randomizar na geração e gravar a letra é o caminho que
  alinha com o banco maior e com a prova real. A mudança tem alcance fora da Skill
  (telas de curadoria, app, relatórios), por isso não foi feita unilateralmente.*
  O validador sinaliza a concentração (`GABARITO_CONCENTRADO`).

## Cobertura e dados

- **Fases 9–12 sem banco de OAs.** O internato usa formato APC/Ten Cate, sem SPs.
  Nessas fases a ancoragem é por ementa da UC, área da Matriz 478 e competência DCN
  — não por objetivo de aprendizagem.
- **Um OA da 4ª fase depende de conferência docente.** `med_unidavi_f04_uc03_sp02_oa08`
  ("Caracterizar as instituições envolvidas na prevenção da poluição ambiental...")
  foi recuperado de uma quebra de página do Manual, onde a extração anterior o havia
  perdido. Localizado e conferido no texto do Manual 2026.2, mas vale confirmação.
- **Numeração impressa divergente em 3 SPs** (f02/uc01/sp01, f05/uc01/sp01,
  f05/uc02/sp02): o Manual repete ou salta números de OA. O banco preserva o número
  impresso em `numero_impresso` e usa a posição ordinal para o slug. Vale sinalizar
  ao NDE como erro de digitação dos Manuais.
- **Mapeamento área-eixo das 27 competências DCN 2025 é heurístico** — leitura
  textual (atenção 18, gestão 7, educação 2), pendente de validação pelo NDE.
- **Mapeamento de área clínica por UC** — UCs do ciclo básico marcadas genericamente
  como `ciclo_basico`.
- **`urgencia_emergencia` não é área da Matriz 478/2025.** Permanece como tag
  institucional interna; ao declarar `area_enamed`, distribua o item entre Clínica
  Médica, Cirurgia Geral ou Pediatria conforme o caso.

## Verificação

- **A verificação por máquina é parcial — e o que ela não cobre é o que mais
  importa.** O `validate_questao.py` cobre schema, ABDC, termos proibidos, extensão,
  existência de UC/SP/OA, forma do completamento e checagens de lote. **Não cobre**:
  o teste recíproco da vinheta, a correção factual do gabarito, a plausibilidade
  real dos distratores e a coerência entre o conteúdo do OA e a ementa da UC. Esses
  quatro exigem leitura humana. Uma questão pode passar com zero avisos e ainda ser
  uma vinheta decorativa com gabarito errado.
- **O modo padrão (Markdown) não roda o script.** Em uso conversacional, nenhuma
  verificação automática acontece. Para lote grande, monte o JSON internamente e
  rode o validador mesmo que a entrega seja em Markdown.
- **Não há detecção de similaridade semântica entre questões.** A checagem de
  duplicidade compara só a abertura literal do enunciado; dois itens que perguntam a
  mesma coisa com palavras diferentes passam.

## Escopo

- **TRI Rasch não calculado.** `dificuldade_tri_b` e `discriminacao_tri_a` ficam
  `null`; o backend popula quando `n_respostas_avaliativo >= 50`.
- **Banco de Imagens não acessível pela Skill.** `imagens_anexadas` sai como `[]`;
  a inclusão é ato manual do docente curador. `alt_text` é obrigatório por
  acessibilidade (LGPD/WCAG).
- **Vinheta multi-imagem com sequência temporal** (ECG antes/depois) é suportada
  pelo schema, mas a Skill gera apenas a referência textual.
- **Modos v2 não implementados** — variação a partir de vinheta-mãe, conversão
  dissertativa→ABDC, geração automática a partir de OA, conjunto temático para TBL.
