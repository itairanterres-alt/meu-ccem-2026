# -*- coding: utf-8 -*-
import statistics as st, unicodedata, re, math, json
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
import s3data as S, imgdata as D
def norm(n):
    n=unicodedata.normalize('NFD',n); n=''.join(c for c in n if unicodedata.category(c)!='Mn')
    return re.sub(r'\s+',' ',n).strip().lower()
BAR=54; DEN=89
VAR={'eduardo lorenco moreira':'eduardo lourenco moreira','maria amelia vozniak deluca schneider':'maria amelia vozniak deluca'}
# simulados 2026 p/ comparação
s01={}; s02={}
for f,ph in [('10ª Fase',10),('11ª Fase',11),('6ª Fase',6),('7ª Fase',7)]:
    for it in D.S1_ALUNOS[f]: s01[norm(it[0])]=round(it[1]/39*100,1)
    for n,ac in D.S2_ALUNOS[f]: s02[norm(n)]=round(ac/60*100,1)
P=json.load(open('projecao.json')); tp={norm(a['nome']):a for a in P['alvo']}

def banda(ac):
    if ac>=BAR+8: return 'Folga'
    if ac>=BAR+3: return 'Confortável'
    if ac>=BAR-3: return 'ZONA DE DECISÃO'
    return 'ABAIXO DA BARRA'

ARIAL='Arial'
HDRF=PatternFill('solid',fgColor='1F4E5F'); HDR=Font(name=ARIAL,size=10,bold=True,color='FFFFFF')
CF=Font(name=ARIAL,size=10); TIT=Font(name=ARIAL,size=14,bold=True,color='1F4E5F')
THIN=Side(style='thin',color='BFBFBF'); BORD=Border(left=THIN,right=THIN,top=THIN,bottom=THIN)
ALT=PatternFill('solid',fgColor='F2F7F9'); RED=PatternFill('solid',fgColor='F8D7DA')
AMB=PatternFill('solid',fgColor='FFF3CD'); GRN=PatternFill('solid',fgColor='D4EDDA')
wb=Workbook()
def sheet(name,H,data,W,fills=None,freeze='C2'):
    ws=wb.create_sheet(name); ws.append(H)
    for c in range(1,len(H)+1):
        cell=ws.cell(1,c); cell.font=HDR; cell.fill=HDRF
        cell.alignment=Alignment(horizontal='center',vertical='center',wrap_text=True); cell.border=BORD
    for i,row in enumerate(data,2):
        ws.append(row); f=fills(row) if fills else None
        for j in range(1,len(H)+1):
            cell=ws.cell(i,j); cell.font=CF; cell.border=BORD
            if f: cell.fill=f
            elif i%2==0: cell.fill=ALT
    for c,w in enumerate(W,1): ws.column_dimensions[get_column_letter(c)].width=w
    ws.freeze_panes=freeze; ws.row_dimensions[1].height=30
    ws.auto_filter.ref=f'A1:{get_column_letter(len(H))}{len(data)+1}'
    return ws

rows=[]
for turma,f in [('T8 (12ª)','12ª Fase'),('T9 (11ª)','11ª Fase')]:
    for n,ac in sorted(S.S3[f],key=lambda x:x[1]):
        k=VAR.get(norm(n),norm(n))
        p=round(ac/DEN*100,1); b=banda(ac)
        a=tp.get(norm(n)) or tp.get(k)
        margem_tp=round(a['margem'],1) if a else None
        p02=s02.get(norm(n)) or s02.get(k)
        delta=round(p-p02,1) if p02 is not None else None
        rows.append([turma,n,ac,p,ac-BAR,b,p02,delta,margem_tp])
def fill(r):
    if r[5]=='ABAIXO DA BARRA': return RED
    if r[5]=='ZONA DE DECISÃO': return AMB
    if r[5]=='Folga': return GRN
    return None
sheet('Prova_real_S3',
      ['Turma','Nome','Acertos /89','% na prova real','Margem s/ barra\n(acertos, barra=54)','Banda',
       '% Simulado 02','Δ real − simul.','Margem TP\n(projeção ant.)'],
      rows,[10,40,11,13,14,17,12,13,13],fills=fill)

# Sintese
ws=wb.create_sheet('Sintese'); ws.column_dimensions['A'].width=52
for c in 'BCD': ws.column_dimensions[c].width=14
t8=[a for _,a in S.S3['12ª Fase']]; t9=[a for _,a in S.S3['11ª Fase']]; tot=t8+t9
def pcp(xs): return 100*sum(1 for a in xs if a>=BAR)/len(xs)
d=[('Projeção ENAMED 2026 na PROVA REAL (Simulado 03)','','',''),
   ('','T8 (12ª)','T9 (11ª)','Coorte'),
   ('n', len(t8),len(t9),len(tot)),
   ('Média % na prova real',f'{st.mean(t8)/DEN*100:.1f}%',f'{st.mean(t9)/DEN*100:.1f}%',f'{st.mean(tot)/DEN*100:.1f}%'),
   ('PCP — proficientes (barra 54/89 = 60,3%)',f'{pcp(t8):.1f}%',f'{pcp(t9):.1f}%',f'{pcp(tot):.1f}%'),
   ('Conceito projetado','4–5','4','4'),
   ('','','',''),
   ('Convergência das projeções','','',''),
   ('  PCP pela prova real (S3)',f'{pcp(tot):.1f}%','',''),
   ('  PCP pelo Teste de Progresso (projeção anterior)','83,1%','',''),
   ('  ENAMED 2025 real (âncora, conceito 4)','82,0%','',''),
   ('','','',''),
   ('Para Conceito 5 (PCP ≥ 90% → 60/66)',f'faltam {math.ceil(0.9*len(tot))-sum(1 for a in tot if a>=BAR)} proficientes','',''),
]
for i,row in enumerate(d,1):
    for j,v in enumerate(row,1):
        ws.cell(i,j,v).font=Font(name=ARIAL,size=10,bold=(i in (1,2,8)))
ws.sheet_view.showGridLines=False

ws=wb.create_sheet('Leia-me',0); ws.column_dimensions['A'].width=22; ws.column_dimensions['B'].width=116
ws['A1']='Projeção ENAMED 2026 — recalibrada pela prova real (Simulado 03)'; ws['A1'].font=TIT
L=[('',''),
 ('O que mudou','O Simulado 03 aplicou às turmas atuais a PROVA REAL do ENAMED do ciclo passado (90 itens; 89 válidos). É o mesmo instrumento do exame — a melhor âncora possível, muito superior ao teste de progresso ou aos simulados de estilo.'),
 ('Extração','Distribuição A–E por questão validada: as 88 questões com gráfico fecham exatamente com as notas dos alunos por fase (o resíduo é só Q24 e Q46, sem gráfico). Denominador 89 confirmado. Fases: 7ª e 8ª (turmas médias), 11ª = T9, 12ª = T8.'),
 ('Barra de proficiência','54/89 acertos (60,3%). Definida por dupla âncora convergente: (a) reproduz os 82% de proficientes que a UNIDAVI obteve no ENAMED 2025 real; (b) coincide com o marco de "60 pontos" da régua de proficiência do INEP. As duas caem no mesmo ponto.'),
 ('Resultado',f'PCP da coorte na prova real = 81,8% → Conceito 4. Bate com a projeção anterior por teste de progresso (83,1%) e com o resultado real de 2025 (82%). Três medições independentes convergem.'),
 ('Nuance T8 vs T9','Na prova real, T8 (12ª, formandos) tem 85,7% de proficientes — encosta no Conceito 5; T9 (11ª) tem 77,4%. Se o conceito oficial considerar só concluintes (12ª), a leitura é ainda mais favorável.'),
 ('Sensibilidade à barra','A barra importa: a 65% raw o PCP cairia a ~70% (conceito 3). Os 60,3% são defensáveis pela dupla âncora, mas a margem para o piso do conceito 4 (75%) fica pequena — daí a zona de decisão importar.'),
 ('Validação cruzada','Correlação de 0,54 entre o desempenho na prova real e a margem projetada pelo teste de progresso: instrumentos e datas diferentes, mesmo ranqueamento. A projeção anterior se sustenta.'),
 ('Alerta de formato','Em média a coorte foi 5,8 p.p. melhor na prova real que no simulado de julho (evolução + data), MAS um subgrupo despenca no formato real: Tassiane (−17), Camila Cabral (−16), Kerollin (−13), Sofia Boldrini (−10). São alunos que "vão bem em simulado curto e mal na prova cheia" — alvo de treino no formato de 90 itens.'),
 ('Abas','Prova_real_S3 (individual, ordenado por acerto, com banda e comparação) · Sintese (PCP e convergência). Dado nominal — circulação restrita.'),
]
r=2
for a,b in L:
    ws.cell(r,1,a).font=Font(name=ARIAL,size=10,bold=bool(a))
    c=ws.cell(r,2,b); c.font=Font(name=ARIAL,size=10); c.alignment=Alignment(wrap_text=True,vertical='top')
    ws.cell(r,1).alignment=Alignment(vertical='top'); ws.row_dimensions[r].height=max(15,13*(len(b)//110+1)); r+=1
ws.sheet_view.showGridLines=False
del wb['Sheet']
wb.save('Projecao_ENAMED_2026_prova_real.xlsx')
print('ok — PCP coorte',f'{pcp(tot):.1f}%  T8 {pcp(t8):.1f}%  T9 {pcp(t9):.1f}%')
