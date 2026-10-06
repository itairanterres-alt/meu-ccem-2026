/* ============================================================
   Meu CCEM 2026 — TELAS v4
   ============================================================ */

/* ── helpers ────────────────────────────────────────────────── */
function badgeColor(tipo) {
  if (tipo==='simposio') return C.azul;
  if (tipo==='mini')     return '#0d9488';
  if (tipo==='satelite') return C.ouroTxt;
  return '#64748b';
}
function norm(s){ return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); }

function sessionIsPast(s) {
  if (!s || !s.dia || !s.fim) return false;
  return ccemAgora() > ccemInstante(s.dia, s.fim);
}

const BACK_BTN = {width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',border:'none',background:'transparent',cursor:'pointer',borderRadius:9,flexShrink:0,padding:0};
const PILL = {display:'inline-flex',alignItems:'center',fontFamily:'DM Sans,system-ui,sans-serif',fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase',borderRadius:20,whiteSpace:'nowrap',lineHeight:1.6};

/* ── BadgePill / TopicPill / IntervalRow ───────────────────── */
function BadgePill({ tipo, label, sm }) {
  const bg = badgeColor(tipo);
  return <span style={{...PILL,background:bg+'1a',color:bg,border:`1px solid ${bg}28`,fontSize:12,padding:sm?'1px 7px':'2px 9px'}}>{label}</span>;
}
function TopicPill({ tema }) {
  const color = TEMAS_COR[tema] || C.cinza;
  return <span style={{...PILL,background:color+'18',color,border:`1px solid ${color}28`,fontSize:12,padding:'3px 9px'}}>{tema}</span>;
}
function IntervalRow({ item }) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:10,padding:'6px 16px',background:'#f5f8fd',borderTop:`1px solid ${C.linhaSoft}`,borderBottom:`1px solid ${C.linhaSoft}`,margin:'2px 0'}}>
      <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,textTransform:'uppercase',letterSpacing:'0.08em',color:C.cinza,fontWeight:600}}>{item.label}</span>
      {item.dur&&<span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,marginLeft:'auto'}}>{item.dur}</span>}
    </div>
  );
}

/* ── SessaoCard ─────────────────────────────────────────────── */
function SessaoCard({ id }) {
  const s = SESSOES[id];
  const appState = useAppState();
  useMinuto();                       // antes de qualquer return: ordem dos hooks
  if (!s) return null;
  const isMarked = !!(appState.marks&&appState.marks[id]);
  const noAr = ccemSessaoNoAr(s);
  const bc = badgeColor(s.tipo);
  return (
    <div data-sessao={id} onClick={()=>s.navegavel&&go('#/sessao/'+id)}
      role={s.navegavel?'button':undefined}
      tabIndex={s.navegavel?0:undefined}
      aria-label={s.navegavel?s.titulo:undefined}
      onKeyDown={e=>(e.key==='Enter'||e.key===' ')&&s.navegavel&&go('#/sessao/'+id)}
      style={{background:s.tipo==='satelite'?'#f8fafd':(noAr?'#eef6ff':'#fff'),
        borderLeft:s.tipo==='satelite'?`2px solid ${C.linha}`:`3px solid ${noAr?C.azulSoft:bc}`,
        margin:s.tipo==='satelite'?'3px 16px':'5px 12px',borderRadius:8,
        padding:s.tipo==='satelite'?'7px 10px':'10px 12px',
        border:`1px solid ${noAr?'#c2daf8':C.linhaSoft}`,
        opacity:s.tipo==='satelite'?0.75:1,
        cursor:s.navegavel?'pointer':'default',position:'relative'}}>
      {noAr&&<span style={{position:'absolute',top:8,right:8,background:'#15803d',color:'#fff',fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,letterSpacing:'0.1em',textTransform:'uppercase',padding:'2px 7px',borderRadius:10,fontWeight:700}}>Agora</span>}
      <div style={{display:'flex',gap:10,alignItems:'flex-start'}}>
        <div style={{minWidth:40,flexShrink:0,textAlign:'center',paddingTop:1}}>
          <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:13.5,fontWeight:700,color:C.azul,lineHeight:1}}>{s.inicio}</div>
          <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,marginTop:3,lineHeight:1.3}}>→{s.fim}</div>
          <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,marginTop:1}}>{s.dur}</div>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:5}}>
            <BadgePill tipo={s.tipo} label={s.badge} sm />
          </div>
          <div style={{fontSize:13,fontWeight:600,color:C.tinta,lineHeight:1.3,marginBottom:3,paddingRight:noAr?36:0}}>{s.titulo}</div>
          {s.moderador&&<div style={{fontSize:12,color:C.cinza,marginBottom:3}}>mod. {s.moderador}</div>}
          {s.aDefinir&&<div style={{fontSize:12,color:C.cinza,fontStyle:'italic'}}>programação a definir</div>}
          {(s.falas||[]).slice(0,3).map((f,i)=>(
            <div key={i} style={{display:'flex',gap:5,alignItems:'baseline',fontSize:12,color:C.cinza,marginTop:2}}>
              <span style={{color:bc,fontWeight:700,flexShrink:0,minWidth:10}}>{f.n}.</span>
              <span style={{flex:1,minWidth:0,lineHeight:1.3}}>
                {f.titulo&&<><span style={{color:C.tinta,fontWeight:500}}>{f.titulo}</span> · </>}
                <span>
                  {f.palestrante}{f.aConfirmar&&<em style={{color:C.cinza}}> (a confirmar)</em>}
                </span>
              </span>
            </div>
          ))}
          {(s.falas||[]).length>3&&<div style={{fontSize:12,color:C.cinza,marginTop:2,fontStyle:'italic'}}>+{s.falas.length-3} fala(s)…</div>}
          {s.navegavel&&(
            <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end',marginTop:6,gap:5}}>
              {isMarked&&<span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.azulSoft}}>marcada</span>}
              <IcoChevR size={14} color={C.cinza}/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── DayTimeline ────────────────────────────────────────────── */
function DayTimeline({ dia }) {
  const DAY_START = 8*60;
  const DAY_END = dia===DIAS[0] ? 18*60+10 : 17*60+35;
  const total = DAY_END - DAY_START;
  function pct(hm){ const[h,m]=hm.split(':').map(Number); return Math.max(0,Math.min(100,((h*60+m-DAY_START)/total)*100)); }
  const sessoes = (PROGRAMA[dia]||[]).filter(i=>i.tipo==='sessao').map(i=>SESSOES[i.id]).filter(Boolean);
  useMinuto();
  const agora = ccemAgora();
  const isToday = ccemDiaDoEvento(agora) === dia;
  // minutos desde a meia-noite em Joinville, não no fuso do aparelho
  const minJoinville = Math.floor((agora - ccemInstante(dia,'00:00')) / 60000);
  const nowPct = isToday ? pct(Math.floor(minJoinville/60)+':'+(minJoinville%60)) : -1;
  const bc = t => t==='simposio'?C.azul:t==='mini'?'#0d9488':t==='satelite'?'#94a3b8':'#334155';
  return (
    <div style={{margin:'0 12px 8px',background:'#fff',borderRadius:10,padding:'9px 12px 7px',border:`1px solid ${C.linhaSoft}`}}>
      <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,textTransform:'uppercase',letterSpacing:'0.1em',color:C.cinza,marginBottom:5}}>
        {dia===DIAS[0]?'A jornada · sexta 23/out':'A jornada · sábado 24/out'}
      </div>
      <div aria-hidden="true" style={{position:'relative',height:20,background:C.cinzaClr,borderRadius:4,overflow:'visible'}}>
        {sessoes.map(s=>{
          const l=pct(s.inicio),w=Math.max(pct(s.fim)-l,.8);
          // só visão geral do dia: barras estreitas demais para toque — abre-se a sessão pela lista
          return <div key={s.id} title={s.titulo}
            style={{position:'absolute',top:2,bottom:2,left:l+'%',width:w+'%',background:bc(s.tipo),borderRadius:2,opacity:.85}}/>;
        })}
        {nowPct>=0&&<div style={{position:'absolute',top:-3,bottom:-3,left:nowPct+'%',width:2,background:C.azulSoft,borderRadius:1,zIndex:5,boxShadow:`0 0 0 2px rgba(45,84,192,.2)`}}/>}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:4,fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza}}>
        {[8,10,12,14,16,18].filter(h=>h*60<=DAY_END+30).map(h=><span key={h}>{h}h</span>)}
      </div>
    </div>
  );
}

/* ── SlideDisplay / SlideUploadBtn ──────────────────────────── */
function SlideDisplay({ sessaoId, falaIdx }) {
  const slKey = 'ccem_slides_' + sessaoId + '_' + falaIdx;
  const [slides] = useState(() => {
    try { const r = localStorage.getItem(slKey); return r ? JSON.parse(r) : null; } catch(e) { return null; }
  });
  if (!slides) return null;
  return (
    <div style={{marginTop:5,display:'inline-flex',alignItems:'center',gap:6,background:C.verde+'12',borderRadius:6,padding:'4px 9px'}}>
      <span style={{fontSize:12}}>📎</span>
      <a href={slides.dataUrl} download={slides.name}
        style={{fontSize:12,fontWeight:600,color:C.verde,textDecoration:'none'}}>{slides.name}</a>
    </div>
  );
}
function SlideUploadBtn({ sessaoId, falaIdx }) {
  const slKey = 'ccem_slides_' + sessaoId + '_' + falaIdx;
  const [slides, setSlides] = useState(() => {
    try { const r = localStorage.getItem(slKey); return r ? JSON.parse(r) : null; } catch(e) { return null; }
  });
  const slInputRef = useRef(null);
  function handleSlideFile(file) {
    if (!file) return;
    if (file.size > 4*1024*1024) { showToast('Arquivo muito grande · máx. 4 MB'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      const data = { name:file.name, type:file.type, size:file.size, dataUrl:ev.target.result, ts:Date.now() };
      try { localStorage.setItem(slKey, JSON.stringify(data)); } catch(e) { showToast('Armazenamento cheio'); return; }
      setSlides(data);
      showToast('Slides enviados ✓');
    };
    reader.readAsDataURL(file);
  }
  function removeSlides() { localStorage.removeItem(slKey); setSlides(null); showToast('Slides removidos'); }
  if (slides) {
    return (
      <div style={{marginTop:6,background:C.verde+'12',borderRadius:7,padding:'6px 9px',display:'flex',alignItems:'center',gap:7}}>
        <span style={{fontSize:13}}>📎</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12,fontWeight:600,color:C.verde,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{slides.name}</div>
          <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,marginTop:1}}>{(slides.size/1024).toFixed(0)} KB</div>
        </div>
        <a href={slides.dataUrl} download={slides.name}
          style={{fontSize:12,fontWeight:600,color:C.azul,textDecoration:'none',background:C.azulBg,padding:'4px 9px',borderRadius:6,flexShrink:0}}>↓</a>
        <button onClick={removeSlides} style={{background:'none',border:'none',color:C.cinza,cursor:'pointer',fontSize:14,padding:'0 2px',flexShrink:0}}>×</button>
      </div>
    );
  }
  return (
    <>
      <input type="file" ref={slInputRef} accept=".pdf,.ppt,.pptx,.key,.png,.jpg,.jpeg"
        style={{display:'none'}} onChange={e=>{handleSlideFile(e.target.files&&e.target.files[0]);e.target.value='';}}/>
      <button onClick={()=>slInputRef.current&&slInputRef.current.click()}
        style={{marginTop:6,display:'inline-flex',alignItems:'center',gap:5,fontSize:12,color:C.cinza,background:'none',border:`1px dashed ${C.linha}`,borderRadius:7,padding:'4px 10px',cursor:'pointer',fontFamily:'DM Sans,sans-serif'}}>
        📎 Enviar slides
      </button>
    </>
  );
}

/* ── SessaoDetail ────────────────────────────────────────────── */
function SessaoDetail({ id }) {
  const s = SESSOES[id];
  const appState = useAppState();
  const isMarked = !!(appState.marks&&appState.marks[id]);
  const idx = SESSOES_NAV.indexOf(id);
  const prevId = idx>0 ? SESSOES_NAV[idx-1] : null;
  const nextId = idx>=0&&idx<SESSOES_NAV.length-1 ? SESSOES_NAV[idx+1] : null;
  const bc = s ? badgeColor(s.tipo) : C.azul;
  const isPast = sessionIsPast(s);
  const [ctxOpen, setCtxOpen] = useState(!isPast);

  useEffect(()=>{
    const fn=e=>{
      if(/^(INPUT|TEXTAREA)$/.test((e.target||{}).tagName||'')) return;
      if(e.key==='ArrowLeft'&&prevId) go('#/sessao/'+prevId);
      if(e.key==='ArrowRight'&&nextId) go('#/sessao/'+nextId);
    };
    window.addEventListener('keydown',fn);
    return ()=>window.removeEventListener('keydown',fn);
  },[prevId,nextId]);

  if(!s) return (
    <div style={{height:'100%',display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <div style={{background:C.azul,height:52,display:'flex',alignItems:'center',padding:'0 8px',flexShrink:0,gap:8}}>
        <button onClick={()=>window.history.back()} style={BACK_BTN}><IcoArrowL size={20} color="#fff"/></button>
        <span style={{color:'#fff',fontSize:14,fontWeight:600}}>Sessão não encontrada</span>
      </div>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:12,color:C.cinza,fontSize:13}}>
        Sessão não encontrada.
        <button onClick={()=>go('#/')} style={{color:C.azul,background:'none',border:`1px solid ${C.azul}`,padding:'7px 16px',borderRadius:8,cursor:'pointer',fontFamily:'inherit'}}>Voltar ao programa</button>
      </div>
    </div>
  );

  function toggleMark(){
    updateAppState(st=>{
      if(!st.marks) st.marks={};
      if(st.marks[id]) delete st.marks[id]; else st.marks[id]=true;
    });
    if (isMarked) showToast('Desmarcada');
    else showToast('Marcada · adicione ao calendário para ser lembrado',
                   { rotulo:'Adicionar', aoTocar:()=>ccemBaixarIcs([s], 'ccem-'+id+'.ics') });
  }

  function handleAnotar(){
    // nota direta, no aparelho, sem depender de internet nem da IA
    ccemAbrirEditor({ sessaoId:id });
  }

  async function handleShare(){
    const texto = `${s.badge} — ${s.titulo}\n${s.dia} · ${s.inicio}–${s.fim} · Expoville, Joinville/SC\n\n#CCEM2026 #SBEMSC`;
    if (navigator.share) {
      try { await navigator.share({ title:s.titulo, text:texto, url:ccemBaseUrl()+'#/sessao/'+id }); }
      catch(e) {}
    } else {
      try { await navigator.clipboard.writeText(texto); showToast('Copiado ✓'); }
      catch(e) { showToast('Compartilhar: '+s.badge); }
    }
  }

  function handleAskAI(){
    ccemAbrirAssistente();
  }

  const navBtn=(on)=>({width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',
    border:`1px solid rgba(255,255,255,${on?0.3:0.12})`,background:on?'rgba(255,255,255,.14)':'transparent',
    borderRadius:9,cursor:on?'pointer':'default',opacity:on?1:0.28,padding:0});

  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column',overflow:'hidden',background:C.papel}}>
      {/* Top bar */}
      <div style={{background:C.azul,color:'#fff',flexShrink:0,boxShadow:'0 2px 12px rgba(10,18,50,.3)'}}>
        <div style={{height:52,display:'flex',alignItems:'center',gap:8,padding:'0 8px'}}>
          <button onClick={()=>window.history.back()} aria-label="Voltar" style={BACK_BTN}><IcoArrowL size={20} color="#fff"/></button>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:700,lineHeight:1.2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{s.titulo}</div>
            <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,opacity:.75,marginTop:1}}>{s.inicio}–{s.fim} · {s.dur}</div>
          </div>
          <div style={{display:'flex',gap:2,flexShrink:0}}>
            <button onClick={handleShare} title="Compartilhar" aria-label="Compartilhar esta sessão" style={navBtn(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
            <button onClick={()=>prevId&&go('#/sessao/'+prevId)} aria-label="Sessão anterior" disabled={!prevId} style={navBtn(!!prevId)}><IcoChevL size={18} color="#fff"/></button>
            <button onClick={()=>nextId&&go('#/sessao/'+nextId)} aria-label="Próxima sessão" disabled={!nextId} style={navBtn(!!nextId)}><IcoChevR size={18} color="#fff"/></button>
          </div>
        </div>
        {idx>=0&&<div style={{height:2,background:'rgba(255,255,255,.1)'}}><div style={{height:'100%',background:C.ouro,width:`${((idx+1)/SESSOES_NAV.length)*100}%`,transition:'width .3s'}}/></div>}
      </div>

      {/* Content — ordem: contexto → falas → ações → assistente → nav */}
      <div style={{flex:1,overflowY:'auto',padding:'14px 14px 28px'}}>

        {/* Contexto — collapsível quando sessão já passou */}
        <div style={{background:'#fff',borderRadius:14,padding:'14px',border:`1px solid ${C.linhaSoft}`,marginBottom:10,boxShadow:'0 2px 10px rgba(29,62,138,.05)'}}>
          <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center',cursor:isPast?'pointer':'default'}}
            onClick={isPast?()=>setCtxOpen(v=>!v):undefined}
            role={isPast?'button':undefined}
            tabIndex={isPast?0:undefined}
            aria-expanded={isPast?ctxOpen:undefined}
            onKeyDown={isPast?e=>(e.key==='Enter'||e.key===' ')&&setCtxOpen(v=>!v):undefined}>
            <BadgePill tipo={s.tipo} label={s.badge}/>
            {(s.temas||[]).map(t=><TopicPill key={t} tema={t}/>)}
            {isPast&&<span style={{marginLeft:'auto',fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza}}>
              {ctxOpen?'▾ recolher':'▸ contexto'}
            </span>}
          </div>
          {ctxOpen&&(
            <div style={{marginTop:9}}>
              <h2 style={{fontFamily:'Georgia,serif',fontSize:15.5,fontWeight:700,color:C.tinta,lineHeight:1.35,letterSpacing:'-0.01em',margin:'0 0 8px'}}>{s.titulo}</h2>
              <div style={{display:'flex',gap:8,alignItems:'center',fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza}}>
                <span style={{color:C.azulSoft,fontWeight:700}}>{s.inicio}</span>
                <span>→ {s.fim}</span>
                <span>· {s.dur} · {s.dia}</span>
              </div>
              {s.moderador&&(
                <div style={{marginTop:9,padding:'6px 10px',background:C.azulBg+'60',borderRadius:7,display:'flex',gap:8,alignItems:'center'}}>
                  <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.07em',flexShrink:0}}>Moderador</span>
                  <span style={{fontSize:12,color:C.tinta,fontWeight:500}}>{s.moderador}</span>
                </div>
              )}
            </div>
          )}
          {!ctxOpen&&isPast&&(
            <div style={{display:'flex',gap:8,alignItems:'center',fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,marginTop:6}}>
              <span style={{color:C.azulSoft,fontWeight:700}}>{s.inicio}–{s.fim}</span>
              {s.moderador&&<span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>mod. {s.moderador}</span>}
            </div>
          )}
        </div>

        {/* Falas */}
        {s.falas&&s.falas.length>0&&(
          <div style={{background:'#fff',borderRadius:14,padding:'12px 14px',border:`1px solid ${C.linhaSoft}`,marginBottom:10,boxShadow:'0 2px 10px rgba(29,62,138,.05)'}}>
            <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,textTransform:'uppercase',letterSpacing:'0.08em',color:C.cinza,marginBottom:10,fontWeight:600}}>Programa da sessão</div>
            {s.falas.map((f,i)=>{
              const bio = SPEAKER_BIOS[f.palestrante];
              return (
                <div key={i} style={{display:'flex',gap:10,padding:'8px 0',borderBottom:i<s.falas.length-1?`1px solid ${C.linhaSoft}`:'none'}}>
                  <div style={{width:22,height:22,borderRadius:7,background:bc+'1a',color:bc,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,fontWeight:700,flexShrink:0,marginTop:1}}>{f.n==='·'?'·':f.n}</div>
                  <div style={{flex:1,minWidth:0}}>
                    {f.titulo&&<div style={{fontSize:12.5,fontWeight:600,color:C.tinta,lineHeight:1.3,marginBottom:2}}>{f.titulo}</div>}
                    <div style={{fontSize:12,color:C.tinta,fontWeight:500}}>
                      {f.palestrante}{f.aConfirmar&&<em style={{color:C.cinza,fontWeight:400}}> (a confirmar)</em>}
                    </div>
                    {bio&&<div style={{fontSize:12,color:C.cinza,marginTop:1}}>{bio.role}</div>}
                    <SlideDisplay sessaoId={id} falaIdx={i}/>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Ações: Anotar (primária) · Marcar (secundária) · Assistente (terciária) */}
        <div style={{display:'flex',gap:8,marginBottom:8}}>
          <button onClick={handleAnotar} style={{flex:3,display:'flex',alignItems:'center',justifyContent:'center',gap:7,background:C.azul,color:'#fff',border:'none',borderRadius:10,padding:'13px',fontFamily:'DM Sans,sans-serif',fontSize:14,fontWeight:700,cursor:'pointer',letterSpacing:'-0.01em',boxShadow:'0 2px 8px rgba(29,62,138,.25)'}}>
            <IcoCapture size={17} color="#fff"/>Anotar
          </button>
          <button onClick={toggleMark} style={{flexShrink:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3,background:isMarked?C.ouroBg:'#fff',color:isMarked?C.ouroTxt:C.cinza,border:`1px solid ${isMarked?C.ouroTxt:C.linha}`,borderRadius:10,padding:'10px 14px',fontFamily:'DM Sans,sans-serif',fontSize:12,fontWeight:isMarked?700:500,cursor:'pointer'}}>
            <IcoStar size={16} color={isMarked?C.ouroTxt:C.cinza} filled={isMarked}/>{isMarked?'Marcado':'Marcar'}
          </button>
        </div>

        {/* Calendário */}
        <button onClick={()=>ccemBaixarIcs([s], 'ccem-'+id+'.ics')}
          style={{width:'100%',minHeight:44,display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:'#fff',color:C.azul,border:`1px solid ${C.linha}`,borderRadius:10,padding:'10px 14px',fontFamily:'DM Sans,sans-serif',fontSize:13,fontWeight:600,cursor:'pointer',marginBottom:8}}>
          <IcoCal size={16} color={C.azul}/>Adicionar ao calendário
        </button>

        {/* Assistente — ação terciária, peso reduzido */}
        <button onClick={handleAskAI} style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'9px 14px',background:'#f0f4fc',border:`1px solid ${C.linha}`,borderRadius:10,cursor:'pointer',marginBottom:14}}>
          <div style={{width:26,height:26,borderRadius:7,background:C.azul,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/><circle cx="9" cy="10" r="1" fill="#fff" stroke="none"/><circle cx="12" cy="10" r="1" fill="#fff" stroke="none"/><circle cx="15" cy="10" r="1" fill="#fff" stroke="none"/></svg>
          </div>
          <div style={{textAlign:'left',flex:1}}>
            <div style={{fontFamily:'DM Sans,sans-serif',fontSize:12,fontWeight:600,color:C.azul}}>Perguntar ao Assistente</div>
            <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,marginTop:1}}>contextualizado nesta sessão</div>
          </div>
          <IcoChevR size={15} color={C.cinza}/>
        </button>

        {/* Prev / Next */}
        <div style={{display:'flex',gap:8}}>
          {prevId&&SESSOES[prevId]&&(
            <button onClick={()=>go('#/sessao/'+prevId)} style={{flex:1,background:'#fff',border:`1px solid ${C.linha}`,borderRadius:10,padding:'9px 12px',textAlign:'left',cursor:'pointer',minWidth:0}}>
              <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:3}}>← Anterior</div>
              <div style={{fontSize:12,fontWeight:500,color:C.tinta,lineHeight:1.3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{SESSOES[prevId].titulo}</div>
            </button>
          )}
          {nextId&&SESSOES[nextId]&&(
            <button onClick={()=>go('#/sessao/'+nextId)} style={{flex:1,background:'#fff',border:`1px solid ${C.linha}`,borderRadius:10,padding:'9px 12px',textAlign:'right',cursor:'pointer',minWidth:0}}>
              <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:3}}>Próxima →</div>
              <div style={{fontSize:12,fontWeight:500,color:C.tinta,lineHeight:1.3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{SESSOES[nextId].titulo}</div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── ProgramaScreen ─────────────────────────────────────────── */
function ProgramaScreen() {
  const appState = useAppState();
  const [dia, setDia] = useState(()=>{
    const hoje = ccemDiaDoEvento();
    try {
      const salvo = JSON.parse(sessionStorage.getItem('ccem_dia')||'null');
      if (salvo && DIAS.includes(salvo.dia) && salvo.ref === (hoje||'fora')) return salvo.dia;
    } catch(e) {}
    return hoje || DIAS[0];
  });
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState(null);
  const [soMarcados, setSoMarcados] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const listRef = useRef(null);

  useEffect(()=>{ try{sessionStorage.setItem('ccem_dia',JSON.stringify({dia, ref:ccemDiaDoEvento()||'fora'}));}catch(e){} },[dia]);
  useEffect(()=>{
    const el=listRef.current; if(!el) return;
    const key='ccem_scroll_'+dia;
    let saved=null; try{ saved=sessionStorage.getItem(key); }catch(e){}
    if (saved !== null) {
      // Volta de uma sessão ou do painel do Assistente: mantém onde estava.
      el.scrollTop = parseInt(saved)||0;
    } else if (ccemDiaDoEvento() === dia) {
      // Primeira abertura no dia do evento: rola até a sessão em curso ou a próxima.
      const e = ccemEstado();
      const alvo = (e.agora && e.agora.dia===dia) ? e.agora : (e.aSeguir && e.aSeguir.dia===dia ? e.aSeguir : null);
      const card = alvo && el.querySelector('[data-sessao="'+alvo.id+'"]');
      if (card) el.scrollTop += card.getBoundingClientRect().top - el.getBoundingClientRect().top - 8;
    }
    return ()=>{ if(el) try{sessionStorage.setItem(key,String(el.scrollTop));}catch(e){} };
  },[dia]);

  const buscaNorm = useMemo(()=>norm(busca),[busca]);
  const items = useMemo(()=>{
    const filtrar = d => (PROGRAMA[d]||[]).filter(item=>{
      if(item.tipo==='intervalo') return !buscaNorm&&!filtroTipo&&!soMarcados;
      const s=SESSOES[item.id]; if(!s) return false;
      if(soMarcados&&!appState.marks?.[item.id]) return false;
      if(filtroTipo&&s.tipo!==filtroTipo) return false;
      if(buscaNorm){
        const hay=norm(s.titulo+' '+(s.moderador||'')+' '+(s.falas||[]).map(f=>f.palestrante+' '+(f.titulo||'')).join(' ')+' '+(s.temas||[]).join(' '));
        if(!hay.includes(buscaNorm)) return false;
      }
      return true;
    });
    if (!buscaNorm) return filtrar(dia);
    // Com busca, procura nos dois dias, cada um com seu título.
    return DIAS.flatMap(d=>{
      const achou = filtrar(d);
      return achou.length ? [{ tipo:'dia', id:'dia-'+d, label: d===DIAS[0]?'Sexta · 23 de outubro':'Sábado · 24 de outubro' }, ...achou] : [];
    });
  },[dia,buscaNorm,filtroTipo,soMarcados,appState.marks]);

  const totalSessoes=(PROGRAMA[dia]||[]).filter(i=>i.tipo==='sessao'&&SESSOES[i.id]?.navegavel).length;
  const markedCount=(PROGRAMA[dia]||[]).filter(i=>i.tipo==='sessao'&&appState.marks?.[i.id]).length;
  const hasFilter = !!(filtroTipo||soMarcados);

  const chipSt=(active,bg)=>({display:'inline-flex',alignItems:'center',justifyContent:'center',background:active?bg:'#fff',color:active?'#fff':C.cinza,fontFamily:'DM Sans,sans-serif',fontSize:12,fontWeight:active?600:500,padding:'7px 14px',minHeight:44,borderRadius:22,border:`1px solid ${active?bg:C.linha}`,cursor:'pointer',whiteSpace:'nowrap',gap:4});

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden'}}>
      {/* Day tabs + filter trigger */}
      <div style={{display:'flex',alignItems:'center',gap:8,padding:'9px 12px 7px',borderBottom:`1px solid ${C.linha}`,background:'#fff',flexShrink:0}}>
        <div style={{display:'flex',background:'#f0f4fc',borderRadius:10,padding:3,gap:2,flex:1}}>
          {DIAS.map(d=>(
            <button key={d} onClick={()=>setDia(d)} style={{flex:1,padding:'6px 0',border:'none',borderRadius:8,fontFamily:'DM Sans,sans-serif',fontWeight:700,cursor:'pointer',background:dia===d?C.azul:'transparent',color:dia===d?'#fff':C.cinza,transition:'all .15s'}}>
              <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:16,lineHeight:1,display:'block'}}>{d.includes('23')?'23':'24'}</span>
              <span style={{fontSize:12,letterSpacing:'0.08em',textTransform:'uppercase'}}>{d.includes('sex')?'SEX':'SÁB'}</span>
            </button>
          ))}
        </div>
        <div style={{display:'flex',gap:6,flexShrink:0,alignItems:'center'}}>
          <div style={{textAlign:'right'}}>
            <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.05em'}}>{totalSessoes} sessões</div>
            {markedCount>0&&<div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.azulSoft,marginTop:1}}>{markedCount} marcadas</div>}
          </div>
          <button onClick={()=>setFilterOpen(true)} aria-label="Filtrar sessões" style={{position:'relative',width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',background:'#fff',border:`1px solid ${hasFilter?C.azul:C.linha}`,borderRadius:10,cursor:'pointer',flexShrink:0,color:hasFilter?C.azul:C.cinza}}>
            <IcoFilter size={16} color={hasFilter?C.azul:C.cinza}/>
            {hasFilter&&<span style={{position:'absolute',top:-3,right:-3,width:8,height:8,borderRadius:'50%',background:C.azul,border:'2px solid #fff'}}/>}
          </button>
        </div>
      </div>

      {/* Busca — sempre visível */}
      <div style={{padding:'8px 12px 0',background:'#fff',flexShrink:0}}>
        <div style={{position:'relative',display:'flex',alignItems:'center'}}>
          <span style={{position:'absolute',left:10,pointerEvents:'none'}}><IcoSearch size={14} color={C.cinza}/></span>
          <input value={busca} onChange={e=>setBusca(e.target.value)}
            placeholder="Sessão, palestrante ou tema"
            style={{width:'100%',minHeight:44,padding:'7px 44px 7px 30px',border:`1px solid ${C.linha}`,borderRadius:8,fontFamily:'DM Sans,sans-serif',fontSize:16,color:C.tinta,background:'#f8fafd',outline:'none',boxSizing:'border-box'}}/>
          {busca&&<button onClick={()=>setBusca('')} aria-label="Limpar busca" style={{position:'absolute',right:0,width:44,height:44,background:'none',border:'none',cursor:'pointer',color:C.cinza,display:'flex',alignItems:'center',justifyContent:'center',padding:0}}><IcoX size={14}/></button>}
        </div>
      </div>

      {/* Só marcadas — sempre à vista */}
      <div style={{padding:'8px 12px 0',background:'#fff',flexShrink:0}}>
        <button onClick={()=>setSoMarcados(v=>!v)} aria-pressed={soMarcados}
          style={{width:'100%',minHeight:44,display:'flex',alignItems:'center',justifyContent:'center',gap:7,
            background:soMarcados?C.ouroBg:'#fff',color:soMarcados?C.ouroTxt:C.tinta,
            border:`1px solid ${soMarcados?C.ouroTxt:C.linha}`,borderRadius:9,cursor:'pointer',
            fontFamily:'DM Sans,sans-serif',fontSize:13,fontWeight:600}}>
          <IcoStar size={15} color={soMarcados?C.ouroTxt:C.cinza} filled={soMarcados}/>
          {soMarcados ? 'Mostrando só marcadas' : 'Só marcadas'}
          <span style={{fontWeight:500,color:C.cinza}}>· {markedCount} neste dia</span>
        </button>
      </div>

      <DayTimeline dia={dia}/>

      {/* Filtros ativos — resumo compacto */}
      {hasFilter&&(
        <div style={{display:'flex',gap:5,padding:'5px 12px',background:'#f0f4fc',borderBottom:`1px solid ${C.linhaSoft}`,flexShrink:0,overflowX:'auto',scrollbarWidth:'none',alignItems:'center'}}>
          {filtroTipo&&<span style={{...chipSt(true,C.azul),minHeight:0,fontSize:12,padding:'3px 10px'}}>{filtroTipo==='simposio'?'Simpósio':filtroTipo==='mini'?'Mini':'Satélite'}</span>}
          {soMarcados&&<span style={{...chipSt(true,C.ouroTxt),minHeight:0,fontSize:12,padding:'3px 10px'}}>★ Marcados</span>}
          <button onClick={()=>{setFiltroTipo(null);setSoMarcados(false);}} style={{minHeight:44,minWidth:44,border:'none',background:'none',color:C.cinza,fontSize:12,cursor:'pointer',fontFamily:'inherit',padding:'0 8px',flexShrink:0}}>Limpar ×</button>
        </div>
      )}

      {/* Lista */}
      <div ref={listRef} style={{flex:1,overflowY:'auto',paddingBottom:84}}>
        {items.length===0?(
          <div style={{textAlign:'center',padding:'40px 20px',color:C.cinza}}>
            <div style={{fontSize:28,marginBottom:10}}>○</div>
            <div style={{fontSize:13,marginBottom:12}}>Nenhuma sessão encontrada</div>
            <button onClick={()=>{setBusca('');setFiltroTipo(null);setSoMarcados(false);}} style={{minHeight:44,border:`1px solid ${C.linha}`,background:'#fff',color:C.azul,padding:'7px 16px',borderRadius:8,cursor:'pointer',fontFamily:'inherit',fontSize:12}}>Limpar filtros</button>
          </div>
        ):items.map((item,i)=>item.tipo==='dia'
            ? <div key={item.id} style={{padding:'12px 16px 4px',fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,fontWeight:700,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.08em'}}>{item.label}</div>
            : item.tipo==='intervalo'?<IntervalRow key={i} item={item}/>:<SessaoCard key={item.id} id={item.id}/>)}
        {items.length>0&&<div style={{padding:'12px 16px',fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,textAlign:'center',letterSpacing:'0.04em'}}>toque para abrir a sessão<br/>Programa conferido com o site oficial em {CCEM_PROGRAMA_CONFERIDO}</div>}
      </div>

      {/* Filter bottom-sheet */}
      {filterOpen&&(
        <div style={{position:'fixed',inset:0,zIndex:200,display:'flex',flexDirection:'column',justifyContent:'flex-end',background:'rgba(0,0,0,.38)'}}
          onClick={()=>setFilterOpen(false)}>
          <div role="dialog" aria-modal="true" aria-label="Filtrar sessões" onKeyDown={e=>e.key==='Escape'&&setFilterOpen(false)}
            style={{background:'#fff',borderRadius:'18px 18px 0 0',padding:'20px 18px 36px',maxWidth:440,width:'100%',margin:'0 auto',boxShadow:'0 -4px 32px rgba(10,18,50,.18)'}}
            onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
              <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,textTransform:'uppercase',letterSpacing:'0.1em',color:C.cinza,fontWeight:600}}>Filtrar sessões</span>
              <button autoFocus onClick={()=>setFilterOpen(false)} aria-label="Fechar" style={{width:44,height:44,background:'none',border:'none',fontSize:22,color:C.cinza,cursor:'pointer',lineHeight:1,padding:0}}>×</button>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:9}}>Tipo de sessão</div>
              <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
                {[['simposio','Simpósio'],['mini','Mini-Conferência'],['satelite','Satélite']].map(([t,lbl])=>(
                  <button key={t} onClick={()=>setFiltroTipo(filtroTipo===t?null:t)} style={chipSt(filtroTipo===t,C.azul)}>{lbl}</button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <button onClick={()=>setSoMarcados(v=>!v)}
                style={{...chipSt(soMarcados,C.ouroTxt),width:'100%',justifyContent:'center'}}>
                ★ Mostrar apenas marcados
              </button>
            </div>
            {hasFilter&&(
              <button onClick={()=>{setFiltroTipo(null);setSoMarcados(false);}}
                style={{width:'100%',minHeight:44,border:`1px solid ${C.linha}`,background:'#fff',color:C.cinza,borderRadius:8,padding:'9px',fontSize:12,fontWeight:500,cursor:'pointer',fontFamily:'inherit',marginBottom:8}}>
                Limpar filtros
              </button>
            )}
            <button onClick={()=>setFilterOpen(false)}
              style={{width:'100%',background:C.azul,color:'#fff',border:'none',borderRadius:10,padding:'11px',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
              Ver resultados
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Item "Instalar o app" em Info: só no celular e fora do app já instalado. */
function ItemInstalar() {
  const appState = useAppState();
  const { instalado, plataforma, nativo } = useInstalacao();
  const [folha, setFolha] = useState(false);
  if (instalado || plataforma === 'outro') return null;
  const temDados = Object.keys(appState.marks || {}).length > 0 || (appState.captures || []).length > 0;
  return (
    <div style={{background:'#fff',borderRadius:12,margin:'10px 14px 0',border:`1px solid ${C.linhaSoft}`}}>
      <button onClick={async()=>{ if (!(plataforma==='android' && nativo && await ccemInstalarNativo())) setFolha(true); }}
        style={{width:'100%',minHeight:56,display:'flex',alignItems:'center',gap:11,padding:'8px 14px',background:'none',border:'none',cursor:'pointer',textAlign:'left'}}>
        <img src="icon-192.png" alt="" width="34" height="34" style={{borderRadius:9,flexShrink:0}}/>
        <span style={{flex:1}}>
          <span style={{display:'block',fontSize:13.5,fontWeight:600,color:C.tinta}}>Instalar o app na tela inicial</span>
          <span style={{display:'block',fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza}}>abre pelo ícone e funciona sem internet</span>
        </span>
        <IcoChevR size={16} color={C.cinza}/>
      </button>
      {folha && <FolhaInstalar temDados={temDados} aoFechar={()=>setFolha(false)}/>}
    </div>
  );
}

/* ── InfoScreen — página única ──────────────────────────────── */
function InfoScreen() {
  const IC = ({children,style})=><div style={{background:'#fff',borderRadius:12,padding:'13px 14px',margin:'10px 14px 0',border:`1px solid ${C.linhaSoft}`,boxShadow:'0 1px 5px rgba(29,62,138,.04)',...(style||{})}}>{children}</div>;
  const H3 = ({children})=><h3 style={{fontFamily:'Georgia,serif',fontSize:13.5,fontWeight:600,color:C.tinta,margin:'0 0 8px',letterSpacing:'-0.005em'}}>{children}</h3>;
  const Row = ({lbl,val})=><div style={{display:'flex',gap:8,fontSize:12.5,color:C.cinza,padding:'6px 0',borderBottom:`1px solid ${C.linhaSoft}`}}><div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.08em',width:72,flexShrink:0,lineHeight:1.6}}>{lbl}</div><div style={{flex:1,color:C.tinta}}>{val}</div></div>;
  const CR = ({icon,lbl,val,href,ultimo})=><a href={href} target="_blank" rel="noopener" style={{display:'flex',alignItems:'center',gap:11,minHeight:44,padding:'9px 0',borderBottom:ultimo?'none':`1px solid ${C.linhaSoft}`,textDecoration:'none'}}>
    <div style={{width:34,height:34,borderRadius:9,background:C.azulBg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:C.azul}}>{icon}</div>
    <div><div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:2}}>{lbl}</div>
      <div style={{fontSize:13,fontWeight:600,color:C.azul}}>{val}</div>
    </div>
  </a>;

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden'}}>
      <div style={{flex:1,overflowY:'auto',paddingBottom:84}}>

        {/* Identidade */}
        <div style={{background:C.azul,color:'#fff',padding:'20px 16px 18px'}}>
          <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,letterSpacing:'0.12em',textTransform:'uppercase',opacity:.75,marginBottom:4}}>SBEM-SC · Sociedade Brasileira de Endocrinologia e Metabologia</div>
          <h2 style={{fontFamily:'Georgia,serif',fontSize:21,fontWeight:600,margin:'0 0 3px',lineHeight:1.2,letterSpacing:'-0.01em'}}>12º CCEM 2026</h2>
          <p style={{fontSize:12,opacity:.8,lineHeight:1.4,margin:'0 0 10px'}}>Congresso Catarinense de Endocrinologia e Metabologia</p>
          <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,background:'rgba(255,255,255,.12)',padding:'7px 10px',borderRadius:6,letterSpacing:'0.02em',lineHeight:1.7}}>
            Expoville · Rua XV de Novembro, 4315 · Joinville/SC<br/>
            23 e 24 de Outubro de 2026
          </div>
        </div>

        {/* Congresso */}
        <IC>
          <H3>Organização</H3>
          <Row lbl="Presidente" val="Dr. Fulvio Clemo Santos Tomaselli — SBEM-SC"/>
          <Row lbl="Pres. eleito" val="Dr. Frederico Guimarães Marchisotti"/>
          <Row lbl="Dir. cient." val="Dr. Dalisbor Marcelo Weber Silva"/>
          <Row lbl="Secretaria" val="Sex 23/10 · 07h30–18h30 · Sáb 24/10 · 07h30–18h"/>
          <Row lbl="Abertura" val="Sexta, 23/10 · 08h00"/>
          <div style={{display:'flex',gap:8,fontSize:12.5,color:C.cinza,padding:'6px 0'}}>
            <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.08em',width:72,flexShrink:0,lineHeight:1.6}}>Cert.</div>
            <div style={{flex:1,color:C.tinta}}>Disponíveis a partir de <strong>05/11/2026</strong> via CPF — apenas para inscritos presentes.</div>
          </div>
        </IC>

        {/* Contato */}
        <IC>
          <H3>Contato</H3>
          <CR icon={<IcoPhone size={17}/>} lbl="WhatsApp" val="(47) 99130-3330" href="https://wa.me/5547991303330"/>
          <CR icon={<IcoMail size={17}/>}  lbl="E-mail"    val="contato@ccem2026.com.br" href="mailto:contato@ccem2026.com.br"/>
          <CR icon={<IcoInsta size={17}/>} lbl="Instagram" val="@sbemsceventos" href="https://instagram.com/sbemsceventos"/>
          <CR icon={<IcoGlobe size={17}/>} lbl="Site oficial" val="ccem2026.com.br ↗" href="https://www.ccem2026.com.br" ultimo/>
        </IC>

        {/* Instalar na tela inicial */}
        <ItemInstalar/>

        {/* Privacidade e dados */}
        <IC>
          <H3>Privacidade e dados</H3>
          <p style={{fontSize:12.5,color:C.tinta,lineHeight:1.55,margin:'0 0 10px',padding:'8px 10px',background:'#f5f8fd',borderRadius:7,borderLeft:`3px solid ${C.linha}`}}>
            Suas notas, fotos e marcações ficam só neste aparelho, sem cadastro. Se você limpar o navegador ou trocar de aparelho, elas se perdem: use Exportar ou Backup, no Caderno. O app fica disponível até 31/12/2026.
          </p>
          <p style={{fontSize:12.5,color:C.tinta,lineHeight:1.55,margin:'0 0 10px',padding:'8px 10px',background:'#f5f8fd',borderRadius:7,borderLeft:`3px solid ${C.linha}`}}>
            A IA só recebe algo quando você a usa. A pergunta, o texto ou a foto (Assistente, Perguntar sobre o slide, Resumir e Organizar com IA) vão para processamento pela Anthropic, nos EUA; o app não guarda cópia no servidor, e a Anthropic segue a própria política de retenção. Em "Encontrar o artigo", só o texto da referência vai ao PubMed e ao Unpaywall. Não envie dados nem imagens de pacientes. As respostas da IA podem conter erros.
          </p>
          <p style={{fontSize:12.5,color:C.tinta,lineHeight:1.55,margin:'0 0 10px',padding:'8px 10px',background:'#f5f8fd',borderRadius:7,borderLeft:`3px solid ${C.linha}`}}>
            A IA é exclusiva para inscritos: para usá-la, você entra com o e-mail da inscrição e recebe um código. O e-mail serve só para conferir a inscrição na lista da organização; o app não guarda essa lista.
          </p>
          <SessaoInfo/>
          <p style={{fontSize:12.5,color:C.cinza,lineHeight:1.55,margin:'0 0 10px'}}>
            O selo "Agora" segue o horário previsto no programa; atrasos no evento não aparecem no app.
          </p>
          <button onClick={()=>{if(confirm('Apagar todas as notas, fotos e marcações deste aparelho? Não dá para desfazer.')) ccemLimparTudo().then(()=>location.reload());}}
            style={{width:'100%',minHeight:44,border:'1px solid #e53e3e',background:'#fff',color:'#e53e3e',borderRadius:8,padding:'8px',fontSize:12.5,fontWeight:500,cursor:'pointer',fontFamily:'inherit'}}>
            Limpar todos os meus dados
          </button>
        </IC>

        {/* Rodapé */}
        <div style={{textAlign:'center',padding:'18px 16px 4px',fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,lineHeight:1.9}}>
          <div>Meu CCEM 2026 · v4.1</div>
          <div>Realização: SBEM-SC</div>
          <div style={{marginTop:6}}>
            <a href="https://www.ccem2026.com.br" target="_blank" rel="noopener" style={{display:'inline-flex',alignItems:'center',minHeight:44,color:C.azul,textDecoration:'none',fontSize:12}}>ccem2026.com.br · site oficial do congresso ↗</a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── LiveStrip — visível apenas nos ±7 dias do congresso ──── */
function isEventWeek() {
  const agora = ccemAgora();
  return agora >= new Date('2026-10-16T00:00:00-03:00')   // 7 dias antes
      && agora <  new Date('2026-11-01T00:00:00-03:00');  // até o fim de 31/10
}

function LiveStrip(){
  const [st, setSt] = useState(()=>ccemLiveStatus());
  useEffect(()=>{
    const id=setInterval(()=>setSt(ccemLiveStatus()),30000);
    return ()=>clearInterval(id);
  },[]);
  if (!isEventWeek()) return null;
  const dotColors={live:'#22c55e',soon:C.ouro,upcoming:C.cinza,past:C.linha};
  const bg={live:'#eef6ff',soon:'#fef9ec',upcoming:'#f5f7fb',past:'#f5f7fb'};
  return (
    <div style={{display:'flex',alignItems:'center',gap:7,margin:'8px 0 0',padding:'5px 8px',background:bg[st.kind]||'#f5f7fb',borderRadius:7,border:`1px solid ${C.linhaSoft}`}}>
      <span style={{width:6,height:6,borderRadius:'50%',background:dotColors[st.kind],flexShrink:0,boxShadow:st.kind==='live'?'0 0 0 3px rgba(34,197,94,.2)':'none'}}/>
      <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:st.kind==='live'?C.azulSoft:C.cinza,textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:700,flexShrink:0}}>{st.tag}</span>
      <span style={{fontSize:12,color:C.tinta,fontWeight:500,flex:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{st.text}</span>
      <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,flexShrink:0}}>{st.time}</span>
    </div>
  );
}

/* ── AppHeader ──────────────────────────────────────────────── */
function AppHeader(){
  return (
    <div style={{padding:'10px 16px 8px',background:'#fff',borderBottom:`1px solid ${C.linha}`,flexShrink:0}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <img src="v4/logo-ccem.png" alt="CCEM 2026" style={{height:28,objectFit:'contain',cursor:'pointer'}}
            onClick={()=>go('#/')}
            onError={e=>{e.target.style.display='none';if(e.target.nextSibling)e.target.nextSibling.style.display='flex';}}/>
          <div onClick={()=>go('#/')} style={{display:'none',alignItems:'baseline',gap:4,cursor:'pointer'}}>
            <span style={{fontFamily:'Georgia,serif',fontWeight:700,fontSize:17,color:C.azul,letterSpacing:'-0.02em'}}>CCEM</span>
            <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.ouroTxt,letterSpacing:'0.08em'}}>2026</span>
          </div>
        </div>
        <div style={{textAlign:'right',flexShrink:0}}>
          <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,letterSpacing:'0.05em',textTransform:'uppercase'}}>23–24 OUT · Joinville/SC</div>
          <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.ouroTxt,letterSpacing:'0.04em',marginTop:1}}>Expoville</div>
        </div>
      </div>
      <LiveStrip/>
    </div>
  );
}

/* ── Trabalhos científicos ─────────────────────────────────────
   Resumo do que está na página oficial + botão para a lista de
   aprovados. Quando sair o cronograma, ele aparece aqui. */
function TrabalhosScreen() {
  const T = CCEM_TRABALHOS;
  const IC = ({children})=><div style={{background:'#fff',borderRadius:12,padding:'13px 14px',margin:'10px 14px 0',border:`1px solid ${C.linhaSoft}`,boxShadow:'0 1px 5px rgba(29,62,138,.04)'}}>{children}</div>;
  const H3 = ({children})=><h3 style={{fontFamily:'Georgia,serif',fontSize:14,fontWeight:600,color:C.tinta,margin:'0 0 8px'}}>{children}</h3>;
  const P = ({children})=><p style={{fontSize:13,color:C.tinta,lineHeight:1.55,margin:'0 0 6px'}}>{children}</p>;
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden'}}>
      <div style={{flex:1,overflowY:'auto',paddingBottom:84}}>
        <div style={{background:C.azul,color:'#fff',padding:'20px 16px 18px'}}>
          <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,letterSpacing:'0.12em',textTransform:'uppercase',opacity:.75,marginBottom:4}}>12º CCEM 2026</div>
          <h2 style={{fontFamily:'Georgia,serif',fontSize:21,fontWeight:600,margin:0,lineHeight:1.2}}>Trabalhos científicos</h2>
        </div>
        <IC>
          <H3>Trabalhos aprovados</H3>
          <P>A lista completa está no site oficial do congresso.</P>
          <a href={LINK_EPOSTER} target="_blank" rel="noopener"
            style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,minHeight:48,marginTop:6,borderRadius:10,background:C.azul,color:'#fff',textDecoration:'none',fontFamily:'DM Sans,sans-serif',fontSize:14,fontWeight:700}}>
            Ver trabalhos aprovados <IcoLink size={16} color="#fff"/>
          </a>
        </IC>
        <IC>
          <H3>Apresentações</H3>
          <P>{T.exibicao}</P>
          <P>{T.apresentacao}</P>
          {T.cronograma
            ? T.cronograma.map((c,i)=><P key={i}><b>{c.quando}</b> · {c.oque}</P>)
            : <p style={{fontSize:12.5,color:C.cinza,lineHeight:1.5,margin:'4px 0 0'}}>O cronograma das apresentações será divulgado pela organização e aparecerá aqui.</p>}
        </IC>
        <IC>
          <H3>Publicação</H3>
          <P>{T.publicacao}</P>
          {T.revista&&<a href={T.revista} target="_blank" rel="noopener"
            style={{display:'inline-flex',alignItems:'center',gap:6,minHeight:44,color:C.azul,fontWeight:600,fontSize:13,textDecoration:'none'}}>
            Conhecer a revista <IcoLink size={14} color={C.azul}/>
          </a>}
        </IC>
        <IC>
          <H3>Para os autores</H3>
          <P>Enviar a apresentação em PDF até <b>{T.envio.prazo}</b> para{' '}
            <a href={'mailto:'+T.envio.email} style={{color:C.azul,fontWeight:600}}>{T.envio.email}</a>.</P>
          <p style={{fontSize:12,color:C.cinza,lineHeight:1.5,margin:'8px 0 0'}}>Informações conferidas no site oficial em {T.conferido}. Em caso de dúvida, vale o site oficial.</p>
        </IC>
      </div>
    </div>
  );
}

/* ── TabBar — Programa · Assistente · Caderno · Trabalhos · Info */
function TabBar({ aba }){
  const tabs=[
    {id:'programa',   icon:<IcoCal size={21}/>,    lbl:'Programa'},
    {id:'assistente', icon:<IcoChat size={21}/>,    lbl:'Assistente'},
    {id:'caderno',    icon:<IcoBook size={21}/>,    lbl:'Caderno'},
    ...(LINK_EPOSTER ? [{id:'trabalhos', icon:<IcoPoster size={21}/>, lbl:'Trabalhos'}] : []),
    {id:'info',       icon:<IcoInfo size={21}/>,    lbl:'Info'},
  ];
  return (
    <nav style={{display:'flex',background:'#fff',borderTop:`1px solid ${C.linha}`,flexShrink:0}}>
      {tabs.map(t=>{
        const on=aba===t.id;
        return (
          <button key={t.id} onClick={()=>go('#/'+t.id)}
            style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3,padding:'8px 0 10px',border:'none',background:'none',cursor:'pointer',color:on?C.azul:C.cinza,transition:'color .15s'}}>
            {t.icon}
            <span style={{fontFamily:'DM Sans,sans-serif',fontSize:12,fontWeight:on?600:400}}>{t.lbl}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ── useIsDesktop ────────────────────────────────────────────── */
function useIsDesktop() {
  const [is, setIs] = useState(()=>window.innerWidth>=720);
  useEffect(()=>{
    const mq = window.matchMedia('(min-width: 720px)');
    const fn = e => setIs(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  },[]);
  return is;
}

/* ── DesktopSidebar ──────────────────────────────────────────── */
function DesktopSidebar({ aba }) {
  const tabs=[
    {id:'programa',   icon:<IcoCal size={20}/>,    lbl:'Programa'},
    {id:'assistente', icon:<IcoChat size={20}/>,    lbl:'Assistente'},
    {id:'caderno',    icon:<IcoBook size={20}/>,    lbl:'Caderno'},
    ...(LINK_EPOSTER ? [{id:'trabalhos', icon:<IcoPoster size={20}/>, lbl:'Trabalhos'}] : []),
    {id:'info',       icon:<IcoInfo size={20}/>,    lbl:'Info'},
  ];
  return (
    <div style={{width:220,background:'#fff',borderRight:`1px solid ${C.linha}`,display:'flex',flexDirection:'column',flexShrink:0,height:'100%',overflow:'hidden'}}>
      <div style={{padding:'22px 18px 14px',borderBottom:`1px solid ${C.linhaSoft}`}}>
        <button onClick={()=>go('#/')} style={{display:'flex',alignItems:'baseline',gap:6,marginBottom:5,background:'none',border:'none',cursor:'pointer',padding:0,textDecoration:'none'}}>
          <span style={{fontFamily:'Georgia,serif',fontWeight:700,fontSize:22,color:C.azul,letterSpacing:'-0.02em'}}>CCEM</span>
          <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.ouroTxt,letterSpacing:'0.08em'}}>2026</span>
        </button>
        <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,letterSpacing:'0.04em',marginTop:2}}>23–24 out · Joinville/SC</div>
        <div style={{marginTop:10}}><LiveStrip/></div>
      </div>
      <nav style={{flex:1,padding:'10px 8px',overflowY:'auto'}}>
        {tabs.map(t=>{
          const on=aba===t.id||(aba==='sessao'&&t.id==='programa');
          return (
            <button key={t.id} onClick={()=>go('#/'+t.id)}
              style={{width:'100%',minHeight:44,display:'flex',alignItems:'center',gap:10,padding:'9px 12px',border:'none',background:on?C.azulBg:'none',color:on?C.azul:C.cinza,borderRadius:9,cursor:'pointer',fontFamily:'DM Sans,sans-serif',fontSize:13.5,fontWeight:on?700:400,marginBottom:2,transition:'all .15s',textAlign:'left'}}>
              <span style={{flexShrink:0,color:on?C.azul:C.cinza}}>{t.icon}</span>
              {t.lbl}
              {on&&<span style={{marginLeft:'auto',width:5,height:5,borderRadius:'50%',background:C.azul,flexShrink:0}}/>}
            </button>
          );
        })}
      </nav>
      <div style={{padding:'12px 16px',borderTop:`1px solid ${C.linhaSoft}`}}>
        <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,lineHeight:1.7}}>Meu CCEM 2026 · v4.1<br/>Realização: SBEM-SC</div>
      </div>
    </div>
  );
}

/* ── AppShell ────────────────────────────────────────────────── */
/* Área de conteúdo com o botão "8" no canto inferior direito.
   reserva: nas telas com "Marcar" e "Adicionar ao calendário" (Home e
   Sessão), uma faixa fixa no rodapé abriga o botão — o conteúdo nunca
   passa por baixo dele, então ele nunca cobre esses botões. */
function AreaComFab({ fab, reserva, children }) {
  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',minHeight:0,position:'relative'}}>
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',minHeight:0}}>{children}</div>
      {reserva&&<div aria-hidden="true" style={{height:84,flexShrink:0,background:C.papel,borderTop:`1px solid ${C.linhaSoft}`}}/>}
      {fab}
    </div>
  );
}

function AppShell({ showShell, aba, fab, reservaFab, children }){
  const isDesktop = useIsDesktop();
  if (isDesktop) {
    return (
      <div style={{flex:1,display:'flex',overflow:'hidden',minHeight:0}}>
        <DesktopSidebar aba={aba}/>
        <div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column',alignItems:'center',minHeight:0,background:'#e8eef8'}}>
          <div style={{width:'100%',maxWidth:800,flex:1,overflow:'hidden',display:'flex',flexDirection:'column',minHeight:0,background:C.papel}}>
            <AreaComFab fab={fab} reserva={reservaFab}>{children}</AreaComFab>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',minHeight:0}}>
      {showShell?(
        <>
          <AppHeader/>
          <AreaComFab fab={fab} reserva={reservaFab}>{children}</AreaComFab>
          <TabBar aba={aba}/>
        </>
      ):<AreaComFab fab={fab} reserva={reservaFab}>{children}</AreaComFab>}
    </div>
  );
}

Object.assign(window, {
  AppShell, AppHeader, LiveStrip, TabBar, DesktopSidebar, useIsDesktop,
  DayTimeline, SlideDisplay, SlideUploadBtn,
  ProgramaScreen, SessaoDetail, InfoScreen, TrabalhosScreen,
  BadgePill, TopicPill, IntervalRow, SessaoCard,
  sessionIsPast, isEventWeek,
});
