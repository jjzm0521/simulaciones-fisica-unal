# Herramientas

| Comando (desde la raíz) | Qué hace |
|---|---|
| `python3 -I herramientas/empaquetar-todo.py` | Vuelve a armar todas las prácticas (`fisica-*/*/` y `plantilla/*/`). Úsalo después de cambiar `biblioteca/`. |
| `python3 -I herramientas/empaquetar-todo.py fisica-1` | Solo las prácticas dentro de esa carpeta. |
| `python3 -I herramientas/empaquetar.py src/index.src.html index.html` | Arma una sola práctica (desde la carpeta de la práctica). |

El resultado de cada práctica es un `index.html` independiente: lleva adentro el motor, la cámara, la interfaz, las fuentes y lo que use de la biblioteca. No necesita las carpetas ni internet.

## Empaquetar la skill

El archivo `.skill` no se guarda en el repositorio (se genera). Desde la raíz:

    (cd skills && zip -qr simulacion-practica-lab.skill simulacion-practica-lab -x '*.DS_Store')

Para que Claude use la versión nueva en la máquina del monitor:

    rsync -a --delete skills/simulacion-practica-lab/ ~/.claude/skills/simulacion-practica-lab/
