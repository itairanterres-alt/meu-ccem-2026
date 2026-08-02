#!/usr/bin/env python3
"""
Gerador de matriz de blueprint (PDF) para avaliações MED-UNIDAVI.

Uso:
    python gerar_matriz_pdf.py blueprint.json saida.pdf

Formato de blueprint.json:
{
  "titulo": "UC2: Concepção e Formação do Ser Humano",
  "subtitulo": "1ª Fase · 2026/1",
  "sps": [
    {
      "sp": "SP01", "titulo": "A UBS na Escola",
      "oas": [
        {"oa": "OA1", "texto": "Caracterizar morfofuncionalmente...",
         "status": "coberto|parcial|lacuna|nao_cadastrado",
         "questoes": ["Q3 (Mark)"], "autoria": "Mark",
         "bloom": "aplicacao", "competencia": "dcn2025_comp_03", "dificuldade": "medio"}
      ]
    }
  ],
  "resumo_dimensoes": {
    "bloom": {"conhecimento": 5, "compreensao": 8, "aplicacao": 10, "analise": 3, "sintese": 0, "avaliacao": 2},
    "dificuldade": {"facil": 4, "medio": 20, "dificil": 4},
    "competencias_cobertas": ["dcn2025_comp_02", "dcn2025_comp_03"],
    "competencias_descobertas": ["dcn2025_comp_07"]
  }
}

Requer: reportlab (pip install reportlab --break-system-packages)
"""
import sys, json
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER

STATUS = {
    "coberto":       (colors.HexColor("#EAF3DE"), colors.HexColor("#27500A"), "Coberto"),
    "parcial":       (colors.HexColor("#FAEEDA"), colors.HexColor("#854F0B"), "Parcial"),
    "lacuna":        (colors.HexColor("#FCEBEB"), colors.HexColor("#A32D2D"), "Lacuna"),
    "nao_cadastrado":(colors.HexColor("#F1EFE8"), colors.HexColor("#5F5E5A"), "Não cadastrado"),
}

def main():
    if len(sys.argv) < 3:
        print("Uso: python gerar_matriz_pdf.py blueprint.json saida.pdf"); sys.exit(1)
    data = json.load(open(sys.argv[1], encoding="utf-8"))
    out = sys.argv[2]

    doc = SimpleDocTemplate(out, pagesize=A4,
        leftMargin=1.6*cm, rightMargin=1.6*cm, topMargin=1.6*cm, bottomMargin=1.6*cm,
        title=data.get("titulo","Blueprint"))

    HEADER = colors.HexColor("#1F3864")
    BORDER = colors.HexColor("#D0D8E4")
    SPBG   = colors.HexColor("#EEF2F7")

    def P(t, sz=8.5, b=False, col=colors.HexColor("#1A1A1A"), al=TA_LEFT):
        return Paragraph(t, ParagraphStyle("p", fontSize=sz,
            fontName="Helvetica-Bold" if b else "Helvetica",
            textColor=col, alignment=al, leading=sz*1.35))

    def chip(status):
        bg, fg, label = STATUS.get(status, STATUS["lacuna"])
        return Paragraph(f'<font color="#{fg.hexval()[2:].upper()}"><b>{label}</b></font>',
            ParagraphStyle("chip", fontSize=8, fontName="Helvetica-Bold",
                backColor=bg, borderPadding=(2,5,2,5), alignment=TA_CENTER, leading=11))

    story = [
        P(data.get("titulo","Blueprint de cobertura"), 13, True, HEADER),
        Spacer(1,4),
        P(data.get("subtitulo",""), 9, False, colors.HexColor("#555555")),
        Spacer(1,12),
    ]

    rows = [[P("SP",8,True,colors.white,TA_CENTER), P("Objetivo de aprendizagem",8,True,colors.white),
             P("Status",8,True,colors.white,TA_CENTER), P("Bloom",8,True,colors.white,TA_CENTER),
             P("Dif.",8,True,colors.white,TA_CENTER), P("Questões",8,True,colors.white,TA_CENTER)]]
    cmds = [
        ("BACKGROUND",(0,0),(-1,0),HEADER),
        ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
        ("GRID",(0,0),(-1,-1),0.3,BORDER),
        ("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4),
        ("LEFTPADDING",(0,0),(-1,-1),5),("RIGHTPADDING",(0,0),(-1,-1),5),
    ]
    ri = 1
    BLOOM_ABREV = {"conhecimento":"Conhec.","compreensao":"Compr.","aplicacao":"Aplic.",
                   "analise":"Análise","sintese":"Síntese","avaliacao":"Avaliar"}
    DIF_ABREV = {"facil":"Fácil","medio":"Médio","dificil":"Difícil"}
    for sp in data["sps"]:
        rows.append([P("", 8), P(f'<b>{sp["sp"]} — {sp.get("titulo","")}</b>',7.5,True,colors.HexColor("#2E4A7A")),
                     P("",8), P("",8), P("",8), P("",8)])
        cmds += [("BACKGROUND",(0,ri),(-1,ri),SPBG), ("SPAN",(1,ri),(-1,ri))]
        ri += 1
        for i, oa in enumerate(sp["oas"]):
            bg = colors.HexColor("#F8FAFB") if ri%2==0 else colors.white
            qs = ", ".join(oa.get("questoes",[])) or "—"
            bloom = BLOOM_ABREV.get(oa.get("bloom",""), "—")
            dif = DIF_ABREV.get(oa.get("dificuldade",""), "—")
            rows.append([
                P(oa.get("oa",""),8,False,colors.HexColor("#555"),TA_CENTER),
                P(oa.get("texto",""),8.5),
                chip(oa.get("status","lacuna")),
                P(bloom,7.5,False,colors.HexColor("#555"),TA_CENTER),
                P(dif,7.5,False,colors.HexColor("#555"),TA_CENTER),
                P(qs,8,False,colors.HexColor("#555"),TA_CENTER),
            ])
            cmds.append(("BACKGROUND",(0,ri),(-1,ri),bg))
            ri += 1

    t = Table(rows, colWidths=[1.2*cm, 7.4*cm, 2.2*cm, 1.7*cm, 1.4*cm, 3.3*cm], repeatRows=1)
    t.setStyle(TableStyle(cmds))
    story.append(t)

    # resumo de dimensões (se fornecido)
    rd = data.get("resumo_dimensoes")
    if rd:
        story.append(Spacer(1,12))
        story.append(P("Perfil de dimensões", 10, True, HEADER))
        story.append(Spacer(1,4))
        if "bloom" in rd:
            b = rd["bloom"]
            ordem = ["conhecimento","compreensao","aplicacao","analise","sintese","avaliacao"]
            partes = [f"{k.capitalize()}: {b.get(k,0)}" for k in ordem]
            story.append(P("<b>Bloom</b> — " + "  ·  ".join(partes), 8.5))
        if "dificuldade" in rd:
            d = rd["dificuldade"]
            story.append(P(f"<b>Dificuldade</b> — Fácil: {d.get('facil',0)}  ·  Médio: {d.get('medio',0)}  ·  Difícil: {d.get('dificil',0)}", 8.5))
        if "competencias_cobertas" in rd:
            story.append(P(f"<b>Competências DCN cobertas</b> ({len(rd.get('competencias_cobertas',[]))}): " + ", ".join(rd.get("competencias_cobertas",[])), 8.5))
        if rd.get("competencias_descobertas"):
            story.append(P(f"<b>Competências DCN não avaliadas nesta prova</b>: " + ", ".join(rd["competencias_descobertas"]), 8.5, col=colors.HexColor("#854F0B")))
        story.append(P("<i>Mapeamento competência→eixo é interpretativo; recomenda-se validação pelo NDE.</i>", 7.5, col=colors.HexColor("#999")))
        # Matriz ENAMED 478/2025 — opcional, só aparece quando o lote traz classificacao_fina
        m478 = rd.get("matriz_478")
        if m478:
            story.append(Spacer(1,8))
            story.append(P("Matriz ENAMED 478/2025 (avaliação)", 9, True, HEADER))
            if m478.get("areas_cobertas"):
                story.append(P(f"<b>Áreas cobertas</b>: " + ", ".join(m478["areas_cobertas"]), 8.5))
            if m478.get("competencias_cobertas"):
                story.append(P(f"<b>Competências ENAMED cobertas</b> ({len(m478.get('competencias_cobertas',[]))}): " + ", ".join(m478["competencias_cobertas"]), 8.5))
            if m478.get("nao_classificadas") is not None:
                story.append(P(f"<b>Questões não classificadas nesta matriz</b>: {m478['nao_classificadas']}", 8.5, col=colors.HexColor("#854F0B")))
            story.append(P("<i>Distinta da competência DCN acima: mede alinhamento com a matriz de AVALIAÇÃO do exame, não com a matriz de FORMAÇÃO.</i>", 7.5, col=colors.HexColor("#999")))

    # legenda
    story.append(Spacer(1,10))
    leg = []
    for k in ("coberto","parcial","lacuna","nao_cadastrado"):
        bg,fg,label = STATUS[k]
        leg.append(Paragraph(f'<font color="#{fg.hexval()[2:].upper()}"><b>■</b></font> <font color="#555">{label}</font>',
            ParagraphStyle("l",fontSize=8,fontName="Helvetica",backColor=bg,borderPadding=(2,6,2,6),leading=11)))
    lt = Table([leg], colWidths=[3.5*cm]*4)
    lt.setStyle(TableStyle([("ALIGN",(0,0),(-1,-1),"CENTER"),("LEFTPADDING",(0,0),(-1,-1),3),("RIGHTPADDING",(0,0),(-1,-1),3)]))
    story.append(lt)

    story.append(Spacer(1,8))
    story.append(P(data.get("rodape","Gerado para curadoria docente — questões sujeitas a aprovação antes de uso em avaliação formal."),
                   7.5, False, colors.HexColor("#999")))

    doc.build(story)
    print(f"PDF gerado: {out}")

if __name__ == "__main__":
    main()
