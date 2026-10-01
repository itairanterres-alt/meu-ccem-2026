function badgeColor(tipo) {
  if (tipo === "simposio") return C.azul;
  if (tipo === "mini") return "#0d9488";
  if (tipo === "satelite") return C.ouro;
  return "#64748b";
}
function norm(s) {
  return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function sessionIsPast(s) {
  if (!s || !s.dia || !s.fim) return false;
  return ccemAgora() > ccemInstante(s.dia, s.fim);
}
const BACK_BTN = { width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", border: "none", background: "transparent", cursor: "pointer", borderRadius: 9, flexShrink: 0, padding: 0 };
const PILL = { display: "inline-flex", alignItems: "center", fontFamily: "DM Sans,system-ui,sans-serif", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", borderRadius: 20, whiteSpace: "nowrap", lineHeight: 1.6 };
function BadgePill({ tipo, label, sm }) {
  const bg = badgeColor(tipo);
  return /* @__PURE__ */ React.createElement("span", { style: { ...PILL, background: bg + "1a", color: bg, border: `1px solid ${bg}28`, fontSize: sm ? 8 : 9, padding: sm ? "2px 7px" : "3px 9px" } }, label);
}
function TopicPill({ tema }) {
  const color = TEMAS_COR[tema] || C.cinza;
  return /* @__PURE__ */ React.createElement("span", { style: { ...PILL, background: color + "18", color, border: `1px solid ${color}28`, fontSize: 11, padding: "3px 9px" } }, tema);
}
function IntervalRow({ item }) {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "6px 16px", background: "#f5f8fd", borderTop: `1px solid ${C.linhaSoft}`, borderBottom: `1px solid ${C.linhaSoft}`, margin: "2px 0" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.cinza, fontWeight: 600 } }, item.label), item.dur && /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, marginLeft: "auto" } }, item.dur));
}
function SessaoCard({ id }) {
  const s = SESSOES[id];
  const appState = useAppState();
  useMinuto();
  if (!s) return null;
  const isMarked = !!(appState.marks && appState.marks[id]);
  const noAr = ccemSessaoNoAr(s);
  const bc = badgeColor(s.tipo);
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      "data-sessao": id,
      onClick: () => s.navegavel && go("#/sessao/" + id),
      role: s.navegavel ? "button" : void 0,
      tabIndex: s.navegavel ? 0 : void 0,
      "aria-label": s.navegavel ? s.titulo : void 0,
      onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && s.navegavel && go("#/sessao/" + id),
      style: {
        background: s.tipo === "satelite" ? "#f8fafd" : noAr ? "#eef6ff" : "#fff",
        borderLeft: s.tipo === "satelite" ? `2px solid ${C.linha}` : `3px solid ${noAr ? C.azulSoft : bc}`,
        margin: s.tipo === "satelite" ? "3px 16px" : "5px 12px",
        borderRadius: 8,
        padding: s.tipo === "satelite" ? "7px 10px" : "10px 12px",
        border: `1px solid ${noAr ? "#c2daf8" : C.linhaSoft}`,
        opacity: s.tipo === "satelite" ? 0.75 : 1,
        cursor: s.navegavel ? "pointer" : "default",
        position: "relative"
      }
    },
    noAr && /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", top: 8, right: 8, background: "#22c55e", color: "#fff", fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 10, fontWeight: 700 } }, "Agora"),
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("div", { style: { minWidth: 40, flexShrink: 0, textAlign: "center", paddingTop: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 13.5, fontWeight: 700, color: C.azul, lineHeight: 1 } }, s.inicio), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, marginTop: 3, lineHeight: 1.3 } }, "\u2192", s.fim), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, marginTop: 1 } }, s.dur)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 5, marginBottom: 5 } }, /* @__PURE__ */ React.createElement(BadgePill, { tipo: s.tipo, label: s.badge, sm: true })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: C.tinta, lineHeight: 1.3, marginBottom: 3, paddingRight: noAr ? 36 : 0 } }, s.titulo), s.moderador && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.cinza, marginBottom: 3 } }, "mod. ", s.moderador), s.aDefinir && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.cinza, fontStyle: "italic" } }, "programa\xE7\xE3o a definir"), (s.falas || []).slice(0, 3).map((f, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 5, alignItems: "baseline", fontSize: 11, color: C.cinza, marginTop: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { color: bc, fontWeight: 700, flexShrink: 0, minWidth: 10 } }, f.n, "."), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, minWidth: 0, lineHeight: 1.3 } }, f.titulo && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tinta, fontWeight: 500 } }, f.titulo), " \xB7 "), /* @__PURE__ */ React.createElement("span", null, f.palestrante, f.aConfirmar && /* @__PURE__ */ React.createElement("em", { style: { color: C.cinza } }, " (a confirmar)"))))), (s.falas || []).length > 3 && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.cinza, marginTop: 2, fontStyle: "italic" } }, "+", s.falas.length - 3, " fala(s)\u2026"), s.navegavel && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "flex-end", marginTop: 6, gap: 5 } }, isMarked && /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.azulSoft } }, "marcada"), /* @__PURE__ */ React.createElement(IcoChevR, { size: 14, color: C.cinza }))))
  );
}
function DayTimeline({ dia }) {
  const DAY_START = 8 * 60;
  const DAY_END = dia === DIAS[0] ? 18 * 60 + 10 : 17 * 60 + 35;
  const total = DAY_END - DAY_START;
  function pct(hm) {
    const [h, m] = hm.split(":").map(Number);
    return Math.max(0, Math.min(100, (h * 60 + m - DAY_START) / total * 100));
  }
  const sessoes = (PROGRAMA[dia] || []).filter((i) => i.tipo === "sessao").map((i) => SESSOES[i.id]).filter(Boolean);
  useMinuto();
  const agora = ccemAgora();
  const isToday = ccemDiaDoEvento(agora) === dia;
  const minJoinville = Math.floor((agora - ccemInstante(dia, "00:00")) / 6e4);
  const nowPct = isToday ? pct(Math.floor(minJoinville / 60) + ":" + minJoinville % 60) : -1;
  const bc = (t) => t === "simposio" ? C.azul : t === "mini" ? "#0d9488" : t === "satelite" ? "#94a3b8" : "#334155";
  return /* @__PURE__ */ React.createElement("div", { style: { margin: "0 12px 8px", background: "#fff", borderRadius: 10, padding: "9px 12px 7px", border: `1px solid ${C.linhaSoft}` } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: C.cinza, marginBottom: 5 } }, dia === DIAS[0] ? "A jornada \xB7 sexta 23/out" : "A jornada \xB7 s\xE1bado 24/out"), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: 20, background: C.cinzaClr, borderRadius: 4, overflow: "visible" } }, sessoes.map((s) => {
    const l = pct(s.inicio), w = Math.max(pct(s.fim) - l, 0.8);
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: s.id,
        onClick: () => s.navegavel && go("#/sessao/" + s.id),
        role: s.navegavel ? "button" : void 0,
        tabIndex: s.navegavel ? 0 : void 0,
        title: s.titulo,
        "aria-label": s.titulo,
        style: { position: "absolute", top: 2, bottom: 2, left: l + "%", width: w + "%", background: bc(s.tipo), borderRadius: 2, cursor: s.navegavel ? "pointer" : "default", opacity: 0.85, transition: "opacity .15s" },
        onMouseOver: (e) => {
          e.currentTarget.style.opacity = 1;
          e.currentTarget.style.transform = "scaleY(1.2)";
        },
        onMouseOut: (e) => {
          e.currentTarget.style.opacity = 0.85;
          e.currentTarget.style.transform = "";
        }
      }
    );
  }), nowPct >= 0 && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: -3, bottom: -3, left: nowPct + "%", width: 2, background: C.azulSoft, borderRadius: 1, zIndex: 5, boxShadow: `0 0 0 2px rgba(45,84,192,.2)` } })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 4, fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza } }, [8, 10, 12, 14, 16, 18].filter((h) => h * 60 <= DAY_END + 30).map((h) => /* @__PURE__ */ React.createElement("span", { key: h }, h, "h"))));
}
function SlideDisplay({ sessaoId, falaIdx }) {
  const slKey = "ccem_slides_" + sessaoId + "_" + falaIdx;
  const [slides] = useState(() => {
    try {
      const r = localStorage.getItem(slKey);
      return r ? JSON.parse(r) : null;
    } catch (e) {
      return null;
    }
  });
  if (!slides) return null;
  return /* @__PURE__ */ React.createElement("div", { style: { marginTop: 5, display: "inline-flex", alignItems: "center", gap: 6, background: C.verde + "12", borderRadius: 6, padding: "4px 9px" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12 } }, "\u{1F4CE}"), /* @__PURE__ */ React.createElement(
    "a",
    {
      href: slides.dataUrl,
      download: slides.name,
      style: { fontSize: 11, fontWeight: 600, color: C.verde, textDecoration: "none" }
    },
    slides.name
  ));
}
function SlideUploadBtn({ sessaoId, falaIdx }) {
  const slKey = "ccem_slides_" + sessaoId + "_" + falaIdx;
  const [slides, setSlides] = useState(() => {
    try {
      const r = localStorage.getItem(slKey);
      return r ? JSON.parse(r) : null;
    } catch (e) {
      return null;
    }
  });
  const slInputRef = useRef(null);
  function handleSlideFile(file) {
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      showToast("Arquivo muito grande \xB7 m\xE1x. 4 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = { name: file.name, type: file.type, size: file.size, dataUrl: ev.target.result, ts: Date.now() };
      try {
        localStorage.setItem(slKey, JSON.stringify(data));
      } catch (e) {
        showToast("Armazenamento cheio");
        return;
      }
      setSlides(data);
      showToast("Slides enviados \u2713");
    };
    reader.readAsDataURL(file);
  }
  function removeSlides() {
    localStorage.removeItem(slKey);
    setSlides(null);
    showToast("Slides removidos");
  }
  if (slides) {
    return /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6, background: C.verde + "12", borderRadius: 7, padding: "6px 9px", display: "flex", alignItems: "center", gap: 7 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13 } }, "\u{1F4CE}"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: C.verde, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, slides.name), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, marginTop: 1 } }, (slides.size / 1024).toFixed(0), " KB")), /* @__PURE__ */ React.createElement(
      "a",
      {
        href: slides.dataUrl,
        download: slides.name,
        style: { fontSize: 11, fontWeight: 600, color: C.azul, textDecoration: "none", background: C.azulBg, padding: "4px 9px", borderRadius: 6, flexShrink: 0 }
      },
      "\u2193"
    ), /* @__PURE__ */ React.createElement("button", { onClick: removeSlides, style: { background: "none", border: "none", color: C.cinza, cursor: "pointer", fontSize: 14, padding: "0 2px", flexShrink: 0 } }, "\xD7"));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "file",
      ref: slInputRef,
      accept: ".pdf,.ppt,.pptx,.key,.png,.jpg,.jpeg",
      style: { display: "none" },
      onChange: (e) => {
        handleSlideFile(e.target.files && e.target.files[0]);
        e.target.value = "";
      }
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => slInputRef.current && slInputRef.current.click(),
      style: { marginTop: 6, display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: C.cinza, background: "none", border: `1px dashed ${C.linha}`, borderRadius: 7, padding: "4px 10px", cursor: "pointer", fontFamily: "DM Sans,sans-serif" }
    },
    "\u{1F4CE} Enviar slides"
  ));
}
function SessaoDetail({ id }) {
  const s = SESSOES[id];
  const appState = useAppState();
  const isMarked = !!(appState.marks && appState.marks[id]);
  const idx = SESSOES_NAV.indexOf(id);
  const prevId = idx > 0 ? SESSOES_NAV[idx - 1] : null;
  const nextId = idx >= 0 && idx < SESSOES_NAV.length - 1 ? SESSOES_NAV[idx + 1] : null;
  const bc = s ? badgeColor(s.tipo) : C.azul;
  const isPast = sessionIsPast(s);
  const [ctxOpen, setCtxOpen] = useState(!isPast);
  useEffect(() => {
    const fn = (e) => {
      if (/^(INPUT|TEXTAREA)$/.test((e.target || {}).tagName || "")) return;
      if (e.key === "ArrowLeft" && prevId) go("#/sessao/" + prevId);
      if (e.key === "ArrowRight" && nextId) go("#/sessao/" + nextId);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [prevId, nextId]);
  if (!s) return /* @__PURE__ */ React.createElement("div", { style: { height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { background: C.azul, height: 52, display: "flex", alignItems: "center", padding: "0 8px", flexShrink: 0, gap: 8 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => window.history.back(), style: BACK_BTN }, /* @__PURE__ */ React.createElement(IcoArrowL, { size: 20, color: "#fff" })), /* @__PURE__ */ React.createElement("span", { style: { color: "#fff", fontSize: 14, fontWeight: 600 } }, "Sess\xE3o n\xE3o encontrada")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: C.cinza, fontSize: 13 } }, "Sess\xE3o n\xE3o encontrada.", /* @__PURE__ */ React.createElement("button", { onClick: () => go("#/"), style: { color: C.azul, background: "none", border: `1px solid ${C.azul}`, padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit" } }, "Voltar ao programa")));
  function toggleMark() {
    updateAppState((st) => {
      if (!st.marks) st.marks = {};
      if (st.marks[id]) delete st.marks[id];
      else st.marks[id] = true;
    });
    if (isMarked) showToast("Desmarcada");
    else showToast(
      "Marcada \xB7 adicione ao calend\xE1rio para ser lembrado",
      { rotulo: "Adicionar", aoTocar: () => ccemBaixarIcs([s], "ccem-" + id + ".ics") }
    );
  }
  function handleAnotar() {
    window._ccemCtxSessaoId = id;
    window._ccemAnotarIntent = true;
    showToast("Anote pelo Assistente \xB7 vai para o Caderno");
    go("#/assistente");
  }
  async function handleShare() {
    const texto = `${s.badge} \u2014 ${s.titulo}
${s.dia} \xB7 ${s.inicio}\u2013${s.fim} \xB7 Expoville, Joinville/SC

#CCEM2026 #SBEMSC`;
    if (navigator.share) {
      try {
        await navigator.share({ title: s.titulo, text: texto, url: "https://ccem2026.com.br" });
      } catch (e) {
      }
    } else {
      try {
        await navigator.clipboard.writeText(texto);
        showToast("Copiado \u2713");
      } catch (e) {
        showToast("Compartilhar: " + s.badge);
      }
    }
  }
  function handleAskAI() {
    window._ccemCtxSessaoId = id;
    showToast("Assistente contextualizado \u2192 " + s.badge);
    go("#/assistente");
  }
  const navBtn = (on) => ({
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: `1px solid rgba(255,255,255,${on ? 0.3 : 0.12})`,
    background: on ? "rgba(255,255,255,.14)" : "transparent",
    borderRadius: 9,
    cursor: on ? "pointer" : "default",
    opacity: on ? 1 : 0.28,
    padding: 0
  });
  return /* @__PURE__ */ React.createElement("div", { style: { height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", background: C.papel } }, /* @__PURE__ */ React.createElement("div", { style: { background: C.azul, color: "#fff", flexShrink: 0, boxShadow: "0 2px 12px rgba(10,18,50,.3)" } }, /* @__PURE__ */ React.createElement("div", { style: { height: 52, display: "flex", alignItems: "center", gap: 8, padding: "0 8px" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => window.history.back(), style: BACK_BTN }, /* @__PURE__ */ React.createElement(IcoArrowL, { size: 20, color: "#fff" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, s.titulo), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, opacity: 0.75, marginTop: 1 } }, s.inicio, "\u2013", s.fim, " \xB7 ", s.dur)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, flexShrink: 0 } }, /* @__PURE__ */ React.createElement("button", { onClick: handleShare, title: "Compartilhar", style: navBtn(true) }, /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "#fff", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("circle", { cx: "18", cy: "5", r: "3" }), /* @__PURE__ */ React.createElement("circle", { cx: "6", cy: "12", r: "3" }), /* @__PURE__ */ React.createElement("circle", { cx: "18", cy: "19", r: "3" }), /* @__PURE__ */ React.createElement("line", { x1: "8.59", y1: "13.51", x2: "15.42", y2: "17.49" }), /* @__PURE__ */ React.createElement("line", { x1: "15.41", y1: "6.51", x2: "8.59", y2: "10.49" }))), /* @__PURE__ */ React.createElement("button", { onClick: () => prevId && go("#/sessao/" + prevId), style: navBtn(!!prevId) }, /* @__PURE__ */ React.createElement(IcoChevL, { size: 18, color: "#fff" })), /* @__PURE__ */ React.createElement("button", { onClick: () => nextId && go("#/sessao/" + nextId), style: navBtn(!!nextId) }, /* @__PURE__ */ React.createElement(IcoChevR, { size: 18, color: "#fff" })))), idx >= 0 && /* @__PURE__ */ React.createElement("div", { style: { height: 2, background: "rgba(255,255,255,.1)" } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", background: C.ouro, width: `${(idx + 1) / SESSOES_NAV.length * 100}%`, transition: "width .3s" } }))), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflowY: "auto", padding: "14px 14px 28px" } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 14, padding: "14px", border: `1px solid ${C.linhaSoft}`, marginBottom: 10, boxShadow: "0 2px 10px rgba(29,62,138,.05)" } }, /* @__PURE__ */ React.createElement(
    "div",
    {
      style: { display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", cursor: isPast ? "pointer" : "default" },
      onClick: isPast ? () => setCtxOpen((v) => !v) : void 0,
      role: isPast ? "button" : void 0,
      tabIndex: isPast ? 0 : void 0,
      "aria-expanded": isPast ? ctxOpen : void 0,
      onKeyDown: isPast ? (e) => (e.key === "Enter" || e.key === " ") && setCtxOpen((v) => !v) : void 0
    },
    /* @__PURE__ */ React.createElement(BadgePill, { tipo: s.tipo, label: s.badge }),
    (s.temas || []).map((t) => /* @__PURE__ */ React.createElement(TopicPill, { key: t, tema: t })),
    isPast && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto", fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza } }, ctxOpen ? "\u25BE recolher" : "\u25B8 contexto")
  ), ctxOpen && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 9 } }, /* @__PURE__ */ React.createElement("h2", { style: { fontFamily: "Georgia,serif", fontSize: 15.5, fontWeight: 700, color: C.tinta, lineHeight: 1.35, letterSpacing: "-0.01em", margin: "0 0 8px" } }, s.titulo), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.azulSoft, fontWeight: 700 } }, s.inicio), /* @__PURE__ */ React.createElement("span", null, "\u2192 ", s.fim), /* @__PURE__ */ React.createElement("span", null, "\xB7 ", s.dur, " \xB7 ", s.dia)), s.moderador && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 9, padding: "6px 10px", background: C.azulBg + "60", borderRadius: 7, display: "flex", gap: 8, alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.07em", flexShrink: 0 } }, "Moderador"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: C.tinta, fontWeight: 500 } }, s.moderador))), !ctxOpen && isPast && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, marginTop: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.azulSoft, fontWeight: 700 } }, s.inicio, "\u2013", s.fim), s.moderador && /* @__PURE__ */ React.createElement("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, "mod. ", s.moderador))), s.falas && s.falas.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 14, padding: "12px 14px", border: `1px solid ${C.linhaSoft}`, marginBottom: 10, boxShadow: "0 2px 10px rgba(29,62,138,.05)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.cinza, marginBottom: 10, fontWeight: 600 } }, "Programa da sess\xE3o"), s.falas.map((f, i) => {
    const bio = SPEAKER_BIOS[f.palestrante];
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 10, padding: "8px 0", borderBottom: i < s.falas.length - 1 ? `1px solid ${C.linhaSoft}` : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 22, height: 22, borderRadius: 7, background: bc + "1a", color: bc, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 } }, f.n === "\xB7" ? "\xB7" : f.n), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, f.titulo && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, fontWeight: 600, color: C.tinta, lineHeight: 1.3, marginBottom: 2 } }, f.titulo), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tinta, fontWeight: 500 } }, f.palestrante, f.aConfirmar && /* @__PURE__ */ React.createElement("em", { style: { color: C.cinza, fontWeight: 400 } }, " (a confirmar)")), bio && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.cinza, marginTop: 1 } }, bio.role), f.label && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 3, display: "inline-block", background: C.ouroBg, color: C.ouro, fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 8 } }, f.label), /* @__PURE__ */ React.createElement(SlideDisplay, { sessaoId: id, falaIdx: i })));
  })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("button", { onClick: handleAnotar, style: { flex: 3, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: C.azul, color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontFamily: "DM Sans,sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: "-0.01em", boxShadow: "0 2px 8px rgba(29,62,138,.25)" } }, /* @__PURE__ */ React.createElement(IcoCapture, { size: 17, color: "#fff" }), "Anotar"), /* @__PURE__ */ React.createElement("button", { onClick: toggleMark, style: { flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, background: isMarked ? C.ouroBg : "#fff", color: isMarked ? C.ouro : C.cinza, border: `1px solid ${isMarked ? C.ouro : C.linha}`, borderRadius: 10, padding: "10px 14px", fontFamily: "DM Sans,sans-serif", fontSize: 11, fontWeight: isMarked ? 700 : 500, cursor: "pointer" } }, /* @__PURE__ */ React.createElement(IcoStar, { size: 16, color: isMarked ? C.ouro : C.cinza, filled: isMarked }), isMarked ? "Marcado" : "Marcar")), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => ccemBaixarIcs([s], "ccem-" + id + ".ics"),
      style: { width: "100%", minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#fff", color: C.azul, border: `1px solid ${C.linha}`, borderRadius: 10, padding: "10px 14px", fontFamily: "DM Sans,sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 8 }
    },
    /* @__PURE__ */ React.createElement(IcoCal, { size: 16, color: C.azul }),
    "Adicionar ao calend\xE1rio"
  ), /* @__PURE__ */ React.createElement("button", { onClick: handleAskAI, style: { width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", background: "#f0f4fc", border: `1px solid ${C.linha}`, borderRadius: 10, cursor: "pointer", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 26, height: 26, borderRadius: 7, background: C.azul, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "#fff", strokeWidth: "2", strokeLinecap: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" }), /* @__PURE__ */ React.createElement("circle", { cx: "9", cy: "10", r: "1", fill: "#fff", stroke: "none" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "10", r: "1", fill: "#fff", stroke: "none" }), /* @__PURE__ */ React.createElement("circle", { cx: "15", cy: "10", r: "1", fill: "#fff", stroke: "none" }))), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "left", flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,sans-serif", fontSize: 12, fontWeight: 600, color: C.azul } }, "Perguntar ao Assistente"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, marginTop: 1 } }, "contextualizado nesta sess\xE3o")), /* @__PURE__ */ React.createElement(IcoChevR, { size: 15, color: C.cinza })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, prevId && SESSOES[prevId] && /* @__PURE__ */ React.createElement("button", { onClick: () => go("#/sessao/" + prevId), style: { flex: 1, background: "#fff", border: `1px solid ${C.linha}`, borderRadius: 10, padding: "9px 12px", textAlign: "left", cursor: "pointer", minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 } }, "\u2190 Anterior"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 500, color: C.tinta, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, SESSOES[prevId].titulo)), nextId && SESSOES[nextId] && /* @__PURE__ */ React.createElement("button", { onClick: () => go("#/sessao/" + nextId), style: { flex: 1, background: "#fff", border: `1px solid ${C.linha}`, borderRadius: 10, padding: "9px 12px", textAlign: "right", cursor: "pointer", minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 } }, "Pr\xF3xima \u2192"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 500, color: C.tinta, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, SESSOES[nextId].titulo)))));
}
function ProgramaScreen() {
  const appState = useAppState();
  const [dia, setDia] = useState(() => {
    const hoje = ccemDiaDoEvento();
    try {
      const salvo = JSON.parse(sessionStorage.getItem("ccem_dia") || "null");
      if (salvo && DIAS.includes(salvo.dia) && salvo.ref === (hoje || "fora")) return salvo.dia;
    } catch (e) {
    }
    return hoje || DIAS[0];
  });
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState(null);
  const [soMarcados, setSoMarcados] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const listRef = useRef(null);
  useEffect(() => {
    try {
      sessionStorage.setItem("ccem_dia", JSON.stringify({ dia, ref: ccemDiaDoEvento() || "fora" }));
    } catch (e) {
    }
  }, [dia]);
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const key = "ccem_scroll_" + dia;
    const saved = sessionStorage.getItem(key);
    if (saved !== null) {
      el.scrollTop = parseInt(saved) || 0;
    } else if (ccemDiaDoEvento() === dia) {
      const e = ccemEstado();
      const alvo = e.agora && e.agora.dia === dia ? e.agora : e.aSeguir && e.aSeguir.dia === dia ? e.aSeguir : null;
      const card = alvo && el.querySelector('[data-sessao="' + alvo.id + '"]');
      if (card) el.scrollTop += card.getBoundingClientRect().top - el.getBoundingClientRect().top - 8;
    }
    return () => {
      if (el) try {
        sessionStorage.setItem(key, String(el.scrollTop));
      } catch (e) {
      }
    };
  }, [dia]);
  const buscaNorm = useMemo(() => norm(busca), [busca]);
  const items = useMemo(() => {
    return (PROGRAMA[dia] || []).filter((item) => {
      if (item.tipo === "intervalo") return !buscaNorm && !filtroTipo && !soMarcados;
      const s = SESSOES[item.id];
      if (!s) return false;
      if (soMarcados && !appState.marks?.[item.id]) return false;
      if (filtroTipo && s.tipo !== filtroTipo) return false;
      if (buscaNorm) {
        const hay = norm(s.titulo + " " + (s.moderador || "") + " " + (s.falas || []).map((f) => f.palestrante + " " + (f.titulo || "")).join(" ") + " " + (s.temas || []).join(" "));
        if (!hay.includes(buscaNorm)) return false;
      }
      return true;
    });
  }, [dia, buscaNorm, filtroTipo, soMarcados, appState.marks]);
  const totalSessoes = (PROGRAMA[dia] || []).filter((i) => i.tipo === "sessao" && SESSOES[i.id]?.navegavel).length;
  const markedCount = (PROGRAMA[dia] || []).filter((i) => i.tipo === "sessao" && appState.marks?.[i.id]).length;
  const hasFilter = !!(filtroTipo || soMarcados);
  const chipSt = (active, bg) => ({ display: "inline-flex", alignItems: "center", justifyContent: "center", background: active ? bg : "#fff", color: active ? "#fff" : C.cinza, fontFamily: "DM Sans,sans-serif", fontSize: 12, fontWeight: active ? 600 : 500, padding: "7px 14px", borderRadius: 20, border: `1px solid ${active ? bg : C.linha}`, cursor: "pointer", whiteSpace: "nowrap", gap: 4 });
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, padding: "9px 12px 7px", borderBottom: `1px solid ${C.linha}`, background: "#fff", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", background: "#f0f4fc", borderRadius: 10, padding: 3, gap: 2, flex: 1 } }, DIAS.map((d) => /* @__PURE__ */ React.createElement("button", { key: d, onClick: () => setDia(d), style: { flex: 1, padding: "6px 0", border: "none", borderRadius: 8, fontFamily: "DM Sans,sans-serif", fontWeight: 700, cursor: "pointer", background: dia === d ? C.azul : "transparent", color: dia === d ? "#fff" : C.cinza, transition: "all .15s" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 16, lineHeight: 1, display: "block" } }, d.includes("23") ? "23" : "24"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" } }, d.includes("sex") ? "SEX" : "S\xC1B")))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexShrink: 0, alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.05em" } }, totalSessoes, " sess\xF5es"), markedCount > 0 && /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.azulSoft, marginTop: 1 } }, markedCount, " marcadas")), /* @__PURE__ */ React.createElement("button", { onClick: () => setFilterOpen(true), style: { position: "relative", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", border: `1px solid ${hasFilter ? C.azul : C.linha}`, borderRadius: 10, cursor: "pointer", flexShrink: 0, color: hasFilter ? C.azul : C.cinza } }, /* @__PURE__ */ React.createElement(IcoFilter, { size: 16, color: hasFilter ? C.azul : C.cinza }), hasFilter && /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", top: -3, right: -3, width: 8, height: 8, borderRadius: "50%", background: C.azul, border: "2px solid #fff" } })))), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px 0", background: "#fff", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", display: "flex", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", left: 10, pointerEvents: "none" } }, /* @__PURE__ */ React.createElement(IcoSearch, { size: 14, color: C.cinza })), /* @__PURE__ */ React.createElement(
    "input",
    {
      value: busca,
      onChange: (e) => setBusca(e.target.value),
      placeholder: "Buscar sess\xE3o, palestrante ou tema\u2026",
      style: { width: "100%", padding: "7px 30px 7px 30px", border: `1px solid ${C.linha}`, borderRadius: 8, fontFamily: "DM Sans,sans-serif", fontSize: 12, color: C.tinta, background: "#f8fafd", outline: "none", boxSizing: "border-box" }
    }
  ), busca && /* @__PURE__ */ React.createElement("button", { onClick: () => setBusca(""), style: { position: "absolute", right: 8, background: "none", border: "none", cursor: "pointer", color: C.cinza, display: "flex", padding: 0 } }, /* @__PURE__ */ React.createElement(IcoX, { size: 14 })))), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px 0", background: "#fff", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setSoMarcados((v) => !v),
      "aria-pressed": soMarcados,
      style: {
        width: "100%",
        minHeight: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        background: soMarcados ? C.ouroBg : "#fff",
        color: soMarcados ? C.ouro : C.tinta,
        border: `1px solid ${soMarcados ? C.ouro : C.linha}`,
        borderRadius: 9,
        cursor: "pointer",
        fontFamily: "DM Sans,sans-serif",
        fontSize: 13,
        fontWeight: 600
      }
    },
    /* @__PURE__ */ React.createElement(IcoStar, { size: 15, color: soMarcados ? C.ouro : C.cinza, filled: soMarcados }),
    soMarcados ? "Mostrando s\xF3 marcadas" : "S\xF3 marcadas",
    /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 500, color: C.cinza } }, "\xB7 ", markedCount, " neste dia")
  )), /* @__PURE__ */ React.createElement(DayTimeline, { dia }), hasFilter && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 5, padding: "5px 12px", background: "#f0f4fc", borderBottom: `1px solid ${C.linhaSoft}`, flexShrink: 0, overflowX: "auto", scrollbarWidth: "none", alignItems: "center" } }, filtroTipo && /* @__PURE__ */ React.createElement("span", { style: { ...chipSt(true, C.azul), fontSize: 11, padding: "3px 10px" } }, filtroTipo === "simposio" ? "Simp\xF3sio" : filtroTipo === "mini" ? "Mini" : "Sat\xE9lite"), soMarcados && /* @__PURE__ */ React.createElement("span", { style: { ...chipSt(true, C.ouro), fontSize: 11, padding: "3px 10px" } }, "\u2605 Marcados"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setFiltroTipo(null);
    setSoMarcados(false);
  }, style: { border: "none", background: "none", color: C.cinza, fontSize: 11, cursor: "pointer", fontFamily: "inherit", padding: "3px 6px", flexShrink: 0 } }, "Limpar \xD7")), /* @__PURE__ */ React.createElement("div", { ref: listRef, style: { flex: 1, overflowY: "auto", paddingBottom: 16 } }, items.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "40px 20px", color: C.cinza } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 28, marginBottom: 10 } }, "\u25CB"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, marginBottom: 12 } }, "Nenhuma sess\xE3o encontrada"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setBusca("");
    setFiltroTipo(null);
    setSoMarcados(false);
  }, style: { border: `1px solid ${C.linha}`, background: "#fff", color: C.azul, padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12 } }, "Limpar filtros")) : items.map((item, i) => item.tipo === "intervalo" ? /* @__PURE__ */ React.createElement(IntervalRow, { key: i, item }) : /* @__PURE__ */ React.createElement(SessaoCard, { key: item.id, id: item.id })), items.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px", fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, textAlign: "center", letterSpacing: "0.04em" } }, "toque para abrir a sess\xE3o")), filterOpen && /* @__PURE__ */ React.createElement(
    "div",
    {
      style: { position: "fixed", inset: 0, zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end", background: "rgba(0,0,0,.38)" },
      onClick: () => setFilterOpen(false)
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        style: { background: "#fff", borderRadius: "18px 18px 0 0", padding: "20px 18px 36px", maxWidth: 440, width: "100%", margin: "0 auto", boxShadow: "0 -4px 32px rgba(10,18,50,.18)" },
        onClick: (e) => e.stopPropagation()
      },
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: C.cinza, fontWeight: 600 } }, "Filtrar sess\xF5es"), /* @__PURE__ */ React.createElement("button", { onClick: () => setFilterOpen(false), style: { background: "none", border: "none", fontSize: 22, color: C.cinza, cursor: "pointer", lineHeight: 1, padding: "0 4px" } }, "\xD7")),
      /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 9 } }, "Tipo de sess\xE3o"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 7, flexWrap: "wrap" } }, [["simposio", "Simp\xF3sio"], ["mini", "Mini-Confer\xEAncia"], ["satelite", "Sat\xE9lite"]].map(([t, lbl]) => /* @__PURE__ */ React.createElement("button", { key: t, onClick: () => setFiltroTipo(filtroTipo === t ? null : t), style: chipSt(filtroTipo === t, C.azul) }, lbl)))),
      /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 20 } }, /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => setSoMarcados((v) => !v),
          style: { ...chipSt(soMarcados, C.ouro), width: "100%", justifyContent: "center" }
        },
        "\u2605 Mostrar apenas marcados"
      )),
      hasFilter && /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => {
            setFiltroTipo(null);
            setSoMarcados(false);
          },
          style: { width: "100%", border: `1px solid ${C.linha}`, background: "#fff", color: C.cinza, borderRadius: 8, padding: "9px", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", marginBottom: 8 }
        },
        "Limpar filtros"
      ),
      /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => setFilterOpen(false),
          style: { width: "100%", background: C.azul, color: "#fff", border: "none", borderRadius: 10, padding: "11px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }
        },
        "Ver resultados"
      )
    )
  ));
}
function TrabalhosScreen() {
  const [cat, setCat] = useState("all");
  const [selected, setSelected] = useState(null);
  const filtered = cat === "all" ? WORKS : WORKS.filter((w) => w.cat === cat);
  const counts = {};
  WORKS.forEach((w) => {
    counts[w.cat] = (counts[w.cat] || 0) + 1;
  });
  const [votes, setVotes] = useState({});
  if (selected) {
    const w = WORKS.find((x) => x.id === selected);
    if (!w) return null;
    return /* @__PURE__ */ React.createElement("div", { style: { height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", background: C.papel } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "#fff", borderBottom: `1px solid ${C.linha}`, flexShrink: 0 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setSelected(null), style: { background: "none", border: "none", cursor: "pointer", color: C.azul, display: "flex", alignItems: "center", gap: 4, fontFamily: "DM Sans,sans-serif", fontSize: 12, padding: 0 } }, /* @__PURE__ */ React.createElement(IcoArrowL, { size: 16, color: C.azul }), " Voltar"), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, marginLeft: "auto" } }, w.id)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflowY: "auto", padding: "14px 14px 28px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, background: C.cinzaClr, padding: "2px 8px", borderRadius: 10, textTransform: "uppercase", letterSpacing: "0.06em" } }, WORK_CATS.find((c) => c.id === w.cat)?.label || w.cat), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.ouro, textTransform: "uppercase", letterSpacing: "0.06em" } }, w.type)), /* @__PURE__ */ React.createElement("h2", { style: { fontFamily: "Georgia,serif", fontSize: 16, fontWeight: 600, color: C.tinta, lineHeight: 1.3, margin: "0 0 8px" } }, w.title), /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 12px", background: C.ouroBg + "60", borderLeft: `3px solid ${C.ouro}`, borderRadius: "0 6px 6px 0", fontSize: 13, fontStyle: "italic", color: C.tinta, lineHeight: 1.5, marginBottom: 12 } }, '"', w.message, '"'), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.cinza, marginBottom: 12 } }, w.authors), w.audio && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#f5f8fd", borderRadius: 10, border: `1px dashed ${C.linha}`, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 34, height: 34, borderRadius: "50%", background: C.cinzaClr, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: C.cinza }, /* @__PURE__ */ React.createElement("path", { d: "M8 5v14l11-7z" }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.06em" } }, "\xC1udio do autor"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, color: C.cinza, marginTop: 1 } }, "dispon\xEDvel na vers\xE3o com os trabalhos reais"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 4 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setVotes((v) => ({ ...v, [w.id]: !v[w.id] })), style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "10px", border: `1px solid ${votes[w.id] ? C.ouro : C.linha}`, background: votes[w.id] ? C.ouroBg : "#fff", color: votes[w.id] ? C.ouro : C.cinza, borderRadius: 9, cursor: "pointer", fontFamily: "DM Sans,sans-serif", fontSize: 12, fontWeight: votes[w.id] ? 600 : 400 } }, "\u2605 ", w.votes + (votes[w.id] ? 1 : 0), " votos"), /* @__PURE__ */ React.createElement("button", { onClick: () => showToast("Pergunta enviada ao autor"), style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "10px", border: "none", background: C.azul, color: "#fff", borderRadius: 9, cursor: "pointer", fontFamily: "DM Sans,sans-serif", fontSize: 12, fontWeight: 600 } }, /* @__PURE__ */ React.createElement(IcoChat, { size: 14, color: "#fff" }), " Perguntar"))));
  }
  return /* @__PURE__ */ React.createElement("div", { style: { height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px 6px", background: "#fff", borderBottom: `1px solid ${C.linha}`, flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 } }, /* @__PURE__ */ React.createElement("h2", { style: { fontFamily: "Georgia,serif", fontSize: 17, fontWeight: 700, color: C.tinta, margin: 0 } }, "Trabalhos"), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.05em" } }, filtered.length, " de ", WORKS.length)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", padding: "8px 0 2px", gap: 5, overflowX: "auto", scrollbarWidth: "none" } }, WORK_CATS.map((c) => {
    const n = c.id === "all" ? WORKS.length : counts[c.id] || 0;
    if (c.id !== "all" && n === 0) return null;
    return /* @__PURE__ */ React.createElement("button", { key: c.id, onClick: () => setCat(c.id), style: { flexShrink: 0, border: `1px solid ${cat === c.id ? C.azul : C.linha}`, background: cat === c.id ? C.azul : "#fff", color: cat === c.id ? "#fff" : C.cinza, borderRadius: 16, padding: "4px 11px", fontSize: 11.5, fontFamily: "inherit", cursor: "pointer", whiteSpace: "nowrap" } }, c.label, " ", /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11 } }, n));
  }))), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflowY: "auto", padding: "8px 12px 20px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-start", gap: 6, padding: "8px 10px", background: C.ouroBg + "50", borderRadius: 8, marginBottom: 8, border: `1px solid ${C.ouroBg}` } }, /* @__PURE__ */ React.createElement("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: C.ouro, strokeWidth: "2", strokeLinecap: "round", style: { flexShrink: 0, marginTop: 1 } }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "10" }), /* @__PURE__ */ React.createElement("path", { d: "M12 8v4M12 16h.01" })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "#92400e", lineHeight: 1.4 } }, "Demonstra\xE7\xE3o de conceito \u2014 trabalhos fict\xEDcios para valida\xE7\xE3o com a Comiss\xE3o Cient\xEDfica.")), filtered.map((w) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: w.id,
      onClick: () => setSelected(w.id),
      role: "button",
      tabIndex: 0,
      "aria-label": w.title,
      onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && setSelected(w.id),
      style: { background: "#fff", borderRadius: 10, padding: "11px 12px", marginBottom: 7, border: `1px solid ${C.linhaSoft}`, cursor: "pointer", transition: "transform .12s" },
      onMouseOver: (e) => e.currentTarget.style.transform = "translateY(-1px)",
      onMouseOut: (e) => e.currentTarget.style.transform = ""
    },
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 5, alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, background: C.cinzaClr, padding: "2px 7px", borderRadius: 8, textTransform: "uppercase", letterSpacing: "0.06em" } }, w.type), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, marginLeft: "auto" } }, w.id)),
    /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: C.tinta, lineHeight: 1.3, marginBottom: 4 } }, w.title),
    /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, color: C.cinza, fontStyle: "italic", lineHeight: 1.4, marginBottom: 6, paddingLeft: 8, borderLeft: `2px solid ${C.ouro}` } }, w.message),
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, alignItems: "center" } }, w.audio && /* @__PURE__ */ React.createElement("span", { style: { color: C.verde } }, "\u25B6 \xE1udio"), /* @__PURE__ */ React.createElement("span", null, "\u2605 ", w.votes), /* @__PURE__ */ React.createElement("span", null, w.qa, " perg."), /* @__PURE__ */ React.createElement(IcoChevR, { size: 12, color: C.cinza, style: { marginLeft: "auto" } }))
  ))));
}
function classifyIntent(text) {
  const t = norm(text);
  if (t.includes("slide") || t.includes("foto") || t.includes("imagem") || t.includes("tira") || t.includes("fotograf")) return "anotacao";
  if (t.includes("sess") || t.includes("busca") || t.includes("trabalh") || t.includes("lp(a)") || t.includes("semag") || t.includes("compar") || t.includes("disse") || t.includes("falar")) return "busca";
  if (t.includes("export") || t.includes("onde") || t.includes("horas") || t.includes("sala") || t.includes("funciona") || t.includes("submiss") || t.includes("como")) return "concierge";
  return "free";
}
const MOCK_AI = {
  anotacao: [{ tag: "Anota\xE7\xE3o", html: "Envie uma <strong>foto do slide</strong> (bot\xE3o \u{1F4F7}) ou descreva aqui o conte\xFAdo em texto.<br><br>Vou estruturar em: <em>mensagem principal</em>, pontos de suporte e refer\xEAncia bibliogr\xE1fica quando vis\xEDvel no slide.", actions: ["Qual a refer\xEAncia?", "Estruturar como nota"] }],
  busca: [{ tag: "Busca \xB7 Programa e Trabalhos", html: '<strong>Sess\xF5es relacionadas:</strong> Simp\xF3sio 1 \u2014 DM2, Simp\xF3sio 10 \u2014 Obesidade, Mini \xB7 IA no consult\xF3rio.<br><br><strong>Trabalhos:</strong> P-001 (semaglutida 24m), P-002 (tirzepatida coorte real), P-005 (TSH supressivo).<br><br><em style="font-size:11px;color:#5b6577">Refine a busca para mais precis\xE3o.</em>', actions: ["Ver Simp\xF3sio 1", "Ver trabalhos diabetes"] }],
  concierge: [{ tag: "Info pr\xE1tica", html: "Para <strong>exportar o caderno</strong>: aba Caderno \u2192 bot\xE3o PDF no rodap\xE9.<br><br>Todos os dados ficam salvos neste dispositivo, associados ao seu ID local. O PDF inclui todas as notas com hora e sess\xE3o de origem.", actions: ["Como funciona a submiss\xE3o?", "Onde fica a sala?"] }],
  free: [{ tag: "Assistente CCEM", html: 'Pronto para ajudar. Tr\xEAs formas de usar:<br><br>\u{1F4F8} <strong>Foto ou descri\xE7\xE3o de slide</strong> \u2192 nota estruturada com take-home e refer\xEAncia<br>\u{1F50D} <strong>Busca sem\xE2ntica</strong> \u2014 "que sess\xF5es falam de Lp(a)?", "trabalhos com semaglutida?"<br>\u{1F4AC} <strong>D\xFAvidas pr\xE1ticas</strong> \u2014 hor\xE1rios, salas, exporta\xE7\xE3o do caderno<br><br><em style="font-size:11px;color:#5b6577">N\xE3o forne\xE7o orienta\xE7\xE3o cl\xEDnica para casos de pacientes.</em>' }]
};
const CCEM_SISTEMA = "Voc\xEA \xE9 o assistente cient\xEDfico do Meu CCEM 2026 \u2014 Congresso Catarinense de Endocrinologia e Metabologia, Joinville/SC, 23\u201324 out 2026. Fun\xE7\xF5es: (1) estruturar anota\xE7\xF5es de slides/\xE1udio em notas cl\xEDnicas edit\xE1veis, (2) busca sem\xE2ntica no programa e trabalhos, (3) concierge para d\xFAvidas pr\xE1ticas do evento. Responda em portugu\xEAs brasileiro, tom cl\xEDnico direto. M\xE1ximo 200 palavras. N\xC3O forne\xE7a orienta\xE7\xE3o cl\xEDnica para casos reais de pacientes \u2014 se solicitado, decline educadamente.";
function ccemBuildCtx(sessaoId) {
  const s = SESSOES[sessaoId];
  if (!s) return "";
  const falas = (s.falas || []).map((f) => `${f.n}. ${f.titulo || f.palestrante}${f.titulo ? " \u2014 " + f.palestrante : ""}`).join(" | ");
  return `Sess\xE3o: ${s.badge} \u2014 ${s.titulo} (${s.inicio}\u2013${s.fim}, ${s.dia}). ${s.moderador ? "Mod.: " + s.moderador + ". " : ""}Falas: ${falas}. Temas: ${(s.temas || []).join(", ")}.`;
}
function ccemMd2html(text) {
  return escapeHTML(text).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>").replace(/\n\n/g, "<br><br>").replace(/\n/g, "<br>");
}
function AssistenteScreen() {
  const [ctxId, setCtxId] = useState(() => window._ccemCtxSessaoId || "");
  const ctxSessao = SESSOES[ctxId] || null;
  useEffect(() => {
    if (window._ccemCtxSessaoId && window._ccemCtxSessaoId !== ctxId) setCtxId(window._ccemCtxSessaoId);
  }, []);
  const welcomeHtml = () => {
    const ctxLine = ctxSessao ? `Contextualizado em <strong>${ctxSessao.badge} \u2014 ${ctxSessao.titulo.slice(0, 55)}${ctxSessao.titulo.length > 55 ? "\u2026" : ""}</strong>.<br><br>` : "";
    return `${ctxLine}Como posso ajudar?<br><br><span style="color:#5b6577;font-size:11.5px;line-height:1.8">\u{1F4F8} <strong>Foto de slide ou texto livre</strong> \u2192 nota estruturada com take-home<br>\u{1F50D} <strong>Busca</strong> \u2014 "sess\xF5es sobre Lp(a)?", "trabalhos com tirzepatida?"<br>\u{1F4AC} <strong>D\xFAvidas pr\xE1ticas</strong> \u2014 hor\xE1rios, salas, exporta\xE7\xE3o do caderno</span>`;
  };
  const [msgs, setMsgs] = useState([{ role: "ai", tag: "In\xEDcio", ts: Date.now() - 36e5, html: welcomeHtml() }]);
  const [text, setText] = useState(() => {
    if (window._ccemAnotarIntent) {
      window._ccemAnotarIntent = false;
      return "Anotar: ";
    }
    return "";
  });
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const photoRef = useRef(null);
  useEffect(() => {
    if (endRef.current) endRef.current.parentNode.scrollTop = endRef.current.offsetTop;
  }, [msgs.length, loading]);
  function sendMsg() {
    const v = text.trim();
    if (!v) return;
    setText("");
    setMsgs((m) => [...m, { role: "user", ts: Date.now(), html: escapeHTML(v) }]);
    setLoading(true);
    setTimeout(() => {
      const mock = (MOCK_AI[classifyIntent(v)] || MOCK_AI.free)[0];
      setMsgs((m) => [...m, { role: "ai", ...mock, ts: Date.now() }]);
      setLoading(false);
    }, 800 + Math.random() * 500);
  }
  function handlePhoto(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      setMsgs((m) => [...m, { role: "user", ts: Date.now(), html: `<img src="${ev.target.result}" style="max-width:180px;border-radius:8px;display:block;margin-bottom:4px"/><span style="font-size:11px;opacity:.85">slide enviado</span>` }]);
      setLoading(true);
      try {
        const ctx = ccemBuildCtx(ctxId);
        const prompt = CCEM_SISTEMA + (ctx ? "\n\nContexto: " + ctx : "") + "\n\nO m\xE9dico enviou uma foto de slide. Pe\xE7a uma descri\xE7\xE3o breve do conte\xFAdo (2\u20133 frases) para que voc\xEA possa estrutur\xE1-lo em nota.";
        const resp = await window.claude.complete({ messages: [{ role: "user", content: prompt }] });
        setMsgs((m) => [...m, { role: "ai", ts: Date.now(), tag: "Slide recebido", html: ccemMd2html(resp), actions: ["Descrever o slide", "Qual o ponto central?"] }]);
      } catch (e) {
        setMsgs((m) => [...m, { role: "ai", ts: Date.now(), tag: "Slide recebido", html: "Descreva o conte\xFAdo do slide para que eu possa estrutur\xE1-lo em nota cl\xEDnica.", actions: ["Descrever o slide"] }]);
      }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  }
  async function actionClick(a) {
    const v = a.toLowerCase();
    setLoading(true);
    try {
      const ctx = ccemBuildCtx(ctxId);
      let instrucao = "";
      if (v.includes("take") || v.includes("take-home")) instrucao = "Liste exatamente 3 take-homes cl\xEDnicos desta sess\xE3o, numerados, direto ao ponto.";
      else if (v.includes("resum")) instrucao = "Resuma esta sess\xE3o em at\xE9 150 palavras, destacando consensos e tens\xF5es cl\xEDnicas entre as falas.";
      else if (v.includes("compar")) instrucao = "Compare as abordagens das diferentes falas: pontos de converg\xEAncia e de tens\xE3o cl\xEDnica.";
      else if (v.includes("salvar") || v.includes("caderno") || v.includes("nota")) instrucao = "Gere uma nota estruturada de 3 bullet points dos pontos mais importantes desta sess\xE3o, pronta para salvar.";
      else instrucao = "Responda de forma \xFAtil sobre: " + a;
      const prompt = CCEM_SISTEMA + "\n\nContexto: " + (ctx || "Congresso geral") + "\n\n" + instrucao;
      const resp = await window.claude.complete({ messages: [{ role: "user", content: prompt }] });
      const html = ccemMd2html(resp);
      setMsgs((m) => [...m, { role: "ai", ts: Date.now(), tag: a, html, actions: ["Salvar no caderno"] }]);
      if (v.includes("salvar") || v.includes("caderno")) {
        const s = SESSOES[ctxId];
        updateAppState((st) => {
          if (!st.captures) st.captures = [];
          st.captures.unshift({ id: "c_" + Date.now().toString(36), dia: s?.dia || DIAS[0], time: nowStamp(), sessaoId: ctxId, sessaoRef: (s?.badge || "Sess\xE3o") + " \xB7 assistente", type: "texto", title: "IA: " + a.slice(0, 40), body: html.slice(0, 600), tags: s?.temas || [], ts: Date.now() });
        });
        showToast("Salvo no caderno \u2713");
      }
    } catch (e) {
      setMsgs((m) => [...m, { role: "ai", ts: Date.now(), tag: "Erro", html: "N\xE3o foi poss\xEDvel processar. Tente novamente." }]);
    }
    setLoading(false);
  }
  const msgStyle = (role) => ({ maxWidth: "86%", background: role === "ai" ? "#fff" : C.azul, color: role === "ai" ? C.tinta : "#fff", borderRadius: role === "ai" ? "14px 14px 14px 4px" : "14px 14px 4px 14px", padding: "10px 12px", fontSize: 12.5, lineHeight: 1.55, border: role === "ai" ? `1px solid ${C.linhaSoft}` : "none", boxShadow: role === "ai" ? "0 1px 6px rgba(29,62,138,.06)" : "none" });
  const COMP_BTN = { width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.linha}`, background: "#f8fafd", borderRadius: 10, cursor: "pointer", flexShrink: 0, padding: 0 };
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: "#f3f6fc" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "9px 14px 7px", background: "#fff", borderBottom: `1px solid ${C.linhaSoft}`, flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 10, background: C.azul, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", fontSize: 14, fontWeight: 700, flexShrink: 0 } }, "C"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, fontWeight: 700, color: C.tinta } }, "Assistente CCEM"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.cinza, display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block", flexShrink: 0 } }), ctxSessao ? ctxSessao.badge + " \xB7 " + ctxSessao.inicio : "CCEM 2026 \xB7 anota\xE7\xF5es e busca"))), !msgs.some((m) => m.role === "user") ? /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflowY: "auto", padding: "18px 14px 10px" } }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: C.tinta, marginBottom: ctxSessao ? 5 : 0, letterSpacing: "-0.01em" } }, "Como posso ajudar?"), ctxSessao && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, color: C.cinza } }, "Contextualizado em ", /* @__PURE__ */ React.createElement("strong", { style: { color: C.azulSoft } }, ctxSessao.badge, " \u2014 ", ctxSessao.titulo.slice(0, 45), ctxSessao.titulo.length > 45 ? "\u2026" : ""))), [
    { ico: "\u{1F4F8}", title: "Auxiliar de Anota\xE7\xE3o", desc: "Foto de slide, \xE1udio ou texto livre \u2192 nota estruturada com take-home e refer\xEAncia bibliogr\xE1fica quando vis\xEDvel.", prompt: "Quero anotar um slide desta sess\xE3o", ord: "1" },
    { ico: "\u{1F50D}", title: "Busca Sem\xE2ntica", desc: "Programa e trabalhos em linguagem natural: sess\xF5es, palestrantes, temas, compara\xE7\xF5es entre falas.", prompt: "Que sess\xF5es falam de Lp(a)?", ord: "2" },
    { ico: "\u{1F4AC}", title: "Concierge", desc: "D\xFAvidas pr\xE1ticas sobre hor\xE1rios, salas, exporta\xE7\xE3o do caderno e submiss\xE3o de trabalhos.", prompt: "Como exporto minhas notas?", ord: "3" }
  ].map((f, i) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: i,
      onClick: () => setText(f.prompt),
      role: "button",
      tabIndex: 0,
      "aria-label": f.title,
      onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && setText(f.prompt),
      style: { background: "#fff", border: `1px solid ${C.linhaSoft}`, borderRadius: 12, padding: "13px 14px", marginBottom: 8, cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start", transition: "all .13s", position: "relative" },
      onMouseOver: (e) => {
        e.currentTarget.style.borderColor = C.azul;
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 4px 14px rgba(29,62,138,.09)";
      },
      onMouseOut: (e) => {
        e.currentTarget.style.borderColor = C.linhaSoft;
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
      }
    },
    /* @__PURE__ */ React.createElement("span", { style: { fontSize: 24, flexShrink: 0, lineHeight: 1.1, marginTop: 1 } }, f.ico),
    /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 3 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.08em" } }, f.ord), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: C.tinta } }, f.title)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, color: C.cinza, lineHeight: 1.45, marginBottom: 7 } }, f.desc), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.azulSoft, background: C.azulBg, padding: "2px 9px", borderRadius: 8 } }, 'ex: "', f.prompt, '"')),
    /* @__PURE__ */ React.createElement(IcoChevR, { size: 14, color: C.cinza, style: { flexShrink: 0, marginTop: 4 } })
  )), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, marginTop: 8, padding: "8px 12px", background: "#f0f4fc", borderRadius: 8, lineHeight: 1.65 } }, "N\xE3o forne\xE7o orienta\xE7\xE3o cl\xEDnica para casos de pacientes reais.")) : /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflowY: "auto", padding: "12px 12px 0" } }, msgs.map((m, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", flexDirection: "column", alignItems: m.role === "ai" ? "flex-start" : "flex-end", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: msgStyle(m.role) }, m.role === "ai" && m.tag && /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.azulSoft, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 } }, m.tag), /* @__PURE__ */ React.createElement("div", { dangerouslySetInnerHTML: { __html: m.html } }), m.role === "ai" && m.ref && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 7, paddingTop: 7, borderTop: `1px solid ${C.linhaSoft}`, fontSize: 11, color: C.cinza }, dangerouslySetInnerHTML: { __html: m.ref } }), m.role === "ai" && m.actions && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 5, flexWrap: "wrap", marginTop: 8 } }, m.actions.map((a, j) => /* @__PURE__ */ React.createElement("button", { key: j, onClick: () => actionClick(a), style: { border: `1px solid ${C.linha}`, background: "#f8fafd", color: C.azul, borderRadius: 7, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" } }, a)))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.cinza, marginTop: 3, fontFamily: "DM Sans,system-ui,sans-serif" } }, new Date(m.ts).getHours(), ":", String(new Date(m.ts).getMinutes()).padStart(2, "0")))), loading && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, padding: "8px 12px", background: "#fff", borderRadius: "14px 14px 14px 4px", width: 60, border: `1px solid ${C.linhaSoft}`, marginBottom: 10 } }, [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement("span", { key: i, style: { width: 7, height: 7, borderRadius: "50%", background: C.cinza, display: "inline-block", animation: `ccem-bounce .9s ${i * 0.2}s ease-in-out infinite` } }))), /* @__PURE__ */ React.createElement("div", { ref: endRef })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 7, padding: "8px 10px 14px", background: "#fff", borderTop: `1px solid ${C.linhaSoft}`, flexShrink: 0 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "file",
      accept: "image/*",
      capture: "environment",
      ref: photoRef,
      style: { display: "none" },
      onChange: (e) => {
        handlePhoto(e.target.files && e.target.files[0]);
        e.target.value = "";
      }
    }
  ), /* @__PURE__ */ React.createElement("button", { onClick: () => photoRef.current && photoRef.current.click(), style: COMP_BTN, title: "Foto de slide" }, /* @__PURE__ */ React.createElement(IcoCam, { size: 18, color: C.cinza })), /* @__PURE__ */ React.createElement("button", { onClick: () => showToast("Grava\xE7\xE3o de \xE1udio \u2014 em breve"), style: COMP_BTN, title: "\xC1udio de fala" }, /* @__PURE__ */ React.createElement(IcoMic, { size: 18, color: C.cinza })), /* @__PURE__ */ React.createElement(
    "input",
    {
      value: text,
      onChange: (e) => setText(e.target.value),
      onKeyDown: (e) => e.key === "Enter" && !e.shiftKey && sendMsg(),
      placeholder: "escreva uma observa\xE7\xE3o ou pergunta\u2026",
      style: { flex: 1, padding: "8px 12px", border: `1px solid ${C.linha}`, borderRadius: 24, fontFamily: "DM Sans,sans-serif", fontSize: 12.5, color: C.tinta, background: "#f8fafd", outline: "none" }
    }
  ), /* @__PURE__ */ React.createElement("button", { onClick: sendMsg, style: { ...COMP_BTN, background: C.azul, border: "none" } }, /* @__PURE__ */ React.createElement(IcoSend, { size: 16, color: "#fff" }))));
}
function ccemDataHoraJoinville(ts) {
  const iso = new Date(ts - 3 * 36e5).toISOString();
  return { data: iso.slice(8, 10) + "/" + iso.slice(5, 7) + "/" + iso.slice(0, 4), hora: iso.slice(11, 16) };
}
function ccemExportarCaderno(captures) {
  const lista = [...captures || []].sort((a, b) => a.ts - b.ts);
  if (!lista.length) {
    showToast("O caderno est\xE1 vazio");
    return;
  }
  const w = window.open("", "_blank");
  if (!w) {
    showToast("Permita pop-ups para exportar o PDF");
    return;
  }
  const esc = (t) => String(t || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const hoje = ccemDataHoraJoinville(Date.now()).data;
  const rows = lista.map((c) => {
    const { data, hora } = ccemDataHoraJoinville(c.ts);
    const sess = SESSOES[c.sessaoId] ? ccemRotulo(SESSOES[c.sessaoId]) : c.sessaoRef || "";
    return `<div class="nota"><div class="meta">${esc(data)} \xB7 ${esc(hora)} \xB7 ${esc(sess)}</div><h3>${esc(c.title)}</h3><div class="body">${c.body || ""}</div></div>`;
  }).join("");
  w.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Meu Caderno \xB7 CCEM 2026</title><style>
    body{font-family:Georgia,serif;color:#1a2438;max-width:680px;margin:32px auto;padding:0 24px}
    h1{font-size:22px;margin:0 0 2px}
    .sub{font-size:12px;color:#4a5468;margin:0 0 24px;font-family:system-ui,sans-serif}
    .nota{border-top:1px solid #d5dff0;padding:14px 0;page-break-inside:avoid}
    .meta{font-size:12px;color:#4a5468;font-family:system-ui,sans-serif;margin-bottom:4px}
    h3{font-size:14px;margin:0 0 6px}
    .body{font-size:13px;line-height:1.55}
  </style></head><body><h1>Meu Caderno \xB7 CCEM 2026</h1><p class="sub">${lista.length} nota${lista.length !== 1 ? "s" : ""} \xB7 exportado em ${hoje} \xB7 12\xBA Congresso Catarinense de Endocrinologia e Metabologia</p>${rows}<script>window.print()<\/script></body></html>`);
  w.document.close();
}
function CadernoScreen() {
  const appState = useAppState();
  const [filtro, setFiltro] = useState("all");
  const captures = appState.captures || [];
  const filtered = filtro === "all" ? captures : captures.filter((c) => c.type === filtro);
  const counts = { all: captures.length, foto: captures.filter((c) => c.type === "foto").length, audio: captures.filter((c) => c.type === "audio").length, texto: captures.filter((c) => c.type === "texto").length };
  const sessoes = new Set(captures.map((c) => c.sessaoId)).size;
  const refs = captures.reduce((acc, c) => acc + (c.body && (c.body.match(/NEJM|Lancet|JCEM|Diabetes|guideline|diretriz/gi) || []).length), 0);
  const isDia0 = (c) => c.dia === DIAS[0] || c.day === "sexta";
  const isDia1 = (c) => c.dia === DIAS[1] || c.day === "sabado";
  const bySex = filtered.filter(isDia0).sort((a, b) => b.ts - a.ts);
  const bySab = filtered.filter(isDia1).sort((a, b) => b.ts - a.ts);
  const bsOrph = filtered.filter((c) => !isDia0(c) && !isDia1(c)).sort((a, b) => b.ts - a.ts);
  function typeColor(t) {
    return t === "foto" ? C.azul : t === "audio" ? "#0d9488" : C.ouro;
  }
  function NoteCard({ c }) {
    return /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 10, padding: "10px 12px", marginBottom: 6, border: `1px solid ${C.linhaSoft}`, borderLeft: `3px solid ${typeColor(c.type)}` } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 5 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: typeColor(c.type), textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 } }, c.type), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, c.sessaoRef, " \xB7 ", c.time)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, fontWeight: 600, color: C.tinta, marginBottom: 4, lineHeight: 1.3 } }, c.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, color: C.cinza, lineHeight: 1.5 }, dangerouslySetInnerHTML: { __html: c.body } }), (c.tags || []).length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" } }, c.tags.map((t) => /* @__PURE__ */ React.createElement("span", { key: t, style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.azulSoft, background: C.azulBg + "60", padding: "2px 7px", borderRadius: 8 } }, t))));
  }
  const fchip = (key, lbl) => /* @__PURE__ */ React.createElement("button", { key, onClick: () => setFiltro(key), style: { display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", border: `1px solid ${filtro === key ? C.azul : C.linha}`, borderRadius: 20, background: filtro === key ? C.azul : "#fff", color: filtro === key ? "#fff" : C.cinza, fontSize: 11.5, fontWeight: filtro === key ? 600 : 400, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 } }, lbl, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, marginLeft: 2 } }, counts[key]));
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px 10px", background: "#fff", borderBottom: `1px solid ${C.linha}`, flexShrink: 0 } }, /* @__PURE__ */ React.createElement("h2", { style: { fontFamily: "Georgia,serif", fontSize: 17, fontWeight: 700, color: C.tinta, margin: "0 0 2px" } }, "Meu caderno"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, color: C.cinza, margin: "0 0 8px" } }, "tudo que voc\xEA anotou no CCEM 2026"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, color: C.tinta, lineHeight: 1.4, margin: "0 0 10px", padding: "7px 10px", background: "#f5f8fd", borderRadius: 7, borderLeft: `3px solid ${C.azulSoft}` } }, "Suas notas ficam s\xF3 neste aparelho. Exporte o PDF para guardar."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, [["Notas", captures.length, C.azulBg, C.azul], ["Sess\xF5es", sessoes, C.verdeBg, C.verde], ["Refs", refs, C.ouroBg, C.ouro]].map(([lbl, num, bg, color]) => /* @__PURE__ */ React.createElement("div", { key: lbl, style: { flex: 1, background: bg, borderRadius: 10, padding: "7px 10px", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 20, fontWeight: 700, color, lineHeight: 1 } }, num), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 } }, lbl))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 5, padding: "7px 12px", background: "#f8fafd", borderBottom: `1px solid ${C.linhaSoft}`, overflowX: "auto", flexShrink: 0, scrollbarWidth: "none" } }, fchip("all", "Tudo"), fchip("foto", "Fotos"), fchip("audio", "\xC1udios"), fchip("texto", "Textos")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflowY: "auto", padding: "10px 12px" } }, filtered.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "40px 20px", color: C.cinza } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 32, marginBottom: 10 } }, "\u25CB"), /* @__PURE__ */ React.createElement("h4", { style: { fontSize: 14, fontWeight: 600, color: C.tinta, marginBottom: 6 } }, "Caderno vazio"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, lineHeight: 1.5, margin: 0 } }, "Toque em ", /* @__PURE__ */ React.createElement("strong", null, "Anotar"), " numa sess\xE3o, ou envie algo pelo Assistente.")) : /* @__PURE__ */ React.createElement(React.Fragment, null, bySex.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.08em", margin: "2px 0 8px", fontWeight: 600 } }, "Sexta \xB7 23 outubro"), bySex.map((c) => /* @__PURE__ */ React.createElement(NoteCard, { key: c.id, c }))), bySab.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.08em", margin: "12px 0 8px", fontWeight: 600 } }, "S\xE1bado \xB7 24 outubro"), bySab.map((c) => /* @__PURE__ */ React.createElement(NoteCard, { key: c.id, c }))), bsOrph.length > 0 && bsOrph.map((c) => /* @__PURE__ */ React.createElement(NoteCard, { key: c.id, c })))), captures.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "9px 12px", background: "#fff", borderTop: `1px solid ${C.linha}`, display: "flex", alignItems: "center", gap: 10, flexShrink: 0 } }, /* @__PURE__ */ React.createElement("p", { style: { flex: 1, fontSize: 11, color: C.cinza, lineHeight: 1.4, margin: 0 } }, /* @__PURE__ */ React.createElement("strong", null, "Salvo neste dispositivo"), " \xB7 ", captures.length, " nota", captures.length !== 1 ? "s" : ""), /* @__PURE__ */ React.createElement("button", { onClick: () => ccemExportarCaderno(captures), style: { display: "flex", alignItems: "center", gap: 5, background: C.azul, color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" } }, "\u2193 PDF")));
}
function InfoScreen() {
  const IC = ({ children, style }) => /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 12, padding: "13px 14px", margin: "10px 14px 0", border: `1px solid ${C.linhaSoft}`, boxShadow: "0 1px 5px rgba(29,62,138,.04)", ...style || {} } }, children);
  const H3 = ({ children }) => /* @__PURE__ */ React.createElement("h3", { style: { fontFamily: "Georgia,serif", fontSize: 13.5, fontWeight: 600, color: C.tinta, margin: "0 0 8px", letterSpacing: "-0.005em" } }, children);
  const Row = ({ lbl, val }) => /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, fontSize: 12.5, color: C.cinza, padding: "6px 0", borderBottom: `1px solid ${C.linhaSoft}` } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.08em", width: 72, flexShrink: 0, lineHeight: 1.6 } }, lbl), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, color: C.tinta } }, val));
  const CR = ({ icon, lbl, val, href }) => /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 11, padding: "9px 0", borderBottom: `1px solid ${C.linhaSoft}` } }, /* @__PURE__ */ React.createElement("div", { style: { width: 34, height: 34, borderRadius: 9, background: C.azulBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: C.azul } }, icon), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 } }, lbl), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 500, color: C.tinta } }, href ? /* @__PURE__ */ React.createElement("a", { href, target: "_blank", rel: "noopener", style: { color: C.azul, textDecoration: "none" } }, val) : val)));
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflowY: "auto", paddingBottom: 24 } }, /* @__PURE__ */ React.createElement("div", { style: { background: C.azul, color: "#fff", padding: "20px 16px 18px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.75, marginBottom: 4 } }, "SBEM-SC \xB7 Sociedade Brasileira de Endocrinologia e Metabologia"), /* @__PURE__ */ React.createElement("h2", { style: { fontFamily: "Georgia,serif", fontSize: 21, fontWeight: 600, margin: "0 0 3px", lineHeight: 1.2, letterSpacing: "-0.01em" } }, "12\xBA CCEM 2026"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, opacity: 0.8, lineHeight: 1.4, margin: "0 0 10px" } }, "Congresso Catarinense de Endocrinologia e Metabologia"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, background: "rgba(255,255,255,.12)", padding: "7px 10px", borderRadius: 6, letterSpacing: "0.02em", lineHeight: 1.7 } }, "Expoville \xB7 Rua XV de Novembro, 4315 \xB7 Joinville/SC", /* @__PURE__ */ React.createElement("br", null), "23 e 24 de Outubro de 2026")), /* @__PURE__ */ React.createElement(IC, null, /* @__PURE__ */ React.createElement(H3, null, "Organiza\xE7\xE3o"), /* @__PURE__ */ React.createElement(Row, { lbl: "Presidente", val: "Dr. Fulvio Clemo Santos Tomaselli \u2014 SBEM-SC" }), /* @__PURE__ */ React.createElement(Row, { lbl: "Pres. eleito", val: "Dr. Frederico Guimar\xE3es Marchisotti" }), /* @__PURE__ */ React.createElement(Row, { lbl: "Dir. cient.", val: "Dr. Dalisbor Marcelo Weber Silva" }), /* @__PURE__ */ React.createElement(Row, { lbl: "Secretaria", val: "Sex 23/10 \xB7 07h30\u201318h30 \xB7 S\xE1b 24/10 \xB7 07h30\u201318h" }), /* @__PURE__ */ React.createElement(Row, { lbl: "Abertura", val: "Sexta, 23/10 \xB7 08h00" }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, fontSize: 12.5, color: C.cinza, padding: "6px 0" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.08em", width: 72, flexShrink: 0, lineHeight: 1.6 } }, "Cert."), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, color: C.tinta } }, "Dispon\xEDveis a partir de ", /* @__PURE__ */ React.createElement("strong", null, "05/11/2026"), " via CPF \u2014 apenas para inscritos presentes."))), /* @__PURE__ */ React.createElement(IC, null, /* @__PURE__ */ React.createElement(H3, null, "Contato"), /* @__PURE__ */ React.createElement(CR, { icon: /* @__PURE__ */ React.createElement(IcoPhone, { size: 17 }), lbl: "WhatsApp", val: "(47) 99130-3330", href: "https://wa.me/5547991303330" }), /* @__PURE__ */ React.createElement(CR, { icon: /* @__PURE__ */ React.createElement(IcoMail, { size: 17 }), lbl: "E-mail", val: "contato@ccem2026.com.br", href: "mailto:contato@ccem2026.com.br" }), /* @__PURE__ */ React.createElement(CR, { icon: /* @__PURE__ */ React.createElement(IcoInsta, { size: 17 }), lbl: "Instagram", val: "@sbemsceventos", href: "https://instagram.com/sbemsceventos" }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 11, padding: "9px 0" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 34, height: 34, borderRadius: 9, background: C.azulBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: C.azul } }, /* @__PURE__ */ React.createElement(IcoGlobe, { size: 17 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 } }, "Site oficial"), /* @__PURE__ */ React.createElement("a", { href: "https://www.ccem2026.com.br", target: "_blank", rel: "noopener", style: { fontSize: 13, fontWeight: 600, color: C.azul, textDecoration: "none" } }, "ccem2026.com.br \u2197")))), /* @__PURE__ */ React.createElement(IC, null, /* @__PURE__ */ React.createElement(H3, null, "Sobre este app"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12.5, color: C.cinza, lineHeight: 1.55, margin: "0 0 8px" } }, "Camada interativa do CCEM 2026 para inscritos. Programa naveg\xE1vel, p\xF4steres digitais, assistente de IA para anota\xE7\xF5es e busca cient\xEDfica."), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12.5, color: C.tinta, lineHeight: 1.55, margin: "0 0 10px", padding: "8px 10px", background: "#f5f8fd", borderRadius: 7, borderLeft: `3px solid ${C.linha}` } }, "O app fica dispon\xEDvel at\xE9 31/12/2026. Notas n\xE3o s\xE3o enviadas a servidor; se voc\xEA limpar o navegador ou trocar de aparelho, elas se perdem \u2014 exporte o PDF."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderTop: `1px solid ${C.linhaSoft}`, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 } }, "ID local"), /* @__PURE__ */ React.createElement("code", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.tinta, background: "#f0f4fc", padding: "2px 7px", borderRadius: 5, flex: 1, overflow: "hidden", textOverflow: "ellipsis" } }, window.CCEM_USER_ID || "\u2014")), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        if (confirm("Limpar todos os dados deste dispositivo?")) {
          localStorage.removeItem(window.CCEM_STATE_KEY);
          localStorage.removeItem("ccem2026:userId");
          location.reload();
        }
      },
      style: { width: "100%", border: "1px solid #e53e3e", background: "#fff", color: "#e53e3e", borderRadius: 8, padding: "8px", fontSize: 12.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }
    },
    "Limpar todos os meus dados"
  )), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "18px 16px 4px", fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, lineHeight: 1.9 } }, /* @__PURE__ */ React.createElement("div", null, "Meu CCEM 2026 \xB7 v4.0"), /* @__PURE__ */ React.createElement("div", null, "vers\xE3o em desenvolvimento \xB7 restrito \xE0 comiss\xE3o"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6 } }, /* @__PURE__ */ React.createElement("a", { href: "https://www.ccem2026.com.br", target: "_blank", rel: "noopener", style: { color: C.azul, textDecoration: "none", fontSize: 11 } }, "ccem2026.com.br \xB7 site oficial do congresso \u2197")))));
}
function isEventWeek() {
  const agora = ccemAgora();
  return agora >= /* @__PURE__ */ new Date("2026-10-16T00:00:00-03:00") && agora < /* @__PURE__ */ new Date("2026-11-01T00:00:00-03:00");
}
function LiveStrip() {
  const [st, setSt] = useState(() => ccemLiveStatus());
  useEffect(() => {
    const id = setInterval(() => setSt(ccemLiveStatus()), 3e4);
    return () => clearInterval(id);
  }, []);
  if (!isEventWeek()) return null;
  const dotColors = { live: "#22c55e", soon: C.ouro, upcoming: C.cinza, past: C.linha };
  const bg = { live: "#eef6ff", soon: "#fef9ec", upcoming: "#f5f7fb", past: "#f5f7fb" };
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 7, margin: "8px 0 0", padding: "5px 8px", background: bg[st.kind] || "#f5f7fb", borderRadius: 7, border: `1px solid ${C.linhaSoft}` } }, /* @__PURE__ */ React.createElement("span", { style: { width: 6, height: 6, borderRadius: "50%", background: dotColors[st.kind], flexShrink: 0, boxShadow: st.kind === "live" ? "0 0 0 3px rgba(34,197,94,.2)" : "none" } }), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: st.kind === "live" ? C.azulSoft : C.cinza, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, flexShrink: 0 } }, st.tag), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11.5, color: C.tinta, fontWeight: 500, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, st.text), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, flexShrink: 0 } }, st.time));
}
function AppHeader() {
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 16px 8px", background: "#fff", borderBottom: `1px solid ${C.linha}`, flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "v4/logo-ccem.png",
      alt: "CCEM 2026",
      style: { height: 28, objectFit: "contain", cursor: "pointer" },
      onClick: () => go("#/"),
      onError: (e) => {
        e.target.style.display = "none";
        if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
      }
    }
  ), /* @__PURE__ */ React.createElement("div", { onClick: () => go("#/"), style: { display: "none", alignItems: "baseline", gap: 4, cursor: "pointer" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 17, color: C.azul, letterSpacing: "-0.02em" } }, "CCEM"), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.ouro, letterSpacing: "0.08em" } }, "2026"))), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, letterSpacing: "0.05em", textTransform: "uppercase" } }, "23\u201324 OUT \xB7 Joinville/SC"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.ouro, letterSpacing: "0.04em", marginTop: 1 } }, "Expoville"))), /* @__PURE__ */ React.createElement(LiveStrip, null));
}
function TabBar({ aba }) {
  const tabs = [
    { id: "programa", icon: /* @__PURE__ */ React.createElement(IcoCal, { size: 21 }), lbl: "Programa" },
    { id: "trabalhos", icon: /* @__PURE__ */ React.createElement(IcoPoster, { size: 21 }), lbl: "Trabalhos" },
    { id: "assistente", icon: /* @__PURE__ */ React.createElement(IcoChat, { size: 21 }), lbl: "Assistente" },
    { id: "caderno", icon: /* @__PURE__ */ React.createElement(IcoBook, { size: 21 }), lbl: "Caderno" },
    { id: "info", icon: /* @__PURE__ */ React.createElement(IcoInfo, { size: 21 }), lbl: "Info" }
  ];
  return /* @__PURE__ */ React.createElement("nav", { style: { display: "flex", background: "#fff", borderTop: `1px solid ${C.linha}`, flexShrink: 0 } }, tabs.map((t) => {
    const on = aba === t.id;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: t.id,
        onClick: () => go("#/" + t.id),
        style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, padding: "8px 0 10px", border: "none", background: "none", cursor: "pointer", color: on ? C.azul : C.cinza, transition: "color .15s" }
      },
      t.icon,
      /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,sans-serif", fontSize: 11, fontWeight: on ? 600 : 400 } }, t.lbl)
    );
  }));
}
function useIsDesktop() {
  const [is, setIs] = useState(() => window.innerWidth >= 720);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 720px)");
    const fn = (e) => setIs(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return is;
}
function DesktopSidebar({ aba }) {
  const tabs = [
    { id: "programa", icon: /* @__PURE__ */ React.createElement(IcoCal, { size: 20 }), lbl: "Programa" },
    { id: "trabalhos", icon: /* @__PURE__ */ React.createElement(IcoPoster, { size: 20 }), lbl: "Trabalhos" },
    { id: "assistente", icon: /* @__PURE__ */ React.createElement(IcoChat, { size: 20 }), lbl: "Assistente" },
    { id: "caderno", icon: /* @__PURE__ */ React.createElement(IcoBook, { size: 20 }), lbl: "Caderno" },
    { id: "info", icon: /* @__PURE__ */ React.createElement(IcoInfo, { size: 20 }), lbl: "Info" }
  ];
  return /* @__PURE__ */ React.createElement("div", { style: { width: 220, background: "#fff", borderRight: `1px solid ${C.linha}`, display: "flex", flexDirection: "column", flexShrink: 0, height: "100%", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "22px 18px 14px", borderBottom: `1px solid ${C.linhaSoft}` } }, /* @__PURE__ */ React.createElement("button", { onClick: () => go("#/"), style: { display: "flex", alignItems: "baseline", gap: 6, marginBottom: 5, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "none" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 22, color: C.azul, letterSpacing: "-0.02em" } }, "CCEM"), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.ouro, letterSpacing: "0.08em" } }, "2026")), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, letterSpacing: "0.04em", marginTop: 2 } }, "23\u201324 out \xB7 Joinville/SC"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10 } }, /* @__PURE__ */ React.createElement(LiveStrip, null))), /* @__PURE__ */ React.createElement("nav", { style: { flex: 1, padding: "10px 8px", overflowY: "auto" } }, tabs.map((t) => {
    const on = aba === t.id || aba === "sessao" && t.id === "programa";
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: t.id,
        onClick: () => go("#/" + t.id),
        style: { width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", border: "none", background: on ? C.azulBg : "none", color: on ? C.azul : C.cinza, borderRadius: 9, cursor: "pointer", fontFamily: "DM Sans,sans-serif", fontSize: 13.5, fontWeight: on ? 700 : 400, marginBottom: 2, transition: "all .15s", textAlign: "left" }
      },
      /* @__PURE__ */ React.createElement("span", { style: { flexShrink: 0, color: on ? C.azul : C.cinza } }, t.icon),
      t.lbl,
      on && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: C.azul, flexShrink: 0 } })
    );
  })), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px", borderTop: `1px solid ${C.linhaSoft}` } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 11, color: C.cinza, lineHeight: 1.7 } }, "v4.0 \xB7 Meu CCEM", /* @__PURE__ */ React.createElement("br", null), "vers\xE3o em desenvolvimento \xB7 restrito \xE0 comiss\xE3o")));
}
function AppShell({ showShell, aba, children }) {
  const isDesktop = useIsDesktop();
  if (isDesktop) {
    return /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", overflow: "hidden", minHeight: 0 } }, /* @__PURE__ */ React.createElement(DesktopSidebar, { aba }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", minHeight: 0, background: "#e8eef8" } }, /* @__PURE__ */ React.createElement("div", { style: { width: "100%", maxWidth: 800, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0, background: C.papel } }, children)));
  }
  return /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 } }, showShell ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(AppHeader, null), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 } }, children), /* @__PURE__ */ React.createElement(TabBar, { aba })) : children);
}
Object.assign(window, {
  AppShell,
  AppHeader,
  LiveStrip,
  TabBar,
  DesktopSidebar,
  useIsDesktop,
  DayTimeline,
  SlideDisplay,
  SlideUploadBtn,
  ProgramaScreen,
  SessaoDetail,
  AssistenteScreen,
  TrabalhosScreen,
  CadernoScreen,
  InfoScreen,
  BadgePill,
  TopicPill,
  IntervalRow,
  SessaoCard,
  sessionIsPast,
  isEventWeek,
  classifyIntent,
  MOCK_AI,
  ccemExportarCaderno,
  ccemDataHoraJoinville
});
