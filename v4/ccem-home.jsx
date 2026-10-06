/* ============================================================
   Meu CCEM 2026 — HOME (saguão de entrada) v4
   ============================================================ */

function HomeScreen() {
  const now        = ccemAgora();
  useMinuto();
  const estado     = ccemEstado(now);
  const daysLeft   = Math.max(0, Math.ceil((CCEM_INICIO - now) / 86400000));

  const appState   = useAppState();
  const capCount   = (appState.captures || []).length;
  const markCount  = Object.keys(appState.marks || {}).length;

  const shortcuts = [
    { id:'programa',   icon:<IcoCal size={24}/>,    lbl:'Programa',   sub:'20 sessões · 2 dias' },
    { id:'assistente', icon:<IcoChat size={24}/>,    lbl:'Assistente', sub:'notas · busca científica' },
    { id:'caderno',    icon:<IcoBook size={24}/>,    lbl:'Caderno',    sub:capCount > 0 ? capCount+' nota'+(capCount!==1?'s':'') : 'suas anotações' },
    // Some se LINK_EPOSTER for null.
    ...(LINK_EPOSTER ? [{ id:'trabalhos', largo:true, icon:<IcoPoster size={24}/>, lbl:'Trabalhos científicos', sub:'aprovados · apresentações · anais' }] : []),
  ];

  return (
    <div style={{height:'100%',overflowY:'auto',background:C.papel}}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div style={{background:'#fff',borderBottom:`1px solid ${C.linhaSoft}`,position:'relative',overflow:'hidden'}}>
        {/* borda dourada superior — referência da identidade oficial */}
        <div style={{height:4,background:`linear-gradient(90deg, ${C.ouro} 0%, #f5c842 100%)`}}/>

        {/* Logos */}
        <div style={{display:'flex',alignItems:'center',padding:'16px 20px 14px',borderBottom:`1px solid ${C.linhaSoft}`,gap:0}}>
          <img src="v4/logo-ccem.png" alt="CCEM 2026"
            style={{height:64,flex:1,minWidth:0,objectFit:'contain',objectPosition:'left'}}/>
          <div style={{width:1,height:44,background:C.linhaSoft,flexShrink:0,margin:'0 16px'}}/>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,flexShrink:0}}>
            <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,fontWeight:600,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.08em'}}>Realização</div>
            <img src="v4/logo-sbem.png" alt="SBEM-SC"
              style={{height:52,objectFit:'contain'}}/>
          </div>
        </div>

        {/* Localização */}
        <div style={{padding:'0 20px 16px',borderBottom:`1px solid ${C.linhaSoft}`}}>
          <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:13,fontWeight:600,color:C.azul}}>
            23 e 24 de Outubro de 2026
          </div>
          <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.azulSoft,marginTop:2}}>
            Local: Expoville · Joinville/SC
          </div>
        </div>

        {/* Estado temporal */}
        <div style={{padding:'14px 20px'}}>
          {estado.fase === 'antes' && (
            <div>
              <div style={{display:'inline-flex',alignItems:'center',gap:14,background:C.azul,borderRadius:12,padding:'12px 18px'}}>
                <div style={{textAlign:'center'}}>
                  <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:36,fontWeight:700,lineHeight:1,color:C.ouroClaro}}>{daysLeft}</div>
                  <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,textTransform:'uppercase',letterSpacing:'0.1em',color:'rgba(255,255,255,.75)',marginTop:3}}>{daysLeft===1?'dia':'dias'}</div>
                </div>
                <div style={{width:1,height:38,background:'rgba(255,255,255,.18)'}}/>
                <div style={{fontSize:13,lineHeight:1.5,color:'#fff'}}>
                  para o CCEM 2026<br/>
                  <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:'rgba(255,255,255,.8)'}}>sexta 23/out · 08h00</span>
                </div>
              </div>
              {estado.aSeguir && (
                <div style={{marginTop:10,fontFamily:'DM Sans,system-ui,sans-serif',fontSize:13,color:C.tinta}}>
                  Primeira sessão: <b>{ccemHoraH(estado.aSeguir.inicio)}</b> · {estado.aSeguir.badge}
                </div>
              )}
            </div>
          )}

          {estado.fase === 'durante' && (
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {estado.agora
                ? <CardMomento rotulo="Agora" sessao={estado.agora} vivo
                    detalhe={'até ' + estado.agora.fim + ' · faltam ' + estado.restanteMin + ' min'}/>
                : <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:13,color:C.cinza}}>Intervalo</div>}
              {estado.aSeguir && (
                <CardMomento rotulo="A seguir" sessao={estado.aSeguir}
                  detalhe={(estado.aSeguir.dia !== ccemDiaDoEvento(now) ? 'amanhã · ' : '') + estado.aSeguir.inicio}/>
              )}
            </div>
          )}

          {estado.fase === 'depois' && (
            <button onClick={()=>go('#/caderno')}
              style={{display:'inline-flex',alignItems:'center',gap:8,minHeight:44,background:'#f3f4f6',border:'none',borderRadius:10,padding:'10px 14px',cursor:'pointer'}}>
              <IcoBook size={16} color={C.azul}/>
              <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:13,color:C.tinta}}>Congresso encerrado · <b style={{color:C.azul}}>baixe seu caderno</b></span>
            </button>
          )}

          {/* Indicadores pessoais — só se houver dados */}
          {(markCount > 0 || capCount > 0) && (
            <div style={{display:'flex',gap:8,marginTop:12}}>
              {markCount > 0 && (
                <div style={{display:'flex',alignItems:'center',gap:5,background:'#fef9ec',border:`1px solid ${C.ouroTxt}44`,borderRadius:8,padding:'5px 10px'}}>
                  <IcoStar size={11} color={C.ouroTxt} filled={true}/>
                  <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.ouroTxt}}>{markCount} marcada{markCount!==1?'s':''}</span>
                </div>
              )}
              {capCount > 0 && (
                <div style={{display:'flex',alignItems:'center',gap:5,background:'#eff6ff',border:`1px solid ${C.azul}33`,borderRadius:8,padding:'5px 10px'}}>
                  <IcoCapture size={11} color={C.azul}/>
                  <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.azul}}>{capCount} nota{capCount!==1?'s':''}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ConviteInstalar appState={appState}/>

      <MinhasSessoes appState={appState} agora={now}/>

      {/* ── Acesso rápido ────────────────────────────────────── */}
      <div style={{padding:'20px 16px 10px'}}>
        <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,textTransform:'uppercase',letterSpacing:'0.1em',color:C.cinza,marginBottom:12,fontWeight:600}}>Acesso rápido</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
          {shortcuts.map((s,i)=>(
            <button key={s.id} onClick={()=>go('#/'+s.id)}
              style={{gridColumn:(i===0||s.largo)?'1 / -1':'auto',background:'#fff',border:`1px solid ${C.linhaSoft}`,borderRadius:13,padding:'14px 14px 12px',textAlign:'left',cursor:'pointer',display:'flex',flexDirection:'column',gap:8,boxShadow:'0 1px 6px rgba(29,62,138,.05)',transition:'all .15s'}}
              onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 4px 18px rgba(29,62,138,.11)';e.currentTarget.style.borderColor=C.azul;}}
              onMouseOut={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='0 1px 6px rgba(29,62,138,.05)';e.currentTarget.style.borderColor=C.linhaSoft;}}>
              <span style={{color:C.azul}}>{s.icon}</span>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:C.tinta,marginBottom:2}}>{s.lbl}</div>
                <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza}}>{s.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

/* Convite para instalar na tela inicial. Só no celular, fora do app instalado,
   depois da apresentação do assistente e a partir do 2º uso (ou da primeira
   marcação/nota). Fechado, não volta; a opção segue em Info. */
const CCEM_CONVITE_INSTALAR = 'ccem2026:conviteInstalar';
function ConviteInstalar({ appState }) {
  const { instalado, plataforma, nativo } = useInstalacao();
  const [fechado, setFechado] = useState(() => { try { return !!localStorage.getItem(CCEM_CONVITE_INSTALAR); } catch (e) { return false; } });
  const [folha, setFolha] = useState(false);
  const temDados = Object.keys(appState.marks || {}).length > 0 || (appState.captures || []).length > 0;
  let apresentado = true;
  try { apresentado = !!localStorage.getItem('ccem2026:assistenteApresentado'); } catch (e) {}
  if (instalado || fechado || plataforma === 'outro' || !apresentado || (CCEM_VISITAS < 2 && !temDados)) return null;
  const fechar = () => { try { localStorage.setItem(CCEM_CONVITE_INSTALAR, '1'); } catch (e) {} setFechado(true); };
  async function instalar() {
    if (plataforma === 'android' && nativo && await ccemInstalarNativo()) { fechar(); return; }
    setFolha(true);
  }
  return (
    <div style={{padding:'14px 16px 0'}}>
      <div style={{display:'flex',gap:12,alignItems:'flex-start',background:'#fff',border:`1px solid ${C.linha}`,borderLeft:`3px solid ${C.azul}`,borderRadius:12,padding:'12px 12px 10px'}}>
        <img src="icon-192.png" alt="" width="40" height="40" style={{borderRadius:10,flexShrink:0}}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:14,fontWeight:700,color:C.tinta,marginBottom:2}}>Instale o Meu CCEM na tela inicial</div>
          <div style={{fontSize:12.5,color:C.cinza,lineHeight:1.45}}>
            Abre pelo ícone, em tela cheia, e funciona sem internet.
            {plataforma === 'ios' && temDados && ' No iPhone, o app instalado começa vazio — faça o Backup antes (as instruções explicam).'}
          </div>
          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button onClick={fechar} style={{minHeight:44,padding:'0 12px',background:'#fff',border:`1px solid ${C.linha}`,borderRadius:9,fontFamily:'DM Sans,sans-serif',fontSize:13,fontWeight:600,color:C.cinza,cursor:'pointer'}}>Agora não</button>
            <button onClick={instalar} style={{minHeight:44,padding:'0 16px',background:C.azul,border:'none',borderRadius:9,fontFamily:'DM Sans,sans-serif',fontSize:13,fontWeight:700,color:'#fff',cursor:'pointer'}}>{plataforma==='android'&&nativo?'Instalar':'Como instalar'}</button>
          </div>
        </div>
      </div>
      {folha && <FolhaInstalar temDados={temDados} aoFechar={()=>{ setFolha(false); fechar(); }}/>}
    </div>
  );
}

/* 08:15 -> 08h15 */
function ccemHoraH(hhmm) { return hhmm.replace(':','h'); }

/* Card "Agora" / "A seguir" */
function CardMomento({ rotulo, sessao, detalhe, vivo }) {
  const abre = sessao.navegavel;
  return (
    <div onClick={()=>abre&&go('#/sessao/'+sessao.id)} role={abre?'button':undefined} tabIndex={abre?0:undefined}
      onKeyDown={e=>(e.key==='Enter'||e.key===' ')&&abre&&go('#/sessao/'+sessao.id)}
      style={{display:'flex',alignItems:'center',gap:10,minHeight:44,background:vivo?'rgba(34,197,94,.08)':'#fff',
        border:`1px solid ${vivo?'rgba(34,197,94,.35)':C.linhaSoft}`,borderRadius:12,padding:'10px 14px',cursor:abre?'pointer':'default'}}>
      {vivo && <span style={{width:9,height:9,borderRadius:'50%',background:'#22c55e',boxShadow:'0 0 0 3px rgba(34,197,94,.25)',flexShrink:0}}/>}
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,textTransform:'uppercase',letterSpacing:'0.08em',color:vivo?'#15803d':C.cinza,fontWeight:700,marginBottom:2}}>{rotulo}</div>
        <div style={{fontSize:14,fontWeight:600,color:C.tinta,lineHeight:1.3}}>{ccemRotulo(sessao)}</div>
        <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,marginTop:2}}>{detalhe}</div>
      </div>
      {abre && <IcoChevR size={15} color={C.cinza}/>}
    </div>
  );
}

/* Minhas sessões — as marcadas do dia, em ordem; fora do evento, todas. */
function MinhasSessoes({ appState, agora }) {
  const diaRef  = ccemDiaDoEvento(agora);
  const lista   = ccemMarcadas(appState, diaRef);
  const todas   = ccemMarcadas(appState);
  return (
    <div style={{padding:'20px 16px 0'}}>
      <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',marginBottom:10}}>
        <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,textTransform:'uppercase',letterSpacing:'0.1em',color:C.cinza,fontWeight:600}}>
          Minhas sessões{diaRef ? ' · hoje' : ''}
        </div>
        {lista.length > 0 && <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza}}>{lista.length}</span>}
      </div>

      {lista.length === 0 ? (
        <button onClick={()=>go('#/programa')}
          style={{width:'100%',minHeight:44,textAlign:'left',background:'#fff',border:`1px dashed ${C.linha}`,borderRadius:12,padding:'12px 14px',cursor:'pointer',fontFamily:'DM Sans,system-ui,sans-serif',fontSize:13,color:C.cinza}}>
          {todas.length > 0 ? 'Nenhuma sessão marcada para hoje · ver programa' : 'Marque sessões no Programa para acompanhá-las aqui'}
        </button>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {lista.map(s => {
            const vivo = ccemSessaoNoAr(s, agora);
            return (
              <div key={s.id} onClick={()=>go('#/sessao/'+s.id)} role="button" tabIndex={0}
                onKeyDown={e=>(e.key==='Enter'||e.key===' ')&&go('#/sessao/'+s.id)}
                style={{display:'flex',alignItems:'center',gap:10,minHeight:44,background:vivo?'rgba(34,197,94,.08)':'#fff',
                  border:`1px solid ${vivo?'rgba(34,197,94,.35)':C.linhaSoft}`,borderRadius:10,padding:'9px 12px',cursor:'pointer'}}>
                <div style={{minWidth:44,fontFamily:'DM Sans,system-ui,sans-serif',fontSize:13,fontWeight:700,color:C.azul}}>
                  {s.inicio}
                  {!diaRef && <div style={{fontSize:12,fontWeight:500,color:C.cinza}}>{s.dia.split(' · ')[0]}</div>}
                </div>
                <div style={{flex:1,minWidth:0,fontSize:13,fontWeight:600,color:C.tinta,lineHeight:1.3}}>{ccemRotulo(s)}</div>
                {vivo && <span style={{background:'#15803d',color:'#fff',fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',padding:'2px 8px',borderRadius:10}}>Agora</span>}
              </div>
            );
          })}
        </div>
      )}

      {todas.length > 0 && (
        <button onClick={()=>ccemBaixarIcs(todas, 'ccem-2026-minhas-sessoes.ics')}
          style={{width:'100%',minHeight:44,marginTop:8,display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:'#fff',color:C.azul,border:`1px solid ${C.linha}`,borderRadius:10,cursor:'pointer',fontFamily:'DM Sans,sans-serif',fontSize:13,fontWeight:600}}>
          <IcoCal size={16} color={C.azul}/>Adicionar minhas sessões ao calendário
        </button>
      )}
    </div>
  );
}

Object.assign(window, { HomeScreen });
