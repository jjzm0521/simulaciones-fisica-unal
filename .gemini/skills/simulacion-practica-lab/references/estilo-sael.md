# Estilo sael.net aplicado a las simulaciones

Fuente: páginas de sael.net como /sine-waves y /bike-brake (Ryan Sael). Se copia el *lenguaje visual*, no el contenido ni la marca: no pongas su nombre, logo ni textos en la página.

## Tokens (ya definidos en `:root` de la plantilla)

| Token | Valor | Uso |
|---|---|---|
| fondo | `#0a0e17` | body, fondo de escena y niebla |
| `--panel` | `rgba(13,18,32,.77)` + `backdrop-filter: blur(8px)` | todos los paneles y tarjetas |
| `--ink` / `--ink2` / `--muted` | `#eef2fa` / `#cfd6e8` / `#8f9ab3` | texto principal / secundario / etiquetas |
| `--lin` | `#ffb454` (ámbar) | longitudes y magnitudes lineales: y, s, a_l |
| `--ang` | `#7fe3ff` (cian) | ángulos: θ, ω, α; también el título |
| `--rad` | `#b59dff` (violeta) | radio r y geometría |
| `--ok` / `--no` | `#7dffb0` / `#ff7f8f` | compatible / no compatible |
| tipografía | Outfit (texto, 400–800) + DM Mono (números, unidades, pills de valores) | Google Fonts con respaldo del sistema |

Asigna un color por *tipo de magnitud* y úsalo igual en tarjetas, etiquetas 3D, tablas, gráficas, sonoscopio y tablero del fondo. Para otras prácticas: fuerza → ámbar, ángulos → cian, distancias/brazos → violeta; si se necesita un cuarto color, verde `#7dffb0` para energía o momentum.

## Composición de pantalla (escritorio ≥ 960 px de ancho y ≥ 700 px de alto)

- **Arriba izquierda**: título `MOVIMIENTO CIRCULAR`-style (Outfit 800, 46 px, cian, sombra) + subtítulo blanco en mayúsculas (20 px), una frase de contexto, fila de 4 tarjetas de lectura (etiqueta mono pequeña, valor mono 19 px de color, unidad), luego un pie de texto dinámico que explica lo que está pasando con números ("La regla bajó y = … y la polea giró θ = …").
- Debajo, la tarjeta del **paso a paso** (se oculta el párrafo de contexto mientras está abierta).
- **Arriba centro**: pills de pie de página: Paso a paso · Proyector · Guía · CSV · Borrar datos · pantalla completa.
- **Arriba derecha**: panel de controles en rejilla de 2 columnas: sliders (etiqueta en mayúsculas + valor mono de color), pills de modo con punto de color, pills de vista, fila de acciones (Soltar primario de color, Reiniciar, ×5, velocidad 1× ¼× ⅒×) y un `<details>` "Avanzado · fuentes de error".
- **Abajo izquierda**: sonoscopio (canvas oscuro con cuadrícula, trazo luminoso del color del modo, marcas t=0, 5, 10…).
- **Abajo derecha**: datos con pestañas (Tabla 1, Tabla 2, Resultados), tabla con encabezados pegajosos, ajuste y gráfica.
- La cámara usa `setViewOffset` para correr el aparato un poco a la derecha en escritorio y hacia abajo en celular.

## Escena 3D (three.js r159, build clásico)

- Iluminación: hemisférica fría/cálida, luz direccional cálida con sombras PCF suaves, contraluz cian, luz puntual ámbar baja, foco cálido sobre el aparato. Tone mapping ACES, exposición ≈1.25 (1.55 en proyector).
- Mesa oscura con **líneas ámbar luminosas** en el borde (rasgo típico de sael), piso oscuro, niebla.
- **Tablero de fondo** con las ecuaciones de la práctica dibujadas en un canvas (textura emisiva tenue), colocado detrás y a la derecha, fuera de la zona del título.
- Portátil sobre la mesa cuya pantalla es la textura del canvas del sonoscopio (se actualiza en vivo) y cable desde el sensor.
- Materiales: aluminio, anodizado oscuro, latón para pesas, acrílico translúcido, caucho oscuro. Modela piezas reconocibles del laboratorio real (fotocompuerta en U con haz rojo y LED, varilla soporte con abrazaderas, polea de radios con garganta…).
- Etiquetas flotantes HTML proyectadas desde anclas 3D: punto de color con brillo + nombre + valor mono en vivo. Marca como `minor` las que sobran en celular.
- Cámara orbital propia: arrastrar gira, rueda o pellizco hace zoom, vistas predefinidas con interpolación de 1.1 s.

## Interacción

- Atajos: Espacio soltar, R reiniciar, 1/2 modo, V vista, G paso a paso, P proyector, ? guía.
- Toasts cortos para confirmaciones y avisos ("No hay movimiento: …").
- Modal "Guía" con el procedimiento de la práctica en lenguaje de la guía y las ecuaciones de incertidumbre.

## Proyector y celular

- `body.proj`: sube tamaños (título 56 px, tarjetas 25 px, tablas 13.5 px, etiquetas 15.5 px), paneles a `rgba(5,8,15,.95)`, `--muted` más claro, trazo del sonoscopio 2.4 px.
- `@media (max-width:960px), (max-height:700px)`: el canvas pasa a 62vh relativo, título 26 px, tarjetas en una sola fila compacta, párrafo y pie ocultos, paneles apilados con margen de 16 px, pills del pie en fila que se envuelve.
