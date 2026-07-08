/* ============================================================
   Meu CCEM 2026 — TELAS (React + Babel)
   Padrão: inline styles, globals via window de data.js / lib.jsx
   hooks React já declarados em ccem-lib.jsx — não redeclarar.
   ============================================================ */

/* ── helpers ────────────────────────────────────────────────── */
function badgeColor(tipo) {
  if (tipo==='simposio') return C.azul;
  if (tipo==='mini')     return '#0d9488';
  if (tipo==='satelite') return C.ouro;
  return '#64748b';
}
function norm(s){ return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); }

/* ── BadgePill ─────────────────────────────────────────────── */
const PILL = {display:'inline-flex',alignItems:'center',fontFamily:'JetBrains Mono,monospace',fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase',borderRadius:20,whiteSpace:'nowrap',lineHeight:1.6};
function BadgePill({ tipo, label, sm }) {
  const bg = badgeColor(tipo);
  return <span style={{...PILL,background:bg+'1a',color:bg,border:`1px solid ${bg}28`,fontSize:sm?8:9,padding:sm?'2px 7px':'3px 9px'}}>{label}</span>;
}
function TopicPill({ tema, active, onClick }) {
  const color = TEMAS_COR[tema] || C.cinza;
  return <span onClick={onClick} style={{...PILL,background:active?color:color+'18',color:active?'#fff':color,border:`1px solid ${color}${active?'':'28'}`,fontSize:9.5,cursor:onClick?'pointer':'default',padding:'3px 9px'}}>{tema}</span>;
}
function IntervalRow({ item }) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:10,padding:'6px 16px',background:'#f5f8fd',borderTop:`1px solid ${C.linhaSoft}`,borderBottom:`1px solid ${C.linhaSoft}`,margin:'2px 0'}}>
      <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:8.5,textTransform:'uppercase',letterSpacing:'0.08em',color:C.cinza,fontWeight:600}}>{item.label}</span>
      {item.dur&&<span style={{fontFamily:'JetBrains Mono,monospace',fontSize:8,color:C.cinza,opacity:.6,marginLeft:'auto'}}>{item.dur}</span>}
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
      style={{background:s.tipo==='satelite'?'#f8fafd':(s.isNow?'#eef6ff':'#fff'),
        borderLeft:s.tipo==='satelite'?`2px solid ${C.linha}`:`3px solid ${s.starred?C.ouro:(s.isNow?C.azulSoft:bc)}`,
        margin:s.tipo==='satelite'?'3px 16px':'5px 12px',borderRadius:8,
        padding:s.tipo==='satelite'?'7px 10px':'10px 12px',
        border:`1px solid ${s.isNow?'#c2daf8':C.linhaSoft}`,
        opacity:s.tipo==='satelite'?0.75:1,
        cursor:s.navegavel?'pointer':'default',position:'relative'}}>
      {s.isNow&&<span style={{position:'absolute',top:8,right:8,background:'#22c55e',color:'#fff',fontFamily:'JetBrains Mono,monospace',fontSize:7,letterSpacing:'0.1em',textTransform:'uppercase',padding:'2px 7px',borderRadius:10,fontWeight:700}}>Agora</span>}
      {s.starred&&!s.isNow&&<span style={{position:'absolute',top:7,right:10,color:C.ouro,fontSize:14}}>★</span>}
      <div style={{display:'flex',gap:10,alignItems:'flex-start'}}>
        <div style={{minWidth:40,flexShrink:0,textAlign:'center',paddingTop:1}}>
          <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:13.5,fontWeight:700,color:C.azul,lineHeight:1}}>{s.inicio}</div>
          <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:7.5,color:C.cinza,marginTop:3,lineHeight:1.3}}>→{s.fim}</div>
          <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:7,color:C.cinza,opacity:.6,marginTop:1}}>{s.dur}</div>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:5}}>
            <BadgePill tipo={s.tipo} label={s.badge} sm />
          </div>
          <div style={{fontSize:13,fontWeight:600,color:C.tinta,lineHeight:1.3,marginBottom:3,paddingRight:(s.isNow||s.starred)?36:0}}>{s.titulo}</div>
          {s.moderador&&<div style={{fontSize:10.5,color:C.cinza,marginBottom:3}}>mod. {s.moderador}</div>}
          {s.aDefinir&&<div style={{fontSize:10.5,color:C.cinza,fontStyle:'italic'}}>programação a definir</div>}
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
          {(s.falas||[]).length>3&&<div style={{fontSize:9.5,color:C.cinza,marginTop:2,fontStyle:'italic'}}>+{s.falas.length-3} fala(s)…</div>}
          {s.navegavel&&(
            <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end',marginTop:6,gap:5}}>
              {isMarked&&<span style={{fontFamily:'JetBrains Mono,monospace',fontSize:8.5,color:C.azulSoft}}>na agenda</span>}
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
      <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:8,textTransform:'uppercase',letterSpacing:'0.1em',color:C.cinza,marginBottom:5}}>
        {dia===DIAS[0]?'A jornada · sexta 23/out':'A jornada · sábado 24/out'}
      </div>
      <div style={{position:'relative',height:20,background:C.cinzaClr,borderRadius:4,overflow:'visible'}}>
        {sessoes.map(s=>{
          const l=pct(s.inicio),w=Math.max(pct(s.fim)-l,.8);
          return <div key={s.id} onClick={()=>s.navegavel&&go('#/sessao/'+s.id)} title={s.titulo}
            style={{position:'absolute',top:2,bottom:2,left:l+'%',width:w+'%',background:bc(s.tipo),borderRadius:2,cursor:s.navegavel?'pointer':'default',opacity:.85,transition:'opacity .15s'}}
            onMouseOver={e=>{e.currentTarget.style.opacity=1;e.currentTarget.style.transform='scaleY(1.2)';}}
            onMouseOut={e=>{e.currentTarget.style.opacity=.85;e.currentTarget.style.transform='';}}/>;
        })}
        {nowPct>=0&&<div style={{position:'absolute',top:-3,bottom:-3,left:nowPct+'%',width:2,background:C.azulSoft,borderRadius:1,zIndex:5,boxShadow:`0 0 0 2px rgba(45,84,192,.2)`}}/>}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:4,fontFamily:'JetBrains Mono,monospace',fontSize:7.5,color:C.cinza}}>
        {[8,10,12,14,16,18].filter(h=>h*60<=DAY_END+30).map(h=><span key={h}>{h}h</span>)}
      </div>
    </div>
  );
}

/* ── SpeakerBioModal ─────────────────────────────────────────── */
function SpeakerBioModal({ name, onClose }) {
  const bio = SPEAKER_BIOS[name];
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(26,36,56,.55)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:300,padding:'0 0 0'}} onClick={onClose}>
      <div style={{background:'#fff',borderRadius:'18px 18px 0 0',width:'100%',maxWidth:440,maxHeight:'75vh',overflow:'auto',padding:'18px 20px 32px'}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:8.5,textTransform:'uppercase',letterSpacing:'0.1em',color:C.cinza}}>Palestrante</span>
          <button onClick={onClose} style={{background:'none',border:'none',fontSize:22,color:C.cinza,cursor:'pointer',lineHeight:1,padding:'0 2px'}}>×</button>
        </div>
        <h3 style={{fontFamily:'Georgia,serif',fontSize:18,fontWeight:600,color:C.tinta,margin:'0 0 4px',lineHeight:1.25}}>{name}</h3>
        {bio?(<>
          <div style={{fontSize:12,color:C.cinza,marginBottom:10,fontStyle:'italic'}}>{bio.role}</div>
          <p style={{fontSize:13.5,color:C.tinta,lineHeight:1.6,margin:0}}>{bio.bio}</p>
          {(bio.isMe||bio.isKey)&&<div style={{marginTop:10,display:'inline-block',background:C.ouroBg,color:C.ouro,fontFamily:'JetBrains Mono,monospace',fontSize:8,textTransform:'uppercase',letterSpacing:'0.08em',padding:'3px 9px',borderRadius:8}}>{bio.isMe?'★ sua fala':'tema-chave'}</div>}
        </>):(<p style={{fontSize:13,color:C.cinza,fontStyle:'italic',lineHeight:1.6,margin:0}}>Bio em curadoria. Será publicada antes do evento.</p>)}
      </div>
    </div>
  );
}

/* ── BriefingQuiz — preparação para sessão ───────────────────── */
function BriefingQuiz({ id }) {
  const meta = SESSION_META && SESSION_META[id];
  const [showQuiz, setShowQuiz] = useState(false);
  const [answered, setAnswered] = useState(null);
  if(!meta) return null;
  const q = meta.quiz && meta.quiz[0];
  return (
    <div style={{background:'#fff',borderRadius:14,padding:'12px 14px',border:`1px solid ${C.linhaSoft}`,marginBottom:10,boxShadow:'0 2px 10px rgba(29,62,138,.05)'}}>
      <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:8.5,textTransform:'uppercase',letterSpacing:'0.08em',color:C.cinza,marginBottom:8,fontWeight:600}}>Preparação para a sessão</div>
      {meta.isKey&&<div style={{display:'inline-flex',alignItems:'center',gap:5,background:C.ouroBg,color:C.ouro,fontFamily:'JetBrains Mono,monospace',fontSize:8,textTransform:'uppercase',letterSpacing:'0.08em',padding:'2px 9px',borderRadius:8,marginBottom:8}}>★ tema-chave</div>}
      {meta.briefing&&<ul style={{listStyle:'none',padding:0,margin:'0 0 10px',display:'flex',flexDirection:'column',gap:5}}>
        {meta.briefing.map((p,i)=><li key={i} style={{display:'flex',gap:8,alignItems:'baseline',fontSize:12.5,color:C.tinta,lineHeight:1.5}}>
          <span style={{width:6,height:6,minWidth:6,borderRadius:'50%',background:C.ouro,marginTop:4,display:'block'}}/>{p}
        </li>)}
      </ul>}
      {q&&!showQuiz&&<button onClick={()=>setShowQuiz(true)} style={{width:'100%',border:`1px dashed ${C.linha}`,background:'#f8fafd',borderRadius:8,padding:'8px',fontFamily:'DM Sans,sans-serif',fontSize:12,color:C.cinza,cursor:'pointer'}}>Quiz preparatório →</button>}
      {q&&showQuiz&&<div>
        <div style={{fontSize:13,color:C.tinta,lineHeight:1.5,marginBottom:8,fontWeight:500}}>{q.q}</div>
        {q.opts.map((opt,i)=>{
          const isRight=i===q.correct,isWrong=answered!==null&&answered===i&&i!==q.correct,isReveal=answered!==null&&isRight;
          return <button key={i} onClick={()=>answered===null&&setAnswered(i)}
            style={{display:'block',width:'100%',textAlign:'left',background:isReveal?'#dcfce7':isWrong?'#fee2e2':'#f8fafd',color:isReveal?C.verde:isWrong?'#e53e3e':C.tinta,border:`1px solid ${isReveal?C.verde:isWrong?'#e53e3e':C.linha}`,borderRadius:7,padding:'8px 11px',fontSize:12.5,cursor:answered===null?'pointer':'default',marginBottom:5,fontFamily:'DM Sans,sans-serif',transition:'all .15s'}}>{opt}</button>;
        })}
        {answered!==null&&<div style={{marginTop:8,padding:'9px 11px',background:'#f8fafd',borderRadius:7,fontSize:12,color:C.cinza,lineHeight:1.5}}>{q.why}</div>}
      </div>}
    </div>
  );
}

/* ── ProgramaScreen ─────────────────────────────────────────── */
function ProgramaScreen() {
  const appState = useAppState();
  const [dia,   setDia]   = useState(()=>{ try{const s=sessionStorage.getItem('ccem_dia');if(s&&DIAS.includes(s))return s;}catch(e){} return ccemDiaDeHoje()||DIAS[0]; });
  const [busca, setBusca] = useState('');
  const [filtroTema, setFiltroTema] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState(null);
  const [soAgenda,   setSoAgenda]   = useState(false);
  const listRef = useRef(null);

  useEffect(()=>{ try{sessionStorage.setItem('ccem_dia',dia);}catch(e){} },[dia]);
  useEffect(()=>{
    const el=listRef.current; if(!el) return;
    const key='ccem_scroll_'+dia;
    const saved=sessionStorage.getItem(key);
    if(saved) el.scrollTop=parseInt(saved)||0;
    return ()=>{ if(el) try{sessionStorage.setItem(key,String(el.scrollTop));}catch(e){} };
  },[dia]);

  const allTopics = useMemo(()=>{
    const set=new Set();
    Object.values(SESSOES).forEach(s=>(s.temas||[]).forEach(t=>set.add(t)));
    return [...set].sort();
  },[]);

  const buscaNorm = useMemo(()=>norm(busca),[busca]);
  const items = useMemo(()=>{
    return (PROGRAMA[dia]||[]).filter(item=>{
      if(item.tipo==='intervalo') return !buscaNorm&&!filtroTema&&!filtroTipo&&!soAgenda;
      const s=SESSOES[item.id]; if(!s) return false;
      if(soAgenda&&!appState.marks?.[item.id]) return false;
      if(filtroTema&&!(s.temas||[]).includes(filtroTema)) return false;
      if(filtroTipo&&s.tipo!==filtroTipo) return false;
      if(buscaNorm){
        const hay=norm(s.titulo+' '+(s.moderador||'')+' '+(s.falas||[]).map(f=>f.palestrante+' '+f.titulo).join(' ')+' '+(s.temas||[]).join(' '));
        if(!hay.includes(buscaNorm)) return false;
      }
      return true;
    });
  },[dia,buscaNorm,filtroTema,filtroTipo,soAgenda,appState.marks]);

  const totalSessoes=(PROGRAMA[dia]||[]).filter(i=>i.tipo==='sessao'&&SESSOES[i.id]?.navegavel).length;
  const markedCount=(PROGRAMA[dia]||[]).filter(i=>i.tipo==='sessao'&&appState.marks?.[i.id]).length;
  const chip=(active,bg,text)=>({display:'inline-flex',alignItems:'center',background:active?bg:'#fff',color:active?text:C.cinza,fontFamily:'DM Sans,sans-serif',fontSize:11.5,fontWeight:active?700:500,padding:'5px 12px',borderRadius:20,border:`1px solid ${active?bg:C.linha}`,cursor:'pointer',whiteSpace:'nowrap',flexShrink:0,gap:4});

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden'}}>
      {/* Day tabs */}
      <div style={{display:'flex',alignItems:'center',gap:8,padding:'9px 12px 7px',borderBottom:`1px solid ${C.linha}`,background:'#fff',flexShrink:0}}>
        <div style={{display:'flex',background:'#f0f4fc',borderRadius:10,padding:3,gap:2,flex:1}}>
          {DIAS.map(d=>(
            <button key={d} onClick={()=>setDia(d)} style={{flex:1,padding:'6px 0',border:'none',borderRadius:8,fontFamily:'DM Sans,sans-serif',fontWeight:700,cursor:'pointer',background:dia===d?C.azul:'transparent',color:dia===d?'#fff':C.cinza,transition:'all .15s'}}>
              <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:16,lineHeight:1,display:'block'}}>{d.includes('23')?'23':'24'}</span>
              <span style={{fontSize:9,letterSpacing:'0.08em',textTransform:'uppercase'}}>{d.includes('sex')?'SEX':'SÁB'}</span>
            </button>
          ))}
        </div>
        <div style={{display:'flex',gap:6,flexShrink:0,alignItems:'center'}}>
          <div style={{textAlign:'right'}}>
            <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:9,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.05em'}}>{totalSessoes} sessões</div>
            {markedCount>0&&<div style={{fontFamily:'JetBrains Mono,monospace',fontSize:9,color:C.azulSoft,marginTop:1}}>{markedCount} marcadas</div>}
          </div>
          <button onClick={()=>{openModal({kind:'mapa'});}} style={{display:'flex',alignItems:'center',gap:5,background:'#fff',border:`1px solid ${C.linha}`,borderRadius:16,padding:'4px 10px',fontFamily:'JetBrains Mono,monospace',fontSize:9,color:C.cinza,cursor:'pointer',textTransform:'uppercase',letterSpacing:'0.06em',flexShrink:0,whiteSpace:'nowrap'}}>
            <svg width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round'><path d='M9 3L3 6v15l6-3 6 3 6-3V3l-6 3-6-3z'/><path d='M9 3v15'/><path d='M15 6v15'/></svg>Mapa
          </button>
        </div>
      </div>
      {/* Busca (ENDO 2026 + ADA pattern) */}
      <div style={{padding:'8px 12px 0',background:'#fff',flexShrink:0}}>
        <div style={{position:'relative',display:'flex',alignItems:'center'}}>
          <span style={{position:'absolute',left:10,pointerEvents:'none'}}><IcoSearch size={14} color={C.cinza}/></span>
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar sessão, palestrante ou tema…"
            style={{width:'100%',padding:'7px 30px 7px 30px',border:`1px solid ${C.linha}`,borderRadius:8,fontFamily:'DM Sans,sans-serif',fontSize:12,color:C.tinta,background:'#f8fafd',outline:'none',boxSizing:'border-box'}}/>
          {busca&&<button onClick={()=>setBusca('')} style={{position:'absolute',right:8,background:'none',border:'none',cursor:'pointer',color:C.cinza,display:'flex',padding:0}}><IcoX size={14}/></button>}
        </div>
      </div>
      <DayTimeline dia={dia}/>
      {/* Filtros por tema/tipo (ENDO 2026 Browse by Track/Type) */}
      <div style={{display:'flex',gap:5,padding:'7px 12px',overflowX:'auto',flexShrink:0,borderBottom:`1px solid ${C.linhaSoft}`,background:'#f9fbff',scrollbarWidth:'none'}}>
        <button onClick={()=>setSoAgenda(v=>!v)} style={chip(soAgenda,C.ouro,'#fff')}>★ Minha agenda</button>
        {['simposio','mini','satelite'].map(t=>(
          <button key={t} onClick={()=>setFiltroTipo(filtroTipo===t?null:t)} style={chip(filtroTipo===t,C.azul,'#fff')}>
            {t==='simposio'?'Simpósio':t==='mini'?'Mini':'Satélite'}
          </button>
        ))}
        <div style={{width:1,background:C.linha,flexShrink:0,margin:'3px 2px'}}/>
        {allTopics.map(tema=>(
          <button key={tema} onClick={()=>setFiltroTema(filtroTema===tema?null:tema)} style={chip(filtroTema===tema,TEMAS_COR[tema]||C.cinza,'#fff')}>
            {tema}
          </button>
        ))}
      </div>
      {/* Lista */}
      <div ref={listRef} style={{flex:1,overflowY:'auto',paddingBottom:16}}>
        {items.length===0?(
          <div style={{textAlign:'center',padding:'40px 20px',color:C.cinza}}>
            <div style={{fontSize:28,marginBottom:10}}>○</div>
            <div style={{fontSize:13,marginBottom:12}}>Nenhuma sessão encontrada</div>
            <button onClick={()=>{setBusca('');setFiltroTema(null);setFiltroTipo(null);setSoAgenda(false);}} style={{border:`1px solid ${C.linha}`,background:'#fff',color:C.azul,padding:'7px 16px',borderRadius:8,cursor:'pointer',fontFamily:'inherit',fontSize:12}}>Limpar filtros</button>
          </div>
        ):items.map((item,i)=>item.tipo==='intervalo'?<IntervalRow key={i} item={item}/>:<SessaoCard key={item.id} id={item.id}/>)}
        {items.length>0&&<div style={{padding:'12px 16px',fontFamily:'JetBrains Mono,monospace',fontSize:9,color:C.cinza,textAlign:'center',letterSpacing:'0.04em',opacity:.5}}>★ destaque editorial · toque para abrir a sessão</div>}
      </div>
    </div>
  );
}

/* ── SlideDisplay — leitura (participante) ─────────────────── */
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
        style={{fontSize:10.5,fontWeight:600,color:C.verde,textDecoration:'none'}}>{slides.name}</a>
    </div>
  );
}

/* ── SlideUploadBtn — upload (admin) ───────────────────────── */
function SlideUploadBtn({ sessaoId, falaIdx }) {
  const slKey = 'ccem_slides_' + sessaoId + '_' + falaIdx;
  const [slides, setSlides] = useState(() => {
    try { const r = localStorage.getItem(slKey); return r ? JSON.parse(r) : null; } catch(e) { return null; }
  });
  const slInputRef = useRef(null);

  function handleSlideFile(file) {
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { showToast('Arquivo muito grande · máx. 4 MB'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      const data = { name: file.name, type: file.type, size: file.size, dataUrl: ev.target.result, ts: Date.now() };
      try { localStorage.setItem(slKey, JSON.stringify(data)); } catch(e) { showToast('Armazenamento cheio'); return; }
      setSlides(data);
      showToast('Slides enviados ✓ · visíveis para participantes');
    };
    reader.readAsDataURL(file);
  }

  function removeSlides() {
    localStorage.removeItem(slKey);
    setSlides(null);
    showToast('Slides removidos');
  }

  const isImage = slides && slides.type && slides.type.startsWith('image/');

  if (slides) {
    return (
      <div style={{marginTop:6,background:C.verde+'12',borderRadius:7,padding:'6px 9px',display:'flex',alignItems:'center',gap:7}}>
        <span style={{fontSize:13}}>📎</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:10.5,fontWeight:600,color:C.verde,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{slides.name}</div>
          <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:8.5,color:C.cinza,marginTop:1}}>{(slides.size/1024).toFixed(0)} KB · {new Date(slides.ts).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</div>
        </div>
        <a href={slides.dataUrl} download={slides.name}
          style={{fontSize:11,fontWeight:600,color:C.azul,textDecoration:'none',background:C.azulBg,padding:'4px 9px',borderRadius:6,flexShrink:0}}>↓ Baixar</a>
        <button onClick={removeSlides} style={{background:'none',border:'none',color:C.cinza,cursor:'pointer',fontSize:14,padding:'0 2px',flexShrink:0}} title="Remover slides">×</button>
      </div>
    );
  }

  return (
    <>
      <input type="file" ref={slInputRef} accept=".pdf,.ppt,.pptx,.key,.png,.jpg,.jpeg,.gif"
        style={{display:'none'}} onChange={e=>{handleSlideFile(e.target.files&&e.target.files[0]);e.target.value='';}}/>
      <button onClick={()=>slInputRef.current&&slInputRef.current.click()}
        style={{marginTop:6,display:'inline-flex',alignItems:'center',gap:5,fontSize:10.5,color:C.cinza,background:'none',border:`1px dashed ${C.linha}`,borderRadius:7,padding:'4px 10px',cursor:'pointer',fontFamily:'DM Sans,sans-serif',transition:'border-color .15s, color .15s'}}
        onMouseOver={e=>{e.currentTarget.style.borderColor=C.azulSoft;e.currentTarget.style.color=C.azul;}}
        onMouseOut={e=>{e.currentTarget.style.borderColor=C.linha;e.currentTarget.style.color=C.cinza;}}>
        📎 Enviar slides
      </button>
    </>
  );
}


function SessaoDetail({ id }) {
  const s = SESSOES[id];
  const appState = useAppState();
  const isMarked = !!(appState.marks&&appState.marks[id]);
  const idx = SESSOES_NAV.indexOf(id);
  const prevId = idx>0 ? SESSOES_NAV[idx-1] : null;
  const nextId = idx>=0&&idx<SESSOES_NAV.length-1 ? SESSOES_NAV[idx+1] : null;
  const bc = s ? badgeColor(s.tipo) : C.azul;

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
    showToast(isMarked?'Removido da agenda':'Adicionado à agenda ✓');
  }
  function handleCapture(){
    updateAppState(st=>{
      if(!st.captures) st.captures=[];
      st.captures.unshift({id:'c_'+Date.now().toString(36),dia:s.dia,time:nowStamp(),sessaoId:id,sessaoRef:s.badge+' · '+s.titulo.slice(0,40),type:'texto',title:'Captura — '+s.badge,body:'<em>Adicione observações pelo Assistente.</em>',tags:s.temas||[],ts:Date.now()});
    });
    showToast('Sessão capturada · indo para Assistente');
    go('#/assistente');
  }
  async function handleShare(){
    const texto = `${s.badge} — ${s.titulo}\n${s.dia} · ${s.inicio}–${s.fim} · Expoville, Joinville/SC\n\n#CCEM2026 #SBEMSC`;
    if (navigator.share) {
      try { await navigator.share({ title: s.titulo, text: texto, url: 'https://ccem2026.com.br' }); }
      catch(e) { /* cancelado pelo usuário */ }
    } else {
      try { await navigator.clipboard.writeText(texto); showToast('Copiado para a área de transferência ✓'); }
      catch(e) { showToast('Compartilhar: ' + s.badge); }
    }
  }

  function handleAskAI(){
    window._ccemCtxSessaoId = id;
    showToast('Assistente contextualizado → '+s.badge);
    go('#/assistente');
  }
  const navBtn=(on)=>({width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',border:`1px solid rgba(255,255,255,${on?0.3:0.12})`,background:on?'rgba(255,255,255,.14)':'transparent',borderRadius:9,cursor:on?'pointer':'default',opacity:on?1:0.28,padding:0});

  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column',overflow:'hidden',background:C.papel}}>
      {/* Sticky top bar */}
      <div style={{background:C.azul,color:'#fff',flexShrink:0,boxShadow:'0 2px 12px rgba(10,18,50,.3)'}}>
        <div style={{height:52,display:'flex',alignItems:'center',gap:8,padding:'0 8px'}}>
          <button onClick={()=>window.history.back()} style={BACK_BTN}><IcoArrowL size={20} color="#fff"/></button>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:700,lineHeight:1.2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{s.titulo}</div>
            <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,opacity:.75,marginTop:1}}>{s.inicio}–{s.fim} · {s.dur}</div>
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

      {/* Content */}
      <div style={{flex:1,overflowY:'auto',padding:'14px 14px 28px'}}>
        {/* Header card */}
        <div style={{background:'#fff',borderRadius:14,padding:'14px',border:`1px solid ${C.linhaSoft}`,marginBottom:10,boxShadow:'0 2px 10px rgba(29,62,138,.05)'}}>
          <div style={{display:'flex',gap:6,marginBottom:9,flexWrap:'wrap',alignItems:'center'}}>
            <BadgePill tipo={s.tipo} label={s.badge}/>
            {(s.temas||[]).map(t=><TopicPill key={t} tema={t}/>)}
            {s.starred&&<span style={{fontFamily:'JetBrains Mono,monospace',fontSize:8,color:C.ouro,letterSpacing:'0.06em',textTransform:'uppercase',padding:'2px 7px',background:C.ouroBg,borderRadius:10}}>Destaque</span>}
          </div>
          <h2 style={{fontFamily:'Georgia,serif',fontSize:15.5,fontWeight:700,color:C.tinta,lineHeight:1.35,letterSpacing:'-0.01em',margin:'0 0 8px'}}>{s.titulo}</h2>
          <div style={{display:'flex',gap:8,alignItems:'center',fontFamily:'JetBrains Mono,monospace',fontSize:10,color:C.cinza}}>
            <span style={{color:C.azulSoft,fontWeight:700}}>{s.inicio}</span>
            <span>→ {s.fim}</span>
            <span style={{opacity:.6}}>· {s.dur} · {s.dia}</span>
          </div>
          {s.moderador&&(
            <div style={{marginTop:9,padding:'6px 10px',background:C.azulBg+'60',borderRadius:7,display:'flex',gap:8,alignItems:'center'}}>
              <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:8,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.07em',flexShrink:0}}>Moderador</span>
              <span style={{fontSize:12,color:C.tinta,fontWeight:500}}>{s.moderador}</span>
            </div>
          )}
        </div>

        {/* Talks */}
        {s.falas&&s.falas.length>0&&(
          <div style={{background:'#fff',borderRadius:14,padding:'12px 14px',border:`1px solid ${C.linhaSoft}`,marginBottom:10,boxShadow:'0 2px 10px rgba(29,62,138,.05)'}}>
            <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:8.5,textTransform:'uppercase',letterSpacing:'0.08em',color:C.cinza,marginBottom:10,fontWeight:600}}>Programa da sessão</div>
            {s.falas.map((f,i)=>(
              <div key={i} style={{display:'flex',gap:10,padding:'8px 0',borderBottom:i<s.falas.length-1?`1px solid ${C.linhaSoft}`:'none'}}>
                <div style={{width:22,height:22,borderRadius:7,background:bc+'1a',color:bc,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'JetBrains Mono,monospace',fontSize:10,fontWeight:700,flexShrink:0}}>{f.n==='·'?'·':f.n}</div>
                <div style={{flex:1,minWidth:0}}>
                  {f.titulo&&<div style={{fontSize:12.5,fontWeight:600,color:C.tinta,lineHeight:1.3,marginBottom:2}}>{f.titulo}</div>}
                  <div style={{fontSize:12,color:f.isMe?C.ouro:C.cinza,fontWeight:f.isMe?600:400,cursor:'pointer',textDecorationLine:'underline',textDecorationStyle:'dotted',textDecorationColor:C.linha}} onClick={()=>setBioName(f.palestrante)}>
                    {f.palestrante}{f.isMe&&' ★'}{f.aConfirmar&&<em style={{color:C.cinza,textDecoration:'none'}}> (a confirmar)</em>}
                  </div>
                  {(f.label||f.isMe)&&<div style={{marginTop:3,display:'inline-block',background:C.ouroBg,color:C.ouro,fontFamily:'JetBrains Mono,monospace',fontSize:7.5,letterSpacing:'0.08em',textTransform:'uppercase',padding:'2px 7px',borderRadius:8}}>{f.label||'sua fala'}</div>}
                  <SlideDisplay sessaoId={id} falaIdx={i}/>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Briefing + Quiz */}
        <BriefingQuiz id={id}/>

        {/* Ações primárias */}
        <div style={{display:'flex',gap:8,marginBottom:8}}>
          <button onClick={handleCapture} style={{flex:2,display:'flex',alignItems:'center',justifyContent:'center',gap:6,background:C.azul,color:'#fff',border:'none',borderRadius:10,padding:'11px',fontFamily:'DM Sans,sans-serif',fontSize:12.5,fontWeight:600,cursor:'pointer'}}>
            <IcoCapture size={15} color="#fff"/>Capturar sessão
          </button>
          <button onClick={toggleMark} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:5,background:isMarked?C.ouroBg:'#fff',color:isMarked?C.ouro:C.cinza,border:`1px solid ${isMarked?C.ouro:C.linha}`,borderRadius:10,padding:'11px 8px',fontFamily:'DM Sans,sans-serif',fontSize:12,fontWeight:isMarked?600:500,cursor:'pointer'}}>
            <IcoStar size={14} color={isMarked?C.ouro:C.cinza} filled={isMarked}/>{isMarked?'Agendado':'Agendar'}
          </button>
        </div>

        {/* ADA-inspired: Ask the AI contextual (dentro da sessão) */}
        <button onClick={handleAskAI} style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'11px 14px',background:'linear-gradient(135deg,#1a3580 0%,#0f2260 100%)',border:'none',borderRadius:10,cursor:'pointer',marginBottom:12}}>
          <div style={{width:28,height:28,borderRadius:8,background:'rgba(255,255,255,.15)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/><circle cx="9" cy="10" r="1" fill="#fff" stroke="none"/><circle cx="12" cy="10" r="1" fill="#fff" stroke="none"/><circle cx="15" cy="10" r="1" fill="#fff" stroke="none"/></svg>
          </div>
          <div style={{textAlign:'left',flex:1}}>
            <div style={{fontFamily:'DM Sans,sans-serif',fontSize:12,fontWeight:700,color:'#fff'}}>Perguntar ao Assistente</div>
            <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:8.5,color:'rgba(255,255,255,.65)',marginTop:1,letterSpacing:'0.03em'}}>contextualizado nesta sessão</div>
          </div>
          <IcoChevR size={16} color="rgba(255,255,255,.5)"/>
        </button>

        {/* Speaker Bio Modal */}
        {bioName&&<SpeakerBioModal name={bioName} onClose={()=>setBioName(null)}/>}

        {/* Prev / Next */}
        <div style={{display:'flex',gap:8}}>
          {prevId&&SESSOES[prevId]&&(
            <button onClick={()=>go('#/sessao/'+prevId)} style={{flex:1,background:'#fff',border:`1px solid ${C.linha}`,borderRadius:10,padding:'9px 12px',textAlign:'left',cursor:'pointer',minWidth:0}}>
              <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:8,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:3}}>← Anterior</div>
              <div style={{fontSize:11,fontWeight:500,color:C.tinta,lineHeight:1.3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{SESSOES[prevId].titulo}</div>
            </button>
          )}
          {nextId&&SESSOES[nextId]&&(
            <button onClick={()=>go('#/sessao/'+nextId)} style={{flex:1,background:'#fff',border:`1px solid ${C.linha}`,borderRadius:10,padding:'9px 12px',textAlign:'right',cursor:'pointer',minWidth:0}}>
              <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:8,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:3}}>Próxima →</div>
              <div style={{fontSize:11,fontWeight:500,color:C.tinta,lineHeight:1.3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{SESSOES[nextId].titulo}</div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
const BACK_BTN = {width:40,height:40,display:'flex',alignItems:'center',justifyContent:'center',border:'none',background:'transparent',cursor:'pointer',borderRadius:9,flexShrink:0,padding:0};

/* ── TrabalhosScreen ───────────────────────────────────────── */
const WORK_CATS = [
  {id:'all',label:'Todos'},
  {id:'diabetes',label:'Diabetes'},
  {id:'tireoide',label:'Tireoide'},
  {id:'obesidade',label:'Obesidade'},
  {id:'adrenal',label:'Adrenal'},
  {id:'pediatrica',label:'Pediátrica'},
  {id:'feminina',label:'Gônadas/Trans'},
];
const WORKS = [
  {id:'P-001',cat:'diabetes',type:'Original',title:'Semaglutida em DM2 + obesidade grau III: 24 meses',message:'Resposta glicêmica precoce, impacto ponderal só estabiliza após 12 meses.',authors:'Dr. Eduardo Schmidt, Dra. Patricia Bauer Lima · UFSC',audio:true,votes:34,qa:2},
  {id:'P-002',cat:'diabetes',type:'Original',title:'Tirzepatida em DM2: coorte real de 87 pacientes em Joinville',message:'Redução de 1,8% na HbA1c em 6 meses — adesão é o gargalo.',authors:'Dr. André Boehm, Dra. Renata Cardoso · HU-Joinville',audio:true,votes:28,qa:1},
  {id:'P-003',cat:'diabetes',type:'Série de casos',title:'Cetoacidose euglicêmica em iSGLT2: série de 4 casos',message:'Glicemia normal não exclui CAD em iSGLT2 — pedir cetona sempre.',authors:'Dra. Júlia Reiser, Dr. Carlos Eduardo Vianna · HRHDS',audio:false,votes:19,qa:1},
  {id:'P-004',cat:'tireoide',type:'Série de casos',title:'CDT de baixo risco com Tg detectável: estratificação dinâmica em 5 anos',message:'Tg detectável após ablação não é falha — é categoria a estratificar.',authors:'Dra. Beatriz Karmann, Dr. Henrique Bertelli · UNIVALI',audio:true,votes:22,qa:1},
  {id:'P-005',cat:'tireoide',type:'Revisão',title:'TSH supressivo longo prazo no CDT de alto risco pós-ATA 2015',message:'Manter TSH <0,1 por >5 anos aumenta risco CV sem ganho oncológico claro.',authors:'Dr. Ricardo Becker, Dra. Cláudia Hartmann · UNISUL',audio:true,votes:41,qa:0},
  {id:'P-006',cat:'obesidade',type:'Coorte',title:'Estilo de vida pós-bariátrica e manutenção de peso aos 5 anos',message:'Quem mantém atividade física estruturada perde 11% a mais em 5 anos.',authors:'Dra. Tamara Rodrigues, Dr. Lucas Eichholz · UFSC',audio:true,votes:38,qa:0},
  {id:'P-007',cat:'adrenal',type:'Original',title:'Hiperaldosteronismo primário em HAS refratária: rastreamento 4x mais diagnóstico',message:'HAS refratária merece relação aldosterona/renina sempre.',authors:'Dr. Augusto Reichow, Dra. Renata Kühl · UFSC',audio:true,votes:33,qa:0},
  {id:'P-008',cat:'pediatrica',type:'Coorte',title:'Puberdade precoce central em meninas catarinenses: 56 casos em 8 anos',message:'Atraso >12m no tratamento compromete estatura final.',authors:'Dra. Andrea Becker, Dra. Mônica Voss · HIJG',audio:true,votes:26,qa:0},
  {id:'P-009',cat:'feminina',type:'Original',title:'Hormonioterapia em mulheres trans no SUS-SC: 3 centros',message:'Acesso ainda fragmentado — protocolos regionais aumentam segurança.',authors:'Dra. Vitória Salles, Dra. Aline Beltrami · SES-SC / HU-UFSC',audio:true,votes:47,qa:2},
];

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
          <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:9,color:C.cinza,marginLeft:'auto'}}>{w.id}</span>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:'14px 14px 28px'}}>
          <div style={{display:'flex',gap:6,marginBottom:8,flexWrap:'wrap'}}>
            <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:8.5,color:C.cinza,background:C.cinzaClr,padding:'2px 8px',borderRadius:10,textTransform:'uppercase',letterSpacing:'0.06em'}}>{WORK_CATS.find(c=>c.id===w.cat)?.label||w.cat}</span>
            <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:8.5,color:C.ouro,textTransform:'uppercase',letterSpacing:'0.06em'}}>{w.type}</span>
          </div>
          <h2 style={{fontFamily:'Georgia,serif',fontSize:16,fontWeight:600,color:C.tinta,lineHeight:1.3,margin:'0 0 8px'}}>{w.title}</h2>
          <div style={{padding:'10px 12px',background:C.ouroBg+'60',borderLeft:`3px solid ${C.ouro}`,borderRadius:'0 6px 6px 0',fontSize:13,fontStyle:'italic',color:C.tinta,lineHeight:1.5,marginBottom:12}}>"{w.message}"</div>
          <div style={{fontSize:12,color:C.cinza,marginBottom:12}}>{w.authors}</div>
          {w.audio&&<div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'#fff',borderRadius:10,border:`1px solid ${C.linhaSoft}`,marginBottom:12}}>
            <div style={{width:34,height:34,borderRadius:'50%',background:C.azul,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <svg width='13' height='13' viewBox='0 0 24 24' fill='white'><path d='M8 5v14l11-7z'/></svg>
            </div>
            <div><div style={{fontFamily:'JetBrains Mono,monospace',fontSize:8.5,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.06em'}}>Áudio do autor</div>
            <div style={{fontSize:13,fontWeight:500,color:C.tinta,marginTop:1}}>Demo · clique para ouvir</div></div>
          </div>}
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
          <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:9,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.05em'}}>{filtered.length} de {WORKS.length}</span>
        </div>
        <div style={{display:'flex',padding:'8px 0 2px',gap:5,overflowX:'auto',scrollbarWidth:'none'}}>
          {WORK_CATS.map(c=>{
            const n=c.id==='all'?WORKS.length:(counts[c.id]||0); if(c.id!=='all'&&n===0) return null;
            return <button key={c.id} onClick={()=>setCat(c.id)} style={{flexShrink:0,border:`1px solid ${cat===c.id?C.azul:C.linha}`,background:cat===c.id?C.azul:'#fff',color:cat===c.id?'#fff':C.cinza,borderRadius:16,padding:'4px 11px',fontSize:11.5,fontFamily:'inherit',cursor:'pointer',whiteSpace:'nowrap'}}>{c.label} <span style={{opacity:.65,fontFamily:'JetBrains Mono,monospace',fontSize:9}}>{n}</span></button>;
          })}
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'8px 12px 20px'}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:6,padding:'8px 10px',background:C.ouroBg+'50',borderRadius:8,marginBottom:8,border:`1px solid ${C.ouroBg}`}}>
          <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke={C.ouro} strokeWidth='2' strokeLinecap='round' style={{flexShrink:0,marginTop:1}}><circle cx='12' cy='12' r='10'/><path d='M12 8v4M12 16h.01'/></svg>
          <span style={{fontSize:11,color:'#92400e',lineHeight:1.4}}>Demonstração de conceito — trabalhos fictícios para validação com a Comissão Científica.</span>
        </div>
        {filtered.map(w=>(
          <div key={w.id} onClick={()=>setSelected(w.id)} style={{background:'#fff',borderRadius:10,padding:'11px 12px',marginBottom:7,border:`1px solid ${C.linhaSoft}`,cursor:'pointer',transition:'transform .12s'}}
            onMouseOver={e=>e.currentTarget.style.transform='translateY(-1px)'} onMouseOut={e=>e.currentTarget.style.transform=''}>
            <div style={{display:'flex',gap:6,marginBottom:5,alignItems:'center'}}>
              <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:8,color:C.cinza,background:C.cinzaClr,padding:'2px 7px',borderRadius:8,textTransform:'uppercase',letterSpacing:'0.06em'}}>{w.type}</span>
              <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:8,color:C.cinza,marginLeft:'auto'}}>{w.id}</span>
            </div>
            <div style={{fontSize:13,fontWeight:600,color:C.tinta,lineHeight:1.3,marginBottom:4}}>{w.title}</div>
            <div style={{fontSize:11.5,color:C.cinza,fontStyle:'italic',lineHeight:1.4,marginBottom:6,paddingLeft:8,borderLeft:`2px solid ${C.ouro}`}}>{w.message}</div>
            <div style={{display:'flex',gap:8,fontFamily:'JetBrains Mono,monospace',fontSize:9,color:C.cinza}}>
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

/* ── AssistenteScreen ──────────────────────────────────────── */
/* helpers para chamadas reais ao Claude */
const CCEM_SISTEMA = 'Você é o assistente científico do Meu CCEM 2026 — Congresso Catarinense de Endocrinologia e Metabologia, Joinville/SC, 23–24 out 2026. Ajude médicos com resumos, take-homes, comparação de falas e análise de evidências. Responda em português brasileiro, tom clínico direto. Ao citar estudos mencione Autor et al. + periódico + ano. Máximo 220 palavras por resposta.';

function ccemBuildCtx(sessaoId) {
  const s = SESSOES[sessaoId];
  if (!s) return '';
  const falas = (s.falas||[]).map(f => `${f.n}. ${f.titulo||f.palestrante}${f.titulo?' — '+f.palestrante:''}`).join(' | ');
  return `Sessão: ${s.badge} — ${s.titulo} (${s.inicio}–${s.fim}, ${s.dia}). ${s.moderador?'Mod.: '+s.moderador+'. ':''}Falas: ${falas}. Temas: ${(s.temas||[]).join(', ')}.`;
}

function ccemMd2html(text) {
  return escapeHTML(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

function AssistenteScreen() {
  const [ctxId, setCtxId] = useState(()=> window._ccemCtxSessaoId || 'simp1-dm2');
  const ctxSessao = SESSOES[ctxId] || SESSOES['simp1-dm2'];
  useEffect(()=>{ if(window._ccemCtxSessaoId && window._ccemCtxSessaoId!==ctxId) setCtxId(window._ccemCtxSessaoId); },[]);

  const welcomeHtml = ()=>{
    const s=SESSOES[window._ccemCtxSessaoId||'simp1-dm2'];
    return s ? `Contextualizado em <strong>${s.badge} — ${s.titulo.slice(0,60)}${s.titulo.length>60?'…':''}</strong>.<br><br>Mande uma pergunta, descreva um slide, ou use os atalhos abaixo.`
              : 'Pronto para ajudar. Selecione uma sessão no Programa para contextualizar.';
  };
  const [bioName, setBioName] = useState(null); // for SpeakerBioModal

  const [msgs, setMsgs] = useState([{role:'ai',tag:'Início',ts:Date.now()-3600000, html: welcomeHtml(), actions:['Resumir sessão','Take-home','Comparar falas']}]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef   = useRef(null);
  const photoRef = useRef(null);

  useEffect(()=>{ if(endRef.current) endRef.current.scrollIntoView({block:'end'}); },[msgs.length,loading]);

  function sendMsg(){
    const v=text.trim(); if(!v) return;
    setText('');
    setMsgs(m=>[...m,{role:'user',ts:Date.now(),html:escapeHTML(v)}]);
    setLoading(true);
    setTimeout(()=>{
      const mock=(MOCK_AI[classifyIntent(v)]||MOCK_AI.free)[0];
      setMsgs(m=>[...m,{role:'ai',...mock,ts:Date.now()}]);
      setLoading(false);
    }, 900+Math.random()*600);
  }

  function handlePhoto(file){
    if(!file) return;
    const reader=new FileReader();
    reader.onload=async ev=>{
      setMsgs(m=>[...m,{role:'user',ts:Date.now(),html:`<img src="${ev.target.result}" style="max-width:180px;border-radius:8px;display:block;margin-bottom:4px"/><span style="font-size:10.5px;opacity:.7">slide enviado</span>`}]);
      setLoading(true);
      try {
        const ctx = ccemBuildCtx(ctxId);
        const prompt = CCEM_SISTEMA + (ctx?'\n\nContexto: '+ctx:'') + '\n\nO médico enviou uma foto de slide. Como não consigo ver a imagem, peça que descreva brevemente o conteúdo (2–3 frases) para eu poder analisá-lo.';
        const resp = await window.claude.complete({ messages:[{role:'user',content:prompt}] });
        setMsgs(m=>[...m,{role:'ai',ts:Date.now(),tag:'Slide recebido',html:ccemMd2html(resp),actions:['Descrever o slide','Qual o ponto central?']}]);
      } catch(e) {
        setMsgs(m=>[...m,{role:'ai',ts:Date.now(),tag:'Slide recebido',html:'Descreva o conteúdo do slide para que eu possa ajudar a analisá-lo.'}]);
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
      if(v.includes('take')) instrucao='Liste exatamente 3 take-homes clínicos desta sessão, numerados. Seja direto e conciso.';
      else if(v.includes('resum')) instrucao='Resuma esta sessão em até 150 palavras, destacando consensos e divergências entre as falas.';
      else if(v.includes('compar')) instrucao='Compare as abordagens das diferentes falas desta sessão: pontos de convergência e tensão clínica.';
      else if(v.includes('salvar')||v.includes('caderno')) instrucao='Gere uma nota estruturada de 2-3 bullet points dos pontos mais importantes desta sessão.';
      else if(v.includes('próxima')||v.includes('interesse')) instrucao='Com base nos temas desta sessão, sugira outros tópicos relacionados no campo da endocrinologia que valeria explorar.';
      else instrucao='Responda de forma útil sobre: '+a;

      const prompt = CCEM_SISTEMA + '\n\nContexto: ' + ctx + '\n\n' + instrucao;
      const resp = await window.claude.complete({ messages:[{role:'user',content:prompt}] });
      const html = ccemMd2html(resp);
      setMsgs(m=>[...m,{role:'ai',ts:Date.now(),tag:a,html,actions:['Salvar no caderno']}]);

      if(v.includes('salvar')||v.includes('caderno')){
        const s = SESSOES[ctxId];
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
  const COMP_BTN_SY = {width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',border:`1px solid ${C.linha}`,background:'#f8fafd',borderRadius:10,cursor:'pointer',flexShrink:0,padding:0};

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden',background:'#f3f6fc'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'9px 14px 7px',background:'#fff',borderBottom:`1px solid ${C.linhaSoft}`,flexShrink:0}}>
        <div style={{width:32,height:32,borderRadius:10,background:C.azul,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Georgia,serif',fontSize:14,fontWeight:700,flexShrink:0}}>C</div>
        <div>
          <div style={{fontSize:12.5,fontWeight:700,color:C.tinta}}>Meu CCEM</div>
          <div style={{fontSize:10,color:C.cinza,display:'flex',alignItems:'center',gap:4}}>
            <span style={{width:5,height:5,borderRadius:'50%',background:'#22c55e',display:'inline-block',flexShrink:0}}/>
            {ctxSessao ? ctxSessao.badge+' · '+ctxSessao.inicio : 'CCEM 2026'}
          </div>
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'12px 12px 0'}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:'flex',flexDirection:'column',alignItems:m.role==='ai'?'flex-start':'flex-end',marginBottom:10}}>
            <div style={msgStyle(m.role)}>
              {m.role==='ai'&&m.tag&&<div style={{fontFamily:'JetBrains Mono,monospace',fontSize:8.5,color:C.azulSoft,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>{m.tag}</div>}
              <div dangerouslySetInnerHTML={{__html:m.html}}/>
              {m.role==='ai'&&m.ref&&<div style={{marginTop:7,paddingTop:7,borderTop:`1px solid ${C.linhaSoft}`,fontSize:10.5,color:C.cinza}} dangerouslySetInnerHTML={{__html:m.ref}}/>}
              {m.role==='ai'&&m.actions&&(
                <div style={{display:'flex',gap:5,flexWrap:'wrap',marginTop:8}}>
                  {m.actions.map((a,j)=><button key={j} onClick={()=>actionClick(a)} style={{border:`1px solid ${C.linha}`,background:'#f8fafd',color:C.azul,borderRadius:7,padding:'4px 10px',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{a}</button>)}
                </div>
              )}
            </div>
            <div style={{fontSize:9,color:C.cinza,marginTop:3,fontFamily:'JetBrains Mono,monospace'}}>{new Date(m.ts).getHours()}:{String(new Date(m.ts).getMinutes()).padStart(2,'0')}</div>
          </div>
        ))}
        {loading&&<div style={{display:'flex',gap:4,padding:'8px 12px',background:'#fff',borderRadius:'14px 14px 14px 4px',width:60,border:`1px solid ${C.linhaSoft}`,marginBottom:10}}>{[0,1,2].map(i=><span key={i} style={{width:7,height:7,borderRadius:'50%',background:C.cinza,display:'inline-block',animation:`ccem-bounce .9s ${i*.2}s ease-in-out infinite`}}/>)}</div>}
        <div ref={endRef}/>
      </div>
      <div style={{display:'flex',gap:5,padding:'5px 12px',overflowX:'auto',flexShrink:0,scrollbarWidth:'none'}}>
        {['Resumir sessão','Take-home','Próxima de interesse','Minhas capturas'].map(chip=>(
          <button key={chip} onClick={()=>actionClick(chip)} style={{flexShrink:0,border:`1px solid ${C.linha}`,background:'#fff',color:C.cinza,borderRadius:20,padding:'4px 11px',fontSize:11,fontFamily:'inherit',cursor:'pointer',whiteSpace:'nowrap'}}>{chip}</button>
        ))}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:7,padding:'7px 10px 12px',background:'#fff',borderTop:`1px solid ${C.linhaSoft}`,flexShrink:0}}>
        <input type="file" accept="image/*" capture="environment" ref={photoRef} style={{display:'none'}} onChange={e=>{handlePhoto(e.target.files&&e.target.files[0]);e.target.value='';}}/>
        <button onClick={()=>photoRef.current&&photoRef.current.click()} style={COMP_BTN_SY}><IcoCam size={18} color={C.cinza}/></button>
        <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&sendMsg()} placeholder="escreva uma observação…"
          style={{flex:1,padding:'8px 12px',border:`1px solid ${C.linha}`,borderRadius:24,fontFamily:'DM Sans,sans-serif',fontSize:12.5,color:C.tinta,background:'#f8fafd',outline:'none'}}/>
        <button onClick={sendMsg} style={{...COMP_BTN_SY,background:C.azul,border:'none'}}><IcoSend size={16} color="#fff"/></button>
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
  const counts   = { all:captures.length, foto:captures.filter(c=>c.type==='foto').length, audio:captures.filter(c=>c.type==='audio').length, texto:captures.filter(c=>c.type==='texto').length };
  const sessoes  = new Set(captures.map(c=>c.sessaoId)).size;
  const refs     = captures.reduce((acc,c)=>acc+(c.body&&(c.body.match(/NEJM|Lancet|JCEM|Diabetes|guideline|diretriz/gi)||[]).length),0);
  const isDia0 = c => c.dia===DIAS[0] || c.day==='sexta';
  const isDia1 = c => c.dia===DIAS[1] || c.day==='sabado';
  const bySex    = filtered.filter(isDia0).sort((a,b)=>b.ts-a.ts);
  const bySab    = filtered.filter(isDia1).sort((a,b)=>b.ts-a.ts);
  const bsOrphan = filtered.filter(c=>!isDia0(c)&&!isDia1(c)).sort((a,b)=>b.ts-a.ts);

  function typeColor(t){ return t==='foto'?C.azul:t==='audio'?'#0d9488':C.ouro; }

  function NoteCard({c}){
    return (
      <div style={{background:'#fff',borderRadius:10,padding:'10px 12px',marginBottom:6,border:`1px solid ${C.linhaSoft}`,borderLeft:`3px solid ${typeColor(c.type)}`}}>
        <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:5}}>
          <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:9,color:typeColor(c.type),textTransform:'uppercase',letterSpacing:'0.07em',fontWeight:600}}>{c.type}</span>
          <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:8.5,color:C.cinza,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.sessaoRef} · {c.time}</span>
        </div>
        <div style={{fontSize:12.5,fontWeight:600,color:C.tinta,marginBottom:4,lineHeight:1.3}}>{c.title}</div>
        <div style={{fontSize:11.5,color:C.cinza,lineHeight:1.5}} dangerouslySetInnerHTML={{__html:c.body}}/>
        {(c.tags||[]).length>0&&<div style={{display:'flex',gap:4,marginTop:6,flexWrap:'wrap'}}>{c.tags.map(t=><span key={t} style={{fontFamily:'JetBrains Mono,monospace',fontSize:8.5,color:C.azulSoft,background:C.azulBg+'60',padding:'2px 7px',borderRadius:8}}>{t}</span>)}</div>}
      </div>
    );
  }

  const fchip=(key,lbl)=>(
    <button key={key} onClick={()=>setFiltro(key)} style={{display:'flex',alignItems:'center',gap:4,padding:'5px 12px',border:`1px solid ${filtro===key?C.azul:C.linha}`,borderRadius:20,background:filtro===key?C.azul:'#fff',color:filtro===key?'#fff':C.cinza,fontSize:11.5,fontWeight:filtro===key?600:400,cursor:'pointer',fontFamily:'inherit',flexShrink:0}}>
      {lbl}<span style={{fontFamily:'JetBrains Mono,monospace',fontSize:9,opacity:.7,marginLeft:2}}>{counts[key]}</span>
    </button>
  );

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden'}}>
      <div style={{padding:'12px 16px 10px',background:'#fff',borderBottom:`1px solid ${C.linha}`,flexShrink:0}}>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:17,fontWeight:700,color:C.tinta,margin:'0 0 2px'}}>Meu caderno</h2>
        <p style={{fontSize:11,color:C.cinza,margin:'0 0 10px'}}>tudo que você capturou no CCEM 2026</p>
        <div style={{display:'flex',gap:8}}>
          {[['Capturas',captures.length,C.azulBg,C.azul],['Sessões',sessoes,C.verdeBg,C.verde],['Refs',refs,C.ouroBg,C.ouro]].map(([lbl,num,bg,color])=>(
            <div key={lbl} style={{flex:1,background:bg,borderRadius:10,padding:'7px 10px',textAlign:'center'}}>
              <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:20,fontWeight:700,color,lineHeight:1}}>{num}</div>
              <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:8,color,textTransform:'uppercase',letterSpacing:'0.06em',marginTop:2,opacity:.8}}>{lbl}</div>
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
            <p style={{fontSize:12,lineHeight:1.5,margin:0}}>Toque em <strong>Capturar sessão</strong> numa sessão, ou envie algo pelo Assistente.</p>
          </div>
        ):(
          <>
            {bySex.length>0&&<><div style={{fontFamily:'JetBrains Mono,monospace',fontSize:9,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.08em',margin:'2px 0 8px',fontWeight:600}}>Sexta · 23 outubro</div>{bySex.map(c=><NoteCard key={c.id} c={c}/>)}</>}
            {bySab.length>0&&<><div style={{fontFamily:'JetBrains Mono,monospace',fontSize:9,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.08em',margin:'12px 0 8px',fontWeight:600}}>Sábado · 24 outubro</div>{bySab.map(c=><NoteCard key={c.id} c={c}/>)}</>}
            {bsOrphan.length>0&&bsOrphan.map(c=><NoteCard key={c.id} c={c}/>)}
          </>
        )}
      </div>
      {captures.length>0&&<div style={{padding:'9px 12px',background:'#fff',borderTop:`1px solid ${C.linha}`,display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
        <p style={{flex:1,fontSize:11,color:C.cinza,lineHeight:1.4,margin:0}}><strong>Salvo neste dispositivo</strong> · {captures.length} captura{captures.length!==1?'s':''}</p>
        <button onClick={()=>showToast('PDF gerado · '+captures.length+' capturas')} style={{display:'flex',alignItems:'center',gap:5,background:C.azul,color:'#fff',border:'none',borderRadius:8,padding:'7px 14px',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>↓ PDF</button>
      </div>}
    </div>
  );
}

/* ── InfoScreen ─────────────────────────────────────────────── */
function InfoScreen({ section: init }) {
  const [section, setSection] = useState(init||'o-evento');
  const navs=[{id:'o-evento',label:'O Evento'},{id:'inscricoes',label:'Inscrições'},{id:'palestrantes',label:'Palestrantes'},{id:'contato',label:'Contato'}];
  const IC = ({children,style})=><div style={{background:'#fff',borderRadius:12,padding:'13px 14px',margin:'10px 14px 0',border:`1px solid ${C.linhaSoft}`,boxShadow:'0 1px 5px rgba(29,62,138,.04)',...(style||{})}}>{children}</div>;
  const H3 = ({children})=><h3 style={{fontFamily:'Georgia,serif',fontSize:13.5,fontWeight:600,color:C.tinta,marginBottom:8,letterSpacing:'-0.005em',margin:'0 0 8px'}}>{children}</h3>;
  const MR = ({lbl,val})=><div style={{display:'flex',gap:8,fontSize:12.5,color:C.cinza,padding:'6px 0',borderBottom:`1px solid ${C.linhaSoft}`}}><div style={{fontFamily:'JetBrains Mono,monospace',fontSize:9,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.08em',width:68,flexShrink:0,lineHeight:1.6}}>{lbl}</div><div style={{flex:1}}>{val}</div></div>;
  const OP = ({n,r})=><div style={{padding:'7px 0',borderBottom:`1px solid ${C.linhaSoft}`,fontSize:12.5}}><div style={{fontWeight:500,color:C.tinta}}>{n}</div>{r&&<div style={{fontSize:11,color:C.cinza,marginTop:1,fontStyle:'italic'}}>{r}</div>}</div>;
  const CR = ({icon,lbl,val,href})=><div style={{display:'flex',alignItems:'center',gap:11,padding:'9px 0',borderBottom:`1px solid ${C.linhaSoft}`}}>
    <div style={{width:35,height:35,borderRadius:9,background:C.azulBg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:C.azul}}>{icon}</div>
    <div><div style={{fontFamily:'JetBrains Mono,monospace',fontSize:8.5,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:2}}>{lbl}</div><div style={{fontSize:13,fontWeight:500,color:C.tinta}}>{href?<a href={href} target="_blank" rel="noopener" style={{color:C.azul,textDecoration:'none'}}>{val}</a>:val}</div></div>
  </div>;

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden'}}>
      <div style={{display:'flex',gap:5,padding:'8px 12px 6px',overflowX:'auto',borderBottom:`1px solid ${C.linha}`,flexShrink:0,scrollbarWidth:'none'}}>
        {navs.map(n=><button key={n.id} onClick={()=>{ setSection(n.id); go('#/info/'+n.id); }} style={{flexShrink:0,border:`1px solid ${section===n.id?C.azul:C.linha}`,background:section===n.id?C.azul:'#fff',color:section===n.id?'#fff':C.cinza,borderRadius:20,padding:'5px 13px',fontSize:11.5,fontWeight:section===n.id?600:500,cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap'}}>{n.label}</button>)}
      </div>
      <div style={{flex:1,overflowY:'auto',paddingBottom:24}}>

        {section==='o-evento'&&(<>
          <div style={{background:C.azul,color:'#fff',padding:'20px 16px 18px'}}>
            <h2 style={{fontFamily:'Georgia,serif',fontSize:21,fontWeight:600,marginBottom:3,letterSpacing:'-0.01em',lineHeight:1.2,margin:'0 0 3px'}}>12º CCEM 2026</h2>
            <p style={{fontSize:12,opacity:.8,lineHeight:1.4,margin:'0 0 10px'}}>Congresso Catarinense de Endocrinologia e Metabologia</p>
            <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,background:'rgba(255,255,255,.12)',padding:'7px 10px',borderRadius:6,letterSpacing:'0.02em',lineHeight:1.7}}>Expoville · Rua XV de Novembro, 4315 · Joinville/SC<br/>23 e 24 de Outubro de 2026</div>
          </div>
          <IC><H3>Horários</H3><MR lbl="Secretaria" val="Sex 23/10 · 07h30–18h30 · Sáb 24/10 · 07h30–18h00"/><MR lbl="Científica" val="Sex 23/10 · 08h–18h30 · Sáb 24/10 · 08h–18h00"/><MR lbl="Abertura" val="Sexta, 23/10 · 08h00"/></IC>
          <IC><H3>Certificados</H3><p style={{fontSize:12.5,color:C.cinza,lineHeight:1.5,margin:0}}>Disponíveis a partir de <strong>05/11/2026</strong> via CPF — apenas para inscritos presentes.</p></IC>
          <IC><H3>Comissão Organizadora</H3>
            <OP n="Fulvio Clemo Santos Tomaselli" r="Presidente da SBEM-SC"/>
            <OP n="Frederico Guimarães Marchisotti" r="Presidente-Eleito da SBEM-SC"/>
            <OP n="Dalisbor Marcelo Weber Silva" r="Diretor Científico"/>
            <OP n="Carina Gabriela Corrêa Morellato"/><OP n="Fábio Herget Pitanga"/><OP n="Sheila Montano Vega"/>
          </IC>
          <IC><H3>Patrocinadores</H3>
            <div style={{display:'flex',flexWrap:'wrap',gap:14,alignItems:'center',marginTop:4}}>
              {['logos_2026_06_24_11_05_19','logos_2026_06_24_11_05_56','logos_2026_06_24_11_06_34','logos_2026_06_24_11_07_33'].map((f,i)=><img key={i} src={`https://www.ccem2026.com.br/fotos/apoiadores/${f}.jpg`} alt="" style={{height:26,objectFit:'contain',opacity:.82}}/>)}
            </div>
            <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:8.5,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.08em',marginTop:12,marginBottom:5}}>Apoio</div>
            <img src="https://www.ccem2026.com.br/fotos/apoiadores/logos_2026_06_24_11_04_28.jpg" alt="" style={{height:26,objectFit:'contain',opacity:.82}}/>
          </IC>
        </>)}

        {section==='inscricoes'&&(<>
          <div style={{padding:'16px 16px 0'}}><h2 style={{fontFamily:'Georgia,serif',fontSize:20,fontWeight:600,color:C.tinta,margin:0}}>Inscrições</h2></div>
          <IC><H3>Tabela de valores</H3>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:10.5,marginTop:4}}>
                <thead><tr>{['Categoria','até 15/06','até 15/08','até 15/10','Local'].map(h=><th key={h} style={{background:C.azul,color:'#fff',padding:'6px 7px',textAlign:'left',fontSize:9,fontWeight:600,letterSpacing:'0.04em',textTransform:'uppercase'}}>{h}</th>)}</tr></thead>
                <tbody>{[
                  ['Sócio quite (SBEM/SBD/ABESO/ABRASSO)','R$345','R$400','R$460','R$520'],
                  ['Médico não sócio ou sócio não quite','R$575','R$690','R$805','R$920'],
                  ['Residente ou pós-graduando *','R$230','R$255','R$290','R$345'],
                  ['Acadêmico de medicina *','R$230','R$255','R$255','R$290'],
                ].map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j} style={{padding:'6px 7px',borderBottom:`1px solid ${C.linhaSoft}`,color:j===0?C.tinta:C.azul,fontFamily:j>0?'JetBrains Mono,monospace':'inherit',fontSize:j>0?11:10.5,fontWeight:j>0?600:400,lineHeight:1.4}}>{cell}</td>)}</tr>)}</tbody>
              </table>
            </div>
            <p style={{fontSize:10,color:C.cinza,marginTop:7,margin:'7px 0 0'}}>* Enviar comprovação para contato@ccem2026.com.br</p>
          </IC>
          <IC><H3>Pagamento</H3><p style={{fontSize:12.5,color:C.cinza,lineHeight:1.5,margin:0}}>Cartão de crédito/débito (Cielo), depósito, transferência ou PIX. Valores válidos até as 22h do vencimento de cada lote.</p></IC>
          <div style={{padding:'10px 14px 0'}}>
            <a href="https://www.ccem2026.com.br/cadastro/" target="_blank" rel="noopener" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:C.azul,color:'#fff',border:'none',borderRadius:10,padding:'12px 20px',fontSize:13,fontWeight:600,textDecoration:'none'}}>
              <IcoLink size={15} color="#fff"/> Inscreva-se no site oficial
            </a>
          </div>
        </>)}

        {section==='palestrantes'&&(<>
          <div style={{padding:'16px 16px 0'}}><h2 style={{fontFamily:'Georgia,serif',fontSize:20,fontWeight:600,color:C.tinta,margin:0}}>Palestrantes</h2></div>
          <IC>{[['AL','Amanda Meneses Ferreira Lacombe','Itajaí · SC'],['AP','Amely Pereira Silva Balthazar','Florianópolis · SC'],['CO','Cleo Otaviano Mesa Jr.','Curitiba · PR'],['DD','Demelise Demczuk','Joinville · SC'],['FT','Fulvio Clemo Santos Tomaselli','Blumenau · SC'],['GR','Goretti Silveira Rodrigues','Joinville · SC'],['JA','Julia Goulart Appel','Joinville · SC'],['JM','Júlia Vieira Oberger Marques','Itajaí · SC'],['LP','Luciana Muniz Pechmann','Curitiba · PR'],['MG','Milena Gurgel Teles Bezerra','São Paulo · SP'],['SV','Sheila Montano Vega','Florianópolis · SC'],['SK','Suely Keiko Kohara','Joinville · SC'],['TT','Talita Letícia Trevisan','Itajaí · SC']].map(([ini,name,city])=>(
            <div key={name} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:`1px solid ${C.linhaSoft}`}}>
              <div style={{width:33,height:33,borderRadius:'50%',background:C.azulBg,color:C.azul,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Georgia,serif',fontSize:11,fontWeight:600,flexShrink:0}}>{ini}</div>
              <div><div style={{fontSize:12.5,fontWeight:500,color:C.tinta}}>{name}</div><div style={{fontFamily:'JetBrains Mono,monospace',fontSize:9,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.06em',marginTop:2}}>{city}</div></div>
            </div>
          ))}</IC>
          <p style={{fontSize:10.5,color:C.cinza,textAlign:'center',padding:'10px 16px 0',margin:0}}>
            <a href="https://www.ccem2026.com.br/palestrantes" target="_blank" rel="noopener" style={{color:C.azul,textDecoration:'none'}}>ver todos com foto no site oficial ↗</a>
          </p>
        </>)}

        {section==='contato'&&(<>
          <div style={{padding:'16px 16px 0'}}><h2 style={{fontFamily:'Georgia,serif',fontSize:20,fontWeight:600,color:C.tinta,margin:0}}>Contato</h2></div>
          <IC>
            <CR icon={<IcoPhone size={17}/>} lbl="WhatsApp" val="(47) 99130-3330" href="https://wa.me/5547991303330"/>
            <CR icon={<IcoMail size={17}/>}  lbl="E-mail"    val="contato@ccem2026.com.br" href="mailto:contato@ccem2026.com.br"/>
            <CR icon={<IcoGlobe size={17}/>} lbl="Site"      val="ccem2026.com.br" href="https://ccem2026.com.br"/>
            <CR icon={<IcoInsta size={17}/>} lbl="Instagram" val="@sbemsceventos" href="https://instagram.com/sbemsceventos"/>
            <div style={{display:'flex',alignItems:'center',gap:11,padding:'9px 0'}}>
              <div style={{width:35,height:35,borderRadius:9,background:C.azulBg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:C.azul}}><IcoCal size={17}/></div>
              <div><div style={{fontFamily:'JetBrains Mono,monospace',fontSize:8.5,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:2}}>Agenda</div><a href="https://www.ccem2026.com.br/agenda/" target="_blank" rel="noopener" style={{fontSize:13,fontWeight:500,color:C.azul,textDecoration:'none'}}>Adicionar ao calendário</a></div>
            </div>
          </IC>
          <IC>
            <H3>Seus dados locais</H3>
            <p style={{fontSize:12.5,color:C.cinza,lineHeight:1.5,margin:'0 0 10px'}}>Armazenado apenas neste dispositivo.</p>
            <div style={{display:'flex',alignItems:'center',gap:8,padding:'7px 0',borderTop:`1px solid ${C.linhaSoft}`,marginBottom:10}}>
              <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:9,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.06em'}}>ID local</span>
              <code style={{fontFamily:'JetBrains Mono,monospace',fontSize:10.5,color:C.tinta,background:'#f0f4fc',padding:'2px 7px',borderRadius:5}}>{window.CCEM_USER_ID||'—'}</code>
            </div>
            <button onClick={()=>{if(confirm('Limpar dados deste dispositivo?')){localStorage.removeItem(window.CCEM_STATE_KEY);localStorage.removeItem('ccem2026:userId');location.reload();}}} style={{width:'100%',border:'1px solid #e53e3e',background:'#fff',color:'#e53e3e',borderRadius:8,padding:'8px',fontSize:12.5,fontWeight:500,cursor:'pointer',fontFamily:'inherit'}}>
              Limpar todos os meus dados
            </button>
          </IC>
          <div style={{textAlign:'center',padding:'16px 16px 0',fontFamily:'JetBrains Mono,monospace',fontSize:9.5,color:C.cinza,lineHeight:1.8}}>
            <div>Meu CCEM 2026 · v3.0</div>
            <div style={{fontStyle:'italic',opacity:.5}}>Ferramenta experimental · ccem2026.com.br</div>
          </div>
        </>)}

      </div>
    </div>
  );
}

/* ── SiteBar / AppHeader / LiveStrip / TabBar / AppShell ────── */
function SiteBar(){
  return <div style={{background:C.azul,color:'rgba(255,255,255,.82)',fontFamily:'JetBrains Mono,monospace',fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',padding:'5px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
    <span style={{display:'flex',alignItems:'center',gap:6}}><span style={{width:5,height:5,borderRadius:'50%',background:C.ouro,display:'inline-block'}}/>ccem2026.com.br</span>
    <a href="https://www.ccem2026.com.br" target="_blank" rel="noopener" style={{color:'rgba(255,255,255,.6)',textDecoration:'none',borderBottom:'1px solid rgba(255,255,255,.2)',paddingBottom:1,fontSize:8.5}}>Site oficial ↗</a>
  </div>;
}
function LiveStrip(){
  const [st, setSt] = useState(()=>ccemLiveStatus());
  useEffect(()=>{
    const id=setInterval(()=>setSt(ccemLiveStatus()),30000);
    return ()=>clearInterval(id);
  },[]);
  const dotColors={live:'#22c55e',soon:C.ouro,upcoming:C.cinza,past:C.linha};
  const bg={live:'#eef6ff',soon:'#fef9ec',upcoming:'#f5f7fb',past:'#f5f7fb'};
  return <div style={{display:'flex',alignItems:'center',gap:7,margin:'8px 0 0',padding:'5px 8px',background:bg[st.kind]||'#f5f7fb',borderRadius:7,border:`1px solid ${C.linhaSoft}`}}>
    <span style={{width:6,height:6,borderRadius:'50%',background:dotColors[st.kind],flexShrink:0,boxShadow:st.kind==='live'?'0 0 0 3px rgba(34,197,94,.2)':'none'}}/>
    <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:8.5,color:st.kind==='live'?C.azulSoft:C.cinza,textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:700,flexShrink:0}}>{st.tag}</span>
    <span style={{fontSize:11.5,color:C.tinta,fontWeight:500,flex:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{st.text}</span>
    <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:9,color:C.cinza,flexShrink:0}}>{st.time}</span>
  </div>;
}
function AppHeader(){
  return <div style={{padding:'10px 16px 8px',background:'#fff',borderBottom:`1px solid ${C.linha}`,flexShrink:0}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <img src="https://www.ccem2026.com.br/images/logo_2x.png" alt="CCEM 2026" style={{height:28,objectFit:'contain'}}
          onError={e=>{e.target.style.display='none';if(e.target.nextSibling)e.target.nextSibling.style.display='flex';}}/>
        <div style={{display:'none',alignItems:'baseline',gap:4}}>
          <span style={{fontFamily:'Georgia,serif',fontWeight:700,fontSize:17,color:C.azul,letterSpacing:'-0.02em'}}>CCEM</span>
          <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,color:C.ouro,letterSpacing:'0.08em'}}>2026</span>
        </div>
      </div>
      <div style={{textAlign:'right',flexShrink:0}}>
        <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:9,color:C.cinza,letterSpacing:'0.05em',textTransform:'uppercase'}}>23–24 OUT · Joinville/SC</div>
        <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:8.5,color:C.ouro,letterSpacing:'0.04em',marginTop:1}}>Expoville</div>
      </div>
    </div>
    <LiveStrip/>
  </div>;
}
function TabBar({ aba }){
  const tabs=[{id:'programa',icon:<IcoCal size={21}/>,lbl:'Programa'},{id:'assistente',icon:<IcoChat size={21}/>,lbl:'Assistente'},{id:'trabalhos',icon:<svg width='21' height='21' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'><rect x='3' y='3' width='18' height='14' rx='2'/><path d='M3 10h18M8 17v4M16 17v4M6 21h12'/></svg>,lbl:'Trabalhos'},{id:'caderno',icon:<IcoBook size={21}/>,lbl:'Caderno'},{id:'info',icon:<IcoInfo size={21}/>,lbl:'Info'}];
  return <nav style={{display:'flex',background:'#fff',borderTop:`1px solid ${C.linha}`,flexShrink:0}}>
    {tabs.map(t=>{const on=aba===t.id;return<button key={t.id} onClick={()=>go('#/'+t.id)} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3,padding:'8px 0 10px',border:'none',background:'none',cursor:'pointer',color:on?C.azul:C.cinza,transition:'color .15s'}}>
      {t.icon}<span style={{fontFamily:'DM Sans,sans-serif',fontSize:9.5,fontWeight:on?600:400}}>{t.lbl}</span>
    </button>;})}
  </nav>;
}
function AppShell({ showShell, aba, children }){
  return <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',minHeight:0}}>
    {showShell?(<><SiteBar/><AppHeader/><div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column',minHeight:0}}>{children}</div><TabBar aba={aba}/></>):children}
  </div>;
}

Object.assign(window, {
  AppShell, SiteBar, AppHeader, LiveStrip, TabBar,
  DayTimeline, SpeakerBioModal, BriefingQuiz,
  ProgramaScreen, SessaoDetail, AssistenteScreen, TrabalhosScreen, CadernoScreen, InfoScreen,
  BadgePill, TopicPill, IntervalRow, SessaoCard,
});
