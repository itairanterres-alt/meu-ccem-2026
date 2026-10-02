/* ============================================================
   Meu CCEM 2026 — Recursos sobre a foto do slide (Fase 1)
   ------------------------------------------------------------
   - "Perguntar sobre este slide": atalhos + pergunta livre, sempre
     com a foto como contexto; respostas guardadas na nota (pedir de
     novo o mesmo atalho não gera novo custo).
   - "Encontrar o artigo": referência lida e editável → PubMed →
     confirmada / possível / não localizado → acesso ao texto.
   - "Organizar para busca": título, texto e palavras-chave na nota.
   Nada vai à IA sem um toque do congressista. Tudo é mostrado como
   texto, nunca como HTML.
   ============================================================ */

const CCEM_ATALHOS = [
  { acao:'explicar',        rotulo:'Explique este gráfico/tabela' },
  { acao:'raciocinio',      rotulo:'Explique o raciocínio' },
  { acao:'concluir',        rotulo:'O que este resultado permite concluir?' },
  { acao:'leitura_critica', rotulo:'Leitura crítica do estudo' },
  { acao:'tabela',          rotulo:'Tabela em texto' },
  { acao:'fluxograma',      rotulo:'Fluxograma passo a passo' },
  { acao:'transcrever',     rotulo:'Transcrever e explicar siglas' },
  { acao:'perguntas',       rotulo:'Sugerir perguntas ao palestrante' },
];
const CCEM_TITULO_ITENS = { tabela:'Tabela', fluxograma:'Passo a passo', perguntas:'Perguntas sugeridas', leitura_critica:'Pontos da leitura crítica' };
const CCEM_AVISO_FOTO_IA = 'Ao usar estes recursos, a foto é enviada à Anthropic (EUA) para processamento; o app não guarda cópia no servidor. Não envie imagem identificável de paciente.';

/* POST com mensagens de erro em português. */
async function ccemPost(url, corpo, tempoMs) {
  try {
    const res = await ccemFetchIA(url, { ...corpo, userId: window.CCEM_USER_ID }, tempoMs || 32000);
    if (res.ok) return { dados: await res.json() };
    if (res.status === 401) return { aviso: CCEM_AVISO_LOGIN };
    if ([404, 405, 501, 503].includes(res.status)) return { aviso: CCEM_EM_TESTES };
    if (res.status === 429) return { aviso: 'Você chegou ao limite diário deste recurso. Ele volta amanhã.' };
    if (res.status === 504) return { aviso: 'A IA demorou demais para responder. Tente de novo.' };
    if (res.status === 413) return { aviso: 'A foto não pôde ser enviada. Tente fotografar de novo.' };
    return { aviso: 'Não foi possível responder agora. Tente de novo.' };
  } catch (e) {
    return { aviso: e && e.name === 'AbortError' ? 'A IA demorou demais para responder. Tente de novo.'
                                                 : 'Sem conexão com a internet. A foto continua salva; tente quando a rede voltar.' };
  }
}

async function ccemFotoBase64(nota) {
  if (!nota || !nota.foto) return null;
  try { const d = await ccemFotoLer(nota.foto); return d && CCEM_FOTO_VALIDA.test(d) ? d.split(',')[1] : null; }
  catch (e) { return null; }
}
const ccemNotaAtual = id => (_ccemStore.state.captures || []).find(c => c.id === id);

function ccemRespostaSlideEmTexto(r) {
  return [r.no_slide, (r.itens || []).join('\n'), r.explicacao, r.limites].filter(Boolean).join('\n\n');
}

/* Guarda título/texto/palavras-chave na nota, para a busca no Caderno. */
function ccemGuardarIndice(id, r) {
  if (!r || !r.titulo) return;
  updateAppState(st => {
    const n = (st.captures || []).find(c => c.id === id);
    if (!n) return;
    n.indice = { titulo: r.titulo, texto: r.texto_extraido || '', palavras: r.palavras_chave || [] };
    if (r.referencia && !n.refLida) n.refLida = r.referencia;
  });
}

async function ccemAcaoSlide(id, { acao, rotulo, pergunta, aprofundar }) {
  const nota = ccemNotaAtual(id);
  const imagem = await ccemFotoBase64(nota);
  if (!imagem) return { aviso: 'A foto desta nota não está disponível neste aparelho.' };
  const historico = (nota.respostas || []).slice(-4).map(x => ({ pergunta: x.rotulo, resposta: ccemRespostaSlideEmTexto(x.r) }));
  const artigo = nota.artigo ? { titulo: nota.artigo.titulo, revista: nota.artigo.revista, ano: nota.artigo.ano, resumo: nota.artigo.resumo } : undefined;
  const { dados, aviso } = await ccemPost('/api/slide', { acao, imagem, pergunta, aprofundar: !!aprofundar, sessaoId: nota.sessaoId, historico, artigo });
  if (aviso) return { aviso };
  const { fonte, recusa, ...r } = dados;
  const ok = updateAppState(st => {
    const n = (st.captures || []).find(c => c.id === id);
    if (!n) return;
    n.respostas = [...(n.respostas || []), { id: 'r_' + Date.now().toString(36), acao, rotulo, r, fonte, aprofundada: !!aprofundar, ts: Date.now() }].slice(-30);
  });
  if (!recusa) ccemGuardarIndice(id, r);
  if (!ok) showToast('Resposta exibida, mas não foi possível salvá-la neste aparelho');
  return { ok: true };
}

async function ccemOrganizarNota(id) {
  const imagem = await ccemFotoBase64(ccemNotaAtual(id));
  if (!imagem) return { aviso: 'sem foto' };
  const { dados, aviso } = await ccemPost('/api/slide', { acao:'organizar', imagem }, 25000);
  if (aviso) return { aviso };
  ccemGuardarIndice(id, dados);
  return { ok: true };
}

/* Fala o texto em voz alta, pelo próprio aparelho (sem custo). */
function ccemFalar(texto) {
  try {
    if (!window.speechSynthesis) { showToast('Este aparelho não oferece leitura em voz alta'); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'pt-BR';
    window.speechSynthesis.speak(u);
  } catch (e) { showToast('Não foi possível ler em voz alta'); }
}

/* Folha que sobe da base, desenhada direto no <body>. */
function FolhaBase({ titulo, aoFechar, altura, children, rodape }) {
  useEffect(() => {
    const esc = e => { if (e.key === 'Escape') aoFechar(); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);
  return ReactDOM.createPortal(
    <div className="ccem-painel" onClick={aoFechar}
      style={{position:'fixed',inset:0,zIndex:340,background:'rgba(10,18,50,.38)',display:'flex',flexDirection:'column',justifyContent:'flex-end'}}>
      <div role="dialog" aria-modal="true" aria-label={titulo} onClick={e=>e.stopPropagation()}
        style={{height:altura||'90%',width:'100%',maxWidth:600,margin:'0 auto',display:'flex',flexDirection:'column',background:'#fff',
          borderRadius:'18px 18px 0 0',boxShadow:'0 -6px 32px rgba(10,18,50,.22)',paddingBottom:'env(safe-area-inset-bottom)'}}>
        <div style={{display:'flex',alignItems:'center',padding:'6px 6px 6px 16px',borderBottom:`1px solid ${C.linhaSoft}`,flexShrink:0}}>
          <h2 style={{flex:1,margin:0,fontFamily:'Georgia,serif',fontSize:17,color:C.tinta}}>{titulo}</h2>
          <button autoFocus onClick={aoFechar} aria-label="Fechar" style={{width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',background:'none',border:'none',cursor:'pointer',color:C.cinza,padding:0}}><IcoX size={20}/></button>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:'12px 14px',background:'#f3f6fc'}}>{children}</div>
        {rodape}
      </div>
    </div>,
    document.body
  );
}

const BLOCO_TIT = { fontFamily:'DM Sans,system-ui,sans-serif', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:3 };

/* Uma resposta sobre o slide, em blocos. */
function RespostaSlide({ item, aoAprofundar, aoEncontrarArtigo, ocupado }) {
  const r = item.r || {};
  const bloco = (titulo, cor, conteudo, extra) => conteudo ? (
    <div style={{marginTop:8,padding:'8px 10px',background:'#fff',borderLeft:`3px solid ${cor}`,borderRadius:6}}>
      <div style={{...BLOCO_TIT,color:cor}}>{titulo}{extra}</div>
      {conteudo}
    </div>
  ) : null;
  const txt = t => <div style={{fontSize:13,color:C.tinta,lineHeight:1.5,whiteSpace:'pre-wrap'}}>{t}</div>;
  return (
    <div style={{background:'#eef3fb',border:`1px solid ${C.linhaSoft}`,borderRadius:12,padding:'10px 12px',marginBottom:12}}>
      <div style={{fontSize:13,fontWeight:700,color:C.azul}}>{item.rotulo}{item.aprofundada?' · aprofundado':''}</div>
      {bloco('No slide', C.azul, r.no_slide && txt(r.no_slide))}
      {bloco(CCEM_TITULO_ITENS[item.acao] || 'Itens', C.azul, (r.itens||[]).length>0 && (
        <ol style={{margin:'2px 0 0',paddingLeft:20,fontSize:13,color:C.tinta,lineHeight:1.5}}>{r.itens.map((x,i)=><li key={i} style={{marginBottom:3}}>{x}</li>)}</ol>))}
      {item.acao==='transcrever' && bloco('Texto do slide', C.azul, r.texto_extraido && txt(r.texto_extraido))}
      {item.acao==='transcrever' && r.texto_extraido && (
        <button onClick={()=>ccemFalar(r.texto_extraido + '. ' + (r.siglas||[]).map(s=>`${s.sigla}: ${s.significado}`).join('. '))}
          style={{marginTop:6,minHeight:44,padding:'0 14px',background:'#fff',border:`1px solid ${C.linha}`,borderRadius:9,fontFamily:'DM Sans,sans-serif',fontSize:13,fontWeight:600,color:C.azul,cursor:'pointer'}}>Ouvir em voz alta</button>
      )}
      {bloco('Siglas', C.azul, (r.siglas||[]).length>0 && (
        <div style={{fontSize:13,color:C.tinta,lineHeight:1.5}}>{r.siglas.map((s,i)=><div key={i}><b>{s.sigla}</b> — {s.significado}</div>)}</div>))}
      {bloco('Explicação adicional', '#0f766e', r.explicacao && txt(r.explicacao), <span style={{fontWeight:400,textTransform:'none',letterSpacing:0}}> · não está no slide</span>)}
      {bloco('Limites da interpretação', '#9a3412', r.limites && txt(r.limites))}
      {r.referencia && (
        <div style={{marginTop:8,fontSize:12.5,color:C.cinza,lineHeight:1.45}}>
          Referência no slide: {r.referencia}
          {aoEncontrarArtigo && <button onClick={()=>aoEncontrarArtigo(r.referencia)} style={{display:'block',marginTop:4,minHeight:44,padding:'0 12px',background:'#fff',border:`1px solid ${C.linha}`,borderRadius:9,fontFamily:'DM Sans,sans-serif',fontSize:13,fontWeight:600,color:C.azul,cursor:'pointer'}}>Encontrar este artigo</button>}
        </div>
      )}
      <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,marginTop:8}}>{item.fonte} Gerado por IA — confira na fonte.</div>
      {!item.aprofundada && aoAprofundar && (
        <button onClick={aoAprofundar} disabled={ocupado}
          style={{marginTop:6,minHeight:44,padding:'0 14px',background:'#fff',border:`1px solid ${C.linha}`,borderRadius:9,fontFamily:'DM Sans,sans-serif',fontSize:13,fontWeight:600,color:C.azul,cursor:'pointer',opacity:ocupado?0.5:1}}>Aprofundar</button>
      )}
    </div>
  );
}

/* ── "Perguntar sobre este slide" ───────────────────────────── */
function PainelSlide({ notaId, aoFechar }) {
  const appState = useAppState();
  const nota = (appState.captures || []).find(c => c.id === notaId);
  const foto = useFoto(nota && nota.foto);
  const [pergunta, setPergunta] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [artigoRef, setArtigoRef] = useState(null);
  const fimRef = useRef(null);
  const respostas = (nota && nota.respostas) || [];
  useEffect(() => { const el = fimRef.current; if (el) el.scrollIntoView({ block:'end' }); }, [respostas.length, ocupado]);
  if (!nota) return null;
  const s = SESSOES[nota.sessaoId];

  async function pedir(acao, rotulo, extra) {
    if (ocupado) return;
    const ja = acao !== 'livre' && !(extra && extra.aprofundar) && respostas.find(x => x.acao === acao && !x.aprofundada);
    if (ja) { showToast('Já respondido — sem novo custo'); document.getElementById('resp-' + ja.id)?.scrollIntoView({ block:'start' }); return; }
    setOcupado(true);
    const r = await ccemAcaoSlide(notaId, { acao, rotulo, ...extra });
    setOcupado(false);
    if (r.aviso) showToast(r.aviso);
  }
  function enviarLivre() {
    const v = pergunta.trim(); if (!v) return;
    setPergunta('');
    pedir('livre', v, { pergunta: v });
  }

  return (
    <FolhaBase titulo="Perguntar sobre este slide" aoFechar={aoFechar}
      rodape={
        <div style={{flexShrink:0,background:'#fff',borderTop:`1px solid ${C.linhaSoft}`,padding:'6px 12px 10px'}}>
          <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,lineHeight:1.4,margin:'0 2px 6px'}}>{CCEM_AVISO_FOTO_IA}</div>
          <div style={{display:'flex',gap:7}}>
            <input value={pergunta} onChange={e=>setPergunta(e.target.value)} onKeyDown={e=>e.key==='Enter'&&enviarLivre()} maxLength={1000}
              placeholder="Pergunte sobre este slide…" aria-label="Pergunta sobre este slide"
              style={{flex:1,minWidth:0,minHeight:44,padding:'8px 14px',border:`1px solid ${C.linha}`,borderRadius:24,fontFamily:'DM Sans,sans-serif',fontSize:16,color:C.tinta,background:'#f8fafd',outline:'none'}}/>
            <button onClick={enviarLivre} aria-label="Enviar" disabled={ocupado||!pergunta.trim()}
              style={{width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',border:'none',background:C.azul,opacity:(ocupado||!pergunta.trim())?0.45:1,borderRadius:12,cursor:'pointer',padding:0}}><IcoSend size={17} color="#fff"/></button>
          </div>
        </div>
      }>
      <div style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:12}}>
        {foto&&<img src={foto} alt="Slide" style={{width:110,borderRadius:8,border:`1px solid ${C.linhaSoft}`,flexShrink:0}}/>}
        <div style={{fontSize:12.5,color:C.cinza,lineHeight:1.45}}>
          {s ? ccemRotulo(s) : 'Sem sessão'}{s&&s.tipo==='satelite'?' · sessão patrocinada':''}
          {nota.artigo&&<div style={{marginTop:4,color:C.tinta}}>Artigo vinculado: {nota.artigo.autores[0]} · {nota.artigo.revista} {nota.artigo.ano}. As respostas usam também o resumo dele.</div>}
        </div>
      </div>
      {respostas.map(item=>(
        <div key={item.id} id={'resp-'+item.id}>
          <RespostaSlide item={item} ocupado={ocupado}
            aoAprofundar={()=>pedir(item.acao, item.rotulo, { aprofundar:true, pergunta: item.acao==='livre' ? item.rotulo : undefined })}
            aoEncontrarArtigo={ref=>setArtigoRef(ref)}/>
        </div>
      ))}
      {ocupado&&(
        <div role="status" aria-label="A IA está respondendo" style={{display:'flex',gap:4,padding:'10px 12px',background:'#fff',borderRadius:12,width:60,border:`1px solid ${C.linhaSoft}`,marginBottom:12}}>
          {[0,1,2].map(i=><span key={i} style={{width:7,height:7,borderRadius:'50%',background:C.cinza,display:'inline-block',animation:`ccem-bounce .9s ${i*.2}s ease-in-out infinite`}}/>)}
        </div>
      )}
      <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
        {CCEM_ATALHOS.map(a=>{
          const feito = respostas.some(x=>x.acao===a.acao);
          return (
            <button key={a.acao} onClick={()=>pedir(a.acao, a.rotulo)} disabled={ocupado}
              style={{minHeight:44,display:'flex',alignItems:'center',gap:6,background:feito?C.azulBg:'#fff',border:`1px solid ${feito?C.azulBg:C.linha}`,borderRadius:22,padding:'0 14px',cursor:'pointer',fontFamily:'DM Sans,sans-serif',fontSize:12.5,fontWeight:500,color:C.azul,opacity:ocupado?0.55:1}}>
              {feito&&<IcoCheck size={14} color={C.azul}/>}{a.rotulo}
            </button>
          );
        })}
      </div>
      <div ref={fimRef}/>
      {artigoRef!==null&&<FolhaArtigo notaId={notaId} textoInicial={artigoRef} aoFechar={()=>setArtigoRef(null)}/>}
    </FolhaBase>
  );
}

/* ── "Encontrar o artigo citado" ─────────────────────────────── */
const CCEM_NIVEL = {
  confirmada:     { cor:'#15803d', fundo:'#ecfdf3', texto:'Correspondência confirmada pelos identificadores (autor, ano, volume e página, ou DOI/PMID).' },
  possivel:       { cor:'#9a3412', fundo:'#fff4e5', texto:'Possível correspondência: confira título, autores e ano antes de usar.' },
  nao_localizado: { cor:C.cinza,   fundo:'#f5f7fb', texto:'Não localizado no PubMed com esta referência. Corrija o texto acima ou procure no Google Acadêmico.' },
  sem_referencia: { cor:C.cinza,   fundo:'#f5f7fb', texto:'Nenhuma referência visível neste slide. Se souber qual é, digite acima e busque.' },
  erro_pubmed:    { cor:C.cinza,   fundo:'#f5f7fb', texto:'O PubMed não respondeu agora. Tente de novo em instantes.' },
};

function CartaoArtigo({ a, aoGuardar, guardado }) {
  const BTN = { minHeight:44, display:'inline-flex', alignItems:'center', padding:'0 12px', borderRadius:9, fontFamily:'DM Sans,sans-serif', fontSize:13, fontWeight:600, textDecoration:'none', cursor:'pointer' };
  const autores = a.autores.slice(0,3).join(', ') + (a.autores.length > 3 ? ' et al.' : '');
  return (
    <div style={{background:'#fff',border:`1px solid ${C.linhaSoft}`,borderRadius:12,padding:'10px 12px',marginBottom:10}}>
      <div style={{fontSize:14,fontWeight:700,color:C.tinta,lineHeight:1.35}}>{a.titulo}</div>
      <div style={{fontSize:12.5,color:C.cinza,marginTop:3,lineHeight:1.4}}>{autores}<br/>{a.revista} {a.ano}{a.volume?`;${a.volume}`:''}{a.paginas?`:${a.paginas}`:''} · PMID {a.pmid}</div>
      <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,fontWeight:700,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.06em',margin:'10px 0 4px'}}>Acessar texto completo</div>
      <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
        {a.links.pdf&&<a href={a.links.pdf} target="_blank" rel="noopener" style={{...BTN,background:C.azul,color:'#fff'}}>PDF disponível</a>}
        {!a.links.pdf&&a.links.aberto&&<a href={a.links.aberto} target="_blank" rel="noopener" style={{...BTN,background:C.azul,color:'#fff'}}>Texto aberto</a>}
        {a.links.pmc&&<a href={a.links.pmc} target="_blank" rel="noopener" style={{...BTN,background:'#fff',color:C.azul,border:`1px solid ${C.linha}`}}>PubMed Central</a>}
        <a href={a.links.pubmed} target="_blank" rel="noopener" style={{...BTN,background:'#fff',color:C.azul,border:`1px solid ${C.linha}`}}>Ver no PubMed</a>
        {a.links.revista&&<a href={a.links.revista} target="_blank" rel="noopener" style={{...BTN,background:'#fff',color:C.azul,border:`1px solid ${C.linha}`}}>Abrir na revista</a>}
      </div>
      {!a.links.pdf&&!a.links.aberto&&<div style={{fontSize:12,color:C.cinza,marginTop:6}}>Não há versão aberta conhecida; o acesso pode depender de assinatura da revista.</div>}
      {aoGuardar&&(
        <button onClick={aoGuardar} disabled={guardado}
          style={{...BTN,marginTop:10,width:'100%',justifyContent:'center',background:guardado?C.azulBg:'#fff',color:C.azul,border:`1px solid ${guardado?C.azulBg:C.linha}`}}>
          {guardado?'Vinculado a esta nota':'É este — vincular à nota'}
        </button>
      )}
    </div>
  );
}

function FolhaArtigo({ notaId, textoInicial, aoFechar }) {
  const appState = useAppState();
  const nota = (appState.captures || []).find(c => c.id === notaId);
  const [texto, setTexto] = useState(textoInicial || (nota && (nota.refLida || '')) || '');
  const [res, setRes] = useState(null);
  const [ocupado, setOcupado] = useState(false);

  async function buscar(comTexto) {
    setOcupado(true);
    let corpo;
    if (comTexto && texto.trim()) corpo = { texto: texto.trim() };
    else { const imagem = await ccemFotoBase64(nota); if (!imagem) { setOcupado(false); showToast('A foto desta nota não está disponível'); return; } corpo = { imagem }; }
    const { dados, aviso } = await ccemPost('/api/referencia', corpo, 32000);
    setOcupado(false);
    if (aviso) { showToast(aviso); return; }
    setRes(dados);
    if (dados.lido) {
      setTexto(dados.lido);
      updateAppState(st => { const n = (st.captures||[]).find(c => c.id === notaId); if (n) n.refLida = dados.lido; });
    }
  }
  useEffect(() => { if (nota && !nota.artigo) buscar(!!texto.trim()); }, []);
  if (!nota) return null;

  function vincular(a, nivel) {
    const ok = updateAppState(st => { const n = (st.captures||[]).find(c => c.id === notaId); if (n) n.artigo = { ...a, nivel, vinculadoEm: Date.now() }; });
    showToast(ok ? 'Artigo vinculado à nota' : 'Não foi possível salvar neste aparelho');
  }
  const nivel = res && CCEM_NIVEL[res.nivel];
  return (
    <FolhaBase titulo="Encontrar o artigo citado" aoFechar={aoFechar}>
      {nota.artigo&&!res&&(
        <>
          <div style={{fontSize:12.5,color:C.cinza,marginBottom:8}}>Artigo já vinculado a esta nota:</div>
          <CartaoArtigo a={nota.artigo}/>
        </>
      )}
      <label htmlFor="ccem-ref" style={{display:'block',fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,marginBottom:4}}>Referência lida no slide (pode corrigir)</label>
      <textarea id="ccem-ref" value={texto} onChange={e=>setTexto(e.target.value)} rows={3} placeholder="Ex.: Funder JW et al. J Clin Endocrinol Metab 2016;101:1889"
        style={{width:'100%',boxSizing:'border-box',padding:'8px 10px',border:`1px solid ${C.linha}`,borderRadius:10,fontFamily:'DM Sans,sans-serif',fontSize:16,color:C.tinta,background:'#fff',resize:'vertical'}}/>
      <button onClick={()=>buscar(true)} disabled={ocupado||!texto.trim()}
        style={{width:'100%',minHeight:44,margin:'8px 0 12px',background:C.azul,color:'#fff',border:'none',borderRadius:10,fontFamily:'DM Sans,sans-serif',fontSize:14,fontWeight:700,cursor:'pointer',opacity:(ocupado||!texto.trim())?0.5:1}}>
        {ocupado?'Procurando no PubMed…':'Buscar no PubMed'}
      </button>
      {nivel&&(
        <div role="status" style={{padding:'8px 10px',background:nivel.fundo,borderLeft:`3px solid ${nivel.cor}`,borderRadius:7,fontSize:13,color:nivel.cor,lineHeight:1.45,marginBottom:10}}>
          {nivel.texto}
          {(res.nivel==='nao_localizado'||res.nivel==='possivel')&&texto.trim()&&(
            <a href={'https://scholar.google.com/scholar?q='+encodeURIComponent(texto.trim())} target="_blank" rel="noopener" style={{display:'block',marginTop:4,color:C.azul,fontWeight:600}}>Procurar no Google Acadêmico</a>
          )}
        </div>
      )}
      {res&&(res.candidatos||[]).map(a=>(
        <CartaoArtigo key={a.pmid} a={a} aoGuardar={()=>vincular(a, res.nivel)} guardado={nota.artigo&&nota.artigo.pmid===a.pmid}/>
      ))}
      <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,lineHeight:1.45,marginTop:6}}>
        Busca no PubMed (NCBI). "PDF disponível" só aparece quando há versão aberta e legal localizada (Unpaywall/PubMed Central). Vincular o artigo faz as respostas sobre o slide usarem também o resumo dele — nunca o texto integral.
      </div>
    </FolhaBase>
  );
}

Object.assign(window, {
  CCEM_ATALHOS, ccemAcaoSlide, ccemOrganizarNota, ccemFalar, PainelSlide, FolhaArtigo, RespostaSlide, CartaoArtigo, FolhaBase,
});
