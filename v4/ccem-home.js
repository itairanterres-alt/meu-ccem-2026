function HomeScreen() {
  const now = ccemAgora();
  useMinuto();
  const estado = ccemEstado(now);
  const daysLeft = Math.max(0, Math.ceil((CCEM_INICIO - now) / 864e5));
  const appState = useAppState();
  const capCount = (appState.captures || []).length;
  const markCount = Object.keys(appState.marks || {}).length;
  const shortcuts = [
    { id: "programa", icon: /* @__PURE__ */ React.createElement(IcoCal, { size: 24 }), lbl: "Programa", sub: "20 sess\xF5es \xB7 2 dias" },
    { id: "assistente", icon: /* @__PURE__ */ React.createElement(IcoChat, { size: 24 }), lbl: "Assistente", sub: "notas \xB7 busca cient\xEDfica" },
    { id: "caderno", icon: /* @__PURE__ */ React.createElement(IcoBook, { size: 24 }), lbl: "Caderno", sub: capCount > 0 ? capCount + " nota" + (capCount !== 1 ? "s" : "") : "suas anota\xE7\xF5es" },
    // Some se LINK_EPOSTER for null.
    ...LINK_EPOSTER ? [{ id: "trabalhos", largo: true, icon: /* @__PURE__ */ React.createElement(IcoPoster, { size: 24 }), lbl: "Trabalhos cient\xEDficos", sub: "aprovados \xB7 apresenta\xE7\xF5es \xB7 anais" }] : []
  ];
  return /* @__PURE__ */ React.createElement("div", { style: { height: "100%", overflowY: "auto", background: C.papel } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderBottom: `1px solid ${C.linhaSoft}`, position: "relative", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { height: 4, background: `linear-gradient(90deg, ${C.ouro} 0%, #f5c842 100%)` } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", padding: "16px 20px 14px", borderBottom: `1px solid ${C.linhaSoft}`, gap: 0 } }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "v4/logo-ccem.png",
      alt: "CCEM 2026",
      style: { height: 64, flex: 1, minWidth: 0, objectFit: "contain", objectPosition: "left" }
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { width: 1, height: 44, background: C.linhaSoft, flexShrink: 0, margin: "0 16px" } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, fontWeight: 600, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.08em" } }, "Realiza\xE7\xE3o"), /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "v4/logo-sbem.png",
      alt: "SBEM-SC",
      style: { height: 52, objectFit: "contain" }
    }
  ))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 20px 16px", borderBottom: `1px solid ${C.linhaSoft}` } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 13, fontWeight: 600, color: C.azul } }, "23 e 24 de Outubro de 2026"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.azulSoft, marginTop: 2 } }, "Local: Expoville \xB7 Joinville/SC")), /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 20px" } }, estado.fase === "antes" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "inline-flex", alignItems: "center", gap: 14, background: C.azul, borderRadius: 12, padding: "12px 18px" } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 36, fontWeight: 700, lineHeight: 1, color: C.ouroClaro } }, daysLeft), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,.75)", marginTop: 3 } }, daysLeft === 1 ? "dia" : "dias")), /* @__PURE__ */ React.createElement("div", { style: { width: 1, height: 38, background: "rgba(255,255,255,.18)" } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, lineHeight: 1.5, color: "#fff" } }, "para o CCEM 2026", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: "rgba(255,255,255,.8)" } }, "sexta 23/out \xB7 08h00"))), estado.aSeguir && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10, fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 13, color: C.tinta } }, "Primeira sess\xE3o: ", /* @__PURE__ */ React.createElement("b", null, ccemHoraH(estado.aSeguir.inicio)), " \xB7 ", estado.aSeguir.badge)), estado.fase === "durante" && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, estado.agora ? /* @__PURE__ */ React.createElement(
    CardMomento,
    {
      rotulo: "Agora",
      sessao: estado.agora,
      vivo: true,
      detalhe: "at\xE9 " + estado.agora.fim + " \xB7 faltam " + estado.restanteMin + " min"
    }
  ) : /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 13, color: C.cinza } }, "Intervalo"), estado.aSeguir && /* @__PURE__ */ React.createElement(
    CardMomento,
    {
      rotulo: "A seguir",
      sessao: estado.aSeguir,
      detalhe: (estado.aSeguir.dia !== ccemDiaDoEvento(now) ? "amanh\xE3 \xB7 " : "") + estado.aSeguir.inicio
    }
  )), estado.fase === "depois" && /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go("#/caderno"),
      style: { display: "inline-flex", alignItems: "center", gap: 8, minHeight: 44, background: "#f3f4f6", border: "none", borderRadius: 10, padding: "10px 14px", cursor: "pointer" }
    },
    /* @__PURE__ */ React.createElement(IcoBook, { size: 16, color: C.azul }),
    /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 13, color: C.tinta } }, "Congresso encerrado \xB7 ", /* @__PURE__ */ React.createElement("b", { style: { color: C.azul } }, "baixe seu caderno"))
  ), (markCount > 0 || capCount > 0) && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 12 } }, markCount > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 5, background: "#fef9ec", border: `1px solid ${C.ouroTxt}44`, borderRadius: 8, padding: "5px 10px" } }, /* @__PURE__ */ React.createElement(IcoStar, { size: 11, color: C.ouroTxt, filled: true }), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.ouroTxt } }, markCount, " marcada", markCount !== 1 ? "s" : "")), capCount > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 5, background: "#eff6ff", border: `1px solid ${C.azul}33`, borderRadius: 8, padding: "5px 10px" } }, /* @__PURE__ */ React.createElement(IcoCapture, { size: 11, color: C.azul }), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.azul } }, capCount, " nota", capCount !== 1 ? "s" : ""))))), /* @__PURE__ */ React.createElement(ConviteInstalar, { appState }), /* @__PURE__ */ React.createElement(MinhasSessoes, { appState, agora: now }), /* @__PURE__ */ React.createElement("div", { style: { padding: "20px 16px 10px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: C.cinza, marginBottom: 12, fontWeight: 600 } }, "Acesso r\xE1pido"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 } }, shortcuts.map((s, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: s.id,
      onClick: () => go("#/" + s.id),
      style: { gridColumn: i === 0 || s.largo ? "1 / -1" : "auto", background: "#fff", border: `1px solid ${C.linhaSoft}`, borderRadius: 13, padding: "14px 14px 12px", textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: 8, boxShadow: "0 1px 6px rgba(29,62,138,.05)", transition: "all .15s" },
      onMouseOver: (e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 18px rgba(29,62,138,.11)";
        e.currentTarget.style.borderColor = C.azul;
      },
      onMouseOut: (e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "0 1px 6px rgba(29,62,138,.05)";
        e.currentTarget.style.borderColor = C.linhaSoft;
      }
    },
    /* @__PURE__ */ React.createElement("span", { style: { color: C.azul } }, s.icon),
    /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.tinta, marginBottom: 2 } }, s.lbl), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza } }, s.sub))
  )))));
}
const CCEM_CONVITE_INSTALAR = "ccem2026:conviteInstalar";
function ConviteInstalar({ appState }) {
  const { instalado, plataforma, nativo } = useInstalacao();
  const [fechado, setFechado] = useState(() => {
    try {
      return !!localStorage.getItem(CCEM_CONVITE_INSTALAR);
    } catch (e) {
      return false;
    }
  });
  const [folha, setFolha] = useState(false);
  const temDados = Object.keys(appState.marks || {}).length > 0 || (appState.captures || []).length > 0;
  let apresentado = true;
  try {
    apresentado = !!localStorage.getItem("ccem2026:assistenteApresentado");
  } catch (e) {
  }
  if (instalado || fechado || plataforma === "outro" || !apresentado || CCEM_VISITAS < 2 && !temDados) return null;
  const fechar = () => {
    try {
      localStorage.setItem(CCEM_CONVITE_INSTALAR, "1");
    } catch (e) {
    }
    setFechado(true);
  };
  async function instalar() {
    if (plataforma === "android" && nativo && await ccemInstalarNativo()) {
      fechar();
      return;
    }
    setFolha(true);
  }
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 16px 0" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, alignItems: "flex-start", background: "#fff", border: `1px solid ${C.linha}`, borderLeft: `3px solid ${C.azul}`, borderRadius: 12, padding: "12px 12px 10px" } }, /* @__PURE__ */ React.createElement("img", { src: "icon-192.png", alt: "", width: "40", height: "40", style: { borderRadius: 10, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.tinta, marginBottom: 2 } }, "Instale o Meu CCEM na tela inicial"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, color: C.cinza, lineHeight: 1.45 } }, "Abre pelo \xEDcone, em tela cheia, e funciona sem internet.", plataforma === "ios" && temDados && " No iPhone, o app instalado come\xE7a vazio \u2014 fa\xE7a o Backup antes (as instru\xE7\xF5es explicam)."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 8 } }, /* @__PURE__ */ React.createElement("button", { onClick: fechar, style: { minHeight: 44, padding: "0 12px", background: "#fff", border: `1px solid ${C.linha}`, borderRadius: 9, fontFamily: "DM Sans,sans-serif", fontSize: 13, fontWeight: 600, color: C.cinza, cursor: "pointer" } }, "Agora n\xE3o"), /* @__PURE__ */ React.createElement("button", { onClick: instalar, style: { minHeight: 44, padding: "0 16px", background: C.azul, border: "none", borderRadius: 9, fontFamily: "DM Sans,sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" } }, plataforma === "android" && nativo ? "Instalar" : "Como instalar")))), folha && /* @__PURE__ */ React.createElement(FolhaInstalar, { temDados, aoFechar: () => {
    setFolha(false);
    fechar();
  } }));
}
function ccemHoraH(hhmm) {
  return hhmm.replace(":", "h");
}
function CardMomento({ rotulo, sessao, detalhe, vivo }) {
  const abre = sessao.navegavel;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      onClick: () => abre && go("#/sessao/" + sessao.id),
      role: abre ? "button" : void 0,
      tabIndex: abre ? 0 : void 0,
      onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && abre && go("#/sessao/" + sessao.id),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        minHeight: 44,
        background: vivo ? "rgba(34,197,94,.08)" : "#fff",
        border: `1px solid ${vivo ? "rgba(34,197,94,.35)" : C.linhaSoft}`,
        borderRadius: 12,
        padding: "10px 14px",
        cursor: abre ? "pointer" : "default"
      }
    },
    vivo && /* @__PURE__ */ React.createElement("span", { style: { width: 9, height: 9, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 3px rgba(34,197,94,.25)", flexShrink: 0 } }),
    /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: vivo ? "#15803d" : C.cinza, fontWeight: 700, marginBottom: 2 } }, rotulo), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: C.tinta, lineHeight: 1.3 } }, ccemRotulo(sessao)), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, marginTop: 2 } }, detalhe)),
    abre && /* @__PURE__ */ React.createElement(IcoChevR, { size: 15, color: C.cinza })
  );
}
function MinhasSessoes({ appState, agora }) {
  const diaRef = ccemDiaDoEvento(agora);
  const lista = ccemMarcadas(appState, diaRef);
  const todas = ccemMarcadas(appState);
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "20px 16px 0" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: C.cinza, fontWeight: 600 } }, "Minhas sess\xF5es", diaRef ? " \xB7 hoje" : ""), lista.length > 0 && /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza } }, lista.length)), lista.length === 0 ? /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go("#/programa"),
      style: { width: "100%", minHeight: 44, textAlign: "left", background: "#fff", border: `1px dashed ${C.linha}`, borderRadius: 12, padding: "12px 14px", cursor: "pointer", fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 13, color: C.cinza }
    },
    todas.length > 0 ? "Nenhuma sess\xE3o marcada para hoje \xB7 ver programa" : "Marque sess\xF5es no Programa para acompanh\xE1-las aqui"
  ) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, lista.map((s) => {
    const vivo = ccemSessaoNoAr(s, agora);
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: s.id,
        onClick: () => go("#/sessao/" + s.id),
        role: "button",
        tabIndex: 0,
        onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && go("#/sessao/" + s.id),
        style: {
          display: "flex",
          alignItems: "center",
          gap: 10,
          minHeight: 44,
          background: vivo ? "rgba(34,197,94,.08)" : "#fff",
          border: `1px solid ${vivo ? "rgba(34,197,94,.35)" : C.linhaSoft}`,
          borderRadius: 10,
          padding: "9px 12px",
          cursor: "pointer"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { minWidth: 44, fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 13, fontWeight: 700, color: C.azul } }, s.inicio, !diaRef && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 500, color: C.cinza } }, s.dia.split(" \xB7 ")[0])),
      /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, color: C.tinta, lineHeight: 1.3 } }, ccemRotulo(s)),
      vivo && /* @__PURE__ */ React.createElement("span", { style: { background: "#15803d", color: "#fff", fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", padding: "2px 8px", borderRadius: 10 } }, "Agora")
    );
  })), todas.length > 0 && /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => ccemBaixarIcs(todas, "ccem-2026-minhas-sessoes.ics"),
      style: { width: "100%", minHeight: 44, marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#fff", color: C.azul, border: `1px solid ${C.linha}`, borderRadius: 10, cursor: "pointer", fontFamily: "DM Sans,sans-serif", fontSize: 13, fontWeight: 600 }
    },
    /* @__PURE__ */ React.createElement(IcoCal, { size: 16, color: C.azul }),
    "Adicionar minhas sess\xF5es ao calend\xE1rio"
  ));
}
Object.assign(window, { HomeScreen });
