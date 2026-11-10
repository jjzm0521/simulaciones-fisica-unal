# Biblioteca compartida

Lo que usan todas las simulaciones. Ver la propuesta completa en [`docs/propuesta-biblioteca.md`](../docs/propuesta-biblioteca.md).

| Carpeta | Contenido | Estado |
|---|---|---|
| `nucleo/` | `three-r159.min.js` (motor 3D común) y `camara.js` (girar, desplazar, zoom hacia el cursor, pellizco) | Listo |
| `fuentes/` | `fuentes.css`: Bricolage Grotesque, IBM Plex Sans y Plex Mono incrustadas (sin internet) | Listo |
| `interfaz/` | Diseño aprobado: colores, paneles flotantes, barra *Qué mostrar*, vista limpia, teclado, control táctil | Fase 1 |
| `piezas/` | Equipos del laboratorio: fotocompuerta, rampa, esfera, mesa, cinta métrica, PhysicsSensor, lente… | Fase 2 |
| `fisica/` | Incertidumbre, verificación de cálculos, señales del sensor | Fase 2 |

Se incluyen en una simulación con marcadores en la fuente, por ejemplo:

    <script data-inline="../../../biblioteca/nucleo/three-r159.min.js"></script>

y `herramientas/empaquetar.py` los copia dentro del HTML final.
