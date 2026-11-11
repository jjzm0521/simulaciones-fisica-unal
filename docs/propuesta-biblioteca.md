# Propuesta · Biblioteca de piezas y sistema de diseño

Laboratorios de Física · UNAL Medellín.

> **Documento histórico.** Fue la propuesta inicial; las fases 0 a 2 ya se hicieron. Las reglas vigentes están en [`CLAUDE.md`](../CLAUDE.md), los elementos en [`biblioteca/catalogo.html`](../biblioteca/catalogo.html) y las piezas en [`biblioteca/piezas/README.md`](../biblioteca/piezas/README.md). De aquí siguen abiertas las preguntas de la última sección.

## El problema

Hoy cada simulación hace todo desde cero: su propia mesa, su propia esfera, su propia fotocompuerta, sus propios botones. Por eso:

- la misma pieza se ve distinta en dos prácticas (y hay que arreglarla dos veces),
- cada persona (o cada agente de IA) inventa un estilo nuevo,
- cuesta saber qué está aprobado y qué no.

**La idea:** construir cada cosa **una sola vez**, bien hecha y aprobada, y que todas las simulaciones la usen. Si mañana se corrige la fotocompuerta, se corrige en un solo lugar.

## Las cuatro capas

```
biblioteca/
├── nucleo/       motor 3D y cámara              (three r159, camara.js)        ← ya existe
├── interfaz/     el diseño aprobado              (colores, paneles, botones)     ← sale del parabólico
├── piezas/       los equipos del laboratorio     (fotocompuerta, rampa, esfera…)
└── fisica/       cálculos y datos                (incertidumbre, señales, azar)
```

| Capa | Qué contiene | Quién la cambia |
|---|---|---|
| **Núcleo** | three.js r159, cámara con zoom al cursor, fuentes | Rara vez; solo si se cambia de motor |
| **Interfaz** | Lo aprobado en parabólico: colores, tipografía, paneles flotantes, barra *Qué mostrar*, vista limpia, teclado, control táctil, modos Explorar / Laboratorio / Paso a paso | Con aprobación del equipo |
| **Piezas** | Un archivo por equipo: `fotocompuerta.js`, `rampa.js`, `esfera.js`, `mesa.js`, `cinta-metrica.js`, `physics-sensor.js`, `polea.js`, `lente.js`, `banco-optico.js`, `pantalla.js`… | Quien la necesite; se aprueba al revisarla en el catálogo |
| **Física** | `incertidumbre.js` (una cifra significativa), `verificacion.js` (formulario de "Tus cálculos"), `senales.js` (haz, filtros del sensor), `azar.js` (dispersión de datos) | Con revisión de un monitor |

## Cómo es una pieza

Cada pieza es una función que entrega el objeto 3D listo, en **medidas reales (metros)**, con sus **puntos de anclaje** para poder ubicarla:

```js
const fc = Lab.piezas.fotocompuerta({ abertura: 0.06, color: 'amarillo' });
escena.add(fc.grupo);
fc.grupo.position.copy(rampa.anclajes.borde);   // el haz queda justo en el borde de la rampa
fc.bloquear(true);                               // el haz se apaga y el LED cambia de color
```

Cada pieza viene con una **ficha** (`piezas/fotocompuerta.md`):

- foto del equipo real del laboratorio y sus medidas,
- parámetros que acepta y sus valores por defecto,
- anclajes (por ejemplo `haz`, `base`, `borde`),
- estado: *borrador* / *aprobada*, y en qué prácticas se usa.

## El catálogo: dónde se ve y se aprueba

`biblioteca/catalogo.html` es una página que muestra **todas las piezas en 3D**, una por una, con sus controles (se pueden girar y cambiar los parámetros), y **todos los elementos de la interfaz** (botones, paneles, colores, tipografía).

- Es la referencia del equipo: "la fotocompuerta es así".
- Es donde se aprueba una pieza nueva antes de usarla.
- Es lo que lee el agente de IA antes de construir algo.

## Plantilla de práctica

`plantilla/practica/` trae la estructura aprobada ya armada (escena a pantalla completa, paneles flotantes, modos, paso a paso, verificación, teclado, control táctil). Para una práctica nueva:

1. Copiar `plantilla/practica/` a `fisica-1/<practica>/`.
2. Armar el montaje con piezas de la biblioteca.
3. Escribir los pasos, la física y los datos de esa práctica.
4. Empaquetar: `python3 -I ../../herramientas/empaquetar.py src/index.src.html index.html`.

El resultado sigue siendo **un solo HTML que funciona sin internet**: el empaquetador copia adentro las piezas que se usan. Por eso una simulación ya entregada no se daña si después cambia una pieza; para actualizarla basta con volver a empaquetarla.

## Cómo lo usa el agente de IA

La skill (`skills/simulacion-practica-lab/SKILL.md`) se actualiza con tres reglas:

1. **Antes de modelar algo, buscar en `biblioteca/piezas/`.** Si existe, usarla tal cual (con parámetros, sin copiarla ni rediseñarla).
2. **Si no existe**, crearla como pieza nueva con su ficha, marcarla *borrador* y mostrarla en el catálogo para aprobación.
3. **La interfaz siempre sale de `biblioteca/interfaz/`**: nada de estilos propios.

## Estructura de carpetas (la de esta rama)

```
simulaciones-fisica-unal/
├── README.md                 qué hay y cómo trabajar
├── fisica-1/                 Física Mecánica · 13 prácticas
│   ├── README.md             índice con el estado de cada práctica
│   ├── movimiento-parabolico/
│   │   ├── index.html        la simulación lista (la que se envía)
│   │   ├── src/              la fuente editable
│   │   ├── README.md         ficha de la práctica
│   └── … (una carpeta por práctica, todas con la misma forma)
├── fisica-3/                 Ondas y óptica
├── biblioteca/               núcleo, interfaz, piezas, física, catálogo
├── plantilla/                plantilla de práctica (fase 1)
├── herramientas/             empaquetar.py
├── docs/                     esta propuesta y decisiones
└── skills/                   instrucciones para el agente de IA
```

## Plan por fases

| Fase | Qué se hace | Resultado |
|---|---|---|
| **0** · hecho | Organizar carpetas; motor y cámara en `biblioteca/nucleo` | Esta rama |
| **1** · hecho | Sacar la interfaz aprobada del parabólico a `biblioteca/interfaz/` y armar `plantilla/practica/` | Diseño aprobado reutilizable |
| **2** | Sacar las piezas del parabólico (mesa, rampa, esfera, cinta, sensor) y **rehacer la fotocompuerta** con fotos y medidas reales; armar `catalogo.html` | Primeras piezas aprobadas |
| **3** | Rehacer parabólico usando la biblioteca y comprobar que se ve y funciona igual | Prueba de que el sistema sirve |
| **4** | Pasar lente (F3) al diseño aprobado; sacar sus piezas (lente, banco óptico, pantalla) | F1 y F3 con el mismo diseño |
| **5** | Prácticas nuevas desde la plantilla | Cada práctica nueva es más rápida |

## Lo que necesitamos decidir

1. **Lista de prácticas de Física 3** (para crear sus carpetas) y **número oficial** de cada práctica de Física 1.
2. **Fotos y medidas reales** de los equipos (empezando por la fotocompuerta, la rampa y la esfera).
3. **Quién aprueba** una pieza o un cambio de interfaz (¿el profesor, un monitor responsable?).
4. Si la skill vive en un solo lugar: hoy hay dos copias (`skills/` y `.gemini/skills/`) y ya no son iguales.
