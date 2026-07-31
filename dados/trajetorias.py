# -*- coding: utf-8 -*-
"""Classifica trajetórias: risco atual e recuperação.
Ondas (ordem temporal): TP2022, TP2023, TP2025, S02-2025(=12ª), S01-2026, TP2026, S02-2026.
Métrica comparável entre instrumentos: z dentro do grupo de pares (fase/coorte)."""
import json

B=json.load(open('base_longit.json'))
LIM_RISCO=-1.0; LIM_OK=-0.5

def ondas(r):
    """[(rótulo, z)] em ordem temporal, só ondas em que o aluno tem dado."""
    o=[]
    for k,lab in (('z22','TP22'),('z23','TP23'),('z25','TP25'),
                  ('s25_z','Sim25'),('s01_z','S01-26'),('z26','TP26'),('s02_z','S02-26')):
        v=r.get(k)
        if v is not None: o.append((lab,float(v)))
    return o

def estado_atual(r):
    """Sinais de 2026: TP26 (maio) e S02 (julho). Risco se qualquer um <= -1."""
    sin={}
    if r.get('z26') is not None: sin['TP26']=float(r['z26'])
    if r.get('s02_z') is not None: sin['S02-26']=float(r['s02_z'])
    if not sin: return None,sin
    if any(v<=LIM_RISCO for v in sin.values()): return 'risco',sin
    if all(v>LIM_OK for v in sin.values()): return 'ok',sin
    return 'limitrofe',sin

def historico(r):
    """ondas anteriores a TP26 (exclui S02-26 e TP26)."""
    return [(l,z) for l,z in ondas(r) if l in ('TP22','TP23','TP25','Sim25','S01-26')]

risco=[]; recuperados=[]; parciais=[]
for r in B:
    est,sin=estado_atual(r)
    h=historico(r)
    flags_prev=[(l,z) for l,z in h if z<=LIM_RISCO]
    if est=='risco':
        n_prev=len(flags_prev)
        if not h: cls='Sem histórico (entrada)' if (r['fase'] or 0)<=2 else 'Sem histórico'
        elif n_prev>=2: cls='Crônico'
        elif n_prev==1: cls='Recorrente (1 onda anterior)'
        elif all(z>LIM_OK for _,z in h): cls='QUEDA RECENTE'
        else: cls='Oscilante'
        risco.append((r,cls,sin,h))
    elif flags_prev:
        if est=='ok':
            recuperados.append((r,flags_prev,sin,h))
        elif est=='limitrofe':
            parciais.append((r,flags_prev,sin,h))

def fmt(r,sin,h):
    tr=' → '.join(f'{l} {z:+.2f}' for l,z in ondas(r))
    return f"F{r['fase']:>2} {r['nome']:38s} {tr}"

print('='*100)
print(f'EM RISCO AGORA (TP26 ou S02-26 com z ≤ −1): {len(risco)}')
import collections
print(collections.Counter(c for _,c,_,_ in risco))
for cls in ['QUEDA RECENTE','Crônico','Recorrente (1 onda anterior)','Oscilante','Sem histórico','Sem histórico (entrada)']:
    grupo=[x for x in risco if x[1]==cls]
    if not grupo: continue
    print(f'\n--- {cls} ({len(grupo)})')
    for r,c,sin,h in sorted(grupo,key=lambda x:(x[0]['fase'] or 0, min(x[2].values()))):
        print('  '+fmt(r,sin,h))
print()
print('='*100)
print(f'RECUPERADOS (estiveram ≤ −1 antes; agora todos os sinais 2026 > −0,5): {len(recuperados)}')
for r,fp,sin,h in sorted(recuperados,key=lambda x:(x[0]['fase'] or 0)):
    print('  '+fmt(r,sin,h))
print()
print(f'RECUPERAÇÃO PARCIAL (estiveram ≤ −1; hoje entre −1 e −0,5): {len(parciais)}')
for r,fp,sin,h in sorted(parciais,key=lambda x:(x[0]['fase'] or 0)):
    print('  '+fmt(r,sin,h))
