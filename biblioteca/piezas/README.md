# Piezas del laboratorio

Los equipos reales, modelados **una sola vez**. Toda simulación que necesite uno lo toma de aquí, con parámetros; no se vuelve a modelar ni se copia. Se ven en 3D en [`../catalogo.html`](../catalogo.html) (sección *Piezas*).

## Reglas

1. **Antes de modelar algo, busca aquí.** Si existe, úsalo tal cual y cambia solo sus parámetros.
2. **Unidades en metros, medidas reales.** Si en una escena hay que exagerar algo para que se vea, se exagera con un parámetro y se dice en la ficha de la práctica.
3. **Cada pieza es una función** `Lab.piezas.<nombre>(parámetros)` que devuelve `{grupo, anclajes, medidas, …acciones}`.
   - `grupo`: el `THREE.Group` listo para `escena.add`.
   - `anclajes`: puntos (en coordenadas del grupo) para unirla con otras piezas.
   - acciones: lo que la pieza sabe hacer (`bloquear`, …).
4. **El origen de la pieza es su punto útil** (el haz de la fotocompuerta, el pie de la varilla), no su centro geométrico: así se ubica con una sola línea.
5. **Pieza nueva = archivo + fila en esta tabla + aparece en el catálogo**, con estado *borrador* hasta que alguien la compare con el equipo real.
6. Las fotos de referencia no van al repositorio (es público). Se describen aquí con palabras y medidas.

## Piezas

| Pieza | Archivo | Estado | Se usa en |
|---|---|---|---|
| Soporte universal | [`soporte.js`](soporte.js) | Borrador · medidas estimadas de foto | Movimiento parabólico |
| Fotocompuerta | [`fotocompuerta.js`](fotocompuerta.js) | Borrador · medidas estimadas de foto | Movimiento parabólico |
| Polea con prensa | [`polea.js`](polea.js) | Borrador · rueda con medidas reales; prensa estimada de foto | (Atwood, Segunda ley, Movimiento circular) |
| Carrito de colisiones | [`carrito.js`](carrito.js) | Borrador · modelo por confirmar con foto; medidas estimadas | (Colisiones, Segunda ley) |
| Regla cebra | [`regla-cebra.js`](regla-cebra.js) | Borrador · paso y número de franjas reales; resto estimado de foto | (Caída libre, Movimiento circular) |

Pendientes (salen de parabólico o de fotos por llegar): mesa, rampa, esfera, cinta métrica, computador con PhysicsSensor, pista del carrito.

## Soporte universal

Lo que sostiene casi todo: fotocompuerta, péndulo, resorte, polea.

- **Cómo es:** placa de hierro fundido negra, rectangular, con la varilla de acero entrando cerca de un extremo. A media altura, una **nuez doble** (bloque metálico con dos mariposas) une la varilla con un **brazo** horizontal más delgado. De la punta del brazo cuelga la otra pieza.
- **Medidas (estimadas):** placa 22 × 14 × 1,4 cm · varilla Ø 10 mm, 60 cm · brazo Ø 8 mm.
- **Origen:** pie de la varilla sobre la mesa.
- **Parámetros:** `alto`, `alturaNuez`, `brazo` (0 = solo base y varilla), `direccion` del brazo, `base` (hacia dónde se extiende la placa).
- **Anclajes:** `brazo` (punta), `nuez`, `cima`.
- **Por medir en el laboratorio:** placa, diámetros, largo real de varilla y brazo.

## Fotocompuerta

- **Cómo es:** cuerpo amarillo impreso en 3D con forma de **C**: un lomo largo, dos brazos y dos mordazas que se miran; en una va el emisor y en la otra el receptor. Sobre el lomo, un bloque por donde pasa el brazo del soporte y se aprieta con un tornillo. Lleva una calcomanía blanca con su número (7a). El cable sale hacia el computador.
- **Medidas (estimadas):** ancho total 15 cm · alto 10 cm (sin el bloque de sujeción) · grosor 2,4 cm · abertura entre mordazas 7 cm.
- **Origen:** centro del haz. El haz va a lo largo de Z; el lomo queda arriba.
- **Parámetros:** `abertura`, `alto` (del haz al lomo), `color`, `etiqueta`.
- **Anclajes:** `haz`, `sujecion`.
- **Acciones:** `bloquear(true|false)` atenúa el haz y cambia el LED.
- **Por medir:** todas las medidas; posición real del emisor; si tiene LED visible.
- **Nota de uso:** en movimiento parabólico la rampa se dibuja más ancha que la real, así que se pide `abertura: 0.108` para que la abrace. Con la rampa a escala real se usaría la abertura por defecto.

## Polea con prensa

La de las prácticas de Segunda ley, Movimiento circular y Atwood: **PASCO Super Pulley con prensa (ME-9448B)**.

- **Cómo es:** rueda negra de plástico con **10 radios** (los que corta el haz de la fotocompuerta en Movimiento circular) y garganta para la cuerda. Gira en un eje de acero **sostenido por los dos lados**: el brazo es una horquilla en U que abraza la rueda (un brazo delante y otro detrás, unidos del lado de la prensa). La horquilla atraviesa una **prensa en C** que muerde el borde de la mesa: mordaza arriba, tornillo de perilla por debajo; una perilla lateral fija el brazo.
- **Medidas:** diámetro exterior 5,1 cm (fabricante) · **radio por donde pasa la cuerda r = 2,465 cm** (dato de los monitores; es el "radio externo r" de las guías) · garganta de 15 cm de circunferencia según el fabricante (r ≈ 2,39 cm) · masa de la rueda ≈ 5 g (fabricante). Brazo, prensa y ancho de la rueda: estimados de foto.
- **Origen:** eje de la rueda. La rueda gira en el plano XY; la mesa queda hacia −X; la horquilla y la prensa quedan centradas en la rueda (Z = 0).
- **Parámetros:** `diametro`, `radio` (de la cuerda), `radios`, `grosor`, `brazo`, `mesaY` (superficie de la mesa sobre el eje), `mesaGrosor`, `color`.
- **Anclajes:** `eje`, `arriba` (donde llega la cuerda horizontal), `bajada` (donde sale la vertical), `mesa` (esquina del borde que muerde la prensa).
- **Acciones:** `girar(ángulo)`, `girarPorLongitud(x)` (= x / r), `angulo()`, `cuerda(desde, hasta)` (línea que siempre llega y sale tangente a la garganta, con el arco sobre la rueda; `actualizar(desde, hasta)` en cada cuadro) y `trayectoriaCuerda(desde, hasta)` (solo los puntos). Puntos en coordenadas del mundo.
- **Radios y fotocompuerta:** el radio k está en el ángulo 2πk/10 de la rueda; pasa un radio por el haz cada 2π·r/10 = 1,549 cm de cuerda. `instantesHaz({a, v0, ang0, rb, beta, tMax})` da los instantes **exactos** (sin muestrear) en que cada radio entra y sale del haz cuando la cuerda acelera con a (x = v0·t + ½·a·t² → θ = x / r): con eso se arma la señal del PhysicsSensor de Movimiento circular y de Segunda ley. `angulosHaz(haz, a0, a1)` da los mismos intervalos en ángulo y `radioEnHaz(haz)` si está tapado ahora. El haz se describe con `rb` (distancia al eje, entre `medidas.radioHazMin` y `radioHazMax`) y `beta` (ángulo; por defecto debajo del eje, anclaje `haz`). Ancho del radio: 3,2 mm (estimado: medir).
- **Por medir:** ancho de los radios (cambia cuánto dura cada interrupción del haz), largo del brazo, altura del eje sobre la mesa, ancho de la rueda, abertura máxima de la prensa; contar los radios en la polea real.

```js
const po = Lab.piezas.polea();
escena.add(po.grupo);
po.grupo.position.copy(bordeDeLaMesa).sub(po.anclajes.mesa);
po.girarPorLongitud(x);           // la cuerda avanzó x
const c = po.cuerda(carrito, pesa); escena.add(c.linea);
c.actualizar(carrito, pesa);      // en cada cuadro: sigue tangente aunque se muevan
```

## Carrito de colisiones

**Modelo por confirmar (falta foto).** Según el monitor: el de baja fricción para colisiones, de cuerpo **gris** con los **extremos negros**.

- **Cómo es:** cuerpo gris con bandeja arriba para barras de masa. Cuatro ruedas de filo. En un extremo, un **tope negro con resorte e imanes** adentro (choques elásticos); en el otro, **velcro** para que un carro se pegue al de atrás (choques inelásticos). Si resulta ser el PASCO PAScar (rojo o azul, con émbolo de 3 posiciones), se usa `color:'rojo'` y `conEmbolo:true`.
- **Medidas:** largo 17,5 cm, ancho 7,7 cm, alto 4,5 cm, rueda Ø 2,4 cm: **estimadas**.
- **Origen:** centro del carrito sobre la pista (y = 0). Tope con imanes hacia +X; velcro hacia −X.
- **Parámetros:** `color` ('gris' | 'rojo' | 'azul'), `largo`, `ancho`, `alto`, `masas` (0 a 2 barras, visual), `conEmbolo`, `embolo` (0 a 3).
- **Anclajes:** `frenteImanes`, `frenteVelcro`, `frenteEmbolo`, `enganche` (para la cuerda), `arriba` (bandeja).
- **Acciones:** `rodar(dx)` (las ruedas giran dx / radio), `embolo(n)`.
- **Por medir:** foto del carrito real, todas las medidas, masa del carrito y de las barras.

## Regla cebra

Dos tipos, casi del mismo largo, con **15 franjas separadas 1 cm** (dato de los monitores):

- **Acrílico con cauchitos:** placa transparente **entera** (solo el agujero de la cuerda), con muescas en los bordes donde van 15 ligas de colores. Cada **cauchito tapa** el haz; el acrílico lo deja pasar.
- **Metal ranurado:** lámina de acero un poco más ancha con 15 ranuras. El **metal tapa** el haz; cada **ranura** lo deja pasar.
- **Medidas:** paso 1 cm y 15 franjas (dato). Ancho 2,5 cm (acrílico) y 3,2 cm (metal), largo 18,5 cm, primera franja a 2,5 cm del agujero, cauchito de 1,8 mm, ranura de 3 mm: **estimados**.
- **Origen:** agujero de la cuerda. La regla baja a lo largo de −Y; el haz la cruza a lo largo de Z.
- **Parámetros:** `tipo` ('acrilico' | 'metal'), `n`, `paso`, `primera`, `ancho`, `largo`, `franja`, `ranura`.
- **Para el sensor:** `franjas` (distancias de cada franja bajo el agujero), `tapaEn(d)` e `intervalosTapados()`: con la caída x(t) se obtienen los instantes exactos de cada interrupción, igual que con los radios de la polea.
- **Por medir:** ancho y largo reales, distancia del agujero a la primera franja, ancho de las ranuras del metal y de los cauchitos.

## Montaje típico: fotocompuerta en su soporte

```js
const fc = Lab.piezas.fotocompuerta({etiqueta:'7a'});
fc.grupo.position.set(x, y, z);                          // el haz pasa por (x, y, z)
const sj = fc.anclajes.sujecion;                          // a qué altura queda el bloque
const sp = Lab.piezas.soporte({alturaNuez: y + sj.y - alturaMesa, brazo: 0.16, direccion: 'z+'});
sp.grupo.position.set(x, alturaMesa, z - 0.16);          // el brazo llega justo al bloque
escena.add(fc.grupo, sp.grupo);
```
