# -*- coding: utf-8 -*-
"""Projeção ENAMED 2026 (T8=atual 12ª, T9=atual 11ª).
Âncora: ENAMED 2025 real (PCP=82%, Conceito 4) da coorte T6+T7, mapeada na escala
'ptotal − média NAPISUL da fase/ano' (remove dificuldade da prova; supõe rede estável)."""
import json, statistics as st, unicodedata, re

def norm(n):
    n=unicodedata.normalize('NFD', n); n=''.join(c for c in n if unicodedata.category(c)!='Mn')
    return re.sub(r'\s+',' ',n).strip().lower()

NET25={10:64.73678734914, 11:67.38181818181}
NET26={10:67.69902634593, 11:73.27427821522}
c25=json.load(open('consol2025.json')); c26=json.load(open('consol2026.json'))

# coorte ENAMED 2025 = T6 (F11-2025) + T7 (F10-2025)
ref=[]
for d in c25:
    f=int(d['fase'])
    if f in (10,11): ref.append((d['Nome'].title(), f, float(d['ptotal']) - NET25[f]))
ref_rel=sorted(r for _,_,r in ref)
n=len(ref_rel)
print(f'coorte ENAMED-2025 no TP2025: n={n}  rel médio={st.mean(ref_rel):+.2f}  dp={st.stdev(ref_rel):.2f}')
# PCP 82% -> 18% abaixo da barra. Barra = quantil 18% (interpolação linear)
import math
def quantil(xs, q):
    pos=q*(len(xs)-1); lo=int(math.floor(pos)); hi=min(lo+1,len(xs)-1)
    return xs[lo]+(xs[hi]-xs[lo])*(pos-lo)
BAR=quantil(ref_rel, 0.18)
print(f'barra de proficiência (escala rel-rede): {BAR:+.2f} p.p.')
print('alunos T6+T7 abaixo da barra:', sum(1 for r in ref_rel if r<BAR),'/',n)

# T8/T9 no TP2026
alvo=[]
for d in c26:
    f=int(d['fase'])
    if f in (10,11):
        alvo.append({'nome':d['Nome'].title(),'fase':f,'ptotal':float(d['ptotal']),
                     'rel':float(d['ptotal'])-NET26[f]})
# alunos da coorte ausentes do TP mas presentes no S02-26: estimar rel via z do simulado
import imgdata as D
S02={'10ª Fase':10,'11ª Fase':11}
VAR={'eduardo lorenco moreira':'eduardo lourenco moreira',
     'maria amelia vozniak deluca schneider':'maria amelia vozniak deluca',
     'amanda de matos da silva':'ananda de matos silva',
     'bruna gonzalez nejm':'bruna gonzales nejm'}
tp_nomes={norm(a['nome']) for a in alvo}
for fnome,f in S02.items():
    rows=D.S2_ALUNOS[fnome]; vals=[r[1] for r in rows]; m=st.mean(vals); s=st.stdev(vals)
    rels=[a['rel'] for a in alvo if a['fase']==f]; mr,sr=st.mean(rels),st.stdev(rels)
    for nome,ac in rows:
        k=VAR.get(norm(nome),norm(nome))
        if k not in tp_nomes:
            z=(ac-m)/s
            alvo.append({'nome':nome,'fase':f,'ptotal':None,'rel':mr+z*sr,'estim':'S02'})
            tp_nomes.add(k)
print(f'\ncoorte ENAMED-2026: n={len(alvo)} (TP={sum(1 for a in alvo if not a.get("estim"))}, estimados via S02={sum(1 for a in alvo if a.get("estim"))})')

# margem e bandas
for a in alvo: a['margem']=a['rel']-BAR
acima=sum(1 for a in alvo if a['margem']>0)
pcp=100*acima/len(alvo)
print(f'PCP projetado (cenário base, estado de maio/jul): {acima}/{len(alvo)} = {pcp:.1f}%')
for delta,tag in ((-3,'pessimista (barra +3pp)'),(3,'otimista (barra -3pp)')):
    ac2=sum(1 for a in alvo if a['margem']+delta>0)
    print(f'  cenário {tag}: {ac2}/{len(alvo)} = {100*ac2/len(alvo):.1f}%')
# binomial
p=pcp/100; ep=100*math.sqrt(p*(1-p)/len(alvo))
print(f'  erro-padrão binomial: ±{ep:.1f} p.p. (n={len(alvo)})')
print(f'  faixas: ≥90 → Conceito 5 | 75–90 → 4 | 60–75 → 3')

print('\nZONA DE DECISÃO (|margem| ≤ 3 p.p.) — quem define o conceito:')
for a in sorted([a for a in alvo if abs(a['margem'])<=3], key=lambda a:a['margem']):
    print(f"  F{a['fase']} {a['nome']:38s} rel {a['rel']:+6.2f}  margem {a['margem']:+5.2f} {'(estim. S02)' if a.get('estim') else ''}")
print('\nABAIXO DA BARRA (margem < −3):')
for a in sorted([a for a in alvo if a['margem']<-3], key=lambda a:a['margem']):
    print(f"  F{a['fase']} {a['nome']:38s} rel {a['rel']:+6.2f}  margem {a['margem']:+5.2f} {'(estim. S02)' if a.get('estim') else ''}")
json.dump({'BAR':BAR,'alvo':alvo,'ref':[{'nome':n_,'fase':f,'rel':r} for n_,f,r in ref]},
          open('projecao.json','w'),ensure_ascii=False)
