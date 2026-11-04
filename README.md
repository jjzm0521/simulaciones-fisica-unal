# Simulaciones de Física · UNAL Medellín

Entornos interactivos 3D y herramientas de simulación para el **Laboratorio de Física Mecánica** de la Universidad Nacional de Colombia (Sede Medellín).

Este proyecto busca construir simulaciones que reproduzcan con fidelidad experimental las prácticas de laboratorio (con el estilo visual inspirado en *sael.net*: diorama 3D a pantalla completa, paneles translúcidos oscuros, sonoscopio/fotocompuerta virtual, ajuste de datos y tratamiento de incertidumbres).

---

## 🚀 Probar la Simulación (Práctica 8: Movimiento Circular)

La primera simulación terminada y lista para probar es la **Máquina de Atwood**:

### Opción 1: Abrir directamente en el navegador
No requiere instalar nada ni tener conexión a internet (three.js va integrado directamente):
1. Clona el repositorio:
   ```bash
   git clone https://github.com/jjzm0521/simulaciones-fisica-unal.git
   cd simulaciones-fisica-unal
   ```
2. Abre en tu navegador (Chrome, Firefox, Safari o Edge):
   - [`simulaciones/Practica 08 - Movimiento circular/simulacion-atwood.html`](./simulaciones/Practica%2008%20-%20Movimiento%20circular/simulacion-atwood.html)
   - O abre `index.html` en la raíz.

### Opción 2: Servidor local ligero
Si prefieres servirlo localmente:
```bash
python3 -m http.server 8000
```
Y abre `http://localhost:8000` en tu navegador.

---

## 🕹️ Funcionalidades de la Simulación

- **Montaje 3D interactivo:** Control de cámara orbital (rotar, zoom, paneo) y vistas predeterminadas (*Montaje*, *Polea*, *Fotocompuerta*, *Mesa*).
- **Medición 3.1 (Regla-cebra):** Regla de acrílico con 15 marcas separadas 1 cm que atraviesan la fotocompuerta. El sonoscopio genera 15 picos unipolarmente definidos.
- **Medición 3.2 (Polea ranurada):** Fotocompuerta en el borde de la polea de 10 radios ($36^\circ = \pi/5\text{ rad}$). El sonoscopio muestra la modulación de período a medida que la polea se acelera.
- **Tratamiento de Datos:**
  - Ajuste cuadrático por mínimos cuadrados ($y$ vs $t$ y $\theta$ vs $t$).
  - Cálculo de aceleración lineal ($a_l = 2A$) y angular ($\alpha = 2A$), y aceleración tangencial ($a_T = \alpha \cdot r$).
  - Propagación rigurosa de incertidumbres experimentales.
  - Cálculo del $\% \text{Error} = \frac{|a_l - a_T|}{a_l} \times 100$.
- **Exportación:** Descarga de tablas y resultados a `.csv` formateado para Excel en español (delimitador `;` y coma decimal).
- **Atajos y Modos:**
  - `Espacio`: Soltar montaje.
  - `R`: Reiniciar.
  - `P`: Modo proyector (alto contraste, tipografía aumentada para docencia).
  - `G`: Paso a paso guiado con las etapas de la guía de laboratorio.
  - Soporte táctil responsivo para dispositivos móviles y tablets.

---

## 🤖 Skill para Asistentes de IA (`simulacion-practica-lab`)

Este repositorio incluye la habilidad (**Skill**) para que monitores o desarrolladores utilicen asistentes de IA (como **Antigravity** o **Gemini CLI**) para generar nuevas simulaciones de las demás prácticas del catálogo.

### ¿Dónde está la skill?
- **Archivo empaquetado:** [`skills/simulacion-practica-lab.skill`](./skills/simulacion-practica-lab.skill) (listo para importar).
- **Código y referencias descomprimidas:**
  - [`.gemini/skills/simulacion-practica-lab/`](./.gemini/skills/simulacion-practica-lab/) (detectado automáticamente por Antigravity en este workspace).
  - [`skills/simulacion-practica-lab/`](./skills/simulacion-practica-lab/)
    - `SKILL.md`: Instrucciones del flujo de trabajo y reglas aprobadas.
    - `references/catalogo-practicas.md`: Catálogo y propuesta de diseño para cada práctica del laboratorio.
    - `references/estilo-sael.md`: Guía de estilos UI/UX y paleta de colores.
    - `references/fisica-y-datos.md`: Ecuaciones de física, modelos de incertidumbre y señales del sonoscopio.
    - `assets/plantilla-practica08-atwood.html`: Plantilla base con el marcador `/*__THREE__*/`.
    - `scripts/build.py` y `scripts/get_three.sh`: Herramientas para descargar Three.js y empaquetar simulaciones autónomas (offline).

---

## 👥 Colaboradores del Proyecto

- **Juan José Zapata Moreno** ([@jjzm0521](https://github.com/jjzm0521))
- **María José Uribe** ([@mjuribe](https://github.com/mjuribe))
- **Brayan Garcia** ([@bgarciab-gb](https://github.com/bgarciab-gb))
- **Daniel Cuartas** ([@danicuartas](https://github.com/danicuartas))
