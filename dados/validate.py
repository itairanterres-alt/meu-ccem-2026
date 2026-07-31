# -*- coding: utf-8 -*-
import json
import imgdata as D
LET="ABCDE"

def load(f):
    out={}
    for i,c in enumerate(json.load(open(f)),start=1):
        d={}
        for s in c['series']:
            v=[float(x) if x is not None else 0.0 for x in s['vals']]
            v=(v+[0.0]*5)[:5]
            d[s['name']]=v
        out[i]=d
    return out

def getpct(tbl,f,qn):
    t=tbl[f]
    return t.get(qn) if isinstance(t,dict) else t[qn-1]

def check(tag, charts, pct, alunos, gab, qnums):
    print("="*72); print(tag)
    N={f:len(v) for f,v in alunos.items()}
    print("alunos por fase:", N)
    derived={}; bad=0
    for idx,qn in enumerate(qnums,start=1):
        d=charts[idx]
        cands=[L for li,L in enumerate(LET)
               if all(abs(d[f][li]*100 - getpct(pct,f,qn))<=0.02 for f in d)]
        derived[qn]=cands
        if gab:
            if cands!=[gab[qn]]:
                bad+=1; print(f"  DIVERG Q{qn:02d}: oficial={gab[qn]} imagem->grafico={cands}")
        elif len(cands)!=1:
            bad+=1; print(f"  AMBIGUO Q{qn:02d}: {cands}")
    print("divergencias:", bad)
    for f in sorted(alunos):
        tot=sum(a[1] for a in alunos[f])
        s=sum(charts[i][f][LET.index(gab[qn] if gab else derived[qn][0])]*N[f]
              for i,qn in enumerate(qnums,start=1))
        print(f"  {f:9s} soma acertos(imagem alunos)={tot:5d}   soma esperada(graficos)={s:9.4f}   delta={tot-s:+.4f}")
    return derived

c1=load('charts1.json'); c2=load('charts2.json')
q1=[q for q in range(1,41) if q!=24]
gab1={q: D.GAB_S1[q-1] for q in q1}
check("SIMULADO 01  (39 questoes validas; Q24 anulada)", c1, D.S1_PCT, D.S1_ALUNOS, gab1, q1)
g2=check("SIMULADO 02  (60 questoes)", c2, D.S2_PCT, D.S2_ALUNOS, None, list(range(1,61)))
gs2=''.join(g2[q][0] if len(g2[q])==1 else '?' for q in range(1,61))
print("\nGABARITO SIMULADO 02 (derivado):", gs2)
open('gab_s2.txt','w').write(gs2)
