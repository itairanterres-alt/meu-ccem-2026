#!/usr/bin/env python3
"""Carrega adequacao-enamed/canonico/treino-enamed-import.json (914 questões
já convertidas para o schema do treino-enamed) diretamente nas tabelas
`questions` e `question_versions` do Supabase, via API REST (service_role).

Rode isto ONDE você tiver as credenciais — não precisa ser nesta sessão.

Uso:
    export SUPABASE_URL="https://SEU-PROJETO.supabase.co"   # o projeto do treino-enamed, não outro app
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


TIMEOUT = 30  # segundos por request — falha alto e claro em vez de travar para sempre


def insert_question(status):
    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/questions",
        headers=HEADERS,
        json={"status": status, "current_version": 1},
        timeout=TIMEOUT,
    )
    r.raise_for_status()
    return r.json()[0]["id"]


def insert_question_version(question_id, version, body, provenance):
    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/question_versions",
        headers=HEADERS,
        json={"question_id": question_id, "version": version, "body": body, "provenance": provenance},
        timeout=TIMEOUT,
    )
    if not r.ok:
        # limpa a questão órfã se a versão falhar, mesma lógica do database.ts deles
        requests.delete(f"{SUPABASE_URL}/rest/v1/questions?id=eq.{question_id}", headers=HEADERS, timeout=TIMEOUT)
        r.raise_for_status()


def main():
    items = json.loads(IMPORT_FILE.read_text(encoding="utf-8"))
    print(f"Lidas {len(items)} questões de {IMPORT_FILE.name}. Conectando em {SUPABASE_URL} ...", flush=True)

    # testa a conexão com 1 item antes de sair inserindo tudo, para falhar rápido e claro
    try:
        primeiro = items[0]
        question_id = insert_question(primeiro["question"]["status"])
        insert_question_version(
            question_id, primeiro["question_version"]["version"],
            primeiro["question_version"]["body"], primeiro["question_version"]["provenance"],
        )
    except requests.exceptions.Timeout:
        sys.exit("Não consegui conectar ao Supabase em 30s. Confira sua internet e o SUPABASE_URL.")
    except requests.exceptions.ConnectionError as e:
        sys.exit(f"Falha de conexão com o Supabase. Confira SUPABASE_URL. Detalhe: {e}")
    except requests.exceptions.HTTPError as e:
        sys.exit(f"O Supabase recusou a requisição (provável SUPABASE_SECRET_KEY errada/incompleta). Detalhe: {e}")
    ok, falhas = 1, []
    print(f"1/{len(items)} inseridas...", flush=True)

    for item in items[1:]:
        q = item["question"]
        qv = item["question_version"]
        try:
            question_id = insert_question(q["status"])
            insert_question_version(question_id, qv["version"], qv["body"], qv["provenance"])
            ok += 1
        except Exception as e:
            falhas.append({"origem_indice": item["origem_indice"], "erro": str(e)})
        if ok % 25 == 0:
            print(f"{ok}/{len(items)} inseridas...", flush=True)

    print(f"\nConcluído: {ok} inseridas, {len(falhas)} falhas.")
    if falhas:
        Path("falhas_import.json").write_text(json.dumps(falhas, ensure_ascii=False, indent=2), encoding="utf-8")
        print("Detalhe das falhas em falhas_import.json")


if __name__ == "__main__":
    main()
