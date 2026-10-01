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
  useEffect(() => {
    setPainel(false);
  }, [hash]);
  const comFab = ["home", "programa", "info", "sessao"].includes(route.tela);
  const reserva = route.tela === "home" || route.tela === "sessao";
  const fab = comFab && !painel && !teclado ? /* @__PURE__ */ React.createElement(BotaoAssistente, { aoTocar: () => setPainel(true) }) : null;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(LembretePDF, null), painel && /* @__PURE__ */ React.createElement(PainelAssistente, { sessaoId: route.tela === "sessao" ? route.id : null, tela: route.tela === "sessao" ? "sessao" : route.tela, aoFechar: () => setPainel(false) }), /* @__PURE__ */ React.createElement(AppShell, { showShell, aba: route.tela, fab, reservaFab: reserva }, route.tela === "sessao" && /* @__PURE__ */ React.createElement(SessaoDetail, { id: route.id }), route.tela === "home" && /* @__PURE__ */ React.createElement(HomeScreen, null), route.tela === "assistente" && /* @__PURE__ */ React.createElement(AssistenteScreen, null), route.tela === "caderno" && /* @__PURE__ */ React.createElement(CadernoScreen, null), route.tela === "info" && /* @__PURE__ */ React.createElement(InfoScreen, null), route.tela === "programa" && /* @__PURE__ */ React.createElement(ProgramaScreen, null)));
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
      style: { display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: C.ouroBg, borderBottom: `1px solid ${C.ouro}55`, flexShrink: 0 }
    },
    /* @__PURE__ */ React.createElement(IcoBook, { size: 16, color: C.ouro }),
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
