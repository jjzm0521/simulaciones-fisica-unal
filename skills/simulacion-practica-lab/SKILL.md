---
name: simulacion-practica-lab
description: Crea o modifica simulaciones 3D interactivas (un solo archivo HTML, sin internet) de las prácticas de los laboratorios de Física 1 (mecánica) y Física 3 (ondas y óptica) de la UNAL Medellín, dentro del repositorio simulaciones-fisica-unal y con su sistema de diseño (biblioteca de interfaz y de piezas, modos Explorar y Laboratorio con Paso a paso, tema claro y oscuro, proyector, celular). Úsala siempre que el monitor pida una simulación, laboratorio virtual, applet o material interactivo para una práctica (caída libre, plano inclinado, parabólico, Atwood, péndulo, energía, colisiones, resorte, equilibrio, centro de masa, metrología, lentes, ondas…), cuando pida una pieza o equipo nuevo para las simulaciones (polea, fotocompuerta, soporte, rampa…), o cuando se cancele una sesión presencial y haga falta algo para que los estudiantes practiquen, aunque no diga la palabra "simulación".
---

# Simulación de práctica de laboratorio

Construye una página que el estudiante pueda usar solo: primero **explora** el fenómeno, luego hace el **laboratorio** como en la sesión real (mide, llena la tabla, calcula y verifica).

Todo vive en el repositorio `simulaciones-fisica-unal` (en la máquina del monitor: `~/01_Trabajo/Simulaciones monitoría/simulaciones-fisica-unal`). Esta skill dice **qué construir y en qué orden**; el detalle está en el repositorio y manda sobre esta skill:

| Para saber… | Lee |
|---|---|
| Reglas, estructura, cómo empaquetar y probar, estado | `CLAUDE.md` (léelo completo antes de empezar) |
| Qué elementos de interfaz existen y cuándo usar cada uno | `biblioteca/catalogo.html` (ábrelo en el navegador) |
| Qué equipos ya están modelados y cómo crear uno nuevo | `biblioteca/piezas/README.md` |
| Qué instrumentos de medida existen (PhysicsSensor…) y cómo usarlos | `biblioteca/instrumentos/README.md` |
| Cómo se ve una práctica terminada | `fisica-1/movimiento-parabolico/` (la referencia viva) |
| Datos, señales e incertidumbres realistas | `references/fisica-y-datos.md` |
| Ideas por práctica | `references/catalogo-practicas.md` |

## Qué tiene toda simulación

**La animación es lo principal.** La escena 3D ocupa toda la pantalla; el resto (panel, pasos, instrumento, lecturas, rótulos) flota encima en paneles que se pueden ocultar uno por uno o todos a la vez. No es una página de texto con un dibujo: es un montaje que se mira y se manipula, con la información al lado. Si un panel tapa el montaje o lo que se mueve, está mal ubicado. Con todo oculto se tiene que poder seguir usando.

1. **Explorar.** Modo libre para entender el fenómeno en general, más allá del montaje del laboratorio: varios casos (en parabólico: rampa, horizontal, oblicuo, desde el piso), parámetros abiertos, lecturas en vivo sobre la escena, vectores, predicción. Nada se califica. Incluye una lista corta de "ideas para probar".
2. **Laboratorio.** La práctica real, con el montaje y los instrumentos del laboratorio. Dos formas de recorrerlo, con el interruptor **Paso a paso** (no es un tercer modo):
   - *Con guía:* pasos numerados. El patrón es: la idea → montaje y medidas → **medir con el instrumento (ejemplo resuelto)** → el fenómeno en detalle → **tomar datos (el estudiante mide él mismo)** → tus cálculos (escribe sus resultados y la simulación los verifica) → resultados y comparación.
   - *Sin guía:* una sola página con toma de datos y verificación.
3. **Lo que no cambia entre prácticas:** escena a pantalla completa con paneles flotantes, barra *Qué mostrar*, vista limpia, teclado, barra táctil, tema claro y oscuro, modo proyector, celular. Sale de la biblioteca; no se rehace.
4. **Un solo `index.html`** que abre con doble clic, sin internet.

## Flujo

1. **Lee `CLAUDE.md`.** Trabaja en una rama `feat/<tema>`; no hagas push ni merge a `main` sin que te lo pidan.
2. **Lee la guía de la práctica** en `~/01_Trabajo/Monitoria/Guías de laboratorio/*.md` (no va al repositorio: es público). Anota objetivo, montaje, instrumento, qué se mide, columnas exactas de las tablas, ecuaciones e incertidumbres, y contra qué se compara.
3. **Decide y confirma con el monitor** lo que la guía no resuelve (pregunta solo lo que cambie el resultado; lo demás, elige y dilo al entregar):
   - cuántas repeticiones se hacen **de verdad** en la sesión (la guía a veces dice otra cosa);
   - qué mide el estudiante a mano en la simulación y qué se le da;
   - qué casos tendrá Explorar;
   - datos reales del montaje que falten (radios, masas, longitudes). No inventes medidas: pídelas o márcalas como supuestas.
4. **Revisa las piezas.** Lista los equipos del montaje y búscalos en `biblioteca/piezas/README.md`. Los que existan se usan tal cual, con parámetros. Los que falten se crean como pieza nueva **antes** de armar la escena (ver abajo).
5. **Copia `plantilla/practica/`** a `fisica-N/<practica>/` y llena los `TODO`.
6. **Arma el panel con `Lab.ui`**, el montaje con `Lab.piezas` y `Lab.escena.ambiente`, y la medida con `Lab.instrumentos` (primero ejemplo resuelto, después mide el estudiante). Declara parámetros, acciones y teclas; la biblioteca pinta controles, barra táctil e indicador.
7. **Escribe la física** con instantes calculados analíticamente y datos con dispersión realista (`references/fisica-y-datos.md`).
8. **Empaqueta** (`python3 -I ../../herramientas/empaquetar.py src/index.src.html index.html`) y **verifica** (abajo).
9. **Actualiza** la ficha `README.md` de la práctica, el índice de la física y el estado en `CLAUDE.md`.

## Reglas del sistema de diseño

Están completas en `CLAUDE.md` (regla 3). Las que más se rompen:

- **La animación manda:** ningún panel tapa el montaje, lo que cambia en vivo va junto a la escena, el texto del panel es corto y lo secundario va plegado.
- **La práctica declara y la biblioteca pinta.** No escribas a mano el HTML de un control ni copies el de otra práctica.
- **Ningún valor a mano:** ni colores, ni tamaños, ni `style="…"` en el panel. Solo tokens. Colores de la escena: solo en `nucleo/ambiente.js`. Colores de las magnitudes de la práctica: `--mag-*`, y el mismo color para su vector, su lectura y su ecuación.
- **Cada forma significa una cosa:** opción única (elegir una), casilla (mostrar u ocultar), interruptor (cambiar un estado).
- **Un botón `data-principal` por panel:** es el que disparan Espacio, Enter y la barra táctil.
- **Lo que borra trabajo del estudiante avisa y se puede deshacer.**
- **Los instrumentos imitan al real** (PhysicsSensor, calibrador…): son lo único que no usa los tokens ni cambia con el tema. Las piezas tampoco cambian de color con el tema.
- **Si falta un elemento o una pieza, se agrega primero a la biblioteca y al catálogo**, y se avisa para aprobarlo.

## Pieza nueva

Cuando el monitor mande una foto de un equipo o la práctica necesite uno que no existe:

1. Un archivo `biblioteca/piezas/<nombre>.js` con `Lab.piezas.<nombre>(parámetros)` que devuelve `{grupo, anclajes, medidas, …acciones}`. Copia la forma de `fotocompuerta.js`.
2. Metros reales. Origen en su **punto útil** (el haz, el eje, el pie), no en el centro.
3. Anclajes para unirla con otras (dónde se sujeta, dónde actúa) y acciones para lo que sabe hacer (`bloquear`, `girar`…).
4. Si no hay medidas, estímalas de la foto, dilo en la ficha y deja el estado en **borrador**.
5. Ficha en `piezas/README.md` (cómo es, medidas, parámetros, anclajes, qué falta medir) y entrada en el visor del catálogo.
6. Las fotos no van al repositorio.

## Verificación

Sigue "Cómo probar" de `CLAUDE.md`. Como mínimo, antes de entregar:

- Consola sin errores. El empaquetador no avisa de recursos externos.
- **Física con números:** compara un resultado de la simulación con la fórmula a mano. Con el ruido apagado o promediando, el error debe ser pequeño y explicable.
- Recorre Explorar, Laboratorio sin guía y cada paso de la guía; completa los datos y verifica "Tus cálculos" con los valores correctos y con uno malo.
- 1366 px y 375 px; tema claro y oscuro; modo proyector. Nada tapado ni ilegible.
- Teclado: Espacio, flechas, H, P, S, E, L, O, Esc.
- Mira de cerca la señal del instrumento después de una medida: es lo primero que nota el monitor.

El navegador integrado frena las animaciones cuando su panel está oculto: no es un error de la simulación; espera o pide ver el panel.

## Entrega

Di en pocas líneas: qué práctica cubre y dónde quedó; qué datos del montaje son reales y cuáles supusiste (pidiendo el valor); qué piezas usaste y cuáles creaste (en borrador); qué verificaste y qué no (celular o proyector físicos). No hagas commit, push ni merge si no te lo piden.
