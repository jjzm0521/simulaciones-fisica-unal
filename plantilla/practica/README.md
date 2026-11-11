# Plantilla de práctica

Punto de partida para cualquier práctica nueva, de Física 1 o de Física 3, con el **diseño aprobado** (el de movimiento parabólico): escena a pantalla completa, paneles flotantes, Explorar / Laboratorio / Paso a paso, barra *Qué mostrar*, vista limpia, teclado y control táctil.

1. Copia esta carpeta a `fisica-1/<practica>/` o `fisica-3/<practica>/`.
2. Cambia lo marcado con `TODO` en `src/index.src.html`: textos, montaje (con piezas de `biblioteca/piezas/` cuando existan), pasos, física y datos.
3. Empaqueta desde la carpeta de la práctica:

       python3 -I ../../herramientas/empaquetar.py src/index.src.html index.html

El panel se arma con los elementos de `Lab.ui` (míralos en `biblioteca/catalogo.html`): la plantilla trae un deslizador, el botón principal, la barra táctil y el teclado ya conectados. No escribas a mano el HTML de un control ni uses colores o tamaños fuera de los tokens.

Para lo que la biblioteca no trae aún (sensor, tabla de datos, "Tus cálculos" con verificación), toma el patrón de `fisica-1/movimiento-parabolico/src/index.src.html`.
