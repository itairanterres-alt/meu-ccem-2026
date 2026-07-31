import re, os, glob, json, sys
from xml.etree import ElementTree as ET

NS={'c':'http://schemas.openxmlformats.org/drawingml/2006/chart',
    'a':'http://schemas.openxmlformats.org/drawingml/2006/main'}

def title(root):
    t=root.find('.//c:chart/c:title',NS)
    if t is None: return None
    return ''.join(x.text or '' for x in t.findall('.//a:t',NS)).strip()

def cache(ref):
    if ref is None: return None,[]
    f=ref.find('c:f',NS)
    f=f.text if f is not None else None
    pts={}
    for cch in ref:
        tag=cch.tag.split('}')[1]
        if tag in ('strCache','numCache'):
            for pt in cch.findall('c:pt',NS):
                v=pt.find('c:v',NS)
                pts[int(pt.get('idx'))]=v.text if v is not None else None
    if not pts: return f,[]
    return f,[pts.get(i) for i in range(max(pts)+1)]

def dump(path):
    root=ET.parse(path).getroot()
    out={'file':os.path.basename(path),'title':title(root),'series':[]}
    for ser in root.findall('.//c:ser',NS):
        nm=None
        tx=ser.find('c:tx/c:strRef',NS)
        if tx is not None: _,v=cache(tx); nm=v[0] if v else None
        catref=ser.find('c:cat/c:strRef',NS) or ser.find('c:cat/c:numRef',NS)
        cf,cats=cache(catref)
        vf,vals=cache(ser.find('c:val/c:numRef',NS))
        out['series'].append({'name':nm,'catf':cf,'cats':cats,'valf':vf,'vals':vals})
    return out

d=sys.argv[1]
res=[]
files=sorted(glob.glob(d+'/xl/charts/chart*.xml'), key=lambda p:int(re.search(r'chart(\d+)',p).group(1)))
for f in files: res.append(dump(f))
print(json.dumps(res,ensure_ascii=False,indent=1))
