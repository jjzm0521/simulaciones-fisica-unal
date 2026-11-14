/* =====================================================================
   PIEZA · Regla cebra (dos tipos: acrílico con cauchitos y lámina de metal ranurada)
   Estado: BORRADOR · paso de 1 cm y 15 franjas (dato de los monitores); demás medidas
   estimadas de foto. Ficha: biblioteca/piezas/README.md

   La regla cuelga de la cuerda (o cae libre) y pasa por el haz de una fotocompuerta:
     - acrilico: placa transparente; 15 cauchitos (ligas de colores) atravesados cada 1 cm.
                 Cada cauchito TAPA el haz; el acrílico lo deja pasar.
     - metal:    lámina de acero un poco más ancha con 15 ranuras cada 1 cm.
                 El metal TAPA el haz; cada ranura lo deja pasar.
   Las dos tienen casi el mismo largo y un agujero arriba para la cuerda.

   Unidades: metros. Origen: AGUJERO DE LA CUERDA. La regla baja a lo largo de −Y; ancho en X; grosor en Z
   (el haz de la fotocompuerta la cruza a lo largo de Z).

   const rc = Lab.piezas.reglaCebra({tipo:'acrilico'});
   escena.add(rc.grupo);  rc.grupo.position.copy(puntoDeLaCuerda);
   rc.franjas              // distancias (m) bajo el agujero del centro de cada franja: 0,025 … 0,165
   rc.tapaEn(d)            // ¿tapa el haz si el haz cruza la regla a d metros bajo el agujero?
   rc.intervalosTapados()  // [[d0, d1], …] tramos que tapan el haz, de arriba hacia abajo

   Parámetros:
     tipo 'acrilico' | 'metal'
     n 15, paso 0.01          número de franjas y separación (dato)
     primera 0.025            distancia del agujero a la primera franja (estimado)
     ancho 0.025 (acrílico) / 0.030 (metal), largo 0.185 (estimados)
     franja 0.0018 (ancho del cauchito) · ranura 0.003 (ancho de la ranura del metal) (estimados: medir)
   ===================================================================== */
(function(){
  'use strict';
  const Lab = window.Lab = window.Lab || {};
  const LIGAS = [0xd8264a, 0xe0457b, 0x2f9a55, 0xd8264a, 0xec6aa0, 0x2f9a55];

  function reglaCebra(o){
    const met = o && o.tipo === 'metal';
    o = Object.assign({tipo:'acrilico', n:15, paso:0.01, primera:0.025, ancho:met ? 0.030 : 0.025, largo:0.185, franja:0.0018, ranura:0.003}, o || {});
    const g = new THREE.Group(); g.name = 'reglaCebra';
    const W = o.ancho, Lg = o.largo, T = met ? 0.0012 : 0.003, top = 0.008;   // el agujero queda 8 mm bajo el borde de arriba
    const franjas = []; for(let k = 0; k < o.n; k++) franjas.push(o.primera + k * o.paso);
    const rect = (p, x0, y0, x1, y1) => { p.moveTo(x0, y0); p.lineTo(x1, y0); p.lineTo(x1, y1); p.lineTo(x0, y1); p.lineTo(x0, y0); };
    const hole = (cx, cy, r) => { const h = new THREE.Path(); h.absarc(cx, cy, r, 0, Math.PI * 2, true); return h; };

    /* placa: contorno redondeado con el agujero de la cuerda; en el metal, además, las ranuras */
    const s = new THREE.Shape(), rC = 0.003, xa = -W / 2, xb = W / 2, ya = -Lg + top, yb = top;
    s.moveTo(xa + rC, ya); s.lineTo(xb - rC, ya); s.quadraticCurveTo(xb, ya, xb, ya + rC); s.lineTo(xb, yb - rC); s.quadraticCurveTo(xb, yb, xb - rC, yb);
    s.lineTo(xa + rC, yb); s.quadraticCurveTo(xa, yb, xa, yb - rC); s.lineTo(xa, ya + rC); s.quadraticCurveTo(xa, ya, xa + rC, ya);
    s.holes.push(hole(0, 0, 0.0018));
    if(met) franjas.forEach(d => { const p = new THREE.Path(); rect(p, -W / 2 + 0.005, -d - o.ranura / 2, W / 2 - 0.005, -d + o.ranura / 2); s.holes.push(p); });
    else for(let k = 0; k <= o.n; k++){                                   // ventanas del acrílico entre cauchitos (escalerita)
      const yT = k === 0 ? -0.012 : -(franjas[k - 1] + 0.002), yB = k === o.n ? -(franjas[o.n - 1] + 0.010) : -(franjas[k] - 0.002);
      if(yT - yB > 0.002){ const p = new THREE.Path(); rect(p, -W / 2 + 0.003, yB, W / 2 - 0.003, yT); s.holes.push(p); }
    }
    const geo = new THREE.ExtrudeGeometry(s, {depth:T, bevelEnabled:false, curveSegments:16}); geo.translate(0, 0, -T / 2);
    const mat = met ? new THREE.MeshStandardMaterial({color:0xc3c9d0, roughness:0.4, metalness:0.35, side:THREE.DoubleSide})
                    : new THREE.MeshPhysicalMaterial({color:0xeef6fa, roughness:0.08, transparent:true, opacity:0.35, metalness:0, side:THREE.DoubleSide, depthWrite:false});
    const placa = new THREE.Mesh(geo, mat); placa.castShadow = met; g.add(placa);

    /* cauchitos: cada uno abraza la placa (franja delante y detrás) y asoma por los bordes */
    if(!met) franjas.forEach((d, k) => {
      const m = new THREE.MeshStandardMaterial({color:LIGAS[k % LIGAS.length], roughness:0.7});
      [-1, 1].forEach(sz => { const b = new THREE.Mesh(new THREE.BoxGeometry(W + 0.001, o.franja, 0.0008), m); b.position.set(0, -d, sz * (T / 2 + 0.0004)); g.add(b); });
      [-1, 1].forEach(sx => { const b = new THREE.Mesh(new THREE.BoxGeometry(0.0008, o.franja, T + 0.0016), m); b.position.set(sx * (W / 2 + 0.0004), -d, 0); g.add(b); });
    });

    /* tramos que tapan el haz, medidos hacia abajo desde el agujero */
    const bordeArriba = -top, bordeAbajo = Lg - top;                     // en distancias d (positivas hacia abajo)
    let tapados;
    if(met){ tapados = []; let d0 = bordeArriba; franjas.forEach(d => { tapados.push([d0, d - o.ranura / 2]); d0 = d + o.ranura / 2; }); tapados.push([d0, bordeAbajo]); }
    else tapados = franjas.map(d => [d - o.franja / 2, d + o.franja / 2]);
    const tapaEn = d => tapados.some(([a, b]) => d >= a && d <= b);
    return {grupo: g, franjas: franjas.slice(), tapaEn, intervalosTapados: () => tapados.map(x => x.slice()),
      anclajes: {cuelgue: new THREE.Vector3(0, 0, 0), primera: new THREE.Vector3(0, -franjas[0], 0), abajo: new THREE.Vector3(0, -bordeAbajo, 0)},
      medidas: {tipo: o.tipo, n: o.n, paso: o.paso, ancho: W, largo: Lg, grosor: T, franja: o.franja, ranura: o.ranura}};
  }
  Lab.piezas = Object.assign(Lab.piezas || {}, {reglaCebra});
})();
