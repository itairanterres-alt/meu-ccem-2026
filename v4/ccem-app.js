function App() {
  const hash = useHashRoute();
  const route = useMemo(() => {
    const parts = (hash || "#/").replace(/^#\/?/, "").split("/").filter(Boolean);
    const IDS_ANTIGOS = { "simp4-hipofise": "simp4-adrenal", "simp8-adrenal": "simp8-hipofise" };
    if (parts[0] === "sessao" && parts[1]) return { tela: "sessao", id: IDS_ANTIGOS[parts[1]] || parts[1] };
    if (parts[0] === "programa") return { tela: "programa" };
    if (parts[0] === "assistente") return { tela: "assistente" };
    if (parts[0] === "trabalhos") return { tela: "trabalhos" };
    if (parts[0] === "caderno") return { tela: "caderno" };
    if (parts[0] === "info") return { tela: "info" };
    return { tela: "home" };
  }, [hash]);
  const showShell = route.tela !== "sessao" && route.tela !== "home";
  return /* @__PURE__ */ React.createElement(AppShell, { showShell, aba: route.tela }, route.tela === "sessao" && /* @__PURE__ */ React.createElement(SessaoDetail, { id: route.id }), route.tela === "home" && /* @__PURE__ */ React.createElement(HomeScreen, null), route.tela === "assistente" && /* @__PURE__ */ React.createElement(AssistenteScreen, null), route.tela === "trabalhos" && /* @__PURE__ */ React.createElement(TrabalhosScreen, null), route.tela === "caderno" && /* @__PURE__ */ React.createElement(CadernoScreen, null), route.tela === "info" && /* @__PURE__ */ React.createElement(InfoScreen, null), route.tela === "programa" && /* @__PURE__ */ React.createElement(ProgramaScreen, null));
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
