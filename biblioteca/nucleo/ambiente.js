/* =====================================================================
   AMBIENTE · fondo, luces, piso y rejilla de la escena en cada tema (F1 y F3)
   Junto con tokens.css es el ÚNICO lugar donde se escriben colores a mano.

   Uso (la escena nace con el tema que ya puso Lab.ui.cargarPreferencias):
       const amb = Lab.escena.ambiente(scene, Lab.ui.tema(), {sol:{pos:[1.4,3.2,2]}});
       Lab.ui.alCambiarTema(t => { Lab.escena.ambiente(scene, t); dirty = true; });
   La primera llamada crea las luces (y el piso y la rejilla, si no se pide lo contrario);
   las siguientes solo cambian sus colores e intensidades. Devuelve la paleta del tema.

   Opciones (solo se leen la primera vez):
     sol:    {pos:[x,y,z], sombra:{mapa, caja, near, far, bias}}   sombra:false apaga las sombras
     piso:   false | {ancho}      plano a y = 0 (por defecto 8 m)
     rejilla:false | {ancho, divisiones}   (por defecto 8 m, 32 divisiones)
   Una escena que ya trae su propio piso (el laboratorio de parabólico) pasa piso:false, rejilla:false.

   Paleta (Lab.escena.paleta(tema)): lo que necesitan los rótulos y objetos que no son tokens.
     pastilla {fondo, texto, borde}   marca {a, b, c}   cinta {fondo, tinta}
   Las piezas (soporte, fotocompuerta) y los equipos NO cambian de color: son objetos reales;
   con el tema solo cambia cómo los ilumina la escena. La ventana del PhysicsSensor tampoco.
   ===================================================================== */
(function(){
  'use strict';
  const Lab = window.Lab = window.Lab || {};

  /* Intensidades ya multiplicadas por π: los materiales se ven como en r128 (sin gestión de color). */
  const PAL = {
    claro:{
      fondo:'#DFE6EE',                                   /* = --bg de tokens.css */
      hemi:{cielo:'#FFFFFF', suelo:'#B9C4D0', k:0.9},
      sol:{color:'#FFF6E6', k:0.65},
      piso:'#E3EAE6', rejilla:['#C9D3CF', '#D6DEDB'],
      pastilla:{fondo:'rgba(14,22,40,.9)', texto:'#FFFFFF', borde:'rgba(14,22,40,0)'},
      marca:{a:'#A78BFA', b:'#38BDF8', c:'#FB923C'},
      cinta:{fondo:'#F1C94F', tinta:'#1A2733'}
    },
    oscuro:{
      fondo:'#0F1923',                                   /* = --bg de tokens.css (oscuro) */
      hemi:{cielo:'#C4D3E6', suelo:'#2B3848', k:0.62},
      sol:{color:'#DCE6FF', k:0.5},
      piso:'#1A2631', rejilla:['#324559', '#25374A'],
      pastilla:{fondo:'rgba(29,44,59,.96)', texto:'#E8EEF4', borde:'rgba(166,182,197,.85)'},
      marca:{a:'#A78BFA', b:'#38BDF8', c:'#FB923C'},
      cinta:{fondo:'#F1C94F', tinta:'#1A2733'}           /* la cinta es un objeto real: no cambia */
    }
  };
  const paleta = t => PAL[t === 'oscuro' ? 'oscuro' : 'claro'];

  function ambiente(escena, tema, o){
    const p = paleta(tema); o = o || {};
    const A = escena.userData.ambiente = escena.userData.ambiente || {};
    escena.background = new THREE.Color(p.fondo);

    if(!A.hemi){ A.hemi = new THREE.HemisphereLight(); escena.add(A.hemi); }
    A.hemi.color.set(p.hemi.cielo); A.hemi.groundColor.set(p.hemi.suelo); A.hemi.intensity = p.hemi.k * Math.PI;

    if(!A.sol){
      const s = o.sol || {}, sol = A.sol = new THREE.DirectionalLight(), c = s.pos || [1.4, 3.2, 2.0];
      sol.position.set(c[0], c[1], c[2]);
      if(s.sombra !== false){
        sol.castShadow = true; const b = s.sombra;
        if(b){ sol.shadow.mapSize.set(b.mapa || 1024, b.mapa || 1024);
          const k = sol.shadow.camera, a = b.caja || 2; k.left = -a; k.right = a; k.top = a; k.bottom = -a; k.near = b.near || 0.5; k.far = b.far || 9;
          if(b.bias != null) sol.shadow.bias = b.bias; }
      }
      escena.add(sol);
    }
    A.sol.color.set(p.sol.color); A.sol.intensity = p.sol.k * Math.PI;

    /* piso y rejilla: lo pedido la primera vez queda fijo para las llamadas siguientes */
    if(!A.cfg) A.cfg = {piso:o.piso === false ? null : (o.piso || {}), rejilla:o.rejilla === false ? null : (o.rejilla || {})};
    if(A.cfg.piso){
      if(!A.piso){
        const w = A.cfg.piso.ancho || 8;
        A.piso = new THREE.Mesh(new THREE.PlaneGeometry(w, w), new THREE.MeshStandardMaterial({roughness:0.9}));
        A.piso.rotation.x = -Math.PI / 2; A.piso.receiveShadow = true; escena.add(A.piso);
      }
      A.piso.material.color.set(p.piso);
    }
    if(A.cfg.rejilla){
      if(A.rejilla){ escena.remove(A.rejilla); A.rejilla.geometry.dispose(); A.rejilla.material.dispose(); }   /* GridHelper guarda el color en la geometría */
      A.rejilla = new THREE.GridHelper(A.cfg.rejilla.ancho || 8, A.cfg.rejilla.divisiones || 32, p.rejilla[0], p.rejilla[1]); escena.add(A.rejilla);
    }
    return p;
  }
  Lab.escena = Object.assign(Lab.escena || {}, {ambiente, paleta});
})();
