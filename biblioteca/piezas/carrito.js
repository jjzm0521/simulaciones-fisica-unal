/* =====================================================================
   PIEZA · Carrito de baja fricción con émbolo (PASCO Plunger Cart, ME-9430)
   Estado: BORRADOR · forma según el manual de PASCO (012-14781C); medidas ESTIMADAS de las
   proporciones de la foto (PASCO no publica dimensiones). Ficha: biblioteca/piezas/README.md

   Del manual: carrito de 500 g, cuerpo de aluminio en forma de bandeja (los del laboratorio son
   grises; los nuevos, azules) y tapas de ABS negro en los extremos. Ruedas con rodamientos que se
   esconden en el cuerpo y encajan en las ranuras de las pistas PASCO. Un extremo trae imanes (choques
   elásticos); el otro, el émbolo de resorte de 3 posiciones con su gatillo arriba, dos parches de
   velcro (choques inelásticos) y el punto de amarre de abajo. Cada tapa tiene arriba un punto de
   amarre; en la bandeja, una ranura para la cerca (picket fence) y agujeros roscados. Su pareja sin
   émbolo es el Collision Cart (ME-9454, rojo): conEmbolo:false.

   Unidades: metros. Origen: CENTRO DEL CARRITO SOBRE LA PISTA (donde apoyan las ruedas, y = 0).
   El largo va a lo largo de X: el extremo de los IMANES mira a +X; el del ÉMBOLO y el velcro, a −X.

   const ca = Lab.piezas.carrito();
   escena.add(ca.grupo);  ca.grupo.position.set(x, yPista, 0);
   ca.rodar(dx);            // avanzó dx metros: las ruedas giran dx / radio
   ca.embolo(2);            // émbolo en la posición 0 (adentro) a 3
   ca.anclajes.frenteImanes · frenteEmbolo() (punta del émbolo) · frenteVelcro · amarreArriba · amarreAbajo · arriba (bandeja)

   Parámetros (por defecto = estimado):
     color 'gris' | 'azul' | 'rojo'   aluminio anodizado
     largo 0.175, ancho 0.10, alto 0.05
     conEmbolo true    false = Collision Cart (sin émbolo ni gatillo)
     embolo 0          posición inicial (0 a 3)
     masas 0           barras de masa en la bandeja (0 a 2), solo visual
   ===================================================================== */
(function(){
  'use strict';
  const Lab = window.Lab = window.Lab || {};
  const COL = {gris:0xa9b1ba, azul:0x2a63c9, rojo:0xc22a2f};

  function carrito(o){
    o = Object.assign({color:'gris', largo:0.175, ancho:0.10, alto:0.05, conEmbolo:true, embolo:0, masas:0}, o || {});
    const g = new THREE.Group(); g.name = 'carrito';
    const alu = new THREE.MeshStandardMaterial({color:COL[o.color] || o.color, roughness:0.45, metalness:0.2});
    const abs = new THREE.MeshStandardMaterial({color:0x17191d, roughness:0.55});
    const acero = new THREE.MeshStandardMaterial({color:0xc4cad1, roughness:0.28, metalness:0.85});
    const velM = new THREE.MeshStandardMaterial({color:0x2a2c30, roughness:1});
    const L = o.largo, W = o.ancho, H = o.alto,
          TC = 0.017,                    // largo de cada tapa de ABS
          LB = L - 2 * TC,               // largo del cuerpo de aluminio
          yB = 0.006,                    // borde de abajo de costados y tapas (las ruedas asoman debajo)
          yF = 0.028,                    // piso de la bandeja: por encima de las ruedas, que quedan dentro del cuerpo
          ES = 0.0025,                   // espesor de las paredes de aluminio
          RR = 0.0125, RE = 0.006;       // radio y ancho de cada rueda

    const caja = (sx, sy, sz, x, y, z, m) => { const k = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), m); k.position.set(x, y, z); k.castShadow = true; k.receiveShadow = true; g.add(k); return k; };

    /* cuerpo de aluminio en bandeja: piso, dos costados y un reborde arriba en cada costado */
    const yT = H - 0.004;                // borde superior de los costados
    caja(LB, ES, W - 2 * ES, 0, yF + ES / 2, 0, alu);                                   // piso de la bandeja
    [-1, 1].forEach(sz => {
      caja(LB, yT - yB, ES, 0, (yB + yT) / 2, sz * (W / 2 - ES / 2), alu);              // costado
      caja(LB, ES, 0.009, 0, yT - ES / 2, sz * (W / 2 - 0.0045), alu);                  // reborde hacia adentro
    });
    caja(LB, 0.0008, W - 2 * ES - 0.002, 0, yF + ES + 0.0004, 0, new THREE.MeshStandardMaterial({color:new THREE.Color(COL[o.color] || o.color).multiplyScalar(0.8), roughness:0.5, metalness:0.4}));   // fondo de la bandeja
    [-0.03, 0.03].forEach(x => { const h = new THREE.Mesh(new THREE.CylinderGeometry(0.0026, 0.0026, 0.001, 14), abs); h.position.set(x, yF + ES + 0.0009, 0); g.add(h); });   // agujeros roscados
    caja(0.012, 0.0009, 0.004, LB / 2 - 0.02, yT + 0.0001, W / 2 - 0.0045, abs);        // ranura para la cerca (picket fence)

    /* tapas de ABS: bloque con esquinas redondeadas, un poco más alto que los costados */
    const tapaShape = (() => { const s = new THREE.Shape(), r = 0.006, a = -W / 2, b = W / 2, y0 = yB - 0.001, y1 = H;
      s.moveTo(a + r, y0); s.lineTo(b - r, y0); s.quadraticCurveTo(b, y0, b, y0 + r); s.lineTo(b, y1 - r); s.quadraticCurveTo(b, y1, b - r, y1);
      s.lineTo(a + r, y1); s.quadraticCurveTo(a, y1, a, y1 - r); s.lineTo(a, y0 + r); s.quadraticCurveTo(a, y0, a + r, y0); return s; })();
    const tapa = sx => {
      const geo = new THREE.ExtrudeGeometry(tapaShape, {depth:TC, bevelEnabled:true, bevelSize:0.0015, bevelThickness:0.0015, bevelSegments:2});
      geo.translate(0, 0, -TC / 2); geo.rotateY(Math.PI / 2);
      const m = new THREE.Mesh(geo, abs); m.position.x = sx * (LB / 2 + TC / 2); m.castShadow = true; g.add(m);
      /* punto de amarre de arriba: pestaña con agujero sobre la tapa */
      caja(0.006, 0.006, 0.012, sx * (LB / 2 + TC / 2), H + 0.003, 0, abs);
      const ag = new THREE.Mesh(new THREE.CylinderGeometry(0.0016, 0.0016, 0.007, 10), acero); ag.rotation.z = Math.PI / 2; ag.position.set(sx * (LB / 2 + TC / 2), H + 0.0035, 0); g.add(ag);
    };
    tapa(1); tapa(-1);
    const xFI = LB / 2 + TC + 0.0015, xFE = -(LB / 2 + TC + 0.0015);   // caras exteriores de las tapas
    const yC = (yB + H) / 2;

    /* extremo +X: imanes (dentro de la tapa; se ven sus caras) */
    [-1, 1].forEach(sz => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.0055, 0.0055, 0.001, 20), new THREE.MeshStandardMaterial({color:0x50555d, roughness:0.4, metalness:0.6}));
      m.rotation.z = Math.PI / 2; m.position.set(xFI + 0.0002, yC + 0.006, sz * 0.026); g.add(m); });

    /* extremo −X: dos parches de velcro a los lados del émbolo y punto de amarre de abajo */
    [-1, 1].forEach(sz => caja(0.0016, 0.022, 0.024, xFE - 0.0008, yC, sz * 0.03, velM));
    const amarreAb = new THREE.Mesh(new THREE.TorusGeometry(0.0022, 0.0007, 6, 14), acero); amarreAb.rotation.y = Math.PI / 2; amarreAb.position.set(xFE - 0.0008, yB + 0.004, 0); g.add(amarreAb);

    /* émbolo de resorte: varilla de acero con tope negro; gatillo arriba de la tapa */
    const emb = new THREE.Group(); emb.visible = !!o.conEmbolo; g.add(emb);
    const varilla = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0035, 0.05, 16), acero); varilla.rotation.z = Math.PI / 2; varilla.position.x = 0.025; emb.add(varilla);
    const punta = new THREE.Mesh(new THREE.CylinderGeometry(0.0075, 0.0075, 0.005, 22), abs); punta.rotation.z = Math.PI / 2; punta.position.x = -0.0025; emb.add(punta);
    const gat = new THREE.Group(); gat.visible = !!o.conEmbolo; g.add(gat);
    const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.0022, 0.0022, 0.008, 12), acero); poste.position.set(-(LB / 2 + 0.006), H + 0.004, -0.012); gat.add(poste);
    const boton = new THREE.Mesh(new THREE.SphereGeometry(0.0035, 14, 10), abs); boton.position.set(-(LB / 2 + 0.006), H + 0.0085, -0.012); gat.add(boton);

    /* ruedas: metidas en el cuerpo, solo asoma la parte de abajo; encajan en las ranuras de la pista */
    const ruedas = [], ejeX = LB / 2 - 0.016, zR = W / 2 - 0.014;
    [-ejeX, ejeX].forEach(x => [-1, 1].forEach(sz => {
      const r = new THREE.Group(); r.position.set(x, RR, sz * zR);
      const llanta = new THREE.Mesh(new THREE.CylinderGeometry(RR, RR, RE, 28), new THREE.MeshStandardMaterial({color:0x2b2f36, roughness:0.5})); llanta.rotation.x = Math.PI / 2; r.add(llanta);
      const cubo = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, RE + 0.0006, 14), acero); cubo.rotation.x = Math.PI / 2; r.add(cubo);
      g.add(r); ruedas.push(r);
    }));

    /* barras de masa en la bandeja (visual; las ME-6757A son de 500 g según PASCO) */
    for(let i = 0; i < Math.min(2, o.masas); i++) caja(LB - 0.012, 0.012, W - 0.024, 0, yF + ES + 0.001 + 0.006 + i * 0.0125, 0, acero);

    let pos = 0, giro = 0;
    /* cada posición saca la varilla un poco más (manual: 3 muescas; distancias estimadas) */
    function embolo(n){ pos = Math.max(0, Math.min(3, Math.round(n))); emb.position.set(xFE - [0.004, 0.012, 0.02, 0.028][pos], yC - 0.002, 0); }
    function rodar(dx){ giro += dx / RR; ruedas.forEach(r => { r.rotation.z = -giro; }); }
    embolo(o.embolo);
    return {grupo: g, rodar, embolo, posicionEmbolo: () => pos,
      anclajes: {frenteImanes: new THREE.Vector3(xFI, yC, 0), frenteEmbolo: () => new THREE.Vector3(emb.position.x - 0.005, yC - 0.002, 0),
        frenteVelcro: new THREE.Vector3(xFE - 0.0016, yC, 0), amarreArriba: new THREE.Vector3(LB / 2 + TC / 2, H + 0.0035, 0),
        amarreAbajo: new THREE.Vector3(xFE - 0.0008, yB + 0.004, 0), arriba: new THREE.Vector3(0, yF + ES + 0.001, 0)},
      medidas: {largo: L, ancho: W, alto: H, radioRueda: RR, masa: 0.500}};
  }
  Lab.piezas = Object.assign(Lab.piezas || {}, {carrito});
})();
