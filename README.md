# Companheiro CCEM 2026

Aplicativo web mobile-first do **12º Congresso Catarinense de Endocrinologia e Metabologia**.

🗓️ 23 e 24 de outubro de 2026
📍 Expoville · Joinville-SC
🏛️ Realização: SBEM-SC

## O que faz

Aplicativo do programa vivo do congresso, com captura individual como acessório.

### Onda 1 — Programa Vivo

- **Linha do tempo do dia** — barra visual com todas as sessões e a marca "agora"
- **Acontecendo agora** — strip superior com contexto temporal automático
- **Marcação de interesse + lembrete** — toggle no card, notificação no navegador
- **Mini-bio do palestrante** — toque no nome para abrir modal com bio
- **Briefing pré-sessão** — 3 pontos de contexto curados antes da palestra
- **Quiz preparatório opcional** — questões geradas por IA, sem nota
- **Mapa do Expoville** — modal acessível pelo header do programa
- **Captura como acessório** — botão dentro do painel expansível, não mais em destaque

### Trilhas paralelas (não no app principal)

- Plataforma de submissão de pôsteres digitais — projeto irmão
- Anais oficial com DOI/ISBN — em discussão institucional

## Estado atual

Conteúdo das bios, briefings e quizzes está em **modo curadoria**: parte com texto-placeholder, parte com conteúdo de exemplo. Tudo será revisado pela Comissão Científica antes do evento.

## Pontos de troca para produção

`// TODO: integrar com API real` marca cada ponto no código:

1. `getMockReply()` → chamada real à API Gemini 2.0 Flash
2. `loadState()` / `saveState()` → Supabase para sincronização entre dispositivos
3. `getOrCreateUserId()` → integração com sistema de inscrição da Promotes
4. `sendPhoto()` / `finalizeRecording()` → análise multimodal via Gemini
5. `exportPDF()` → gerador real (jsPDF ou server-side)
6. `PROGRAM_DAYS`, `SESSION_META`, `SPEAKER_BIOS` → carregar do banco
7. Notificações reais → service worker com push (pós-Onda 1)

## Stack

- **Frontend**: React 18 sem framework, JSX pré-compilado, sem bundler
- **Tipografia**: DM Sans + JetBrains Mono, **hospedadas localmente**
- **Hospedagem**: Vercel (deploy automático via GitHub)
- **Banco (produção)**: Supabase
- **IA (produção)**: Gemini 2.0 Flash (multimodal)

### Nada vem de CDN

React, fontes e ícones são servidos do próprio domínio. O app precisa abrir no
Expoville com a rede saturada — depender de `unpkg` ou Google Fonts significaria
não abrir se esses hosts estiverem lentos ou bloqueados.

Verificado com todos os hosts externos bloqueados: **zero requisições externas,
zero erros de console.**

### Funciona offline

`sw.js` guarda o shell e a grade em cache. Depois da primeira visita, o app abre
sem rede. `manifest.json` o torna instalável na tela inicial.

## Onde fica o quê

```
index.html        shell, estilos e ordem de carregamento
v4/               A VERSÃO VIVA — é daqui que o index.html carrega
  ccem-data.js    TODO o conteúdo — programa, bios, briefings, quizzes
  *.jsx           código-fonte das telas
  *.js            saída compilada (é o que o navegador carrega)
vendor/           React e fontes, hospedados localmente
sw.js             service worker
build.sh          compila os .jsx
v3/               versão 3 congelada, autossuficiente. Histórico apenas
```

**Editar sempre em `v4/`.** A raiz já teve cópias de `ccem-data.js`,
`ccem-lib.jsx` e `ccem-screens.jsx` que nada carregava — quem as editasse não
veria efeito nenhum. Foram removidas.

## Como atualizar

**Conteúdo** — programa, bios, briefings, quizzes, palestrantes:

1. Editar `v4/ccem-data.js` no GitHub (botão de lápis)
2. Commit — Vercel re-deploya em ~10s, URL não muda

`ccem-data.js` é JavaScript puro, **sem JSX**. Não precisa compilar nada.

**Código das telas** — qualquer arquivo `.jsx`:

1. Editar o `.jsx`
2. Rodar `./build.sh` (requer Node)
3. Commitar o `.jsx` **e** o `.js` gerado

**Antes de publicar qualquer mudança**: incrementar `CACHE_VERSION` em `sw.js`,
senão os navegadores continuam servindo a versão em cache.

## Como rodar localmente

```bash
python3 -m http.server 8000
```

Depois abra `http://localhost:8000`. Abrir o `index.html` direto pelo sistema de
arquivos não funciona — o service worker exige `http://` ou `https://`.

---

Coordenação: Dr. Itairan da Silva Terres — Comissão Científica CCEM 2026
