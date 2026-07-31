# -*- coding: utf-8 -*-
"""Workbook: Trajetórias 2022–2026 — risco atual e recuperação."""
import json
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

B=json.load(open('base_longit.json'))
LIM_RISCO=-1.0; LIM_OK=-0.5
ONDAS=[('z22','TP 2022'),('z23','TP 2023'),('z25','TP 2025'),('s25_z','Simulado 2025'),
       ('s01_z','Sim01 2026'),('z26','TP 2026'),('s02_z','Sim02 2026')]
OLD=('z22','z23','z25','s25_z')

def traj(r):
    return ' → '.join(f"{lab.split()[0]}{lab.split()[-1][-2:]} {float(r[k]):+.2f}"
                      for k,lab in ONDAS if r.get(k) is not None)

def classifica(r):
    sin={}
    if r.get('z26') is not None: sin['TP26']=float(r['z26'])
    if r.get('s02_z') is not None: sin['S02']=float(r['s02_z'])
    est=None
    if sin:
        if any(v<=LIM_RISCO for v in sin.values()): est='risco'
        elif all(v>LIM_OK for v in sin.values()): est='ok'
        else: est='limitrofe'
    old=[(k,float(r[k])) for k in OLD if r.get(k) is not None]
    old_flags=[z for _,z in old if z<=LIM_RISCO]
    s01=r.get('s01_z')
    prior_flags=len(old_flags)+(1 if (s01 is not None and float(s01)<=LIM_RISCO) else 0)
    cls=None
    if est=='risco':
        if not old and s01 is None:
            cls='Sem histórico (fase inicial)' if (r['fase'] or 99)<=2 else 'Sem histórico'
        elif old and all(z>LIM_OK for _,z in old):
            cls='QUEDA EM 2026'          # pré-2026 saudável; a queda é deste ano
        elif not old:
            cls='QUEDA EM 2026'          # só tem S01/S02 deste ano
        elif prior_flags>=2: cls='Crônico (≥2 ondas anteriores)'
        elif prior_flags==1: cls='Recorrente (1 onda anterior)'
        else: cls='Queda gradual (vinha entre −1 e −0,5)'
    return est,sin,old_flags,cls

for r in B:
    est,sin,oldf,cls=classifica(r)
    r['_est']=est; r['_cls']=cls; r['_traj']=traj(r)
    r['_min26']=min([v for v in (r.get('z26'),r.get('s02_z')) if v is not None],default=None)
    # recuperação
    prev_flag = bool(oldf) or (r.get('s01_z') is not None and float(r['s01_z'])<=LIM_RISCO)
    r['_rec']=None
    if est=='ok' and prev_flag: r['_rec']='Recuperado'
    elif est=='limitrofe' and prev_flag: r['_rec']='Parcial'
    # contraditório dentro de 2026
    r['_contra'] = (r.get('z26') is not None and r.get('s02_z') is not None and
                    abs(float(r['z26'])-float(r['s02_z']))>=1.5)

ARIAL='Arial'
HDRF=PatternFill('solid',fgColor='1F4E5F'); HDR=Font(name=ARIAL,size=10,bold=True,color='FFFFFF')
CF=Font(name=ARIAL,size=10); TIT=Font(name=ARIAL,size=14,bold=True,color='1F4E5F')
THIN=Side(style='thin',color='BFBFBF'); BORD=Border(left=THIN,right=THIN,top=THIN,bottom=THIN)
ALT=PatternFill('solid',fgColor='F2F7F9')
RED=PatternFill('solid',fgColor='F8D7DA'); AMB=PatternFill('solid',fgColor='FFF3CD')
GRN=PatternFill('solid',fgColor='D4EDDA')

wb=Workbook()
def sheet(name,headers,rows,widths,fills=None,freeze='C2'):
    ws=wb.create_sheet(name)
    ws.append(headers)
    for c in range(1,len(headers)+1):
        cell=ws.cell(1,c); cell.font=HDR; cell.fill=HDRF
        cell.alignment=Alignment(horizontal='center',vertical='center',wrap_text=True); cell.border=BORD
    for i,row in enumerate(rows,start=2):
        ws.append(row)
        f=fills(row) if fills else None
        for j in range(1,len(headers)+1):
            cell=ws.cell(i,j); cell.font=CF; cell.border=BORD
            if f: cell.fill=f
            elif i%2==0: cell.fill=ALT
    for c,w in enumerate(widths,start=1): ws.column_dimensions[get_column_letter(c)].width=w
    ws.freeze_panes=freeze; ws.row_dimensions[1].height=30
    ws.auto_filter.ref=f'A1:{get_column_letter(len(headers))}{len(rows)+1}'
    return ws

def zf(v): return None if v is None else round(float(v),2)
def pf(v): return None if v is None else round(float(v),1)

# ---- Base_longitudinal
hdr=['Fase','Nome','TP22 %','z22','TP23 %','z23','TP25 %','z25','Sim25 /60','z Sim25',
     'S01-26 /39','z S01','TP26 %','z TP26','S02-26 /60','z S02','Nível TP26 (Mapa)',
     'Estado 2026','Classificação do risco','Recuperação','Sinais 2026 contraditórios','Trajetória (z)']
rows=[]
for r in sorted(B,key=lambda r:((r['fase'] or 99), r['nome'])):
    rows.append([r['fase'],r['nome'],pf(r.get('tp22')),zf(r.get('z22')),pf(r.get('tp23')),zf(r.get('z23')),
        pf(r.get('tp25')),zf(r.get('z25')),r.get('s25_ac'),zf(r.get('s25_z')),
        r.get('s01_ac'),zf(r.get('s01_z')),pf(r.get('tp26')),zf(r.get('z26')),
        r.get('s02_ac'),zf(r.get('s02_z')),r.get('nivel'),
        {'risco':'EM RISCO','ok':'OK','limitrofe':'Limítrofe',None:'sem dado 2026'}[r['_est']],
        r['_cls'] or '',r['_rec'] or '','SIM' if r['_contra'] else '',r['_traj']])
def fill_base(row):
    if row[17]=='EM RISCO': return RED
    if row[19]=='Recuperado': return GRN
    if row[19]=='Parcial' or row[17]=='Limítrofe': return AMB
    return None
sheet('Base_longitudinal',hdr,rows,[6,36]+[8,7]*7+[16,12,26,13,13,58],fills=fill_base)

# ---- Risco_atual
rk={'Crônico (≥2 ondas anteriores)':0,'Recorrente (1 onda anterior)':1,'Queda gradual (vinha entre −1 e −0,5)':2,
    'QUEDA EM 2026':3,'Sem histórico':4,'Sem histórico (fase inicial)':5}
rr=[r for r in B if r['_est']=='risco']
rows=[[r['fase'],r['nome'],r['_cls'],zf(r.get('z26')),zf(r.get('s02_z')),
       'SIM' if r['_contra'] else '',r.get('foco') or '',r['_traj']]
      for r in sorted(rr,key=lambda r:(rk.get(r['_cls'],9),(r['fase'] or 0),r['_min26'] or 0))]
sheet('Risco_atual',['Fase','Nome','Classificação','z TP26','z S02-26','Contraditório','Foco (área)','Trajetória (z)'],
      rows,[6,36,30,9,10,12,12,58],fills=lambda row: RED if row[2].startswith(('Crônico','QUEDA')) else AMB)

# ---- Recuperados / Parciais
for nome_aba,tag in (('Recuperados','Recuperado'),('Recuperacao_parcial','Parcial')):
    rs=[r for r in B if r['_rec']==tag]
    rows=[[r['fase'],r['nome'],
           min([float(r[k]) for k in OLD if r.get(k) is not None]+
               ([float(r['s01_z'])] if r.get('s01_z') is not None else []) or [0]),
           zf(r.get('z26')),zf(r.get('s02_z')),r['_traj']] for r in sorted(rs,key=lambda r:(r['fase'] or 0))]
    rows=[[a,b,round(c,2),d,e,f] for a,b,c,d,e,f in rows]
    sheet(nome_aba,['Fase','Nome','Pior z anterior','z TP26','z S02-26','Trajetória (z)'],
          rows,[6,36,13,9,10,64],fills=lambda row: GRN if nome_aba=='Recuperados' else AMB)

# ---- Sintese_fases
import collections
cnt=collections.defaultdict(lambda: collections.Counter())
for r in B:
    f=r['fase'] or 0
    cnt[f]['n']+=1
    if r['_est']=='risco': cnt[f]['risco']+=1
    if r['_rec']=='Recuperado': cnt[f]['rec']+=1
    if r['_rec']=='Parcial': cnt[f]['par']+=1
rows=[[f,cnt[f]['n'],cnt[f]['risco'],cnt[f]['rec'],cnt[f]['par']] for f in sorted(cnt)]
sheet('Sintese_fases',['Fase','Alunos na base','Em risco 2026','Recuperados','Recup. parcial'],rows,[6,13,13,13,13],freeze='A2')

# ---- Leia-me
ws=wb.create_sheet('Leia-me',0)
ws.column_dimensions['A'].width=24; ws.column_dimensions['B'].width=118
ws['A1']='Trajetórias individuais 2022–2026 — risco atual e recuperação'; ws['A1'].font=TIT
linhas=[
 ('',''),
 ('Pergunta','Quem está em risco AGORA e qual é a trajetória de cada um; e quem esteve em situação de atenção antes e recuperou.'),
 ('Fontes','TP NAPISUL 2022/2023/2025/2026 (Mapa_Atencao_TP2026 + painéis, % 0–100) · Simulado ENAMED S02-2025 (11ª fase de então, /60) · Simulados ENAMED 2026 S01 (/39) e S02 (/60), extraídos dos dashboards.'),
 ('Método','Provas de perfis diferentes NÃO são comparáveis em % bruta. A métrica comparável é o z-score dentro do grupo de pares: em cada onda, o aluno é comparado apenas aos colegas da própria fase/coorte na mesma prova. Para TPs anteriores, o z é calculado dentro da coorte atual retroagida (mesmos colegas de hoje, notas de então).'),
 ('Limiares','Risco: z ≤ −1 em TP2026 (maio) ou S02-2026 (julho) — os dois sinais mais recentes. OK: todos os sinais 2026 > −0,5. Limítrofe: entre −1 e −0,5.'),
 ('Classificação do risco','Crônico: z ≤ −1 em ≥2 ondas antigas (2022/23/25). Recorrente: 1 onda antiga. Queda gradual: vinha entre −1 e −0,5. QUEDA EM 2026: histórico antigo saudável, caiu neste ano. Sem histórico: fases iniciais ou ausências.'),
 ('Recuperado','Esteve com z ≤ −1 em alguma onda anterior (TP22/23/25, Sim25 ou S01-26) e hoje TODOS os sinais 2026 estão acima de −0,5. Parcial: hoje entre −1 e −0,5.'),
 ('Ressalvas','1) n pequenos por fase (21–38): diferenças de |z| < 0,3 são ruído. 2) Fases 1–2: o flag reflete ponto de entrada, não trajetória. 3) TP e simulado medem coisas diferentes (progresso geral vs prova estilo ENAMED); a coluna "contraditório" marca |z TP26 − z S02| ≥ 1,5 — investigar caso a caso (ex.: aluno que não levou uma das provas a sério). 4) 10 alunos dos simulados não fizeram o TP2026 e têm linha própria ("ausente do TP"). 5) Variantes de nome unificadas (Amanda/Ananda de Matos, Gonzalez/Gonzales, Lorenço/Lourenço, Marquetti/Marchetti, Fragas, Caldas, Terres, Deluca Schneider).'),
 ('Reprodutibilidade','Parâmetros (médias e DP por fase/onda) recalculáveis a partir da Base_longitudinal; scripts em dados/ no repositório.'),
]
r=2
for a,b in linhas:
    ws.cell(r,1,a).font=Font(name=ARIAL,size=10,bold=bool(a))
    c=ws.cell(r,2,b); c.font=Font(name=ARIAL,size=10); c.alignment=Alignment(wrap_text=True,vertical='top')
    ws.cell(r,1).alignment=Alignment(vertical='top')
    ws.row_dimensions[r].height=max(15,13*(len(b)//110+1))
    r+=1
ws.sheet_view.showGridLines=False
del wb['Sheet']
wb.save('Trajetorias_Alunos_2022_2026.xlsx')
print('ok', len(B),'alunos')
import collections as cc
print(cc.Counter(r['_cls'] for r in B if r['_est']=='risco'))
print('recuperados:',sum(1 for r in B if r['_rec']=='Recuperado'),
      '| parciais:',sum(1 for r in B if r['_rec']=='Parcial'),
      '| contraditórios:',sum(1 for r in B if r['_contra']))
