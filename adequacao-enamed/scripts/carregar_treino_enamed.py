#!/usr/bin/env python3
"""Carrega adequacao-enamed/canonico/treino-enamed-import.json (914 questões
já convertidas para o schema do treino-enamed) diretamente nas tabelas
`questions` e `question_versions` do Supabase, via API REST (service_role).

Rode isto ONDE você tiver as credenciais — não precisa ser nesta sessão.

Uso:
    export SUPABASE_URL="https://ggjxbumtnizaeomioves.supabase.co"
    export SUPABASE_SECRET_KEY="<sua service_role key, Settings > API>"
    pip install requests   # se ainda não tiver
    python3 carregar_treino_enamed.py

Todas as questões entram com status='auto_verified' — JÁ ficam visíveis ao
estudante no modo padrão do treino-enamed ("all_verified"), com o disclaimer
de que não houve revisão docente (o app tem um toggle "Somente revisão
humana" para quem quiser restringir). Revisão editorial continua disponível
depois para promover item a item para 'human_reviewed'.
Este script não é idempotente (recria linhas a cada execução); rode uma
única vez, ou ajuste a lógica de dedupe se for reexecutar.
"""
import json
import os
import sys
from pathlib import Path

import requests

SCRIPT_DIR = Path(__file__).resolve().parent
_CANDIDATOS = [
    SCRIPT_DIR / "treino-enamed-import.json",  # os dois arquivos soltos na mesma pasta
    SCRIPT_DIR.parent / "canonico" / "treino-enamed-import.json",  # dentro do repositório clonado
]
IMPORT_FILE = next((p for p in _CANDIDATOS if p.exists()), None)
if IMPORT_FILE is None:
    sys.exit(
        "Não achei treino-enamed-import.json. Coloque esse arquivo na mesma pasta "
        f"deste script ({SCRIPT_DIR})."
    )

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.environ.get("SUPABASE_SECRET_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    sys.exit(
        "Defina SUPABASE_URL e SUPABASE_SECRET_KEY (ou SUPABASE_SERVICE_ROLE_KEY) "
        "como variável de ambiente antes de rodar."
    )

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}


def insert_question(status):
    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/questions",
        headers=HEADERS,
        json={"status": status, "current_version": 1},
    )
    r.raise_for_status()
    return r.json()[0]["id"]


def insert_question_version(question_id, version, body, provenance):
    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/question_versions",
        headers=HEADERS,
        json={"question_id": question_id, "version": version, "body": body, "provenance": provenance},
    )
    if not r.ok:
        # limpa a questão órfã se a versão falhar, mesma lógica do database.ts deles
        requests.delete(f"{SUPABASE_URL}/rest/v1/questions?id=eq.{question_id}", headers=HEADERS)
        r.raise_for_status()


def main():
    items = json.loads(IMPORT_FILE.read_text(encoding="utf-8"))
    ok, falhas = 0, []
    for item in items:
        q = item["question"]
        qv = item["question_version"]
        try:
            question_id = insert_question(q["status"])
            insert_question_version(question_id, qv["version"], qv["body"], qv["provenance"])
            ok += 1
        except Exception as e:
            falhas.append({"origem_indice": item["origem_indice"], "erro": str(e)})
        if ok % 50 == 0 and ok:
            print(f"{ok}/{len(items)} inseridas...")

    print(f"\nConcluído: {ok} inseridas, {len(falhas)} falhas.")
    if falhas:
        Path("falhas_import.json").write_text(json.dumps(falhas, ensure_ascii=False, indent=2), encoding="utf-8")
        print("Detalhe das falhas em falhas_import.json")


if __name__ == "__main__":
    main()
