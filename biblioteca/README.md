# Biblioteca compartida

Lo que usan todas las simulaciones. Ver la propuesta completa en [`docs/propuesta-biblioteca.md`](../docs/propuesta-biblioteca.md).

| Carpeta | Contenido | Estado |
|---|---|---|
| `nucleo/` | `three-r159.min.js` (motor 3D común) y `camara.js` (girar, desplazar, zoom hacia el cursor, pellizco) | Listo |
| `fuentes/` | `fuentes.css`: Bricolage Grotesque, IBM Plex Sans y Plex Mono incrustadas (sin internet) | Listo |
| `interfaz/` | `interfaz.css` (diseño aprobado completo: colores, paneles flotantes, barra *Qué mostrar*, vista limpia, HUD, control táctil, celular) e `interfaz.js` (ubicar barras, preferencias, teclado, botón que repite) | Listo |
| `piezas/` | Equipos del laboratorio: fotocompuerta, rampa, esfera, mesa, cinta métrica, PhysicsSensor, lente… | Fase 2 |
| `fisica/` | `incertidumbre.js` (una cifra significativa, coma decimal, validar lo que escribe el estudiante); luego verificación de cálculos y señales del sensor | En curso |

Se incluyen en una simulación con marcadores en la fuente, por ejemplo:

    <script data-inline="../../../biblioteca/nucleo/three-r159.min.js"></script>

y `herramientas/empaquetar.py` los copia dentro del HTML final.

Para una práctica nueva, parte de [`plantilla/practica/`](../plantilla/practica/).
