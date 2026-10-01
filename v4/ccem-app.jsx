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
    if (parts[0] === 'caderno')                return { tela:'caderno' };
    if (parts[0] === 'info')                   return { tela:'info' };
    if (parts[0] === 'trabalhos')              return { tela:'info' };  // link antigo: o e-pôster agora está em Info
    return { tela:'home' };
  }, [hash]);

  const showShell = route.tela !== 'sessao' && route.tela !== 'home';

  // 5.7 · Botão "8": Home, Programa, Info e Sessão. Some na aba Assistente,
  // com o teclado aberto e com o painel aberto. Só abre com toque.
  const [painel, setPainel] = useState(false);
  const teclado = useTecladoAberto();
  useEffect(()=>{
    const abrir = () => setPainel(true);
    window.addEventListener('ccem:abrir-assistente', abrir);
    return () => window.removeEventListener('ccem:abrir-assistente', abrir);
  },[]);
  // Editor de nota: aberto por "Anotar" (sessão), "Nova nota" e "Editar" (Caderno).
  const [editor, setEditor] = useState(null);
  useEffect(()=>{
    const abrir = e => setEditor(e.detail || {});
    window.addEventListener('ccem:anotar', abrir);
    return () => window.removeEventListener('ccem:anotar', abrir);
  },[]);
  useEffect(()=>{ setPainel(false); setEditor(null); },[hash]);
  const comFab  = ['home','programa','info','sessao'].includes(route.tela);
  const reserva = route.tela === 'home' || route.tela === 'sessao';
  const fab = comFab && !painel && !editor && !teclado ? <BotaoAssistente aoTocar={()=>setPainel(true)}/> : null;

  return (
    <>
    <AvisoAtualizacao/>
    <LembretePDF/>
    {editor && <EditorNota notaId={editor.notaId} sessaoId={editor.sessaoId} aoFechar={()=>setEditor(null)}/>}
    {painel && <PainelAssistente sessaoId={route.tela==='sessao'?route.id:null} tela={route.tela==='sessao'?'sessao':route.tela} aoFechar={()=>setPainel(false)}/>}
    <AppShell showShell={showShell} aba={route.tela} fab={fab} reservaFab={reserva}>
      {route.tela === 'sessao'     && <SessaoDetail id={route.id}/>}
      {route.tela === 'home'       && <HomeScreen/>}
      {route.tela === 'assistente' && <AssistenteScreen/>}
      {route.tela === 'caderno'    && <CadernoScreen/>}
      {route.tela === 'info'       && <InfoScreen/>}
      {route.tela === 'programa'   && <ProgramaScreen/>}
    </AppShell>
    </>
  );
}

/* ── Versão nova e modo sem internet ──────────────────────────
   A troca de versão só acontece com um toque, nunca no meio do uso. */
function AvisoAtualizacao() {
  const [pronta, setPronta]   = useState(() => !!window.__ccemNovaVersao);
  const [offline, setOffline] = useState(() => navigator.onLine === false);
  useEffect(() => {
    const nova = () => setPronta(true), on = () => setOffline(false), off = () => setOffline(true);
    window.addEventListener('ccem:nova-versao', nova);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('ccem:nova-versao', nova);
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  if (pronta) return (
    <div role="status" style={{display:'flex',alignItems:'center',gap:8,padding:'4px 6px 4px 12px',background:C.azulBg,borderBottom:`1px solid ${C.linha}`,flexShrink:0}}>
      <span style={{flex:1,fontFamily:'DM Sans,sans-serif',fontSize:13,color:C.tinta}}>Nova versão do app disponível</span>
      <button onClick={() => window.ccemAplicarAtualizacao && window.ccemAplicarAtualizacao()}
        style={{minHeight:44,padding:'0 14px',background:C.azul,color:'#fff',border:'none',borderRadius:8,fontFamily:'DM Sans,sans-serif',fontSize:13,fontWeight:700,cursor:'pointer'}}>Atualizar</button>
    </div>
  );
  if (offline) return (
    <div role="status" style={{padding:'6px 12px',background:'#f5f7fb',borderBottom:`1px solid ${C.linha}`,fontFamily:'DM Sans,sans-serif',fontSize:12.5,color:C.cinza,flexShrink:0}}>
      Sem internet · usando a versão salva no aparelho. Programa, marcações e Caderno funcionam normalmente.
    </div>
  );
  return null;
}

/* ── 3.3 · Lembrete de exportação ─────────────────────────────
   De 24/10 às 16h até o fim de 31/10, se houver notas, uma faixa
   no topo lembra de baixar o PDF. "Agora não" a esconde até o dia
   seguinte; baixar também.
   ────────────────────────────────────────────────────────────── */
const LEMBRETE_INICIO = new Date('2026-10-24T16:00:00-03:00');
const LEMBRETE_FIM    = new Date('2026-11-01T00:00:00-03:00');
const LEMBRETE_CHAVE  = 'ccem2026:lembretePDF';

function LembretePDF() {
  const appState = useAppState();
  useMinuto();
  const agora = ccemAgora();
  const hoje  = ccemDataHoraJoinville(agora.getTime()).data;
  const [fechadoEm, setFechadoEm] = useState(() => {
    try { return localStorage.getItem(LEMBRETE_CHAVE); } catch (e) { return null; }
  });
  const notas = appState.captures || [];
  if (agora < LEMBRETE_INICIO || agora >= LEMBRETE_FIM) return null;
  if (!notas.length || fechadoEm === hoje) return null;

  function fechar() {
    try { localStorage.setItem(LEMBRETE_CHAVE, hoje); } catch (e) {}
    setFechadoEm(hoje);
  }
  return (
    <div role="region" aria-label="Lembrete do caderno"
      style={{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',background:C.ouroBg,borderBottom:`1px solid ${C.ouroTxt}55`,flexShrink:0}}>
      <IcoBook size={16} color={C.ouroTxt}/>
      <button onClick={()=>{ ccemExportarCaderno(notas); fechar(); }}
        style={{flex:1,minHeight:44,textAlign:'left',background:'none',border:'none',padding:0,cursor:'pointer',fontFamily:'DM Sans,sans-serif',fontSize:13,fontWeight:700,color:C.tinta}}>
        Baixe seu caderno em PDF
      </button>
      <button onClick={fechar}
        style={{minHeight:44,padding:'0 10px',background:'none',border:'none',cursor:'pointer',fontFamily:'DM Sans,sans-serif',fontSize:13,color:C.cinza}}>
        Agora não
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
