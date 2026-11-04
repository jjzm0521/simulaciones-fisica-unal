#!/usr/bin/env python3
"""Inserta three.js (build clásico) dentro del HTML fuente para que funcione sin internet.

Uso: python3 -I build.py fuente.html three.min.js salida.html
La fuente debe contener exactamente una vez el marcador /*__THREE__*/ dentro de un <script>.
"""
import sys

if len(sys.argv) != 4:
    sys.exit(__doc__)
src, three, out = sys.argv[1:4]
s = open(src, encoding="utf-8").read()
t = open(three, encoding="utf-8").read().replace("</script", "<\\/script")
n = s.count("/*__THREE__*/")
if n != 1:
    sys.exit(f"El marcador /*__THREE__*/ aparece {n} veces; debe aparecer 1.")
open(out, "w", encoding="utf-8").write(s.replace("/*__THREE__*/", t))
print(f"ok -> {out} ({len(s) + len(t)} bytes aprox.)")
