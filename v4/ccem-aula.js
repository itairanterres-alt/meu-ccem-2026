const CCEM_ATALHO_CURTO = {
  explicar: "Explicar",
  raciocinio: "Racioc\xEDnio",
  concluir: "Conclus\xE3o",
  leitura_critica: "Leitura cr\xEDtica",
  tabela: "Tabela em texto",
  fluxograma: "Fluxograma",
  transcrever: "Transcrever e siglas",
  perguntas: "Perguntas ao palestrante"
};
const _ccemUrlAula = (sessaoId, n) => "#/aula/" + sessaoId + (typeof n === "number" ? "/" + n : "");
let _ccemAulaComVolta = false;
window.addEventListener("hashchange", () => {
  if (!location.hash.startsWith("#/aula/")) _ccemAulaComVolta = false;
});
function ccemAbrirAula(sessaoId, n) {
  _ccemAulaComVolta = true;
  go(_ccemUrlAula(sessaoId, n));
}
function ccemTrocarAula(sessaoId, n) {
  location.replace(_ccemUrlAula(sessaoId, n));
}
function ccemSairDaAula(sessaoId) {
  if (_ccemAulaComVolta) window.history.back();
  else location.replace("#/sessao/" + sessaoId);
}
let _ccemFotoPendente = null;
function _ccemMarcarPendente(p) {
  _ccemFotoPendente = p;
  window.dispatchEvent(new Event("ccem:foto-pendente"));
}
function useFotoPendente(sessaoId, n) {
  const [, atualizar] = useState(0);
  useEffect(() => {
    const fn = () => atualizar((x) => x + 1);
    window.addEventListener("ccem:foto-pendente", fn);
    return () => window.removeEventListener("ccem:foto-pendente", fn);
  }, []);
  const p = _ccemFotoPendente;
  return p && p.sessaoId === sessaoId && p.n === n ? p.previa : null;
}
let _ccemEntradaFoto = null, _ccemAlvoFoto = null;
function ccemFotografarNaAula(alvo) {
  if (!_ccemEntradaFoto) {
    const e = document.createElement("input");
    e.type = "file";
    e.accept = "image/*";
    e.style.display = "none";
    e.setAttribute("data-ccem-foto-aula", "");
    e.addEventListener("change", () => {
      const arquivo = e.files && e.files[0], a = _ccemAlvoFoto;
      e.value = "";
      _ccemAlvoFoto = null;
      if (arquivo && a) _ccemGuardarFotoDaAula(arquivo, a);
    });
    document.body.appendChild(e);
    _ccemEntradaFoto = e;
  }
  _ccemAlvoFoto = alvo;
  _ccemEntradaFoto.click();
}
async function _ccemGuardarFotoDaAula(arquivo, { sessaoId, n, texto, aoUsarTexto, aoFalhar }) {
  _ccemMarcarPendente({ sessaoId, n, previa: "lendo" });
  let previa;
  try {
    previa = (await ccemReduzirFoto(arquivo)).previa;
  } catch (e) {
    _ccemMarcarPendente(null);
    showToast("N\xE3o foi poss\xEDvel ler a foto. Tente de novo.");
    return;
  }
  _ccemMarcarPendente({ sessaoId, n, previa });
  if (aoUsarTexto) aoUsarTexto();
  const r = await ccemGravarNota({ texto: texto || "", foto: previa, sessaoId, fala: n, silencioso: true });
  _ccemMarcarPendente(null);
  if ((!r || !r.ok) && aoFalhar) aoFalhar();
}
function ccemNotasDaAula(captures, sessaoId, n) {
  const aulas = ccemAulas(sessaoId);
  return (captures || []).filter((c) => c.sessaoId === sessaoId && (typeof n === "number" ? c.fala === n : !aulas.some((f) => f.n === c.fala))).sort((a, b) => a.ts - b.ts);
}
function BalaoEu({ children, hora }) {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", margin: "0 0 8px" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: "86%", background: C.azul, color: "#fff", borderRadius: "14px 14px 4px 14px", padding: "8px 12px", fontSize: 14, lineHeight: 1.45, whiteSpace: "pre-wrap" } }, children, hora && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, opacity: 0.75, marginTop: 3, textAlign: "right" } }, hora)));
}
function BalaoIA({ children }) {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "flex-start", margin: "0 0 10px" } }, /* @__PURE__ */ React.createElement("img", { src: CCEM_AVATAR, alt: "", width: "26", height: "26", style: { borderRadius: "50%", flexShrink: 0, marginTop: 2 } }), /* @__PURE__ */ React.createElement("div", { style: { maxWidth: "88%", minWidth: 0 } }, children));
}
function ItemFoto({ c, ocupado, aoPedir, aoCarregar }) {
  const foto = useFoto(c.foto);
  const feitas = new Set((c.respostas || []).map((x) => x.acao));
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", margin: "0 0 6px" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: "86%" } }, foto ? /* @__PURE__ */ React.createElement("img", { src: foto, alt: "Foto do slide", onLoad: aoCarregar, style: { display: "block", maxWidth: "100%", maxHeight: 260, borderRadius: 12, border: `1px solid ${C.linhaSoft}` } }) : /* @__PURE__ */ React.createElement("div", { style: { padding: "20px 14px", background: "#eef2f8", borderRadius: 12, fontSize: 13, color: C.cinza } }, "Foto"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.cinza, textAlign: "right", marginTop: 2 } }, c.time))), c.body && !c.resumoIA && /* @__PURE__ */ React.createElement(BalaoEu, null, ccemNotaEmTexto(c.body)), (c.respostas || []).map((x) => /* @__PURE__ */ React.createElement(BalaoIA, { key: x.id }, /* @__PURE__ */ React.createElement(RespostaSlide, { item: x }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, overflowX: "auto", padding: "0 0 12px 32px", WebkitOverflowScrolling: "touch" } }, CCEM_ATALHOS.map((a) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: a.acao,
      onClick: () => aoPedir(c.id, a),
      disabled: ocupado || feitas.has(a.acao),
      style: {
        flexShrink: 0,
        minHeight: 44,
        padding: "0 12px",
        borderRadius: 22,
        border: `1px solid ${C.linha}`,
        background: feitas.has(a.acao) ? "#f1f4f9" : "#fff",
        color: feitas.has(a.acao) ? C.cinza : C.azul,
        fontFamily: "DM Sans,sans-serif",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        opacity: ocupado && !feitas.has(a.acao) ? 0.5 : 1
      }
    },
    feitas.has(a.acao) ? "\u2713 " : "",
    CCEM_ATALHO_CURTO[a.acao] || a.rotulo
  ))));
}
function AulaScreen({ sessaoId, fala }) {
  const appState = useAppState();
  const s = SESSOES[sessaoId];
  const aulas = s ? ccemAulas(sessaoId) : [];
  const n = aulas.some((f2) => f2.n === fala) ? fala : null;
  const f = n !== null ? ccemFalaDe(sessaoId, n) : null;
  const [texto, setTexto] = useState("");
  const [ocupado, setOcupado] = useState(null);
  const pendente = useFotoPendente(sessaoId, n);
  const fimRef = useRef(null);
  const listaRef = useRef(null);
  const aoFim = () => requestAnimationFrame(() => {
    const el = listaRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  });
  const notas = s ? ccemNotasDaAula(appState.captures, sessaoId, n) : [];
  useEffect(() => {
    aoFim();
  }, [notas.length, ocupado, pendente, notas.reduce((t, c) => t + (c.respostas || []).length, 0)]);
  if (!s) return /* @__PURE__ */ React.createElement("div", { style: { padding: 24, color: C.cinza } }, "Sess\xE3o n\xE3o encontrada.");
  const titulo = f ? `Aula ${f.n}${f.titulo ? " \xB7 " + f.titulo : ""}` : aulas.length ? "Sess\xE3o toda" : s.titulo;
  const sub = f ? f.palestrante : `${s.badge} \xB7 ${s.inicio}\u2013${s.fim}`;
  async function anotar() {
    const t = texto.trim();
    if (!t) return;
    setTexto("");
    await ccemGravarNota({ texto: t, sessaoId, fala: n, silencioso: true });
  }
  function foto() {
    const t = texto.trim();
    ccemFotografarNaAula({ sessaoId, n, texto: t, aoUsarTexto: () => setTexto(""), aoFalhar: () => setTexto(t) });
  }
  async function perguntar() {
    const q = texto.trim();
    if (!q || ocupado) return;
    setTexto("");
    setOcupado(q);
    const historico = notas.filter((c) => c.resumoIA && c.body).slice(-3).flatMap((c) => [{ papel: "usuario", texto: ccemNotaEmTexto(c.body) }, { papel: "assistente", texto: c.resumoIA }]);
    const prefixo = f ? `[Aula ${f.n}${f.titulo ? " \xB7 " + f.titulo : ""} \u2014 ${f.palestrante}] ` : "";
    const r = await ccemPerguntarAoAssistente({ texto: prefixo + q, sessaoId, historico });
    setOcupado(null);
    if (r.resposta) await ccemGravarNota({ texto: q, sessaoId, fala: n, resumoIA: ccemRespostaEmTexto(r.resposta), silencioso: true });
    else {
      setTexto(q);
      showToast(r.aviso || "N\xE3o foi poss\xEDvel responder agora");
    }
  }
  async function pedir(id, a) {
    if (ocupado) return;
    setOcupado(CCEM_ATALHO_CURTO[a.acao] || a.rotulo);
    const r = await ccemAcaoSlide(id, { acao: a.acao, rotulo: a.rotulo });
    setOcupado(null);
    if (r && r.aviso) showToast(r.aviso);
  }
  const BTN = { minHeight: 44, borderRadius: 10, padding: "0 12px", fontFamily: "DM Sans,sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 };
  return /* @__PURE__ */ React.createElement("div", { style: { height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", background: "#f3f6fc" } }, /* @__PURE__ */ React.createElement("div", { style: { background: C.azul, color: "#fff", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, padding: "4px 8px" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => ccemSairDaAula(sessaoId), "aria-label": "Voltar \xE0 sess\xE3o", style: { width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: 0 } }, /* @__PURE__ */ React.createElement(IcoArrowL, { size: 20, color: "#fff" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, titulo), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, opacity: 0.8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, sub)), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go("#/programa"),
      "aria-label": "Ir para o Programa",
      style: { flexShrink: 0, minHeight: 44, padding: "0 10px", display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,.14)", border: "1px solid rgba(255,255,255,.3)", borderRadius: 9, color: "#fff", fontFamily: "DM Sans,sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer" }
    },
    /* @__PURE__ */ React.createElement(IcoCal, { size: 16, color: "#fff" }),
    "Programa"
  )), aulas.length > 0 && /* @__PURE__ */ React.createElement("div", { role: "tablist", "aria-label": "Aulas", style: { display: "flex", gap: 6, overflowX: "auto", padding: "0 10px 8px" } }, [...aulas.map((a) => ({ n: a.n, rot: "Aula " + a.n })), { n: null, rot: "Sess\xE3o toda" }].map((o) => {
    const on = o.n === n;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: String(o.n),
        role: "tab",
        "aria-selected": on,
        onClick: () => ccemTrocarAula(sessaoId, o.n),
        style: { flexShrink: 0, minHeight: 44, padding: "0 14px", borderRadius: 22, border: "1px solid rgba(255,255,255,.4)", background: on ? "#fff" : "transparent", color: on ? C.azul : "#fff", fontFamily: "DM Sans,sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer" }
      },
      o.rot
    );
  }))), /* @__PURE__ */ React.createElement("div", { ref: listaRef, style: { flex: 1, overflowY: "auto", padding: "12px 12px 4px" } }, notas.length === 0 && !ocupado && /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", color: C.cinza, fontSize: 13.5, lineHeight: 1.5, padding: "28px 16px" } }, "Tudo desta ", f ? "aula" : "sess\xE3o", " fica aqui, em ordem: suas anota\xE7\xF5es, as fotos dos slides e as respostas da IA.", /* @__PURE__ */ React.createElement("br", null), "Escreva e toque em ", /* @__PURE__ */ React.createElement("b", null, "Anotar"), ", fotografe um slide ou fa\xE7a uma pergunta \xE0 IA."), notas.map((c) => /* @__PURE__ */ React.createElement("div", { key: c.id }, c.foto ? /* @__PURE__ */ React.createElement(ItemFoto, { c, ocupado: !!ocupado, aoPedir: pedir, aoCarregar: aoFim }) : /* @__PURE__ */ React.createElement(React.Fragment, null, c.body && /* @__PURE__ */ React.createElement(BalaoEu, { hora: c.time }, ccemNotaEmTexto(c.body))), c.resumoIA && /* @__PURE__ */ React.createElement(BalaoIA, null, /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", border: `1px solid ${C.linhaSoft}`, borderRadius: "14px 14px 14px 4px", padding: "8px 12px", fontSize: 14, color: C.tinta, lineHeight: 1.5, whiteSpace: "pre-wrap" } }, c.resumoIA, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.cinza, marginTop: 4 } }, "Gerado por IA \u2014 confira na fonte."))))), pendente && /* @__PURE__ */ React.createElement("div", { "data-foto-pendente": true, style: { display: "flex", justifyContent: "flex-end", margin: "0 0 8px" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: "86%", textAlign: "right" } }, pendente !== "lendo" ? /* @__PURE__ */ React.createElement("img", { src: pendente, alt: "Foto sendo guardada", onLoad: aoFim, style: { display: "block", maxWidth: "100%", maxHeight: 260, borderRadius: 12, opacity: 0.7 } }) : /* @__PURE__ */ React.createElement("div", { style: { padding: "22px 18px", background: "#e8eef8", borderRadius: 12, fontSize: 13, color: C.cinza } }, "Preparando a foto\u2026"), /* @__PURE__ */ React.createElement("div", { role: "status", style: { fontSize: 12, color: C.cinza, marginTop: 2 } }, "Guardando no aparelho\u2026"))), ocupado && /* @__PURE__ */ React.createElement(BalaoIA, null, /* @__PURE__ */ React.createElement("div", { role: "status", style: { display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", border: `1px solid ${C.linhaSoft}`, borderRadius: 14, padding: "8px 12px", fontSize: 13, color: C.cinza } }, "Preparando resposta\u2026 ", /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12 } }, "(", ocupado.length > 40 ? ocupado.slice(0, 40) + "\u2026" : ocupado, ")"))), /* @__PURE__ */ React.createElement("div", { ref: fimRef })), /* @__PURE__ */ React.createElement("div", { style: { flexShrink: 0, background: "#fff", borderTop: `1px solid ${C.linhaSoft}`, padding: "8px 10px calc(8px + env(safe-area-inset-bottom))" } }, /* @__PURE__ */ React.createElement(
    "textarea",
    {
      value: texto,
      onChange: (e) => setTexto(e.target.value),
      rows: 2,
      "aria-label": "Anota\xE7\xE3o ou pergunta",
      placeholder: f ? `Anote ou pergunte sobre a aula ${f.n}\u2026` : "Anote ou pergunte sobre esta sess\xE3o\u2026",
      style: { width: "100%", boxSizing: "border-box", minHeight: 48, maxHeight: 120, padding: "8px 12px", border: `1px solid ${C.linha}`, borderRadius: 12, fontFamily: "DM Sans,sans-serif", fontSize: 16, lineHeight: 1.4, color: C.tinta, background: "#f8fafd", resize: "none" }
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 6 } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: foto,
      "aria-label": "Fotografar um slide",
      style: { ...BTN, flex: "0 0 auto", background: "#fff", border: `1px solid ${C.linha}`, color: C.azul }
    },
    /* @__PURE__ */ React.createElement(IcoCam, { size: 18, color: C.azul }),
    "Foto"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: anotar,
      disabled: !texto.trim(),
      style: { ...BTN, flex: 1, background: "#fff", border: `1px solid ${C.azul}`, color: C.azul, opacity: texto.trim() ? 1 : 0.5 }
    },
    "Anotar"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: perguntar,
      disabled: !texto.trim() || !!ocupado,
      style: { ...BTN, flex: 1.3, background: C.azul, border: "none", color: "#fff", opacity: texto.trim() && !ocupado ? 1 : 0.5 }
    },
    /* @__PURE__ */ React.createElement("img", { src: CCEM_AVATAR, alt: "", width: "20", height: "20", style: { borderRadius: "50%" } }),
    "Perguntar \xE0 IA"
  ))));
}
Object.assign(window, { AulaScreen, ccemFotografarNaAula, ccemAbrirAula, ccemTrocarAula, ccemSairDaAula, ccemNotasDaAula });
