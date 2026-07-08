/* ============================================================
   Meu CCEM 2026 — TELAS v4
   ============================================================ */

/* ── helpers ────────────────────────────────────────────────── */
function badgeColor(tipo) {
  if (tipo==='simposio') return C.azul;
  if (tipo==='mini')     return '#0d9488';
  if (tipo==='satelite') return C.ouro;
  return '#64748b';
}
function norm(s){ return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); }

function sessionIsPast(s) {
  if (!s) return false;
  const now = new Date();
  const [h,m] = s.fim.split(':').map(Number);
  const end = s.dia===DIAS[0] ? new Date(2026,9,23,h,m) : new Date(2026,9,24,h,m);
  return now > end;
}

const BACK_BTN = {width:40,height:40,display:'flex',alignItems:'center',justifyContent:'center',border:'none',background:'transparent',cursor:'pointer',borderRadius:9,flexShrink:0,padding:0};
const PILL = {display:'inline-flex',alignItems:'center',fontFamily:'DM Sans,system-ui,sans-serif',fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase',borderRadius:20,whiteSpace:'nowrap',lineHeight:1.6};

/* ── BadgePill / TopicPill / IntervalRow ───────────────────── */
function BadgePill({ tipo, label, sm }) {
  const bg = badgeColor(tipo);
  return <span style={{...PILL,background:bg+'1a',color:bg,border:`1px solid ${bg}28`,fontSize:sm?8:9,padding:sm?'2px 7px':'3px 9px'}}>{label}</span>;
}
function TopicPill({ tema }) {
  const color = TEMAS_COR[tema] || C.cinza;
  return <span style={{...PILL,background:color+'18',color,border:`1px solid ${color}28`,fontSize:11,padding:'3px 9px'}}>{tema}</span>;
}
function IntervalRow({ item }) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:10,padding:'6px 16px',background:'#f5f8fd',borderTop:`1px solid ${C.linhaSoft}`,borderBottom:`1px solid ${C.linhaSoft}`,margin:'2px 0'}}>
      <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,textTransform:'uppercase',letterSpacing:'0.08em',color:C.cinza,fontWeight:600}}>{item.label}</span>
      {item.dur&&<span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,marginLeft:'auto'}}>{item.dur}</span>}
    </div>
  );
}

/* ── SessaoCard ─────────────────────────────────────────────── */
function SessaoCard({ id }) {
  const s = SESSOES[id];
  const appState = useAppState();
  if (!s) return null;
  const isMarked = !!(appState.marks&&appState.marks[id]);
  const bc = badgeColor(s.tipo);
  return (
    <div onClick={()=>s.navegavel&&go('#/sessao/'+id)}
      role={s.navegavel?'button':undefined}
      tabIndex={s.navegavel?0:undefined}
      aria-label={s.navegavel?s.titulo:undefined}
      onKeyDown={e=>(e.key==='Enter'||e.key===' ')&&s.navegavel&&go('#/sessao/'+id)}
      style={{background:s.tipo==='satelite'?'#f8fafd':(s.isNow?'#eef6ff':'#fff'),
        borderLeft:s.tipo==='satelite'?`2px solid ${C.linha}`:`3px solid ${s.starred?C.ouro:(s.isNow?C.azulSoft:bc)}`,
        margin:s.tipo==='satelite'?'3px 16px':'5px 12px',borderRadius:8,
        padding:s.tipo==='satelite'?'7px 10px':'10px 12px',
        border:`1px solid ${s.isNow?'#c2daf8':C.linhaSoft}`,
        opacity:s.tipo==='satelite'?0.75:1,
        cursor:s.navegavel?'pointer':'default',position:'relative'}}>
      {s.isNow&&<span style={{position:'absolute',top:8,right:8,background:'#22c55e',color:'#fff',fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',padding:'2px 7px',borderRadius:10,fontWeight:700}}>Agora</span>}
      {s.starred&&!s.isNow&&<span style={{position:'absolute',top:7,right:10,color:C.ouro,fontSize:14}}>★</span>}
      <div style={{display:'flex',gap:10,alignItems:'flex-start'}}>
        <div style={{minWidth:40,flexShrink:0,textAlign:'center',paddingTop:1}}>
          <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:13.5,fontWeight:700,color:C.azul,lineHeight:1}}>{s.inicio}</div>
          <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,marginTop:3,lineHeight:1.3}}>→{s.fim}</div>
          <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,marginTop:1}}>{s.dur}</div>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:5}}>
            <BadgePill tipo={s.tipo} label={s.badge} sm />
          </div>
          <div style={{fontSize:13,fontWeight:600,color:C.tinta,lineHeight:1.3,marginBottom:3,paddingRight:(s.isNow||s.starred)?36:0}}>{s.titulo}</div>
          {s.moderador&&<div style={{fontSize:11,color:C.cinza,marginBottom:3}}>mod. {s.moderador}</div>}
          {s.aDefinir&&<div style={{fontSize:11,color:C.cinza,fontStyle:'italic'}}>programação a definir</div>}
          {(s.falas||[]).slice(0,3).map((f,i)=>(
            <div key={i} style={{display:'flex',gap:5,alignItems:'baseline',fontSize:11,color:C.cinza,marginTop:2}}>
              <span style={{color:bc,fontWeight:700,flexShrink:0,minWidth:10}}>{f.n}.</span>
              <span style={{flex:1,minWidth:0,lineHeight:1.3}}>
                {f.titulo&&<><span style={{color:C.tinta,fontWeight:500}}>{f.titulo}</span> · </>}
                <span style={{color:f.isMe?C.ouro:undefined,fontWeight:f.isMe?600:undefined}}>
                  {f.palestrante}{f.isMe?' ★':''}{f.aConfirmar&&<em style={{color:C.cinza}}> (a confirmar)</em>}
                </span>
              </span>
            </div>
          ))}
          {(s.falas||[]).length>3&&<div style={{fontSize:11,color:C.cinza,marginTop:2,fontStyle:'italic'}}>+{s.falas.length-3} fala(s)…</div>}
          {s.navegavel&&(
            <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end',marginTop:6,gap:5}}>
              {isMarked&&<span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.azulSoft}}>marcada</span>}
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
  const now = new Date();
  const isToday = (dia===DIAS[0]&&now.getFullYear()===2026&&now.getMonth()===9&&now.getDate()===23)||
                  (dia===DIAS[1]&&now.getFullYear()===2026&&now.getMonth()===9&&now.getDate()===24);
  const nowPct = isToday ? pct(now.getHours()+':'+now.getMinutes()) : -1;
  const bc = t => t==='simposio'?C.azul:t==='mini'?'#0d9488':t==='satelite'?'#94a3b8':'#334155';
  return (
    <div style={{margin:'0 12px 8px',background:'#fff',borderRadius:10,padding:'9px 12px 7px',border:`1px solid ${C.linhaSoft}`}}>
      <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,textTransform:'uppercase',letterSpacing:'0.1em',color:C.cinza,marginBottom:5}}>
        {dia===DIAS[0]?'A jornada · sexta 23/out':'A jornada · sábado 24/out'}
      </div>
      <div style={{position:'relative',height:20,background:C.cinzaClr,borderRadius:4,overflow:'visible'}}>
        {sessoes.map(s=>{
          const l=pct(s.inicio),w=Math.max(pct(s.fim)-l,.8);
          return <div key={s.id} onClick={()=>s.navegavel&&go('#/sessao/'+s.id)}
            role={s.navegavel?'button':undefined} tabIndex={s.navegavel?0:undefined}
            title={s.titulo} aria-label={s.titulo}
            style={{position:'absolute',top:2,bottom:2,left:l+'%',width:w+'%',background:bc(s.tipo),borderRadius:2,cursor:s.navegavel?'pointer':'default',opacity:.85,transition:'opacity .15s'}}
            onMouseOver={e=>{e.currentTarget.style.opacity=1;e.currentTarget.style.transform='scaleY(1.2)';}}
            onMouseOut={e=>{e.currentTarget.style.opacity=.85;e.currentTarget.style.transform='';}}/>;
        })}
        {nowPct>=0&&<div style={{position:'absolute',top:-3,bottom:-3,left:nowPct+'%',width:2,background:C.azulSoft,borderRadius:1,zIndex:5,boxShadow:`0 0 0 2px rgba(45,84,192,.2)`}}/>}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:4,fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza}}>
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
        style={{fontSize:11,fontWeight:600,color:C.verde,textDecoration:'none'}}>{slides.name}</a>
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
          <div style={{fontSize:11,fontWeight:600,color:C.verde,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{slides.name}</div>
          <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,marginTop:1}}>{(slides.size/1024).toFixed(0)} KB</div>
        </div>
        <a href={slides.dataUrl} download={slides.name}
          style={{fontSize:11,fontWeight:600,color:C.azul,textDecoration:'none',background:C.azulBg,padding:'4px 9px',borderRadius:6,flexShrink:0}}>↓</a>
        <button onClick={removeSlides} style={{background:'none',border:'none',color:C.cinza,cursor:'pointer',fontSize:14,padding:'0 2px',flexShrink:0}}>×</button>
      </div>
    );
  }
  return (
    <>
      <input type="file" ref={slInputRef} accept=".pdf,.ppt,.pptx,.key,.png,.jpg,.jpeg"
        style={{display:'none'}} onChange={e=>{handleSlideFile(e.target.files&&e.target.files[0]);e.target.value='';}}/>
      <button onClick={()=>slInputRef.current&&slInputRef.current.click()}
        style={{marginTop:6,display:'inline-flex',alignItems:'center',gap:5,fontSize:11,color:C.cinza,background:'none',border:`1px dashed ${C.linha}`,borderRadius:7,padding:'4px 10px',cursor:'pointer',fontFamily:'DM Sans,sans-serif'}}>
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
    showToast(isMarked?'Desmarcado':'Marcado ✓');
  }

  function handleAnotar(){
    // não cria nota vazia — contextualiza o Assistente; a nota nasce quando houver conteúdo
    window._ccemCtxSessaoId = id;
    window._ccemAnotarIntent = true;
    showToast('Anote pelo Assistente · vai para o Caderno');
    go('#/assistente');
  }

  async function handleShare(){
    const texto = `${s.badge} — ${s.titulo}\n${s.dia} · ${s.inicio}–${s.fim} · Expoville, Joinville/SC\n\n#CCEM2026 #SBEMSC`;
    if (navigator.share) {
      try { await navigator.share({ title:s.titulo, text:texto, url:'https://ccem2026.com.br' }); }
      catch(e) {}
    } else {
      try { await navigator.clipboard.writeText(texto); showToast('Copiado ✓'); }
      catch(e) { showToast('Compartilhar: '+s.badge); }
    }
  }

  function handleAskAI(){
    window._ccemCtxSessaoId = id;
    showToast('Assistente contextualizado → '+s.badge);
    go('#/assistente');
  }

  const navBtn=(on)=>({width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',
    border:`1px solid rgba(255,255,255,${on?0.3:0.12})`,background:on?'rgba(255,255,255,.14)':'transparent',
    borderRadius:9,cursor:on?'pointer':'default',opacity:on?1:0.28,padding:0});

  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column',overflow:'hidden',background:C.papel}}>
      {/* Top bar */}
      <div style={{background:C.azul,color:'#fff',flexShrink:0,boxShadow:'0 2px 12px rgba(10,18,50,.3)'}}>
        <div style={{height:52,display:'flex',alignItems:'center',gap:8,padding:'0 8px'}}>
          <button onClick={()=>window.history.back()} style={BACK_BTN}><IcoArrowL size={20} color="#fff"/></button>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:700,lineHeight:1.2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{s.titulo}</div>
            <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,opacity:.75,marginTop:1}}>{s.inicio}–{s.fim} · {s.dur}</div>
          </div>
          <div style={{display:'flex',gap:4,flexShrink:0}}>
            <button onClick={handleShare} title="Compartilhar" style={navBtn(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
            <button onClick={()=>prevId&&go('#/sessao/'+prevId)} style={navBtn(!!prevId)}><IcoChevL size={18} color="#fff"/></button>
            <button onClick={()=>nextId&&go('#/sessao/'+nextId)} style={navBtn(!!nextId)}><IcoChevR size={18} color="#fff"/></button>
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
            {s.starred&&<span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.ouro,letterSpacing:'0.06em',textTransform:'uppercase',padding:'2px 7px',background:C.ouroBg,borderRadius:10}}>Destaque</span>}
            {isPast&&<span style={{marginLeft:'auto',fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza}}>
              {ctxOpen?'▾ recolher':'▸ contexto'}
            </span>}
          </div>
          {ctxOpen&&(
            <div style={{marginTop:9}}>
              <h2 style={{fontFamily:'Georgia,serif',fontSize:15.5,fontWeight:700,color:C.tinta,lineHeight:1.35,letterSpacing:'-0.01em',margin:'0 0 8px'}}>{s.titulo}</h2>
              <div style={{display:'flex',gap:8,alignItems:'center',fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza}}>
                <span style={{color:C.azulSoft,fontWeight:700}}>{s.inicio}</span>
                <span>→ {s.fim}</span>
                <span>· {s.dur} · {s.dia}</span>
              </div>
              {s.moderador&&(
                <div style={{marginTop:9,padding:'6px 10px',background:C.azulBg+'60',borderRadius:7,display:'flex',gap:8,alignItems:'center'}}>
                  <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.07em',flexShrink:0}}>Moderador</span>
                  <span style={{fontSize:12,color:C.tinta,fontWeight:500}}>{s.moderador}</span>
                </div>
              )}
            </div>
          )}
          {!ctxOpen&&isPast&&(
            <div style={{display:'flex',gap:8,alignItems:'center',fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,marginTop:6}}>
              <span style={{color:C.azulSoft,fontWeight:700}}>{s.inicio}–{s.fim}</span>
              {s.moderador&&<span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>mod. {s.moderador}</span>}
            </div>
          )}
        </div>

        {/* Falas */}
        {s.falas&&s.falas.length>0&&(
          <div style={{background:'#fff',borderRadius:14,padding:'12px 14px',border:`1px solid ${C.linhaSoft}`,marginBottom:10,boxShadow:'0 2px 10px rgba(29,62,138,.05)'}}>
            <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,textTransform:'uppercase',letterSpacing:'0.08em',color:C.cinza,marginBottom:10,fontWeight:600}}>Programa da sessão</div>
            {s.falas.map((f,i)=>{
              const bio = SPEAKER_BIOS[f.palestrante];
              return (
                <div key={i} style={{display:'flex',gap:10,padding:'8px 0',borderBottom:i<s.falas.length-1?`1px solid ${C.linhaSoft}`:'none'}}>
                  <div style={{width:22,height:22,borderRadius:7,background:bc+'1a',color:bc,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,fontWeight:700,flexShrink:0,marginTop:1}}>{f.n==='·'?'·':f.n}</div>
                  <div style={{flex:1,minWidth:0}}>
                    {f.titulo&&<div style={{fontSize:12.5,fontWeight:600,color:C.tinta,lineHeight:1.3,marginBottom:2}}>{f.titulo}</div>}
                    <div style={{fontSize:12,color:f.isMe?C.ouro:C.tinta,fontWeight:f.isMe?600:500}}>
                      {f.palestrante}{f.isMe&&' ★'}{f.aConfirmar&&<em style={{color:C.cinza,fontWeight:400}}> (a confirmar)</em>}
                    </div>
                    {bio&&<div style={{fontSize:11,color:C.cinza,marginTop:1}}>{bio.role}</div>}
                    {(f.label||f.isMe)&&<div style={{marginTop:3,display:'inline-block',background:C.ouroBg,color:C.ouro,fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,letterSpacing:'0.08em',textTransform:'uppercase',padding:'2px 7px',borderRadius:8}}>{f.label||'sua fala'}</div>}
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
          <button onClick={toggleMark} style={{flexShrink:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3,background:isMarked?C.ouroBg:'#fff',color:isMarked?C.ouro:C.cinza,border:`1px solid ${isMarked?C.ouro:C.linha}`,borderRadius:10,padding:'10px 14px',fontFamily:'DM Sans,sans-serif',fontSize:11,fontWeight:isMarked?700:500,cursor:'pointer'}}>
            <IcoStar size={16} color={isMarked?C.ouro:C.cinza} filled={isMarked}/>{isMarked?'Marcado':'Marcar'}
          </button>
        </div>

        {/* Assistente — ação terciária, peso reduzido */}
        <button onClick={handleAskAI} style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'9px 14px',background:'#f0f4fc',border:`1px solid ${C.linha}`,borderRadius:10,cursor:'pointer',marginBottom:14}}>
          <div style={{width:26,height:26,borderRadius:7,background:C.azul,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/><circle cx="9" cy="10" r="1" fill="#fff" stroke="none"/><circle cx="12" cy="10" r="1" fill="#fff" stroke="none"/><circle cx="15" cy="10" r="1" fill="#fff" stroke="none"/></svg>
          </div>
          <div style={{textAlign:'left',flex:1}}>
            <div style={{fontFamily:'DM Sans,sans-serif',fontSize:12,fontWeight:600,color:C.azul}}>Perguntar ao Assistente</div>
            <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,marginTop:1}}>contextualizado nesta sessão</div>
          </div>
          <IcoChevR size={15} color={C.cinza}/>
        </button>

        {/* Prev / Next */}
        <div style={{display:'flex',gap:8}}>
          {prevId&&SESSOES[prevId]&&(
            <button onClick={()=>go('#/sessao/'+prevId)} style={{flex:1,background:'#fff',border:`1px solid ${C.linha}`,borderRadius:10,padding:'9px 12px',textAlign:'left',cursor:'pointer',minWidth:0}}>
              <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:3}}>← Anterior</div>
              <div style={{fontSize:11,fontWeight:500,color:C.tinta,lineHeight:1.3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{SESSOES[prevId].titulo}</div>
            </button>
          )}
          {nextId&&SESSOES[nextId]&&(
            <button onClick={()=>go('#/sessao/'+nextId)} style={{flex:1,background:'#fff',border:`1px solid ${C.linha}`,borderRadius:10,padding:'9px 12px',textAlign:'right',cursor:'pointer',minWidth:0}}>
              <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:3}}>Próxima →</div>
              <div style={{fontSize:11,fontWeight:500,color:C.tinta,lineHeight:1.3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{SESSOES[nextId].titulo}</div>
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
  const [dia, setDia] = useState(()=>{ try{const s=sessionStorage.getItem('ccem_dia');if(s&&DIAS.includes(s))return s;}catch(e){} return ccemDiaDeHoje()||DIAS[0]; });
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState(null);
  const [soMarcados, setSoMarcados] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const listRef = useRef(null);

  useEffect(()=>{ try{sessionStorage.setItem('ccem_dia',dia);}catch(e){} },[dia]);
  useEffect(()=>{
    const el=listRef.current; if(!el) return;
    const key='ccem_scroll_'+dia;
    const saved=sessionStorage.getItem(key);
    if(saved) el.scrollTop=parseInt(saved)||0;
    return ()=>{ if(el) try{sessionStorage.setItem(key,String(el.scrollTop));}catch(e){} };
  },[dia]);

  const buscaNorm = useMemo(()=>norm(busca),[busca]);
  const items = useMemo(()=>{
    return (PROGRAMA[dia]||[]).filter(item=>{
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
  },[dia,buscaNorm,filtroTipo,soMarcados,appState.marks]);

  const totalSessoes=(PROGRAMA[dia]||[]).filter(i=>i.tipo==='sessao'&&SESSOES[i.id]?.navegavel).length;
  const markedCount=(PROGRAMA[dia]||[]).filter(i=>i.tipo==='sessao'&&appState.marks?.[i.id]).length;
  const hasFilter = !!(filtroTipo||soMarcados);

  const chipSt=(active,bg)=>({display:'inline-flex',alignItems:'center',justifyContent:'center',background:active?bg:'#fff',color:active?'#fff':C.cinza,fontFamily:'DM Sans,sans-serif',fontSize:12,fontWeight:active?600:500,padding:'7px 14px',borderRadius:20,border:`1px solid ${active?bg:C.linha}`,cursor:'pointer',whiteSpace:'nowrap',gap:4});

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden'}}>
      {/* Day tabs + filter trigger */}
      <div style={{display:'flex',alignItems:'center',gap:8,padding:'9px 12px 7px',borderBottom:`1px solid ${C.linha}`,background:'#fff',flexShrink:0}}>
        <div style={{display:'flex',background:'#f0f4fc',borderRadius:10,padding:3,gap:2,flex:1}}>
          {DIAS.map(d=>(
            <button key={d} onClick={()=>setDia(d)} style={{flex:1,padding:'6px 0',border:'none',borderRadius:8,fontFamily:'DM Sans,sans-serif',fontWeight:700,cursor:'pointer',background:dia===d?C.azul:'transparent',color:dia===d?'#fff':C.cinza,transition:'all .15s'}}>
              <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:16,lineHeight:1,display:'block'}}>{d.includes('23')?'23':'24'}</span>
              <span style={{fontSize:11,letterSpacing:'0.08em',textTransform:'uppercase'}}>{d.includes('sex')?'SEX':'SÁB'}</span>
            </button>
          ))}
        </div>
        <div style={{display:'flex',gap:6,flexShrink:0,alignItems:'center'}}>
          <div style={{textAlign:'right'}}>
            <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.05em'}}>{totalSessoes} sessões</div>
            {markedCount>0&&<div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.azulSoft,marginTop:1}}>{markedCount} marcadas</div>}
          </div>
          <button onClick={()=>setFilterOpen(true)} style={{position:'relative',width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',background:'#fff',border:`1px solid ${hasFilter?C.azul:C.linha}`,borderRadius:10,cursor:'pointer',flexShrink:0,color:hasFilter?C.azul:C.cinza}}>
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
            placeholder="Buscar sessão, palestrante ou tema…"
            style={{width:'100%',padding:'7px 30px 7px 30px',border:`1px solid ${C.linha}`,borderRadius:8,fontFamily:'DM Sans,sans-serif',fontSize:12,color:C.tinta,background:'#f8fafd',outline:'none',boxSizing:'border-box'}}/>
          {busca&&<button onClick={()=>setBusca('')} style={{position:'absolute',right:8,background:'none',border:'none',cursor:'pointer',color:C.cinza,display:'flex',padding:0}}><IcoX size={14}/></button>}
        </div>
      </div>

      <DayTimeline dia={dia}/>

      {/* Filtros ativos — resumo compacto */}
      {hasFilter&&(
        <div style={{display:'flex',gap:5,padding:'5px 12px',background:'#f0f4fc',borderBottom:`1px solid ${C.linhaSoft}`,flexShrink:0,overflowX:'auto',scrollbarWidth:'none',alignItems:'center'}}>
          {filtroTipo&&<span style={{...chipSt(true,C.azul),fontSize:11,padding:'3px 10px'}}>{filtroTipo==='simposio'?'Simpósio':filtroTipo==='mini'?'Mini':'Satélite'}</span>}
          {soMarcados&&<span style={{...chipSt(true,C.ouro),fontSize:11,padding:'3px 10px'}}>★ Marcados</span>}
          <button onClick={()=>{setFiltroTipo(null);setSoMarcados(false);}} style={{border:'none',background:'none',color:C.cinza,fontSize:11,cursor:'pointer',fontFamily:'inherit',padding:'3px 6px',flexShrink:0}}>Limpar ×</button>
        </div>
      )}

      {/* Lista */}
      <div ref={listRef} style={{flex:1,overflowY:'auto',paddingBottom:16}}>
        {items.length===0?(
          <div style={{textAlign:'center',padding:'40px 20px',color:C.cinza}}>
            <div style={{fontSize:28,marginBottom:10}}>○</div>
            <div style={{fontSize:13,marginBottom:12}}>Nenhuma sessão encontrada</div>
            <button onClick={()=>{setBusca('');setFiltroTipo(null);setSoMarcados(false);}} style={{border:`1px solid ${C.linha}`,background:'#fff',color:C.azul,padding:'7px 16px',borderRadius:8,cursor:'pointer',fontFamily:'inherit',fontSize:12}}>Limpar filtros</button>
          </div>
        ):items.map((item,i)=>item.tipo==='intervalo'?<IntervalRow key={i} item={item}/>:<SessaoCard key={item.id} id={item.id}/>)}
        {items.length>0&&<div style={{padding:'12px 16px',fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,textAlign:'center',letterSpacing:'0.04em'}}>★ destaque editorial · toque para abrir a sessão</div>}
      </div>

      {/* Filter bottom-sheet */}
      {filterOpen&&(
        <div style={{position:'fixed',inset:0,zIndex:200,display:'flex',flexDirection:'column',justifyContent:'flex-end',background:'rgba(0,0,0,.38)'}}
          onClick={()=>setFilterOpen(false)}>
          <div style={{background:'#fff',borderRadius:'18px 18px 0 0',padding:'20px 18px 36px',maxWidth:440,width:'100%',margin:'0 auto',boxShadow:'0 -4px 32px rgba(10,18,50,.18)'}}
            onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
              <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,textTransform:'uppercase',letterSpacing:'0.1em',color:C.cinza,fontWeight:600}}>Filtrar sessões</span>
              <button onClick={()=>setFilterOpen(false)} style={{background:'none',border:'none',fontSize:22,color:C.cinza,cursor:'pointer',lineHeight:1,padding:'0 4px'}}>×</button>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:9}}>Tipo de sessão</div>
              <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
                {[['simposio','Simpósio'],['mini','Mini-Conferência'],['satelite','Satélite']].map(([t,lbl])=>(
                  <button key={t} onClick={()=>setFiltroTipo(filtroTipo===t?null:t)} style={chipSt(filtroTipo===t,C.azul)}>{lbl}</button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <button onClick={()=>setSoMarcados(v=>!v)}
                style={{...chipSt(soMarcados,C.ouro),width:'100%',justifyContent:'center'}}>
                ★ Mostrar apenas marcados
              </button>
            </div>
            {hasFilter&&(
              <button onClick={()=>{setFiltroTipo(null);setSoMarcados(false);}}
                style={{width:'100%',border:`1px solid ${C.linha}`,background:'#fff',color:C.cinza,borderRadius:8,padding:'9px',fontSize:12,fontWeight:500,cursor:'pointer',fontFamily:'inherit',marginBottom:8}}>
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

/* ── TrabalhosScreen ─────────────────────────────────────────
   WORK_CATS e WORKS agora vivem em ccem-data.js (junto do
   programa oficial) — substituir lá pelos trabalhos reais.    */

function TrabalhosScreen() {
  const [cat, setCat] = useState('all');
  const [selected, setSelected] = useState(null);
  const filtered = cat==='all' ? WORKS : WORKS.filter(w=>w.cat===cat);
  const counts = {}; WORKS.forEach(w=>{counts[w.cat]=(counts[w.cat]||0)+1;});
  const [votes, setVotes] = useState({});

  if(selected){
    const w=WORKS.find(x=>x.id===selected);
    if(!w) return null;
    return (
      <div style={{height:'100%',display:'flex',flexDirection:'column',overflow:'hidden',background:C.papel}}>
        <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',background:'#fff',borderBottom:`1px solid ${C.linha}`,flexShrink:0}}>
          <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',cursor:'pointer',color:C.azul,display:'flex',alignItems:'center',gap:4,fontFamily:'DM Sans,sans-serif',fontSize:12,padding:0}}>
            <IcoArrowL size={16} color={C.azul}/> Voltar
          </button>
          <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,marginLeft:'auto'}}>{w.id}</span>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:'14px 14px 28px'}}>
          <div style={{display:'flex',gap:6,marginBottom:8,flexWrap:'wrap'}}>
            <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,background:C.cinzaClr,padding:'2px 8px',borderRadius:10,textTransform:'uppercase',letterSpacing:'0.06em'}}>{WORK_CATS.find(c=>c.id===w.cat)?.label||w.cat}</span>
            <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.ouro,textTransform:'uppercase',letterSpacing:'0.06em'}}>{w.type}</span>
          </div>
          <h2 style={{fontFamily:'Georgia,serif',fontSize:16,fontWeight:600,color:C.tinta,lineHeight:1.3,margin:'0 0 8px'}}>{w.title}</h2>
          <div style={{padding:'10px 12px',background:C.ouroBg+'60',borderLeft:`3px solid ${C.ouro}`,borderRadius:'0 6px 6px 0',fontSize:13,fontStyle:'italic',color:C.tinta,lineHeight:1.5,marginBottom:12}}>"{w.message}"</div>
          <div style={{fontSize:12,color:C.cinza,marginBottom:12}}>{w.authors}</div>
          {w.audio&&(
            <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'#f5f8fd',borderRadius:10,border:`1px dashed ${C.linha}`,marginBottom:12}}>
              <div style={{width:34,height:34,borderRadius:'50%',background:C.cinzaClr,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <svg width='13' height='13' viewBox='0 0 24 24' fill={C.cinza}><path d='M8 5v14l11-7z'/></svg>
              </div>
              <div>
                <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.06em'}}>Áudio do autor</div>
                <div style={{fontSize:12.5,color:C.cinza,marginTop:1}}>disponível na versão com os trabalhos reais</div>
              </div>
            </div>
          )}
          <div style={{display:'flex',gap:8,marginTop:4}}>
            <button onClick={()=>setVotes(v=>({...v,[w.id]:!v[w.id]}))} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:5,padding:'10px',border:`1px solid ${votes[w.id]?C.ouro:C.linha}`,background:votes[w.id]?C.ouroBg:'#fff',color:votes[w.id]?C.ouro:C.cinza,borderRadius:9,cursor:'pointer',fontFamily:'DM Sans,sans-serif',fontSize:12,fontWeight:votes[w.id]?600:400}}>
              ★ {w.votes+(votes[w.id]?1:0)} votos
            </button>
            <button onClick={()=>showToast('Pergunta enviada ao autor')} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:5,padding:'10px',border:'none',background:C.azul,color:'#fff',borderRadius:9,cursor:'pointer',fontFamily:'DM Sans,sans-serif',fontSize:12,fontWeight:600}}>
              <IcoChat size={14} color='#fff'/> Perguntar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <div style={{padding:'12px 14px 6px',background:'#fff',borderBottom:`1px solid ${C.linha}`,flexShrink:0}}>
        <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',gap:8}}>
          <h2 style={{fontFamily:'Georgia,serif',fontSize:17,fontWeight:700,color:C.tinta,margin:0}}>Trabalhos</h2>
          <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.05em'}}>{filtered.length} de {WORKS.length}</span>
        </div>
        <div style={{display:'flex',padding:'8px 0 2px',gap:5,overflowX:'auto',scrollbarWidth:'none'}}>
          {WORK_CATS.map(c=>{
            const n=c.id==='all'?WORKS.length:(counts[c.id]||0); if(c.id!=='all'&&n===0) return null;
            return <button key={c.id} onClick={()=>setCat(c.id)} style={{flexShrink:0,border:`1px solid ${cat===c.id?C.azul:C.linha}`,background:cat===c.id?C.azul:'#fff',color:cat===c.id?'#fff':C.cinza,borderRadius:16,padding:'4px 11px',fontSize:11.5,fontFamily:'inherit',cursor:'pointer',whiteSpace:'nowrap'}}>{c.label} <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11}}>{n}</span></button>;
          })}
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'8px 12px 20px'}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:6,padding:'8px 10px',background:C.ouroBg+'50',borderRadius:8,marginBottom:8,border:`1px solid ${C.ouroBg}`}}>
          <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke={C.ouro} strokeWidth='2' strokeLinecap='round' style={{flexShrink:0,marginTop:1}}><circle cx='12' cy='12' r='10'/><path d='M12 8v4M12 16h.01'/></svg>
          <span style={{fontSize:11,color:'#92400e',lineHeight:1.4}}>Demonstração de conceito — trabalhos fictícios para validação com a Comissão Científica.</span>
        </div>
        {filtered.map(w=>(
          <div key={w.id} onClick={()=>setSelected(w.id)}
            role="button" tabIndex={0} aria-label={w.title}
            onKeyDown={e=>(e.key==='Enter'||e.key===' ')&&setSelected(w.id)}
            style={{background:'#fff',borderRadius:10,padding:'11px 12px',marginBottom:7,border:`1px solid ${C.linhaSoft}`,cursor:'pointer',transition:'transform .12s'}}
            onMouseOver={e=>e.currentTarget.style.transform='translateY(-1px)'} onMouseOut={e=>e.currentTarget.style.transform=''}>
            <div style={{display:'flex',gap:6,marginBottom:5,alignItems:'center'}}>
              <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,background:C.cinzaClr,padding:'2px 7px',borderRadius:8,textTransform:'uppercase',letterSpacing:'0.06em'}}>{w.type}</span>
              <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,marginLeft:'auto'}}>{w.id}</span>
            </div>
            <div style={{fontSize:13,fontWeight:600,color:C.tinta,lineHeight:1.3,marginBottom:4}}>{w.title}</div>
            <div style={{fontSize:11.5,color:C.cinza,fontStyle:'italic',lineHeight:1.4,marginBottom:6,paddingLeft:8,borderLeft:`2px solid ${C.ouro}`}}>{w.message}</div>
            <div style={{display:'flex',gap:8,fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,alignItems:'center'}}>
              {w.audio&&<span style={{color:C.verde}}>▶ áudio</span>}
              <span>★ {w.votes}</span>
              <span>{w.qa} perg.</span>
              <IcoChevR size={12} color={C.cinza} style={{marginLeft:'auto'}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Mock AI (fallback quando window.claude não disponível) ── */
function classifyIntent(text) {
  const t = norm(text);
  if (t.includes('slide') || t.includes('foto') || t.includes('imagem') || t.includes('tira') || t.includes('fotograf')) return 'anotacao';
  if (t.includes('sess') || t.includes('busca') || t.includes('trabalh') || t.includes('lp(a)') || t.includes('semag') || t.includes('compar') || t.includes('disse') || t.includes('falar')) return 'busca';
  if (t.includes('export') || t.includes('onde') || t.includes('horas') || t.includes('sala') || t.includes('funciona') || t.includes('submiss') || t.includes('como')) return 'concierge';
  return 'free';
}
const MOCK_AI = {
  anotacao: [{tag:'Anotação',html:'Envie uma <strong>foto do slide</strong> (botão 📷) ou descreva aqui o conteúdo em texto.<br><br>Vou estruturar em: <em>mensagem principal</em>, pontos de suporte e referência bibliográfica quando visível no slide.',actions:['Qual a referência?','Estruturar como nota']}],
  busca: [{tag:'Busca · Programa e Trabalhos',html:'<strong>Sessões relacionadas:</strong> Simpósio 1 — DM2, Simpósio 10 — Obesidade, Mini · IA no consultório.<br><br><strong>Trabalhos:</strong> P-001 (semaglutida 24m), P-002 (tirzepatida coorte real), P-005 (TSH supressivo).<br><br><em style="font-size:11px;color:#5b6577">Refine a busca para mais precisão.</em>',actions:['Ver Simpósio 1','Ver trabalhos diabetes']}],
  concierge: [{tag:'Info prática',html:'Para <strong>exportar o caderno</strong>: aba Caderno → botão PDF no rodapé.<br><br>Todos os dados ficam salvos neste dispositivo, associados ao seu ID local. O PDF inclui todas as notas com hora e sessão de origem.',actions:['Como funciona a submissão?','Onde fica a sala?']}],
  free: [{tag:'Assistente CCEM',html:'Pronto para ajudar. Três formas de usar:<br><br>📸 <strong>Foto ou descrição de slide</strong> → nota estruturada com take-home e referência<br>🔍 <strong>Busca semântica</strong> — "que sessões falam de Lp(a)?", "trabalhos com semaglutida?"<br>💬 <strong>Dúvidas práticas</strong> — horários, salas, exportação do caderno<br><br><em style="font-size:11px;color:#5b6577">Não forneço orientação clínica para casos de pacientes.</em>'}],
};

/* ── AssistenteScreen ──────────────────────────────────────── */
const CCEM_SISTEMA = 'Você é o assistente científico do Meu CCEM 2026 — Congresso Catarinense de Endocrinologia e Metabologia, Joinville/SC, 23–24 out 2026. Funções: (1) estruturar anotações de slides/áudio em notas clínicas editáveis, (2) busca semântica no programa e trabalhos, (3) concierge para dúvidas práticas do evento. Responda em português brasileiro, tom clínico direto. Máximo 200 palavras. NÃO forneça orientação clínica para casos reais de pacientes — se solicitado, decline educadamente.';

function ccemBuildCtx(sessaoId) {
  const s = SESSOES[sessaoId];
  if (!s) return '';
  const falas = (s.falas||[]).map(f=>`${f.n}. ${f.titulo||f.palestrante}${f.titulo?' — '+f.palestrante:''}`).join(' | ');
  return `Sessão: ${s.badge} — ${s.titulo} (${s.inicio}–${s.fim}, ${s.dia}). ${s.moderador?'Mod.: '+s.moderador+'. ':''}Falas: ${falas}. Temas: ${(s.temas||[]).join(', ')}.`;
}

function ccemMd2html(text) {
  return escapeHTML(text)
    .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.*?)\*/g,'<em>$1</em>')
    .replace(/\n\n/g,'<br><br>')
    .replace(/\n/g,'<br>');
}

function AssistenteScreen() {
  const [ctxId, setCtxId] = useState(()=>window._ccemCtxSessaoId||'');
  const ctxSessao = SESSOES[ctxId] || null;
  useEffect(()=>{
    if(window._ccemCtxSessaoId && window._ccemCtxSessaoId!==ctxId) setCtxId(window._ccemCtxSessaoId);
  },[]);

  const welcomeHtml = ()=>{
    const ctxLine = ctxSessao
      ? `Contextualizado em <strong>${ctxSessao.badge} — ${ctxSessao.titulo.slice(0,55)}${ctxSessao.titulo.length>55?'…':''}</strong>.<br><br>`
      : '';
    return `${ctxLine}Como posso ajudar?<br><br><span style="color:#5b6577;font-size:11.5px;line-height:1.8">📸 <strong>Foto de slide ou texto livre</strong> → nota estruturada com take-home<br>🔍 <strong>Busca</strong> — "sessões sobre Lp(a)?", "trabalhos com tirzepatida?"<br>💬 <strong>Dúvidas práticas</strong> — horários, salas, exportação do caderno</span>`;
  };

  const [msgs, setMsgs] = useState([{role:'ai',tag:'Início',ts:Date.now()-3600000,html:welcomeHtml()}]);
  const [text, setText] = useState(()=>{
    if(window._ccemAnotarIntent){ window._ccemAnotarIntent=false; return 'Anotar: '; }
    return '';
  });
  const [loading, setLoading] = useState(false);
  const endRef   = useRef(null);
  const photoRef = useRef(null);

  useEffect(()=>{
    if(endRef.current) endRef.current.parentNode.scrollTop = endRef.current.offsetTop;
  },[msgs.length,loading]);

  function sendMsg(){
    const v=text.trim(); if(!v) return;
    setText('');
    setMsgs(m=>[...m,{role:'user',ts:Date.now(),html:escapeHTML(v)}]);
    setLoading(true);
    setTimeout(()=>{
      const mock=(MOCK_AI[classifyIntent(v)]||MOCK_AI.free)[0];
      setMsgs(m=>[...m,{role:'ai',...mock,ts:Date.now()}]);
      setLoading(false);
    }, 800+Math.random()*500);
  }

  function handlePhoto(file){
    if(!file) return;
    const reader=new FileReader();
    reader.onload=async ev=>{
      setMsgs(m=>[...m,{role:'user',ts:Date.now(),html:`<img src="${ev.target.result}" style="max-width:180px;border-radius:8px;display:block;margin-bottom:4px"/><span style="font-size:11px;opacity:.85">slide enviado</span>`}]);
      setLoading(true);
      try {
        const ctx = ccemBuildCtx(ctxId);
        const prompt = CCEM_SISTEMA + (ctx?'\n\nContexto: '+ctx:'') + '\n\nO médico enviou uma foto de slide. Peça uma descrição breve do conteúdo (2–3 frases) para que você possa estruturá-lo em nota.';
        const resp = await window.claude.complete({ messages:[{role:'user',content:prompt}] });
        setMsgs(m=>[...m,{role:'ai',ts:Date.now(),tag:'Slide recebido',html:ccemMd2html(resp),actions:['Descrever o slide','Qual o ponto central?']}]);
      } catch(e) {
        setMsgs(m=>[...m,{role:'ai',ts:Date.now(),tag:'Slide recebido',html:'Descreva o conteúdo do slide para que eu possa estruturá-lo em nota clínica.',actions:['Descrever o slide']}]);
      }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  }

  async function actionClick(a){
    const v=a.toLowerCase();
    setLoading(true);
    try {
      const ctx = ccemBuildCtx(ctxId);
      let instrucao = '';
      if(v.includes('take')||v.includes('take-home')) instrucao='Liste exatamente 3 take-homes clínicos desta sessão, numerados, direto ao ponto.';
      else if(v.includes('resum')) instrucao='Resuma esta sessão em até 150 palavras, destacando consensos e tensões clínicas entre as falas.';
      else if(v.includes('compar')) instrucao='Compare as abordagens das diferentes falas: pontos de convergência e de tensão clínica.';
      else if(v.includes('salvar')||v.includes('caderno')||v.includes('nota')) instrucao='Gere uma nota estruturada de 3 bullet points dos pontos mais importantes desta sessão, pronta para salvar.';
      else instrucao='Responda de forma útil sobre: '+a;

      const prompt = CCEM_SISTEMA + '\n\nContexto: '+(ctx||'Congresso geral') + '\n\n' + instrucao;
      const resp = await window.claude.complete({ messages:[{role:'user',content:prompt}] });
      const html = ccemMd2html(resp);
      setMsgs(m=>[...m,{role:'ai',ts:Date.now(),tag:a,html,actions:['Salvar no caderno']}]);

      if(v.includes('salvar')||v.includes('caderno')){
        const s=SESSOES[ctxId];
        updateAppState(st=>{
          if(!st.captures) st.captures=[];
          st.captures.unshift({id:'c_'+Date.now().toString(36),dia:s?.dia||DIAS[0],time:nowStamp(),sessaoId:ctxId,sessaoRef:(s?.badge||'Sessão')+' · assistente',type:'texto',title:'IA: '+a.slice(0,40),body:html.slice(0,600),tags:s?.temas||[],ts:Date.now()});
        });
        showToast('Salvo no caderno ✓');
      }
    } catch(e) {
      setMsgs(m=>[...m,{role:'ai',ts:Date.now(),tag:'Erro',html:'Não foi possível processar. Tente novamente.'}]);
    }
    setLoading(false);
  }

  const msgStyle=(role)=>({maxWidth:'86%',background:role==='ai'?'#fff':C.azul,color:role==='ai'?C.tinta:'#fff',borderRadius:role==='ai'?'14px 14px 14px 4px':'14px 14px 4px 14px',padding:'10px 12px',fontSize:12.5,lineHeight:1.55,border:role==='ai'?`1px solid ${C.linhaSoft}`:'none',boxShadow:role==='ai'?'0 1px 6px rgba(29,62,138,.06)':'none'});
  const COMP_BTN = {width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',border:`1px solid ${C.linha}`,background:'#f8fafd',borderRadius:10,cursor:'pointer',flexShrink:0,padding:0};

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden',background:'#f3f6fc'}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'9px 14px 7px',background:'#fff',borderBottom:`1px solid ${C.linhaSoft}`,flexShrink:0}}>
        <div style={{width:32,height:32,borderRadius:10,background:C.azul,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Georgia,serif',fontSize:14,fontWeight:700,flexShrink:0}}>C</div>
        <div>
          <div style={{fontSize:12.5,fontWeight:700,color:C.tinta}}>Assistente CCEM</div>
          <div style={{fontSize:11,color:C.cinza,display:'flex',alignItems:'center',gap:4}}>
            <span style={{width:5,height:5,borderRadius:'50%',background:'#22c55e',display:'inline-block',flexShrink:0}}/>
            {ctxSessao ? ctxSessao.badge+' · '+ctxSessao.inicio : 'CCEM 2026 · anotações e busca'}
          </div>
        </div>
      </div>

      {/* Boas-vindas ou chat */}
      {!msgs.some(m=>m.role==='user') ? (
        <div style={{flex:1,overflowY:'auto',padding:'18px 14px 10px'}}>
          {/* Saudação */}
          <div style={{marginBottom:18}}>
            <div style={{fontSize:16,fontWeight:700,color:C.tinta,marginBottom:ctxSessao?5:0,letterSpacing:'-0.01em'}}>Como posso ajudar?</div>
            {ctxSessao&&<div style={{fontSize:11.5,color:C.cinza}}>Contextualizado em <strong style={{color:C.azulSoft}}>{ctxSessao.badge} — {ctxSessao.titulo.slice(0,45)}{ctxSessao.titulo.length>45?'…':''}</strong></div>}
          </div>
          {/* Três funções */}
          {[
            {ico:'📸',title:'Auxiliar de Anotação',desc:'Foto de slide, áudio ou texto livre → nota estruturada com take-home e referência bibliográfica quando visível.',prompt:'Quero anotar um slide desta sessão',ord:'1'},
            {ico:'🔍',title:'Busca Semântica',desc:'Programa e trabalhos em linguagem natural: sessões, palestrantes, temas, comparações entre falas.',prompt:'Que sessões falam de Lp(a)?',ord:'2'},
            {ico:'💬',title:'Concierge',desc:'Dúvidas práticas sobre horários, salas, exportação do caderno e submissão de trabalhos.',prompt:'Como exporto minhas notas?',ord:'3'},
          ].map((f,i)=>(
            <div key={i} onClick={()=>setText(f.prompt)}
              role="button" tabIndex={0} aria-label={f.title}
              onKeyDown={e=>(e.key==='Enter'||e.key===' ')&&setText(f.prompt)}
              style={{background:'#fff',border:`1px solid ${C.linhaSoft}`,borderRadius:12,padding:'13px 14px',marginBottom:8,cursor:'pointer',display:'flex',gap:12,alignItems:'flex-start',transition:'all .13s',position:'relative'}}
              onMouseOver={e=>{e.currentTarget.style.borderColor=C.azul;e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='0 4px 14px rgba(29,62,138,.09)';}}
              onMouseOut={e=>{e.currentTarget.style.borderColor=C.linhaSoft;e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}>

              <span style={{fontSize:24,flexShrink:0,lineHeight:1.1,marginTop:1}}>{f.ico}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:3}}>
                  <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.08em'}}>{f.ord}</span>
                  <span style={{fontSize:13,fontWeight:700,color:C.tinta}}>{f.title}</span>
                </div>
                <div style={{fontSize:11.5,color:C.cinza,lineHeight:1.45,marginBottom:7}}>{f.desc}</div>
                <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.azulSoft,background:C.azulBg,padding:'2px 9px',borderRadius:8}}>ex: "{f.prompt}"</span>
              </div>
              <IcoChevR size={14} color={C.cinza} style={{flexShrink:0,marginTop:4}}/>
            </div>
          ))}
          <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,marginTop:8,padding:'8px 12px',background:'#f0f4fc',borderRadius:8,lineHeight:1.65}}>
            Não forneço orientação clínica para casos de pacientes reais.
          </div>
        </div>
      ):(
        <div style={{flex:1,overflowY:'auto',padding:'12px 12px 0'}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{display:'flex',flexDirection:'column',alignItems:m.role==='ai'?'flex-start':'flex-end',marginBottom:10}}>
              <div style={msgStyle(m.role)}>
                {m.role==='ai'&&m.tag&&<div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.azulSoft,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>{m.tag}</div>}
                <div dangerouslySetInnerHTML={{__html:m.html}}/>
                {m.role==='ai'&&m.ref&&<div style={{marginTop:7,paddingTop:7,borderTop:`1px solid ${C.linhaSoft}`,fontSize:11,color:C.cinza}} dangerouslySetInnerHTML={{__html:m.ref}}/>}
                {m.role==='ai'&&m.actions&&(
                  <div style={{display:'flex',gap:5,flexWrap:'wrap',marginTop:8}}>
                    {m.actions.map((a,j)=><button key={j} onClick={()=>actionClick(a)} style={{border:`1px solid ${C.linha}`,background:'#f8fafd',color:C.azul,borderRadius:7,padding:'4px 10px',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{a}</button>)}
                  </div>
                )}
              </div>
              <div style={{fontSize:11,color:C.cinza,marginTop:3,fontFamily:'DM Sans,system-ui,sans-serif'}}>{new Date(m.ts).getHours()}:{String(new Date(m.ts).getMinutes()).padStart(2,'0')}</div>
            </div>
          ))}
          {loading&&<div style={{display:'flex',gap:4,padding:'8px 12px',background:'#fff',borderRadius:'14px 14px 14px 4px',width:60,border:`1px solid ${C.linhaSoft}`,marginBottom:10}}>{[0,1,2].map(i=><span key={i} style={{width:7,height:7,borderRadius:'50%',background:C.cinza,display:'inline-block',animation:`ccem-bounce .9s ${i*.2}s ease-in-out infinite`}}/>)}</div>}
          <div ref={endRef}/>
        </div>
      )}

      {/* Composer — limpo, sem chips pré-prontos */}
      <div style={{display:'flex',alignItems:'center',gap:7,padding:'8px 10px 14px',background:'#fff',borderTop:`1px solid ${C.linhaSoft}`,flexShrink:0}}>
        <input type="file" accept="image/*" capture="environment" ref={photoRef} style={{display:'none'}}
          onChange={e=>{handlePhoto(e.target.files&&e.target.files[0]);e.target.value='';}}/>
        <button onClick={()=>photoRef.current&&photoRef.current.click()} style={COMP_BTN} title="Foto de slide">
          <IcoCam size={18} color={C.cinza}/>
        </button>
        <button onClick={()=>showToast('Gravação de áudio — em breve')} style={COMP_BTN} title="Áudio de fala">
          <IcoMic size={18} color={C.cinza}/>
        </button>
        <input value={text} onChange={e=>setText(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&sendMsg()}
          placeholder="escreva uma observação ou pergunta…"
          style={{flex:1,padding:'8px 12px',border:`1px solid ${C.linha}`,borderRadius:24,fontFamily:'DM Sans,sans-serif',fontSize:12.5,color:C.tinta,background:'#f8fafd',outline:'none'}}/>
        <button onClick={sendMsg} style={{...COMP_BTN,background:C.azul,border:'none'}}><IcoSend size={16} color="#fff"/></button>
      </div>
    </div>
  );
}

/* ── CadernoScreen ──────────────────────────────────────────── */
function CadernoScreen() {
  const appState = useAppState();
  const [filtro, setFiltro] = useState('all');
  const captures = appState.captures || [];
  const filtered = filtro==='all' ? captures : captures.filter(c=>c.type===filtro);
  const counts = { all:captures.length, foto:captures.filter(c=>c.type==='foto').length, audio:captures.filter(c=>c.type==='audio').length, texto:captures.filter(c=>c.type==='texto').length };
  const sessoes  = new Set(captures.map(c=>c.sessaoId)).size;
  const refs     = captures.reduce((acc,c)=>acc+(c.body&&(c.body.match(/NEJM|Lancet|JCEM|Diabetes|guideline|diretriz/gi)||[]).length),0);
  const isDia0 = c => c.dia===DIAS[0] || c.day==='sexta';
  const isDia1 = c => c.dia===DIAS[1] || c.day==='sabado';
  const bySex  = filtered.filter(isDia0).sort((a,b)=>b.ts-a.ts);
  const bySab  = filtered.filter(isDia1).sort((a,b)=>b.ts-a.ts);
  const bsOrph = filtered.filter(c=>!isDia0(c)&&!isDia1(c)).sort((a,b)=>b.ts-a.ts);

  function typeColor(t){ return t==='foto'?C.azul:t==='audio'?'#0d9488':C.ouro; }

  function exportPDF(){
    const w = window.open('', '_blank');
    if(!w){ showToast('Permita pop-ups para exportar o PDF'); return; }
    const esc = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;');
    const all = [...captures].sort((a,b)=>a.ts-b.ts);
    const rows = all.map(c=>`<div class="nota"><div class="meta">${esc(c.sessaoRef)} · ${esc(c.time)}${c.dia?' · '+esc(c.dia):''}</div><h3>${esc(c.title)}</h3><div class="body">${c.body||''}</div></div>`).join('');
    w.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><title>Meu Caderno · CCEM 2026</title><style>
      body{font-family:Georgia,serif;color:#1a2438;max-width:680px;margin:32px auto;padding:0 24px}
      h1{font-size:22px;margin:0 0 2px}
      .sub{font-size:12px;color:#4a5468;margin:0 0 24px;font-family:system-ui,sans-serif}
      .nota{border-top:1px solid #d5dff0;padding:14px 0;page-break-inside:avoid}
      .meta{font-size:11px;color:#4a5468;font-family:system-ui,sans-serif;margin-bottom:4px}
      h3{font-size:14px;margin:0 0 6px}
      .body{font-size:13px;line-height:1.55}
    </style></head><body><h1>Meu Caderno · CCEM 2026</h1><p class="sub">${all.length} nota${all.length!==1?'s':''} · exportado em ${new Date().toLocaleDateString('pt-BR')} · Meu CCEM</p>${rows}<script>window.print()<\/script></body></html>`);
    w.document.close();
  }

  function NoteCard({c}){
    return (
      <div style={{background:'#fff',borderRadius:10,padding:'10px 12px',marginBottom:6,border:`1px solid ${C.linhaSoft}`,borderLeft:`3px solid ${typeColor(c.type)}`}}>
        <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:5}}>
          <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:typeColor(c.type),textTransform:'uppercase',letterSpacing:'0.07em',fontWeight:600}}>{c.type}</span>
          <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.sessaoRef} · {c.time}</span>
        </div>
        <div style={{fontSize:12.5,fontWeight:600,color:C.tinta,marginBottom:4,lineHeight:1.3}}>{c.title}</div>
        <div style={{fontSize:11.5,color:C.cinza,lineHeight:1.5}} dangerouslySetInnerHTML={{__html:c.body}}/>
        {(c.tags||[]).length>0&&<div style={{display:'flex',gap:4,marginTop:6,flexWrap:'wrap'}}>{c.tags.map(t=><span key={t} style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.azulSoft,background:C.azulBg+'60',padding:'2px 7px',borderRadius:8}}>{t}</span>)}</div>}
      </div>
    );
  }

  const fchip=(key,lbl)=>(
    <button key={key} onClick={()=>setFiltro(key)} style={{display:'flex',alignItems:'center',gap:4,padding:'5px 12px',border:`1px solid ${filtro===key?C.azul:C.linha}`,borderRadius:20,background:filtro===key?C.azul:'#fff',color:filtro===key?'#fff':C.cinza,fontSize:11.5,fontWeight:filtro===key?600:400,cursor:'pointer',fontFamily:'inherit',flexShrink:0}}>
      {lbl}<span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,marginLeft:2}}>{counts[key]}</span>
    </button>
  );

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden'}}>
      <div style={{padding:'12px 16px 10px',background:'#fff',borderBottom:`1px solid ${C.linha}`,flexShrink:0}}>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:17,fontWeight:700,color:C.tinta,margin:'0 0 2px'}}>Meu caderno</h2>
        <p style={{fontSize:11,color:C.cinza,margin:'0 0 10px'}}>tudo que você anotou no CCEM 2026</p>
        <div style={{display:'flex',gap:8}}>
          {[['Notas',captures.length,C.azulBg,C.azul],['Sessões',sessoes,C.verdeBg,C.verde],['Refs',refs,C.ouroBg,C.ouro]].map(([lbl,num,bg,color])=>(
            <div key={lbl} style={{flex:1,background:bg,borderRadius:10,padding:'7px 10px',textAlign:'center'}}>
              <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:20,fontWeight:700,color,lineHeight:1}}>{num}</div>
              <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color,textTransform:'uppercase',letterSpacing:'0.06em',marginTop:2}}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:'flex',gap:5,padding:'7px 12px',background:'#f8fafd',borderBottom:`1px solid ${C.linhaSoft}`,overflowX:'auto',flexShrink:0,scrollbarWidth:'none'}}>
        {fchip('all','Tudo')}{fchip('foto','Fotos')}{fchip('audio','Áudios')}{fchip('texto','Textos')}
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'10px 12px'}}>
        {filtered.length===0?(
          <div style={{textAlign:'center',padding:'40px 20px',color:C.cinza}}>
            <div style={{fontSize:32,marginBottom:10}}>○</div>
            <h4 style={{fontSize:14,fontWeight:600,color:C.tinta,marginBottom:6}}>Caderno vazio</h4>
            <p style={{fontSize:12,lineHeight:1.5,margin:0}}>Toque em <strong>Anotar</strong> numa sessão, ou envie algo pelo Assistente.</p>
          </div>
        ):(
          <>
            {bySex.length>0&&<><div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.08em',margin:'2px 0 8px',fontWeight:600}}>Sexta · 23 outubro</div>{bySex.map(c=><NoteCard key={c.id} c={c}/>)}</>}
            {bySab.length>0&&<><div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.08em',margin:'12px 0 8px',fontWeight:600}}>Sábado · 24 outubro</div>{bySab.map(c=><NoteCard key={c.id} c={c}/>)}</>}
            {bsOrph.length>0&&bsOrph.map(c=><NoteCard key={c.id} c={c}/>)}
          </>
        )}
      </div>
      {captures.length>0&&(
        <div style={{padding:'9px 12px',background:'#fff',borderTop:`1px solid ${C.linha}`,display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
          <p style={{flex:1,fontSize:11,color:C.cinza,lineHeight:1.4,margin:0}}><strong>Salvo neste dispositivo</strong> · {captures.length} nota{captures.length!==1?'s':''}</p>
          <button onClick={exportPDF} style={{display:'flex',alignItems:'center',gap:5,background:C.azul,color:'#fff',border:'none',borderRadius:8,padding:'7px 14px',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>↓ PDF</button>
        </div>
      )}
    </div>
  );
}

/* ── InfoScreen — página única ──────────────────────────────── */
function InfoScreen() {
  const IC = ({children,style})=><div style={{background:'#fff',borderRadius:12,padding:'13px 14px',margin:'10px 14px 0',border:`1px solid ${C.linhaSoft}`,boxShadow:'0 1px 5px rgba(29,62,138,.04)',...(style||{})}}>{children}</div>;
  const H3 = ({children})=><h3 style={{fontFamily:'Georgia,serif',fontSize:13.5,fontWeight:600,color:C.tinta,margin:'0 0 8px',letterSpacing:'-0.005em'}}>{children}</h3>;
  const Row = ({lbl,val})=><div style={{display:'flex',gap:8,fontSize:12.5,color:C.cinza,padding:'6px 0',borderBottom:`1px solid ${C.linhaSoft}`}}><div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.08em',width:72,flexShrink:0,lineHeight:1.6}}>{lbl}</div><div style={{flex:1,color:C.tinta}}>{val}</div></div>;
  const CR = ({icon,lbl,val,href})=><div style={{display:'flex',alignItems:'center',gap:11,padding:'9px 0',borderBottom:`1px solid ${C.linhaSoft}`}}>
    <div style={{width:34,height:34,borderRadius:9,background:C.azulBg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:C.azul}}>{icon}</div>
    <div><div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:2}}>{lbl}</div>
      <div style={{fontSize:13,fontWeight:500,color:C.tinta}}>{href?<a href={href} target="_blank" rel="noopener" style={{color:C.azul,textDecoration:'none'}}>{val}</a>:val}</div>
    </div>
  </div>;

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden'}}>
      <div style={{flex:1,overflowY:'auto',paddingBottom:24}}>

        {/* Identidade */}
        <div style={{background:C.azul,color:'#fff',padding:'20px 16px 18px'}}>
          <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,letterSpacing:'0.12em',textTransform:'uppercase',opacity:.75,marginBottom:4}}>SBEM-SC · Sociedade Brasileira de Endocrinologia e Metabologia</div>
          <h2 style={{fontFamily:'Georgia,serif',fontSize:21,fontWeight:600,margin:'0 0 3px',lineHeight:1.2,letterSpacing:'-0.01em'}}>12º CCEM 2026</h2>
          <p style={{fontSize:12,opacity:.8,lineHeight:1.4,margin:'0 0 10px'}}>Congresso Catarinense de Endocrinologia e Metabologia</p>
          <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,background:'rgba(255,255,255,.12)',padding:'7px 10px',borderRadius:6,letterSpacing:'0.02em',lineHeight:1.7}}>
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
            <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.08em',width:72,flexShrink:0,lineHeight:1.6}}>Cert.</div>
            <div style={{flex:1,color:C.tinta}}>Disponíveis a partir de <strong>05/11/2026</strong> via CPF — apenas para inscritos presentes.</div>
          </div>
        </IC>

        {/* Contato */}
        <IC>
          <H3>Contato</H3>
          <CR icon={<IcoPhone size={17}/>} lbl="WhatsApp" val="(47) 99130-3330" href="https://wa.me/5547991303330"/>
          <CR icon={<IcoMail size={17}/>}  lbl="E-mail"    val="contato@ccem2026.com.br" href="mailto:contato@ccem2026.com.br"/>
          <CR icon={<IcoInsta size={17}/>} lbl="Instagram" val="@sbemsceventos" href="https://instagram.com/sbemsceventos"/>
          <div style={{display:'flex',alignItems:'center',gap:11,padding:'9px 0'}}>
            <div style={{width:34,height:34,borderRadius:9,background:C.azulBg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:C.azul}}><IcoGlobe size={17}/></div>
            <div>
              <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:2}}>Site oficial</div>
              <a href="https://www.ccem2026.com.br" target="_blank" rel="noopener" style={{fontSize:13,fontWeight:600,color:C.azul,textDecoration:'none'}}>ccem2026.com.br ↗</a>
            </div>
          </div>
        </IC>

        {/* Sobre o app */}
        <IC>
          <H3>Sobre este app</H3>
          <p style={{fontSize:12.5,color:C.cinza,lineHeight:1.55,margin:'0 0 8px'}}>
            Camada interativa do CCEM 2026 para inscritos. Programa navegável, pôsteres digitais, assistente de IA para anotações e busca científica.
          </p>
          <p style={{fontSize:12,color:C.cinza,lineHeight:1.5,margin:'0 0 10px',padding:'8px 10px',background:'#f5f8fd',borderRadius:7,borderLeft:`3px solid ${C.linha}`}}>
            Dados armazenados localmente neste dispositivo. Nenhum dado pessoal é coletado ou transmitido.
          </p>
          <div style={{display:'flex',alignItems:'center',gap:8,padding:'7px 0',borderTop:`1px solid ${C.linhaSoft}`,marginBottom:10}}>
            <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.06em',flexShrink:0}}>ID local</span>
            <code style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.tinta,background:'#f0f4fc',padding:'2px 7px',borderRadius:5,flex:1,overflow:'hidden',textOverflow:'ellipsis'}}>{window.CCEM_USER_ID||'—'}</code>
          </div>
          <button onClick={()=>{if(confirm('Limpar todos os dados deste dispositivo?')){localStorage.removeItem(window.CCEM_STATE_KEY);localStorage.removeItem('ccem2026:userId');location.reload();}}}
            style={{width:'100%',border:'1px solid #e53e3e',background:'#fff',color:'#e53e3e',borderRadius:8,padding:'8px',fontSize:12.5,fontWeight:500,cursor:'pointer',fontFamily:'inherit'}}>
            Limpar todos os meus dados
          </button>
        </IC>

        {/* Rodapé */}
        <div style={{textAlign:'center',padding:'18px 16px 4px',fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,lineHeight:1.9}}>
          <div>Meu CCEM 2026 · v4.0</div>
          <div>versão em desenvolvimento · restrito à comissão</div>
          <div style={{marginTop:6}}>
            <a href="https://www.ccem2026.com.br" target="_blank" rel="noopener" style={{color:C.azul,textDecoration:'none',fontSize:11}}>ccem2026.com.br · site oficial do congresso ↗</a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── LiveStrip — visível apenas nos ±7 dias do congresso ──── */
function isEventWeek() {
  const now = new Date();
  const start = new Date(2026,9,16);  // 7 dias antes
  const end   = new Date(2026,9,31);  // 7 dias depois
  return now >= start && now <= end;
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
      <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:st.kind==='live'?C.azulSoft:C.cinza,textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:700,flexShrink:0}}>{st.tag}</span>
      <span style={{fontSize:11.5,color:C.tinta,fontWeight:500,flex:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{st.text}</span>
      <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,flexShrink:0}}>{st.time}</span>
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
            <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.ouro,letterSpacing:'0.08em'}}>2026</span>
          </div>
        </div>
        <div style={{textAlign:'right',flexShrink:0}}>
          <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,letterSpacing:'0.05em',textTransform:'uppercase'}}>23–24 OUT · Joinville/SC</div>
          <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.ouro,letterSpacing:'0.04em',marginTop:1}}>Expoville</div>
        </div>
      </div>
      <LiveStrip/>
    </div>
  );
}

/* ── TabBar — Programa · Trabalhos · Assistente · Caderno · Info */
function TabBar({ aba }){
  const tabs=[
    {id:'programa',   icon:<IcoCal size={21}/>,    lbl:'Programa'},
    {id:'trabalhos',  icon:<IcoPoster size={21}/>,  lbl:'Trabalhos'},
    {id:'assistente', icon:<IcoChat size={21}/>,    lbl:'Assistente'},
    {id:'caderno',    icon:<IcoBook size={21}/>,    lbl:'Caderno'},
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
            <span style={{fontFamily:'DM Sans,sans-serif',fontSize:11,fontWeight:on?600:400}}>{t.lbl}</span>
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
    {id:'trabalhos',  icon:<IcoPoster size={20}/>,  lbl:'Trabalhos'},
    {id:'assistente', icon:<IcoChat size={20}/>,    lbl:'Assistente'},
    {id:'caderno',    icon:<IcoBook size={20}/>,    lbl:'Caderno'},
    {id:'info',       icon:<IcoInfo size={20}/>,    lbl:'Info'},
  ];
  return (
    <div style={{width:220,background:'#fff',borderRight:`1px solid ${C.linha}`,display:'flex',flexDirection:'column',flexShrink:0,height:'100%',overflow:'hidden'}}>
      <div style={{padding:'22px 18px 14px',borderBottom:`1px solid ${C.linhaSoft}`}}>
        <button onClick={()=>go('#/')} style={{display:'flex',alignItems:'baseline',gap:6,marginBottom:5,background:'none',border:'none',cursor:'pointer',padding:0,textDecoration:'none'}}>
          <span style={{fontFamily:'Georgia,serif',fontWeight:700,fontSize:22,color:C.azul,letterSpacing:'-0.02em'}}>CCEM</span>
          <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.ouro,letterSpacing:'0.08em'}}>2026</span>
        </button>
        <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,letterSpacing:'0.04em',marginTop:2}}>23–24 out · Joinville/SC</div>
        <div style={{marginTop:10}}><LiveStrip/></div>
      </div>
      <nav style={{flex:1,padding:'10px 8px',overflowY:'auto'}}>
        {tabs.map(t=>{
          const on=aba===t.id||(aba==='sessao'&&t.id==='programa');
          return (
            <button key={t.id} onClick={()=>go('#/'+t.id)}
              style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'9px 12px',border:'none',background:on?C.azulBg:'none',color:on?C.azul:C.cinza,borderRadius:9,cursor:'pointer',fontFamily:'DM Sans,sans-serif',fontSize:13.5,fontWeight:on?700:400,marginBottom:2,transition:'all .15s',textAlign:'left'}}>
              <span style={{flexShrink:0,color:on?C.azul:C.cinza}}>{t.icon}</span>
              {t.lbl}
              {on&&<span style={{marginLeft:'auto',width:5,height:5,borderRadius:'50%',background:C.azul,flexShrink:0}}/>}
            </button>
          );
        })}
      </nav>
      <div style={{padding:'12px 16px',borderTop:`1px solid ${C.linhaSoft}`}}>
        <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:11,color:C.cinza,lineHeight:1.7}}>v4.0 · Meu CCEM<br/>versão em desenvolvimento · restrito à comissão</div>
      </div>
    </div>
  );
}

/* ── AppShell ────────────────────────────────────────────────── */
function AppShell({ showShell, aba, children }){
  const isDesktop = useIsDesktop();
  if (isDesktop) {
    return (
      <div style={{flex:1,display:'flex',overflow:'hidden',minHeight:0}}>
        <DesktopSidebar aba={aba}/>
        <div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column',alignItems:'center',minHeight:0,background:'#e8eef8'}}>
          <div style={{width:'100%',maxWidth:800,flex:1,overflow:'hidden',display:'flex',flexDirection:'column',minHeight:0,background:C.papel}}>
            {children}
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
          <div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column',minHeight:0}}>{children}</div>
          <TabBar aba={aba}/>
        </>
      ):children}
    </div>
  );
}

Object.assign(window, {
  AppShell, AppHeader, LiveStrip, TabBar, DesktopSidebar, useIsDesktop,
  DayTimeline, SlideDisplay, SlideUploadBtn,
  ProgramaScreen, SessaoDetail, AssistenteScreen, TrabalhosScreen, CadernoScreen, InfoScreen,
  BadgePill, TopicPill, IntervalRow, SessaoCard,
  sessionIsPast, isEventWeek, classifyIntent, MOCK_AI,
});
