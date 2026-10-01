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

**Caderno**
- Notas por sessão, salvas só no aparelho.
- Exportação em PDF com título, data, sessão e horário de cada nota.
- Faixa de lembrete para exportar, de 24/10 às 16h até 31/10.

**Info**
- Organização, horários da secretaria, certificados, contato e site oficial.
- Item "Trabalhos científicos (e-pôster)", que abre a página externa dos
  trabalhos. O app não hospeda trabalhos.

**Assistente de IA** — em construção (Etapa 5). Hoje a tela usa respostas de
demonstração.

## Privacidade

Não há login nem cadastro. Marcações e notas ficam no `localStorage` do
aparelho e não são enviadas a servidor. Quem limpar o navegador ou trocar de
aparelho perde as notas: por isso o app insiste na exportação em PDF. O app
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

## Onde fica o quê

```
index.html        shell, estilos e ordem de carregamento
v4/               A VERSÃO VIVA — é daqui que o index.html carrega
  ccem-data.js    TODO o conteúdo: programa, palestrantes, fuso, .ics, link do e-pôster
  *.jsx           código-fonte das telas
  *.js            saída compilada (é o que o navegador carrega)
vendor/           React e fontes, hospedados localmente
sw.js             service worker (cache e funcionamento offline)
build.sh          compila os .jsx
v3/               versão 3 congelada. Histórico apenas
```

## Como atualizar

**Conteúdo** (programa, palestrantes, link do e-pôster):

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

### Nada vem de CDN

React, fontes e ícones são servidos do próprio domínio. O app precisa abrir no
Expoville com a rede saturada; depender de `unpkg` ou Google Fonts significaria
não abrir se esses servidores estiverem lentos ou bloqueados.

### Funciona offline

`sw.js` guarda o app e a grade em cache. Depois da primeira visita, o app abre
sem rede. `manifest.json` permite instalá-lo na tela inicial.

## Como rodar localmente

```bash
python3 -m http.server 8000
```

Depois abra `http://localhost:8000`. Abrir o `index.html` direto pelo sistema de
arquivos não funciona: o service worker exige `http://` ou `https://`.

---

Coordenação: Dr. Itairan da Silva Terres — Comissão Científica CCEM 2026
