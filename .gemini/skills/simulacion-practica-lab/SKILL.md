---
name: simulacion-practica-lab
description: Crea simulaciones 3D interactivas (una sola página HTML, sin internet) de las prácticas del Laboratorio de Física Mecánica de la UNAL Medellín, con el estilo visual de sael.net (diorama 3D, paneles oscuros translúcidos, Outfit + DM Mono), sonoscopio/fotocompuerta virtual, tablas de datos, regresiones con incertidumbre, %error, paso a paso guiado, modo proyector y versión celular. Úsala siempre que el monitor pida una simulación, laboratorio virtual, applet, "página como la de la práctica 8", material interactivo para una práctica (caída libre, Atwood, plano inclinado, parabólico, péndulo, energía, colisiones, resorte, equilibrio, centro de masa, metrología…) o cuando se cancele una sesión presencial y haga falta algo para que los estudiantes practiquen, aunque no mencione sael.net ni la palabra "simulación".
---

# Simulación de práctica de laboratorio (estilo sael.net)

Construye una página que reemplace de verdad la sesión presencial: el estudiante ve el montaje en 3D, lo suelta, observa la señal que vería en el laboratorio, llena las tablas de la guía, hace la regresión y obtiene el %error. La referencia completa y probada es `assets/plantilla-practica08-atwood.html` (Práctica 8, máquina de Atwood). Parte de ella: copia la estructura y cambia la física, el montaje y los textos. Rehacer desde cero cuesta mucho más y pierde detalles que ya se corrigieron con el usuario.

## Flujo

1. **Lee la guía de la práctica** (en `Monitoria/Guías de laboratorio/*.md`; si solo hay PDF, extrae el texto). Anota: objetivo, montaje, instrumento (fotocompuerta+sonoscopio, regla, transportador, IoT…), qué se mide, tablas (columnas exactas), ecuaciones de la regresión y de incertidumbre, y cómo se calcula el %error (qué es "valor convencionalmente verdadero" y qué es "valor experimental"). Consulta `references/catalogo-practicas.md` para la idea de simulación de cada práctica.
2. **Busca datos reales del montaje** en las guías y en materiales previos (p. ej. la regla-cebra tiene 15 cauchitos separados 1 cm; la polea tiene 10 radios cada 36°, radio exterior 0.02465 m). Si un dato clave no aparece (radio, longitud, masa, separación), pregúntalo al usuario antes de inventarlo y, mientras, deja un valor razonable editable con un control deslizante.
3. **Diseña la simulación** en pocas líneas antes de escribir código: piezas 3D, qué se mueve, qué señal produce el sensor, qué tabla se llena, qué controles importan para *esta* práctica (no todos los parámetros merecen control; p. ej. en movimiento circular las masas no son centrales) y qué fuentes de error vale la pena mostrar en "Avanzado".
4. **Construye** copiando la plantilla a un `src.html` de trabajo (en el scratchpad) y adaptándola. Lee `references/estilo-sael.md` para no romper el estilo y `references/fisica-y-datos.md` para la parte de datos, señales e incertidumbres.
5. **Empaqueta sin internet**: `sh scripts/get_three.sh <scratchpad>/three` y luego `python3 -I scripts/build.py src.html <ruta three.min.js> <salida.html>`. La plantilla ya trae el marcador `/*__THREE__*/`.
6. **Guarda** en `~/01_Trabajo/Simulaciones monitoría/Practica NN - Tema/` con `simulacion-<tema>.html` y un `LEEME.txt` corto (qué reproduce de la guía, uso, atajos, fuentes de error, datos reales usados).
7. **Verifica en el navegador** (ver abajo) antes de entregar.

## Lo que el usuario ya pidió y aprobó (mantenlo en todas)

- **Estilo sael.net**: escena 3D a pantalla completa, título enorme en cian + subtítulo blanco en mayúsculas, tarjetas de lectura en vivo, panel de controles arriba a la derecha, sonoscopio abajo a la izquierda, datos abajo a la derecha, botones de pie de página arriba al centro, etiquetas flotantes con punto de color que siguen a las piezas, vistas de cámara con transición suave.
- **Señales realistas del sonoscopio**. El usuario corrigió esto explícitamente: un objeto opaco discreto (cauchito, esfera, franja) da **base plana y picos estrechos bien definidos, todos con la misma polaridad** (hacia arriba o hacia abajo); un patrón continuo que pasa por el haz (radios de una polea en giro) da **una onda casi sinusoidal cuyo período cambia** con la velocidad. Nunca uses una señal genérica derivada/AC con picos positivos y negativos.
- **Datos reales** del montaje de la UNAL cuando existan.
- **Repeticiones como en el laboratorio real, no como dice la guía al pie de la letra.** En la Práctica 8 la guía habla de promediar, pero en la sesión se suelta **una sola vez** por tabla; el usuario se rió de la versión con 5 lanzamientos promediados. Pregunta cuántas veces se repite de verdad antes de construir tablas de promedios. Con un solo lanzamiento, u_t es la resolución del sonoscopio (1/44100 s ≈ 0.023 ms) y los tiempos se cuantizan a esa rejilla.
- **Paso a paso guiado** que sigue los numerales de la guía (3.1 → 3.2 → 3.3…), abierto al iniciar, con botón que hace la acción ("Soltar") y "Siguiente" desactivado hasta que haya datos.
- **Modo proyector** (tecla P): letra más grande, paneles más opacos, escena más iluminada, trazo más grueso.
- **Celular**: diseño apilado, escena arriba sin quedar tapada por las tarjetas, pellizcar para zoom, sin desbordamiento horizontal.
- **Funciona sin internet** (three.js incrustado). Solo las fuentes vienen de Google Fonts y tienen respaldo.
- **Español de Colombia**, términos de la guía (regla-cebra, sonoscopio, fotocompuerta, valor convencionalmente verdadero…). CSV con `;` y coma decimal para Excel.

## Verificación

Sirve la carpeta con un servidor local (el navegador integrado no abre `file://` en rutas con tildes): crea o reutiliza `.claude/launch.json` con `python3 -m http.server 8765 --directory "<carpeta Simulaciones monitoría>"` y ábrelo con `preview_start`. Luego:

- Captura a 1440×900: nada importante tapado, el aparato completo visible, sin errores en consola.
- Ejecuta por JavaScript el flujo completo ("Rápido" en cada medición, pestaña Resultados) y revisa que los números tengan sentido físico: con las fuentes de error apagadas el %error debe quedar ≲0.2 % y compatible; con ellas encendidas, del orden esperado.
- Recorre los pasos de la guía con clics simulados.
- Revisa el modo proyector y el preset `mobile` (375×812) y vuelve el visor a `desktop` al terminar.
- Mira de cerca (zoom) el sonoscopio después de un lanzamiento en cada modo: la forma de la señal es lo que primero nota el monitor.

Si la página del navegador está oculta, `requestAnimationFrame` va lento: usa "Rápido" (deja la corrida terminada) en lugar de esperar una animación.

## Entrega

Di qué práctica cubre, dónde quedó el archivo, qué datos reales usaste y cuáles supusiste (pidiendo el valor real), y qué verificaste y qué no (proyector o celular físicos). Sugiere la siguiente práctica del catálogo si aplica.
