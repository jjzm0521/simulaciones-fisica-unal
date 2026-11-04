# Catálogo de prácticas · ideas de simulación

Guías en `~/01_Trabajo/Monitoria/Guías de laboratorio/` (.md y .pdf). Confirma siempre con la guía y con el monitor cuántas repeticiones se hacen en la sesión real (en la Práctica 8 es un solo lanzamiento aunque la guía hable de promediar); esto es un punto de partida. "Hecha" = ya existe en `~/01_Trabajo/Simulaciones monitoría/`.

| Práctica | Montaje / instrumento | Qué simular | Señal / dato | Comparación final |
|---|---|---|---|---|
| Fundamentos de metrología | regla, calibrador (pie de rey), tornillo micrométrico, balanza | Instrumentos 3D con nonio legible y zoom; el estudiante lee la medida y la app valida la lectura y las cifras significativas | Lecturas con resolución del instrumento | Propagación de incertidumbre (área, volumen, densidad) |
| Calibración estática de un resorte (Hooke) | resorte, pesas, regla, PhysicsSensor | Agregar pesas, el resorte se estira con una pequeña oscilación amortiguada; leer elongación con regla y paralaje | Tabla F vs x | Regresión lineal → k ± u |
| Equilibrio de una partícula (fuerzas concurrentes) | mesa de fuerzas / poleas con pesas, transportador | Anillo central que se centra cuando la suma es cero; ajustar masas y ángulos | Lectura de ángulos y masas | Fuerza equilibrante experimental vs teórica (suma vectorial, polígono) |
| Equilibrio de un cuerpo rígido (torques) | barra con pesas, dinamómetro | Barra que gira hasta equilibrar; brazos de palanca visibles en violeta | Lecturas de fuerza y distancias | Σ torques = 0, %error de la fuerza medida |
| Centros de masa | placa irregular de acrílico, plomada | Colgar la placa desde varios puntos; la plomada traza líneas que se cruzan | Coordenadas del cruce | CM experimental vs calculado por descomposición |
| Caída libre (IoT) | regla-cebra / esfera y fotocompuerta, PhysicsSensor, celular | Igual que la regla de la Práctica 8 sin cuerda: 15 cauchitos a 1 cm | Picos discretos de una sola polaridad | Regresión cuadrática → g vs 9.776 m/s² |
| Plano inclinado MU y MUV (IoT) | carrito de baja fricción, plano horizontal e inclinado, sensores | Carrito en plano horizontal (MU) y en inclinado (MUV), ángulo ajustable | Posición–tiempo | Regresión lineal (v) y cuadrática (a); a vs g·sen θ |
| Movimiento parabólico | rampa, esfera, fotocompuerta a la salida, papel carbón | Esfera que sale de la rampa, cruza la fotocompuerta (pico ancho = diámetro/v) y marca el papel | Tiempo de interrupción → v₀; alcance medido | Alcance teórico vs experimental (5 lanzamientos) |
| Segunda ley de Newton · rectilíneo | Atwood / carro con polea de radios + fotocompuerta | Reutiliza la polea de la Práctica 8 | Onda de radios con período decreciente | a medida vs a = F/m del modelo |
| Segunda ley de Newton · circular (péndulo simple) | esfera pendular, fotocompuerta en el punto más bajo | Péndulo soltado desde un ángulo; medir tiempo de interrupción en el fondo | Pico ancho por paso de la esfera | Tensión/fuerza centrípeta: m v²/L vs teórico |
| Movimiento circular (Práctica 8) | Atwood, polea de 10 radios r = 0.02465 m, regla-cebra 15 cauchitos a 1 cm | **Hecha** (`Practica 08 - Movimiento circular/simulacion-atwood.html`) | Regla: picos; polea: onda que se acelera | a_l vs a_T = α r |
| Conservación de la energía | regla que cae por una fotocompuerta (4 posiciones), resorte | Regla con 4 bandas: velocidad instantánea en cada posición | 4 grupos de picos | E_mecánica en cada posición, ΔE |
| Colisiones en dos dimensiones | rampa, esferas 1 y 2, papel carbón, plomada, transportador | Choque oblicuo, puntos de caída con dispersión, trazos desde P | Alcances y ángulos (5 lanzamientos) | Conservación del momentum en x y z; energía antes/después |

Prioriza la práctica que toque esa semana (revisa avisos en `Monitoria/` y el calendario que mencione el usuario).
