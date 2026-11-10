#!/usr/bin/env python3
"""Vuelve a armar TODAS las prácticas del repositorio de una vez.

Úsalo después de cambiar algo en biblioteca/ (diseño, piezas, motor, cálculos):
cada práctica recibe el cambio en su index.html, que sigue siendo un solo archivo
que funciona sin internet.

Uso (desde la raíz del repositorio):
  python3 -I herramientas/empaquetar-todo.py            arma todas
  python3 -I herramientas/empaquetar-todo.py fisica-3   solo las que estén dentro de esa carpeta

Busca cada src/index.src.html dentro de fisica-*/ y plantilla/ y escribe el
index.html de su carpeta. Si una falla, sigue con las demás y lo avisa al final.
"""
import glob
import os
import subprocess
import sys

raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
empaquetar = os.path.join(raiz, "herramientas", "empaquetar.py")
filtro = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else ""

fuentes = sorted(glob.glob(os.path.join(raiz, "fisica-*", "*", "src", "index.src.html")) +
                 glob.glob(os.path.join(raiz, "plantilla", "*", "src", "index.src.html")))
if filtro:
    fuentes = [f for f in fuentes if os.path.relpath(f, raiz).startswith(filtro)]
if not fuentes:
    sys.exit("No encontré prácticas con src/index.src.html" + (f" dentro de {filtro}" if filtro else ""))

fallas = []
for f in fuentes:
    carpeta = os.path.dirname(os.path.dirname(f))
    nombre = os.path.relpath(carpeta, raiz)
    r = subprocess.run([sys.executable, "-I", empaquetar, "src/index.src.html", "index.html"],
                       cwd=carpeta, capture_output=True, text=True)
    salida = (r.stdout + r.stderr).strip().replace("\n", "\n    ")
    print(("✓ " if r.returncode == 0 else "✗ ") + nombre + "\n    " + salida)
    if r.returncode != 0:
        fallas.append(nombre)

print(f"\n{len(fuentes) - len(fallas)} de {len(fuentes)} prácticas armadas.")
if fallas:
    print("Fallaron:", ", ".join(fallas))
    sys.exit(1)
