#!/usr/bin/env bash
# ============================================================
# Meu CCEM 2026 — compila o JSX para JavaScript de navegador
# ------------------------------------------------------------
# Rode este script depois de editar qualquer arquivo .jsx em v4/.
# NAO e necessario para editar conteudo: v4/ccem-data.js e
# JavaScript puro (programa e palestrantes) e pode ser
# editado direto pelo GitHub, sem recompilar nada.
#
#   ./build.sh
#
# Requer Node. Baixa o esbuild sob demanda via npx.
# ============================================================
set -euo pipefail
cd "$(dirname "$0")"

ARQUIVOS=(ccem-lib ccem-screens ccem-home ccem-caderno ccem-assistente ccem-app)

echo "Compilando JSX -> JS..."
for f in "${ARQUIVOS[@]}"; do
  npx --yes esbuild@0.28.2 "v4/$f.jsx" \
    --loader:.jsx=jsx \
    --jsx=transform \
    --outfile="v4/$f.js" \
    --log-level=warning
  printf '  v4/%-14s -> v4/%s\n' "$f.jsx" "$f.js"
done

echo
echo "Pronto. Lembre de incrementar CACHE_VERSION em sw.js antes de publicar,"
echo "para que os navegadores busquem a versao nova."
