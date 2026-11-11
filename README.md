# simulaciones-fisica-unal

Simulaciones 3D interactivas de los laboratorios de física de la **Universidad Nacional de Colombia, Sede Medellín**. Cada simulación es un solo archivo HTML que funciona sin internet, en computador, celular y proyector.

## Organización

| Carpeta | Qué hay |
|---|---|
| [`fisica-1/`](fisica-1/) | Física Mecánica: una carpeta por práctica (13) y un índice con el estado de cada una |
| [`fisica-3/`](fisica-3/) | Ondas y óptica |
| [`biblioteca/`](biblioteca/) | Lo compartido: motor 3D, cámara, fuentes; luego interfaz aprobada y piezas (fotocompuerta, rampa, esfera…) |
| [`herramientas/`](herramientas/) | `empaquetar.py`: arma el HTML final de cualquier práctica |
| [`docs/`](docs/) | Propuestas y decisiones del equipo ([biblioteca de piezas](docs/propuesta-biblioteca.md)) |
| [`skills/`](skills/) | Instrucciones para el agente de IA (`simulacion-practica-lab`) |

Cada práctica tiene la misma forma:

    index.html          simulación lista (la que se abre y se envía)
    src/index.src.html  fuente editable
    README.md           ficha de la práctica

Para reconstruir una práctica después de editar su fuente, desde su carpeta:

    python3 -I ../../herramientas/empaquetar.py src/index.src.html index.html

Después de cambiar algo en `biblioteca/`, vuelve a armar **todas** las prácticas de una vez (desde la raíz):

    python3 -I herramientas/empaquetar-todo.py

Cada `index.html` sigue siendo un solo archivo independiente: trae adentro todo lo que usa de la biblioteca, así que se puede enviar y abrir sin el resto de las carpetas y sin internet.

## Simulaciones listas

- [Movimiento parabólico](fisica-1/movimiento-parabolico/) (F1) · diseño aprobado
- [Lente convergente](fisica-3/lente-convergente/) (F3) · diseño anterior

## 👥 Colaboradores

- **Juan José Zapata Moreno** ([@jjzm0521](https://github.com/jjzm0521))
- **María José Uribe** ([@mjuribe](https://github.com/mjuribe))
- **Brayan Garcia** ([@bgarciab-gb](https://github.com/bgarciab-gb))
- **Daniel Cuartas** ([@danicuartas](https://github.com/danicuartas))
- **@mmarinsu-svg** ([@mmarinsu-svg](https://github.com/mmarinsu-svg))
- **@mpalacioh-bit** ([@mpalacioh-bit](https://github.com/mpalacioh-bit))
