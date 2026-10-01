/* ============================================================
   Meu CCEM 2026 — Caderno
   ------------------------------------------------------------
   A nota nasce e fica no aparelho, sem depender de internet nem
   da IA: escrever ou fotografar → salvar. "Resumir com IA" é
   opcional e fica separado do texto original.
   - Texto e marcações: localStorage (via updateAppState).
   - Fotos: IndexedDB, só neste aparelho (localStorage é pequeno
     demais para imagens).
   - Exportar / imprimir: para ler. Backup (.json): para restaurar
     em outro aparelho ou depois do congresso.
   ============================================================ */

/* Data e hora em Joinville a partir do instante salvo na nota. */
function ccemDataHoraJoinville(ts) {
  const iso = new Date(ts - 3*3600000).toISOString();   // UTC−3 fixo
  return { data: iso.slice(8,10)+'/'+iso.slice(5,7)+'/'+iso.slice(0,4), hora: iso.slice(11,16) };
}

/* Corpo da nota como texto. Notas de versões antigas guardavam HTML:
   viram texto aqui, para nada ser interpretado como código. */
function ccemNotaEmTexto(body) {
  return String(body||'').replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]*>/g,'')
    .replace(/&nbsp;/g,' ').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&amp;/g,'&');
}

const CCEM_FOTO_VALIDA = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;

/* ── Fotos no IndexedDB ──────────────────────────────────────── */
let _ccemFotosDb = null;
function ccemFotosDb() {
  if (!_ccemFotosDb) {
    _ccemFotosDb = new Promise((resolve, reject) => {
      if (!window.indexedDB) return reject(new Error('sem-indexeddb'));
      const r = indexedDB.open('ccem2026-fotos', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('fotos');
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
      r.onblocked = () => reject(new Error('bloqueado'));
    });
    _ccemFotosDb.catch(() => { _ccemFotosDb = null; });
  }
  return _ccemFotosDb;
}
function _ccemFotosTx(modo, operacao) {
  return ccemFotosDb().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction('fotos', modo);
    const req = operacao(tx.objectStore('fotos'));
    tx.oncomplete = () => resolve(req ? req.result : undefined);
    tx.onerror = tx.onabort = () => reject(tx.error || new Error('foto'));
  }));
}
const ccemFotoSalvar = (id, dataUrl) => _ccemFotosTx('readwrite', st => st.put(dataUrl, id));
const ccemFotoLer    = id => _ccemFotosTx('readonly', st => st.get(id));
const ccemFotoApagar = id => _ccemFotosTx('readwrite', st => st.delete(id)).catch(() => {});

function useFoto(id) {
  const [foto, setFoto] = useState(null);
  useEffect(() => {
    let vivo = true;
    setFoto(null);
    if (id) ccemFotoLer(id).then(d => { if (vivo && d && CCEM_FOTO_VALIDA.test(d)) setFoto(d); }).catch(() => {});
    return () => { vivo = false; };
  }, [id]);
  return foto;
}

/* ── Notas ───────────────────────────────────────────────────── */
function ccemNovaNotaId() { return 'c_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }

function ccemTituloNota(texto, temFoto) {
  const linha = String(texto || '').split('\n').map(l => l.trim()).find(Boolean);
  if (linha) return linha.length > 60 ? linha.slice(0, 57) + '…' : linha;
  return temFoto ? 'Foto' : 'Nota';
}

function ccemAvisarGravacao(ok, extra) {
  if (!ok) showToast('Não foi possível salvar neste aparelho — exporte antes de fechar');
  else showToast(extra || 'Salvo neste aparelho');
}

/* Grava (cria ou atualiza) uma nota. foto: dataUrl, null (sem foto) ou undefined (não mexe). */
async function ccemGravarNota({ id, texto, foto, sessaoId, resumoIA }) {
  const st0 = _ccemStore.state;
  const antiga = (st0.captures || []).find(c => c.id === id);
  id = id || ccemNovaNotaId();
  let fotoId = antiga ? antiga.foto || null : null, fotoFalhou = false;
  if (foto !== undefined) {
    if (foto) {
      try { await ccemFotoSalvar(id, foto); fotoId = id; }
      catch (e) { fotoFalhou = true; }
    } else if (fotoId) { await ccemFotoApagar(fotoId); fotoId = null; }
  }
  const s = SESSOES[sessaoId] || null;
  const agora = Date.now();
  const ok = updateAppState(st => {
    if (!st.captures) st.captures = [];
    const nota = {
      ...(antiga || {}),
      id,
      dia: (s && s.dia) || (antiga && antiga.dia) || ccemDiaDoEvento() || DIAS[0],
      time: antiga ? antiga.time : ccemDataHoraJoinville(agora).hora,
      ts: antiga ? antiga.ts : agora,
      sessaoId: s ? s.id : '',
      sessaoRef: s ? ccemRotulo(s) : 'Sem sessão',
      type: fotoId ? 'foto' : 'texto',
      foto: fotoId,
      title: ccemTituloNota(texto, !!fotoId),
      body: texto,
      tags: (s && s.temas) || [],
    };
    if (resumoIA !== undefined) nota.resumoIA = resumoIA;
    if (antiga) nota.editadoEm = agora;
    const i = st.captures.findIndex(c => c.id === id);
    if (i >= 0) st.captures[i] = nota; else st.captures.unshift(nota);
  });
  ccemAvisarGravacao(ok, fotoFalhou ? 'Texto salvo; a foto não pôde ser guardada neste aparelho' : null);
  return { ok, id };
}

async function ccemExcluirNota(id) {
  const nota = (_ccemStore.state.captures || []).find(c => c.id === id);
  const ok = updateAppState(st => { st.captures = (st.captures || []).filter(c => c.id !== id); });
  if (nota && nota.foto) await ccemFotoApagar(nota.foto);
  showToast(ok ? 'Nota excluída' : 'Não foi possível salvar a exclusão neste aparelho');
}

/* "Resumir com IA": opcional; o texto e a foto originais não mudam. */
async function ccemResumirNota(id) {
  const nota = (_ccemStore.state.captures || []).find(c => c.id === id);
  if (!nota) return;
  let imagem = null;
  if (nota.foto) {
    try { const d = await ccemFotoLer(nota.foto); if (d && CCEM_FOTO_VALIDA.test(d)) imagem = d.split(',')[1]; } catch (e) {}
  }
  const texto = ccemNotaEmTexto(nota.body).trim();
  const r = await ccemPerguntarAoAssistente({
    texto: texto ? 'Anote: ' + texto : '', imagem, sessaoId: nota.sessaoId, semHistorico: true,
  });
  if (!r.resposta) { showToast(r.aviso); return; }
  const ok = updateAppState(st => {
    const n = (st.captures || []).find(c => c.id === id);
    if (n) n.resumoIA = ccemRespostaEmTexto(r.resposta);
  });
  ccemAvisarGravacao(ok, 'Resumo salvo na nota');
}

/* Outras telas abrem o editor por evento (ex.: "Anotar" na sessão). */
function ccemAbrirEditor(detalhe) { window.dispatchEvent(new CustomEvent('ccem:anotar', { detail: detalhe || {} })); }

/* ── Editor de nota (folha que sobe) ─────────────────────────── */
function EditorNota({ notaId, sessaoId, aoFechar }) {
  const appState = useAppState();
  const antiga = (appState.captures || []).find(c => c.id === notaId) || null;
  const fotoSalva = useFoto(antiga && antiga.foto);
  const sessaoInicial = antiga ? antiga.sessaoId
    : (sessaoId || (ccemEstado().agora && ccemEstado().agora.navegavel ? ccemEstado().agora.id : ''));
  const [texto, setTexto]   = useState(antiga ? ccemNotaEmTexto(antiga.body) : '');
  const [sessao, setSessao] = useState(sessaoInicial || '');
  const [foto, setFoto]     = useState(undefined);       // undefined = não mexeu
  const [salvando, setSalvando] = useState(false);
  const fotoRef = useRef(null);
  const fotoVista = foto === undefined ? fotoSalva : foto;

  useEffect(() => {
    const esc = e => { if (e.key === 'Escape') aoFechar(); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  async function escolherFoto(arquivo) {
    if (!arquivo) return;
    try { setFoto((await ccemReduzirFoto(arquivo)).previa); }
    catch (e) { showToast('Não foi possível ler a foto'); }
  }
  async function salvar() {
    if (!texto.trim() && !fotoVista) { showToast('Escreva algo ou anexe uma foto'); return; }
    setSalvando(true);
    await ccemGravarNota({ id: antiga && antiga.id, texto: texto.trim(), foto, sessaoId: sessao });
    setSalvando(false);
    aoFechar();
  }
  async function excluir() {
    if (!confirm('Excluir esta nota? Não dá para desfazer.')) return;
    await ccemExcluirNota(antiga.id);
    aoFechar();
  }

  const opcoes = ccemSessoesEmOrdem().filter(s => s.navegavel);
  const BTN = { minHeight:44, borderRadius:10, padding:'0 16px', fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight:600, cursor:'pointer' };
  return (
    <div className="ccem-painel" onClick={aoFechar}
      style={{position:'fixed',inset:0,zIndex:320,background:'rgba(10,18,50,.38)',display:'flex',flexDirection:'column',justifyContent:'flex-end'}}>
      <div role="dialog" aria-modal="true" aria-label={antiga ? 'Editar nota' : 'Nova nota'} onClick={e=>e.stopPropagation()}
        style={{maxHeight:'92%',width:'100%',maxWidth:560,margin:'0 auto',display:'flex',flexDirection:'column',background:'#fff',
          borderRadius:'18px 18px 0 0',boxShadow:'0 -6px 32px rgba(10,18,50,.22)',paddingBottom:'env(safe-area-inset-bottom)'}}>
        <div style={{display:'flex',alignItems:'center',padding:'6px 6px 6px 16px',borderBottom:`1px solid ${C.linhaSoft}`,flexShrink:0}}>
          <h2 style={{flex:1,margin:0,fontFamily:'Georgia,serif',fontSize:17,color:C.tinta}}>{antiga ? 'Editar nota' : 'Nova nota'}</h2>
          <button autoFocus onClick={aoFechar} aria-label="Fechar sem salvar" style={{width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',background:'none',border:'none',cursor:'pointer',color:C.cinza,padding:0}}><IcoX size={20}/></button>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:'12px 16px'}}>
          <label style={{display:'block',fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,marginBottom:4}} htmlFor="ccem-nota-sessao">Sessão</label>
          <select id="ccem-nota-sessao" value={sessao} onChange={e=>setSessao(e.target.value)}
            style={{width:'100%',minHeight:44,padding:'0 10px',border:`1px solid ${C.linha}`,borderRadius:10,fontFamily:'DM Sans,sans-serif',fontSize:16,color:C.tinta,background:'#f8fafd',marginBottom:12}}>
            <option value="">Sem sessão</option>
            {opcoes.map(s=><option key={s.id} value={s.id}>{s.dia===DIAS[0]?'sex':'sáb'} {s.inicio} · {ccemRotulo(s)}</option>)}
          </select>
          <label style={{display:'block',fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,marginBottom:4}} htmlFor="ccem-nota-texto">Anotação</label>
          <textarea id="ccem-nota-texto" value={texto} onChange={e=>setTexto(e.target.value)} rows={6}
            placeholder="O que você quer guardar desta sessão?"
            style={{width:'100%',boxSizing:'border-box',minHeight:140,padding:'10px 12px',border:`1px solid ${C.linha}`,borderRadius:10,fontFamily:'DM Sans,sans-serif',fontSize:16,lineHeight:1.45,color:C.tinta,background:'#f8fafd',resize:'vertical'}}/>
          <input ref={fotoRef} type="file" accept="image/*" style={{display:'none'}}
            onChange={e=>{ const f=e.target.files&&e.target.files[0]; e.target.value=''; escolherFoto(f); }}/>
          {fotoVista ? (
            <div style={{marginTop:12}}>
              <img src={fotoVista} alt="Foto da nota" style={{display:'block',maxWidth:'100%',maxHeight:280,borderRadius:10,border:`1px solid ${C.linhaSoft}`}}/>
              <div style={{display:'flex',gap:8,marginTop:6}}>
                <button onClick={()=>fotoRef.current&&fotoRef.current.click()} style={{...BTN,background:'#fff',border:`1px solid ${C.linha}`,color:C.azul,fontSize:13}}>Trocar foto</button>
                <button onClick={()=>setFoto(null)} style={{...BTN,background:'#fff',border:`1px solid ${C.linha}`,color:C.cinza,fontSize:13}}>Remover foto</button>
              </div>
            </div>
          ) : (
            <button onClick={()=>fotoRef.current&&fotoRef.current.click()}
              style={{...BTN,marginTop:12,width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:'#fff',border:`1px dashed ${C.linha}`,color:C.azul}}>
              <IcoCam size={18} color={C.azul}/>Fotografar ou anexar slide
            </button>
          )}
          <p style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,lineHeight:1.45,margin:'12px 0 0'}}>
            A nota e a foto ficam só neste aparelho e funcionam sem internet. Depois, se quiser, use "Resumir com IA" no Caderno.
          </p>
        </div>
        <div style={{display:'flex',gap:8,padding:'10px 16px 12px',borderTop:`1px solid ${C.linhaSoft}`,flexShrink:0}}>
          {antiga&&<button onClick={excluir} style={{...BTN,background:'#fff',border:'1px solid #c53030',color:'#c53030'}}>Excluir</button>}
          <span style={{flex:1}}/>
          <button onClick={aoFechar} style={{...BTN,background:'#fff',border:`1px solid ${C.linha}`,color:C.cinza}}>Cancelar</button>
          <button onClick={salvar} disabled={salvando} style={{...BTN,background:C.azul,border:'none',color:'#fff',opacity:salvando?0.6:1}}>{salvando?'Salvando…':'Salvar'}</button>
        </div>
      </div>
    </div>
  );
}

/* ── Exportar / imprimir ─────────────────────────────────────────
   Abre uma página para leitura e impressão ("Salvar como PDF").
   A janela abre já no toque (senão o navegador bloqueia) e o
   conteúdo entra depois de ler as fotos. */
async function ccemExportarCaderno(captures) {
  const lista = [...(captures||[])].sort((a,b)=>a.ts-b.ts);
  if (!lista.length) { showToast('O caderno está vazio'); return; }
  const w = window.open('', '_blank');
  if (!w) { showToast('Permita pop-ups para exportar o caderno'); return; }
  w.document.write('<p style="font-family:system-ui,sans-serif;padding:24px">Preparando o caderno…</p>');
  const fotos = {};
  for (const c of lista) {
    if (!c.foto) continue;
    try { const d = await ccemFotoLer(c.foto); if (d && CCEM_FOTO_VALIDA.test(d)) fotos[c.id] = d; } catch (e) {}
  }
  const esc = t => String(t||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const hoje = ccemDataHoraJoinville(Date.now()).data;
  const rows = lista.map(c => {
    const { data, hora } = ccemDataHoraJoinville(c.ts);
    const sess = SESSOES[c.sessaoId] ? ccemRotulo(SESSOES[c.sessaoId]) : (c.sessaoRef||'');
    return `<div class="nota"><div class="meta">${esc(data)} · ${esc(hora)} · ${esc(sess)}</div>`
         + `<h3>${esc(c.title)}</h3>`
         + (fotos[c.id] ? `<img src="${fotos[c.id]}" alt="">` : '')
         + (c.body ? `<div class="body">${esc(ccemNotaEmTexto(c.body))}</div>` : '')
         + (c.resumoIA ? `<div class="ia"><b>Resumo da IA</b>\n${esc(c.resumoIA)}\n<i>Gerado por IA — confira na fonte</i></div>` : '')
         + `</div>`;
  }).join('');
  w.document.open();
  w.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Meu Caderno · CCEM 2026</title><style>
    body{font-family:Georgia,serif;color:#1a2438;max-width:680px;margin:32px auto;padding:0 24px}
    h1{font-size:22px;margin:0 0 2px}
    .sub{font-size:12px;color:#4a5468;margin:0 0 24px;font-family:system-ui,sans-serif}
    .nota{border-top:1px solid #d5dff0;padding:14px 0;page-break-inside:avoid}
    .meta{font-size:12px;color:#4a5468;font-family:system-ui,sans-serif;margin-bottom:4px}
    h3{font-size:14px;margin:0 0 6px}
    img{display:block;max-width:100%;max-height:420px;margin:6px 0 8px;border:1px solid #d5dff0}
    .body{font-size:13px;line-height:1.55;white-space:pre-wrap}
    .ia{font-size:12.5px;line-height:1.5;white-space:pre-wrap;margin-top:8px;padding:8px 10px;background:#f3f6fc;border-left:3px solid #2d54c0}
  </style></head><body><h1>Meu Caderno · CCEM 2026</h1><p class="sub">${lista.length} nota${lista.length!==1?'s':''} · exportado em ${hoje} · 12º Congresso Catarinense de Endocrinologia e Metabologia</p>${rows}<script>window.onload=function(){window.print()}<\/script></body></html>`);
  w.document.close();
}

/* ── Backup restaurável ──────────────────────────────────────── */
async function ccemBaixarBackup() {
  const st = _ccemStore.state;
  const fotos = {};
  for (const c of st.captures || []) {
    if (!c.foto) continue;
    try { const d = await ccemFotoLer(c.foto); if (d) fotos[c.foto] = d; } catch (e) {}
  }
  const dados = { app:'meu-ccem-2026', formato:1, criadoEm:new Date().toISOString(),
                  marks: st.marks || {}, captures: st.captures || [], fotos };
  const nome = 'meu-ccem-backup-' + ccemDataHoraJoinville(Date.now()).data.split('/').reverse().join('-') + '.json';
  const arquivo = new File([JSON.stringify(dados)], nome, { type:'application/json' });
  if (navigator.canShare && navigator.canShare({ files:[arquivo] })) {
    try { await navigator.share({ files:[arquivo], title:'Backup do Meu CCEM' }); return; }
    catch (e) { if (e && e.name === 'AbortError') return; }      // senão, cai no download
  }
  const url = URL.createObjectURL(arquivo);
  const a = document.createElement('a');
  a.href = url; a.download = nome;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  showToast('Backup baixado');
}

async function ccemRestaurarBackup(arquivo) {
  let d;
  try { d = JSON.parse(await arquivo.text()); } catch (e) { d = null; }
  if (!d || d.app !== 'meu-ccem-2026' || !Array.isArray(d.captures)) { showToast('Este arquivo não é um backup do Meu CCEM'); return; }
  const txt = (v, max) => typeof v === 'string' ? v.slice(0, max) : '';
  const notas = d.captures.filter(c => c && typeof c.id === 'string' && /^c_[\w-]{1,40}$/.test(c.id)).map(c => ({
    id: c.id, dia: DIAS.includes(c.dia) ? c.dia : DIAS[0], time: txt(c.time, 5),
    ts: Number.isFinite(c.ts) ? c.ts : Date.now(),
    sessaoId: SESSOES[c.sessaoId] ? c.sessaoId : '', sessaoRef: txt(c.sessaoRef, 120),
    type: c.type === 'foto' ? 'foto' : 'texto', foto: typeof c.foto === 'string' ? c.foto : null,
    title: txt(c.title, 120), body: txt(c.body, 20000),
    resumoIA: c.resumoIA ? txt(c.resumoIA, 8000) : undefined,
    tags: Array.isArray(c.tags) ? c.tags.filter(t => typeof t === 'string').slice(0, 10) : [],
  }));
  let fotosOk = 0;
  for (const [id, dataUrl] of Object.entries(d.fotos || {})) {
    if (typeof dataUrl === 'string' && CCEM_FOTO_VALIDA.test(dataUrl) && /^c_[\w-]{1,40}$/.test(id)) {
      try { await ccemFotoSalvar(id, dataUrl); fotosOk++; } catch (e) {}
    }
  }
  let novasNotas = 0, novasMarcas = 0;
  const ok = updateAppState(st => {
    st.marks = st.marks || {};
    for (const [id, v] of Object.entries(d.marks || {})) if (v === true && SESSOES[id] && !st.marks[id]) { st.marks[id] = true; novasMarcas++; }
    st.captures = st.captures || [];
    const ids = new Set(st.captures.map(c => c.id));
    for (const n of notas) if (!ids.has(n.id)) { st.captures.push(n); novasNotas++; }
  });
  showToast(ok ? `Backup restaurado: ${novasNotas} nota${novasNotas!==1?'s':''}, ${novasMarcas} marcaç${novasMarcas!==1?'ões':'ão'}${fotosOk?', '+fotosOk+' foto'+(fotosOk!==1?'s':''):''}`
               : 'Não foi possível salvar o backup neste aparelho');
}

function FolhaBackup({ aoFechar }) {
  const entradaRef = useRef(null);
  const BTN = { width:'100%', minHeight:48, borderRadius:10, fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight:600, cursor:'pointer', marginBottom:8 };
  return (
    <div className="ccem-painel" onClick={aoFechar}
      style={{position:'fixed',inset:0,zIndex:320,background:'rgba(10,18,50,.38)',display:'flex',flexDirection:'column',justifyContent:'flex-end'}}>
      <div role="dialog" aria-modal="true" aria-label="Backup do caderno" onClick={e=>e.stopPropagation()}
        style={{width:'100%',maxWidth:560,margin:'0 auto',background:'#fff',borderRadius:'18px 18px 0 0',padding:'16px 16px calc(16px + env(safe-area-inset-bottom))'}}>
        <div style={{display:'flex',alignItems:'center',marginBottom:6}}>
          <h2 style={{flex:1,margin:0,fontFamily:'Georgia,serif',fontSize:17,color:C.tinta}}>Backup do caderno</h2>
          <button onClick={aoFechar} aria-label="Fechar" style={{width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',background:'none',border:'none',cursor:'pointer',color:C.cinza,padding:0}}><IcoX size={20}/></button>
        </div>
        <p style={{fontSize:13,color:C.cinza,lineHeight:1.5,margin:'0 0 14px'}}>
          O backup guarda notas, fotos e marcações num arquivo. Use para trocar de aparelho ou guardar depois do congresso.
          O "Exportar / imprimir" é para ler; o backup é para restaurar.
        </p>
        <button onClick={()=>ccemBaixarBackup()} style={{...BTN,background:C.azul,color:'#fff',border:'none'}}>Baixar backup</button>
        <input ref={entradaRef} type="file" accept="application/json,.json" style={{display:'none'}}
          onChange={async e=>{ const f=e.target.files&&e.target.files[0]; e.target.value=''; if(f){ await ccemRestaurarBackup(f); aoFechar(); } }}/>
        <button onClick={()=>entradaRef.current&&entradaRef.current.click()} style={{...BTN,background:'#fff',color:C.azul,border:`1px solid ${C.linha}`}}>Restaurar de um arquivo</button>
        <p style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,margin:'4px 0 0'}}>Restaurar soma ao que já existe: nada é apagado.</p>
      </div>
    </div>
  );
}

/* ── Aviso quando o navegador não deixa salvar ───────────────── */
function AvisoSemArmazenamento() {
  useAppState();
  if (_ccemSalvamento.ok) return null;
  return (
    <p role="alert" style={{fontSize:12.5,color:'#7c2d12',lineHeight:1.45,margin:'0 0 10px',padding:'8px 10px',background:'#fff4e5',borderRadius:7,borderLeft:'3px solid #c2410c'}}>
      Este navegador não está deixando o app salvar. Suas notas ficam só enquanto esta aba estiver aberta — exporte antes de fechar.
    </p>
  );
}

/* ── Uma nota no Caderno ─────────────────────────────────────── */
function NotaCartao({ c }) {
  const foto = useFoto(c.foto);
  const [resumindo, setResumindo] = useState(false);
  const temConteudo = !!(c.body || c.foto);
  const cor = c.type === 'foto' ? C.azul : C.ouroTxt;
  async function resumir() { setResumindo(true); await ccemResumirNota(c.id); setResumindo(false); }
  const ACAO = { minHeight:44, display:'flex', alignItems:'center', gap:5, background:'none', border:'none', padding:'0 6px', cursor:'pointer', fontFamily:'DM Sans,sans-serif', fontSize:12.5, fontWeight:600, color:C.azul };
  return (
    <div style={{background:'#fff',borderRadius:10,padding:'10px 12px 4px',marginBottom:8,border:`1px solid ${C.linhaSoft}`,borderLeft:`3px solid ${cor}`}}>
      <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:5}}>
        <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:cor,textTransform:'uppercase',letterSpacing:'0.07em',fontWeight:600}}>{c.type}</span>
        <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.sessaoRef} · {c.time}</span>
      </div>
      <div style={{fontSize:13,fontWeight:600,color:C.tinta,marginBottom:4,lineHeight:1.3}}>{c.title}</div>
      {foto&&<img src={foto} alt="Foto da nota" onClick={()=>ccemAbrirEditor({ notaId:c.id })} style={{display:'block',maxWidth:'100%',maxHeight:180,borderRadius:8,margin:'4px 0 6px',cursor:'pointer'}}/>}
      {c.body&&<div style={{fontSize:13,color:C.tinta,lineHeight:1.5,whiteSpace:'pre-wrap'}}>{ccemNotaEmTexto(c.body)}</div>}
      {c.resumoIA&&(
        <div style={{marginTop:8,padding:'8px 10px',background:'#f3f6fc',borderLeft:`3px solid ${C.azulSoft}`,borderRadius:6}}>
          <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,fontWeight:700,color:C.azul,marginBottom:3}}>Resumo da IA</div>
          <div style={{fontSize:12.5,color:C.tinta,lineHeight:1.5,whiteSpace:'pre-wrap'}}>{c.resumoIA}</div>
          <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,marginTop:4}}>Gerado por IA — confira na fonte</div>
        </div>
      )}
      {(c.tags||[]).length>0&&<div style={{display:'flex',gap:4,marginTop:6,flexWrap:'wrap'}}>{c.tags.map(t=><span key={t} style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.azulSoft,background:C.azulBg+'60',padding:'2px 7px',borderRadius:8}}>{t}</span>)}</div>}
      <div style={{display:'flex',gap:4,marginTop:2}}>
        <button onClick={()=>ccemAbrirEditor({ notaId:c.id })} style={ACAO}>Editar</button>
        {temConteudo&&!c.resumoIA&&(
          <button onClick={resumir} disabled={resumindo} style={{...ACAO,opacity:resumindo?0.6:1}}>
            <img src={CCEM_AVATAR} alt="" width="18" height="18" style={{borderRadius:'50%'}}/>{resumindo?'Resumindo…':'Resumir com IA'}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Tela Caderno ────────────────────────────────────────────── */
function CadernoScreen() {
  const appState = useAppState();
  const [filtro, setFiltro] = useState('all');
  const [backup, setBackup] = useState(false);
  const captures = appState.captures || [];
  const filtered = filtro==='all' ? captures : captures.filter(c=>c.type===filtro);
  const counts = { all:captures.length, foto:captures.filter(c=>c.type==='foto').length, texto:captures.filter(c=>c.type!=='foto').length };
  const sessoes  = new Set(captures.map(c=>c.sessaoId).filter(Boolean)).size;
  const isDia0 = c => c.dia===DIAS[0] || c.day==='sexta';
  const isDia1 = c => c.dia===DIAS[1] || c.day==='sabado';
  const bySex  = filtered.filter(isDia0).sort((a,b)=>b.ts-a.ts);
  const bySab  = filtered.filter(isDia1).sort((a,b)=>b.ts-a.ts);
  const bsOrph = filtered.filter(c=>!isDia0(c)&&!isDia1(c)).sort((a,b)=>b.ts-a.ts);

  const fchip=(key,lbl)=>(
    <button key={key} onClick={()=>setFiltro(key)} aria-pressed={filtro===key} style={{minHeight:44,display:'flex',alignItems:'center',padding:0,border:'none',background:'none',cursor:'pointer',fontFamily:'inherit',flexShrink:0}}>
      <span style={{display:'flex',alignItems:'center',gap:4,padding:'5px 12px',border:`1px solid ${filtro===key?C.azul:C.linha}`,borderRadius:20,background:filtro===key?C.azul:'#fff',color:filtro===key?'#fff':C.cinza,fontSize:12,fontWeight:filtro===key?600:400}}>
        {lbl}<span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,marginLeft:2}}>{counts[key]}</span>
      </span>
    </button>
  );
  const DIA = { fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,textTransform:'uppercase',letterSpacing:'0.08em',fontWeight:600 };

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden'}}>
      <div style={{padding:'12px 16px 10px',background:'#fff',borderBottom:`1px solid ${C.linha}`,flexShrink:0}}>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:17,fontWeight:700,color:C.tinta,margin:'0 0 2px'}}>Meu caderno</h2>
        <p style={{fontSize:12,color:C.cinza,margin:'0 0 8px'}}>tudo que você anotou no CCEM 2026</p>
        <AvisoSemArmazenamento/>
        <p style={{fontSize:12,color:C.tinta,lineHeight:1.4,margin:'0 0 10px',padding:'7px 10px',background:'#f5f8fd',borderRadius:7,borderLeft:`3px solid ${C.azulSoft}`}}>
          Suas notas ficam só neste aparelho. Exporte o PDF para guardar. Para trocar de aparelho, use o Backup.
        </p>
        <div style={{display:'flex',gap:8,marginBottom:10}}>
          {[['Notas',captures.length,C.azulBg,C.azul],['Sessões',sessoes,C.verdeBg,C.verde],['Fotos',counts.foto,C.ouroBg,C.ouroTxt]].map(([lbl,num,bg,color])=>(
            <div key={lbl} style={{flex:1,background:bg,borderRadius:10,padding:'7px 10px',textAlign:'center'}}>
              <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:20,fontWeight:700,color,lineHeight:1}}>{num}</div>
              <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color,textTransform:'uppercase',letterSpacing:'0.06em',marginTop:2}}>{lbl}</div>
            </div>
          ))}
        </div>
        <button onClick={()=>ccemAbrirEditor({})}
          style={{width:'100%',minHeight:44,display:'flex',alignItems:'center',justifyContent:'center',gap:7,background:C.azul,color:'#fff',border:'none',borderRadius:10,fontFamily:'DM Sans,sans-serif',fontSize:14,fontWeight:700,cursor:'pointer'}}>
          <IcoPlus size={17} color="#fff"/>Nova nota
        </button>
      </div>
      <div style={{display:'flex',gap:5,padding:'0 12px',background:'#f8fafd',borderBottom:`1px solid ${C.linhaSoft}`,overflowX:'auto',flexShrink:0,scrollbarWidth:'none'}}>
        {fchip('all','Tudo')}{fchip('foto','Fotos')}{fchip('texto','Textos')}
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'10px 12px'}}>
        {filtered.length===0?(
          <div style={{textAlign:'center',padding:'40px 20px',color:C.cinza}}>
            <h4 style={{fontSize:14,fontWeight:600,color:C.tinta,marginBottom:6}}>Caderno vazio</h4>
            <p style={{fontSize:12.5,lineHeight:1.5,margin:0}}>Toque em <strong>Nova nota</strong>, ou em <strong>Anotar</strong> numa sessão. Funciona sem internet.</p>
          </div>
        ):(
          <>
            {bySex.length>0&&<><div style={{...DIA,margin:'2px 0 8px'}}>Sexta · 23 outubro</div>{bySex.map(c=><NotaCartao key={c.id} c={c}/>)}</>}
            {bySab.length>0&&<><div style={{...DIA,margin:'12px 0 8px'}}>Sábado · 24 outubro</div>{bySab.map(c=><NotaCartao key={c.id} c={c}/>)}</>}
            {bsOrph.length>0&&bsOrph.map(c=><NotaCartao key={c.id} c={c}/>)}
          </>
        )}
      </div>
      <div style={{padding:'8px 12px',background:'#fff',borderTop:`1px solid ${C.linha}`,display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
        <p style={{flex:1,fontSize:12,color:C.cinza,lineHeight:1.35,margin:0}}><strong>{_ccemSalvamento.ok?'Salvo neste aparelho':'Não salvo'}</strong> · {captures.length} nota{captures.length!==1?'s':''}</p>
        <button onClick={()=>setBackup(true)} style={{minHeight:44,background:'#fff',color:C.azul,border:`1px solid ${C.linha}`,borderRadius:8,padding:'0 12px',fontSize:12.5,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Backup</button>
        <button onClick={()=>ccemExportarCaderno(captures)} disabled={!captures.length}
          style={{minHeight:44,background:C.azul,color:'#fff',border:'none',borderRadius:8,padding:'0 12px',fontSize:12.5,fontWeight:600,cursor:'pointer',fontFamily:'inherit',opacity:captures.length?1:0.5}}>Exportar / imprimir</button>
      </div>
      {backup&&<FolhaBackup aoFechar={()=>setBackup(false)}/>}
    </div>
  );
}

Object.assign(window, {
  ccemDataHoraJoinville, ccemNotaEmTexto, ccemExportarCaderno, ccemAbrirEditor, ccemGravarNota,
  ccemFotoSalvar, ccemFotoLer, ccemBaixarBackup, ccemRestaurarBackup, EditorNota, CadernoScreen, AvisoSemArmazenamento,
});
