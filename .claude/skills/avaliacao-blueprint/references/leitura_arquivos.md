# Leitura de arquivos de questões

## .docx (uma prova formatada)
Use `extract-text arquivo.docx`. As questões vêm numeradas; identifique enunciado, alternativas e (se houver) gabarito e sugestão de resposta das discursivas.

## .xlsx (export do Google Forms — respostas)
Estrutura típica de "respostas ao formulário":
- Colunas 0–3: metadados (Carimbo de data/hora, E-mail, Pontuação, Estudante).
- Coluna 4 em diante: uma coluna por item. O cabeçalho da coluna é o enunciado completo da questão.

```python
import pandas as pd
df = pd.read_excel(caminho)
cols = list(df.columns)[4:]  # itens
```

### Distinguir objetiva de discursiva
Não conte por comprimento do cabeçalho. Olhe as RESPOSTAS dos alunos numa amostra:
- Objetiva: respostas curtas e repetidas (começam com "(A)".."(E)", ou V/F, ou poucos valores únicos).
- Discursiva: respostas longas e quase todas únicas.
- Coluna vazia (n=0 respostas): item que estava no gabarito mas foi RETIRADO da versão aplicada — sinalize, não ignore.

### Pontuação e discursivas — cuidado
A coluna "Pontuação" do Forms soma o que o Forms corrige automaticamente. Discursivas exigem correção manual:
- Se a pontuação máxima observada bate com o total de itens objetivos apenas, as discursivas provavelmente NÃO estão computadas.
- Se a máxima bate com o total geral (objetivas + discursivas), então foram corrigidas e lançadas.
- NUNCA conclua sobre desempenho sem resolver essa ambiguidade. Na dúvida, pergunte ao docente ou some os pontos das objetivas contra o gabarito para checar.

## Filesystem MCP (Claude Desktop)
Arquivos com acentos no nome podem falhar na transferência. Peça o caminho exato como aparece no Explorer, ou nome sem acentos. Arquivos grandes (PPTX pesado) podem dar timeout — tente um de cada vez. `.ppt` legado: converta com `libreoffice --headless --convert-to pptx` antes de extrair.
