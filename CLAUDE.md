# CLAUDE.md · Guía para agentes

Lee esto antes de tocar el repositorio. Aplica a cualquier agente (Claude, Gemini/Antigravity, Codex…). Si algo de aquí choca con `skills/simulacion-practica-lab/` o con documentos viejos, **manda este archivo**.

## Qué es

Simulaciones 3D interactivas de los laboratorios de física de la **Universidad Nacional de Colombia, Sede Medellín**, hechas por los monitores para que los estudiantes practiquen, preparen la sesión o estudien solos. Hay dos cursos: **Física 1** (Física Mecánica, 13 prácticas) y **Física 3** (ondas y óptica). Todo el texto para el usuario va en **español**.

## Reglas que no se negocian

1. **Cada simulación es un solo archivo `index.html` independiente.** Funciona con doble clic, sin servidor, sin internet y sin las demás carpetas del repositorio. Todo lo que use (motor, cámara, interfaz, fuentes, piezas) va copiado adentro al empaquetar. Nunca dejes `<script src>`, `<link href>` ni fuentes que dependan de internet o de rutas locales en el `index.html` final.
2. **Motor único: three.js r159** (build clásico), en `biblioteca/nucleo/three-r159.min.js`. No uses otra versión, módulos ES ni CDNs. La cámara es `THREE.CamaraOrbita` (`biblioteca/nucleo/camara.js`), no `OrbitControls`.
3. **Diseño único: el sistema de `biblioteca/interfaz/`** (nació en movimiento parabólico, F1). Tres archivos: `tokens.css` (colores, letra, espacio, radio), `interfaz.css` (armazón y elementos) e `interfaz.js` (`Lab.ui.*`, genera los elementos). Referencia visual: **`biblioteca/catalogo.html`**; ábrelo antes de construir. Reglas:
   - **La animación es lo principal.** La escena 3D ocupa toda la pantalla y es lo que el estudiante mira; todo lo demás (panel de la práctica, pasos, instrumento, lecturas, rótulos) va en **paneles flotantes** encima de ella, y cada uno **se puede ocultar** (barra *Qué mostrar*, vista limpia). Nunca una página de texto con la animación en un recuadro. Consecuencias: ningún panel tapa el montaje ni lo que se mueve (la cámara se reencuadra según los paneles abiertos); lo que cambia en vivo se muestra junto a la escena, no al fondo del panel; el texto del panel es corto y lo secundario va plegado; con todo oculto la simulación se sigue pudiendo manejar (teclado o barra táctil).
   - **La práctica declara y la biblioteca pinta.** Deslizadores, opciones, casillas, interruptores, lecturas, filas, barra táctil e indicador de teclas se generan con `Lab.ui.*`; no escribas su HTML a mano ni copies el de otra práctica.
   - **Ningún valor a mano**: ni colores, ni tamaños de letra, ni radios, ni `style="…"` en el HTML del panel. Solo tokens. Los colores de las magnitudes de la práctica se redefinen con `--mag-*`.
   - **Cada forma tiene un significado**: opción única (elegir una), casilla (mostrar/ocultar), interruptor (cambiar un estado). Un solo botón `data-principal` por panel: es el que disparan Espacio, Enter y la barra táctil.
   - **Lo que borra trabajo del estudiante avisa y se puede deshacer** (`Lab.ui.aviso`).
   - **Si falta un elemento, se agrega primero a la biblioteca y al catálogo**, y se avisa para aprobarlo. No inventes estilos propios ni copies los de otros sitios.
4. **Incertidumbres con una cifra significativa** y el valor redondeado a la misma posición decimal; coma decimal. Usa `Lab.fisica.pair(v, u)` de `biblioteca/fisica/incertidumbre.js`.
5. **Física correcta antes que bonita.** Verifica con números (fórmula contra simulación) antes de entregar. Datos con dispersión realista, como en el laboratorio.
6. **Las guías de laboratorio NO van al repositorio** (es público en GitHub). Están en la máquina del monitor: `~/01_Trabajo/Monitoria/Guías de laboratorio/*.md`. Léelas de ahí; en el repo solo se resume con palabras propias lo necesario.

## Estructura

```
fisica-1/<practica>/      una carpeta por práctica (13), índice en fisica-1/README.md
fisica-3/<practica>/      índice en fisica-3/README.md
  ├── index.html          ENTREGA: el archivo que se envía (generado, no se edita a mano)
  ├── src/index.src.html  FUENTE: lo que se edita
  ├── README.md           ficha: estado, guía, decisiones
  ├── guia/  archivo/     PDF de la guía y versiones anteriores (opcionales)
biblioteca/               lo compartido (ver biblioteca/README.md)
  ├── nucleo/             three-r159.min.js, camara.js, rotulos.js (rótulos legibles a cualquier distancia), ambiente.js (fondo, luces, piso y rejilla por tema)
  ├── fuentes/            fuentes.css (Bricolage Grotesque, IBM Plex Sans/Mono, incrustadas)
  ├── interfaz/           tokens.css, interfaz.css, interfaz.js  ← sistema de diseño
  ├── catalogo.html       todos los elementos, con su uso (referencia del equipo y del agente)
  ├── fisica/             incertidumbre.js
  └── piezas/             equipos del laboratorio: soporte.js, fotocompuerta.js (fichas y reglas en piezas/README.md)
plantilla/practica/       punto de partida para cualquier práctica nueva
herramientas/             empaquetar.py, empaquetar-todo.py
docs/                     propuestas y decisiones (docs/propuesta-biblioteca.md)
skills/                   skill del agente (qué construir y en qué orden; remite a este archivo)
```

## Cómo se arma

La fuente marca lo compartido con `data-inline` y el empaquetador lo copia adentro:

```html
<link rel="stylesheet" data-inline="../../../biblioteca/interfaz/interfaz.css">
<script data-inline="../../../biblioteca/nucleo/three-r159.min.js"></script>
```

```bash
# una práctica (desde su carpeta)
python3 -I ../../herramientas/empaquetar.py src/index.src.html index.html
# todas (desde la raíz), obligatorio después de cambiar algo en biblioteca/
python3 -I herramientas/empaquetar-todo.py
```

El empaquetador avisa si quedan recursos externos: ese aviso es un error que hay que corregir.

## Flujo para una práctica nueva

1. Lee la guía local (regla 6) y la ficha `README.md` de la carpeta de la práctica.
2. Copia `plantilla/practica/` a `fisica-N/<practica>/` y llena los `TODO`.
3. **Antes de modelar un equipo, lee `biblioteca/piezas/README.md`** (y míralo en 3D en `biblioteca/catalogo.html`). Si la pieza existe, úsala igual y cambia solo sus parámetros; no la copies ni la rediseñes. Si no existe (y mientras la carpeta crece, mira `fisica-1/movimiento-parabolico/src/`), créala como pieza nueva: archivo propio, metros reales, origen en su punto útil, parámetros y anclajes, fila en el README, visible en el catálogo, estado *borrador*; y avisa para que se apruebe.
4. Arma el panel con los elementos de `Lab.ui` (catálogo). Lo que aún no está en la biblioteca (ventana del PhysicsSensor, tabla de datos, "Tus cálculos" con verificación) se toma de `fisica-1/movimiento-parabolico/src/index.src.html` usando sus mismas clases, hasta que pase a la biblioteca.
5. Empaqueta, prueba y actualiza la ficha y el índice de la física.

## Cómo probar

- Servidor local que sirva la carpeta padre del repo, por ejemplo `python3 -m http.server 8765 --directory ".."` desde la raíz (en la máquina del monitor ya existe la configuración `simulaciones` en `~/01_Trabajo/Monitoria/.claude/launch.json`); URL: `http://localhost:8765/simulaciones-fisica-unal/<ruta>/index.html`. También se puede abrir el `index.html` directo con doble clic.
- Consola sin errores; física verificada con números; incertidumbres con una cifra significativa.
- Sin paneles superpuestos en anchos de 360 a 1440 px (computador, celular), en Explorar, Laboratorio y Paso a paso, con y sin panel, y en vista limpia.
- Teclado: Espacio hace la acción principal, flechas cambian parámetros, H vista limpia, P panel, S sensor, E rótulos, L letra grande (proyector), O tema claro/oscuro, Esc sale.
- Modo proyector (L) y celular (375 px): nada tapado, botones de al menos 44 px en táctil, letra mínima 12 px.
- El navegador integrado frena las animaciones cuando su panel está oculto (1 cuadro/s): no es un error de la simulación.

## Git y equipo

- `main` es lo aprobado. Trabaja en ramas `feat/<tema>`; **no hagas push ni merge a `main` sin que el usuario lo pida**. No toques ramas de otras personas.
- Los compañeros a veces suben archivos desde la web de GitHub: antes de unir, haz `git fetch` y revisa que no haya cambios nuevos.
- Mensajes de commit en español, claros, con el porqué.

## Estado actual (actualízalo cuando cambie)

- **Lista con el diseño aprobado:** `fisica-1/movimiento-parabolico`.
- **Lista con diseño anterior:** `fisica-3/lente-convergente` (pasarla al diseño aprobado; sus fuentes aún cargan de internet).
- **Hecho de la biblioteca:** núcleo, fuentes, incertidumbre, plantilla, empaquetar-todo; sistema de diseño v2 (tokens, elementos `Lab.ui`, catálogo, modo proyector, rótulos legibles) con parabólico y la plantilla ya migrados.
- **Falta pasar a la biblioteca:** ventana de instrumento + PhysicsSensor, tabla de datos, verificación de "Tus cálculos", armazón declarativo (modos y pasos). Tema claro/oscuro hecho: `html.oscuro` en tokens.css, `Lab.ui.tema`, botón Tema (O) y `Lab.escena.ambiente`; toda práctica nueva debe llamar a `ambiente` y repintar sus rótulos en `Lab.ui.alCambiarTema`. PhysicsSensor y piezas no cambian de color. Pendiente: pasar lente-convergente.
- **Piezas hechas (borrador, medidas estimadas de foto):** soporte universal (base, varilla, nuez, brazo) y fotocompuerta en C; parabólico ya las usa.
- **Siguiente:** medir en el laboratorio soporte y fotocompuerta; polea (falta foto); sacar de parabólico mesa, rampa, esfera, cinta y computador.
- **Pendiente del equipo:** lista de prácticas de Física 3, número oficial de cada práctica de F1, fotos y medidas de equipos, quién aprueba piezas.
- **Skill:** una sola copia en `skills/simulacion-practica-lab/` (`.gemini/skills/` solo remite a ella). Si cambian las reglas de este archivo, revisa que la skill no las contradiga. El monitor la tiene instalada aparte en `~/.claude/skills/`: hay que volver a copiarla cuando cambie.
