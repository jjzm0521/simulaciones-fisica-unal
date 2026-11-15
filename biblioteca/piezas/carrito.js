/* =====================================================================
   PIEZA · Carrito de baja fricción para colisiones
   Estado: BORRADOR · MODELO POR CONFIRMAR (falta foto). Según el monitor: cuerpo gris, extremos negros;
   uno con resorte e imanes adentro, el otro con velcro para que un carro se pegue detrás de otro.
   Medidas ESTIMADAS. Si resulta ser el PASCO PAScar (ME-6950, rojo o azul, émbolo de 3 posiciones),
   se usa color 'rojo'/'azul' y conEmbolo:true.
   Si es el PAScar, datos del fabricante: masa 250 g, cuerpo de policarbonato, ruedas de filo con rodamientos,
   émbolo de resorte de 3 posiciones, imanes en un extremo (choques elásticos) y velcro
   (choques inelásticos). Ficha: biblioteca/piezas/README.md

   Unidades: metros. Origen: CENTRO DEL CARRITO SOBRE LA PISTA (donde apoyan las ruedas, y = 0).
   El largo va a lo largo de X: el tope con IMANES (y resorte) mira a +X y el del VELCRO a −X.

   const ca = Lab.piezas.carrito();
   escena.add(ca.grupo);  ca.grupo.position.set(x, yPista, 0);
   ca.rodar(dx);            // avanzó dx metros: las ruedas giran dx / radio
   ca.embolo(2);            // émbolo en la posición 0 (adentro) a 3
   ca.anclajes.frenteImanes · frenteVelcro · frenteEmbolo · enganche (para la cuerda) · arriba (bandeja)

   Parámetros (por defecto = estimado):
     color 'gris' | 'rojo' | 'azul'
     conEmbolo false  émbolo de resorte en el extremo −X (el del PAScar)
     largo 0.175, ancho 0.077 (del cuerpo; las ruedas van por debajo, metidas), alto 0.045
     masas 0          barras de masa sobre la bandeja (0, 1 o 2), solo visual
     embolo 0         posición inicial del émbolo (0 a 3)
   ===================================================================== */
(function(){
  'use strict';
  const Lab = window.Lab = window.Lab || {};
  const COL = {gris:0x9aa1a9, rojo:0xc8282e, azul:0x2459c6};

  function carrito(o){
    o = Object.assign({color:'gris', largo:0.175, ancho:0.077, alto:0.045, masas:0, embolo:0, conEmbolo:false}, o || {});
    const g = new THREE.Group(); g.name = 'carrito';
    const cuerpoM = new THREE.MeshStandardMaterial({color:COL[o.color] || o.color, roughness:0.35, metalness:0.05});
    const negro = new THREE.MeshStandardMaterial({color:0x1a1d22, roughness:0.55});
    const acero = new THREE.MeshStandardMaterial({color:0xc4cad1, roughness:0.28, metalness:0.85});
    const gris = new THREE.MeshStandardMaterial({color:0x8a9099, roughness:0.6});
    const L = o.largo, W = o.ancho, RR = 0.012, RE = 0.003,                 // radio y grosor de rueda
          BW = W - 0.003, y0 = 0.006, y1 = o.alto;                          // ancho del cuerpo (las ruedas van DEBAJO, metidas), base y techo

    /* cuerpo: perfil lateral con esquinas redondeadas, extruido a lo ancho */
    const TP = 0.012, s = new THREE.Shape(), rC = 0.006, xa = -L / 2 + TP, xb = L / 2 - TP;   // TP: largo de cada tope negro
    s.moveTo(xa + rC, y0); s.lineTo(xb - rC, y0); s.quadraticCurveTo(xb, y0, xb, y0 + rC); s.lineTo(xb, y1 - rC); s.quadraticCurveTo(xb, y1, xb - rC, y1);
    s.lineTo(xa + rC, y1); s.quadraticCurveTo(xa, y1, xa, y1 - rC); s.lineTo(xa, y0 + rC); s.quadraticCurveTo(xa, y0, xa + rC, y0);
    const cg = new THREE.ExtrudeGeometry(s, {depth:BW, bevelEnabled:true, bevelSize:0.0015, bevelThickness:0.0015, bevelSegments:2}); cg.translate(0, 0, -BW / 2);
    const cuerpo = new THREE.Mesh(cg, cuerpoM); cuerpo.castShadow = true; cuerpo.receiveShadow = true; g.add(cuerpo);
    /* bandeja: hueco poco profundo arriba, donde van las barras de masa */
    const bandeja = new THREE.Mesh(new THREE.BoxGeometry(L - 0.03, 0.0012, BW - 0.014), new THREE.MeshStandardMaterial({color:new THREE.Color(COL[o.color] || o.color).multiplyScalar(0.7), roughness:0.5}));
    bandeja.position.set(0, y1 + 0.0009, 0); g.add(bandeja);
    [-0.045, 0, 0.045].forEach(x => { const h = new THREE.Mesh(new THREE.CylinderGeometry(0.0028, 0.0028, 0.0006, 14), negro); h.position.set(x, y1 + 0.0016, 0); g.add(h); });   // tres agujeros para accesorios

    /* ruedas de filo, con su eje (giran juntas) */
    const ruedas = [], ejeX = L / 2 - 0.028;
    [-ejeX, ejeX].forEach(x => [-1, 1].forEach(sz => {
      const r = new THREE.Group(); r.position.set(x, RR, sz * (W / 2 - 0.011));   // ruedas por dentro del cuerpo: solo asoma la parte de abajo
      const llanta = new THREE.Mesh(new THREE.CylinderGeometry(RR, RR, RE, 28), negro); llanta.rotation.x = Math.PI / 2; r.add(llanta);
      const cubo = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, RE + 0.0008, 14), gris); cubo.rotation.x = Math.PI / 2; r.add(cubo);
      const marca = new THREE.Mesh(new THREE.BoxGeometry(0.0015, RR * 0.9, 0.0004), gris); marca.position.set(0, RR * 0.5, sz * (RE / 2 + 0.0002)); r.add(marca);
      g.add(r); ruedas.push(r);
    }));

    /* topes negros en los dos extremos: el de +X tiene resorte e imanes adentro; el de −X lleva el velcro */
    const tope = (sx) => { const t = new THREE.Mesh(new THREE.BoxGeometry(TP, y1 - y0 - 0.004, BW + 0.002), negro); t.position.set(sx * (L / 2 - TP / 2), (y0 + y1) / 2, 0); t.castShadow = true; g.add(t);
      const cara = new THREE.Mesh(new THREE.BoxGeometry(0.003, y1 - y0 - 0.012, BW - 0.012), negro); cara.position.set(sx * (L / 2 + 0.0015), (y0 + y1) / 2, 0); g.add(cara); return t; };
    tope(1); tope(-1);
    const xbF = L / 2 + 0.003, xaF = -L / 2 - 0.003;                       // caras exteriores de los topes
    /* extremo +X: dos imanes (choques elásticos) */
    [-1, 1].forEach(sz => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.003, 20), negro); m.rotation.z = Math.PI / 2; m.material = new THREE.MeshStandardMaterial({color:0x4a4f57, roughness:0.4, metalness:0.6}); m.position.set(xbF + 0.0015, (y0 + y1) / 2, sz * 0.018); g.add(m); });
    /* extremo −X: velcro para enganchar un carro detrás de otro (y émbolo opcional, conEmbolo:true) */
    const velcro = new THREE.Mesh(new THREE.BoxGeometry(0.002, 0.016, 0.036), new THREE.MeshStandardMaterial({color:0xe9e4d6, roughness:1})); velcro.position.set(xaF - 0.001, (y0 + y1) / 2, 0); g.add(velcro);
    const emb = new THREE.Group(); emb.visible = !!o.conEmbolo; g.add(emb);
    const varilla = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.04, 14), acero); varilla.rotation.z = Math.PI / 2; emb.add(varilla);
    const punta = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.004, 18), negro); punta.rotation.z = Math.PI / 2; punta.position.x = -0.02; emb.add(punta);
    const yE = (y0 + y1) / 2;
    const disparador = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.003, 0.012), negro); disparador.position.set(xa + 0.02, y1 + 0.0025, 0); disparador.visible = !!o.conEmbolo; g.add(disparador);

    /* barras de masa (visual) */
    for(let i = 0; i < Math.min(2, o.masas); i++){
      const b = new THREE.Mesh(new THREE.BoxGeometry(L - 0.04, 0.012, BW - 0.02), acero); b.position.set(0, y1 + 0.0015 + 0.006 + i * 0.0125, 0); b.castShadow = true; g.add(b);
    }

    let pos = 0, giro = 0;
    function embolo(n){ pos = Math.max(0, Math.min(3, Math.round(n))); emb.position.set(xaF + 0.02 - 0.002 - 0.006 * pos, yE, 0); }   // cada posición saca 6 mm más (estimado)
    function rodar(dx){ giro += dx / RR; ruedas.forEach(r => { r.rotation.z = -giro; }); }
    embolo(o.embolo);
    return {grupo: g, rodar, embolo, posicionEmbolo: () => pos,
      anclajes: {frenteImanes: new THREE.Vector3(xbF + 0.003, yE, 0), frenteVelcro: new THREE.Vector3(xaF - 0.002, yE, 0), frenteEmbolo: new THREE.Vector3(xaF, yE, 0), enganche: new THREE.Vector3(xbF, yE, 0), arriba: new THREE.Vector3(0, y1 + 0.0015, 0)},
      medidas: {largo: L, ancho: W, alto: y1, radioRueda: RR, masa: 0.250}};
  }
  Lab.piezas = Object.assign(Lab.piezas || {}, {carrito});
})();
