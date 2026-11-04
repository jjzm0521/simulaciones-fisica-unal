# simulaciones-fisica-unal

Skill de Antigravity / Gemini para la creación y desarrollo de simulaciones 3D interactivas del **Laboratorio de Física Mecánica** (Universidad Nacional de Colombia, Sede Medellín).

---

## 🤖 Skill: `simulacion-practica-lab`

Esta habilidad permite a los asistentes de IA generar simulaciones en HTML autónomo (sin conexión a internet) siguiendo el estilo visual de *sael.net*, los datos reales de los montajes de la UNAL, sonoscopio virtual con señales fidedignas, tablas de datos y cálculo riguroso de incertidumbres.

### Contenido

- [`skills/simulacion-practica-lab.skill`](./skills/simulacion-practica-lab.skill): Paquete comprimido de la skill para instalación directa.
- [`.gemini/skills/simulacion-practica-lab/`](./.gemini/skills/simulacion-practica-lab/): Directorio de la skill listo para usar al abrir este repositorio en Antigravity.
  - `SKILL.md`: Directrices, flujo de trabajo y reglas aprobadas.
  - `references/catalogo-practicas.md`: Catálogo y propuestas para cada práctica del laboratorio.
  - `references/estilo-sael.md`: Guía de diseño visual y paleta de colores.
  - `references/fisica-y-datos.md`: Fórmulas, señales del sonoscopio y tratamiento de incertidumbres.
  - `assets/plantilla-practica08-atwood.html`: Plantilla base con el diorama 3D y la estructura de datos.
  - `scripts/build.py` y `scripts/get_three.sh`: Scripts para empaquetar three.js e integrar las simulaciones offline.

---

## 👥 Colaboradores

- **Juan José Zapata Moreno** ([@jjzm0521](https://github.com/jjzm0521))
- **María José Uribe** ([@mjuribe](https://github.com/mjuribe))
- **Brayan Garcia** ([@bgarciab-gb](https://github.com/bgarciab-gb))
- **Daniel Cuartas** ([@danicuartas](https://github.com/danicuartas))
