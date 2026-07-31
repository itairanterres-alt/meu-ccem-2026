# -*- coding: utf-8 -*-
import json, statistics as st
import imgdata as D
LET="ABCDE"; FASES=["6ª Fase","7ª Fase","10ª Fase","11ª Fase"]; XF=[6,7,10,11]
def load(f):
    o={}
    for i,c in enumerate(json.load(open(f)),1):
        o[i]={s['name']:([float(x) for x in s['vals']]+[0.0]*5)[:5] for s in c['series']}
    return o
C={"S01":(load('charts1.json'),[q for q in range(1,41) if q!=24]),
   "S02":(load('charts2.json'),list(range(1,61)))}
GAB2=open('gab_s2.txt').read().strip()
KEY={"S01":{q:D.GAB_S1[q-1] for q in range(1,41)}, "S02":{q:GAB2[q-1] for q in range(1,61)}}
KEY["S01"][39]="E"
N={"S01":{f:len(D.S1_ALUNOS[f]) for f in FASES}, "S02":{f:len(D.S2_ALUNOS[f]) for f in FASES}}

def slope(ys):
    mx=st.mean(XF); my=st.mean(ys)
    return sum((x-mx)*(y-my) for x,y in zip(XF,ys))/sum((x-mx)**2 for x in XF)

print("="*78)
print("A) FORMATO DOS ITENS  (nº de alternativas efetivamente usadas)")
for sim in ("S01","S02"):
    ch,qs=C[sim]; cnt={}
    for i,qn in enumerate(qs,1):
        used=sum(1 for li in range(5) if any(ch[i][f][li]>0 for f in FASES) or LET[li]==KEY[sim][qn])
        cnt[used]=cnt.get(used,0)+1
    print(f"  {sim}: " + ", ".join(f"{k} alternativas: {v} questões" for k,v in sorted(cnt.items())))
    cinco=[qn for i,qn in enumerate(qs,1)
           if any(ch[i][f][4]>0 for f in FASES) or KEY[sim][qn]=="E"]
    print(f"       questões com alternativa E em uso: {len(cinco)}" + (f" -> {cinco}" if 0<len(cinco)<=12 else ""))

print()
print("="*78)
print("B) DIFICULDADE (p = proporção de acerto, todas as fases juntas)")
faixas=[("Muito fácil  p>=.85",lambda p:p>=.85),("Fácil     .70<=p<.85",lambda p:.70<=p<.85),
        ("Médio     .40<=p<.70",lambda p:.40<=p<.70),("Difícil   .20<=p<.40",lambda p:.20<=p<.40),
        ("Muito difícil  p<.20",lambda p:p<.20)]
P={}
for sim in ("S01","S02"):
    ch,qs=C[sim]; ps={}
    for i,qn in enumerate(qs,1):
        ac=sum(round(ch[i][f][LET.index(KEY[sim][qn])]*N[sim][f]) for f in FASES)
        ps[qn]=ac/sum(N[sim].values())
    P[sim]=ps
    print(f"  {sim} (n={len(ps)} itens, p médio {st.mean(ps.values()):.3f})")
    for nome,fn in faixas:
        k=[q for q,p in ps.items() if fn(p)]
        print(f"      {nome}: {len(k):3d} itens  {sorted(k) if len(k)<=18 else ''}")

print()
print("="*78)
print("C) PROGRESSÃO ENTRE FASES  (o item discrimina veterano de calouro?)")
SL={}
for sim in ("S01","S02"):
    ch,qs=C[sim]; sl={}
    for i,qn in enumerate(qs,1):
        ys=[ch[i][f][LET.index(KEY[sim][qn])] for f in FASES]
        sl[qn]=(slope(ys), ys)
    SL[sim]=sl
    neg=sorted([q for q,(s,_) in sl.items() if s<0], key=lambda q: sl[q][0])
    print(f"  {sim}: inclinação média {st.mean(s for s,_ in sl.values())*100:+.2f} p.p. por fase")
    print(f"      itens com progressão NEGATIVA (11ª pior que 6ª): {len(neg)}/{len(sl)}")
    for q in neg[:8]:
        s,ys=sl[q]; print(f"         Q{q:02d} gab {KEY[sim][q]}  " +
              "  ".join(f"{f.split()[0]}={y*100:5.1f}%" for f,y in zip(FASES,ys)) + f"   incl={s*100:+.2f}")

print()
print("="*78)
print("D) ITENS SUSPEITOS  (um distrator vence o gabarito nas 4 fases)")
for sim in ("S01","S02"):
    ch,qs=C[sim]
    for i,qn in enumerate(qs,1):
        k=LET.index(KEY[sim][qn])
        for li in range(5):
            if li!=k and all(ch[i][f][li]>ch[i][f][k] for f in FASES):
                print(f"  {sim} Q{qn:02d}: gabarito {KEY[sim][qn]} " +
                      f"({'/'.join(f'{ch[i][f][k]*100:.0f}' for f in FASES)}%) perde para "
                      f"{LET[li]} ({'/'.join(f'{ch[i][f][li]*100:.0f}' for f in FASES)}%) nas 4 fases")

print()
print("="*78)
print("E) DISTRATORES NÃO-FUNCIONAIS  (escolhidos por <5% do total)")
for sim in ("S01","S02"):
    ch,qs=C[sim]; tot=sum(N[sim].values()); mortos=0; itens_lim=0
    for i,qn in enumerate(qs,1):
        k=LET.index(KEY[sim][qn])
        nalt=sum(1 for li in range(5) if any(ch[i][f][li]>0 for f in FASES) or li==k)
        d=[li for li in range(nalt) if li!=k
           and sum(ch[i][f][li]*N[sim][f] for f in FASES)/tot < 0.05]
        mortos+=len(d)
        if len(d)>=nalt-2: itens_lim+=1
    print(f"  {sim}: {mortos} distratores não-funcionais; "
          f"{itens_lim} itens com no máximo 1 distrator eficaz")
