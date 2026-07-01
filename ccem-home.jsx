/* ============================================================
   Meu CCEM 2026 — HOME (saguão de entrada) v4
   ============================================================ */

function HomeScreen() {
  const now        = new Date();
  const evStart    = new Date(2026,9,23,8,0);
  const evEnd      = new Date(2026,9,24,17,35);
  const isBefore   = now < evStart;
  const isDuring   = now >= evStart && now <= evEnd;
  const daysLeft   = Math.max(0, Math.ceil((evStart - now) / 86400000));

  const appState   = useAppState();
  const capCount   = (appState.captures || []).length;
  const markCount  = Object.keys(appState.marks || {}).length;
  const live       = typeof ccemLiveStatus === 'function' ? ccemLiveStatus() : null;

  const shortcuts = [
    { id:'programa',   icon:<IcoCal size={24}/>,    lbl:'Programa',   sub:'20 sessões · 2 dias' },
    { id:'trabalhos',  icon:<IcoPoster size={24}/>,  lbl:'Trabalhos',  sub:'9 pôsteres digitais' },
    { id:'assistente', icon:<IcoChat size={24}/>,    lbl:'Assistente', sub:'notas · busca científica' },
    { id:'caderno',    icon:<IcoBook size={24}/>,    lbl:'Caderno',    sub:capCount > 0 ? capCount+' nota'+(capCount!==1?'s':'') : 'suas anotações' },
  ];

  const highlights = ['simp5-modismos','mini-ia']
    .map(id => SESSOES[id]).filter(Boolean);

  return (
    <div style={{height:'100%',overflowY:'auto',background:C.papel}}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div style={{background:C.azul,color:'#fff',padding:'32px 22px 26px',position:'relative',overflow:'hidden'}}>
        {/* decorative circles */}
        <div style={{position:'absolute',top:-70,right:-70,width:240,height:240,borderRadius:'50%',background:'rgba(255,255,255,.04)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:-40,left:-40,width:160,height:160,borderRadius:'50%',background:'rgba(255,255,255,.03)',pointerEvents:'none'}}/>

        <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,textTransform:'uppercase',letterSpacing:'0.12em',opacity:.75,marginBottom:12}}>
          SBEM-SC · 12º Congresso Catarinense de Endocrinologia e Metabologia
        </div>

        <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:4}}>
          <span style={{fontFamily:'Georgia,serif',fontWeight:700,fontSize:40,letterSpacing:'-0.03em',lineHeight:1}}>CCEM</span>
          <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:19,color:C.ouro,letterSpacing:'0.04em'}}>2026</span>
        </div>

        <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,opacity:.65,marginBottom:22,lineHeight:1.8}}>
          23–24 outubro · Expoville · Joinville/SC
        </div>

        {/* Estado temporal */}
        {isBefore && (
          <div style={{display:'inline-flex',alignItems:'center',gap:14,background:'rgba(255,255,255,.1)',borderRadius:12,padding:'12px 18px'}}>
            <div style={{textAlign:'center'}}>
              <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:36,fontWeight:700,lineHeight:1,color:C.ouro}}>{daysLeft}</div>
              <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,textTransform:'uppercase',letterSpacing:'0.1em',opacity:.65,marginTop:3}}>dias</div>
            </div>
            <div style={{width:1,height:38,background:'rgba(255,255,255,.18)'}}/>
            <div style={{fontSize:13,lineHeight:1.5,opacity:.9}}>
              para o CCEM 2026<br/>
              <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,opacity:.65}}>sexta 23/out · 08h00</span>
            </div>
          </div>
        )}

        {isDuring && live && (
          <div style={{display:'inline-flex',alignItems:'center',gap:10,background:'rgba(34,197,94,.14)',border:'1px solid rgba(34,197,94,.28)',borderRadius:12,padding:'12px 16px'}}>
            <span style={{width:9,height:9,borderRadius:'50%',background:'#22c55e',boxShadow:'0 0 0 3px rgba(34,197,94,.28)',flexShrink:0}}/>
            <div>
              <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,textTransform:'uppercase',letterSpacing:'0.1em',color:'#86efac',marginBottom:3}}>Acontecendo agora</div>
              <div style={{fontSize:13,fontWeight:600,lineHeight:1.3}}>{live.text}</div>
            </div>
          </div>
        )}

        {!isBefore && !isDuring && (
          <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(255,255,255,.08)',borderRadius:10,padding:'10px 14px'}}>
            <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,opacity:.7,lineHeight:1.5}}>CCEM 2026 encerrado<br/>acervo disponível no Caderno</span>
          </div>
        )}

        {/* Indicadores pessoais — só se houver dados */}
        {(markCount > 0 || capCount > 0) && (
          <div style={{display:'flex',gap:8,marginTop:16}}>
            {markCount > 0 && (
              <div style={{display:'flex',alignItems:'center',gap:5,background:'rgba(255,255,255,.08)',borderRadius:8,padding:'5px 10px'}}>
                <IcoStar size={11} color={C.ouro} filled={true}/>
                <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:C.ouro}}>{markCount} marcada{markCount!==1?'s':''}</span>
              </div>
            )}
            {capCount > 0 && (
              <div style={{display:'flex',alignItems:'center',gap:5,background:'rgba(255,255,255,.08)',borderRadius:8,padding:'5px 10px'}}>
                <IcoCapture size={11} color="rgba(255,255,255,.7)"/>
                <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'rgba(255,255,255,.7)'}}>{capCount} nota{capCount!==1?'s':''}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Acesso rápido ────────────────────────────────────── */}
      <div style={{padding:'20px 16px 10px'}}>
        <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,textTransform:'uppercase',letterSpacing:'0.1em',color:C.cinza,marginBottom:12,fontWeight:600}}>Acesso rápido</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
          {shortcuts.map(s=>(
            <button key={s.id} onClick={()=>go('#/'+s.id)}
              style={{background:'#fff',border:`1px solid ${C.linhaSoft}`,borderRadius:13,padding:'14px 14px 12px',textAlign:'left',cursor:'pointer',display:'flex',flexDirection:'column',gap:8,boxShadow:'0 1px 6px rgba(29,62,138,.05)',transition:'all .15s',outline:'none'}}
              onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 4px 18px rgba(29,62,138,.11)';e.currentTarget.style.borderColor=C.azul;}}
              onMouseOut={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='0 1px 6px rgba(29,62,138,.05)';e.currentTarget.style.borderColor=C.linhaSoft;}}>
              <span style={{color:C.azul}}>{s.icon}</span>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:C.tinta,marginBottom:2}}>{s.lbl}</div>
                <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:C.cinza}}>{s.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Destaques editoriais ──────────────────────────────── */}
      {highlights.length > 0 && (
        <div style={{padding:'10px 16px 28px'}}>
          <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,textTransform:'uppercase',letterSpacing:'0.1em',color:C.cinza,marginBottom:12,fontWeight:600}}>Destaques editoriais</div>
          {highlights.map((s,i)=>(
            <div key={s.id} onClick={()=>go('#/sessao/'+s.id)}
              role="button" tabIndex={0} aria-label={s.titulo}
              onKeyDown={e=>(e.key==='Enter'||e.key===' ')&&go('#/sessao/'+s.id)}
              style={{background:'#fff',border:`1px solid ${C.linhaSoft}`,borderLeft:`3px solid ${C.ouro}`,borderRadius:11,padding:'12px 14px',marginBottom:8,cursor:'pointer',display:'flex',gap:12,alignItems:'center',boxShadow:'0 1px 5px rgba(29,62,138,.04)',transition:'transform .13s'}}
              onMouseOver={e=>e.currentTarget.style.transform='translateX(2px)'}
              onMouseOut={e=>e.currentTarget.style.transform=''}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:C.ouro,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:4}}>★ Destaque</div>
                <div style={{fontSize:12.5,fontWeight:600,color:C.tinta,lineHeight:1.3,marginBottom:3}}>{s.titulo}</div>
                <div style={{display:'flex',gap:6,alignItems:'center'}}>
                  <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:C.azulSoft,fontWeight:600}}>{s.inicio}–{s.fim}</span>
                  <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:C.cinza}}>{s.dia}</span>
                </div>
              </div>
              <IcoChevR size={15} color={C.cinza}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { HomeScreen });
