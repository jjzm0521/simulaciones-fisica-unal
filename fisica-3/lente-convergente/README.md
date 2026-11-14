# Lente convergente

Física 3 · UNAL Medellín · Guía: *La lente convergente* (copia local del monitor, no va al repositorio).

- **Estado:** lista con el diseño de la biblioteca, por revisar (rama `feat/lentes-diseno`).
- `index.html`: la simulación (un solo archivo, sin internet). `src/index.src.html`: la fuente.
- Reconstruir: `python3 -I ../../herramientas/empaquetar.py src/index.src.html index.html`

## Qué tiene

- **Explorar:** objeto real o virtual (se arrastra, también detrás de la lente), seis lentes y radios libres, material, casos rápidos, recorrido automático, estela, haz y rayos principales.
- **Laboratorio:** riel con cinta, objeto luminoso (F), pantalla con desenfoque, objeto lejano (f′∞) y objeto virtual con lente auxiliar L₀. Tabla, gráfica 1/s′ vs 1/s, resultados y CSV.
- **Paso a paso (8):** montaje y signos → f′ con objeto en ∞ (ejemplo resuelto: la simulación enfoca) → tomar datos (enfoca el estudiante, nitidez ≥ 80 %) → gráfica → **tus cálculos** (b, f′ gráfica, f′∞ y %error, verificados) → resultados → imagen virtual (mirar por la lente) → objeto virtual.
- **Ventana** (tecla S): diagrama de rayos en vivo, mapa s′–s y lente por dentro.
- Teclas: Espacio/Enter acción principal, ← → objeto, ↑ ↓ pantalla (Explorar: altura), F enfocar, 1 2 3 objeto, R reiniciar, V vista, T estela, G paso a paso, H P S E L O como en todas.

## Decisiones

- f′ no se muestra en Laboratorio: es lo que se mide. Cambiar la lente borra los datos (con deshacer).
- u_s = 0,1 cm (cinta); en s′ se suma la profundidad de foco δ = 0,05·s′/D, con D = 10 cm el diámetro de la lente (supuesto, falta medir la lente real).
- El objeto lejano está a 8 m por defecto (ajustable): por eso f′∞ sale algo mayor que f′.
- La escena conserva su iluminación y el efecto de luz (mezcla aditiva) en oscuro; en claro cada color pasa a su versión oscura. El fondo sale de `Lab.escena.paleta`.
