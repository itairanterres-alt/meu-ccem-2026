const CCEM_ATALHOS = [
  { acao: "explicar", rotulo: "Explique este gr\xE1fico/tabela" },
  { acao: "raciocinio", rotulo: "Explique o racioc\xEDnio" },
  { acao: "concluir", rotulo: "O que este resultado permite concluir?" },
  { acao: "leitura_critica", rotulo: "Leitura cr\xEDtica do estudo" },
  { acao: "tabela", rotulo: "Tabela em texto" },
  { acao: "fluxograma", rotulo: "Fluxograma passo a passo" },
  { acao: "transcrever", rotulo: "Transcrever e explicar siglas" },
  { acao: "perguntas", rotulo: "Sugerir perguntas ao palestrante" }
];
const CCEM_TITULO_ITENS = { tabela: "Tabela", fluxograma: "Passo a passo", perguntas: "Perguntas sugeridas", leitura_critica: "Pontos da leitura cr\xEDtica" };
const CCEM_AVISO_FOTO_IA = "Ao usar estes recursos, a foto \xE9 enviada \xE0 Anthropic (EUA) para processamento; o app n\xE3o guarda c\xF3pia no servidor. N\xE3o envie imagem identific\xE1vel de paciente.";
async function ccemPost(url, corpo, tempoMs) {
  const ctl = new AbortController();
  const relogio = setTimeout(() => ctl.abort(), tempoMs || 32e3);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...corpo, userId: window.CCEM_USER_ID }),
      signal: ctl.signal
    });
    if (res.ok) return { dados: await res.json() };
    if ([404, 405, 501, 503].includes(res.status)) return { aviso: CCEM_EM_TESTES };
    if (res.status === 429) return { aviso: "Voc\xEA chegou ao limite di\xE1rio deste recurso. Ele volta amanh\xE3." };
    if (res.status === 504) return { aviso: "A IA demorou demais para responder. Tente de novo." };
    if (res.status === 413) return { aviso: "A foto n\xE3o p\xF4de ser enviada. Tente fotografar de novo." };
    return { aviso: "N\xE3o foi poss\xEDvel responder agora. Tente de novo." };
  } catch (e) {
    return { aviso: e && e.name === "AbortError" ? "A IA demorou demais para responder. Tente de novo." : "Sem conex\xE3o com a internet. A foto continua salva; tente quando a rede voltar." };
  } finally {
    clearTimeout(relogio);
  }
}
async function ccemFotoBase64(nota) {
  if (!nota || !nota.foto) return null;
  try {
    const d = await ccemFotoLer(nota.foto);
    return d && CCEM_FOTO_VALIDA.test(d) ? d.split(",")[1] : null;
  } catch (e) {
    return null;
  }
}
const ccemNotaAtual = (id) => (_ccemStore.state.captures || []).find((c) => c.id === id);
function ccemRespostaSlideEmTexto(r) {
  return [r.no_slide, (r.itens || []).join("\n"), r.explicacao, r.limites].filter(Boolean).join("\n\n");
}
function ccemGuardarIndice(id, r) {
  if (!r || !r.titulo) return;
  updateAppState((st) => {
    const n = (st.captures || []).find((c) => c.id === id);
    if (!n) return;
    n.indice = { titulo: r.titulo, texto: r.texto_extraido || "", palavras: r.palavras_chave || [] };
    if (r.referencia && !n.refLida) n.refLida = r.referencia;
  });
}
async function ccemAcaoSlide(id, { acao, rotulo, pergunta, aprofundar }) {
  const nota = ccemNotaAtual(id);
  const imagem = await ccemFotoBase64(nota);
  if (!imagem) return { aviso: "A foto desta nota n\xE3o est\xE1 dispon\xEDvel neste aparelho." };
  const historico = (nota.respostas || []).slice(-4).map((x) => ({ pergunta: x.rotulo, resposta: ccemRespostaSlideEmTexto(x.r) }));
  const artigo = nota.artigo ? { titulo: nota.artigo.titulo, revista: nota.artigo.revista, ano: nota.artigo.ano, resumo: nota.artigo.resumo } : void 0;
  const { dados, aviso } = await ccemPost("/api/slide", { acao, imagem, pergunta, aprofundar: !!aprofundar, sessaoId: nota.sessaoId, historico, artigo });
  if (aviso) return { aviso };
  const { fonte, recusa, ...r } = dados;
  const ok = updateAppState((st) => {
    const n = (st.captures || []).find((c) => c.id === id);
    if (!n) return;
    n.respostas = [...n.respostas || [], { id: "r_" + Date.now().toString(36), acao, rotulo, r, fonte, aprofundada: !!aprofundar, ts: Date.now() }].slice(-30);
  });
  if (!recusa) ccemGuardarIndice(id, r);
  if (!ok) showToast("Resposta exibida, mas n\xE3o foi poss\xEDvel salv\xE1-la neste aparelho");
  return { ok: true };
}
async function ccemOrganizarNota(id) {
  const imagem = await ccemFotoBase64(ccemNotaAtual(id));
  if (!imagem) return { aviso: "sem foto" };
  const { dados, aviso } = await ccemPost("/api/slide", { acao: "organizar", imagem }, 25e3);
  if (aviso) return { aviso };
  ccemGuardarIndice(id, dados);
  return { ok: true };
}
function ccemFalar(texto) {
  try {
    if (!window.speechSynthesis) {
      showToast("Este aparelho n\xE3o oferece leitura em voz alta");
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = "pt-BR";
    window.speechSynthesis.speak(u);
  } catch (e) {
    showToast("N\xE3o foi poss\xEDvel ler em voz alta");
  }
}
function FolhaBase({ titulo, aoFechar, altura, children, rodape }) {
  useEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape") aoFechar();
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);
  return ReactDOM.createPortal(
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "ccem-painel",
        onClick: aoFechar,
        style: { position: "fixed", inset: 0, zIndex: 340, background: "rgba(10,18,50,.38)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          role: "dialog",
          "aria-modal": "true",
          "aria-label": titulo,
          onClick: (e) => e.stopPropagation(),
          style: {
            height: altura || "90%",
            width: "100%",
            maxWidth: 600,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            background: "#fff",
            borderRadius: "18px 18px 0 0",
            boxShadow: "0 -6px 32px rgba(10,18,50,.22)",
            paddingBottom: "env(safe-area-inset-bottom)"
          }
        },
        /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", padding: "6px 6px 6px 16px", borderBottom: `1px solid ${C.linhaSoft}`, flexShrink: 0 } }, /* @__PURE__ */ React.createElement("h2", { style: { flex: 1, margin: 0, fontFamily: "Georgia,serif", fontSize: 17, color: C.tinta } }, titulo), /* @__PURE__ */ React.createElement("button", { autoFocus: true, onClick: aoFechar, "aria-label": "Fechar", style: { width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: C.cinza, padding: 0 } }, /* @__PURE__ */ React.createElement(IcoX, { size: 20 }))),
        /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflowY: "auto", padding: "12px 14px", background: "#f3f6fc" } }, children),
        rodape
      )
    ),
    document.body
  );
}
const BLOCO_TIT = { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 };
function RespostaSlide({ item, aoAprofundar, aoEncontrarArtigo, ocupado }) {
  const r = item.r || {};
  const bloco = (titulo, cor, conteudo, extra) => conteudo ? /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, padding: "8px 10px", background: "#fff", borderLeft: `3px solid ${cor}`, borderRadius: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { ...BLOCO_TIT, color: cor } }, titulo, extra), conteudo) : null;
  const txt = (t) => /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: C.tinta, lineHeight: 1.5, whiteSpace: "pre-wrap" } }, t);
  return /* @__PURE__ */ React.createElement("div", { style: { background: "#eef3fb", border: `1px solid ${C.linhaSoft}`, borderRadius: 12, padding: "10px 12px", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: C.azul } }, item.rotulo, item.aprofundada ? " \xB7 aprofundado" : ""), bloco("No slide", C.azul, r.no_slide && txt(r.no_slide)), bloco(CCEM_TITULO_ITENS[item.acao] || "Itens", C.azul, (r.itens || []).length > 0 && /* @__PURE__ */ React.createElement("ol", { style: { margin: "2px 0 0", paddingLeft: 20, fontSize: 13, color: C.tinta, lineHeight: 1.5 } }, r.itens.map((x, i) => /* @__PURE__ */ React.createElement("li", { key: i, style: { marginBottom: 3 } }, x)))), item.acao === "transcrever" && bloco("Texto do slide", C.azul, r.texto_extraido && txt(r.texto_extraido)), item.acao === "transcrever" && r.texto_extraido && /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => ccemFalar(r.texto_extraido + ". " + (r.siglas || []).map((s) => `${s.sigla}: ${s.significado}`).join(". ")),
      style: { marginTop: 6, minHeight: 44, padding: "0 14px", background: "#fff", border: `1px solid ${C.linha}`, borderRadius: 9, fontFamily: "DM Sans,sans-serif", fontSize: 13, fontWeight: 600, color: C.azul, cursor: "pointer" }
    },
    "Ouvir em voz alta"
  ), bloco("Siglas", C.azul, (r.siglas || []).length > 0 && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: C.tinta, lineHeight: 1.5 } }, r.siglas.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i }, /* @__PURE__ */ React.createElement("b", null, s.sigla), " \u2014 ", s.significado)))), bloco("Explica\xE7\xE3o adicional", "#0f766e", r.explicacao && txt(r.explicacao), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 400, textTransform: "none", letterSpacing: 0 } }, " \xB7 n\xE3o est\xE1 no slide")), bloco("Limites da interpreta\xE7\xE3o", "#9a3412", r.limites && txt(r.limites)), r.referencia && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, fontSize: 12.5, color: C.cinza, lineHeight: 1.45 } }, "Refer\xEAncia no slide: ", r.referencia, aoEncontrarArtigo && /* @__PURE__ */ React.createElement("button", { onClick: () => aoEncontrarArtigo(r.referencia), style: { display: "block", marginTop: 4, minHeight: 44, padding: "0 12px", background: "#fff", border: `1px solid ${C.linha}`, borderRadius: 9, fontFamily: "DM Sans,sans-serif", fontSize: 13, fontWeight: 600, color: C.azul, cursor: "pointer" } }, "Encontrar este artigo")), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, marginTop: 8 } }, item.fonte, " Gerado por IA \u2014 confira na fonte."), !item.aprofundada && aoAprofundar && /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: aoAprofundar,
      disabled: ocupado,
      style: { marginTop: 6, minHeight: 44, padding: "0 14px", background: "#fff", border: `1px solid ${C.linha}`, borderRadius: 9, fontFamily: "DM Sans,sans-serif", fontSize: 13, fontWeight: 600, color: C.azul, cursor: "pointer", opacity: ocupado ? 0.5 : 1 }
    },
    "Aprofundar"
  ));
}
function PainelSlide({ notaId, aoFechar }) {
  const appState = useAppState();
  const nota = (appState.captures || []).find((c) => c.id === notaId);
  const foto = useFoto(nota && nota.foto);
  const [pergunta, setPergunta] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [artigoRef, setArtigoRef] = useState(null);
  const fimRef = useRef(null);
  const respostas = nota && nota.respostas || [];
  useEffect(() => {
    const el = fimRef.current;
    if (el) el.scrollIntoView({ block: "end" });
  }, [respostas.length, ocupado]);
  if (!nota) return null;
  const s = SESSOES[nota.sessaoId];
  async function pedir(acao, rotulo, extra) {
    if (ocupado) return;
    const ja = acao !== "livre" && !(extra && extra.aprofundar) && respostas.find((x) => x.acao === acao && !x.aprofundada);
    if (ja) {
      showToast("J\xE1 respondido \u2014 sem novo custo");
      document.getElementById("resp-" + ja.id)?.scrollIntoView({ block: "start" });
      return;
    }
    setOcupado(true);
    const r = await ccemAcaoSlide(notaId, { acao, rotulo, ...extra });
    setOcupado(false);
    if (r.aviso) showToast(r.aviso);
  }
  function enviarLivre() {
    const v = pergunta.trim();
    if (!v) return;
    setPergunta("");
    pedir("livre", v, { pergunta: v });
  }
  return /* @__PURE__ */ React.createElement(
    FolhaBase,
    {
      titulo: "Perguntar sobre este slide",
      aoFechar,
      rodape: /* @__PURE__ */ React.createElement("div", { style: { flexShrink: 0, background: "#fff", borderTop: `1px solid ${C.linhaSoft}`, padding: "6px 12px 10px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, lineHeight: 1.4, margin: "0 2px 6px" } }, CCEM_AVISO_FOTO_IA), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 7 } }, /* @__PURE__ */ React.createElement(
        "input",
        {
          value: pergunta,
          onChange: (e) => setPergunta(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && enviarLivre(),
          maxLength: 1e3,
          placeholder: "Pergunte sobre este slide\u2026",
          "aria-label": "Pergunta sobre este slide",
          style: { flex: 1, minWidth: 0, minHeight: 44, padding: "8px 14px", border: `1px solid ${C.linha}`, borderRadius: 24, fontFamily: "DM Sans,sans-serif", fontSize: 16, color: C.tinta, background: "#f8fafd", outline: "none" }
        }
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: enviarLivre,
          "aria-label": "Enviar",
          disabled: ocupado || !pergunta.trim(),
          style: { width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", border: "none", background: C.azul, opacity: ocupado || !pergunta.trim() ? 0.45 : 1, borderRadius: 12, cursor: "pointer", padding: 0 }
        },
        /* @__PURE__ */ React.createElement(IcoSend, { size: 17, color: "#fff" })
      )))
    },
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 } }, foto && /* @__PURE__ */ React.createElement("img", { src: foto, alt: "Slide", style: { width: 110, borderRadius: 8, border: `1px solid ${C.linhaSoft}`, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, color: C.cinza, lineHeight: 1.45 } }, s ? ccemRotulo(s) : "Sem sess\xE3o", s && s.tipo === "satelite" ? " \xB7 sess\xE3o patrocinada" : "", nota.artigo && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 4, color: C.tinta } }, "Artigo vinculado: ", nota.artigo.autores[0], " \xB7 ", nota.artigo.revista, " ", nota.artigo.ano, ". As respostas usam tamb\xE9m o resumo dele."))),
    respostas.map((item) => /* @__PURE__ */ React.createElement("div", { key: item.id, id: "resp-" + item.id }, /* @__PURE__ */ React.createElement(
      RespostaSlide,
      {
        item,
        ocupado,
        aoAprofundar: () => pedir(item.acao, item.rotulo, { aprofundar: true, pergunta: item.acao === "livre" ? item.rotulo : void 0 }),
        aoEncontrarArtigo: (ref) => setArtigoRef(ref)
      }
    ))),
    ocupado && /* @__PURE__ */ React.createElement("div", { role: "status", "aria-label": "A IA est\xE1 respondendo", style: { display: "flex", gap: 4, padding: "10px 12px", background: "#fff", borderRadius: 12, width: 60, border: `1px solid ${C.linhaSoft}`, marginBottom: 12 } }, [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement("span", { key: i, style: { width: 7, height: 7, borderRadius: "50%", background: C.cinza, display: "inline-block", animation: `ccem-bounce .9s ${i * 0.2}s ease-in-out infinite` } }))),
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, CCEM_ATALHOS.map((a) => {
      const feito = respostas.some((x) => x.acao === a.acao);
      return /* @__PURE__ */ React.createElement(
        "button",
        {
          key: a.acao,
          onClick: () => pedir(a.acao, a.rotulo),
          disabled: ocupado,
          style: { minHeight: 44, display: "flex", alignItems: "center", gap: 6, background: feito ? C.azulBg : "#fff", border: `1px solid ${feito ? C.azulBg : C.linha}`, borderRadius: 22, padding: "0 14px", cursor: "pointer", fontFamily: "DM Sans,sans-serif", fontSize: 12.5, fontWeight: 500, color: C.azul, opacity: ocupado ? 0.55 : 1 }
        },
        feito && /* @__PURE__ */ React.createElement(IcoCheck, { size: 14, color: C.azul }),
        a.rotulo
      );
    })),
    /* @__PURE__ */ React.createElement("div", { ref: fimRef }),
    artigoRef !== null && /* @__PURE__ */ React.createElement(FolhaArtigo, { notaId, textoInicial: artigoRef, aoFechar: () => setArtigoRef(null) })
  );
}
const CCEM_NIVEL = {
  confirmada: { cor: "#15803d", fundo: "#ecfdf3", texto: "Correspond\xEAncia confirmada pelos identificadores (autor, ano, volume e p\xE1gina, ou DOI/PMID)." },
  possivel: { cor: "#9a3412", fundo: "#fff4e5", texto: "Poss\xEDvel correspond\xEAncia: confira t\xEDtulo, autores e ano antes de usar." },
  nao_localizado: { cor: C.cinza, fundo: "#f5f7fb", texto: "N\xE3o localizado no PubMed com esta refer\xEAncia. Corrija o texto acima ou procure no Google Acad\xEAmico." },
  sem_referencia: { cor: C.cinza, fundo: "#f5f7fb", texto: "Nenhuma refer\xEAncia vis\xEDvel neste slide. Se souber qual \xE9, digite acima e busque." },
  erro_pubmed: { cor: C.cinza, fundo: "#f5f7fb", texto: "O PubMed n\xE3o respondeu agora. Tente de novo em instantes." }
};
function CartaoArtigo({ a, aoGuardar, guardado }) {
  const BTN = { minHeight: 44, display: "inline-flex", alignItems: "center", padding: "0 12px", borderRadius: 9, fontFamily: "DM Sans,sans-serif", fontSize: 13, fontWeight: 600, textDecoration: "none", cursor: "pointer" };
  const autores = a.autores.slice(0, 3).join(", ") + (a.autores.length > 3 ? " et al." : "");
  return /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", border: `1px solid ${C.linhaSoft}`, borderRadius: 12, padding: "10px 12px", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.tinta, lineHeight: 1.35 } }, a.titulo), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, color: C.cinza, marginTop: 3, lineHeight: 1.4 } }, autores, /* @__PURE__ */ React.createElement("br", null), a.revista, " ", a.ano, a.volume ? `;${a.volume}` : "", a.paginas ? `:${a.paginas}` : "", " \xB7 PMID ", a.pmid), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, fontWeight: 700, color: C.cinza, textTransform: "uppercase", letterSpacing: "0.06em", margin: "10px 0 4px" } }, "Acessar texto completo"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, a.links.pdf && /* @__PURE__ */ React.createElement("a", { href: a.links.pdf, target: "_blank", rel: "noopener", style: { ...BTN, background: C.azul, color: "#fff" } }, "PDF dispon\xEDvel"), !a.links.pdf && a.links.aberto && /* @__PURE__ */ React.createElement("a", { href: a.links.aberto, target: "_blank", rel: "noopener", style: { ...BTN, background: C.azul, color: "#fff" } }, "Texto aberto"), a.links.pmc && /* @__PURE__ */ React.createElement("a", { href: a.links.pmc, target: "_blank", rel: "noopener", style: { ...BTN, background: "#fff", color: C.azul, border: `1px solid ${C.linha}` } }, "PubMed Central"), /* @__PURE__ */ React.createElement("a", { href: a.links.pubmed, target: "_blank", rel: "noopener", style: { ...BTN, background: "#fff", color: C.azul, border: `1px solid ${C.linha}` } }, "Ver no PubMed"), a.links.revista && /* @__PURE__ */ React.createElement("a", { href: a.links.revista, target: "_blank", rel: "noopener", style: { ...BTN, background: "#fff", color: C.azul, border: `1px solid ${C.linha}` } }, "Abrir na revista")), !a.links.pdf && !a.links.aberto && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.cinza, marginTop: 6 } }, "N\xE3o h\xE1 vers\xE3o aberta conhecida; o acesso pode depender de assinatura da revista."), aoGuardar && /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: aoGuardar,
      disabled: guardado,
      style: { ...BTN, marginTop: 10, width: "100%", justifyContent: "center", background: guardado ? C.azulBg : "#fff", color: C.azul, border: `1px solid ${guardado ? C.azulBg : C.linha}` }
    },
    guardado ? "Vinculado a esta nota" : "\xC9 este \u2014 vincular \xE0 nota"
  ));
}
function FolhaArtigo({ notaId, textoInicial, aoFechar }) {
  const appState = useAppState();
  const nota = (appState.captures || []).find((c) => c.id === notaId);
  const [texto, setTexto] = useState(textoInicial || nota && (nota.refLida || "") || "");
  const [res, setRes] = useState(null);
  const [ocupado, setOcupado] = useState(false);
  async function buscar(comTexto) {
    setOcupado(true);
    let corpo;
    if (comTexto && texto.trim()) corpo = { texto: texto.trim() };
    else {
      const imagem = await ccemFotoBase64(nota);
      if (!imagem) {
        setOcupado(false);
        showToast("A foto desta nota n\xE3o est\xE1 dispon\xEDvel");
        return;
      }
      corpo = { imagem };
    }
    const { dados, aviso } = await ccemPost("/api/referencia", corpo, 32e3);
    setOcupado(false);
    if (aviso) {
      showToast(aviso);
      return;
    }
    setRes(dados);
    if (dados.lido) {
      setTexto(dados.lido);
      updateAppState((st) => {
        const n = (st.captures || []).find((c) => c.id === notaId);
        if (n) n.refLida = dados.lido;
      });
    }
  }
  useEffect(() => {
    if (nota && !nota.artigo) buscar(!!texto.trim());
  }, []);
  if (!nota) return null;
  function vincular(a, nivel2) {
    const ok = updateAppState((st) => {
      const n = (st.captures || []).find((c) => c.id === notaId);
      if (n) n.artigo = { ...a, nivel: nivel2, vinculadoEm: Date.now() };
    });
    showToast(ok ? "Artigo vinculado \xE0 nota" : "N\xE3o foi poss\xEDvel salvar neste aparelho");
  }
  const nivel = res && CCEM_NIVEL[res.nivel];
  return /* @__PURE__ */ React.createElement(FolhaBase, { titulo: "Encontrar o artigo citado", aoFechar }, nota.artigo && !res && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, color: C.cinza, marginBottom: 8 } }, "Artigo j\xE1 vinculado a esta nota:"), /* @__PURE__ */ React.createElement(CartaoArtigo, { a: nota.artigo })), /* @__PURE__ */ React.createElement("label", { htmlFor: "ccem-ref", style: { display: "block", fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, marginBottom: 4 } }, "Refer\xEAncia lida no slide (pode corrigir)"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      id: "ccem-ref",
      value: texto,
      onChange: (e) => setTexto(e.target.value),
      rows: 3,
      placeholder: "Ex.: Funder JW et al. J Clin Endocrinol Metab 2016;101:1889",
      style: { width: "100%", boxSizing: "border-box", padding: "8px 10px", border: `1px solid ${C.linha}`, borderRadius: 10, fontFamily: "DM Sans,sans-serif", fontSize: 16, color: C.tinta, background: "#fff", resize: "vertical" }
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => buscar(true),
      disabled: ocupado || !texto.trim(),
      style: { width: "100%", minHeight: 44, margin: "8px 0 12px", background: C.azul, color: "#fff", border: "none", borderRadius: 10, fontFamily: "DM Sans,sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: ocupado || !texto.trim() ? 0.5 : 1 }
    },
    ocupado ? "Procurando no PubMed\u2026" : "Buscar no PubMed"
  ), nivel && /* @__PURE__ */ React.createElement("div", { role: "status", style: { padding: "8px 10px", background: nivel.fundo, borderLeft: `3px solid ${nivel.cor}`, borderRadius: 7, fontSize: 13, color: nivel.cor, lineHeight: 1.45, marginBottom: 10 } }, nivel.texto, (res.nivel === "nao_localizado" || res.nivel === "possivel") && texto.trim() && /* @__PURE__ */ React.createElement("a", { href: "https://scholar.google.com/scholar?q=" + encodeURIComponent(texto.trim()), target: "_blank", rel: "noopener", style: { display: "block", marginTop: 4, color: C.azul, fontWeight: 600 } }, "Procurar no Google Acad\xEAmico")), res && (res.candidatos || []).map((a) => /* @__PURE__ */ React.createElement(CartaoArtigo, { key: a.pmid, a, aoGuardar: () => vincular(a, res.nivel), guardado: nota.artigo && nota.artigo.pmid === a.pmid })), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, lineHeight: 1.45, marginTop: 6 } }, 'Busca no PubMed (NCBI). "PDF dispon\xEDvel" s\xF3 aparece quando h\xE1 vers\xE3o aberta e legal localizada (Unpaywall/PubMed Central). Vincular o artigo faz as respostas sobre o slide usarem tamb\xE9m o resumo dele \u2014 nunca o texto integral.'));
}
Object.assign(window, {
  CCEM_ATALHOS,
  ccemAcaoSlide,
  ccemOrganizarNota,
  ccemFalar,
  PainelSlide,
  FolhaArtigo,
  RespostaSlide,
  CartaoArtigo,
  FolhaBase
});
