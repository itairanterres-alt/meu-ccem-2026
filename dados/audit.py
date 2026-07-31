# -*- coding: utf-8 -*-
"""Confere as formulas do arquivo gerado contra a verdade calculada em Python."""
import re, json, statistics
from openpyxl import load_workbook
import imgdata as D
LET="ABCDE"; FASES=["6ª Fase","7ª Fase","10ª Fase","11ª Fase"]
def load(f):
    o={}
    for i,c in enumerate(json.load(open(f)),1):
        o[i]={s['name']:([float(x) for x in s['vals']]+[0.0]*5)[:5] for s in c['series']}
    return o
C={"Simulado 01":(load('charts1.json'),[q for q in range(1,41) if q!=24]),
   "Simulado 02":(load('charts2.json'),list(range(1,61)))}
GAB2=open('gab_s2.txt').read().strip()
GAB={"Simulado 01":{q:D.GAB_S1[q-1] for q in range(1,41)},
     "Simulado 02":{q:GAB2[q-1] for q in range(1,61)}}
KEY={s_:dict(g) for s_,g in GAB.items()}; KEY["Simulado 01"][39]="E"
N={"Simulado 01":{f:len(D.S1_ALUNOS[f]) for f in FASES},
   "Simulado 02":{f:len(D.S2_ALUNOS[f]) for f in FASES}}
BASE={"Simulado 01":39,"Simulado 02":60}
Q24={"6ª Fase":14,"7ª Fase":18,"10ª Fase":19,"11ª Fase":16}
def nac(sim,qn,f):
    if sim=="Simulado 01" and qn==24: return None
    ch,qs=C[sim]; return round(ch[qs.index(qn)+1][f][LET.index(KEY[sim][qn])]*N[sim][f])

wb=load_workbook('Dados_Simulados_MED_ENAMED_2026.xlsx')
err=[]; nf=0
def E(cond,msg):
    if not cond: err.append(msg)

# ---- Alunos
ws=wb["Alunos"]; L=ws.max_row
truth=[]
for sim,src in (("Simulado 01",D.S1_ALUNOS),("Simulado 02",D.S2_ALUNOS)):
    for f in FASES:
        for it in src[f]: truth.append((sim,f,it[0],it[1],BASE[sim]))
E(L-1==len(truth), f"Alunos: {L-1} linhas != {len(truth)}")
for i,(sim,f,nome,ac,base) in enumerate(truth,start=2):
    E([ws.cell(i,c).value for c in (1,2,3,4,5)]==[sim,f,nome,ac,base], f"Alunos L{i}: dados divergentes")
    E(ws.cell(i,6).value==f'=IF(E{i}=0,"",D{i}/E{i})', f"Alunos L{i}: formula %")
    E(ws.cell(i,7).value==f"=SUMPRODUCT(($A$2:$A${L}=A{i})*($B$2:$B${L}=B{i})*($D$2:$D${L}>D{i}))+1", f"Alunos L{i}: rank fase")
    E(ws.cell(i,8).value==f"=SUMPRODUCT(($A$2:$A${L}=A{i})*($D$2:$D${L}>D{i}))+1", f"Alunos L{i}: rank geral")
    nf+=3
# semântica do rank
for i,(sim,f,nome,ac,base) in enumerate(truth,start=2):
    rf=1+sum(1 for s2,f2,_,a2,_ in truth if s2==sim and f2==f and a2>ac)
    rg=1+sum(1 for s2,_,_,a2,_ in truth if s2==sim and a2>ac)
    E(rf>=1 and rg>=1,"rank")
    if i==2: print("  ex.:",nome,"pos fase",rf,"pos geral",rg)

# ---- Questões
ws=wb["Questões"]; r=2
for sim in ("Simulado 01","Simulado 02"):
    for qn in (range(1,41) if sim=="Simulado 01" else range(1,61)):
        E(ws.cell(r,1).value==sim and ws.cell(r,2).value==qn and ws.cell(r,3).value==KEY[sim][qn],
          f"Questões L{r}: chave")
        for k,f in enumerate(FASES):
            ac,pc=4+k*2,5+k*2
            E(ws.cell(r,ac).value==nac(sim,qn,f), f"Questões L{r} {f}: acertos {ws.cell(r,ac).value} != {nac(sim,qn,f)}")
            got=ws.cell(r,pc).value
            exp=None if (sim=="Simulado 01" and qn==24) else f"={chr(64+ac)}{r}/{N[sim][f]}"
            E(got==exp, f"Questões L{r} {f}: formula % = {got}")
            nf+=1
        anul = (sim=="Simulado 01" and qn==24)
        E(ws.cell(r,12).value==(None if anul else f"=D{r}+F{r}+H{r}+J{r}"), f"Questões L{r}: total")
        E(ws.cell(r,13).value==(None if anul else sum(N[sim].values())), f"Questões L{r}: total alunos")
        E(ws.cell(r,14).value==(None if anul else f'=IF(M{r}="","",L{r}/M{r})'), f"Questões L{r}: % geral")
        E((ws.cell(r,15).value is None)==anul, f"Questões L{r}: dificuldade")
        E((ws.cell(r,16).value=="OK")==(not(sim=="Simulado 01" and qn in (24,39))), f"Questões L{r}: situacao")
        nf+=3; r+=1
E(r-1==ws.max_row, "Questões: sobrou linha")

# ---- Questão x Fase
ws=wb["Questão x Fase"]; r=2
for sim in ("Simulado 01","Simulado 02"):
    for qn in (range(1,41) if sim=="Simulado 01" else range(1,61)):
        for f in FASES:
            anul = (sim=="Simulado 01" and qn==24)
            E([ws.cell(r,c).value for c in (1,2,3,4,5,6)]==
              [sim,qn,f,KEY[sim][qn],None if anul else N[sim][f],nac(sim,qn,f)], f"QxF L{r}: dados")
            E(ws.cell(r,7).value==(None if anul else f'=IF(E{r}=0,"",F{r}/E{r})'), f"QxF L{r}: formula"); nf+=1
            r+=1
E(r-1==ws.max_row,"QxF: sobrou linha")

# ---- Distribuição: soma por (questao,fase) == N
ws=wb["Distribuição respostas"]
agg={}
for i in range(2,ws.max_row+1):
    k=(ws.cell(i,1).value,ws.cell(i,2).value,ws.cell(i,3).value)
    agg.setdefault(k,0); agg[k]+=ws.cell(i,7).value
    E(ws.cell(i,8).value==f'=IF(F{i}=0,"",G{i}/F{i})', f"Dist L{i}: formula"); nf+=1
    E(ws.cell(i,6).value==N[ws.cell(i,1).value][ws.cell(i,3).value], f"Dist L{i}: N")
    E((ws.cell(i,5).value=="Sim")==(ws.cell(i,4).value==KEY[k[0]][k[1]]), f"Dist L{i}: flag gabarito")
for (sim,qn,f),tot in agg.items():
    E(tot==N[sim][f], f"Dist {sim} Q{qn} {f}: soma {tot} != {N[sim][f]}")
print("  grupos questao x fase na distribuicao:", len(agg))

# ---- Resumo por fase
ws=wb["Resumo por fase"]
for i in range(2,ws.max_row+1):
    sim,f=ws.cell(i,1).value,ws.cell(i,2).value
    src=D.S1_ALUNOS if sim=="Simulado 01" else D.S2_ALUNOS
    acs=[it[1] for it in src[f]]
    E(ws.cell(i,3).value==len(acs), f"Resumo {sim} {f}: N")
    m=re.match(r"=AVERAGE\(Alunos!\$D\$(\d+):\$D\$(\d+)\)", ws.cell(i,5).value)
    E(bool(m), f"Resumo {sim} {f}: formula media")
    if m:
        a,b=int(m.group(1)),int(m.group(2))
        E(b-a+1==len(acs), f"Resumo {sim} {f}: intervalo {a}:{b} tem {b-a+1} linhas, esperado {len(acs)}")
        wsA=wb["Alunos"]
        E(all(wsA.cell(x,1).value==sim and wsA.cell(x,2).value==f for x in range(a,b+1)),
          f"Resumo {sim} {f}: intervalo aponta para outro grupo")
        E([wsA.cell(x,4).value for x in range(a,b+1)]==acs, f"Resumo {sim} {f}: valores do intervalo")
    nf+=7
    print(f"  {sim} {f:9s} n={len(acs):3d} media={statistics.mean(acs):6.2f} "
          f"({100*statistics.mean(acs)/BASE[sim]:5.2f}%) med={statistics.median(acs):5.1f} "
          f"min={min(acs)} max={max(acs)} dp={statistics.stdev(acs):.2f}")

# ---- Comparativo
ws=wb["Comparativo S01 x S02"]
MERGE={"Maria Amélia Vozniak Deluca":"Maria Amélia Vozniak Deluca Schneider"}
s1={MERGE.get(n,n):a for f in FASES for n,a,_ in D.S1_ALUNOS[f]}
s2={MERGE.get(n,n):a for f in FASES for n,a in D.S2_ALUNOS[f]}
seen=set()
for i in range(2,ws.max_row+1):
    n=ws.cell(i,1).value; seen.add(n)
    E(ws.cell(i,3).value==s1.get(n), f"Comp L{i}: S01")
    E(ws.cell(i,5).value==s2.get(n), f"Comp L{i}: S02")
    exp="Nos dois simulados" if n in s1 and n in s2 else ("Só no Simulado 01" if n in s1 else "Só no Simulado 02")
    E(ws.cell(i,8).value==exp, f"Comp L{i}: presenca")
    nf+=3
E(seen==set(s1)|set(s2), "Comp: nomes faltando")
print(f"  comparativo: {len(seen)} nomes, {len(set(s1)&set(s2))} nos dois simulados")

# ---- funcoes usadas
used=set()
for w in wb:
    for row in w.iter_rows():
        for c in row:
            if isinstance(c.value,str) and c.value.startswith("="):
                used|=set(re.findall(r"([A-Z][A-Z0-9_.]+)\(", c.value))
print("  funcoes usadas:", sorted(used))
BAN={"XLOOKUP","XMATCH","SORT","FILTER","UNIQUE","SEQUENCE","TEXTJOIN","CONCAT","IFS","SWITCH","MAXIFS","MINIFS"}
E(not (used & BAN), f"funcoes nao suportadas: {used & BAN}")

for sim,src in (("Simulado 01",D.S1_ALUNOS),("Simulado 02",D.S2_ALUNOS)):
    for f in FASES:
        tot=sum(it[1] for it in src[f])
        qs=range(1,41) if sim=="Simulado 01" else range(1,61)
        s_=sum(nac(sim,q,f) or 0 for q in qs)
        E(tot==s_, f"FECHAMENTO {sim} {f}: alunos={tot} questoes={s_}")
        print(f"  fechamento {sim} {f:9s}: alunos={tot:5d}  questoes={s_:5d}  delta={tot-s_:+d}")
print(f"\nformulas conferidas: {nf}")
print("PROBLEMAS:", len(err))
for e in err[:40]: print("  -",e)
