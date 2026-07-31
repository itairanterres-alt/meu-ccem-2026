# -*- coding: utf-8 -*-
"""Base longitudinal por aluno: TP 2022/23/25/26 + simulados ENAMED 2025/2026."""
import json, statistics as st, unicodedata, re
import imgdata as D, s25data

def norm(n):
    n=unicodedata.normalize('NFD', n)
    n=''.join(c for c in n if unicodedata.category(c)!='Mn')
    return re.sub(r'\s+',' ',n).strip().lower()

FASES_SIM={'6ª Fase':6,'7ª Fase':7,'10ª Fase':10,'11ª Fase':11}
mapa=json.load(open('mapa2026.json'))
base={}   # chave normalizada -> registro
for d in mapa:
    base[norm(d['nome'])]={'nome':d['nome'],'fase':d['fase'],
        'tp22':d['tp22'],'tp23':d['tp23'],'tp25':d['tp25'],'tp26':d['tp26'],
        'z26':float(d['z']) if d['z'] not in (None,'') else None,
        'nivel':d['nivel'],'foco':d['foco'],'vsnuc':d['vsnuc']}

# z dentro da coorte atual para TP22/23/25 (mesmos colegas, retroagido)
import collections
for camp in ('tp22','tp23','tp25'):
    porfase=collections.defaultdict(list)
    for r in base.values():
        v=r[camp]
        if v is not None: porfase[r['fase']].append(float(v))
    for r in base.values():
        v=r[camp]
        if v is None or len(porfase[r['fase']])<5: r['z'+camp[2:]]=None; continue
        m=st.mean(porfase[r['fase']]); s=st.stdev(porfase[r['fase']])
        r['z'+camp[2:]]=(float(v)-m)/s if s else None

# simulados 2026 (z na fase)
# Variantes de grafia entre simulados e TP (mesma pessoa, confirmado por fase e similaridade)
VARIANTES={
 'amanda de matos da silva':'ananda de matos silva',
 'bruna gonzalez nejm':'bruna gonzales nejm',
 'eduardo lorenco moreira':'eduardo lourenco moreira',
 'maria amelia vozniak deluca schneider':'maria amelia vozniak deluca',
 'ana luiza fragas':'ana luiza de fragas',
 'ana silvia caldas':'ana silvia caldas ferreira liss',
 'henrique terres':'henrique toniazzo terres',
 'leonardo gauginski marquetti':'leonardo gauginski marchetti',
}
MERGE={'Maria Amélia Vozniak Deluca':'Maria Amélia Vozniak Deluca Schneider'}
def zmap(src, idx):
    out={}
    for f,rows in src.items():
        vals=[r[1] for r in rows]; m=st.mean(vals); s=st.stdev(vals)
        for r in rows:
            nome=MERGE.get(r[0],r[0])
            out[norm(nome)]=(r[1],(r[1]-m)/s)
    return out
s01=zmap(D.S1_ALUNOS,1); s02=zmap(D.S2_ALUNOS,1)
# simulado 2025 (11ª de então = 12ª atual)
v=[a for _,a in s25data.S25_11A]; m25,s25_=st.mean(v),st.stdev(v)
s25={norm(n):(a,(a-m25)/s25_) for n,a in s25data.S25_11A}

# fase do aluno nos simulados 2026 (para registros sem TP)
fase_sim={}
for f,rows in D.S1_ALUNOS.items():
    for r in rows: fase_sim[norm(MERGE.get(r[0],r[0]))]=FASES_SIM[f]
for f,rows in D.S2_ALUNOS.items():
    for r in rows: fase_sim[norm(MERGE.get(r[0],r[0]))]=FASES_SIM[f]
nao_achados={'s01':[],'s02':[],'s25':[]}
for tag,src in (('s01',s01),('s02',s02),('s25',s25)):
    for k,(ac,z) in src.items():
        kk=VARIANTES.get(k,k)
        if kk in base:
            base[kk][tag+'_ac']=ac; base[kk][tag+'_z']=z
        else:
            # ausente do TP2026: entra como registro só-simulado
            nao_achados[tag].append(k)
            if kk not in base:
                base[kk]={'nome':k.title(),'fase':fase_sim.get(k,12 if tag=='s25' else None),
                          'tp22':None,'tp23':None,'tp25':None,'tp26':None,'z26':None,
                          'nivel':'ausente do TP','foco':None,'vsnuc':None,
                          'z22':None,'z23':None,'z25':None}
            base[kk][tag+'_ac']=ac; base[kk][tag+'_z']=z
print('não encontrados no Mapa TP2026:')
for tag,L in nao_achados.items(): print(' ',tag,len(L),L)
json.dump(list(base.values()),open('base_longit.json','w'),ensure_ascii=False)
print('total alunos na base:',len(base))
cnt=collections.Counter()
for r in base.values():
    cnt[('s01' in ' '.join(k for k in r if r.get(k) is not None)) ]  # noop
n_sim=sum(1 for r in base.values() if r.get('s02_z') is not None)
n_hist=sum(1 for r in base.values() if any(r.get(z) is not None for z in ('z22','z23','z25')))
print('com simulado 2026:',n_sim,'| com histórico TP anterior:',n_hist)
