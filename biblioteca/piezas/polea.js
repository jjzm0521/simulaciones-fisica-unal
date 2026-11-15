/* =====================================================================
   PIEZA · Polea con prensa de mesa (PASCO Super Pulley con prensa, ME-9448B)
   Estado: BORRADOR · rueda con medidas del fabricante y del laboratorio; prensa y brazo
   estimados de una foto. Ficha: biblioteca/piezas/README.md

   Una rueda negra de radios con garganta para la cuerda gira en un eje sostenido por los dos
   lados: el brazo es una horquilla en U que abraza la rueda. La horquilla atraviesa una prensa en C que se aprieta al borde de la
   mesa con un tornillo de perilla por debajo; una perilla lateral fija el brazo.

   Medidas de la rueda: diámetro 5,1 cm (PASCO); radio por donde pasa la cuerda 2,465 cm
   (dato de los monitores: es el "radio externo r" de las guías de Movimiento circular y
   Segunda ley). La garganta de PASCO tiene 15 cm de circunferencia (r ≈ 2,39 cm).

   Unidades: metros. Origen: EJE DE LA RUEDA. La rueda gira en el plano XY (eje a lo largo de Z).
   La mesa queda hacia −X: la cuerda llega horizontal por arriba (anclaje 'arriba') y baja
   vertical por el lado +X (anclaje 'bajada'). La horquilla abraza la rueda: el eje se apoya a los
   dos lados (±Z) y la prensa queda centrada en la rueda.

   const po = Lab.piezas.polea();
   escena.add(po.grupo);
   po.grupo.position.copy(bordeDeLaMesa).sub(po.anclajes.mesa);   // la prensa queda apretada al borde
   po.girarPorLongitud(x);       // la cuerda avanzó x metros: la rueda gira x / radio
   po.anclajes.arriba            // punto donde la cuerda horizontal toca la rueda
   po.anclajes.bajada            // punto donde sale la cuerda vertical
   po.anclajes.mesa              // esquina superior del borde de la mesa que muerde la prensa
   po.anclajes.haz               // punto por defecto del haz de la fotocompuerta: entre los radios, debajo del eje
   po.instantesHaz({a:0.8})      // [{entra, sale}] exactos de cada radio en el haz, con la cuerda acelerando a 0,8 m/s²
   po.radioEnHaz()               // ¿el haz está tapado ahora? (para la escena en vivo)

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

    /* ---- horquilla y eje: el eje se apoya en los DOS lados de la rueda ----
       El brazo es una U: un brazo delante (+Z) y otro detrás (−Z) de la rueda, unidos del lado
       de la prensa por un travesaño que queda por fuera del borde de la rueda. */
    const BH = 0.012, BZ = 0.005,                                          // alto y grueso de cada brazo de la horquilla
          zB = T / 2 + 0.0015 + BZ / 2;                                    // centro de cada brazo en Z (±zB)
    const PX = -o.brazo, PG = 0.005;                                       // cara de la prensa (lado de la rueda) y grosor de su placa
    const xT0 = Math.min(-R - 0.003, PX + 0.004);                          // donde empieza el travesaño (sin tocar la rueda)
    [-1, 1].forEach(sg => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.007 - xT0, BH, BZ), plas);
      b.position.set((0.007 + xT0) / 2, 0, sg * zB); b.castShadow = true; g.add(b);
      const tu = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.002, 6), acero);
      tu.rotation.x = Math.PI / 2; tu.position.z = sg * (zB + BZ / 2 + 0.001); g.add(tu);
    });
    const trav = new THREE.Mesh(new THREE.BoxGeometry(xT0 - (PX - PG - 0.006), BH, 2 * zB + BZ), plas);   // une los dos brazos y entra en la prensa
    trav.position.set((xT0 + PX - PG - 0.006) / 2, 0, 0); trav.castShadow = true; g.add(trav);
    const eje = new THREE.Mesh(new THREE.CylinderGeometry(0.0018, 0.0018, 2 * zB + BZ + 0.004, 14), acero);
    eje.rotation.x = Math.PI / 2; g.add(eje);

    /* ---- prensa en C, apretada al borde de la mesa ---- */
    const xB = PX - PG,                                                    // borde de la mesa: la placa de la prensa lo toca por fuera
          yS = o.mesaY, yI = o.mesaY - o.mesaGrosor,                       // cara de arriba y de abajo del tablero
          ZP = 2 * zB + BZ + 0.004, MJ = 0.018, EJ = 0.005, AB = 0.008;                   // ancho de la prensa, largo y grueso de las mordazas, holgura bajo el tablero
    const caja = (sx, sy, sz, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), plas); m.position.set(x, y, z); m.castShadow = true; g.add(m); return m; };
    const yBot = yI - AB;                                                  // cara de arriba de la mordaza de abajo
    caja(PG, yS + EJ - (yBot - EJ), ZP, PX - PG / 2, (yS + EJ + yBot - EJ) / 2, 0);        // placa vertical
    caja(MJ, EJ, ZP, xB - MJ / 2 + PG, yS + EJ / 2, 0);                                       // mordaza de arriba (sobre el tablero)
    caja(MJ, EJ, ZP, xB - MJ / 2 + PG, yBot - EJ / 2, 0);                                     // mordaza de abajo
    /* tornillo de perilla: sube desde la mordaza de abajo hasta el tablero */
    const xT = xB - MJ / 2, BAJO = 0.008;
    const varilla = new THREE.Mesh(new THREE.CylinderGeometry(0.0025, 0.0025, AB + EJ + BAJO, 12), plas);
    varilla.position.set(xT, (yI + yBot - EJ - BAJO) / 2, 0); g.add(varilla);
    const zapata = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 0.002, 18), plas); zapata.position.set(xT, yI - 0.001, 0); g.add(zapata);
    const perilla = new THREE.Mesh(new THREE.CylinderGeometry(0.0065, 0.0065, 0.008, 22), plas);
    perilla.position.set(xT, yBot - EJ - BAJO - 0.004, 0); perilla.castShadow = true; g.add(perilla);
    /* perilla lateral que fija el brazo, en el frente de la placa */
    const lateral = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.006, 18), plas);
    lateral.rotation.x = Math.PI / 2; lateral.position.set(PX - PG / 2, 0, ZP / 2 + 0.003); g.add(lateral);
    const cabeza = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.0015, 10), acero);
    cabeza.rotation.x = Math.PI / 2; cabeza.position.set(PX - PG / 2, 0, ZP / 2 + 0.0065); g.add(cabeza);

    let ang = 0;
    function girar(a){ ang = a; rueda.rotation.z = -a; }                   // la cuerda avanza hacia +X por arriba: giro horario visto desde +Z

    /* Cuerda: de 'desde' (lado de la mesa) a 'hasta' (lo que cuelga), siempre tangente a la garganta.
       Tramo recto → arco sobre la rueda (pasa por arriba, sentido horario visto desde +Z) → tramo recto.
       Puntos en coordenadas del MUNDO (THREE.Vector3); la polea debe estar ya ubicada en la escena. */
    const v3 = () => new THREE.Vector3();
    function trayectoriaCuerda(desde, hasta, nArco){
      g.updateWorldMatrix(true, false);
      const a = g.worldToLocal(desde.clone()), b = g.worldToLocal(hasta.clone());
      const tang = (p, llega) => {                                         // punto de tangencia desde p
        const d = Math.hypot(p.x, p.y); if(d <= rg * 1.0001) return Math.atan2(p.y, p.x);
        const t0 = Math.atan2(p.y, p.x), al = Math.acos(rg / d);
        for(const t of [t0 + al, t0 - al]){                                // la cuerda va en el sentido horario: dirección (sen t, −cos t)
          const dx = Math.cos(t) * rg - p.x, dy = Math.sin(t) * rg - p.y, s = (dx * Math.sin(t) - dy * Math.cos(t)) * (llega ? 1 : -1);
          if(s > 0) return t;
        }
        return t0 + al;
      };
      const t1 = tang(a, true), t2 = tang(b, false);
      let barrido = t1 - t2; while(barrido < 0) barrido += 2 * Math.PI; while(barrido >= 2 * Math.PI) barrido -= 2 * Math.PI;
      const n = nArco || Math.max(4, Math.ceil(barrido / 0.08)), pts = [a];
      for(let i = 0; i <= n; i++){ const t = t1 - barrido * i / n; pts.push(v3().set(rg * Math.cos(t), rg * Math.sin(t), 0)); }
      pts.push(b);
      return pts.map(p => g.localToWorld(p));
    }
    /* Línea lista para la escena: const c = po.cuerda(desde, hasta); escena.add(c.linea); c.actualizar(desde, hasta) */
    function cuerda(desde, hasta, o2){
      o2 = Object.assign({color:0xf2f2ee}, o2 || {});
      const N = 2 + 41, geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
      const linea = new THREE.Line(geo, new THREE.LineBasicMaterial({color:o2.color})); linea.frustumCulled = false;
      function actualizar(d, h){ const p = trayectoriaCuerda(d, h, N - 3), at = geo.attributes.position; p.forEach((q, i) => at.setXYZ(i, q.x, q.y, q.z)); at.needsUpdate = true; geo.setDrawRange(0, p.length); }
      actualizar(desde, hasta);
      return {linea, actualizar};
    }
    /* ---- radios y haz de la fotocompuerta (Movimiento circular, Segunda ley) ----
       El radio k está centrado en el ángulo 2πk/n de la rueda; con la rueda girada 'ang' queda en 2πk/n − ang.
       Un haz que cruza el plano de la rueda en (radio rb, ángulo beta) —en coordenadas del grupo, beta = 0
       hacia +X, π/2 hacia arriba— queda tapado mientras |2πk/n − ang − beta| < asin(w / rb), con w la mitad
       del ancho del radio. rb debe estar entre medidas.radioHazMin y radioHazMax (zona de los radios). */
    const PI2 = 2 * Math.PI, dHaz = rb => Math.asin(Math.min(1, w / rb));
    const resto = x => ((x % PI2) + PI2) % PI2;
    function haz(o3){ o3 = Object.assign({rb:(r0 + r1) / 2, beta:-Math.PI / 2}, o3 || {}); return o3; }
    /* ¿El haz está tapado con la rueda en el ángulo 'a' (por defecto, el actual)? */
    function radioEnHaz(o3, a){
      const h = haz(o3), d = dHaz(h.rb), x = resto((a === undefined ? ang : a) + h.beta);   // el radio k tapa si ang ≈ 2πk/n − beta
      const paso = PI2 / n, m = resto(x + d) % paso;
      return m < 2 * d;
    }
    /* Intervalos de ángulo de la rueda, entre a0 y a1 (a1 > a0), en los que el haz está tapado: [{entra, sale}] */
    function angulosHaz(o3, a0, a1){
      const h = haz(o3), d = dHaz(h.rb), paso = PI2 / n, out = [];
      for(let c = Math.floor((a0 + h.beta - d) / paso) * paso - h.beta; c - d <= a1; c += paso){
        if(c + d < a0) continue; out.push({entra: Math.max(a0, c - d), sale: Math.min(a1, c + d)});
      }
      return out;
    }
    /* Instantes EXACTOS en que cada radio entra y sale del haz, si la cuerda tiene movimiento uniformemente
       variado: x(t) = v0·t + ½·a·t²  →  ang(t) = ang0 + (v0·t + ½·a·t²) / r.   o3 = {rb, beta, a, v0, ang0, tMax}
       Devuelve [{entra, sale}] en segundos: con eso se arma la señal del PhysicsSensor sin muestrear. */
    function instantesHaz(o3){
      const h = Object.assign({a:0, v0:0, ang0:0, tMax:2}, haz(o3)), al = h.a / rg, w0 = h.v0 / rg;
      const tDe = th => { const q = th - h.ang0; if(Math.abs(al) < 1e-12) return w0 > 0 ? q / w0 : Infinity;
        const disc = w0 * w0 + 2 * al * q; return disc < 0 ? Infinity : (-w0 + Math.sqrt(disc)) / al; };
      const aMax = h.ang0 + (w0 * h.tMax + 0.5 * al * h.tMax * h.tMax);
      return angulosHaz(h, h.ang0, aMax).map(i => ({entra: tDe(i.entra), sale: tDe(i.sale)})).filter(i => i.entra <= h.tMax);
    }
    return {grupo: g, rueda, girar, trayectoriaCuerda, cuerda, radioEnHaz, angulosHaz, instantesHaz,
      girarPorLongitud: x => girar(x / rg),
      angulo: () => ang,
      anclajes: {eje: new THREE.Vector3(0, 0, 0), arriba: new THREE.Vector3(0, rg, 0), bajada: new THREE.Vector3(rg, 0, 0), mesa: new THREE.Vector3(xB, yS, 0), haz: new THREE.Vector3(0, -(r0 + r1) / 2, 0)},
      medidas: {diametro: o.diametro, radio: rg, radios: n, grosor: T, brazo: o.brazo, anchoRadio: 2 * w, radioHazMin: r0, radioHazMax: r1}};
  }
  Lab.piezas = Object.assign(Lab.piezas || {}, {polea});
})();
