const { useState, useEffect, useRef, useMemo, useLayoutEffect, useCallback } = React;
function Ico({ size = 20, color = "currentColor", sw = 2, fill = "none", children }) {
  return /* @__PURE__ */ React.createElement(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill,
      stroke: color,
      strokeWidth: sw,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: { flexShrink: 0, display: "block" }
    },
    children
  );
}
const IcoChevL = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M15 18l-6-6 6-6" }));
const IcoChevR = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M9 18l6-6-6-6" }));
const IcoArrowL = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M19 12H5M12 19l-7-7 7-7" }));
const IcoCal = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p }, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M16 2v4M8 2v4M3 10h18" }));
const IcoChat = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" }));
const IcoBook = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5z" }));
const IcoInfo = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "9" }), /* @__PURE__ */ React.createElement("path", { d: "M12 11v5M12 7.5v.5" }));
const IcoSearch = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p }, /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "11", r: "8" }), /* @__PURE__ */ React.createElement("path", { d: "M21 21l-4.3-4.3" }));
const IcoStar = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, fill: p.filled ? p.color || "currentColor" : "none" }, /* @__PURE__ */ React.createElement("path", { d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" }));
const IcoPlus = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M12 5v14M5 12h14" }));
const IcoCheck = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M20 6L9 17l-5-5" }));
const IcoX = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M18 6 6 18M6 6l12 12" }));
const IcoCam = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p }, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "6", width: "18", height: "13", rx: "2" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12.5", r: "3" }));
const IcoMic = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p }, /* @__PURE__ */ React.createElement("rect", { x: "9", y: "4", width: "6", height: "12", rx: "3" }), /* @__PURE__ */ React.createElement("path", { d: "M5 12a7 7 0 0014 0M12 19v3" }));
const IcoSend = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" }));
const IcoFilter = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M3 6h18M7 12h10M10 18h4" }));
const IcoGlobe = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "10" }), /* @__PURE__ */ React.createElement("line", { x1: "2", y1: "12", x2: "22", y2: "12" }), /* @__PURE__ */ React.createElement("path", { d: "M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" }));
const IcoPhone = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1.26h3a2 2 0 012 1.72c.127 1 .36 1.985.7 2.93a2 2 0 01-.45 2.11L6.09 9.06a16 16 0 006.86 6.86l1.27-1.27a2 2 0 012.11-.45c.945.34 1.93.573 2.93.7A2 2 0 0122 16.92z" }));
const IcoMail = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }), /* @__PURE__ */ React.createElement("polyline", { points: "22,6 12,13 2,6" }));
const IcoInsta = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p }, /* @__PURE__ */ React.createElement("rect", { x: "2", y: "2", width: "20", height: "20", rx: "5" }), /* @__PURE__ */ React.createElement("path", { d: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" }));
const IcoLink = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" }));
const IcoCapture = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M3 7l9 6 9-6" }), /* @__PURE__ */ React.createElement("rect", { x: "3", y: "5", width: "18", height: "14", rx: "2" }));
const IcoPoster = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p }, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "3", width: "18", height: "14", rx: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M3 10h18M8 17v4M16 17v4M6 21h12" }));
function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash || "#/");
  useEffect(() => {
    const fn = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, []);
  return hash;
}
function useMinuto() {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 6e4);
    return () => clearInterval(id);
  }, []);
}
let _toastTimer;
function showToast(text, acao) {
  const el = document.getElementById("ccem-toast");
  if (!el) return;
  el.querySelector("span").textContent = text;
  const btn = el.querySelector(".ccem-toast-acao");
  if (btn) {
    if (acao) {
      btn.textContent = acao.rotulo;
      btn.hidden = false;
      btn.onclick = () => {
        el.classList.remove("show");
        acao.aoTocar();
      };
    } else {
      btn.hidden = true;
      btn.onclick = null;
    }
  }
  el.classList.toggle("com-acao", !!acao);
  el.classList.add("show");
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove("show"), acao ? 5e3 : 1900);
}
function ccemBaseUrl() {
  return window.location.origin + window.location.pathname;
}
function ccemEhIOS() {
  return /iP(hone|ad|od)/.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}
function ccemBaixarIcs(sessoes, nomeArquivo) {
  const lista = (sessoes || []).filter(Boolean);
  if (!lista.length) {
    showToast("Nenhuma sess\xE3o para adicionar");
    return;
  }
  const texto = ccemIcs(lista, ccemBaseUrl());
  if (ccemEhIOS()) {
    window.location.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(texto);
    return;
  }
  const url = URL.createObjectURL(new Blob([texto], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = nomeArquivo || "ccem-2026.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4e3);
}
function ccemMarcadas(appState, dia) {
  const marks = appState && appState.marks || {};
  return ccemSessoesEmOrdem().filter((s) => marks[s.id] && (!dia || s.dia === dia));
}
const CCEM_USER_KEY = "ccem2026:userId";
const CCEM_STATE_PFIX = "ccem2026:";
const CCEM_ARMAZENA = (() => {
  try {
    localStorage.setItem("ccem2026:teste", "1");
    localStorage.removeItem("ccem2026:teste");
    return true;
  } catch (e) {
    return false;
  }
})();
function ccemGetUserId() {
  const novo = () => "u_" + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-3);
  try {
    let id = localStorage.getItem(CCEM_USER_KEY);
    if (!id) {
      id = novo();
      localStorage.setItem(CCEM_USER_KEY, id);
    }
    return id;
  } catch (e) {
    return novo();
  }
}
const CCEM_USER_ID = ccemGetUserId();
const CCEM_STATE_KEY = CCEM_STATE_PFIX + CCEM_USER_ID;
function ccemSeedState() {
  return {
    version: 5,
    createdAt: Date.now(),
    marks: {},
    captures: [],
    chat: []
  };
}
function ccemLoadState() {
  try {
    const raw = localStorage.getItem(CCEM_STATE_KEY);
    if (!raw) return ccemSeedState();
    const parsed = JSON.parse(raw);
    if (!parsed.version || parsed.version < 5) {
      return ccemSeedState();
    }
    return parsed;
  } catch (e) {
    return ccemSeedState();
  }
}
const _ccemSalvamento = { ok: CCEM_ARMAZENA };
function ccemSaveState(s) {
  try {
    localStorage.setItem(CCEM_STATE_KEY, JSON.stringify(s));
    _ccemSalvamento.ok = true;
    return true;
  } catch (e) {
    _ccemSalvamento.ok = false;
    return false;
  }
}
const _ccemStore = { state: ccemLoadState() };
const _ccemListeners = /* @__PURE__ */ new Set();
function _ccemNotify() {
  _ccemListeners.forEach((fn) => fn());
}
function useAppState() {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force((n) => n + 1);
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
  return String(s).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[m]);
}
function ccemReduzirFoto(arquivo) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(arquivo);
    const img = new Image();
    img.onload = () => {
      const escala = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.round(img.naturalWidth * escala), h = Math.round(img.naturalHeight * escala);
      const cv = document.createElement("canvas");
      cv.width = w;
      cv.height = h;
      cv.getContext("2d").drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      const dataUrl = cv.toDataURL("image/jpeg", 0.8);
      resolve({ base64: dataUrl.split(",")[1], previa: dataUrl });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("foto"));
    };
    img.src = url;
  });
}
function ccemInstalado() {
  try {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  } catch (e) {
    return false;
  }
}
function ccemPlataforma() {
  if (ccemEhIOS()) return "ios";
  if (/Android/i.test(navigator.userAgent)) return "android";
  return "outro";
}
const CCEM_VISITAS = (() => {
  try {
    let n = parseInt(localStorage.getItem("ccem2026:visitas") || "0", 10) || 0;
    if (!sessionStorage.getItem("ccem2026:contou")) {
      n++;
      localStorage.setItem("ccem2026:visitas", String(n));
      sessionStorage.setItem("ccem2026:contou", "1");
    }
    return n;
  } catch (e) {
    return 1;
  }
})();
async function ccemInstalarNativo() {
  const pedido = window.__ccemInstalar;
  if (!pedido) return false;
  window.__ccemInstalar = null;
  try {
    pedido.prompt();
    await pedido.userChoice;
  } catch (e) {
  }
  return true;
}
function useInstalacao() {
  const [, forcar] = useState(0);
  useEffect(() => {
    const fn = () => forcar((n) => n + 1);
    window.addEventListener("ccem:instalavel", fn);
    window.addEventListener("appinstalled", fn);
    return () => {
      window.removeEventListener("ccem:instalavel", fn);
      window.removeEventListener("appinstalled", fn);
    };
  }, []);
  return { instalado: ccemInstalado(), plataforma: ccemPlataforma(), nativo: !!window.__ccemInstalar };
}
const IcoCompartilharIOS = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M12 3v12M8 7l4-4 4 4" }), /* @__PURE__ */ React.createElement("path", { d: "M6 11H5a1 1 0 00-1 1v8a1 1 0 001 1h14a1 1 0 001-1v-8a1 1 0 00-1-1h-1" }));
const IcoMaisQuadrado = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p }, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "3", width: "18", height: "18", rx: "4" }), /* @__PURE__ */ React.createElement("path", { d: "M12 8v8M8 12h8" }));
const IcoMenuVertical = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "5", r: "1.2" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "1.2" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "19", r: "1.2" }));
function FolhaInstalar({ aoFechar, temDados }) {
  const { plataforma, nativo } = useInstalacao();
  const PASSO = { display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.linhaSoft}`, fontSize: 14, color: C.tinta, lineHeight: 1.4 };
  const NUM = { width: 26, height: 26, borderRadius: "50%", background: C.azulBg, color: C.azul, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
  useEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape") aoFechar();
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);
  return ReactDOM.createPortal(
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "ccem-painel",
        onClick: aoFechar,
        style: { position: "fixed", inset: 0, zIndex: 330, background: "rgba(10,18,50,.38)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          role: "dialog",
          "aria-modal": "true",
          "aria-label": "Instalar o app na tela inicial",
          onClick: (e) => e.stopPropagation(),
          style: { width: "100%", maxWidth: 560, margin: "0 auto", background: "#fff", borderRadius: "18px 18px 0 0", padding: "14px 18px calc(16px + env(safe-area-inset-bottom))" }
        },
        /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("img", { src: "icon-192.png", alt: "", width: "40", height: "40", style: { borderRadius: 10 } }), /* @__PURE__ */ React.createElement("h2", { style: { flex: 1, margin: 0, fontFamily: "Georgia,serif", fontSize: 17, color: C.tinta } }, "Instalar na tela inicial"), /* @__PURE__ */ React.createElement("button", { autoFocus: true, onClick: aoFechar, "aria-label": "Fechar", style: { width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: C.cinza, padding: 0 } }, /* @__PURE__ */ React.createElement(IcoX, { size: 20 }))),
        /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: C.cinza, lineHeight: 1.5, margin: "0 0 6px" } }, "O Meu CCEM passa a abrir pelo \xEDcone, em tela cheia, e funciona sem internet."),
        plataforma === "ios" ? /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: PASSO }, /* @__PURE__ */ React.createElement("span", { style: NUM }, "1"), /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, "No ", /* @__PURE__ */ React.createElement("b", null, "Safari"), ", toque em ", /* @__PURE__ */ React.createElement("b", null, "Compartilhar"), " (na barra de baixo; no iPad, no alto)"), /* @__PURE__ */ React.createElement(IcoCompartilharIOS, { size: 24, color: C.azul })), /* @__PURE__ */ React.createElement("div", { style: PASSO }, /* @__PURE__ */ React.createElement("span", { style: NUM }, "2"), /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, "Role a lista e toque em ", /* @__PURE__ */ React.createElement("b", null, "Adicionar \xE0 Tela de In\xEDcio")), /* @__PURE__ */ React.createElement(IcoMaisQuadrado, { size: 24, color: C.azul })), /* @__PURE__ */ React.createElement("div", { style: { ...PASSO, borderBottom: "none" } }, /* @__PURE__ */ React.createElement("span", { style: NUM }, "3"), /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, "Toque em ", /* @__PURE__ */ React.createElement("b", null, "Adicionar"), '. O \xEDcone do "8" aparece na tela inicial.')), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12.5, color: "#7c2d12", lineHeight: 1.45, margin: "6px 0 0", padding: "8px 10px", background: "#fff4e5", borderRadius: 7, borderLeft: "3px solid #c2410c" } }, "No iPhone, o app instalado come\xE7a vazio: ele n\xE3o enxerga o que foi feito no Safari.", temDados ? " Voc\xEA j\xE1 tem marca\xE7\xF5es ou notas aqui: antes, toque em Backup no Caderno e baixe o arquivo; depois, no app instalado, use Backup \u2192 Restaurar." : " Instale antes de come\xE7ar a marcar sess\xF5es e anotar.")) : plataforma === "android" && nativo ? /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: async () => {
              await ccemInstalarNativo();
              aoFechar();
            },
            style: { width: "100%", minHeight: 48, marginTop: 8, background: C.azul, color: "#fff", border: "none", borderRadius: 10, fontFamily: "DM Sans,sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer" }
          },
          "Instalar agora"
        ) : plataforma === "android" ? /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: PASSO }, /* @__PURE__ */ React.createElement("span", { style: NUM }, "1"), /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, "No ", /* @__PURE__ */ React.createElement("b", null, "Chrome"), ", toque no menu do canto superior direito"), /* @__PURE__ */ React.createElement(IcoMenuVertical, { size: 24, color: C.azul })), /* @__PURE__ */ React.createElement("div", { style: PASSO }, /* @__PURE__ */ React.createElement("span", { style: NUM }, "2"), /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, "Toque em ", /* @__PURE__ */ React.createElement("b", null, "Instalar app"), " ou ", /* @__PURE__ */ React.createElement("b", null, "Adicionar \xE0 tela inicial")), /* @__PURE__ */ React.createElement(IcoMaisQuadrado, { size: 24, color: C.azul })), /* @__PURE__ */ React.createElement("div", { style: { ...PASSO, borderBottom: "none" } }, /* @__PURE__ */ React.createElement("span", { style: NUM }, "3"), /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, 'Confirme. O \xEDcone do "8" aparece na tela inicial.'))) : /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: C.tinta, lineHeight: 1.5, margin: "8px 0 0" } }, "Abra ", /* @__PURE__ */ React.createElement("b", null, "ccem2026.sbemsc.org.br"), ' no celular e toque em "Instalar o app" na tela Info.')
      )
    ),
    document.body
  );
}
function nowStamp() {
  const d = /* @__PURE__ */ new Date();
  return d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0");
}
Object.assign(window, {
  Ico,
  IcoChevL,
  IcoChevR,
  IcoArrowL,
  IcoCal,
  IcoChat,
  IcoBook,
  IcoInfo,
  IcoSearch,
  IcoStar,
  IcoPlus,
  IcoCheck,
  IcoX,
  IcoCam,
  IcoMic,
  IcoSend,
  IcoFilter,
  IcoGlobe,
  IcoPhone,
  IcoMail,
  IcoInsta,
  IcoLink,
  IcoCapture,
  IcoPoster,
  useHashRoute,
  useMinuto,
  showToast,
  ccemBaseUrl,
  ccemBaixarIcs,
  ccemMarcadas,
  CCEM_USER_ID,
  CCEM_STATE_KEY,
  CCEM_ARMAZENA,
  _ccemSalvamento,
  ccemReduzirFoto,
  ccemInstalado,
  ccemPlataforma,
  ccemInstalarNativo,
  useInstalacao,
  FolhaInstalar,
  CCEM_VISITAS,
  ccemSeedState,
  ccemLoadState,
  ccemSaveState,
  _ccemStore,
  _ccemListeners,
  _ccemNotify,
  useAppState,
  updateAppState,
  escapeHTML,
  nowStamp
});
