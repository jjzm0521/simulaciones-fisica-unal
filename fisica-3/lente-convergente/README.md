# Lente convergente

Física 3 · UNAL Medellín

- **Estado:** lista · diseño anterior (falta pasarla al diseño aprobado de parabólico)
- `index.html`: simulación (Explorar y Laboratorio, modo día, vista a través de la lente)
- `src/index.src.html`: fuente

Reconstruir: `python3 -I ../../herramientas/empaquetar.py src/index.src.html index.html`

## Uso y detalles

Diseño anterior (inspirado en sael.net): sus atajos no son los del sistema actual.
- Abrir index.html en Chrome, Edge o Safari. Funciona sin internet
- (three.js va incluido; sin conexión solo cambian las tipografías).
- Se puede entrar directo a un modo con #explorar o #laboratorio al final de la dirección.

### Común a los dos modos

- Convención DIN 1335: 1/s′ − 1/s = 1/f′, β = s′/s. Distancias desde la lente, positivas en el sentido de la luz.
- Mesa con ejes: la mitad ámbar es por donde llega la luz (s < 0); la cian, por donde sale (s′ > 0).
- Diagrama de rayos: siempre visible, se redibuja al mover cualquier elemento.
- Panel de pestañas: Mapa s′–s (la curva se puede arrastrar) y Lente por dentro (radios, centros C₁ y C₂, cuenta de f′).
- Colores: ámbar = objeto y luz, cian = real, violeta punteado = virtual, verde = focos.
- La explicación de cada caso está detrás del botón "+ Por qué".
- Letra grande (P): agranda textos y sube el contraste para proyectar en clase, sin cambiar la distribución.
- Modo día/noche (botón sol/luna o N): se recuerda al volver a abrir. En día, la F luminosa y la pantalla siguen oscuras porque emiten o recogen luz.
- Atajos: L cambia de modo, V vista, P letra grande, N día/noche, ? guía.

### Explorar (libre)

- Objeto: flecha que se arrastra a lo largo y en altura. Detrás de la lente se vuelve OBJETO VIRTUAL.
- Imagen real: flecha cian. Imagen virtual y objeto virtual: fantasmas violeta con prolongaciones punteadas.
- Estela: copias que se desvanecen y muestran el recorrido de la imagen, incluido el salto al cruzar F.
- Lente: 6 tipos, radios R₁ y R₂ (centro = cara plana) y material. f′ sale de 1/f′ = (n − 1)(1/R₁ − 1/R₂).
- Sección Objeto: lejos, en 2F, entre F y 2F, dentro de F, detrás. "Recorrer" (Espacio) lo pasea solo.
- Vistas: Perspectiva, Lateral, Rasante, Planta. Otros atajos: ← → mover, T estela.

### Laboratorio (práctica "la lente convergente", escuela de física, sede medellín)

- Riel con cinta métrica, objeto luminoso (una F), lente y pantalla. La imagen en la pantalla se desenfoca de verdad.
- Por la lente se ve TODO lo que está antes de ella transformado con s′ = s/(1 + P·s), y′ = y/(1 + P·s): panel, F, riel, cinta y piso, desde cualquier ángulo.
- Por fuera de la lente se ve el objeto real. La pantalla solo recoge la imagen real.
- Con el ojo fijo, al alejar el objeto: dentro de F se ve derecha y mayor; al cruzar F el tamaño aparente no salta (tiende a h/f′);
- sigue derecha mientras la imagen real se forme detrás del ojo; cuando llega al ojo la F se pierde y luego aparece invertida.
- Es un ojo puntual: no se simula el desenfoque de la imagen cuando se forma detrás del ojo.
- Objeto en ∞: objeto lejano a D metros → f′∞.
- Objeto real: 5 distancias separadas 5 a 10 cm, s y s′ con incertidumbre. Si la imagen cae fuera del riel no se puede registrar.
- Objeto virtual: lente auxiliar L₀ (f₀ = 12 cm, a 2f₀–2f₀) que manda un haz convergente.
- Gráfica 1/s′ vs 1/s: pendiente ≈ 1, corte b = 1/f′ → f′ = 1/b, u_f′ = u_b/b². Resultados: %Error frente a f′∞.
- Enfocar (E) mueve la pantalla con un pequeño error humano. Registrar (Enter) solo funciona con la imagen nítida.
- Paso a paso (G): 7 pasos, cerrado al inicio y sin bloqueos.
- f′ y los focos se ocultan porque medirlos es el objetivo. El valor del modelo está en Resultados → "Para el monitor".
- La lente se elige en Explorar; si es divergente, al entrar se cambia por una biconvexa con un aviso.
- Vistas: Perspectiva, Lateral, Pantalla, Ojo tras la lente. CSV con ; y coma decimal.

### Incertidumbres

- u_s = 0.1 cm (cinta métrica). u_s′ = √(0.1² + δ²), con δ = 0.05·s′/D_lente la profundidad de foco:
- el rango de pantalla en el que la mancha de cada punto mide menos de 0.5 mm. D_lente = 10 cm.

### Fuentes de error (medición → fuentes de error)

- Objeto lejano a D (por defecto 8 m): el "infinito" no es infinito y f′∞ sale unos 3 % mayor que f′.
- Sale "no compatibles", un buen punto de discusión. Con D = 40 m la diferencia baja a menos de 1 %.
- Al enfocar: escala el error de la mano dentro de la profundidad de foco.

### Datos supuestos (confirmar con el montaje real)

- Lente biconvexa R = ±25 cm, n = 1.52 (f′ ≈ 24 cm), diámetro 10 cm, F luminosa de 3 cm de alto.

### Para editar

- La fuente es src/simulacion-lente.src.html. Después de editarla, desde la raíz del repositorio:
-   cd fisica-3/lente-convergente && python3 -I ../../herramientas/empaquetar.py src/index.src.html index.html
