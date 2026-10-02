function App() {
  const hash = useHashRoute();
  const route = useMemo(() => {
    const parts = (hash || "#/").replace(/^#\/?/, "").split("/").filter(Boolean);
    const IDS_ANTIGOS = { "simp4-hipofise": "simp4-adrenal", "simp8-adrenal": "simp8-hipofise" };
    if (parts[0] === "sessao" && parts[1]) return { tela: "sessao", id: IDS_ANTIGOS[parts[1]] || parts[1] };
    if (parts[0] === "programa") return { tela: "programa" };
    if (parts[0] === "assistente") return { tela: "assistente" };
    if (parts[0] === "caderno") return { tela: "caderno" };
    if (parts[0] === "info") return { tela: "info" };
    if (parts[0] === "trabalhos") return { tela: "info" };
    return { tela: "home" };
  }, [hash]);
  const showShell = route.tela !== "sessao" && route.tela !== "home";
  const [painel, setPainel] = useState(false);
  const teclado = useTecladoAberto();
  useEffect(() => {
    const abrir = () => setPainel(true);
    window.addEventListener("ccem:abrir-assistente", abrir);
    return () => window.removeEventListener("ccem:abrir-assistente", abrir);
  }, []);
  const [editor, setEditor] = useState(null);
  useEffect(() => {
    const abrir = (e) => setEditor(e.detail || {});
    window.addEventListener("ccem:anotar", abrir);
    return () => window.removeEventListener("ccem:anotar", abrir);
  }, []);
  useEffect(() => {
    setPainel(false);
    setEditor(null);
  }, [hash]);
  const comFab = ["home", "programa", "info", "sessao"].includes(route.tela);
  const reserva = route.tela === "home" || route.tela === "sessao";
  const [apresentar, concluirApresentacao] = useApresentacaoAssistente();
  const abrirPainel = () => {
    concluirApresentacao();
    setPainel(true);
  };
  useEffect(() => {
    if (painel && apresentar) concluirApresentacao();
  }, [painel]);
  const comBalao = apresentar && (route.tela === "home" || route.tela === "programa");
  const fab = comFab && !painel && !editor && !teclado ? /* @__PURE__ */ React.createElement(React.Fragment, null, comBalao && /* @__PURE__ */ React.createElement(BalaoAssistente, { aoExperimentar: abrirPainel, aoFechar: concluirApresentacao }), /* @__PURE__ */ React.createElement(BotaoAssistente, { aoTocar: abrirPainel, apresentando: comBalao })) : null;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(AvisoAtualizacao, null), /* @__PURE__ */ React.createElement(LembretePDF, null), editor && /* @__PURE__ */ React.createElement(EditorNota, { notaId: editor.notaId, sessaoId: editor.sessaoId, aoFechar: () => setEditor(null) }), painel && /* @__PURE__ */ React.createElement(PainelAssistente, { sessaoId: route.tela === "sessao" ? route.id : null, tela: route.tela === "sessao" ? "sessao" : route.tela, aoFechar: () => setPainel(false) }), /* @__PURE__ */ React.createElement(AppShell, { showShell, aba: route.tela, fab, reservaFab: reserva }, route.tela === "sessao" && /* @__PURE__ */ React.createElement(SessaoDetail, { id: route.id }), route.tela === "home" && /* @__PURE__ */ React.createElement(HomeScreen, null), route.tela === "assistente" && /* @__PURE__ */ React.createElement(AssistenteScreen, null), route.tela === "caderno" && /* @__PURE__ */ React.createElement(CadernoScreen, null), route.tela === "info" && /* @__PURE__ */ React.createElement(InfoScreen, null), route.tela === "programa" && /* @__PURE__ */ React.createElement(ProgramaScreen, null)));
}
function AvisoAtualizacao() {
  const [pronta, setPronta] = useState(() => !!window.__ccemNovaVersao);
  const [offline, setOffline] = useState(() => navigator.onLine === false);
  useEffect(() => {
    const nova = () => setPronta(true), on = () => setOffline(false), off = () => setOffline(true);
    window.addEventListener("ccem:nova-versao", nova);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("ccem:nova-versao", nova);
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  if (pronta) return /* @__PURE__ */ React.createElement("div", { role: "status", style: { display: "flex", alignItems: "center", gap: 8, padding: "4px 6px 4px 12px", background: C.azulBg, borderBottom: `1px solid ${C.linha}`, flexShrink: 0 } }, /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontFamily: "DM Sans,sans-serif", fontSize: 13, color: C.tinta } }, "Nova vers\xE3o do app dispon\xEDvel"), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => window.ccemAplicarAtualizacao && window.ccemAplicarAtualizacao(),
      style: { minHeight: 44, padding: "0 14px", background: C.azul, color: "#fff", border: "none", borderRadius: 8, fontFamily: "DM Sans,sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer" }
    },
    "Atualizar"
  ));
  if (offline) return /* @__PURE__ */ React.createElement("div", { role: "status", style: { padding: "6px 12px", background: "#f5f7fb", borderBottom: `1px solid ${C.linha}`, fontFamily: "DM Sans,sans-serif", fontSize: 12.5, color: C.cinza, flexShrink: 0 } }, "Sem internet \xB7 usando a vers\xE3o salva no aparelho. Programa, marca\xE7\xF5es e Caderno funcionam normalmente.");
  return null;
}
const LEMBRETE_INICIO = /* @__PURE__ */ new Date("2026-10-24T16:00:00-03:00");
const LEMBRETE_FIM = /* @__PURE__ */ new Date("2026-11-01T00:00:00-03:00");
const LEMBRETE_CHAVE = "ccem2026:lembretePDF";
function LembretePDF() {
  const appState = useAppState();
  useMinuto();
  const agora = ccemAgora();
  const hoje = ccemDataHoraJoinville(agora.getTime()).data;
  const [fechadoEm, setFechadoEm] = useState(() => {
    try {
      return localStorage.getItem(LEMBRETE_CHAVE);
    } catch (e) {
      return null;
    }
  });
  const notas = appState.captures || [];
  if (agora < LEMBRETE_INICIO || agora >= LEMBRETE_FIM) return null;
  if (!notas.length || fechadoEm === hoje) return null;
  function fechar() {
    try {
      localStorage.setItem(LEMBRETE_CHAVE, hoje);
    } catch (e) {
    }
    setFechadoEm(hoje);
  }
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "region",
      "aria-label": "Lembrete do caderno",
      style: { display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: C.ouroBg, borderBottom: `1px solid ${C.ouroTxt}55`, flexShrink: 0 }
    },
    /* @__PURE__ */ React.createElement(IcoBook, { size: 16, color: C.ouroTxt }),
    /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          ccemExportarCaderno(notas);
          fechar();
        },
        style: { flex: 1, minHeight: 44, textAlign: "left", background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "DM Sans,sans-serif", fontSize: 13, fontWeight: 700, color: C.tinta }
      },
      "Baixe seu caderno em PDF"
    ),
    /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: fechar,
        style: { minHeight: 44, padding: "0 10px", background: "none", border: "none", cursor: "pointer", fontFamily: "DM Sans,sans-serif", fontSize: 13, color: C.cinza }
      },
      "Agora n\xE3o"
    )
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
