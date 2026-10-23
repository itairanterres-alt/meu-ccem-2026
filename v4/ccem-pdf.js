const _PDF_ESPECIAIS = {
  "\u20AC": 128,
  "\u201A": 130,
  "\u0192": 131,
  "\u201E": 132,
  "\u2026": 133,
  "\u2020": 134,
  "\u2021": 135,
  "\u02C6": 136,
  "\u2030": 137,
  "\u0160": 138,
  "\u2039": 139,
  "\u0152": 140,
  "\u017D": 142,
  "\u2018": 145,
  "\u2019": 146,
  "\u201C": 147,
  "\u201D": 148,
  "\u2022": 149,
  "\u2013": 150,
  "\u2014": 151,
  "\u02DC": 152,
  "\u2122": 153,
  "\u0161": 154,
  "\u203A": 155,
  "\u0153": 156,
  "\u017E": 158,
  "\u0178": 159
};
const _PDF_TROCAS = {
  "\u2265": ">=",
  "\u2264": "<=",
  "\u2192": "->",
  "\u2190": "<-",
  "\u2194": "<->",
  "\u21D2": "=>",
  "\u2191": "^",
  "\u2193": "v",
  "\u2248": "~",
  "\u2260": "!=",
  "\u2212": "-",
  "\u2010": "-",
  "\u2011": "-",
  "\u03B1": "alfa",
  "\u03B2": "beta",
  "\u03B3": "gama",
  "\u03B4": "delta",
  "\u0394": "Delta",
  "\u03BA": "kappa",
  "\u03BB": "lambda",
  "\u03C3": "sigma",
  "\u03C0": "pi",
  "\u03C9": "omega",
  "\u03BC": "\xB5",
  "\u2713": "v",
  "\u2714": "v",
  "\u2717": "x",
  "\u2032": "'",
  "\u2033": '"',
  "\u2009": " ",
  "\u202F": " ",
  "\xA0": " ",
  "\u200B": "",
  "	": " "
};
const _PDF_W_ASCII = [
  278,
  278,
  355,
  556,
  556,
  889,
  667,
  191,
  333,
  333,
  389,
  584,
  278,
  333,
  278,
  278,
  556,
  556,
  556,
  556,
  556,
  556,
  556,
  556,
  556,
  556,
  278,
  278,
  584,
  584,
  584,
  556,
  1015,
  667,
  667,
  722,
  722,
  667,
  611,
  778,
  722,
  278,
  500,
  667,
  556,
  833,
  722,
  778,
  667,
  778,
  722,
  667,
  611,
  722,
  667,
  944,
  667,
  667,
  611,
  278,
  278,
  278,
  469,
  556,
  333,
  556,
  556,
  500,
  556,
  556,
  278,
  556,
  556,
  222,
  222,
  500,
  222,
  833,
  556,
  556,
  556,
  556,
  333,
  500,
  278,
  556,
  500,
  722,
  500,
  500,
  500,
  334,
  260,
  334,
  584
];
const _PDF_W_OUTROS = {
  "\u20AC": 556,
  "\u2026": 1e3,
  "\u2013": 556,
  "\u2014": 1e3,
  "\u2022": 350,
  "\u2018": 222,
  "\u2019": 222,
  "\u201C": 333,
  "\u201D": 333,
  "\u201A": 222,
  "\u201E": 333,
  "\xB0": 400,
  "\xB7": 278,
  "\xAA": 370,
  "\xBA": 365,
  "\xB5": 556,
  "\xB1": 584,
  "\xB2": 333,
  "\xB3": 333,
  "\xB9": 333,
  "\xBC": 834,
  "\xBD": 834,
  "\xBE": 834,
  "\xA7": 556,
  "\xB6": 537,
  "\xA9": 737,
  "\xAE": 737,
  "\xAC": 584,
  "\xBF": 611,
  "\xA1": 333,
  "\xAB": 556,
  "\xBB": 556,
  "\u2122": 1e3,
  "\u2030": 1e3,
  "\xC6": 1e3,
  "\xE6": 889,
  "\xDF": 611,
  "\xD8": 778,
  "\xF8": 611,
  "\u0152": 1e3,
  "\u0153": 944,
  "\xD7": 584,
  "\xF7": 584
};
function _pdfCodigo(ch) {
  const c = ch.charCodeAt(0);
  if (c >= 32 && c <= 126 || c >= 161 && c <= 255) return c;
  return _PDF_ESPECIAIS[ch] || 0;
}
function _pdfLimpo(t) {
  let s = "";
  for (const ch of String(t == null ? "" : t).normalize("NFC").replace(/\r\n?/g, "\n")) {
    if (ch === "\n") {
      s += ch;
      continue;
    }
    const troca = _PDF_TROCAS[ch];
    if (troca !== void 0) {
      s += troca;
      continue;
    }
    if (_pdfCodigo(ch)) {
      s += ch;
      continue;
    }
    const base = ch.normalize("NFD")[0];
    if (base && base !== ch && _pdfCodigo(base)) {
      s += base;
      continue;
    }
    const cp = ch.codePointAt(0);
    if (cp < 32 || cp > 65535 || cp >= 9728 && cp <= 10175 || cp >= 65024 && cp <= 65039) continue;
    s += "?";
  }
  return s;
}
function _pdfLargura(s, tam, fonte) {
  let w = 0;
  for (const ch of s) {
    const c = ch.charCodeAt(0);
    w += c >= 32 && c <= 126 ? _PDF_W_ASCII[c - 32] : _PDF_W_OUTROS[ch] || (_PDF_W_ASCII[(ch.normalize("NFD").charCodeAt(0) || 32) - 32] || 556);
  }
  return w * tam / 1e3 * (fonte === "B" ? 1.1 : 1);
}
function _pdfStr(s) {
  let o = "";
  for (const ch of s) {
    const b = _pdfCodigo(ch) || 63;
    const x = String.fromCharCode(b);
    o += x === "\\" || x === "(" || x === ")" ? "\\" + x : x;
  }
  return "(" + o + ")";
}
function _pdfQuebrar(texto, maxW, tam, fonte) {
  const linhas = [];
  for (const par of _pdfLimpo(texto).split("\n")) {
    let atual = "";
    for (const palavra of par.split(" ")) {
      const tent = atual ? atual + " " + palavra : palavra;
      if (_pdfLargura(tent, tam, fonte) <= maxW) {
        atual = tent;
        continue;
      }
      if (atual) linhas.push(atual);
      atual = palavra;
      while (_pdfLargura(atual, tam, fonte) > maxW) {
        let k = atual.length - 1;
        while (k > 1 && _pdfLargura(atual.slice(0, k), tam, fonte) > maxW) k--;
        linhas.push(atual.slice(0, k));
        atual = atual.slice(k);
      }
    }
    linhas.push(atual);
  }
  return linhas;
}
function _pdfDimensoesJpeg(bin) {
  let i = 2;
  while (i < bin.length - 9) {
    if (bin.charCodeAt(i) !== 255) {
      i++;
      continue;
    }
    const m = bin.charCodeAt(i + 1);
    if (m >= 192 && m <= 195) {
      return { h: bin.charCodeAt(i + 5) << 8 | bin.charCodeAt(i + 6), w: bin.charCodeAt(i + 7) << 8 | bin.charCodeAt(i + 8), comp: bin.charCodeAt(i + 9) };
    }
    i += 2 + (bin.charCodeAt(i + 2) << 8 | bin.charCodeAt(i + 3));
  }
  return null;
}
function _pdfParaJpeg(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement("canvas");
      cv.width = img.naturalWidth;
      cv.height = img.naturalHeight;
      const g = cv.getContext("2d");
      g.fillStyle = "#fff";
      g.fillRect(0, 0, cv.width, cv.height);
      g.drawImage(img, 0, 0);
      resolve(cv.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}
async function _pdfFoto(dataUrl) {
  if (!dataUrl) return null;
  if (!/^data:image\/jpeg;/.test(dataUrl)) dataUrl = await _pdfParaJpeg(dataUrl);
  if (!dataUrl) return null;
  let bin;
  try {
    bin = atob(dataUrl.split(",")[1]);
  } catch (e) {
    return null;
  }
  let d = _pdfDimensoesJpeg(bin);
  if (d && d.comp !== 3 && d.comp !== 1) {
    const rgb = await _pdfParaJpeg(dataUrl);
    if (!rgb) return null;
    bin = atob(rgb.split(",")[1]);
    d = _pdfDimensoesJpeg(bin);
  }
  return d && d.w && d.h ? { bin, w: d.w, h: d.h, cinza: d.comp === 1 } : null;
}
const _PDF_PAG = { w: 595.28, h: 841.89, m: 48 };
const _PDF_COR = { tinta: "0.10 0.14 0.22", cinza: "0.36 0.40 0.48", azul: "0.11 0.24 0.54", linha: "0.84 0.87 0.94" };
function ccemMontarPdf(blocos, titulo) {
  const { w: W, h: H, m: M } = _PDF_PAG, larg = W - 2 * M;
  const paginas = [];
  let pag, y;
  const nova = () => {
    pag = { ops: [], imgs: [] };
    paginas.push(pag);
    y = H - M;
  };
  const cabe = (h) => {
    if (y - h < M + 18) nova();
  };
  const fonteDe = (f) => f === "B" ? "/F2" : f === "I" ? "/F3" : "/F1";
  nova();
  function texto(t, o) {
    const tam = o.tam || 10, f = o.fonte || "R", recuo = o.recuo || 0, lh = tam * 1.38;
    for (const linha2 of _pdfQuebrar(t, larg - recuo, tam, f)) {
      cabe(lh);
      if (linha2) pag.ops.push(`BT ${fonteDe(f)} ${tam} Tf ${o.cor || _PDF_COR.tinta} rg ${(M + recuo).toFixed(2)} ${(y - tam).toFixed(2)} Td ${_pdfStr(linha2)} Tj ET`);
      if (o.barra) pag.ops.push(`${_PDF_COR.azul} rg ${(M + 1).toFixed(2)} ${(y - lh + 1).toFixed(2)} 2 ${lh.toFixed(2)} re f`);
      y -= lh;
    }
    if (o.depois) y -= o.depois;
  }
  function foto(f) {
    const esc = Math.min(larg / f.w, 300 / f.h), dw = f.w * esc, dh = f.h * esc;
    cabe(dh + 8);
    const nome = "/Im" + pag.imgs.length;
    pag.imgs.push({ nome, f });
    pag.ops.push(`q ${dw.toFixed(2)} 0 0 ${dh.toFixed(2)} ${M} ${(y - dh).toFixed(2)} cm ${nome} Do Q`);
    y -= dh + 8;
  }
  function linha() {
    cabe(12);
    pag.ops.push(`${_PDF_COR.linha} RG 0.6 w ${M} ${(y - 4).toFixed(2)} m ${W - M} ${(y - 4).toFixed(2)} l S`);
    y -= 12;
  }
  for (const b of blocos) {
    if (b.tipo === "texto") texto(b.texto, b);
    else if (b.tipo === "foto") foto(b.foto);
    else if (b.tipo === "linha") linha();
    else if (b.tipo === "espaco") y -= b.h;
  }
  paginas.forEach((p, i) => {
    p.ops.push(`BT /F1 8 Tf ${_PDF_COR.cinza} rg ${M} ${M - 22} Td ${_pdfStr(_pdfLimpo(titulo + " \xB7 p\xE1gina " + (i + 1) + " de " + paginas.length))} Tj ET`);
  });
  const objs = [];
  const add = (corpo) => {
    objs.push(corpo);
    return objs.length;
  };
  add("<< /Type /Catalog /Pages 2 0 R >>");
  add(null);
  ["Helvetica", "Helvetica-Bold", "Helvetica-Oblique"].forEach((f) => add(`<< /Type /Font /Subtype /Type1 /BaseFont /${f} /Encoding /WinAnsiEncoding >>`));
  add(`<< /Title ${_pdfStr(_pdfLimpo(titulo))} /Producer (Meu CCEM 2026) >>`);
  const kids = [];
  for (const p of paginas) {
    const xo = p.imgs.map(({ nome, f }) => {
      const n = add(`<< /Type /XObject /Subtype /Image /Width ${f.w} /Height ${f.h} /ColorSpace /${f.cinza ? "DeviceGray" : "DeviceRGB"} /BitsPerComponent 8 /Filter /DCTDecode /Length ${f.bin.length} >>
stream
${f.bin}
endstream`);
      return `${nome} ${n} 0 R`;
    });
    const conteudo = p.ops.join("\n");
    const nc = add(`<< /Length ${conteudo.length} >>
stream
${conteudo}
endstream`);
    kids.push(add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >>${xo.length ? " /XObject << " + xo.join(" ") + " >>" : ""} >> /Contents ${nc} 0 R >>`));
  }
  objs[1] = `<< /Type /Pages /Kids [${kids.map((k) => k + " 0 R").join(" ")}] /Count ${kids.length} >>`;
  const partes = ["%PDF-1.4\n%\xE2\xE3\xCF\xD3\n"];
  let pos = partes[0].length;
  const offsets = [];
  objs.forEach((o, i) => {
    const s = `${i + 1} 0 obj
${o}
endobj
`;
    offsets.push(pos);
    partes.push(s);
    pos += s.length;
  });
  partes.push(`xref
0 ${objs.length + 1}
0000000000 65535 f 
` + offsets.map((o) => String(o).padStart(10, "0") + " 00000 n \n").join("") + `trailer
<< /Size ${objs.length + 1} /Root 1 0 R /Info 6 0 R >>
startxref
${pos}
%%EOF
`);
  const bin = partes.join("");
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i) & 255;
  return { bytes, paginas: paginas.length };
}
async function ccemGerarPdfCaderno(captures) {
  const lista = [...captures || []].sort((a, b) => a.ts - b.ts);
  const hoje = ccemDataHoraJoinville(Date.now()).data;
  const IA = "Gerado por IA \u2014 confira na fonte.";
  const blocos = [
    { tipo: "texto", texto: "Meu Caderno \xB7 CCEM 2026", tam: 18, fonte: "B", cor: _PDF_COR.azul },
    { tipo: "texto", texto: `${lista.length} nota${lista.length !== 1 ? "s" : ""} \xB7 exportado em ${hoje} \xB7 12\xBA Congresso Catarinense de Endocrinologia e Metabologia`, tam: 9, cor: _PDF_COR.cinza, depois: 10 }
  ];
  let grupo = null, nFotos = 0;
  for (const c of lista) {
    const sess = SESSOES[c.sessaoId] ? ccemRotulo(SESSOES[c.sessaoId]) : c.sessaoRef || "Sem sess\xE3o";
    const aula = ccemRotuloAula(c.sessaoId, c.fala);
    const chave = (c.sessaoId || c.sessaoRef || "") + "|" + (aula || "");
    if (chave !== grupo) {
      grupo = chave;
      blocos.push({ tipo: "espaco", h: 6 });
      blocos.push({ tipo: "texto", texto: sess, tam: 12.5, fonte: "B", cor: _PDF_COR.azul });
      if (aula) blocos.push({ tipo: "texto", texto: aula, tam: 10.5, fonte: "B", cor: _PDF_COR.cinza });
      const pat = ccemPatrocinio(c.sessaoId);
      if (pat) blocos.push({ tipo: "texto", texto: pat, tam: 8.5, fonte: "I", cor: _PDF_COR.cinza });
      blocos.push({ tipo: "linha" });
    }
    const { data, hora } = ccemDataHoraJoinville(c.ts);
    blocos.push({ tipo: "texto", texto: [data + " \xB7 " + hora, c.duvida ? "D\xFAvida" : ""].filter(Boolean).join(" \xB7 "), tam: 8.5, cor: _PDF_COR.cinza });
    const corpo = c.body ? ccemNotaEmTexto(c.body) : "";
    const tit = String(c.title || "").replace(/…$/, "").trim();
    if (tit && tit !== "Foto" && !corpo.trim().startsWith(tit)) blocos.push({ tipo: "texto", texto: c.title, tam: 11, fonte: "B" });
    if (c.foto) {
      let f = null;
      try {
        const d = await ccemFotoLer(c.foto);
        if (d && CCEM_FOTO_VALIDA.test(d)) f = await _pdfFoto(d);
      } catch (e) {
      }
      if (f) {
        blocos.push({ tipo: "foto", foto: f });
        nFotos++;
      }
    }
    if (corpo) blocos.push({ tipo: "texto", texto: corpo, tam: 10.5, depois: 3 });
    if (c.resumoIA) {
      blocos.push({ tipo: "texto", texto: "Resposta da IA", tam: 9.5, fonte: "B", recuo: 10, barra: true, cor: _PDF_COR.azul });
      blocos.push({ tipo: "texto", texto: c.resumoIA, tam: 9.5, recuo: 10, barra: true });
      blocos.push({ tipo: "texto", texto: IA, tam: 8, fonte: "I", recuo: 10, barra: true, cor: _PDF_COR.cinza, depois: 4 });
    }
    for (const x of c.respostas || []) {
      blocos.push({ tipo: "texto", texto: x.rotulo || "Sobre o slide", tam: 9.5, fonte: "B", recuo: 10, barra: true, cor: _PDF_COR.azul });
      blocos.push({ tipo: "texto", texto: ccemRespostaSlideEmTexto(x.r), tam: 9.5, recuo: 10, barra: true });
      blocos.push({ tipo: "texto", texto: ((x.fonte || "") + " " + IA).trim(), tam: 8, fonte: "I", recuo: 10, barra: true, cor: _PDF_COR.cinza, depois: 4 });
    }
    if (c.artigo) {
      const a = c.artigo, aut = a.autores || [];
      blocos.push({ tipo: "texto", texto: `Artigo: ${aut.slice(0, 3).join(", ")}${aut.length > 3 ? " et al." : ""}. ${a.titulo}. ${a.revista} ${a.ano}. PMID ${a.pmid}${a.doi ? " \xB7 doi:" + a.doi : ""}`, tam: 8.5, cor: _PDF_COR.cinza });
    }
    blocos.push({ tipo: "linha" });
  }
  const { bytes, paginas } = ccemMontarPdf(blocos, "Meu Caderno \xB7 CCEM 2026");
  const nome = "meu-caderno-ccem-2026-" + hoje.split("/").reverse().join("-") + ".pdf";
  return { arquivo: new File([bytes], nome, { type: "application/pdf" }), paginas, notas: lista.length, fotos: nFotos };
}
async function ccemEntregarArquivo(arquivo, titulo) {
  if (navigator.canShare && navigator.canShare({ files: [arquivo] })) {
    try {
      await navigator.share({ files: [arquivo], title: titulo });
      return "compartilhado";
    } catch (e) {
      if (e && e.name === "AbortError") return "cancelado";
    }
  }
  const url = URL.createObjectURL(arquivo);
  const a = document.createElement("a");
  a.href = url;
  a.download = arquivo.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 6e4);
  return "baixado";
}
function ccemExportarCaderno() {
  window.dispatchEvent(new Event("ccem:exportar-pdf"));
}
function HostExportarPDF() {
  const [aberto, setAberto] = useState(false);
  useEffect(() => {
    const abrir = () => setAberto(true);
    window.addEventListener("ccem:exportar-pdf", abrir);
    return () => window.removeEventListener("ccem:exportar-pdf", abrir);
  }, []);
  return aberto ? /* @__PURE__ */ React.createElement(FolhaPDF, { aoFechar: () => setAberto(false) }) : null;
}
function FolhaPDF({ aoFechar }) {
  const [r, setR] = useState(null);
  const [erro, setErro] = useState(false);
  useEffect(() => {
    let vivo = true;
    ccemGerarPdfCaderno(_ccemStore.state.captures || []).then((x) => {
      if (vivo) setR(x);
    }).catch((e) => {
      console.error("pdf", e);
      if (vivo) setErro(true);
    });
    return () => {
      vivo = false;
    };
  }, []);
  async function entregar() {
    const como = await ccemEntregarArquivo(r.arquivo, "Meu Caderno \xB7 CCEM 2026");
    if (como === "baixado") showToast("PDF baixado");
  }
  const BTN = { width: "100%", minHeight: 48, borderRadius: 10, fontFamily: "DM Sans,sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 12 };
  const mb = r ? Math.max(0.1, r.arquivo.size / 1048576).toFixed(1).replace(".", ",") : "";
  return /* @__PURE__ */ React.createElement(FolhaBase, { titulo: "Caderno em PDF", altura: "auto", aoFechar }, erro ? /* @__PURE__ */ React.createElement("p", { role: "alert", style: { fontSize: 14, color: "#8a3a0c", lineHeight: 1.5, margin: 0 } }, "N\xE3o foi poss\xEDvel montar o PDF neste aparelho. Use o Backup para guardar as notas.") : !r ? /* @__PURE__ */ React.createElement("p", { role: "status", style: { fontSize: 14, color: C.cinza, lineHeight: 1.5, margin: 0 } }, "Montando o PDF com suas notas e fotos\u2026") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { role: "status", style: { fontSize: 14, color: C.tinta, lineHeight: 1.5, margin: 0 } }, "PDF pronto: ", r.notas, " nota", r.notas !== 1 ? "s" : "", r.fotos ? `, ${r.fotos} foto${r.fotos !== 1 ? "s" : ""}` : "", " \xB7 ", r.paginas, " p\xE1gina", r.paginas !== 1 ? "s" : "", " \xB7 ", mb, " MB"), /* @__PURE__ */ React.createElement("button", { onClick: entregar, style: { ...BTN, background: C.azul, color: "#fff", border: "none" } }, "Salvar ou enviar o PDF"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12.5, color: C.cinza, lineHeight: 1.5, margin: "10px 0 0" } }, "No iPhone, escolha ", /* @__PURE__ */ React.createElement("b", null, "Salvar em Arquivos"), ", ou envie por e-mail ou WhatsApp. Para imprimir, abra o PDF e use Compartilhar \u203A Imprimir.")));
}
Object.assign(window, { ccemMontarPdf, ccemGerarPdfCaderno, ccemEntregarArquivo, ccemExportarCaderno, HostExportarPDF, FolhaPDF });
