/* ============================================================
   Meu CCEM 2026 — LIB v4: ícones, hooks, storage
   ============================================================ */
const { useState, useEffect, useRef, useMemo, useLayoutEffect, useCallback } = React;

/* ── Ícones ────────────────────────────────────────────────── */
function Ico({ size=20, color='currentColor', sw=2, fill='none', children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      style={{flexShrink:0,display:'block'}}>{children}</svg>
  );
}
const IcoChevL   = p => <Ico {...p}><path d="M15 18l-6-6 6-6"/></Ico>;
const IcoChevR   = p => <Ico {...p}><path d="M9 18l6-6-6-6"/></Ico>;
const IcoArrowL  = p => <Ico {...p}><path d="M19 12H5M12 19l-7-7 7-7"/></Ico>;
const IcoCal     = p => <Ico {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></Ico>;
const IcoChat    = p => <Ico {...p}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></Ico>;
const IcoBook    = p => <Ico {...p}><path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5z"/></Ico>;
const IcoInfo    = p => <Ico {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.5"/></Ico>;
const IcoSearch  = p => <Ico {...p}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></Ico>;
const IcoStar    = p => <Ico {...p} fill={p.filled?p.color||'currentColor':'none'}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></Ico>;
const IcoPlus    = p => <Ico {...p}><path d="M12 5v14M5 12h14"/></Ico>;
const IcoCheck   = p => <Ico {...p}><path d="M20 6L9 17l-5-5"/></Ico>;
const IcoX       = p => <Ico {...p}><path d="M18 6 6 18M6 6l12 12"/></Ico>;
const IcoCam     = p => <Ico {...p}><rect x="3" y="6" width="18" height="13" rx="2"/><circle cx="12" cy="12.5" r="3"/></Ico>;
const IcoMic     = p => <Ico {...p}><rect x="9" y="4" width="6" height="12" rx="3"/><path d="M5 12a7 7 0 0014 0M12 19v3"/></Ico>;
const IcoSend    = p => <Ico {...p}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></Ico>;
const IcoFilter  = p => <Ico {...p}><path d="M3 6h18M7 12h10M10 18h4"/></Ico>;
const IcoGlobe   = p => <Ico {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></Ico>;
const IcoPhone   = p => <Ico {...p}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1.26h3a2 2 0 012 1.72c.127 1 .36 1.985.7 2.93a2 2 0 01-.45 2.11L6.09 9.06a16 16 0 006.86 6.86l1.27-1.27a2 2 0 012.11-.45c.945.34 1.93.573 2.93.7A2 2 0 0122 16.92z"/></Ico>;
const IcoMail    = p => <Ico {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></Ico>;
const IcoInsta   = p => <Ico {...p}><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/></Ico>;
const IcoLink    = p => <Ico {...p}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></Ico>;
const IcoCapture = p => <Ico {...p}><path d="M3 7l9 6 9-6"/><rect x="3" y="5" width="18" height="14" rx="2"/></Ico>;
const IcoPoster  = p => <Ico {...p}><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M3 10h18M8 17v4M16 17v4M6 21h12"/></Ico>;

/* ── useHashRoute ──────────────────────────────────────────── */
function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash || '#/');
  useEffect(() => {
    const fn = () => setHash(window.location.hash || '#/');
    window.addEventListener('hashchange', fn);
    return () => window.removeEventListener('hashchange', fn);
  }, []);
  return hash;
}

/* ── useMinuto ─────────────────────────────────────────────────
   Re-renderiza a cada minuto. Usado por tudo que depende do
   relógio: selo "Agora", contagem regressiva, "A seguir".
   ────────────────────────────────────────────────────────────── */
function useMinuto() {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick(n => n + 1), 60000);
    return () => clearInterval(id);
  }, []);
}

/* ── Toast ─────────────────────────────────────────────────── */
let _toastTimer;
/* showToast('Texto') ou showToast('Texto', { rotulo:'Adicionar', aoTocar:fn }).
   Com ação, fica 5 s na tela — tempo de ler e tocar. */
function showToast(text, acao) {
  const el = document.getElementById('ccem-toast');
  if (!el) return;
  el.querySelector('span').textContent = text;
  const btn = el.querySelector('.ccem-toast-acao');
  if (btn) {
    if (acao) {
      btn.textContent = acao.rotulo;
      btn.hidden = false;
      btn.onclick = () => { el.classList.remove('show'); acao.aoTocar(); };
    } else {
      btn.hidden = true;
      btn.onclick = null;
    }
  }
  el.classList.toggle('com-acao', !!acao);
  el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), acao ? 5000 : 1900);
}

/* ── Calendário ───────────────────────────────────────────────
   iOS Safari abre "Adicionar ao Calendário" ao navegar para um
   data: text/calendar; em blob com download ele só salva em
   Arquivos. Os demais navegadores baixam o .ics, e o aparelho
   oferece abrir no calendário.
   ────────────────────────────────────────────────────────────── */
function ccemBaseUrl() {
  return window.location.origin + window.location.pathname;
}
function ccemEhIOS() {
  return /iP(hone|ad|od)/.test(navigator.userAgent) ||
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}
function ccemBaixarIcs(sessoes, nomeArquivo) {
  const lista = (sessoes || []).filter(Boolean);
  if (!lista.length) { showToast('Nenhuma sessão para adicionar'); return; }
  const texto = ccemIcs(lista, ccemBaseUrl());
  if (ccemEhIOS()) {
    window.location.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(texto);
    return;
  }
  const url = URL.createObjectURL(new Blob([texto], { type:'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url; a.download = nomeArquivo || 'ccem-2026.ics';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/* Sessões marcadas, em ordem cronológica. Com `dia`, só as daquele dia. */
function ccemMarcadas(appState, dia) {
  const marks = (appState && appState.marks) || {};
  return ccemSessoesEmOrdem().filter(s => marks[s.id] && (!dia || s.dia === dia));
}

/* ── localStorage / estado compartilhado ───────────────────── */
const CCEM_USER_KEY   = 'ccem2026:userId';
const CCEM_STATE_PFIX = 'ccem2026:';

// ── ACCESS CONTROL POINT ─────────────────────────────────────
// TODO: Antes de criar/usar o userId anônimo, validar que o usuário
// é um inscrito. Três caminhos candidatos a definir com a organizadora
// (Promotes Eventos):
//   1. Magic link por e-mail — usuário chega via URL com token único
//   2. Lista de e-mails/CPF — verificar contra lista de inscritos
//   3. Código de acesso geral — senha única compartilhada com inscritos
// Inserir validação aqui e redirecionar para tela de gate se não autenticado.
// Comportamento atual: userId anônimo em localStorage (acesso aberto para demos).
// ─────────────────────────────────────────────────────────────
/* O navegador pode bloquear o armazenamento (Safari privado, políticas de
   empresa). O app abre mesmo assim; só avisa que nada fica salvo. */
const CCEM_ARMAZENA = (() => {
  try { localStorage.setItem('ccem2026:teste', '1'); localStorage.removeItem('ccem2026:teste'); return true; }
  catch (e) { return false; }
})();

function ccemGetUserId() {
  const novo = () => 'u_' + Math.random().toString(36).slice(2,8) + Date.now().toString(36).slice(-3);
  try {
    let id = localStorage.getItem(CCEM_USER_KEY);
    if (!id) { id = novo(); localStorage.setItem(CCEM_USER_KEY, id); }
    return id;
  } catch (e) { return novo(); }
}
const CCEM_USER_ID  = ccemGetUserId();
const CCEM_STATE_KEY = CCEM_STATE_PFIX + CCEM_USER_ID;

function ccemSeedState() {
  // Estado inicial limpo — sem dados de demonstração (P1 · jul/2026)
  // Nomes reais de palestrantes permanecem em ccem-data.js (programa oficial).
  // Corrigido: seed anterior populava o Caderno com notas atribuídas a
  // palestrantes reais — eticamente sensível antes de abertura a inscritos.
  return {
    version: 5, createdAt: Date.now(),
    marks:    {},
    captures: [],
    chat:     [],
  };
}

function ccemLoadState() {
  try {
    const raw = localStorage.getItem(CCEM_STATE_KEY);
    if (!raw) return ccemSeedState();
    const parsed = JSON.parse(raw);
    // Versão < 5: reiniciar limpo (remove seed com dados de demonstração)
    if (!parsed.version || parsed.version < 5) {
      return ccemSeedState();
    }
    return parsed;
  } catch(e) { return ccemSeedState(); }
}
/* Devolve true só se gravou de fato. Falhou uma vez (armazenamento cheio
   ou bloqueado): _ccemSalvamento.ok fica false e o app passa a avisar. */
const _ccemSalvamento = { ok: CCEM_ARMAZENA };
function ccemSaveState(s) {
  try { localStorage.setItem(CCEM_STATE_KEY, JSON.stringify(s)); _ccemSalvamento.ok = true; return true; }
  catch (e) { _ccemSalvamento.ok = false; return false; }
}

/* Store compartilhado */
const _ccemStore     = { state: ccemLoadState() };
const _ccemListeners = new Set();
function _ccemNotify() { _ccemListeners.forEach(fn => fn()); }

function useAppState() {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force(n => n+1);
    _ccemListeners.add(fn);
    return () => _ccemListeners.delete(fn);
  }, []);
  return _ccemStore.state;
}
function updateAppState(updater) {
  updater(_ccemStore.state);
  const ok = ccemSaveState(_ccemStore.state);
  _ccemNotify();
  return ok;
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[m]);
}
/* 5.3 · Foto reduzida no aparelho (máx. 1600 px, JPEG 0,8). */
function ccemReduzirFoto(arquivo) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(arquivo);
    const img = new Image();
    img.onload = () => {
      const escala = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.round(img.naturalWidth * escala), h = Math.round(img.naturalHeight * escala);
      const cv = document.createElement('canvas');
      cv.width = w; cv.height = h;
      cv.getContext('2d').drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      const dataUrl = cv.toDataURL('image/jpeg', 0.8);
      resolve({ base64: dataUrl.split(',')[1], previa: dataUrl });
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('foto')); };
    img.src = url;
  });
}

/* ── Instalação na tela inicial ──────────────────────────────────
   Android/Chrome oferece um diálogo nativo (beforeinstallprompt, guardado
   em window.__ccemInstalar pelo index.html). O iPhone não oferece: lá só
   dá para ensinar o caminho Compartilhar → Adicionar à Tela de Início. */
function ccemInstalado() {
  try { return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true; }
  catch (e) { return false; }
}
function ccemPlataforma() {
  if (ccemEhIOS()) return 'ios';
  if (/Android/i.test(navigator.userAgent)) return 'android';
  return 'outro';
}
/* Quantas vezes o app foi aberto neste aparelho (uma por sessão do navegador). */
const CCEM_VISITAS = (() => {
  try {
    let n = parseInt(localStorage.getItem('ccem2026:visitas') || '0', 10) || 0;
    if (!sessionStorage.getItem('ccem2026:contou')) {
      n++;
      localStorage.setItem('ccem2026:visitas', String(n));
      sessionStorage.setItem('ccem2026:contou', '1');
    }
    return n;
  } catch (e) { return 1; }
})();
/* Abre o diálogo nativo, se houver. Devolve false quando não há (iPhone, Firefox…). */
async function ccemInstalarNativo() {
  const pedido = window.__ccemInstalar;
  if (!pedido) return false;
  window.__ccemInstalar = null;
  try { pedido.prompt(); await pedido.userChoice; } catch (e) {}
  return true;
}
function useInstalacao() {
  const [, forcar] = useState(0);
  useEffect(() => {
    const fn = () => forcar(n => n + 1);
    window.addEventListener('ccem:instalavel', fn);
    window.addEventListener('appinstalled', fn);
    return () => { window.removeEventListener('ccem:instalavel', fn); window.removeEventListener('appinstalled', fn); };
  }, []);
  return { instalado: ccemInstalado(), plataforma: ccemPlataforma(), nativo: !!window.__ccemInstalar };
}

const IcoCompartilharIOS = p => <Ico {...p}><path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11H5a1 1 0 00-1 1v8a1 1 0 001 1h14a1 1 0 001-1v-8a1 1 0 00-1-1h-1"/></Ico>;
const IcoMaisQuadrado   = p => <Ico {...p}><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/></Ico>;
const IcoMenuVertical   = p => <Ico {...p}><circle cx="12" cy="5" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="12" cy="19" r="1.2"/></Ico>;

/* Folha com o passo a passo do aparelho da pessoa. */
function FolhaInstalar({ aoFechar, temDados }) {
  const { plataforma, nativo } = useInstalacao();
  const PASSO = { display:'flex', gap:12, alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${C.linhaSoft}`, fontSize:14, color:C.tinta, lineHeight:1.4 };
  const NUM = { width:26, height:26, borderRadius:'50%', background:C.azulBg, color:C.azul, fontWeight:700, fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 };
  useEffect(() => {
    const esc = e => { if (e.key === 'Escape') aoFechar(); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);
  // Desenhada direto no <body>: aberta de dentro do balão, ficaria presa a ele.
  return ReactDOM.createPortal(
    <div className="ccem-painel" onClick={aoFechar}
      style={{position:'fixed',inset:0,zIndex:330,background:'rgba(10,18,50,.38)',display:'flex',flexDirection:'column',justifyContent:'flex-end'}}>
      <div role="dialog" aria-modal="true" aria-label="Instalar o app na tela inicial" onClick={e=>e.stopPropagation()}
        style={{width:'100%',maxWidth:560,margin:'0 auto',background:'#fff',borderRadius:'18px 18px 0 0',padding:'14px 18px calc(16px + env(safe-area-inset-bottom))'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
          <img src="icon-192.png" alt="" width="40" height="40" style={{borderRadius:10}}/>
          <h2 style={{flex:1,margin:0,fontFamily:'Georgia,serif',fontSize:17,color:C.tinta}}>Instalar na tela inicial</h2>
          <button autoFocus onClick={aoFechar} aria-label="Fechar" style={{width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',background:'none',border:'none',cursor:'pointer',color:C.cinza,padding:0}}><IcoX size={20}/></button>
        </div>
        <p style={{fontSize:13,color:C.cinza,lineHeight:1.5,margin:'0 0 6px'}}>O Meu CCEM passa a abrir pelo ícone, em tela cheia, e funciona sem internet.</p>
        {plataforma === 'ios' ? (
          <div>
            <div style={PASSO}><span style={NUM}>1</span><span style={{flex:1}}>No <b>Safari</b>, toque em <b>Compartilhar</b> (na barra de baixo; no iPad, no alto)</span><IcoCompartilharIOS size={24} color={C.azul}/></div>
            <div style={PASSO}><span style={NUM}>2</span><span style={{flex:1}}>Role a lista e toque em <b>Adicionar à Tela de Início</b></span><IcoMaisQuadrado size={24} color={C.azul}/></div>
            <div style={{...PASSO,borderBottom:'none'}}><span style={NUM}>3</span><span style={{flex:1}}>Toque em <b>Adicionar</b>. O ícone do "8" aparece na tela inicial.</span></div>
            <p style={{fontSize:12.5,color:'#7c2d12',lineHeight:1.45,margin:'6px 0 0',padding:'8px 10px',background:'#fff4e5',borderRadius:7,borderLeft:'3px solid #c2410c'}}>
              No iPhone, o app instalado começa vazio: ele não enxerga o que foi feito no Safari.
              {temDados ? ' Você já tem marcações ou notas aqui: antes, toque em Backup no Caderno e baixe o arquivo; depois, no app instalado, use Backup → Restaurar.' : ' Instale antes de começar a marcar sessões e anotar.'}
            </p>
          </div>
        ) : plataforma === 'android' && nativo ? (
          <button onClick={async()=>{ await ccemInstalarNativo(); aoFechar(); }}
            style={{width:'100%',minHeight:48,marginTop:8,background:C.azul,color:'#fff',border:'none',borderRadius:10,fontFamily:'DM Sans,sans-serif',fontSize:15,fontWeight:700,cursor:'pointer'}}>
            Instalar agora
          </button>
        ) : plataforma === 'android' ? (
          <div>
            <div style={PASSO}><span style={NUM}>1</span><span style={{flex:1}}>No <b>Chrome</b>, toque no menu do canto superior direito</span><IcoMenuVertical size={24} color={C.azul}/></div>
            <div style={PASSO}><span style={NUM}>2</span><span style={{flex:1}}>Toque em <b>Instalar app</b> ou <b>Adicionar à tela inicial</b></span><IcoMaisQuadrado size={24} color={C.azul}/></div>
            <div style={{...PASSO,borderBottom:'none'}}><span style={NUM}>3</span><span style={{flex:1}}>Confirme. O ícone do "8" aparece na tela inicial.</span></div>
          </div>
        ) : (
          <p style={{fontSize:14,color:C.tinta,lineHeight:1.5,margin:'8px 0 0'}}>Abra <b>meu-ccem-2026.vercel.app</b> no celular e toque em "Instalar o app" na tela Info.</p>
        )}
      </div>
    </div>,
    document.body
  );
}

function nowStamp() {
  const d = new Date();
  return d.getHours() + ':' + String(d.getMinutes()).padStart(2,'0');
}

Object.assign(window, {
  Ico, IcoChevL, IcoChevR, IcoArrowL, IcoCal, IcoChat, IcoBook, IcoInfo,
  IcoSearch, IcoStar, IcoPlus, IcoCheck, IcoX, IcoCam, IcoMic, IcoSend,
  IcoFilter, IcoGlobe, IcoPhone, IcoMail, IcoInsta, IcoLink, IcoCapture, IcoPoster,
  useHashRoute, useMinuto, showToast, ccemBaseUrl, ccemBaixarIcs, ccemMarcadas,
  CCEM_USER_ID, CCEM_STATE_KEY, CCEM_ARMAZENA, _ccemSalvamento, ccemReduzirFoto,
  ccemInstalado, ccemPlataforma, ccemInstalarNativo, useInstalacao, FolhaInstalar, CCEM_VISITAS,
  ccemSeedState, ccemLoadState, ccemSaveState,
  _ccemStore, _ccemListeners, _ccemNotify,
  useAppState, updateAppState,
  escapeHTML, nowStamp,
});
