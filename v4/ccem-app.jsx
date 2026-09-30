/* ============================================================
   Meu CCEM 2026 — Router v4
   Extraído do index.html para permitir pré-compilação do JSX.
   ============================================================ */
function App() {
  const hash = useHashRoute();

  const route = useMemo(() => {
    const parts = (hash || '#/').replace(/^#\/?/, '').split('/').filter(Boolean);
    // Os simpósios 4 e 8 estavam com Adrenal e Hipófise trocados. Os ids foram
    // corrigidos; estes apelidos mantêm válido qualquer link já compartilhado.
    const IDS_ANTIGOS = { 'simp4-hipofise':'simp4-adrenal', 'simp8-adrenal':'simp8-hipofise' };
    if (parts[0] === 'sessao'     && parts[1]) return { tela:'sessao', id: IDS_ANTIGOS[parts[1]] || parts[1] };
    if (parts[0] === 'programa')               return { tela:'programa' };
    if (parts[0] === 'assistente')             return { tela:'assistente' };
    if (parts[0] === 'trabalhos')              return { tela:'trabalhos' };
    if (parts[0] === 'caderno')                return { tela:'caderno' };
    if (parts[0] === 'info')                   return { tela:'info' };
    return { tela:'home' };
  }, [hash]);

  const showShell = route.tela !== 'sessao' && route.tela !== 'home';

  return (
    <AppShell showShell={showShell} aba={route.tela}>
      {route.tela === 'sessao'     && <SessaoDetail id={route.id}/>}
      {route.tela === 'home'       && <HomeScreen/>}
      {route.tela === 'assistente' && <AssistenteScreen/>}
      {route.tela === 'trabalhos'  && <TrabalhosScreen/>}
      {route.tela === 'caderno'    && <CadernoScreen/>}
      {route.tela === 'info'       && <InfoScreen/>}
      {route.tela === 'programa'   && <ProgramaScreen/>}
    </AppShell>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
