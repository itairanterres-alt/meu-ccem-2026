function badgeColor(tipo) {
  if (tipo === "simposio") return C.azul;
  if (tipo === "mini") return "#0d9488";
  if (tipo === "satelite") return C.ouroTxt;
  return "#64748b";
}
function norm(s) {
  return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function sessionIsPast(s) {
  if (!s || !s.dia || !s.fim) return false;
  return ccemAgora() > ccemInstante(s.dia, s.fim);
}
const BACK_BTN = { width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", border: "none", background: "transparent", cursor: "pointer", borderRadius: 9, flexShrink: 0, padding: 0 };
const PILL = { display: "inline-flex", alignItems: "center", fontFamily: "DM Sans,system-ui,sans-serif", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", borderRadius: 20, whiteSpace: "nowrap", lineHeight: 1.6 };
function BadgePill({ tipo, label, sm }) {
  const bg = badgeColor(tipo);
  return /* @__PURE__ */ React.createElement("span", { style: { ...PILL, background: bg + "1a", color: bg, border: `1px solid ${bg}28`, fontSize: 12, padding: sm ? "1px 7px" : "2px 9px" } }, label);
}
function TopicPill({ tema }) {
  const color = TEMAS_COR[tema] || C.cinza;
  return /* @__PURE__ */ React.createElement("span", { style: { ...PILL, background: color + "18", color, border: `1px solid ${color}28`, fontSize: 12, padding: "3px 9px" } }, tema);
}
function IntervalRow({ item }) {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "6px 16px", background: "#f5f8fd", borderTop: `1px solid ${C.linhaSoft}`, borderBottom: `1px solid ${C.linhaSoft}`, margin: "2px 0" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: C.cinza, fontWeight: 600 } }, item.label), item.dur && /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, marginLeft: "auto" } }, item.dur));
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
    noAr && /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", top: 8, right: 8, background: "#15803d", color: "#fff", fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 10, fontWeight: 700 } }, "Agora"),
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("div", { style: { minWidth: 40, flexShrink: 0, textAlign: "center", paddingTop: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 13.5, fontWeight: 700, color: C.azul, lineHeight: 1 } }, s.inicio), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, marginTop: 3, lineHeight: 1.3 } }, "\u2192", s.fim), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, marginTop: 1 } }, s.dur)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 5, marginBottom: 5 } }, /* @__PURE__ */ React.createElement(BadgePill, { tipo: s.tipo, label: s.badge, sm: true })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: C.tinta, lineHeight: 1.3, marginBottom: 3, paddingRight: noAr ? 36 : 0 } }, s.titulo), s.moderador && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.cinza, marginBottom: 3 } }, "mod. ", s.moderador), s.aDefinir && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.cinza, fontStyle: "italic" } }, "programa\xE7\xE3o a definir"), (s.falas || []).slice(0, 3).map((f, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 5, alignItems: "baseline", fontSize: 12, color: C.cinza, marginTop: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { color: bc, fontWeight: 700, flexShrink: 0, minWidth: 10 } }, f.n, "."), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, minWidth: 0, lineHeight: 1.3 } }, f.titulo && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tinta, fontWeight: 500 } }, f.titulo), " \xB7 "), /* @__PURE__ */ React.createElement("span", null, f.palestrante, f.aConfirmar && /* @__PURE__ */ React.createElement("em", { style: { color: C.cinza } }, " (a confirmar)"))))), (s.falas || []).length > 3 && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.cinza, marginTop: 2, fontStyle: "italic" } }, "+", s.falas.length - 3, " fala(s)\u2026"), s.navegavel && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "flex-end", marginTop: 6, gap: 5 } }, isMarked && /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.azulSoft } }, "marcada"), /* @__PURE__ */ React.createElement(IcoChevR, { size: 14, color: C.cinza }))))
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
  return /* @__PURE__ */ React.createElement("div", { style: { margin: "0 12px 8px", background: "#fff", borderRadius: 10, padding: "9px 12px 7px", border: `1px solid ${C.linhaSoft}` } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: C.cinza, marginBottom: 5 } }, dia === DIAS[0] ? "A jornada \xB7 sexta 23/out" : "A jornada \xB7 s\xE1bado 24/out"), /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: { position: "relative", height: 20, background: C.cinzaClr, borderRadius: 4, overflow: "visible" } }, sessoes.map((s) => {
    const l = pct(s.inicio), w = Math.max(pct(s.fim) - l, 0.8);
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: s.id,
        title: s.titulo,
        style: { position: "absolute", top: 2, bottom: 2, left: l + "%", width: w + "%", background: bc(s.tipo), borderRadius: 2, opacity: 0.85 }
      }
    );
  }), nowPct >= 0 && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: -3, bottom: -3, left: nowPct + "%", width: 2, background: C.azulSoft, borderRadius: 1, zIndex: 5, boxShadow: `0 0 0 2px rgba(45,84,192,.2)` } })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 4, fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza } }, [8, 10, 12, 14, 16, 18].filter((h) => h * 60 <= DAY_END + 30).map((h) => /* @__PURE__ */ React.createElement("span", { key: h }, h, "h"))));
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
      style: { fontSize: 12, fontWeight: 600, color: C.verde, textDecoration: "none" }
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
    return /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6, background: C.verde + "12", borderRadius: 7, padding: "6px 9px", display: "flex", alignItems: "center", gap: 7 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13 } }, "\u{1F4CE}"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: C.verde, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, slides.name), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, marginTop: 1 } }, (slides.size / 1024).toFixed(0), " KB")), /* @__PURE__ */ React.createElement(
      "a",
      {
        href: slides.dataUrl,
        download: slides.name,
        style: { fontSize: 12, fontWeight: 600, color: C.azul, textDecoration: "none", background: C.azulBg, padding: "4px 9px", borderRadius: 6, flexShrink: 0 }
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
      style: { marginTop: 6, display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: C.cinza, background: "none", border: `1px dashed ${C.linha}`, borderRadius: 7, padding: "4px 10px", cursor: "pointer", fontFamily: "DM Sans,sans-serif" }
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
    ccemAbrirEditor({ sessaoId: id });
  }
  async function handleShare() {
    const texto = `${s.badge} \u2014 ${s.titulo}
${s.dia} \xB7 ${s.inicio}\u2013${s.fim} \xB7 Expoville, Joinville/SC

#CCEM2026 #SBEMSC`;
    if (navigator.share) {
      try {
        await navigator.share({ title: s.titulo, text: texto, url: ccemBaseUrl() + "#/sessao/" + id });
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
    ccemAbrirAssistente();
  }
  const navBtn = (on) => ({
    width: 44,
    height: 44,
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
  return /* @__PURE__ */ React.createElement("div", { style: { height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", background: C.papel } }, /* @__PURE__ */ React.createElement("div", { style: { background: C.azul, color: "#fff", flexShrink: 0, boxShadow: "0 2px 12px rgba(10,18,50,.3)" } }, /* @__PURE__ */ React.createElement("div", { style: { height: 52, display: "flex", alignItems: "center", gap: 8, padding: "0 8px" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => window.history.back(), "aria-label": "Voltar", style: BACK_BTN }, /* @__PURE__ */ React.createElement(IcoArrowL, { size: 20, color: "#fff" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, s.titulo), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, opacity: 0.75, marginTop: 1 } }, s.inicio, "\u2013", s.fim, " \xB7 ", s.dur)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 2, flexShrink: 0 } }, /* @__PURE__ */ React.createElement("button", { onClick: handleShare, title: "Compartilhar", "aria-label": "Compartilhar esta sess\xE3o", style: navBtn(true) }, /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "#fff", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("circle", { cx: "18", cy: "5", r: "3" }), /* @__PURE__ */ React.createElement("circle", { cx: "6", cy: "12", r: "3" }), /* @__PURE__ */ React.createElement("circle", { cx: "18", cy: "19", r: "3" }), /* @__PURE__ */ React.createElement("line", { x1: "8.59", y1: "13.51", x2: "15.42", y2: "17.49" }), /* @__PURE__ */ React.createElement("line", { x1: "15.41", y1: "6.51", x2: "8.59", y2: "10.49" }))), /* @__PURE__ */ React.createElement("button", { onClick: () => prevId && go("#/sessao/" + prevId), "aria-label": "Sess\xE3o anterior", disabled: !prevId, style: navBtn(!!prevId) }, /* @__PURE__ */ React.createElement(IcoChevL, { size: 18, color: "#fff" })), /* @__PURE__ */ React.createElement("button", { onClick: () => nextId && go("#/sessao/" + nextId), "aria-label": "Pr\xF3xima sess\xE3o", disabled: !nextId, style: navBtn(!!nextId) }, /* @__PURE__ */ React.createElement(IcoChevR, { size: 18, color: "#fff" })))), idx >= 0 && /* @__PURE__ */ React.createElement("div", { style: { height: 2, background: "rgba(255,255,255,.1)" } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", background: C.ouro, width: `${(idx + 1) / SESSOES_NAV.length * 100}%`, transition: "width .3s" } }))), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflowY: "auto", padding: "14px 14px 28px" } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 14, padding: "14px", border: `1px solid ${C.linhaSoft}`, marginBottom: 10, boxShadow: "0 2px 10px rgba(29,62,138,.05)" } }, /* @__PURE__ */ React.createElement(
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
    isPast && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto", fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza } }, ctxOpen ? "\u25BE recolher" : "\u25B8 contexto")
  ), ctxOpen && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 9 } }, /* @__PURE__ */ React.createElement("h2", { style: { fontFamily: "Georgia,serif", fontSize: 15.5, fontWeight: 700, color: C.tinta, lineHeight: 1.35, letterSpacing: "-0.01em", margin: "0 0 8px" } }, s.titulo), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.azulSoft, fontWeight: 700 } }, s.inicio), /* @__PURE__ */ React.createElement("span", null, "\u2192 ", s.fim), /* @__PURE__ */ React.createElement("span", null, "\xB7 ", s.dur, " \xB7 ", s.dia)), s.moderador && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 9, padding: "6px 10px", background: C.azulBg + "60", borderRadius: 7, display: "flex", gap: 8, alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.07em", flexShrink: 0 } }, "Moderador"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: C.tinta, fontWeight: 500 } }, s.moderador))), !ctxOpen && isPast && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, marginTop: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.azulSoft, fontWeight: 700 } }, s.inicio, "\u2013", s.fim), s.moderador && /* @__PURE__ */ React.createElement("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, "mod. ", s.moderador))), s.falas && s.falas.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 14, padding: "12px 14px", border: `1px solid ${C.linhaSoft}`, marginBottom: 10, boxShadow: "0 2px 10px rgba(29,62,138,.05)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: C.cinza, marginBottom: 10, fontWeight: 600 } }, "Programa da sess\xE3o"), s.falas.map((f, i) => {
    const bio = SPEAKER_BIOS[f.palestrante];
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 10, padding: "8px 0", borderBottom: i < s.falas.length - 1 ? `1px solid ${C.linhaSoft}` : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 22, height: 22, borderRadius: 7, background: bc + "1a", color: bc, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 1 } }, f.n === "\xB7" ? "\xB7" : f.n), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, f.titulo && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, fontWeight: 600, color: C.tinta, lineHeight: 1.3, marginBottom: 2 } }, f.titulo), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tinta, fontWeight: 500 } }, f.palestrante, f.aConfirmar && /* @__PURE__ */ React.createElement("em", { style: { color: C.cinza, fontWeight: 400 } }, " (a confirmar)")), bio && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.cinza, marginTop: 1 } }, bio.role), /* @__PURE__ */ React.createElement(SlideDisplay, { sessaoId: id, falaIdx: i })));
  })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("button", { onClick: handleAnotar, style: { flex: 3, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: C.azul, color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontFamily: "DM Sans,sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: "-0.01em", boxShadow: "0 2px 8px rgba(29,62,138,.25)" } }, /* @__PURE__ */ React.createElement(IcoCapture, { size: 17, color: "#fff" }), "Anotar"), /* @__PURE__ */ React.createElement("button", { onClick: toggleMark, style: { flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, background: isMarked ? C.ouroBg : "#fff", color: isMarked ? C.ouroTxt : C.cinza, border: `1px solid ${isMarked ? C.ouroTxt : C.linha}`, borderRadius: 10, padding: "10px 14px", fontFamily: "DM Sans,sans-serif", fontSize: 12, fontWeight: isMarked ? 700 : 500, cursor: "pointer" } }, /* @__PURE__ */ React.createElement(IcoStar, { size: 16, color: isMarked ? C.ouroTxt : C.cinza, filled: isMarked }), isMarked ? "Marcado" : "Marcar")), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => ccemBaixarIcs([s], "ccem-" + id + ".ics"),
      style: { width: "100%", minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#fff", color: C.azul, border: `1px solid ${C.linha}`, borderRadius: 10, padding: "10px 14px", fontFamily: "DM Sans,sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 8 }
    },
    /* @__PURE__ */ React.createElement(IcoCal, { size: 16, color: C.azul }),
    "Adicionar ao calend\xE1rio"
  ), /* @__PURE__ */ React.createElement("button", { onClick: handleAskAI, style: { width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", background: "#f0f4fc", border: `1px solid ${C.linha}`, borderRadius: 10, cursor: "pointer", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 26, height: 26, borderRadius: 7, background: C.azul, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "#fff", strokeWidth: "2", strokeLinecap: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" }), /* @__PURE__ */ React.createElement("circle", { cx: "9", cy: "10", r: "1", fill: "#fff", stroke: "none" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "10", r: "1", fill: "#fff", stroke: "none" }), /* @__PURE__ */ React.createElement("circle", { cx: "15", cy: "10", r: "1", fill: "#fff", stroke: "none" }))), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "left", flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,sans-serif", fontSize: 12, fontWeight: 600, color: C.azul } }, "Perguntar ao Assistente"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, marginTop: 1 } }, "contextualizado nesta sess\xE3o")), /* @__PURE__ */ React.createElement(IcoChevR, { size: 15, color: C.cinza })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, prevId && SESSOES[prevId] && /* @__PURE__ */ React.createElement("button", { onClick: () => go("#/sessao/" + prevId), style: { flex: 1, background: "#fff", border: `1px solid ${C.linha}`, borderRadius: 10, padding: "9px 12px", textAlign: "left", cursor: "pointer", minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 } }, "\u2190 Anterior"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 500, color: C.tinta, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, SESSOES[prevId].titulo)), nextId && SESSOES[nextId] && /* @__PURE__ */ React.createElement("button", { onClick: () => go("#/sessao/" + nextId), style: { flex: 1, background: "#fff", border: `1px solid ${C.linha}`, borderRadius: 10, padding: "9px 12px", textAlign: "right", cursor: "pointer", minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 } }, "Pr\xF3xima \u2192"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 500, color: C.tinta, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, SESSOES[nextId].titulo)))));
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
    let saved = null;
    try {
      saved = sessionStorage.getItem(key);
    } catch (e) {
    }
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
    const filtrar = (d) => (PROGRAMA[d] || []).filter((item) => {
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
    if (!buscaNorm) return filtrar(dia);
    return DIAS.flatMap((d) => {
      const achou = filtrar(d);
      return achou.length ? [{ tipo: "dia", id: "dia-" + d, label: d === DIAS[0] ? "Sexta \xB7 23 de outubro" : "S\xE1bado \xB7 24 de outubro" }, ...achou] : [];
    });
  }, [dia, buscaNorm, filtroTipo, soMarcados, appState.marks]);
  const totalSessoes = (PROGRAMA[dia] || []).filter((i) => i.tipo === "sessao" && SESSOES[i.id]?.navegavel).length;
  const markedCount = (PROGRAMA[dia] || []).filter((i) => i.tipo === "sessao" && appState.marks?.[i.id]).length;
  const hasFilter = !!(filtroTipo || soMarcados);
  const chipSt = (active, bg) => ({ display: "inline-flex", alignItems: "center", justifyContent: "center", background: active ? bg : "#fff", color: active ? "#fff" : C.cinza, fontFamily: "DM Sans,sans-serif", fontSize: 12, fontWeight: active ? 600 : 500, padding: "7px 14px", minHeight: 44, borderRadius: 22, border: `1px solid ${active ? bg : C.linha}`, cursor: "pointer", whiteSpace: "nowrap", gap: 4 });
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, padding: "9px 12px 7px", borderBottom: `1px solid ${C.linha}`, background: "#fff", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", background: "#f0f4fc", borderRadius: 10, padding: 3, gap: 2, flex: 1 } }, DIAS.map((d) => /* @__PURE__ */ React.createElement("button", { key: d, onClick: () => setDia(d), style: { flex: 1, padding: "6px 0", border: "none", borderRadius: 8, fontFamily: "DM Sans,sans-serif", fontWeight: 700, cursor: "pointer", background: dia === d ? C.azul : "transparent", color: dia === d ? "#fff" : C.cinza, transition: "all .15s" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 16, lineHeight: 1, display: "block" } }, d.includes("23") ? "23" : "24"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" } }, d.includes("sex") ? "SEX" : "S\xC1B")))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexShrink: 0, alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.05em" } }, totalSessoes, " sess\xF5es"), markedCount > 0 && /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.azulSoft, marginTop: 1 } }, markedCount, " marcadas")), /* @__PURE__ */ React.createElement("button", { onClick: () => setFilterOpen(true), "aria-label": "Filtrar sess\xF5es", style: { position: "relative", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", border: `1px solid ${hasFilter ? C.azul : C.linha}`, borderRadius: 10, cursor: "pointer", flexShrink: 0, color: hasFilter ? C.azul : C.cinza } }, /* @__PURE__ */ React.createElement(IcoFilter, { size: 16, color: hasFilter ? C.azul : C.cinza }), hasFilter && /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", top: -3, right: -3, width: 8, height: 8, borderRadius: "50%", background: C.azul, border: "2px solid #fff" } })))), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px 0", background: "#fff", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", display: "flex", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", left: 10, pointerEvents: "none" } }, /* @__PURE__ */ React.createElement(IcoSearch, { size: 14, color: C.cinza })), /* @__PURE__ */ React.createElement(
    "input",
    {
      value: busca,
      onChange: (e) => setBusca(e.target.value),
      placeholder: "Sess\xE3o, palestrante ou tema",
      style: { width: "100%", minHeight: 44, padding: "7px 44px 7px 30px", border: `1px solid ${C.linha}`, borderRadius: 8, fontFamily: "DM Sans,sans-serif", fontSize: 16, color: C.tinta, background: "#f8fafd", outline: "none", boxSizing: "border-box" }
    }
  ), busca && /* @__PURE__ */ React.createElement("button", { onClick: () => setBusca(""), "aria-label": "Limpar busca", style: { position: "absolute", right: 0, width: 44, height: 44, background: "none", border: "none", cursor: "pointer", color: C.cinza, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 } }, /* @__PURE__ */ React.createElement(IcoX, { size: 14 })))), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px 0", background: "#fff", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setSoMarcados((v) => !v),
      "aria-pressed": soMarcados,
      style: {
        width: "100%",
        minHeight: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        background: soMarcados ? C.ouroBg : "#fff",
        color: soMarcados ? C.ouroTxt : C.tinta,
        border: `1px solid ${soMarcados ? C.ouroTxt : C.linha}`,
        borderRadius: 9,
        cursor: "pointer",
        fontFamily: "DM Sans,sans-serif",
        fontSize: 13,
        fontWeight: 600
      }
    },
    /* @__PURE__ */ React.createElement(IcoStar, { size: 15, color: soMarcados ? C.ouroTxt : C.cinza, filled: soMarcados }),
    soMarcados ? "Mostrando s\xF3 marcadas" : "S\xF3 marcadas",
    /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 500, color: C.cinza } }, "\xB7 ", markedCount, " neste dia")
  )), /* @__PURE__ */ React.createElement(DayTimeline, { dia }), hasFilter && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 5, padding: "5px 12px", background: "#f0f4fc", borderBottom: `1px solid ${C.linhaSoft}`, flexShrink: 0, overflowX: "auto", scrollbarWidth: "none", alignItems: "center" } }, filtroTipo && /* @__PURE__ */ React.createElement("span", { style: { ...chipSt(true, C.azul), minHeight: 0, fontSize: 12, padding: "3px 10px" } }, filtroTipo === "simposio" ? "Simp\xF3sio" : filtroTipo === "mini" ? "Mini" : "Sat\xE9lite"), soMarcados && /* @__PURE__ */ React.createElement("span", { style: { ...chipSt(true, C.ouroTxt), minHeight: 0, fontSize: 12, padding: "3px 10px" } }, "\u2605 Marcados"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setFiltroTipo(null);
    setSoMarcados(false);
  }, style: { minHeight: 44, minWidth: 44, border: "none", background: "none", color: C.cinza, fontSize: 12, cursor: "pointer", fontFamily: "inherit", padding: "0 8px", flexShrink: 0 } }, "Limpar \xD7")), /* @__PURE__ */ React.createElement("div", { ref: listRef, style: { flex: 1, overflowY: "auto", paddingBottom: 84 } }, items.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "40px 20px", color: C.cinza } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 28, marginBottom: 10 } }, "\u25CB"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, marginBottom: 12 } }, "Nenhuma sess\xE3o encontrada"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setBusca("");
    setFiltroTipo(null);
    setSoMarcados(false);
  }, style: { minHeight: 44, border: `1px solid ${C.linha}`, background: "#fff", color: C.azul, padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12 } }, "Limpar filtros")) : items.map((item, i) => item.tipo === "dia" ? /* @__PURE__ */ React.createElement("div", { key: item.id, style: { padding: "12px 16px 4px", fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, fontWeight: 700, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.08em" } }, item.label) : item.tipo === "intervalo" ? /* @__PURE__ */ React.createElement(IntervalRow, { key: i, item }) : /* @__PURE__ */ React.createElement(SessaoCard, { key: item.id, id: item.id })), items.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px", fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, textAlign: "center", letterSpacing: "0.04em" } }, "toque para abrir a sess\xE3o", /* @__PURE__ */ React.createElement("br", null), "Programa conferido com o site oficial em ", CCEM_PROGRAMA_CONFERIDO)), filterOpen && /* @__PURE__ */ React.createElement(
    "div",
    {
      style: { position: "fixed", inset: 0, zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end", background: "rgba(0,0,0,.38)" },
      onClick: () => setFilterOpen(false)
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Filtrar sess\xF5es",
        onKeyDown: (e) => e.key === "Escape" && setFilterOpen(false),
        style: { background: "#fff", borderRadius: "18px 18px 0 0", padding: "20px 18px 36px", maxWidth: 440, width: "100%", margin: "0 auto", boxShadow: "0 -4px 32px rgba(10,18,50,.18)" },
        onClick: (e) => e.stopPropagation()
      },
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: C.cinza, fontWeight: 600 } }, "Filtrar sess\xF5es"), /* @__PURE__ */ React.createElement("button", { autoFocus: true, onClick: () => setFilterOpen(false), "aria-label": "Fechar", style: { width: 44, height: 44, background: "none", border: "none", fontSize: 22, color: C.cinza, cursor: "pointer", lineHeight: 1, padding: 0 } }, "\xD7")),
      /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 9 } }, "Tipo de sess\xE3o"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 7, flexWrap: "wrap" } }, [["simposio", "Simp\xF3sio"], ["mini", "Mini-Confer\xEAncia"], ["satelite", "Sat\xE9lite"]].map(([t, lbl]) => /* @__PURE__ */ React.createElement("button", { key: t, onClick: () => setFiltroTipo(filtroTipo === t ? null : t), style: chipSt(filtroTipo === t, C.azul) }, lbl)))),
      /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 20 } }, /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => setSoMarcados((v) => !v),
          style: { ...chipSt(soMarcados, C.ouroTxt), width: "100%", justifyContent: "center" }
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
          style: { width: "100%", minHeight: 44, border: `1px solid ${C.linha}`, background: "#fff", color: C.cinza, borderRadius: 8, padding: "9px", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", marginBottom: 8 }
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
function ItemInstalar() {
  const appState = useAppState();
  const { instalado, plataforma, nativo } = useInstalacao();
  const [folha, setFolha] = useState(false);
  if (instalado || plataforma === "outro") return null;
  const temDados = Object.keys(appState.marks || {}).length > 0 || (appState.captures || []).length > 0;
  return /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 12, margin: "10px 14px 0", border: `1px solid ${C.linhaSoft}` } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: async () => {
        if (!(plataforma === "android" && nativo && await ccemInstalarNativo())) setFolha(true);
      },
      style: { width: "100%", minHeight: 56, display: "flex", alignItems: "center", gap: 11, padding: "8px 14px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }
    },
    /* @__PURE__ */ React.createElement("img", { src: "icon-192.png", alt: "", width: "34", height: "34", style: { borderRadius: 9, flexShrink: 0 } }),
    /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("span", { style: { display: "block", fontSize: 13.5, fontWeight: 600, color: C.tinta } }, "Instalar o app na tela inicial"), /* @__PURE__ */ React.createElement("span", { style: { display: "block", fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza } }, "abre pelo \xEDcone e funciona sem internet")),
    /* @__PURE__ */ React.createElement(IcoChevR, { size: 16, color: C.cinza })
  ), folha && /* @__PURE__ */ React.createElement(FolhaInstalar, { temDados, aoFechar: () => setFolha(false) }));
}
function InfoScreen() {
  const IC = ({ children, style }) => /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 12, padding: "13px 14px", margin: "10px 14px 0", border: `1px solid ${C.linhaSoft}`, boxShadow: "0 1px 5px rgba(29,62,138,.04)", ...style || {} } }, children);
  const H3 = ({ children }) => /* @__PURE__ */ React.createElement("h3", { style: { fontFamily: "Georgia,serif", fontSize: 13.5, fontWeight: 600, color: C.tinta, margin: "0 0 8px", letterSpacing: "-0.005em" } }, children);
  const Row = ({ lbl, val }) => /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, fontSize: 12.5, color: C.cinza, padding: "6px 0", borderBottom: `1px solid ${C.linhaSoft}` } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.08em", width: 72, flexShrink: 0, lineHeight: 1.6 } }, lbl), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, color: C.tinta } }, val));
  const CR = ({ icon, lbl, val, href, ultimo }) => /* @__PURE__ */ React.createElement("a", { href, target: "_blank", rel: "noopener", style: { display: "flex", alignItems: "center", gap: 11, minHeight: 44, padding: "9px 0", borderBottom: ultimo ? "none" : `1px solid ${C.linhaSoft}`, textDecoration: "none" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 34, height: 34, borderRadius: 9, background: C.azulBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: C.azul } }, icon), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 } }, lbl), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: C.azul } }, val)));
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflowY: "auto", paddingBottom: 84 } }, /* @__PURE__ */ React.createElement("div", { style: { background: C.azul, color: "#fff", padding: "20px 16px 18px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.75, marginBottom: 4 } }, "SBEM-SC \xB7 Sociedade Brasileira de Endocrinologia e Metabologia"), /* @__PURE__ */ React.createElement("h2", { style: { fontFamily: "Georgia,serif", fontSize: 21, fontWeight: 600, margin: "0 0 3px", lineHeight: 1.2, letterSpacing: "-0.01em" } }, "12\xBA CCEM 2026"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, opacity: 0.8, lineHeight: 1.4, margin: "0 0 10px" } }, "Congresso Catarinense de Endocrinologia e Metabologia"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, background: "rgba(255,255,255,.12)", padding: "7px 10px", borderRadius: 6, letterSpacing: "0.02em", lineHeight: 1.7 } }, "Expoville \xB7 Rua XV de Novembro, 4315 \xB7 Joinville/SC", /* @__PURE__ */ React.createElement("br", null), "23 e 24 de Outubro de 2026")), /* @__PURE__ */ React.createElement(IC, null, /* @__PURE__ */ React.createElement(H3, null, "Organiza\xE7\xE3o"), /* @__PURE__ */ React.createElement(Row, { lbl: "Presidente", val: "Dr. Fulvio Clemo Santos Tomaselli \u2014 SBEM-SC" }), /* @__PURE__ */ React.createElement(Row, { lbl: "Pres. eleito", val: "Dr. Frederico Guimar\xE3es Marchisotti" }), /* @__PURE__ */ React.createElement(Row, { lbl: "Dir. cient.", val: "Dr. Dalisbor Marcelo Weber Silva" }), /* @__PURE__ */ React.createElement(Row, { lbl: "Secretaria", val: "Sex 23/10 \xB7 07h30\u201318h30 \xB7 S\xE1b 24/10 \xB7 07h30\u201318h" }), /* @__PURE__ */ React.createElement(Row, { lbl: "Abertura", val: "Sexta, 23/10 \xB7 08h00" }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, fontSize: 12.5, color: C.cinza, padding: "6px 0" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.08em", width: 72, flexShrink: 0, lineHeight: 1.6 } }, "Cert."), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, color: C.tinta } }, "Dispon\xEDveis a partir de ", /* @__PURE__ */ React.createElement("strong", null, "05/11/2026"), " via CPF \u2014 apenas para inscritos presentes."))), /* @__PURE__ */ React.createElement(IC, null, /* @__PURE__ */ React.createElement(H3, null, "Contato"), /* @__PURE__ */ React.createElement(CR, { icon: /* @__PURE__ */ React.createElement(IcoPhone, { size: 17 }), lbl: "WhatsApp", val: "(47) 99130-3330", href: "https://wa.me/5547991303330" }), /* @__PURE__ */ React.createElement(CR, { icon: /* @__PURE__ */ React.createElement(IcoMail, { size: 17 }), lbl: "E-mail", val: "contato@ccem2026.com.br", href: "mailto:contato@ccem2026.com.br" }), /* @__PURE__ */ React.createElement(CR, { icon: /* @__PURE__ */ React.createElement(IcoInsta, { size: 17 }), lbl: "Instagram", val: "@sbemsceventos", href: "https://instagram.com/sbemsceventos" }), /* @__PURE__ */ React.createElement(CR, { icon: /* @__PURE__ */ React.createElement(IcoGlobe, { size: 17 }), lbl: "Site oficial", val: "ccem2026.com.br \u2197", href: "https://www.ccem2026.com.br", ultimo: true })), /* @__PURE__ */ React.createElement(ItemInstalar, null), /* @__PURE__ */ React.createElement(IC, null, /* @__PURE__ */ React.createElement(H3, null, "Privacidade e dados"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12.5, color: C.tinta, lineHeight: 1.55, margin: "0 0 10px", padding: "8px 10px", background: "#f5f8fd", borderRadius: 7, borderLeft: `3px solid ${C.linha}` } }, "Suas notas, fotos e marca\xE7\xF5es ficam s\xF3 neste aparelho, sem cadastro. Se voc\xEA limpar o navegador ou trocar de aparelho, elas se perdem: use Exportar ou Backup, no Caderno. O app fica dispon\xEDvel at\xE9 31/12/2026."), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12.5, color: C.tinta, lineHeight: 1.55, margin: "0 0 10px", padding: "8px 10px", background: "#f5f8fd", borderRadius: 7, borderLeft: `3px solid ${C.linha}` } }, 'A IA s\xF3 recebe algo quando voc\xEA a usa. A pergunta, o texto ou a foto (Assistente, Perguntar sobre o slide, Resumir e Organizar com IA) v\xE3o para processamento pela Anthropic, nos EUA; o app n\xE3o guarda c\xF3pia no servidor, e a Anthropic segue a pr\xF3pria pol\xEDtica de reten\xE7\xE3o. Em "Encontrar o artigo", s\xF3 o texto da refer\xEAncia vai ao PubMed e ao Unpaywall. N\xE3o envie dados nem imagens de pacientes. As respostas da IA podem conter erros.'), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12.5, color: C.tinta, lineHeight: 1.55, margin: "0 0 10px", padding: "8px 10px", background: "#f5f8fd", borderRadius: 7, borderLeft: `3px solid ${C.linha}` } }, "A IA \xE9 exclusiva para inscritos: para us\xE1-la, voc\xEA entra com o e-mail da inscri\xE7\xE3o e recebe um c\xF3digo. O e-mail serve s\xF3 para conferir a inscri\xE7\xE3o na lista da organiza\xE7\xE3o; o app n\xE3o guarda essa lista."), /* @__PURE__ */ React.createElement(SessaoInfo, null), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12.5, color: C.cinza, lineHeight: 1.55, margin: "0 0 10px" } }, 'O selo "Agora" segue o hor\xE1rio previsto no programa; atrasos no evento n\xE3o aparecem no app.'), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        if (confirm("Apagar todas as notas, fotos e marca\xE7\xF5es deste aparelho? N\xE3o d\xE1 para desfazer.")) ccemLimparTudo().then(() => location.reload());
      },
      style: { width: "100%", minHeight: 44, border: "1px solid #e53e3e", background: "#fff", color: "#e53e3e", borderRadius: 8, padding: "8px", fontSize: 12.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }
    },
    "Limpar todos os meus dados"
  )), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "18px 16px 4px", fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, lineHeight: 1.9 } }, /* @__PURE__ */ React.createElement("div", null, "Meu CCEM 2026 \xB7 v4.1"), /* @__PURE__ */ React.createElement("div", null, "Realiza\xE7\xE3o: SBEM-SC"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6 } }, /* @__PURE__ */ React.createElement("a", { href: "https://www.ccem2026.com.br", target: "_blank", rel: "noopener", style: { display: "inline-flex", alignItems: "center", minHeight: 44, color: C.azul, textDecoration: "none", fontSize: 12 } }, "ccem2026.com.br \xB7 site oficial do congresso \u2197")))));
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
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 7, margin: "8px 0 0", padding: "5px 8px", background: bg[st.kind] || "#f5f7fb", borderRadius: 7, border: `1px solid ${C.linhaSoft}` } }, /* @__PURE__ */ React.createElement("span", { style: { width: 6, height: 6, borderRadius: "50%", background: dotColors[st.kind], flexShrink: 0, boxShadow: st.kind === "live" ? "0 0 0 3px rgba(34,197,94,.2)" : "none" } }), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: st.kind === "live" ? C.azulSoft : C.cinza, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, flexShrink: 0 } }, st.tag), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: C.tinta, fontWeight: 500, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, st.text), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, flexShrink: 0 } }, st.time));
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
  ), /* @__PURE__ */ React.createElement("div", { onClick: () => go("#/"), style: { display: "none", alignItems: "baseline", gap: 4, cursor: "pointer" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 17, color: C.azul, letterSpacing: "-0.02em" } }, "CCEM"), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.ouroTxt, letterSpacing: "0.08em" } }, "2026"))), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, letterSpacing: "0.05em", textTransform: "uppercase" } }, "23\u201324 OUT \xB7 Joinville/SC"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.ouroTxt, letterSpacing: "0.04em", marginTop: 1 } }, "Expoville"))), /* @__PURE__ */ React.createElement(LiveStrip, null));
}
function TrabalhosScreen() {
  const T = CCEM_TRABALHOS;
  const IC = ({ children }) => /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 12, padding: "13px 14px", margin: "10px 14px 0", border: `1px solid ${C.linhaSoft}`, boxShadow: "0 1px 5px rgba(29,62,138,.04)" } }, children);
  const H3 = ({ children }) => /* @__PURE__ */ React.createElement("h3", { style: { fontFamily: "Georgia,serif", fontSize: 14, fontWeight: 600, color: C.tinta, margin: "0 0 8px" } }, children);
  const P = ({ children }) => /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: C.tinta, lineHeight: 1.55, margin: "0 0 6px" } }, children);
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflowY: "auto", paddingBottom: 84 } }, /* @__PURE__ */ React.createElement("div", { style: { background: C.azul, color: "#fff", padding: "20px 16px 18px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.75, marginBottom: 4 } }, "12\xBA CCEM 2026"), /* @__PURE__ */ React.createElement("h2", { style: { fontFamily: "Georgia,serif", fontSize: 21, fontWeight: 600, margin: 0, lineHeight: 1.2 } }, "Trabalhos cient\xEDficos")), /* @__PURE__ */ React.createElement(IC, null, /* @__PURE__ */ React.createElement(H3, null, "Trabalhos aprovados"), /* @__PURE__ */ React.createElement(P, null, "A lista completa est\xE1 no site oficial do congresso."), /* @__PURE__ */ React.createElement(
    "a",
    {
      href: LINK_EPOSTER,
      target: "_blank",
      rel: "noopener",
      style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 48, marginTop: 6, borderRadius: 10, background: C.azul, color: "#fff", textDecoration: "none", fontFamily: "DM Sans,sans-serif", fontSize: 14, fontWeight: 700 }
    },
    "Ver trabalhos aprovados ",
    /* @__PURE__ */ React.createElement(IcoLink, { size: 16, color: "#fff" })
  )), /* @__PURE__ */ React.createElement(IC, null, /* @__PURE__ */ React.createElement(H3, null, "Apresenta\xE7\xF5es"), /* @__PURE__ */ React.createElement(P, null, T.exibicao), /* @__PURE__ */ React.createElement(P, null, T.apresentacao), T.cronograma ? T.cronograma.map((c, i) => /* @__PURE__ */ React.createElement(P, { key: i }, /* @__PURE__ */ React.createElement("b", null, c.quando), " \xB7 ", c.oque)) : /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12.5, color: C.cinza, lineHeight: 1.5, margin: "4px 0 0" } }, "O cronograma das apresenta\xE7\xF5es ser\xE1 divulgado pela organiza\xE7\xE3o e aparecer\xE1 aqui.")), /* @__PURE__ */ React.createElement(IC, null, /* @__PURE__ */ React.createElement(H3, null, "Publica\xE7\xE3o"), /* @__PURE__ */ React.createElement(P, null, T.publicacao)), /* @__PURE__ */ React.createElement(IC, null, /* @__PURE__ */ React.createElement(H3, null, "Para os autores"), /* @__PURE__ */ React.createElement(P, null, "Enviar a apresenta\xE7\xE3o em PDF at\xE9 ", /* @__PURE__ */ React.createElement("b", null, T.envio.prazo), " para", " ", /* @__PURE__ */ React.createElement("a", { href: "mailto:" + T.envio.email, style: { color: C.azul, fontWeight: 600 } }, T.envio.email), "."), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, color: C.cinza, lineHeight: 1.5, margin: "8px 0 0" } }, "Informa\xE7\xF5es conferidas no site oficial em ", T.conferido, ". Em caso de d\xFAvida, vale o site oficial."))));
}
function TabBar({ aba }) {
  const tabs = [
    { id: "programa", icon: /* @__PURE__ */ React.createElement(IcoCal, { size: 21 }), lbl: "Programa" },
    { id: "assistente", icon: /* @__PURE__ */ React.createElement(IcoChat, { size: 21 }), lbl: "Assistente" },
    { id: "caderno", icon: /* @__PURE__ */ React.createElement(IcoBook, { size: 21 }), lbl: "Caderno" },
    ...LINK_EPOSTER ? [{ id: "trabalhos", icon: /* @__PURE__ */ React.createElement(IcoPoster, { size: 21 }), lbl: "Trabalhos" }] : [],
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
      /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,sans-serif", fontSize: 12, fontWeight: on ? 600 : 400 } }, t.lbl)
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
    { id: "assistente", icon: /* @__PURE__ */ React.createElement(IcoChat, { size: 20 }), lbl: "Assistente" },
    { id: "caderno", icon: /* @__PURE__ */ React.createElement(IcoBook, { size: 20 }), lbl: "Caderno" },
    ...LINK_EPOSTER ? [{ id: "trabalhos", icon: /* @__PURE__ */ React.createElement(IcoPoster, { size: 20 }), lbl: "Trabalhos" }] : [],
    { id: "info", icon: /* @__PURE__ */ React.createElement(IcoInfo, { size: 20 }), lbl: "Info" }
  ];
  return /* @__PURE__ */ React.createElement("div", { style: { width: 220, background: "#fff", borderRight: `1px solid ${C.linha}`, display: "flex", flexDirection: "column", flexShrink: 0, height: "100%", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "22px 18px 14px", borderBottom: `1px solid ${C.linhaSoft}` } }, /* @__PURE__ */ React.createElement("button", { onClick: () => go("#/"), style: { display: "flex", alignItems: "baseline", gap: 6, marginBottom: 5, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "none" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 22, color: C.azul, letterSpacing: "-0.02em" } }, "CCEM"), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.ouroTxt, letterSpacing: "0.08em" } }, "2026")), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, letterSpacing: "0.04em", marginTop: 2 } }, "23\u201324 out \xB7 Joinville/SC"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10 } }, /* @__PURE__ */ React.createElement(LiveStrip, null))), /* @__PURE__ */ React.createElement("nav", { style: { flex: 1, padding: "10px 8px", overflowY: "auto" } }, tabs.map((t) => {
    const on = aba === t.id || aba === "sessao" && t.id === "programa";
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: t.id,
        onClick: () => go("#/" + t.id),
        style: { width: "100%", minHeight: 44, display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", border: "none", background: on ? C.azulBg : "none", color: on ? C.azul : C.cinza, borderRadius: 9, cursor: "pointer", fontFamily: "DM Sans,sans-serif", fontSize: 13.5, fontWeight: on ? 700 : 400, marginBottom: 2, transition: "all .15s", textAlign: "left" }
      },
      /* @__PURE__ */ React.createElement("span", { style: { flexShrink: 0, color: on ? C.azul : C.cinza } }, t.icon),
      t.lbl,
      on && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: C.azul, flexShrink: 0 } })
    );
  })), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px", borderTop: `1px solid ${C.linhaSoft}` } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, lineHeight: 1.7 } }, "Meu CCEM 2026 \xB7 v4.1", /* @__PURE__ */ React.createElement("br", null), "Realiza\xE7\xE3o: SBEM-SC")));
}
function AreaComFab({ fab, reserva, children }) {
  return /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0, position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 } }, children), reserva && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: { height: 84, flexShrink: 0, background: C.papel, borderTop: `1px solid ${C.linhaSoft}` } }), fab);
}
function AppShell({ showShell, aba, fab, reservaFab, children }) {
  const isDesktop = useIsDesktop();
  if (isDesktop) {
    return /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", overflow: "hidden", minHeight: 0 } }, /* @__PURE__ */ React.createElement(DesktopSidebar, { aba }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", minHeight: 0, background: "#e8eef8" } }, /* @__PURE__ */ React.createElement("div", { style: { width: "100%", maxWidth: 800, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0, background: C.papel } }, /* @__PURE__ */ React.createElement(AreaComFab, { fab, reserva: reservaFab }, children))));
  }
  return /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 } }, showShell ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(AppHeader, null), /* @__PURE__ */ React.createElement(AreaComFab, { fab, reserva: reservaFab }, children), /* @__PURE__ */ React.createElement(TabBar, { aba })) : /* @__PURE__ */ React.createElement(AreaComFab, { fab, reserva: reservaFab }, children));
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
  InfoScreen,
  TrabalhosScreen,
  BadgePill,
  TopicPill,
  IntervalRow,
  SessaoCard,
  sessionIsPast,
  isEventWeek
});
