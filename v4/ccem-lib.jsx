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

/* ── Toast ─────────────────────────────────────────────────── */
let _toastTimer;
function showToast(text) {
  const el = document.getElementById('ccem-toast');
  if (!el) return;
  el.querySelector('span').textContent = text;
  el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), 1900);
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
function ccemGetUserId() {
  let id = localStorage.getItem(CCEM_USER_KEY);
  if (!id) {
    id = 'u_' + Math.random().toString(36).slice(2,8) + Date.now().toString(36).slice(-3);
    localStorage.setItem(CCEM_USER_KEY, id);
  }
  return id;
}
const CCEM_USER_ID  = ccemGetUserId();
const CCEM_STATE_KEY = CCEM_STATE_PFIX + CCEM_USER_ID;

function ccemSeedState() {
  return {
    version: 4, createdAt: Date.now(),
    marks:    { 'simp1-dm2':true, 'simp3-cdt':true, 'simp5-modismos':true, 'mini-ia':true },
    captures: [
      { id:'c1', dia:DIAS[0], time:'9:42', sessaoId:'simp1-dm2',
        sessaoRef:'Simpósio 1 · Dra. Luciana Pechmann', type:'foto',
        title:'Triagonistas (retatrutida) — perda de peso > 24%',
        body:'Próximo passo após GLP-1/GIP. <strong>Ref:</strong> Jastreboff AM et al., <em class="cite">NEJM 2023;389:514</em>. <em>Sem horizonte SUS.</em>',
        tags:['DM2','incretinas'], ts: Date.now()-86400000*1.2 },
      { id:'c2', dia:DIAS[0], time:'13:50', sessaoId:'simp3-cdt',
        sessaoRef:'Simpósio 3 · Dra. Marta Duval', type:'audio',
        title:'Categorias dinâmicas de resposta no CDT',
        body:'<strong>Take-home:</strong> excelente, indeterminada, bioquímica incompleta, estrutural — reavaliáveis no seguimento.',
        tags:['Tireoide','ATA'], ts: Date.now()-86400000*1.0 },
      { id:'c3', dia:DIAS[0], time:'17:35', sessaoId:'simp5-modismos',
        sessaoRef:'Simpósio 5 · Dr. Itairan Terres ★', type:'texto',
        title:'"Centenas de exames e zero hipótese"',
        body:'<em>"o exame confirma ou refuta — não substitui a hipótese."</em>',
        tags:['sua-fala'], ts: Date.now()-86400000*0.9 },
      { id:'c4', dia:DIAS[1], time:'8:30', sessaoId:'simp6-gonadas',
        sessaoRef:'Simpósio 6 · Dr. Alexandre Hohl', type:'foto',
        title:'Nova diretriz hipogonadismo — cutoff por idade',
        body:'Duas dosagens matinais alteradas para iniciar tratamento.',
        tags:['Gônadas'], ts: Date.now()-86400000*0.5 },
      { id:'c5', dia:DIAS[1], time:'17:05', sessaoId:'mini-ia',
        sessaoRef:'Mini · Dra. Milena Gurgel ★', type:'texto',
        title:'IA no consultório — o que vale',
        body:'<strong>Útil:</strong> resumo, pedidos. <strong>Não substitui:</strong> hipótese, decisão, vínculo.',
        tags:['IA'], ts: Date.now()-86400000*0.1 },
    ],
    chat: [],
  };
}

function ccemLoadState() {
  try {
    const raw = localStorage.getItem(CCEM_STATE_KEY);
    if (!raw) return ccemSeedState();
    const parsed = JSON.parse(raw);
    if (!parsed.version || parsed.version < 4) {
      if (Array.isArray(parsed.captures)) {
        parsed.captures = parsed.captures.map(c => {
          if (!c.dia) {
            const d = c.day || '';
            c.dia = d === 'sexta' ? DIAS[0] : d === 'sabado' ? DIAS[1] : DIAS[0];
          }
          return c;
        });
      }
      parsed.version = 4;
    }
    return parsed;
  } catch(e) { return ccemSeedState(); }
}
function ccemSaveState(s) {
  try { localStorage.setItem(CCEM_STATE_KEY, JSON.stringify(s)); } catch(e) {}
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
  ccemSaveState(_ccemStore.state);
  _ccemNotify();
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[m]);
}
function nowStamp() {
  const d = new Date();
  return d.getHours() + ':' + String(d.getMinutes()).padStart(2,'0');
}

Object.assign(window, {
  Ico, IcoChevL, IcoChevR, IcoArrowL, IcoCal, IcoChat, IcoBook, IcoInfo,
  IcoSearch, IcoStar, IcoPlus, IcoCheck, IcoX, IcoCam, IcoMic, IcoSend,
  IcoFilter, IcoGlobe, IcoPhone, IcoMail, IcoInsta, IcoLink, IcoCapture, IcoPoster,
  useHashRoute, showToast,
  CCEM_USER_ID, CCEM_STATE_KEY,
  ccemSeedState, ccemLoadState, ccemSaveState,
  _ccemStore, _ccemListeners, _ccemNotify,
  useAppState, updateAppState,
  escapeHTML, nowStamp,
});
