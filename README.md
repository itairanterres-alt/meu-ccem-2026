# Meu CCEM 2026

Aplicativo web, pensado para celular, do **12º Congresso Catarinense de
Endocrinologia e Metabologia**.

- 23 e 24 de outubro de 2026
- Expoville · Rua XV de Novembro, 4315 · Joinville/SC
- Realização: SBEM-SC · Organização: Promotes Eventos

Projeto institucional da SBEM-SC. Escopo e convenções em [`CLAUDE.md`](CLAUDE.md).

## O que faz

**Programa vivo**
- Selo "Agora" calculado pelo relógio, no fuso de Joinville (UTC−3).
- O Programa abre no dia certo, rolado até a sessão em andamento.
- Na Home: Agora / A seguir durante o evento; contagem regressiva antes;
  "Congresso encerrado · baixe seu caderno" depois.

**Minhas sessões**
- Marcar qualquer sessão, satélites inclusive.
- Bloco "Minhas sessões" na Home e filtro "Só marcadas" no Programa.
- Exportação para a agenda do celular (`.ics`, fuso America/Sao_Paulo), de uma
  sessão ou de todas as marcadas.

**Caderno** — funciona sem internet e sem a IA
- "Anotar" (na sessão) ou "Nova nota": escrever e/ou fotografar e salvar na
  hora, vinculado à sessão. Editar e excluir.
- A foto fica guardada no aparelho (IndexedDB), junto da nota.
- "Resumir com IA" é opcional e fica separado do texto original.
- "Marcar como dúvida" no editor, com filtro "Dúvidas".
- Notas de sessão satélite levam o selo "Sessão patrocinada por X".
- Busca no caderno ("Buscar nas notas e fotos"): no aparelho, sem internet e
  sem custo. Procura no texto, nas respostas da IA e no índice das fotos.
- O app avisa se não conseguiu salvar (armazenamento cheio ou bloqueado).
- "Exportar / imprimir": página para ler ou salvar como PDF, com fotos.
- "Backup": arquivo `.json` com notas, fotos e marcações, restaurável em outro
  aparelho. Restaurar soma ao que existe; não apaga nada.
- Faixa de lembrete para exportar, de 24/10 às 16h até 31/10.

**Instalar na tela inicial**
- Convite discreto na Home, só no celular e fora do app instalado: a partir do
  2º uso (ou da primeira marcação/nota), depois da apresentação do assistente.
  Fechado, não volta; a opção fica em Info ("Instalar o app na tela inicial").
- Android/Chrome: botão "Instalar" abre o diálogo nativo. iPhone: passo a passo
  Compartilhar → Adicionar à Tela de Início (a Apple não permite o diálogo).
- No iPhone, o app instalado tem memória separada do Safari e começa vazio: o
  passo a passo orienta a fazer o Backup antes, quando já há dados.
- O assistente também ensina ("Como instalo o app no celular?").

**Foto do slide** — no cartão de uma nota com foto (usa a IA)
- "Perguntar sobre o slide": atalhos (explicar gráfico/tabela, raciocínio, o
  que o resultado permite concluir, leitura crítica, tabela em texto,
  fluxograma passo a passo, transcrever e explicar siglas, sugerir perguntas ao
  palestrante) ou pergunta livre. A resposta vem em blocos — No slide /
  Explicação adicional (não está no slide) / Limites da interpretação — e
  declara a fonte. Fica guardada na nota: repetir o atalho não gera novo custo.
  "Aprofundar" pede uma versão mais detalhada. "Ouvir em voz alta" usa a voz do
  próprio aparelho.
- "Encontrar o artigo": lê a referência do slide (editável), busca no PubMed e
  diz se a correspondência é **confirmada**, **possível** ou **não
  localizada**. Botões para PubMed, revista (DOI) e PMC; "PDF disponível" só
  aparece quando o Unpaywall indica um PDF aberto de verdade. Vinculado à nota,
  o resumo do PubMed passa a enriquecer as respostas (o texto integral não é
  lido).
- "Organizar com IA" (no caderno, com consentimento uma vez): gera título e
  palavras-chave das fotos para a busca. Usa o modelo mais barato (Haiku).

**Info**
- Organização, horários da secretaria, certificados, contato e site oficial.
- Item "Trabalhos científicos (e-pôster)", que abre a página externa dos
  trabalhos. O app não hospeda trabalhos.

**Assistente CCEM (beta)** — IA (Claude, da Anthropic) em três modos:
- **Anotação:** foto do slide ou texto → mensagem-chave em até 2 frases, até 5
  pontos e a referência só se estiver visível no slide.
- **Busca:** sessões do programa, com atalho para cada uma.
- **Concierge:** dúvidas práticas, respondidas só a partir da FAQ (em
  `api/assistente.js`). O que não está na FAQ vai para a secretaria.

Abre pela aba Assistente ou pelo botão "8" (Home, Programa, Info e Sessão), num
painel que sobe sobre a tela atual. O "8" faz gestos breves só em momentos
definidos (primeira apresentação, toque, resposta em preparo com o painel
fechado, resposta pronta) e fica parado em repouso. Desligar tudo:
`CCEM_MOVIMENTO_ASSISTENTE = false` em `v4/ccem-assistente.jsx`; "Reduzir
movimento" do aparelho também desliga. Toda resposta termina com "Gerado por IA —
confira na fonte" e pode ser salva no Caderno.

## Privacidade

Não há login nem cadastro. Marcações e notas ficam no `localStorage` do
aparelho, e as fotos das notas no IndexedDB; nada disso é enviado a servidor.

O Assistente e os recursos da foto do slide são a exceção, e só quando usados:
a pergunta e a foto (reduzida no aparelho a 1600 px) vão para `api/`, que as
repassa à Anthropic (EUA) e devolve só o texto. Na busca do artigo, só o texto
da referência vai ao PubMed (NCBI) e o DOI ao Unpaywall. O app não grava
conteúdo no servidor: nem disco, nem Blob. O log do Vercel recebe só uma linha
numérica por chamada (função, modelo, tokens, custo estimado), nunca a
pergunta, a foto ou a resposta. A retenção do lado da Anthropic segue a política dela. A conversa fica só na memória da aba. Quem limpar o navegador ou trocar de
aparelho perde as notas: por isso o app oferece exportação e backup. O app
fica disponível até 31/12/2026.

## Testar como se fosse o dia do evento

Acrescente `?agora=` ao endereço, com data e hora de Joinville:

```
https://<endereço-do-app>/?agora=2026-10-23T16:20
https://<endereço-do-app>/?agora=2026-10-24T11:50#/programa
```

O app passa a se comportar como se fosse aquele momento: selo "Agora", Home,
rolagem do Programa, faixa de lembrete do PDF. Serve só para teste; sem o
parâmetro, vale o relógio do aparelho.

## Acessibilidade

- Texto com no mínimo 12 px.
- Alvos de toque com no mínimo 44 × 44 px.
- Campos de digitação com 16 px, para o iPhone não ampliar a tela ao tocar.
- Ícones de linha, sem emojis.

## Assistente: configuração no Vercel

| Variável | Onde | Valor |
|---|---|---|
| `ANTHROPIC_API_KEY` | Settings → Environment Variables (Preview e Production) | a chave da Anthropic |
| `ANTHROPIC_MODEL` | opcional | padrão `claude-sonnet-5-5` |
| `CONTATO_TECNICO_EMAIL` | Preview e Production | e-mail de contato exigido pelo PubMed e pelo Unpaywall. Sem ele, não há botão "PDF disponível" |
| `NCBI_API_KEY` | opcional | chave gratuita do NCBI; aumenta o limite de consultas ao PubMed |

**Nunca escrever a chave no código: o repositório é público.** Sem a chave, o
app funciona normalmente e o Assistente mostra "Assistente em fase de testes —
disponível em breve". Para desligar a IA em emergência: apagar a variável e
republicar.

Limites por pessoa (aproximados; contados em memória em cada instância do
Vercel): Assistente, 20 perguntas por hora; foto do slide, 15 perguntas por
dia; busca de artigo, 30 por dia; organizar fotos, 40 por dia. Cada resposta
tem até 20 s. O texto fixo (regras, programa e FAQ) vai com cache, o que
barateia cada chamada. O teto real de gasto é o crédito na Anthropic.

**Acompanhar o consumo:** no Console da Anthropic (Usage / Cost) ou nos logs do
Vercel, procurando linhas `{"uso":"slide",...,"usd":...}` — uma por chamada,
com a função (`assistente`, `slide:explicar`, `referencia`, `organizar`…).

A FAQ está em `api/assistente.js` (`const FAQ`). Os itens marcados
`TODO: confirmar com Promotes` não são respondidos até serem preenchidos.

## Onde fica o quê

```
index.html        shell, estilos e ordem de carregamento
api/assistente.js função do Vercel que conversa com a IA (regras, FAQ, limites)
api/slide.js      perguntas sobre a foto do slide e organização das fotos
api/referencia.js lê a referência do slide e busca no PubMed / Unpaywall
api/_comum.js     módulo comum (limites, registro de consumo); não é endpoint
v4/               A VERSÃO VIVA — é daqui que o index.html carrega
  ccem-data.js    TODO o conteúdo: programa, palestrantes, fuso, .ics, link do e-pôster
  *.jsx           código-fonte das telas (ccem-caderno.jsx: notas, fotos e backup;
                  ccem-slide.jsx: perguntas sobre o slide e artigo citado;
                  ccem-assistente.jsx: assistente e botão "8")
  *.js            saída compilada (é o que o navegador carrega)
vendor/           React e fontes, hospedados localmente
package.json      só a dependência da função (@anthropic-ai/sdk)
vercel.json       tempo máximo das funções e inclusão de v4/ccem-data.js
sw.js             service worker (cache e funcionamento offline)
build.sh          compila os .jsx
v3/               versão 3 congelada. Histórico apenas
```

## Como atualizar

**Conteúdo** (programa, palestrantes, link do e-pôster). O Assistente lê o
programa do mesmo arquivo; não há cópia a atualizar.

1. Editar `v4/ccem-data.js` no GitHub (botão de lápis).
2. Incrementar `CACHE_VERSION` em `sw.js`.
3. Commit. O Vercel publica em segundos; o endereço não muda.

`ccem-data.js` é JavaScript puro, sem JSX: não precisa compilar.

Se o e-pôster não acontecer, trocar em `ccem-data.js`:

```js
const LINK_EPOSTER = null;
```

e o item some da tela Info.

**Código das telas** (qualquer `.jsx`):

1. Editar o `.jsx`.
2. Rodar `./build.sh` (requer Node).
3. Commitar o `.jsx` **e** o `.js` gerado.
4. Incrementar `CACHE_VERSION` em `sw.js`.

Sem o passo do `CACHE_VERSION`, os celulares continuam mostrando a versão
antiga guardada em cache.

## Stack

- React 18 sem framework, JSX pré-compilado com esbuild, sem bundler.
- Fontes DM Sans e JetBrains Mono hospedadas localmente.
- Hospedagem no Vercel, com deploy automático pelo GitHub.
- IA: funções serverless Node no Vercel (`api/`), SDK oficial
  `@anthropic-ai/sdk`, modelo `claude-sonnet-5-5`; `claude-haiku-4-5` para
  ler referências e organizar fotos. PubMed (E-utilities) e Unpaywall para os
  artigos.

### Nada vem de CDN

React, fontes e ícones são servidos do próprio domínio. O app precisa abrir no
Expoville com a rede saturada; depender de `unpkg` ou Google Fonts significaria
não abrir se esses servidores estiverem lentos ou bloqueados.

### Funciona offline

`sw.js` guarda o app e a grade em cache. Depois da primeira visita, o app abre
sem rede. `manifest.json` permite instalá-lo na tela inicial.

Cada publicação é uma versão fechada: os arquivos essenciais entram todos ou a
versão nova é descartada (a anterior continua). A versão nova não entra no meio
do uso: o app mostra "Nova versão do app disponível · Atualizar" e troca no
toque, ou quando o app é fechado e aberto de novo. Por isso **todo** deploy
precisa incrementar `CACHE_VERSION` — sem isso, quem já abriu o app continua
na versão anterior.

A data em `CCEM_PROGRAMA_CONFERIDO` (`v4/ccem-data.js`) aparece no fim do
Programa: atualizar a cada conferência com o site oficial.

## Como rodar localmente

```bash
python3 -m http.server 8000
```

Depois abra `http://localhost:8000`. Abrir o `index.html` direto pelo sistema de
arquivos não funciona: o service worker exige `http://` ou `https://`.

---

Coordenação: Dr. Itairan da Silva Terres — Comissão Científica CCEM 2026
