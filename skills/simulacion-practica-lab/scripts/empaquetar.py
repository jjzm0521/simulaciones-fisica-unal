#!/usr/bin/env python3
"""Empaqueta una simulación en un solo HTML que funciona sin internet.

Uso:
  python3 -I empaquetar.py fuente.html salida.html [--three three.min.js]

En la fuente, cada recurso local se marca así (rutas relativas a la fuente):
  <script data-inline="../../../vendor/three-r128.min.js"></script>
  <link rel="stylesheet" data-inline="../../../vendor/fuentes-parabolico.css">
y queda copiado dentro del HTML. También acepta el marcador /*__THREE__*/ de
build.py (prácticas de Física 3) si se pasa --three, así un mismo script sirve
para las dos formas de escribir la fuente.
"""
import os
import re
import sys

args = sys.argv[1:]
three = None
if "--three" in args:
    i = args.index("--three")
    three = args[i + 1]
    del args[i:i + 2]
if len(args) != 2:
    sys.exit(__doc__)
src, out = args
base = os.path.dirname(os.path.abspath(src))
s = open(src, encoding="utf-8").read()


def leer(ruta):
    p = os.path.normpath(os.path.join(base, ruta))
    if not os.path.isfile(p):
        sys.exit(f"No existe {ruta} (buscado en {p})")
    return open(p, encoding="utf-8").read()


def script(m):
    code = leer(m.group(1)).replace("</script", "<\\/script")
    return "<script>/* " + os.path.basename(m.group(1)) + " */\n" + code + "\n</script>"


def estilo(m):
    return "<style>/* " + os.path.basename(m.group(1)) + " */\n" + leer(m.group(1)) + "\n</style>"


s, ns = re.subn(r'<script\s+data-inline="([^"]+)"\s*>\s*</script>', script, s)
s, nc = re.subn(r'<link\s+rel="stylesheet"\s+data-inline="([^"]+)"\s*/?>', estilo, s)
nt = s.count("/*__THREE__*/")
if nt:
    if not three:
        sys.exit("La fuente tiene /*__THREE__*/: pasa --three ruta/three.min.js")
    if nt != 1:
        sys.exit(f"El marcador /*__THREE__*/ aparece {nt} veces; debe aparecer 1.")
    s = s.replace("/*__THREE__*/", open(three, encoding="utf-8").read().replace("</script", "<\\/script"))
externos = re.findall(r'<(?:script|link)[^>]+(?:src|href)="https?://[^"]+"', s)
open(out, "w", encoding="utf-8").write(s)
print(f"ok -> {out} ({len(s.encode('utf-8')) // 1024} KB; {ns} scripts, {nc} hojas de estilo"
      + (", three.js" if nt else "") + ")")
if externos:
    print("Aviso: todavía hay recursos externos:", *externos, sep="\n  ")
