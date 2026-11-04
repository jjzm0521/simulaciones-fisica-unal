# Ondas estacionarias en una cuerda

Simulación local y autónoma de la práctica de Física III, UNAL Medellín.

Abre [simulacion-ondas-cuerda.html](./simulacion-ondas-cuerda.html). Ajusta la
frecuencia, identifica los vientres y registra hasta nueve armónicos. El ajuste
de frecuencia frente a número de armónico permite calcular la velocidad
experimental y compararla con `sqrt(mg/μ)`, con incertidumbres.

Longitud, masa colgante y densidad lineal se introducen directamente como
parámetros editables. No hay una etapa de medición de masa o densidad.

Consulta [LEEME.txt](./LEEME.txt) para el procedimiento, supuestos físicos,
tratamiento estadístico y atajos. No requiere compilación ni conexión.

Verificación del modelo: `node fisica-3/ondas-estacionarias/verificar.cjs`
(desde la raíz del repositorio; Node.js solo es necesario para esta verificación).
