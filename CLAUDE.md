# CLAUDE.md · Guía para agentes

Lee esto antes de tocar el repositorio. Aplica a cualquier agente (Claude, Gemini/Antigravity, Codex…). Si algo de aquí choca con `skills/simulacion-practica-lab/` o con documentos viejos, **manda este archivo**.

## Qué es

Simulaciones 3D interactivas de los laboratorios de física de la **Universidad Nacional de Colombia, Sede Medellín**, hechas por los monitores para que los estudiantes practiquen, preparen la sesión o estudien solos. Hay dos cursos: **Física 1** (Física Mecánica, 13 prácticas) y **Física 3** (ondas y óptica). Todo el texto para el usuario va en **español**.

## Reglas que no se negocian

1. **Cada simulación es un solo archivo `index.html` independiente.** Funciona con doble clic, sin servidor, sin internet y sin las demás carpetas del repositorio. Todo lo que use (motor, cámara, interfaz, fuentes, piezas) va copiado adentro al empaquetar. Nunca dejes `<script src>`, `<link href>` ni fuentes que dependan de internet o de rutas locales en el `index.html` final.
2. **Motor único: three.js r159** (build clásico), en `biblioteca/nucleo/three-r159.min.js`. No uses otra versión, módulos ES ni CDNs. La cámara es `THREE.CamaraOrbita` (`biblioteca/nucleo/camara.js`), no `OrbitControls`.
3. **Diseño único: el aprobado en movimiento parabólico** (F1). La interfaz sale de `biblioteca/interfaz/` (`interfaz.css` + `interfaz.js`): escena a pantalla completa, paneles flotantes, modos **Explorar / Laboratorio / Paso a paso**, barra *Qué mostrar* (Panel, Sensor, Rótulos, Vista limpia), teclado, control táctil en celular. **No inventes estilos propios** ni copies estilos de otros sitios. El estilo "sael.net" de la skill vieja ya no se usa.
4. **Incertidumbres con una cifra significativa** y el valor redondeado a la misma posición decimal; coma decimal. Usa `Lab.fisica.pair(v, u)` de `biblioteca/fisica/incertidumbre.js`.
5. **Física correcta antes que bonita.** Verifica con números (fórmula contra simulación) antes de entregar. Datos con dispersión realista, como en el laboratorio.
6. **Las guías de laboratorio NO van al repositorio** (es público en GitHub). Están en la máquina del monitor: `~/01_Trabajo/Monitoria/Guías de laboratorio/*.md`. Léelas de ahí; en el repo solo se resume con palabras propias lo necesario.

## Estructura

```
fisica-1/<practica>/      una carpeta por práctica (13), índice en fisica-1/README.md
fisica-3/<practica>/      índice en fisica-3/README.md
  ├── index.html          ENTREGA: el archivo que se envía (generado, no se edita a mano)
  ├── src/index.src.html  FUENTE: lo que se edita
  ├── README.md           ficha: estado, guía, decisiones
  ├── guia/  archivo/     PDF de la guía y versiones anteriores (opcionales)
biblioteca/               lo compartido (ver biblioteca/README.md)
  ├── nucleo/             three-r159.min.js, camara.js
  ├── fuentes/            fuentes.css (Bricolage Grotesque, IBM Plex Sans/Mono, incrustadas)
  ├── interfaz/           interfaz.css, interfaz.js  ← diseño aprobado
  ├── fisica/             incertidumbre.js
  └── piezas/             (fase 2) fotocompuerta, rampa, esfera, mesa, sensor, lente…
plantilla/practica/       punto de partida para cualquier práctica nueva
herramientas/             empaquetar.py, empaquetar-todo.py
docs/                     propuestas y decisiones (docs/propuesta-biblioteca.md)
skills/                   skill del agente (desactualizada en estilo; ver regla 3)
```

## Cómo se arma

La fuente marca lo compartido con `data-inline` y el empaquetador lo copia adentro:

```html
<link rel="stylesheet" data-inline="../../../biblioteca/interfaz/interfaz.css">
<script data-inline="../../../biblioteca/nucleo/three-r159.min.js"></script>
```

```bash
# una práctica (desde su carpeta)
python3 -I ../../herramientas/empaquetar.py src/index.src.html index.html
# todas (desde la raíz), obligatorio después de cambiar algo en biblioteca/
python3 -I herramientas/empaquetar-todo.py
```

El empaquetador avisa si quedan recursos externos: ese aviso es un error que hay que corregir.

## Flujo para una práctica nueva

1. Lee la guía local (regla 6) y la ficha `README.md` de la carpeta de la práctica.
2. Copia `plantilla/practica/` a `fisica-N/<practica>/` y llena los `TODO`.
3. **Antes de modelar un equipo, busca en `biblioteca/piezas/`** (y, mientras esa carpeta crece, en `fisica-1/movimiento-parabolico/src/`). Si existe, úsalo igual; si no, créalo como pieza nueva, en metros reales, con parámetros y anclajes, y avisa para que se apruebe.
4. Para lo que la plantilla no trae aún (ventana del PhysicsSensor, tabla de datos, "Tus cálculos" con verificación, ejes invertibles, tipos de lanzamiento, HUD y control táctil completos), copia el patrón de `fisica-1/movimiento-parabolico/src/index.src.html`.
5. Empaqueta, prueba y actualiza la ficha y el índice de la física.

## Cómo probar

- Servidor local en el puerto 8765 sirviendo la carpeta padre del repo (`.claude/launch.json`, nombre `simulaciones`); URL: `http://localhost:8765/simulaciones-fisica-unal/<ruta>/index.html`.
- Consola sin errores; física verificada con números; incertidumbres con una cifra significativa.
- Sin paneles superpuestos en anchos de 360 a 1440 px (computador, celular), en Explorar, Laboratorio y Paso a paso, con y sin panel, y en vista limpia.
- Teclado: Espacio lanza, flechas cambian parámetros, H vista limpia, P panel, S sensor, E rótulos, Esc sale.

## Git y equipo

- `main` es lo aprobado. Trabaja en ramas `feat/<tema>`; **no hagas push ni merge a `main` sin que el usuario lo pida**. No toques ramas de otras personas.
- Los compañeros a veces suben archivos desde la web de GitHub: antes de unir, haz `git fetch` y revisa que no haya cambios nuevos.
- Mensajes de commit en español, claros, con el porqué.

## Estado actual (actualízalo cuando cambie)

- **Lista con el diseño aprobado:** `fisica-1/movimiento-parabolico`.
- **Lista con diseño anterior:** `fisica-3/lente-convergente` (pasarla al diseño aprobado; sus fuentes aún cargan de internet).
- **Hecho de la biblioteca:** núcleo, fuentes, interfaz, incertidumbre, plantilla, empaquetar-todo.
- **Siguiente (fase 2):** sacar piezas de parabólico a `biblioteca/piezas/` (mesa, rampa, esfera, cinta, sensor) y rehacer la fotocompuerta con fotos y medidas reales; armar `biblioteca/catalogo.html` para ver y aprobar piezas.
- **Pendiente del equipo:** lista de prácticas de Física 3, número oficial de cada práctica de F1, fotos y medidas de equipos, quién aprueba piezas.
- La skill existe en dos copias (`skills/` y `.gemini/skills/`) que ya no coinciden; hay que unificarla y actualizarla a estas reglas.
