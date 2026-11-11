# Instrumentos

Los programas y aparatos de medida que el estudiante **lee o maneja** (no los que se montan en la mesa: esos son [piezas](../piezas/README.md)). Se ven funcionando en [`../catalogo.html`](../catalogo.html).

## Reglas

1. **Un instrumento imita al real**: su tipografía, sus colores y sus textos. Es lo único que no usa los tokens ni cambia con el tema claro u oscuro.
2. **Va dentro de una ventana del sistema** (`Lab.ui.ventana`): se arrastra, se pliega y se cierra igual en todas las prácticas.
3. **La práctica decide qué mostrar; el instrumento decide cómo se ve.** La práctica nunca dibuja dentro del instrumento.
4. **La nota bajo la ventana** explica, con palabras del curso, qué se está viendo. La pone la práctica (`.nota(texto)`).
5. **Dos formas de usarlo en toda práctica:** primero un *ejemplo resuelto* (la medida ya hecha) y después *el estudiante mide*. Si lo que mide queda lejos del valor real, no se registra y se le explica cómo corregir.
6. Instrumento nuevo = archivo + ficha aquí + demostración en el catálogo.

## Instrumentos

| Instrumento | Archivo | Estado | Se usa en |
|---|---|---|---|
| PhysicsSensor · Sonograma (el "sonoscopio") | [`physics-sensor.js`](physics-sensor.js) | Listo | Movimiento parabólico |

Pendientes: calibrador (pie de rey), tornillo micrométrico, cinta métrica legible, cronómetro, balanza.

## PhysicsSensor · Sonograma

Ventana del programa PhysicsSensor 1.1 de la UNAL: muestra la señal de la fotocompuerta y mide tiempos con dos cursores verticales. Apreciación 1/3648 s ≈ 2,74×10⁻⁴ s; los tiempos salen en múltiplos de ella.

```js
const ps = Lab.instrumentos.physicsSensor('#scopeWrap', {
  alCerrar: () => ocultarVentana(),
  alMover: (a, b) => actualizarLectura()          // el estudiante movió un cursor
});

// 1. Ejemplo resuelto: señal + cursores ya puestos
ps.senal(Lab.senales.esferaEnHaz({d: 0.016, tau: 0.0134}));
ps.cursores(0, 0.0134);
ps.barrer();                                       // animación de captura

// 2. El estudiante mide: cursores lejos del pulso, que él arrastra
const c = ps.cursoresIniciales();
ps.cursores(c.a, c.b, {mover: true});
…
const medido = ps.intervalo();                     // en múltiplos de la apreciación
if(Math.abs(medido - real) > 0.15 * real) avisarQueCorrija(); else registrar(medido);
```

- **Tiempo:** t = 0 es el inicio del evento (donde la señal empieza a subir). La ventana lo centra sola.
- **Contenedor:** un `<div id="scopeWrap" hidden></div>` vacío; el instrumento pone todo adentro.
- **Botones + Ey, − Ey, + Ex, − Ex:** escalas, como en el programa. En celular solo aparecen mientras el estudiante mide.

### Señales (`Lab.senales`)

Una señal es `{duracion, muestras(T, t1, n)}`. Hechas:

| Señal | Para qué | Forma |
|---|---|---|
| `esferaEnHaz({d, tau})` | Una esfera cruza el haz | Sube rápido, meseta casi plana, baja con una cola pequeña. τ va del inicio de la subida al inicio de la bajada |

Por hacer cuando una práctica las pida: regla-cebra (picos estrechos, uno por franja), polea de radios (onda cuyo período se acorta), péndulo (pulsos repetidos). Se agregan en `physics-sensor.js`, junto a `esferaEnHaz`, con la misma firma. La forma de cada una está descrita en `skills/simulacion-practica-lab/references/fisica-y-datos.md`.
