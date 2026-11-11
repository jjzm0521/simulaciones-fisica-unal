/* =====================================================================
   RÓTULOS LEGIBLES · biblioteca compartida (F1 y F3)
   Los rótulos de la escena son THREE.Sprite con tamaño en metros: al acercar
   la cámara crecen hasta tapar el montaje y al alejarla no se leen.
   Esta función los mantiene entre un mínimo y un máximo de píxeles en pantalla.

   Uso, justo antes de renderer.render(escena, camara):
       Lab.escena.rotulosLegibles(escena, camara, altoDelLienzoEnPx);
   Cada sprite puede fijar sus límites con  sprite.userData.px = [min, max].
   ===================================================================== */
(function(){
  'use strict';
  const Lab = window.Lab = window.Lab || {};
  const POR_DEFECTO = [16, 40];
  let v = null;
  function rotulosLegibles(escena, camara, altoPx, limites){
    if(!altoPx) return; v = v || new THREE.Vector3();
    const k = altoPx / (2 * Math.tan(camara.fov * Math.PI / 360));   // px por metro a 1 m de distancia
    escena.traverseVisible(o => {
      if(!o.isSprite) return; const u = o.userData;
      if(u.h0 === undefined){ u.h0 = o.scale.y; u.asp = o.scale.x / o.scale.y; }
      const d = o.getWorldPosition(v).distanceTo(camara.position); if(d < 1e-6) return;
      const [mn, mx] = u.px || limites || POR_DEFECTO, px = u.h0 * k / d;
      const h = u.h0 * Math.max(mn, Math.min(mx, px)) / px;
      o.scale.set(h * u.asp, h, 1);
    });
  }
  Lab.escena = Object.assign(Lab.escena || {}, {rotulosLegibles});
})();
