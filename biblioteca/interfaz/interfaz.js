/* =====================================================================
   INTERFAZ APROBADA · utilidades compartidas (F1 y F3)
   Acompaña a interfaz.css. Uso: Lab.ui.<función>.
   ===================================================================== */
(function(){
  'use strict';
  const Lab = window.Lab = window.Lab || {};
  const $ = s => document.querySelector(s);

  /* ¿Pantalla táctil o angosta? Decide si se muestra el control táctil (pad) o el indicador de teclas. */
  const esTactil = () => (window.matchMedia && matchMedia('(pointer:coarse)').matches) || window.innerWidth <= 760;

  /* Ubica la fila de pasos y el panel justo debajo de la barra superior, midiendo su altura real
     (así nada se superpone aunque la barra cambie de alto al cambiar el tamaño de la ventana). */
  function ubicarBarras(){
    const hd = $('header.top'); if(!hd) return; let hb = 0;
    [...hd.children].forEach(c => { if(getComputedStyle(c).display !== 'none'){ const r = c.getBoundingClientRect(); if(r.height) hb = Math.max(hb, r.bottom); } });
    const nav = $('nav.steps'), st = document.documentElement.style; st.setProperty('--navt', (hb + 8) + 'px');
    let ct = hb + 8; if(nav && !nav.hidden){ const ol = nav.querySelector('ol'); ct = hb + 8 + (ol ? ol.getBoundingClientRect().height : 44) + 8; }
    st.setProperty('--cardt', ct + 'px');
  }

  /* Preferencias de "Qué mostrar" guardadas en el navegador (clave propia por práctica). */
  function cargarPreferencias(clave, base){
    const ui = Object.assign({card:true, scope:true, labels:true, clean:false}, base || {});
    try{ Object.assign(ui, JSON.parse(localStorage.getItem(clave) || '{}'), {clean:false}); }catch(e){}
    return ui;
  }
  function guardarPreferencias(clave, ui, campos){
    const o = {}; (campos || ['card','scope','labels']).forEach(k => o[k] = ui[k]);
    try{ localStorage.setItem(clave, JSON.stringify(o)); }catch(e){}
  }
  /* Clases del body que ocultan paneles: no-card, no-scope, clean. */
  function aplicarClases(ui){
    const b = document.body;
    b.classList.toggle('no-card', !ui.card); b.classList.toggle('no-scope', !ui.scope); b.classList.toggle('clean', !!ui.clean);
    document.querySelectorAll('[data-ui]').forEach(x => x.setAttribute('aria-pressed', String(!!ui[x.dataset.ui])));
  }

  /* Botón que repite la acción mientras se mantiene presionado (control táctil). */
  function mantener(boton, accion){
    let t1 = 0, t2 = 0; const parar = () => { clearTimeout(t1); clearInterval(t2); };
    boton.addEventListener('pointerdown', e => { e.preventDefault(); accion(); t1 = setTimeout(() => { t2 = setInterval(accion, 70); }, 380); });
    ['pointerup','pointerleave','pointercancel'].forEach(ev => boton.addEventListener(ev, parar));
    boton.addEventListener('contextmenu', e => e.preventDefault());
  }

  /* Atajos de teclado: ignora lo que se escribe en campos y las combinaciones con Ctrl/Cmd/Alt.
     mapa = { 'h': fn, 'ArrowLeft': fn(e), ' ': fn, ... } (letras en minúscula). */
  function teclas(mapa){
    document.addEventListener('keydown', e => {
      if(e.target.closest && e.target.closest('input,select,textarea')) return;
      if(e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key, f = mapa[k];
      if(f && f(e) !== false) e.preventDefault();
    });
  }

  Lab.ui = Object.assign(Lab.ui || {}, {esTactil, ubicarBarras, cargarPreferencias, guardarPreferencias, aplicarClases, mantener, teclas});
})();
