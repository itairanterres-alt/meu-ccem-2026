# Escopo deste repositório

`meu-ccem-2026` é o aplicativo do **12º Congresso Catarinense de Endocrinologia
e Metabologia (CCEM 2026)** — realização SBEM-SC, 23 e 24 de outubro de 2026,
Expoville, Joinville-SC.

É um projeto **institucional da SBEM-SC**. Não é repositório de uso geral, não é
base padrão de trabalho e não deve receber conteúdo de outros projetos.

## Fora de escopo — não trazer para cá

- **MED-UNIDAVI / Capi** — banco de questões, ENAMED, TECM, Objetivos de
  Aprendizagem, UCs, Manuais Docentes, blueprint de avaliação, skills
  `capi-questoes-enamed` e `avaliacao-blueprint`. Esse ecossistema vive no
  repositório `Capi-MedUnidavi`.
- Qualquer material docente, de avaliação discente ou de coordenação de curso.
- Projetos irmãos do congresso que têm repositório próprio (submissão de
  pôsteres, anais com DOI/ISBN).

Se uma tarefa pedir algo desses domínios, **não implemente aqui**: diga que o
repositório correto é outro.

## Dentro de escopo

Programa vivo do congresso, bios de palestrantes, briefings pré-sessão, quizzes
preparatórios do próprio congresso, mapa do Expoville, captura individual,
dados em `ccem-data.js` e as telas em `ccem-*.jsx` / `index.html`.

## Convenções

- Frontend vanilla, standalone, sem build. Não introduzir bundler.
- Conteúdo de bios, briefings e quizzes está em **modo curadoria**: revisão pela
  Comissão Científica antes do evento. Não afirmar que conteúdo gerado está
  validado.
- Pontos de integração futura estão marcados com `// TODO: integrar com API real`.

Coordenação: Dr. Itairan da Silva Terres — Comissão Científica CCEM 2026.
