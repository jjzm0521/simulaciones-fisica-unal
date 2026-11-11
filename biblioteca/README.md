# Biblioteca compartida

Lo que usan todas las simulaciones. Ver la propuesta completa en [`docs/propuesta-biblioteca.md`](../docs/propuesta-biblioteca.md).

| Carpeta | Contenido | Estado |
|---|---|---|
| `nucleo/` | `three-r159.min.js` (motor 3D común), `camara.js` (girar, desplazar, zoom hacia el cursor, pellizco) `rotulos.js` (rótulos legibles a cualquier distancia) y `ambiente.js` (fondo, luces, piso y rejilla en tema claro y oscuro) | Listo |
| `fuentes/` | `fuentes.css`: Bricolage Grotesque, IBM Plex Sans y Plex Mono incrustadas (sin internet) | Listo |
| `interfaz/` | Sistema de diseño. `tokens.css` (colores, letra, espacio, radio; modo proyector), `interfaz.css` (armazón a pantalla completa y elementos) e `interfaz.js` (`Lab.ui`: deslizador, opciones, casilla, interruptor, lecturas, fila, aviso con deshacer, barra de acción, teclado, preferencias) | Listo (v2) |
| `catalogo.html` | Todos los elementos en vivo, con cuándo usar cada uno y su código. Es la referencia para aprobar y para el agente | Listo |
| `piezas/` | Equipos del laboratorio, modelados una vez: `soporte.js` (base, varilla, nuez, brazo) y `fotocompuerta.js`. Reglas y fichas en [`piezas/README.md`](piezas/README.md) | En curso (borradores) |
| `fisica/` | `incertidumbre.js` (una cifra significativa, coma decimal, validar lo que escribe el estudiante); luego verificación de cálculos y señales del sensor | En curso |

Se incluyen en una simulación con marcadores en la fuente, por ejemplo:

    <script data-inline="../../../biblioteca/nucleo/three-r159.min.js"></script>

y `herramientas/empaquetar.py` los copia dentro del HTML final.

Para una práctica nueva, parte de [`plantilla/practica/`](../plantilla/practica/).
