# Física, señales y tratamiento de datos

La simulación tiene que producir datos que se comporten como los del laboratorio: con ruido, con errores sistemáticos explicables y con el mismo tratamiento de la guía. Si los datos salen "perfectos" o con errores sin explicación, el monitor no la puede usar para enseñar.

## Modelo y eventos

- Escribe el modelo físico cerrado (p. ej. Atwood: a = [(m₂ − m₁)g − f] / (m₁ + m₂ + I/r_g²); g de Medellín: usa el valor de la guía de esa práctica (parabólico usa 9,77 m/s²)) y calcula los **instantes de los eventos analíticamente** (t = √(2s/a), etc.), no integrando cuadro a cuadro. La animación solo reproduce esos instantes.
- Genera cada lanzamiento como un objeto `trial` con: aceleración, condición inicial, `starts[]`/`ends[]` de cada interrupción del haz (sin ruido, para la animación y la señal), `tRel[]` (tiempos con ruido gaussiano relativos al primer evento, para la tabla) y `tEnd`.
- Prepara el siguiente lanzamiento (`pending`) al reiniciar, para que la pose en reposo coincida con lo que va a pasar.
- **Condición inicial casi fija**: en el laboratorio se suelta "siempre desde la misma posición". Usa una posición base con poca dispersión (±0.5 mm, ±0.7°). Si alguna vez se promedian lanzamientos, una fase inicial totalmente aleatoria mezcla velocidades iniciales distintas y sesga la regresión.
- Comprueba alineación visual: el borde del objeto debe llegar al haz justo en el instante del evento.

## Señales del instrumento (lo que el monitor reconoce de inmediato)

En parabólico la señal del PhysicsSensor se calcula con la geometría (fracción del haz que tapa la esfera, más los filtros del fotodiodo y de la entrada de audio): míralo en `fisica-1/movimiento-parabolico/src/index.src.html` antes de inventar otra forma. En el paso de ejemplo los cursores salen puestos; en la toma de datos los mueve el estudiante y se acepta la medida si queda cerca del valor real.

- **Objetos discretos** (cauchitos de la regla-cebra, esfera que cruza, franjas): base plana con un pico gaussiano estrecho por evento, ancho ≈ 0.1 × duración de la interrupción, **todos con la misma polaridad**. Elige la polaridad al azar por lanzamiento (en el laboratorio sale hacia arriba o hacia abajo según la conexión).
- **Patrón continuo** (radios de polea en giro, rueda dentada): `cos(2π·(φ(t) − φ₀)/paso)`, una onda casi sinusoidal cuyo período se acorta si acelera. Los máximos coinciden con los eventos de la tabla.
- Ruido muy pequeño en el trazo (±1.5 %), ventana de tiempo desde un poco antes del primer evento hasta un poco después del último, marcas numeradas (t=0, 5, 10…), lectura "picos: n · tₖ = … ms".

## Tablas

- Reproduce las columnas de la guía, pero con el número de lanzamientos que se hace **de verdad** en la sesión (pregúntalo). Práctica 8: un solo lanzamiento por tabla → columnas k, posición, t, u_t; soltar de nuevo reemplaza la tabla.
- Sonoscopio = tarjeta de sonido a 44 100 Hz: redondea cada tiempo a múltiplos de 1/44100 s y usa u_t = 1/44100 s ≈ 0.023 ms. El ruido extra del cronometraje por defecto es pequeño (≈0.02 ms).
- Solo si la práctica realmente repite (p. ej. alcances en parabólico o colisiones, donde la guía pide 5 lanzamientos y sí se hacen): columnas por repetición, promedio y u = s/√n.
- Posiciones con las unidades y la resolución reales (y = k·1.00 cm; θ = k·π/5 rad).
- Si cambian los parámetros del montaje con datos ya tomados, los datos se borran y se ofrece deshacer (`Lab.ui.aviso`).

## Regresión e incertidumbre

- Mínimos cuadrados (lineal o cuadrática según la guía) con matriz de covarianza: u(coef) = √(s²·(XᵀX)⁻¹ᵢᵢ), s² = SSR/(n − p). Muestra R².
- Traduce coeficientes como la guía: a = 2A, u_a = 2u_A; propagación para cantidades derivadas (u_aT = √((r u_α)² + (α u_r)²)).
- Redondeo: incertidumbre con **una** cifra significativa y el valor a la misma posición decimal, con coma decimal. Usa `Lab.fisica.pair(v, u)`; para validar lo que escribe el estudiante, `Lab.fisica.num`, `decs` y `cifras`.
- %Error = |VCV − Vexp| / VCV × 100 y además el número de incertidumbres combinadas que separan los valores (≤ 2: compatibles). Barra de color verde/ámbar/rojo.
- Sección plegable "Para el monitor · valores del modelo" con los valores exactos.

## Fuentes de error

Incluye solo las que tienen sentido físico para la práctica y explícalas en una frase (fricción, radio efectivo de una polea, resolución de la regla, paralaje, apreciación del programa). Por defecto, pequeñas pero visibles (alrededor de 1 % de error), para que el % de error tenga explicación.

## Exportar

CSV con BOM UTF-8, separador `;`, coma decimal, parámetros del montaje arriba, luego cada tabla y los resultados.
