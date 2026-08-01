#!/usr/bin/env python3
"""Aplica a camada de especificidade fina às questões canônicas.

Injeta em cada questão um objeto `classificacao_fina`:
    {especialidade, especialidade_secundaria, objeto_conhecimento,
     sistema_organico, contexto_atencao, conteudo_declarado_origem,
     autor_declarado_origem, matriz_enamed_478_2025}

`conteudo_declarado_origem` vem das fichas NAPISUL, quando existir — é a
classificação escrita pelo próprio autor do item e tem precedência informativa
sobre a inferida.

`matriz_enamed_478_2025` fica `null` por enquanto: a Portaria não é alcançável
desta sessão (proxy bloqueia inep.gov.br / in.gov.br / CDNs). Quando o PDF
entrar na pasta, basta preencher esse campo — o resto da estrutura não muda.

O schema institucional tem `additionalProperties: false`, então o campo novo é
declarado como OPCIONAL na cópia de referência: questões antigas continuam
válidas. Também é gravado um arquivo companheiro, para quem preferir não mexer
no schema.

Uso: python3 adequacao-enamed/scripts/aplicar_especialidade.py
"""
import glob, json, os
from collections import Counter

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ESP_DIR = os.path.join(BASE, "intermediario", "especialidade")
FICHAS = os.path.join(BASE, "intermediario", "conteudo_fichas.json")
SCHEMA = os.path.join(BASE, "referencia", "schema_questao_med_unidavi.json")
COMPANHEIRO = os.path.join(BASE, "canonico", "classificacao-fina.json")


def carregar():
    esp = {}
    for f in sorted(glob.glob(os.path.join(ESP_DIR, "parte_*.json"))):
        for it in json.load(open(f, encoding="utf-8")):
            esp[it["id_origem"]] = it
    fichas = {}
    if os.path.exists(FICHAS):
        for r in json.load(open(FICHAS, encoding="utf-8")):
            fichas[r["id_origem"]] = r
    return esp, fichas


def estender_schema():
    """Declara `classificacao_fina` como propriedade OPCIONAL."""
    sch = json.load(open(SCHEMA, encoding="utf-8"))
    props = sch["properties"]
    if "classificacao_fina" in props:
        return False
    props["classificacao_fina"] = {
        "type": ["object", "null"],
        "additionalProperties": False,
        "description": (
            "Camada de especificidade fina (além da grande área `area_clinica`), "
            "para blueprint por sub-área e treino por tópico. Opcional: questões "
            "anteriores a esta camada continuam válidas."),
        "properties": {
            "especialidade": {"type": "string"},
            "especialidade_secundaria": {"type": ["string", "null"]},
            "objeto_conhecimento": {"type": "string", "maxLength": 200},
            "sistema_organico": {"type": ["string", "null"]},
            "contexto_atencao": {"type": ["string", "null"]},
            "conteudo_declarado_origem": {
                "type": ["string", "null"],
                "description": "Classificação escrita pelo autor do item na ficha de origem."},
            "autor_declarado_origem": {"type": ["string", "null"]},
            "matriz_enamed_478_2025": {
                "type": ["string", "null"],
                "description": ("Código do objeto de conhecimento na Matriz de "
                                "Referência da Portaria INEP 478/2025. Nulo "
                                "enquanto a Portaria não estiver disponível.")},
        },
        "required": ["especialidade", "objeto_conhecimento"],
    }
    json.dump(sch, open(SCHEMA, "w"), ensure_ascii=False, indent=2)
    return True


def main():
    esp, fichas = carregar()
    print(f"classificações finas: {len(esp)} | conteúdo de ficha: {len(fichas)}")
    if estender_schema():
        print("schema de referência: propriedade opcional `classificacao_fina` adicionada")

    companheiro, aplicadas, sem = [], 0, []
    for caminho in sorted(glob.glob(os.path.join(BASE, "canonico", "*.canonico.json"))):
        qs = json.load(open(caminho, encoding="utf-8"))
        for q in qs:
            idg = q["_proveniencia"].get("id_origem") or \
                  f"enamed2025_q{q['_proveniencia']['questao_original']:03d}"
            e = esp.get(idg)
            if not e:
                sem.append(idg)
                continue
            fi = fichas.get(idg, {})
            cf = {
                "especialidade": e["especialidade"],
                "especialidade_secundaria": e.get("especialidade_secundaria"),
                "objeto_conhecimento": e["objeto_conhecimento"],
                "sistema_organico": e.get("sistema_organico"),
                "contexto_atencao": e.get("contexto_atencao"),
                "conteudo_declarado_origem": fi.get("conteudo_declarado"),
                "autor_declarado_origem": fi.get("autor_declarado"),
                "matriz_enamed_478_2025": None,
            }
            q["classificacao_fina"] = cf
            companheiro.append({"id_origem": idg, **cf})
            aplicadas += 1
        json.dump(qs, open(caminho, "w"), ensure_ascii=False, indent=2)

    json.dump(companheiro, open(COMPANHEIRO, "w"), ensure_ascii=False, indent=2)
    print(f"aplicadas: {aplicadas} | sem classificação: {len(sem)} {sem[:5]}")

    c = Counter(x["especialidade"] for x in companheiro)
    print(f"\nespecialidades distintas: {len(c)}")
    for k, v in c.most_common(18):
        print(f"  {k:<34} {v}")
    print("\ncontexto de atenção:",
          dict(Counter(x["contexto_atencao"] for x in companheiro).most_common()))
    print(f"objetos de conhecimento distintos: "
          f"{len(set(x['objeto_conhecimento'] for x in companheiro))}")
    print(f"\nCompanheiro: {COMPANHEIRO}")


if __name__ == "__main__":
    main()
