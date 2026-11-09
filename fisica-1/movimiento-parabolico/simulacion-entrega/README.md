# Práctica N° 7: Movimiento parabólico · Simulación 3D
### Laboratorio de Física Mecánica · Universidad Nacional de Colombia (Sede Medellín)

Simulación 3D de la práctica de movimiento parabólico, ambientada en un laboratorio de física: mesa de trabajo con rampa de acrílico azul, fotocompuerta, cinta métrica en el piso, computador con el programa PhysicsSensor, estantería con material de física y mueble con cajones de vidrio.

## Cómo abrirla

1. Doble clic en `INICIAR_SIMULACION.bat`, o abre `index.html` con Chrome, Edge o Firefox.
2. Se necesita conexión a internet: el motor 3D (Three.js) y las fuentes se cargan desde la red.

## Pasos de la práctica

1. **La idea**: dos formas de medir la velocidad de salida V₀ₓ. Aquí se ajustan los parámetros del montaje: diámetro de la esfera d (12–25 mm), altura de la mesa H (70–115 cm) y altura de la rampa h (5–25 cm). Al cambiarlos se regeneran los datos y todos los resultados se calculan con los nuevos valores.
2. **Montaje**: altura H, diámetro d y altura de la rampa h, con su incertidumbre; marco de referencia. El haz de la fotocompuerta está justo en el borde de la rampa (x = 0), a la altura del centro de la esfera.
3. **Medir τ**: la esfera interrumpe el haz al salir de la rampa. En el sonograma del PhysicsSensor τ se mide con los cursores entre el punto donde la gráfica empieza a subir y el punto donde empieza a bajar (no todo el ancho del pulso).
4. **Vuelo**: movimiento horizontal uniforme y vertical acelerado.
5. **Tomar datos**: cinco lanzamientos y tabla de alcance D y tiempo τ.
6. **Resultados**: promedios, V₀ₓ con la fotocompuerta y con la parábola, y porcentaje de error.

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

- Girar: clic izquierdo y arrastrar. Zoom: rueda del mouse o pellizco.
- Botones de cámara: Vista 3D, Lateral, Superior y Fotocompuerta (acercamiento al borde de la rampa).
- PhysicsSensor: botones + Ey, - Ey, + Ex y - Ex para ampliar o reducir la señal.
