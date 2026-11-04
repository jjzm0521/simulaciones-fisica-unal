#!/bin/sh
# Descarga three.js r159 (último con build clásico three.min.js, sin módulos) a un directorio de trabajo.
# Uso: sh get_three.sh <directorio>   → deja <directorio>/package/build/three.min.js
set -e
DIR="${1:-.}"
mkdir -p "$DIR" && cd "$DIR"
[ -f package/build/three.min.js ] && { echo "$DIR/package/build/three.min.js"; exit 0; }
npm pack three@0.159.0 --silent >/dev/null
tar xzf three-0.159.0.tgz package/build/three.min.js
echo "$(pwd)/package/build/three.min.js"
