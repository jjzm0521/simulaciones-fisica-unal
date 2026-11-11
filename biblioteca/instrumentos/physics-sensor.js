/* =====================================================================
   INSTRUMENTO · PhysicsSensor 1.1 · ventana "Sonograma" (el "sonoscopio")
   Réplica del programa de la UNAL (Diego L. Aristizábal R.) que muestra la señal de la
   fotocompuerta y mide tiempos con dos cursores. Estilos: interfaz.css, sección E.
   Ficha y reglas: biblioteca/instrumentos/README.md

   Es un instrumento: imita al programa real (tipografía, colores, textos) y NO cambia con el tema.
   Va dentro de una ventana del sistema (se arrastra, se pliega, se cierra).

   CREAR (una vez, sobre un contenedor vacío):
     const ps = Lab.instrumentos.physicsSensor('#scopeWrap', {
       alCerrar: () => …,            // botón ✕ de la ventana
       alMover: (a, b) => …          // el estudiante movió un cursor
     });

   USAR:
     ps.senal(Lab.senales.esferaEnHaz({d: 0.016, tau: 0.0134}));   // qué señal mostrar; null = sin señal
     ps.cursores(0, 0.0134);                    // cursores puestos (ejemplo resuelto)
     ps.cursores(a, b, {mover: true});          // cursores que arrastra el estudiante
     ps.cursores(null);                         // sin cursores
     ps.barrer();                               // animación de captura (la señal aparece de izquierda a derecha)
     ps.intervalo()                             // tiempo entre cursores, en múltiplos de la apreciación (s)
     ps.cursoresIniciales()                     // {a, b} lejos del pulso, para que el estudiante los ubique
     ps.nota('texto bajo la ventana');          // explicación en lenguaje del curso
     ps.dibujar();                              // volver a pintar (lo llaman solas las demás)

   TIEMPO: los cursores y la señal usan el mismo reloj, con t = 0 en el INICIO del evento
   (cuando la señal empieza a subir). La ventana centra el evento sola, con cualquier zoom.

   SEÑAL: un objeto {duracion, muestras(T, t1, n)}: duracion del evento en segundos, y una función que
   devuelve n+1 muestras normalizadas (0 = base, 1 = haz tapado) para una ventana de T segundos en la
   que el evento empieza en t1. Lab.senales trae las señales ya hechas; una nueva se agrega ahí.

   Opciones: apreciacion (1/3648 s), ventana (0,12 s a zoom 1), titulo, etiqueta (texto para lectores de pantalla).
   ===================================================================== */
(function(){
  'use strict';
  const Lab = window.Lab = window.Lab || {};
  const LUPA = '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="5.5" cy="5.5" r="4" fill="#e9f3ff" stroke="#3b6aa0" stroke-width="1.4"/><path d="M8.6 8.6L13 13" stroke="#3b6aa0" stroke-width="2" stroke-linecap="round"/></svg>';
  /* como lo escribe el programa real (Java): 2.7412280701754384E-4 */
  const java = x => x.toExponential().replace('e', 'E').replace('E+', 'E');
  const ruido = i => { const v = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return v - Math.floor(v); };

  function physicsSensor(sel, o){
    o = Object.assign({apreciacion: 1 / 3648, ventana: 0.12, titulo: 'PhysicsSensor: Sonograma -muestreo a 44100 Hz-', etiqueta: 'Señal de la fotocompuerta en el sonograma'}, o || {});
    const v = typeof sel === 'string' ? document.querySelector(sel) : sel; if(!v) return null;
    v.classList.add('scopeblock');
    const boton = (z, t, txt) => '<button class="ps-btn" type="button" data-z="' + z + '" title="' + t + '">' + LUPA + txt + '</button>';
    v.innerHTML =
      '<div class="pswin" role="group" aria-label="Programa PhysicsSensor 1.1">' +
        '<div class="ps-title"><span class="ps-un">un</span><span class="ps-tt">' + o.titulo + '</span>' +
          '<span class="ps-wbtns"><button class="ps-wb" type="button" data-ven="plegar" title="Plegar o desplegar" aria-label="Plegar o desplegar la ventana">–</button>' +
          '<button class="ps-wb" type="button" data-ven="cerrar" title="Cerrar (S)" aria-label="Cerrar la ventana">✕</button></span></div>' +
        '<fieldset class="ps-group"><legend>Sonograma</legend><canvas class="ps-lienzo" aria-label="' + o.etiqueta + '"></canvas></fieldset>' +
        '<fieldset class="ps-group ps-controles"><legend>Controles</legend><div class="ps-row">' +
          boton('ey+', 'Ampliar la escala vertical', '+ Ey') + boton('ey-', 'Reducir la escala vertical', '- Ey') +
          boton('ex+', 'Ampliar la escala de tiempo', '+ Ex') + boton('ex-', 'Reducir la escala de tiempo', '- Ex') +
        '</div></fieldset>' +
      '</div><p class="note ps-nota"></p>';
    const c = v.querySelector('.ps-lienzo'), pNota = v.querySelector('.ps-nota');
    let ex = 1, ey = 1, F = 1, sen = null, cur = null, mover = false, drag = null;
    const T = () => o.ventana / ex, t1 = () => T() / 2 - (sen ? sen.duracion : 0) / 2;
    const intervalo = () => cur ? Math.round(Math.abs(cur.b - cur.a) / o.apreciacion) * o.apreciacion : 0;

    function dibujar(){
      const w = c.clientWidth, h = c.clientHeight; if(!w) return;
      const dpr = window.devicePixelRatio || 1;
      if(c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)){ c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
      const x = c.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
      x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, h);
      const Tw = T(), yb = h * 0.66, amp = h * 0.30 * ey, ini = t1(), listo = !!sen && F >= 1;
      /* cuadrícula y línea roja de referencia */
      x.strokeStyle = '#dcdcdc'; x.lineWidth = 1; x.beginPath();
      for(let i = 1; i < 18; i++){ const p = Math.round(w * i / 18) + 0.5; x.moveTo(p, 0); x.lineTo(p, h); }
      for(let j = 1; j < 6; j++){ const p = Math.round(h * j / 6) + 0.5; x.moveTo(0, p); x.lineTo(w, p); }
      x.stroke();
      const yr = Math.round(h * 0.5) + 0.5; x.strokeStyle = '#e8383d'; x.beginPath(); x.moveTo(0, yr); x.lineTo(w, yr); x.stroke();
      /* señal: línea base con deriva lenta y pequeños escalones, más el evento */
      const corte = !sen || F >= 1 ? Tw : Tw * (0.45 + 0.55 * F), m = sen ? sen.muestras(Tw, ini, w) : null;
      x.strokeStyle = '#2a2a2a'; x.lineWidth = 1.1; x.lineJoin = 'round'; x.beginPath();
      for(let i = 0; i <= w; i++){
        if(i / w * Tw > corte) break;
        const deriva = (0.5 - i / w) * 0.32 * h * 0.30, escalon = Math.round(deriva / 1.5) * 1.5, salto = ruido(i) > 0.94 ? (ruido(i + 7) > 0.5 ? 1.2 : -1.2) : 0;
        const y = yb + escalon + salto - (m ? m[i] * amp : 0);
        if(i === 0) x.moveTo(i, y + 0.5); else x.lineTo(i, y + 0.5);
      }
      x.stroke();
      /* cursores */
      if(listo && cur){
        const xs = [cur.a, cur.b].map(t => Math.round((ini + t) / Tw * w) + 0.5);
        x.strokeStyle = '#4a4af0'; x.lineWidth = mover ? 1.6 : 1; x.beginPath(); xs.forEach(p => { x.moveTo(p, 0); x.lineTo(p, h); }); x.stroke();
        if(mover){ x.fillStyle = '#4a4af0'; xs.forEach(p => { [[0, 9], [h, h - 9]].forEach(([y0, y1]) => { x.beginPath(); x.moveTo(p - 6, y0); x.lineTo(p + 6, y0); x.lineTo(p, y1); x.closePath(); x.fill(); }); }); }
      }
      /* textos del programa */
      x.font = '12px Tahoma, "Segoe UI", Arial, sans-serif'; x.fillStyle = '#1c1c1c'; x.textAlign = 'left'; x.textBaseline = 'alphabetic';
      x.fillText('Intervalo de tiempo = ' + (listo && cur ? String(Number(intervalo().toPrecision(15))) : '0.0') + '  s', 8, 19);
      x.fillText('Apreciación=' + java(o.apreciacion) + ' s', 8, 36);
      x.fillText('[Graba hasta 12 s]', 6, h - 26);
      x.fillText('Autor:  Diego L. Aristizábal R.   Copyright 2010-2013', 6, h - 9);
      c.style.cursor = mover && listo ? 'ew-resize' : '';
    }

    /* arrastrar cursores */
    c.style.touchAction = 'none';
    const tEn = e => { const r = c.getBoundingClientRect(); return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * T() - t1(); };
    const mueve = e => { cur[drag] = tEn(e); dibujar(); if(o.alMover) o.alMover(cur.a, cur.b); };
    c.addEventListener('pointerdown', e => { if(!mover || !cur || !sen || F < 1) return; const t = tEn(e); drag = Math.abs(t - cur.a) <= Math.abs(t - cur.b) ? 'a' : 'b'; c.setPointerCapture(e.pointerId); mueve(e); e.preventDefault(); });
    c.addEventListener('pointermove', e => { if(drag && cur) mueve(e); });
    ['pointerup', 'pointercancel'].forEach(ev => c.addEventListener(ev, () => { drag = null; }));
    /* escalas */
    v.querySelectorAll('[data-z]').forEach(b => b.addEventListener('click', () => { const k = b.dataset.z;
      if(k === 'ey+') ey = Math.min(4, ey * 1.25); else if(k === 'ey-') ey = Math.max(0.4, ey / 1.25);
      else if(k === 'ex+') ex = Math.min(8, ex * 1.4); else ex = Math.max(0.5, ex / 1.4);
      dibujar(); }));
    if(Lab.ui && Lab.ui.ventana) Lab.ui.ventana(v, {asa: '.ps-title', alCerrar: o.alCerrar, alCambiar: () => requestAnimationFrame(dibujar)});
    if(window.ResizeObserver) new ResizeObserver(dibujar).observe(c);

    return {
      senal(s){ sen = s || null; dibujar(); },
      cursores(a, b, op){ if(a == null){ cur = null; mover = false; } else { cur = {a, b}; mover = !!(op && op.mover); } dibujar(); },
      cursoresIniciales(){ const Tw = T(), ini = t1(); return {a: 0.30 * Tw - ini, b: 0.74 * Tw - ini}; },
      barrer(){ F = 0; const t0 = performance.now(); (function f(now){ F = Math.min(1, (now - t0) / 800); dibujar(); if(F < 1) requestAnimationFrame(f); })(t0); },
      intervalo, dibujar,
      nota(t){ pNota.textContent = t || ''; },
      mide: () => mover, apreciacion: o.apreciacion, elemento: v
    };
  }

  /* ------------------------------------------------------------------
     SEÑALES ya hechas. Cada una devuelve {duracion, muestras(T, t1, n)}.
     ------------------------------------------------------------------ */

  /* Una esfera de diámetro d (m) cruza el haz y lo tapa durante tau (s).
     Se calcula con la geometría: el haz es un disco de radio RB a la altura del centro de la esfera y la
     señal es la fracción del haz que tapa la silueta de la esfera mientras avanza a v = d/tau.
     · Empieza a subir cuando el borde delantero toca el haz y empieza a bajar cuando llega el borde
       trasero: entre esos dos puntos pasan exactamente tau, para cualquier diámetro.
     · La subida y la bajada duran 2·RB/v (no dependen de d): una esfera grande da una meseta más larga.
     · Filtro pasa-bajos (respuesta del fotodiodo) y pasa-altos (entrada de audio del computador): caída
       suave de la meseta y pequeña cola bajo la base al final, como en el sonograma real. */
  function esferaEnHaz(o){
    const RB = o.radioHaz || 0.0010, T_LP = 0.0004, T_HP = 0.15, r = o.d / 2, vel = o.d / o.tau;
    const tapa = dc => { dc = Math.abs(dc); if(dc >= r + RB) return 0; if(dc <= r - RB) return 1;
      const r2 = r * r, b2 = RB * RB;
      return (r2 * Math.acos((dc * dc + r2 - b2) / (2 * dc * r)) + b2 * Math.acos((dc * dc + b2 - r2) / (2 * dc * RB)) - 0.5 * Math.sqrt((-dc + r + RB) * (dc + r - RB) * (dc - r + RB) * (dc + r + RB))) / (Math.PI * b2); };
    return {duracion: o.tau, muestras(T, t1, n){
      const dt = Math.min(2e-5, T / n / 4), N = Math.ceil(T / dt), out = new Float32Array(n + 1), aL = dt / (T_LP + dt), aH = T_HP / (T_HP + dt);
      let lp = 0, prev = 0, hp = 0, j = 0;
      for(let k = 0; k <= N && j <= n; k++){ const t = k * dt;
        lp += aL * (tapa(-(r + RB) + vel * (t - t1)) - lp); hp = aH * (hp + lp - prev); prev = lp;
        while(j <= n && j * T / n <= t) out[j++] = hp; }
      while(j <= n) out[j++] = hp;
      return out; }};
  }

  Lab.instrumentos = Object.assign(Lab.instrumentos || {}, {physicsSensor});
  Lab.senales = Object.assign(Lab.senales || {}, {esferaEnHaz});
})();
