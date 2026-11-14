/* =====================================================================
   PIEZA · Polea con prensa de mesa (PASCO Super Pulley con prensa, ME-9448B)
   Estado: BORRADOR · rueda con medidas del fabricante y del laboratorio; prensa y brazo
   estimados de una foto. Ficha: biblioteca/piezas/README.md

   Una rueda negra de radios con garganta para la cuerda gira en un eje que sale de un
   brazo horizontal. El brazo atraviesa una prensa en C que se aprieta al borde de la
   mesa con un tornillo de perilla por debajo; una perilla lateral fija el brazo.

   Medidas de la rueda: diámetro 5,1 cm (PASCO); radio por donde pasa la cuerda 2,465 cm
   (dato de los monitores: es el "radio externo r" de las guías de Movimiento circular y
   Segunda ley). La garganta de PASCO tiene 15 cm de circunferencia (r ≈ 2,39 cm).

   Unidades: metros. Origen: EJE DE LA RUEDA. La rueda gira en el plano XY (eje a lo largo de Z).
   La mesa queda hacia −X: la cuerda llega horizontal por arriba (anclaje 'arriba') y baja
   vertical por el lado +X (anclaje 'bajada'). El brazo y la prensa quedan hacia +Z.

   const po = Lab.piezas.polea();
   escena.add(po.grupo);
   po.grupo.position.copy(bordeDeLaMesa).sub(po.anclajes.mesa);   // la prensa queda apretada al borde
   po.girarPorLongitud(x);       // la cuerda avanzó x metros: la rueda gira x / radio
   po.anclajes.arriba            // punto donde la cuerda horizontal toca la rueda
   po.anclajes.bajada            // punto donde sale la cuerda vertical
   po.anclajes.mesa              // esquina superior del borde de la mesa que muerde la prensa

   Parámetros (por defecto = pieza real):
     diametro 0.051    diámetro exterior de la rueda (PASCO)
     radio 0.02465     radio por donde pasa la cuerda (medido en el laboratorio)
     radios 10         radios de la rueda (los que corta el haz de la fotocompuerta)
     grosor 0.009      ancho de la rueda (estimado)
     brazo 0.042       del eje a la cara de la prensa (estimado de foto)
     mesaY 0.006       altura de la superficie de la mesa sobre el eje (estimado de foto)
     mesaGrosor 0.030  grosor del tablero que aprieta la prensa
     color 0x16191f
   ===================================================================== */
(function(){
  'use strict';
  const Lab = window.Lab = window.Lab || {};

  function polea(o){
    o = Object.assign({diametro:0.051, radio:0.02465, radios:10, grosor:0.009, brazo:0.042, mesaY:0.006, mesaGrosor:0.030, color:0x16191f}, o || {});
    const g = new THREE.Group(); g.name = 'polea';
    const plas = new THREE.MeshStandardMaterial({color:o.color, roughness:0.5, metalness:0.05});
    const acero = new THREE.MeshStandardMaterial({color:0xb9c0c8, roughness:0.3, metalness:0.85});
    const R = o.diametro / 2, rg = Math.min(o.radio, R - 0.0003),   // radio exterior y radio de la cuerda
          RI = R - 0.004,                                           // borde interior del aro
          T = o.grosor, RH = 0.0065;                                // radio del cubo
    const rf = Math.min(rg - 0.0004, R - 0.0012);                  // fondo de la garganta (la cuerda tiene grosor)

    /* ---- rueda (gira) ---- */
    const rueda = new THREE.Group(); rueda.name = 'rueda'; g.add(rueda);
    /* aro con garganta: perfil (r, z) girado alrededor del eje */
    const perfil = [[RI, -T/2], [R, -T/2], [R, -T/2 + 0.0012], [rf, -0.0009], [rf, 0.0009], [R, T/2 - 0.0012], [R, T/2], [RI, T/2]].map(p => new THREE.Vector2(p[0], p[1]));
    perfil.push(perfil[0].clone());
    const aroG = new THREE.LatheGeometry(perfil, 64); aroG.rotateX(Math.PI / 2);
    const aro = new THREE.Mesh(aroG, plas); aro.castShadow = true; rueda.add(aro);
    /* cara con ventanas entre los radios (radio de ancho constante) */
    const cara = new THREE.Shape(); cara.absarc(0, 0, RI + 0.0004, 0, Math.PI * 2, false);
    const n = o.radios, w = 0.0016, r0 = RH + 0.0018, r1 = RI - 0.0018;
    for(let k = 0; k < n; k++){
      const a0 = 2 * Math.PI * k / n, a1 = 2 * Math.PI * (k + 1) / n, v = new THREE.Path();
      const d0 = Math.asin(w / r0), d1 = Math.asin(w / r1);
      for(let i = 0; i <= 8; i++){ const a = a0 + d1 + (a1 - a0 - 2 * d1) * i / 8; const x = r1 * Math.cos(a), y = r1 * Math.sin(a); i ? v.lineTo(x, y) : v.moveTo(x, y); }
      for(let i = 8; i >= 0; i--){ const a = a0 + d0 + (a1 - a0 - 2 * d0) * i / 8; v.lineTo(r0 * Math.cos(a), r0 * Math.sin(a)); }
      cara.holes.push(v);
    }
    const TC = 0.003, caraG = new THREE.ExtrudeGeometry(cara, {depth:TC, bevelEnabled:false, curveSegments:40}); caraG.translate(0, 0, -TC / 2);
    const caraM = new THREE.Mesh(caraG, plas); caraM.castShadow = true; rueda.add(caraM);
    const cubo = new THREE.Mesh(new THREE.CylinderGeometry(RH, RH, T + 0.001, 28), plas); cubo.rotation.x = Math.PI / 2; rueda.add(cubo);
    /* marca blanca en el aro: deja ver que la rueda gira */
    const marca = new THREE.Mesh(new THREE.BoxGeometry(0.003, 0.0035, 0.0005), new THREE.MeshBasicMaterial({color:0xe8edf2}));
    marca.position.set(0, RI + 0.002, T / 2 + 0.00025); rueda.add(marca);

    /* ---- eje y brazo ---- */
    const zB = T / 2 + 0.0015 + 0.005, BH = 0.012, BZ = 0.010;             // centro del brazo en Z, alto y ancho del brazo
    const eje = new THREE.Mesh(new THREE.CylinderGeometry(0.0018, 0.0018, zB + T / 2 + 0.003, 14), acero);
    eje.rotation.x = Math.PI / 2; eje.position.z = (zB - T / 2 - 0.003) / 2; g.add(eje);
    const tuerca = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.002, 6), acero); tuerca.rotation.x = Math.PI / 2; tuerca.position.z = -T / 2 - 0.0025; g.add(tuerca);
    const PX = -o.brazo, PG = 0.005;                                       // cara de la prensa (lado de la rueda) y grosor de su placa
    const brazoM = new THREE.Mesh(new THREE.BoxGeometry(o.brazo + 0.007 + PG + 0.006, BH, BZ), plas);
    brazoM.position.set((0.007 + PX - PG - 0.006) / 2, 0, zB); brazoM.castShadow = true; g.add(brazoM);

    /* ---- prensa en C, apretada al borde de la mesa ---- */
    const xB = PX - PG,                                                    // borde de la mesa: la placa de la prensa lo toca por fuera
          yS = o.mesaY, yI = o.mesaY - o.mesaGrosor,                       // cara de arriba y de abajo del tablero
          ZP = 0.02, MJ = 0.018, EJ = 0.005, AB = 0.008;                   // ancho de la prensa, largo y grueso de las mordazas, holgura bajo el tablero
    const caja = (sx, sy, sz, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), plas); m.position.set(x, y, z); m.castShadow = true; g.add(m); return m; };
    const yBot = yI - AB;                                                  // cara de arriba de la mordaza de abajo
    caja(PG, yS + EJ - (yBot - EJ), ZP, PX - PG / 2, (yS + EJ + yBot - EJ) / 2, zB);        // placa vertical
    caja(MJ, EJ, ZP, xB - MJ / 2 + PG, yS + EJ / 2, zB);                                       // mordaza de arriba (sobre el tablero)
    caja(MJ, EJ, ZP, xB - MJ / 2 + PG, yBot - EJ / 2, zB);                                     // mordaza de abajo
    /* tornillo de perilla: sube desde la mordaza de abajo hasta el tablero */
    const xT = xB - MJ / 2, BAJO = 0.008;
    const varilla = new THREE.Mesh(new THREE.CylinderGeometry(0.0025, 0.0025, AB + EJ + BAJO, 12), plas);
    varilla.position.set(xT, (yI + yBot - EJ - BAJO) / 2, zB); g.add(varilla);
    const zapata = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 0.002, 18), plas); zapata.position.set(xT, yI - 0.001, zB); g.add(zapata);
    const perilla = new THREE.Mesh(new THREE.CylinderGeometry(0.0065, 0.0065, 0.008, 22), plas);
    perilla.position.set(xT, yBot - EJ - BAJO - 0.004, zB); perilla.castShadow = true; g.add(perilla);
    /* perilla lateral que fija el brazo, en el frente de la placa */
    const lateral = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.006, 18), plas);
    lateral.rotation.x = Math.PI / 2; lateral.position.set(PX - PG / 2, 0, zB + ZP / 2 + 0.003); g.add(lateral);
    const cabeza = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.0015, 10), acero);
    cabeza.rotation.x = Math.PI / 2; cabeza.position.set(PX - PG / 2, 0, zB + ZP / 2 + 0.0065); g.add(cabeza);

    let ang = 0;
    function girar(a){ ang = a; rueda.rotation.z = -a; }                   // la cuerda avanza hacia +X por arriba: giro horario visto desde +Z
    return {grupo: g, rueda, girar,
      girarPorLongitud: x => girar(x / rg),
      angulo: () => ang,
      anclajes: {eje: new THREE.Vector3(0, 0, 0), arriba: new THREE.Vector3(0, rg, 0), bajada: new THREE.Vector3(rg, 0, 0), mesa: new THREE.Vector3(xB, yS, zB)},
      medidas: {diametro: o.diametro, radio: rg, radios: n, grosor: T, brazo: o.brazo}};
  }
  Lab.piezas = Object.assign(Lab.piezas || {}, {polea});
})();
