const CCEM_SESSAO = "ccem2026:sessao";
const CCEM_AVISO_LOGIN = "Os recursos de IA s\xE3o exclusivos para inscritos. Toque de novo e entre com o e-mail da sua inscri\xE7\xE3o.";
function ccemSessao() {
  let s = window.__ccemSessao;
  if (s === void 0) {
    try {
      s = JSON.parse(localStorage.getItem(CCEM_SESSAO) || "null");
    } catch (e) {
      s = null;
    }
  }
  return s && s.token && s.validade > Date.now() ? s : null;
}
function ccemGuardarSessao(s) {
  window.__ccemSessao = s;
  try {
    s ? localStorage.setItem(CCEM_SESSAO, JSON.stringify(s)) : localStorage.removeItem(CCEM_SESSAO);
  } catch (e) {
  }
  window.dispatchEvent(new Event("ccem:sessao"));
}
function useSessao() {
  const [s, setS] = useState(ccemSessao);
  useEffect(() => {
    const fn = () => setS(ccemSessao());
    window.addEventListener("ccem:sessao", fn);
    return () => window.removeEventListener("ccem:sessao", fn);
  }, []);
  return s;
}
let _pedidoLogin = null;
function ccemPedirLogin() {
  if (_pedidoLogin) return _pedidoLogin.promessa;
  let resolver;
  const promessa = new Promise((r) => {
    resolver = r;
  });
  _pedidoLogin = { promessa, concluir: (ok) => {
    _pedidoLogin = null;
    resolver(ok);
  } };
  window.dispatchEvent(new Event("ccem:entrar"));
  return promessa;
}
async function ccemFetchIA(url, corpo, tempoMs) {
  const tentar = async () => {
    const ctl = new AbortController();
    const relogio = setTimeout(() => ctl.abort(), tempoMs || 32e3);
    const s = ccemSessao();
    try {
      return await fetch(url, {
        method: "POST",
        signal: ctl.signal,
        body: JSON.stringify(corpo),
        headers: { "Content-Type": "application/json", ...s ? { Authorization: "Bearer " + s.token } : {} }
      });
    } finally {
      clearTimeout(relogio);
    }
  };
  let res = await tentar();
  if (res.status === 401) {
    if (ccemSessao()) ccemGuardarSessao(null);
    if (await ccemPedirLogin()) res = await tentar();
  }
  return res;
}
const CCEM_ERROS_ENTRAR = {
  email: "Confira o e-mail digitado.",
  nao_inscrito: "N\xE3o encontramos este e-mail entre os inscritos confirmados. Use o mesmo e-mail da inscri\xE7\xE3o; se ela acabou de ser confirmada, tente de novo em uma hora. Palestrantes e convidados: procurem a secretaria.",
  limite: "Muitas tentativas. Aguarde alguns minutos e tente de novo.",
  envio: "N\xE3o conseguimos enviar o e-mail agora. Tente de novo em instantes.",
  codigo: "C\xF3digo incorreto. Confira o e-mail mais recente.",
  expirado: "O c\xF3digo expirou. Pe\xE7a um novo.",
  desligado: "O acesso est\xE1 em manuten\xE7\xE3o. Tente mais tarde."
};
async function ccemPostEntrar(corpo) {
  try {
    const res = await fetch("/api/entrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
      signal: AbortSignal.timeout ? AbortSignal.timeout(25e3) : void 0
    });
    let dados = {};
    try {
      dados = await res.json();
    } catch (e) {
    }
    if (res.ok) return { dados };
    return { erro: CCEM_ERROS_ENTRAR[dados.erro] || "N\xE3o foi poss\xEDvel continuar agora. Tente de novo." };
  } catch (e) {
    return { erro: "Sem conex\xE3o com a internet. Tente de novo quando a rede voltar." };
  }
}
let _ultimoEmail = "";
function FolhaEntrar({ aoConcluir }) {
  const [etapa, setEtapa] = useState("email");
  const [email, setEmail] = useState(_ultimoEmail);
  const [codigo, setCodigo] = useState("");
  const [desafio, setDesafio] = useState(null);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");
  const codigoRef = useRef(null);
  async function pedir(e) {
    if (e) e.preventDefault();
    const em = email.trim();
    if (!em || ocupado) return;
    _ultimoEmail = em;
    setOcupado(true);
    setErro("");
    const r = await ccemPostEntrar({ acao: "pedir", email: em });
    setOcupado(false);
    if (r.erro) {
      setErro(r.erro);
      return;
    }
    setDesafio(r.dados.desafio);
    setCodigo("");
    setEtapa("codigo");
    setTimeout(() => codigoRef.current && codigoRef.current.focus(), 50);
  }
  async function confirmar(e) {
    if (e) e.preventDefault();
    if (codigo.length !== 6 || ocupado) return;
    setOcupado(true);
    setErro("");
    const r = await ccemPostEntrar({ acao: "confirmar", desafio, codigo });
    setOcupado(false);
    if (r.erro) {
      setErro(r.erro);
      return;
    }
    ccemGuardarSessao({ token: r.dados.sessao, validade: r.dados.validade, email: _ultimoEmail.trim().toLowerCase() });
    showToast("Pronto! Voc\xEA j\xE1 pode usar a IA.");
    aoConcluir(true);
  }
  const CAMPO = {
    width: "100%",
    boxSizing: "border-box",
    minHeight: 48,
    padding: "10px 12px",
    border: `1px solid ${C.linha}`,
    borderRadius: 10,
    fontSize: 16,
    fontFamily: "DM Sans,system-ui,sans-serif",
    color: C.tinta,
    background: "#fff"
  };
  const BOTAO = {
    width: "100%",
    minHeight: 48,
    marginTop: 10,
    border: "none",
    borderRadius: 10,
    background: C.azul,
    color: "#fff",
    fontFamily: "DM Sans,sans-serif",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer"
  };
  const LINK = {
    minHeight: 44,
    padding: "0 6px",
    background: "none",
    border: "none",
    color: C.azul,
    fontFamily: "DM Sans,sans-serif",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer"
  };
  return /* @__PURE__ */ React.createElement(FolhaBase, { titulo: "Entrar para usar a IA", altura: "auto", aoFechar: () => aoConcluir(false) }, etapa === "email" ? /* @__PURE__ */ React.createElement("form", { onSubmit: pedir }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: C.tinta, lineHeight: 1.5, margin: "0 0 12px" } }, "O Assistente e os recursos de IA s\xE3o exclusivos para inscritos do CCEM 2026. Digite o e-mail usado na inscri\xE7\xE3o: enviaremos um c\xF3digo de 6 d\xEDgitos. Sem senha."), /* @__PURE__ */ React.createElement("label", { htmlFor: "ccem-entrar-email", style: { display: "block", fontSize: 13, fontWeight: 600, color: C.tinta, marginBottom: 6 } }, "E-mail da inscri\xE7\xE3o"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "ccem-entrar-email",
      type: "email",
      inputMode: "email",
      autoComplete: "email",
      autoCapitalize: "none",
      spellCheck: false,
      value: email,
      onChange: (e) => setEmail(e.target.value),
      style: CAMPO,
      placeholder: "nome@exemplo.com"
    }
  ), /* @__PURE__ */ React.createElement("button", { type: "submit", disabled: ocupado || !email.trim(), style: { ...BOTAO, opacity: ocupado || !email.trim() ? 0.55 : 1 } }, ocupado ? "Enviando\u2026" : "Enviar c\xF3digo")) : /* @__PURE__ */ React.createElement("form", { onSubmit: confirmar }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: C.tinta, lineHeight: 1.5, margin: "0 0 12px" } }, "Enviamos um c\xF3digo para ", /* @__PURE__ */ React.createElement("b", null, _ultimoEmail), ". Pode levar um minuto; se n\xE3o chegar, confira o spam."), /* @__PURE__ */ React.createElement("label", { htmlFor: "ccem-entrar-codigo", style: { display: "block", fontSize: 13, fontWeight: 600, color: C.tinta, marginBottom: 6 } }, "C\xF3digo de 6 d\xEDgitos"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "ccem-entrar-codigo",
      ref: codigoRef,
      inputMode: "numeric",
      autoComplete: "one-time-code",
      value: codigo,
      onChange: (e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6)),
      style: { ...CAMPO, fontSize: 24, letterSpacing: 8, textAlign: "center", fontWeight: 700 }
    }
  ), /* @__PURE__ */ React.createElement("button", { type: "submit", disabled: ocupado || codigo.length !== 6, style: { ...BOTAO, opacity: ocupado || codigo.length !== 6 ? 0.55 : 1 } }, ocupado ? "Conferindo\u2026" : "Entrar"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 6 } }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => {
    setEtapa("email");
    setErro("");
  }, style: LINK }, "Usar outro e-mail"), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => pedir(), disabled: ocupado, style: LINK }, "Reenviar c\xF3digo"))), /* @__PURE__ */ React.createElement("div", { role: "alert" }, erro && /* @__PURE__ */ React.createElement("p", { style: { margin: "12px 0 0", padding: "9px 11px", background: "#fff4ec", border: "1px solid #f3c9a8", borderRadius: 9, fontSize: 13, color: "#8a3a0c", lineHeight: 1.45 } }, erro)), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, color: C.cinza, lineHeight: 1.5, margin: "14px 0 4px" } }, "Seu e-mail \xE9 usado s\xF3 para conferir a inscri\xE7\xE3o na lista da organiza\xE7\xE3o. Voc\xEA fica conectado neste aparelho at\xE9 31/12/2026. Programa e Caderno funcionam sem entrar."));
}
function HostEntrar() {
  const [aberto, setAberto] = useState(false);
  useEffect(() => {
    const abrir = () => setAberto(true);
    window.addEventListener("ccem:entrar", abrir);
    return () => window.removeEventListener("ccem:entrar", abrir);
  }, []);
  if (!aberto) return null;
  return /* @__PURE__ */ React.createElement(FolhaEntrar, { aoConcluir: (ok) => {
    setAberto(false);
    if (_pedidoLogin) _pedidoLogin.concluir(ok);
  } });
}
function SessaoInfo() {
  const s = useSessao();
  if (!s) return null;
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderTop: `1px solid ${C.linhaSoft}`, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { flex: 1, minWidth: 0, fontSize: 12.5, color: C.tinta, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, "IA liberada para ", /* @__PURE__ */ React.createElement("b", null, s.email || "este aparelho")), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        ccemGuardarSessao(null);
        showToast("Voc\xEA saiu. Programa e Caderno continuam dispon\xEDveis.");
      },
      style: { minHeight: 44, padding: "0 14px", background: "#fff", border: `1px solid ${C.linha}`, borderRadius: 9, fontFamily: "DM Sans,sans-serif", fontSize: 13, fontWeight: 600, color: C.azul, cursor: "pointer" }
    },
    "Sair"
  ));
}
Object.assign(window, {
  CCEM_AVISO_LOGIN,
  ccemSessao,
  ccemGuardarSessao,
  ccemPedirLogin,
  ccemFetchIA,
  FolhaEntrar,
  HostEntrar,
  SessaoInfo
});
