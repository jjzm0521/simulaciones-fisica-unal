# Plantilla de práctica

Punto de partida para cualquier práctica nueva, de Física 1 o de Física 3, con el **diseño aprobado** (el de movimiento parabólico): escena a pantalla completa, paneles flotantes, Explorar / Laboratorio / Paso a paso, barra *Qué mostrar*, vista limpia, teclado y control táctil.

1. Copia esta carpeta a `fisica-1/<practica>/` o `fisica-3/<practica>/`.
2. Cambia lo marcado con `TODO` en `src/index.src.html`: textos, montaje (con piezas de `biblioteca/piezas/` cuando existan), pasos, física y datos.
3. Empaqueta desde la carpeta de la práctica:

       python3 -I ../../herramientas/empaquetar.py src/index.src.html index.html

Para lo que la plantilla no trae (sensor, tabla de datos, "Tus cálculos" con verificación, tipos de lanzamiento, ejes invertibles), copia el patrón de `fisica-1/movimiento-parabolico/src/index.src.html` hasta que esas partes pasen a la biblioteca.
