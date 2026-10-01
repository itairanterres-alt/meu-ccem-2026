const CCEM_AVATAR = "v4/avatar-assistente.png";
const CCEM_RODAPE_IA = "Gerado por IA \u2014 confira na fonte";
const CCEM_EM_TESTES = "Assistente em fase de testes \u2014 dispon\xEDvel em breve";
const CCEM_PRIVACIDADE = "Perguntas e fotos enviadas aqui s\xE3o processadas pela Anthropic (EUA); o app n\xE3o guarda c\xF3pia no servidor. N\xE3o envie dados de pacientes.";
const CCEM_SUGESTOES = {
  home: [{ rotulo: "O que est\xE1 acontecendo agora?" }, { rotulo: "Onde pego o certificado?" }, { rotulo: "Quais sess\xF5es falam de tireoide?" }],
  programa: [{ rotulo: "O que est\xE1 acontecendo agora?" }, { rotulo: "Qual \xE9 a pr\xF3xima sess\xE3o?" }, { rotulo: "Quais sess\xF5es falam de obesidade?" }],
  info: [{ rotulo: "Onde pego o certificado?" }, { rotulo: "Qual o hor\xE1rio da secretaria?" }, { rotulo: "Como exporto meu caderno?" }],
  sessao: [{ rotulo: "Resuma esta sess\xE3o" }, { rotulo: "Anotar um slide", foto: true }, { rotulo: "Quem s\xE3o os palestrantes?" }]
};
const _conversa = { msgs: [], carregando: false };
const _ouvintesConversa = /* @__PURE__ */ new Set();
function _mudouConversa() {
  _ouvintesConversa.forEach((fn) => fn());
}
function useConversa() {
  const [, forcar] = useState(0);
  useEffect(() => {
    const fn = () => forcar((n) => n + 1);
    _ouvintesConversa.add(fn);
    return () => _ouvintesConversa.delete(fn);
  }, []);
  return _conversa;
}
function ccemRespostaEmTexto(r) {
  const partes = [r.mensagem];
  if (r.pontos && r.pontos.length) partes.push(r.pontos.map((p) => "\u2022 " + p).join("\n"));
  if (r.referencia) partes.push("Refer\xEAncia: " + r.referencia);
  const sess = (r.sessoes || []).map((id) => SESSOES[id]).filter(Boolean);
  if (sess.length) partes.push(sess.map((s) => `${s.inicio} \xB7 ${ccemRotulo(s)}`).join("\n"));
  return partes.filter(Boolean).join("\n\n");
}
async function ccemPerguntarAoAssistente({ texto, imagem, sessaoId, semHistorico }) {
  const historico = semHistorico ? [] : _conversa.msgs.filter((m) => m.papel === "usuario" && m.texto || m.papel === "assistente" && m.resposta).slice(-6).map((m) => ({ papel: m.papel, texto: m.papel === "usuario" ? m.texto : ccemRespostaEmTexto(m.resposta) }));
  const ctl = new AbortController();
  const relogio = setTimeout(() => ctl.abort(), 28e3);
  try {
    const res = await fetch("/api/assistente", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto, imagem, sessaoId, historico, agora: ccemAgora().toISOString(), userId: window.CCEM_USER_ID }),
      signal: ctl.signal
    });
    if (res.ok) return { resposta: await res.json() };
    if ([404, 405, 501, 503].includes(res.status)) return { aviso: CCEM_EM_TESTES };
    if (res.status === 429) return { aviso: "Voc\xEA chegou ao limite de 20 perguntas por hora. Tente de novo mais tarde." };
    if (res.status === 504) return { aviso: "O assistente demorou demais para responder. Tente de novo." };
    if (res.status === 413) return { aviso: "A foto ficou grande demais. Tente fotografar de novo." };
    return { aviso: "N\xE3o foi poss\xEDvel responder agora. Tente de novo." };
  } catch (e) {
    return { aviso: e && e.name === "AbortError" ? "O assistente demorou demais para responder. Tente de novo." : "Sem conex\xE3o com a internet. Tente de novo quando a rede voltar." };
  } finally {
    clearTimeout(relogio);
  }
}
async function ccemEnviarAoAssistente({ texto, arquivo, sessaoId }) {
  if (_conversa.carregando) return;
  texto = (texto || "").trim();
  let imagem = null, previa = null;
  if (arquivo) {
    try {
      ({ base64: imagem, previa } = await ccemReduzirFoto(arquivo));
    } catch (e) {
      showToast("N\xE3o foi poss\xEDvel ler a foto");
      return;
    }
  }
  if (!texto && !imagem) return;
  _conversa.msgs.push({ id: Date.now() + "u", papel: "usuario", texto, previa, sessaoId, ts: Date.now() });
  _conversa.carregando = true;
  _mudouConversa();
  const r = await ccemPerguntarAoAssistente({ texto, imagem, sessaoId });
  _conversa.msgs.push(r.resposta ? { id: Date.now() + "a", papel: "assistente", resposta: r.resposta, sessaoId, foto: !!imagem, previa, pergunta: texto, ts: Date.now() } : { id: Date.now() + "v", papel: "aviso", texto: r.aviso, ts: Date.now() });
  _conversa.carregando = false;
  _mudouConversa();
}
async function ccemSalvarNoCaderno(m) {
  m.salvo = true;
  _mudouConversa();
  const sessaoId = SESSOES[m.sessaoId] ? m.sessaoId : "";
  const { ok, id } = await ccemGravarNota({
    texto: m.pergunta || "",
    foto: m.previa || void 0,
    sessaoId,
    resumoIA: ccemRespostaEmTexto(m.resposta)
  });
  if (!ok) {
    m.salvo = false;
    _mudouConversa();
  }
  return id;
}
function CabecalhoAssistente({ aoFechar }) {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "8px 8px 8px 14px", background: "#fff", borderBottom: `1px solid ${C.linhaSoft}`, flexShrink: 0 } }, /* @__PURE__ */ React.createElement("img", { src: CCEM_AVATAR, alt: "", width: "32", height: "32", style: { width: 32, height: 32, borderRadius: "50%", background: C.azul, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: C.tinta } }, "Assistente CCEM"), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, fontWeight: 600, color: C.ouroTxt, background: C.ouroBg, padding: "0 7px", borderRadius: 8, letterSpacing: "0.04em" } }, "beta")), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza } }, "IA \xB7 respostas podem conter erros")), aoFechar && /* @__PURE__ */ React.createElement(
    "button",
    {
      autoFocus: true,
      onClick: aoFechar,
      "aria-label": "Fechar o assistente",
      style: { width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: C.cinza, flexShrink: 0, padding: 0 }
    },
    /* @__PURE__ */ React.createElement(IcoX, { size: 20 })
  ));
}
function RespostaIA({ m, aoNavegar }) {
  const r = m.resposta;
  const sessoes = (r.sessoes || []).map((id) => SESSOES[id]).filter(Boolean);
  return /* @__PURE__ */ React.createElement("div", { style: { maxWidth: "92%", background: "#fff", border: `1px solid ${C.linhaSoft}`, borderRadius: "14px 14px 14px 4px", padding: "10px 12px", fontSize: 13, lineHeight: 1.5, color: C.tinta, boxShadow: "0 1px 6px rgba(29,62,138,.06)" } }, /* @__PURE__ */ React.createElement("p", { style: { margin: 0, whiteSpace: "pre-wrap", fontWeight: r.modo === "anotacao" ? 600 : 400 } }, r.mensagem), r.pontos && r.pontos.length > 0 && /* @__PURE__ */ React.createElement("ul", { style: { margin: "8px 0 0", paddingLeft: 18 } }, r.pontos.map((p, i) => /* @__PURE__ */ React.createElement("li", { key: i, style: { marginBottom: 3 } }, p))), r.referencia && /* @__PURE__ */ React.createElement("p", { style: { margin: "8px 0 0", fontSize: 12, color: C.cinza } }, "Refer\xEAncia: ", r.referencia), sessoes.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6, marginTop: 10 } }, sessoes.map((s) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: s.id,
      onClick: () => {
        if (aoNavegar) aoNavegar();
        go("#/sessao/" + s.id);
      },
      style: { minHeight: 44, display: "flex", alignItems: "center", gap: 8, textAlign: "left", background: C.azulBg, border: "none", borderRadius: 9, padding: "6px 10px", cursor: "pointer", fontFamily: "inherit" }
    },
    /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, fontWeight: 700, color: C.azul, flexShrink: 0 } }, s.dia === DIAS[0] ? "sex" : "s\xE1b", " ", s.inicio),
    /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontSize: 12.5, fontWeight: 600, color: C.tinta, lineHeight: 1.3 } }, ccemRotulo(s)),
    /* @__PURE__ */ React.createElement(IcoChevR, { size: 14, color: C.azul })
  ))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginTop: 10, paddingTop: 8, borderTop: `1px solid ${C.linhaSoft}` } }, /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza } }, CCEM_RODAPE_IA), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => !m.salvo && ccemSalvarNoCaderno(m),
      disabled: m.salvo,
      style: { minHeight: 44, display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", padding: "0 4px", cursor: m.salvo ? "default" : "pointer", fontFamily: "DM Sans,sans-serif", fontSize: 12, fontWeight: 600, color: m.salvo ? C.cinza : C.azul, flexShrink: 0 }
    },
    m.salvo ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(IcoCheck, { size: 14 }), "No caderno") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(IcoBook, { size: 14 }), "Salvar no caderno")
  )));
}
function ConversaAssistente({ sessaoId, tela, aoNavegar }) {
  const conversa = useConversa();
  const [texto, setTexto] = useState("");
  const fotoRef = useRef(null);
  const fimRef = useRef(null);
  const sessao = SESSOES[sessaoId] || null;
  const sugestoes = CCEM_SUGESTOES[tela] || CCEM_SUGESTOES.home;
  useEffect(() => {
    const el = fimRef.current;
    if (el && el.parentNode) el.parentNode.scrollTop = el.parentNode.scrollHeight;
  }, [conversa.msgs.length, conversa.carregando]);
  function enviar(t) {
    const v = (t !== void 0 ? t : texto).trim();
    if (!v || conversa.carregando) return;
    if (t === void 0) setTexto("");
    ccemEnviarAoAssistente({ texto: v, sessaoId });
  }
  function usarSugestao(s) {
    if (s.foto) {
      fotoRef.current && fotoRef.current.click();
      return;
    }
    enviar(s.rotulo);
  }
  const vazia = conversa.msgs.length === 0;
  return /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "#f3f6fc" } }, sessao && /* @__PURE__ */ React.createElement("div", { style: { flexShrink: 0, padding: "7px 14px", background: C.azulBg, fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.azul } }, "Sobre ", /* @__PURE__ */ React.createElement("strong", null, ccemRotulo(sessao)), " \xB7 ", sessao.inicio), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflowY: "auto", padding: "12px 12px 4px" } }, vazia && /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 2px 4px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: C.tinta, marginBottom: 4 } }, "Como posso ajudar?"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, color: C.cinza, lineHeight: 1.5, marginBottom: 12 } }, "Anoto slides (foto ou texto), busco no programa e respondo d\xFAvidas pr\xE1ticas do congresso. N\xE3o discuto casos reais de pacientes.")), conversa.msgs.map((m) => /* @__PURE__ */ React.createElement("div", { key: m.id, style: { display: "flex", flexDirection: "column", alignItems: m.papel === "usuario" ? "flex-end" : "flex-start", marginBottom: 10 } }, m.papel === "usuario" && /* @__PURE__ */ React.createElement("div", { style: { maxWidth: "86%", background: C.azul, color: "#fff", borderRadius: "14px 14px 4px 14px", padding: "9px 12px", fontSize: 13, lineHeight: 1.5 } }, m.previa && /* @__PURE__ */ React.createElement("img", { src: m.previa, alt: "Slide enviado", style: { display: "block", maxWidth: 180, maxHeight: 180, borderRadius: 8, marginBottom: m.texto ? 6 : 0 } }), m.texto && /* @__PURE__ */ React.createElement("span", { style: { whiteSpace: "pre-wrap" } }, m.texto)), m.papel === "assistente" && /* @__PURE__ */ React.createElement(RespostaIA, { m, aoNavegar }), m.papel === "aviso" && /* @__PURE__ */ React.createElement("div", { style: { maxWidth: "92%", background: "#fff", border: `1px dashed ${C.linha}`, borderRadius: 12, padding: "9px 12px", fontSize: 12.5, color: C.cinza, lineHeight: 1.45 } }, m.texto))), conversa.carregando && /* @__PURE__ */ React.createElement("div", { role: "status", "aria-label": "O assistente est\xE1 respondendo", style: { display: "flex", gap: 4, padding: "10px 12px", background: "#fff", borderRadius: "14px 14px 14px 4px", width: 60, border: `1px solid ${C.linhaSoft}`, marginBottom: 10 } }, [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement("span", { key: i, style: { width: 7, height: 7, borderRadius: "50%", background: C.cinza, display: "inline-block", animation: `ccem-bounce .9s ${i * 0.2}s ease-in-out infinite` } }))), !conversa.carregando && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, margin: "4px 0 8px" } }, sugestoes.map((s) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: s.rotulo,
      onClick: () => usarSugestao(s),
      style: { minHeight: 44, display: "flex", alignItems: "center", gap: 6, background: "#fff", border: `1px solid ${C.linha}`, borderRadius: 22, padding: "0 14px", cursor: "pointer", fontFamily: "DM Sans,sans-serif", fontSize: 12.5, fontWeight: 500, color: C.azul }
    },
    s.foto && /* @__PURE__ */ React.createElement(IcoCam, { size: 15, color: C.azul }),
    s.rotulo
  ))), /* @__PURE__ */ React.createElement("div", { ref: fimRef })), /* @__PURE__ */ React.createElement("div", { style: { flexShrink: 0, background: "#fff", borderTop: `1px solid ${C.linhaSoft}`, padding: "6px 10px 10px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, lineHeight: 1.4, margin: "0 2px 6px" } }, CCEM_PRIVACIDADE), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 7 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "file",
      accept: "image/*",
      capture: "environment",
      ref: fotoRef,
      style: { display: "none" },
      onChange: (e) => {
        const f = e.target.files && e.target.files[0];
        e.target.value = "";
        if (!f) return;
        ccemEnviarAoAssistente({ arquivo: f, texto, sessaoId });
        setTexto("");
      }
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => fotoRef.current && fotoRef.current.click(),
      "aria-label": "Fotografar um slide",
      disabled: conversa.carregando,
      style: { width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.linha}`, background: "#f8fafd", borderRadius: 12, cursor: "pointer", flexShrink: 0, padding: 0 }
    },
    /* @__PURE__ */ React.createElement(IcoCam, { size: 19, color: C.azul })
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      value: texto,
      onChange: (e) => setTexto(e.target.value),
      onKeyDown: (e) => e.key === "Enter" && !e.shiftKey && enviar(),
      placeholder: "Pergunte ou anote\u2026",
      "aria-label": "Pergunta ao assistente",
      maxLength: 2e3,
      style: { flex: 1, minWidth: 0, minHeight: 44, padding: "8px 14px", border: `1px solid ${C.linha}`, borderRadius: 24, fontFamily: "DM Sans,sans-serif", fontSize: 16, color: C.tinta, background: "#f8fafd", outline: "none" }
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => enviar(),
      "aria-label": "Enviar",
      disabled: conversa.carregando || !texto.trim(),
      style: { width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", border: "none", background: C.azul, opacity: conversa.carregando || !texto.trim() ? 0.45 : 1, borderRadius: 12, cursor: "pointer", flexShrink: 0, padding: 0 }
    },
    /* @__PURE__ */ React.createElement(IcoSend, { size: 17, color: "#fff" })
  ))));
}
function AssistenteScreen() {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" } }, /* @__PURE__ */ React.createElement(CabecalhoAssistente, null), /* @__PURE__ */ React.createElement(ConversaAssistente, { tela: "home" }));
}
function PainelAssistente({ sessaoId, tela, aoFechar }) {
  const [entrou, setEntrou] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntrou(true));
    const esc = (e) => {
      if (e.key === "Escape") aoFechar();
    };
    window.addEventListener("keydown", esc);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("keydown", esc);
    };
  }, []);
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "ccem-painel",
      onClick: aoFechar,
      style: { position: "fixed", inset: 0, zIndex: 300, background: entrou ? "rgba(10,18,50,.38)" : "rgba(10,18,50,0)", transition: "background .2s", display: "flex", flexDirection: "column", justifyContent: "flex-end" }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Assistente CCEM",
        onClick: (e) => e.stopPropagation(),
        style: {
          height: "85%",
          width: "100%",
          maxWidth: 560,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "#fff",
          borderRadius: "18px 18px 0 0",
          boxShadow: "0 -6px 32px rgba(10,18,50,.22)",
          transform: entrou ? "translateY(0)" : "translateY(100%)",
          transition: "transform .25s ease-out",
          paddingBottom: "env(safe-area-inset-bottom)"
        }
      },
      /* @__PURE__ */ React.createElement(CabecalhoAssistente, { aoFechar }),
      /* @__PURE__ */ React.createElement(ConversaAssistente, { sessaoId, tela, aoNavegar: aoFechar })
    )
  );
}
function BotaoAssistente({ aoTocar }) {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "ccem-fab",
      onClick: aoTocar,
      "aria-label": "Abrir o Assistente CCEM",
      style: {
        position: "absolute",
        right: 16,
        bottom: 16,
        zIndex: 40,
        width: 52,
        height: 52,
        padding: 0,
        border: "none",
        borderRadius: "50%",
        background: C.azul,
        cursor: "pointer",
        boxShadow: "0 4px 14px rgba(10,18,50,.28)"
      }
    },
    /* @__PURE__ */ React.createElement("img", { src: CCEM_AVATAR, alt: "", width: "52", height: "52", style: { display: "block", width: 52, height: 52, borderRadius: "50%" } })
  );
}
const CCEM_APRESENTADO = "ccem2026:assistenteApresentado";
function useApresentacaoAssistente() {
  const [pendente, setPendente] = useState(() => {
    try {
      return !localStorage.getItem(CCEM_APRESENTADO);
    } catch (e) {
      return !window.__ccemApresentado;
    }
  });
  const concluir = () => {
    try {
      localStorage.setItem(CCEM_APRESENTADO, "1");
    } catch (e) {
    }
    window.__ccemApresentado = true;
    setPendente(false);
  };
  return [pendente, concluir];
}
function BalaoAssistente({ aoExperimentar, aoFechar }) {
  const ITEM = { display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: C.tinta, lineHeight: 1.4, marginBottom: 5 };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "ccem-balao",
      role: "dialog",
      "aria-label": "Conhe\xE7a o Assistente CCEM",
      style: {
        position: "absolute",
        right: 16,
        bottom: 80,
        zIndex: 41,
        width: "min(312px, calc(100% - 32px))",
        background: "#fff",
        borderRadius: 14,
        border: `1px solid ${C.linha}`,
        boxShadow: "0 8px 28px rgba(10,18,50,.22)",
        padding: "12px 14px 10px"
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("img", { src: CCEM_AVATAR, alt: "", width: "32", height: "32", style: { width: 32, height: 32, borderRadius: "50%" } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: C.tinta } }, "Assistente CCEM"), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, fontWeight: 600, color: C.ouroTxt, background: C.ouroBg, padding: "0 7px", borderRadius: 8 } }, "beta")), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza } }, "IA \xB7 respostas podem conter erros"))),
    /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: C.tinta, marginBottom: 6 } }, "Posso ajudar durante o congresso:"),
    /* @__PURE__ */ React.createElement("div", { style: ITEM }, /* @__PURE__ */ React.createElement(IcoCam, { size: 16, color: C.azul }), /* @__PURE__ */ React.createElement("span", null, "Anotar um slide pela foto: mensagem-chave e pontos principais")),
    /* @__PURE__ */ React.createElement("div", { style: ITEM }, /* @__PURE__ */ React.createElement(IcoSearch, { size: 16, color: C.azul }), /* @__PURE__ */ React.createElement("span", null, "Encontrar sess\xF5es, temas e palestrantes")),
    /* @__PURE__ */ React.createElement("div", { style: ITEM }, /* @__PURE__ */ React.createElement(IcoChat, { size: 16, color: C.azul }), /* @__PURE__ */ React.createElement("span", null, "Responder d\xFAvidas pr\xE1ticas: certificado, secretaria, local")),
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 10 } }, /* @__PURE__ */ React.createElement("button", { onClick: aoFechar, style: { flex: 1, minHeight: 44, background: "#fff", border: `1px solid ${C.linha}`, borderRadius: 10, fontFamily: "DM Sans,sans-serif", fontSize: 13, fontWeight: 600, color: C.cinza, cursor: "pointer" } }, "Agora n\xE3o"), /* @__PURE__ */ React.createElement("button", { onClick: aoExperimentar, style: { flex: 1, minHeight: 44, background: C.azul, border: "none", borderRadius: 10, fontFamily: "DM Sans,sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" } }, "Experimentar")),
    /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "DM Sans,system-ui,sans-serif", fontSize: 12, color: C.cinza, textAlign: "center", marginTop: 8 } }, 'Depois, \xE9 s\xF3 tocar no "8".'),
    /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: { position: "absolute", right: 20, bottom: -7, width: 14, height: 14, background: "#fff", borderRight: `1px solid ${C.linha}`, borderBottom: `1px solid ${C.linha}`, transform: "rotate(45deg)" } })
  );
}
function useTecladoAberto() {
  const [aberto, setAberto] = useState(false);
  useEffect(() => {
    const toque = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (!toque) return;
    const ehCampo = (el) => !!el && (el.tagName === "TEXTAREA" || el.tagName === "INPUT" && !/^(file|button|checkbox|radio|submit|range)$/i.test(el.type));
    const vv = window.visualViewport;
    const atualizar = () => setAberto(ehCampo(document.activeElement) || (vv ? window.innerHeight - vv.height > 150 : false));
    const depois = () => setTimeout(atualizar, 60);
    document.addEventListener("focusin", atualizar);
    document.addEventListener("focusout", depois);
    if (vv) vv.addEventListener("resize", atualizar);
    return () => {
      document.removeEventListener("focusin", atualizar);
      document.removeEventListener("focusout", depois);
      if (vv) vv.removeEventListener("resize", atualizar);
    };
  }, []);
  return aberto;
}
function ccemAbrirAssistente() {
  window.dispatchEvent(new CustomEvent("ccem:abrir-assistente"));
}
Object.assign(window, {
  AssistenteScreen,
  PainelAssistente,
  BotaoAssistente,
  BalaoAssistente,
  useApresentacaoAssistente,
  useTecladoAberto,
  ccemAbrirAssistente,
  ccemRespostaEmTexto,
  CCEM_SUGESTOES
});
