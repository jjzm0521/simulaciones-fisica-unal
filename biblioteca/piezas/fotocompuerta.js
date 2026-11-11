/* =====================================================================
   PIEZA · Fotocompuerta (cuerpo amarillo en C, impreso en 3D)
   Estado: BORRADOR · forma y medidas estimadas de una foto del laboratorio (pieza 7a).
   Ficha: biblioteca/piezas/README.md

   Un lomo largo, dos brazos y dos mordazas enfrentadas: en una va el emisor y en la otra
   el receptor. El haz cruza entre las mordazas. Encima del lomo va el bloque de sujeción,
   por donde pasa el brazo del soporte (Lab.piezas.soporte).

   Unidades: metros. Origen: CENTRO DEL HAZ. El haz va a lo largo de Z. El lomo queda arriba (+Y).
   Para otra orientación se gira el grupo (por ejemplo, boca hacia un lado para la polea).

   const fc = Lab.piezas.fotocompuerta({abertura:0.07});
   escena.add(fc.grupo);  fc.grupo.position.copy(puntoDondeDebePasarElHaz);
   fc.bloquear(true);            // haz interrumpido: se atenúa y el LED pasa a ámbar
   fc.anclajes.haz               // (0,0,0)
   fc.anclajes.sujecion          // centro del bloque de sujeción: ahí llega el brazo del soporte (entra a lo largo de Z)

   Parámetros (por defecto = pieza real estimada):
     abertura 0.07   distancia libre entre mordazas (largo del haz)
     alto 0.055      del haz a la cara interior del lomo (lo que cabe debajo)
     color 0xffd500
     etiqueta ''     texto de la calcomanía del lomo (p. ej. '7a')
   ===================================================================== */
(function(){
  'use strict';
  const Lab = window.Lab = window.Lab || {};

  function fotocompuerta(o){
    o = Object.assign({abertura:0.07, alto:0.055, color:0xffd500, etiqueta:''}, o || {});
    const g = new THREE.Group(); g.name = 'fotocompuerta';
    const GR = 0.024,            // grosor del cuerpo (a lo largo de X)
          BR = 0.022,            // ancho de cada brazo
          MO = 0.018,            // cuánto entra cada mordaza
          MH = 0.03,             // alto de la mordaza
          LO = 0.03;             // alto del lomo
    const a = o.abertura / 2, hi = a + MO, ho = hi + BR, yS = o.alto, yT = yS + LO, yb = -MH / 2, yt = MH / 2;
    const cuerpoM = new THREE.MeshStandardMaterial({color:o.color, roughness:0.55, metalness:0.02});
    const negro = new THREE.MeshStandardMaterial({color:0x1b1f27, roughness:0.35});
    const acero = new THREE.MeshStandardMaterial({color:0xc3c9d0, roughness:0.28, metalness:0.85});

    /* cuerpo en C: perfil en el plano (Z,Y), con grosor a lo largo de X */
    const s = new THREE.Shape();
    [[-ho,yT],[ho,yT],[ho,yb],[a,yb],[a,yt],[hi,yt],[hi,yS],[-hi,yS],[-hi,yt],[-a,yt],[-a,yb],[-ho,yb]].forEach((p, i) => i ? s.lineTo(p[0], p[1]) : s.moveTo(p[0], p[1]));
    const geo = new THREE.ExtrudeGeometry(s, {depth:GR, bevelEnabled:true, bevelSize:0.0012, bevelThickness:0.0012, bevelSegments:2});
    geo.translate(0, 0, -GR / 2); geo.rotateY(Math.PI / 2);
    const cuerpo = new THREE.Mesh(geo, cuerpoM); cuerpo.castShadow = true; cuerpo.receiveShadow = true; cuerpo.name = 'cuerpo'; g.add(cuerpo);

    /* emisor y receptor, en la cara interior de cada mordaza */
    [-1, 1].forEach(sg => { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.003, 14), negro); l.rotation.x = Math.PI / 2; l.position.set(0, 0, sg * (a - 0.0005)); g.add(l); });
    /* haz */
    const haz = new THREE.Mesh(new THREE.CylinderGeometry(0.0016, 0.0016, o.abertura, 8), new THREE.MeshBasicMaterial({color:0xe11d2e, transparent:true}));
    haz.rotation.x = Math.PI / 2; haz.name = 'haz'; g.add(haz);
    /* LED de estado, en el frente del lomo */
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.003, 10, 8), new THREE.MeshBasicMaterial({color:0x3ad16a}));
    led.position.set(GR / 2 + 0.0015, yS + LO / 2, -ho + 0.014); led.name = 'led'; g.add(led);

    /* bloque de sujeción sobre el lomo, con su tornillo; el brazo del soporte lo atraviesa a lo largo de Z */
    const BL = 0.034, BH = 0.036, yM = yT + BH / 2;
    const bloque = new THREE.Mesh(new THREE.BoxGeometry(GR + 0.006, BH, BL), cuerpoM); bloque.position.set(0, yM, 0); bloque.castShadow = true; g.add(bloque);
    const tornillo = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.014, 12), acero); tornillo.rotation.z = Math.PI / 2; tornillo.position.set(GR / 2 + 0.01, yM, 0); g.add(tornillo);

    /* calcomanía con el número de la pieza */
    if(o.etiqueta){
      const c = document.createElement('canvas'); c.width = 128; c.height = 80; const x = c.getContext('2d');
      x.fillStyle = '#fff'; x.fillRect(0, 0, 128, 80); x.fillStyle = '#111'; x.font = '700 54px "IBM Plex Sans",Arial,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(o.etiqueta, 64, 43);
      const e = new THREE.Mesh(new THREE.PlaneGeometry(0.03, 0.019), new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c)}));
      e.rotation.y = Math.PI / 2; e.position.set(GR / 2 + 0.0016, yS + LO / 2, ho - 0.035); g.add(e);
    }

    function bloquear(si){
      haz.material.color.set(si ? 0x6b7a88 : 0xe11d2e); haz.material.opacity = si ? 0.25 : 1;
      led.material.color.set(si ? 0xffb020 : 0x3ad16a);
    }
    return {grupo: g, haz, led, bloquear,
      anclajes: {haz: new THREE.Vector3(0, 0, 0), sujecion: new THREE.Vector3(0, yM, 0)},
      medidas: {abertura: o.abertura, ancho: 2 * ho, alto: yT - yb, grosor: GR}};
  }
  Lab.piezas = Object.assign(Lab.piezas || {}, {fotocompuerta});
})();
