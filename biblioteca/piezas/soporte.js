/* =====================================================================
   PIEZA · Soporte universal (base de hierro + varilla + nuez + brazo)
   Estado: BORRADOR · medidas estimadas de una foto del laboratorio (mesa 9a).
   Ficha: biblioteca/piezas/README.md

   Sostiene casi todo en el laboratorio: fotocompuerta, péndulo, resorte, polea.
   Unidades: metros. Origen: pie de la varilla, sobre la mesa. La varilla sube por +Y.

   const s = Lab.piezas.soporte({alto:0.60, alturaNuez:0.30, brazo:0.20, direccion:'z+'});
   escena.add(s.grupo);  s.grupo.position.set(x, alturaDeLaMesa, z);
   s.anclajes.brazo      -> punta del brazo (ahí se cuelga la otra pieza), en coordenadas del grupo
   s.anclajes.nuez       -> centro de la nuez
   s.anclajes.cima       -> punta de la varilla

   Parámetros (por defecto):
     alto 0.60         largo de la varilla vertical
     alturaNuez 0.30   altura de la nuez (y del brazo) sobre la mesa
     brazo 0.20        largo del brazo desde la varilla; 0 = sin brazo ni nuez
     direccion 'z+'    hacia dónde sale el brazo: 'x+', 'x-', 'z+', 'z-'
     base 'x-'         hacia dónde se extiende la placa desde la varilla (la varilla va cerca de un extremo)
     margen 0.03       distancia de la varilla a ese extremo de la placa
   ===================================================================== */
(function(){
  'use strict';
  const Lab = window.Lab = window.Lab || {};
  const DIR = {'x+':[1,0],'x-':[-1,0],'z+':[0,1],'z-':[0,-1]};

  function soporte(o){
    o = Object.assign({alto:0.60, alturaNuez:0.30, brazo:0.20, direccion:'z+', base:'x-', margen:0.03}, o || {});
    const g = new THREE.Group(); g.name = 'soporte';
    const hierro = new THREE.MeshStandardMaterial({color:0x23262b, roughness:0.75, metalness:0.35});
    const acero  = new THREE.MeshStandardMaterial({color:0xc3c9d0, roughness:0.28, metalness:0.85});
    const zamak  = new THREE.MeshStandardMaterial({color:0x8d949c, roughness:0.45, metalness:0.7});
    const malla = (geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; g.add(m); return m; };

    /* base: placa de hierro fundido 22 × 14 × 1,4 cm; la varilla entra a 3 cm de un extremo */
    const BL = 0.22, BA = 0.14, BH = 0.014, [bx, bz] = DIR[o.base] || DIR['x-'];
    const placa = malla(new THREE.BoxGeometry(bx ? BL : BA, BH, bx ? BA : BL), hierro, bx * (BL / 2 - o.margen), BH / 2, bz * (BL / 2 - o.margen));
    placa.name = 'base';
    malla(new THREE.CylinderGeometry(0.011, 0.014, 0.012, 20), hierro, 0, BH + 0.006, 0);          // casquillo de la varilla
    /* varilla vertical de 10 mm */
    malla(new THREE.CylinderGeometry(0.005, 0.005, o.alto, 16), acero, 0, o.alto / 2, 0).name = 'varilla';

    const anclajes = {cima: new THREE.Vector3(0, o.alto, 0), nuez: new THREE.Vector3(0, o.alturaNuez, 0), brazo: new THREE.Vector3(0, o.alturaNuez, 0)};
    if(o.brazo > 0){
      const [dx, dz] = DIR[o.direccion] || DIR['z+'], y = o.alturaNuez;
      /* nuez doble: bloque con dos mariposas, une la varilla con el brazo */
      malla(new THREE.BoxGeometry(0.026, 0.03, 0.026), zamak, 0, y, 0).name = 'nuez';
      const mariposa = (x, yy, z, eje) => { const m = malla(new THREE.CylinderGeometry(0.007, 0.007, 0.016, 12), zamak, x, yy, z); if(eje === 'x') m.rotation.z = Math.PI / 2; else m.rotation.x = Math.PI / 2; };
      mariposa(-dz * 0.02, y + 0.006, dx * 0.02, dz ? 'x' : 'z');      // aprieta la varilla
      mariposa(dx * 0.012, y + 0.022, dz * 0.012, 'y');                // aprieta el brazo
      /* brazo horizontal de 8 mm: sobresale 3 cm por detrás de la nuez */
      const L = o.brazo + 0.03, b = malla(new THREE.CylinderGeometry(0.004, 0.004, L, 14), acero, dx * (o.brazo - 0.03) / 2, y, dz * (o.brazo - 0.03) / 2);
      if(dx) b.rotation.z = Math.PI / 2; else b.rotation.x = Math.PI / 2; b.name = 'brazo';
      anclajes.brazo = new THREE.Vector3(dx * o.brazo, y, dz * o.brazo);
    }
    return {grupo: g, anclajes, medidas: {alto: o.alto, alturaNuez: o.alturaNuez, brazo: o.brazo, base: [BL, BH, BA]}};
  }
  Lab.piezas = Object.assign(Lab.piezas || {}, {soporte});
})();
