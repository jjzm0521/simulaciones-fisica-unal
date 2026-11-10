# Práctica N° 7: Movimiento parabólico · Simulación 3D
### Laboratorio de Física Mecánica · Universidad Nacional de Colombia (Sede Medellín)

Simulación 3D de la práctica de movimiento parabólico, ambientada en un laboratorio de física: mesa de trabajo con rampa de acrílico azul, fotocompuerta, cinta métrica en el piso, computador con el programa PhysicsSensor, estantería con material de física y mueble con cajones de vidrio.

## Cómo abrirla

1. Doble clic en `INICIAR_SIMULACION.bat`, o abre `index.html` con Chrome, Edge o Firefox.
2. **No necesita internet**: el motor 3D (three.js r159, el mismo de las demás prácticas), la cámara y las fuentes van dentro del archivo.

## Modos

- **Explorar**: modo libre con cuatro tipos de lanzamiento: rampa del montaje (V₀ₓ por fotocompuerta y por parábola), horizontal desde la mesa, oblicuo desde la mesa y desde el piso (ángulo θ y rapidez V₀). Muestra trayectoria prevista, vectores de velocidad, tiempo de vuelo, alcance, altura máxima y velocidad al llegar. Incluye la opción de invertir los ejes y una lista de ideas para probar.
- **Laboratorio**: se toman los cinco lanzamientos y el estudiante escribe sus resultados (promedios, velocidades con su incertidumbre y % de error); la simulación los verifica y puede mostrar la solución.
- **Paso a paso** (botón en Laboratorio, opcional): la guía de siete pasos de abajo.

## Pasos de la práctica

1. **La idea**: dos formas de medir la velocidad de salida V₀ₓ. Aquí se ajustan los parámetros del montaje: diámetro de la esfera d (12–25 mm), altura de la mesa H (70–115 cm) y altura de la rampa h (5–25 cm). Al cambiarlos se regeneran los datos y todos los resultados se calculan con los nuevos valores.
2. **Montaje**: altura H, diámetro d y altura de la rampa h, con su incertidumbre; marco de referencia. El haz de la fotocompuerta está justo en el borde de la rampa (x = 0), a la altura del centro de la esfera.
3. **Medir τ**: la esfera interrumpe el haz al salir de la rampa. En el sonograma del PhysicsSensor τ se mide con los cursores entre el punto donde la gráfica empieza a subir y el punto donde empieza a bajar (no todo el ancho del pulso).
4. **Vuelo**: movimiento horizontal uniforme y vertical acelerado.
5. **Tomar datos**: cinco lanzamientos y tabla de alcance D y tiempo τ.
6. **Tus cálculos**: el estudiante ingresa sus resultados y la simulación los verifica (valor, incertidumbre con una cifra significativa y redondeo).
7. **Resultados**: promedios, V₀ₓ con la fotocompuerta y con la parábola, y porcentaje de error.

## Ecuaciones

- Fotocompuerta (valor convencionalmente verdadero): V₀ₓ = d / τ
  u = √( u_d²/τ² + d²·u_τ²/τ⁴ )
- Parábola (valor experimental): V₀ₓ = D·√(g / 2H)
  u = √( (g/2H)·u_D² + (g·D²/8H³)·u_H² )
- Incertidumbre de la serie: u_D = √(u_lectura² + σ_D²) y u_τ = √(u_lectura² + σ_τ²)
- u_lectura de τ = apreciación del PhysicsSensor = 2,74×10⁻⁴ s; los τ registrados son múltiplos de ella
- Todas las incertidumbres se reportan con una cifra significativa y el valor se redondea a la misma posición decimal
- Error: % = |V_foto − V_parábola| / V_foto × 100
- g = 9,77 m/s² (valor típico en Medellín)

## Controles

- Girar: clic izquierdo y arrastrar. Desplazar: clic derecho o Shift + arrastrar. Zoom: rueda del mouse o pellizco; acerca hacia el punto bajo el cursor.
- Botones de cámara: Vista 3D, Lateral, Superior y Fotocompuerta (acercamiento al borde de la rampa).
- PhysicsSensor: botones + Ey, - Ey, + Ex y - Ex para ampliar o reducir la señal.

## Señal del PhysicsSensor

La señal se genera con la geometría: el haz (disco de 1 mm de radio a la altura del centro de la esfera) se va tapando con la silueta de la esfera de diámetro d que avanza a v = d/τ. La subida y la bajada duran lo mismo para cualquier esfera; la meseta es más larga cuanto mayor es d. Entre el inicio de la subida y el inicio de la bajada pasan exactamente τ = d/v.

## Marco de referencia

En Montaje, Vuelo y Explorar se pueden invertir los ejes x y y. Cambian los signos de las ecuaciones y de los valores en vivo, pero al despejar se llega a la misma V₀ₓ = D·√(g/2H).

## Para editar

La fuente está en `src/index.src.html`. Después de editarla, desde esta carpeta:

    python3 -I ../../../skills/simulacion-practica-lab/scripts/empaquetar.py src/index.src.html index.html

El motor y la cámara compartidos están en `vendor/` (raíz del repositorio).

## Teclado

- **Espacio / Enter**: lanzar (en Laboratorio, el botón principal del paso).
- **← →**: ángulo de lanzamiento (Shift: de 5 en 5). **↑ ↓**: rapidez V₀ (en la rampa, altura de la rampa).
- **1–4**: tipo de lanzamiento. **V** vectores · **T** trayectoria prevista · **C** borrar la traza.
- **H** vista limpia (solo la escena, con un indicador de θ, V₀ y las teclas) · **P** panel · **S** sensor · **E** rótulos · **Esc** sale de la vista limpia.
