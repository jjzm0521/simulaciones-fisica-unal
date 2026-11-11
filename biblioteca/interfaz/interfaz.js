/* =====================================================================
   INTERFAZ · elementos compartidos (F1 y F3). Acompaña a tokens.css + interfaz.css.
   Uso: Lab.ui.<función>. Catálogo con todos los elementos: biblioteca/catalogo.html

   Elementos (devuelven HTML; se activan con Lab.ui.montar(raíz, alCambiar)):
     deslizador · opciones · casilla · interruptor · lecturas · fila
   Armazón:
     ubicarBarras · cargarPreferencias · guardarPreferencias · aplicarClases
     proyector · aviso · barraAccion · ventana · principal · teclas · mantener · esTactil
   ===================================================================== */
(function(){
  'use strict';
  const Lab = window.Lab = window.Lab || {};
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const coma = (x, dec) => Number(x).toFixed(dec).replace('.', ',');
  const esc = t => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

  /* ¿Pantalla táctil o angosta? Decide entre barra de acción (botones) e indicador de teclas. */
  const esTactil = () => (window.matchMedia && matchMedia('(pointer:coarse)').matches) || window.innerWidth <= 760;

  /* ------------------------------------------------------------------
     ELEMENTOS DEL PANEL
     ------------------------------------------------------------------ */

  /* Deslizador. El valor se puede arrastrar, escribir (acepta coma) o cambiar con − / +.
     o = {id, etiqueta, simbolo?, valor, min, max, paso, dec, unidad, nota?, teclas?, nominal?}
     teclas: texto de las teclas que lo mueven, p. ej. '← →' (se oculta en táctil). */
  function deslizador(o){
    const p = v => Math.max(0, Math.min(1, (v - o.min) / (o.max - o.min)));
    const teclas = o.teclas ? '<span class="tec">' + (o.nota ? ' · ' : 'teclas ') + o.teclas.split(' ').map(k => '<kbd>' + k + '</kbd>').join('') + '</span>' : '';
    return '<div class="ctl" data-ctl="' + o.id + '" data-dec="' + o.dec + '">' +
      '<label for="' + o.id + '">' + o.etiqueta + (o.simbolo ? ' <var>' + o.simbolo + '</var>' : '') + '</label>' +
      '<span class="ctl-val"><input id="' + o.id + 'n" inputmode="decimal" autocomplete="off" value="' + coma(o.valor, o.dec) + '" aria-label="' + esc(o.etiqueta) + ', valor exacto">' + (o.unidad || '') + '</span>' +
      '<div class="ctl-pista"><button type="button" data-paso="-1" aria-label="Bajar ' + esc(o.etiqueta) + '">−</button>' +
      '<span class="ctl-rango"><input type="range" id="' + o.id + '" min="' + o.min + '" max="' + o.max + '" step="' + o.paso + '" value="' + o.valor + '">' +
      (o.nominal != null ? '<i class="ctl-nom" style="--p:' + p(o.nominal) + '" title="Valor nominal: ' + coma(o.nominal, o.dec) + ' ' + (o.unidad || '') + '"></i>' : '') + '</span>' +
      '<button type="button" data-paso="1" aria-label="Subir ' + esc(o.etiqueta) + '">+</button></div>' +
      (o.nota || teclas ? '<span class="ctl-nota">' + (o.nota || '') + teclas + '</span>' : '') + '</div>';
  }
  /* Cambia el valor mostrado de un deslizador sin disparar alCambiar. */
  function ponerDeslizador(id, valor){
    const r = document.getElementById(id), n = document.getElementById(id + 'n'); if(!r) return;
    r.value = valor; if(n && document.activeElement !== n) n.value = coma(valor, +r.closest('.ctl').dataset.dec);
  }

  /* Opción única: se elige una de varias. items = [{v, texto, tecla?}] */
  function opciones(o){
    return '<div class="opciones" role="radiogroup" aria-label="' + esc(o.etiqueta) + '" data-opciones="' + o.id + '">' +
      o.items.map(i => '<button type="button" class="opcion" role="radio" aria-checked="' + (i.v === o.valor) + '" data-v="' + i.v + '">' +
        '<span>' + i.texto + '</span>' + (i.tecla ? '<kbd>' + i.tecla + '</kbd>' : '') + '</button>').join('') + '</div>';
  }
  /* Casilla: mostrar u ocultar algo. */
  function casilla(o){
    return '<label class="casilla"><input type="checkbox" data-casilla="' + o.id + '"' + (o.marcado ? ' checked' : '') + '>' +
      '<span>' + o.texto + '</span>' + (o.tecla ? '<kbd>' + o.tecla + '</kbd>' : '') + '</label>';
  }
  /* Interruptor: cambia un estado (encendido / apagado). */
  function interruptor(o){
    return '<button type="button" class="interruptor" role="switch" aria-checked="' + !!o.activo + '" data-interruptor="' + o.id + '">' + o.texto + '</button>';
  }
  /* Lecturas en vivo. items = [{id, etiqueta, valor?, color?}]; color es un token, p. ej. 'var(--mag-x)'. */
  function lecturas(items, etiqueta){
    return '<div class="lecturas" aria-label="' + esc(etiqueta || 'Valores en vivo') + '">' +
      items.map(i => '<div class="lectura"' + (i.color ? ' style="--lc:' + i.color + '"' : '') + '><span>' + i.etiqueta + '</span><b id="' + i.id + '">' + (i.valor == null ? '—' : i.valor) + '</b></div>').join('') + '</div>';
  }
  /* Fila de resultado: nombre, expresión y valor. clave = true la resalta. */
  function fila(nombre, expresion, valor, clave){
    return '<div class="calc' + (clave ? ' key' : '') + '"><span class="lab">' + nombre + '</span><span class="expr">' + (expresion || '') + '</span><span class="val">' + valor + '</span></div>';
  }

  /* Activa los elementos que haya dentro de raíz. alCambiar(id, valor) recibe:
     número (deslizador), texto (opciones), true/false (casilla, interruptor). */
  function montar(raiz, alCambiar){
    raiz = typeof raiz === 'string' ? $(raiz) : raiz; if(!raiz) return;
    $$('[data-ctl]', raiz).forEach(c => {
      const id = c.dataset.ctl, dec = +c.dataset.dec, r = $('input[type=range]', c), n = $('.ctl-val input', c);
      const min = +r.min, max = +r.max, paso = +r.step;
      const fijar = (v, desdeTexto) => {
        v = Math.max(min, Math.min(max, Math.round((v - min) / paso) * paso + min)); v = +v.toFixed(6);
        r.value = v; if(!desdeTexto) n.value = coma(v, dec); alCambiar(id, v);
      };
      r.addEventListener('input', () => fijar(+r.value));
      n.addEventListener('change', () => { const v = parseFloat(n.value.replace(',', '.')); if(isNaN(v)) n.value = coma(+r.value, dec); else { fijar(v, true); n.value = coma(+r.value, dec); } });
      n.addEventListener('keydown', e => { if(e.key === 'Enter') n.blur(); });
      n.addEventListener('focus', () => n.select());
      $$('[data-paso]', c).forEach(b => mantener(b, () => fijar(+r.value + (+b.dataset.paso) * paso)));
    });
    $$('[data-opciones]', raiz).forEach(g => $$('.opcion', g).forEach(b => b.addEventListener('click', () => {
      $$('.opcion', g).forEach(x => x.setAttribute('aria-checked', String(x === b))); alCambiar(g.dataset.opciones, b.dataset.v); })));
    $$('[data-casilla]', raiz).forEach(c => c.addEventListener('change', () => alCambiar(c.dataset.casilla, c.checked)));
    $$('[data-interruptor]', raiz).forEach(b => b.addEventListener('click', () => {
      const on = b.getAttribute('aria-checked') !== 'true'; b.setAttribute('aria-checked', String(on)); alCambiar(b.dataset.interruptor, on); }));
  }

  /* ------------------------------------------------------------------
     ARMAZÓN
     ------------------------------------------------------------------ */

  /* Ubica la fila de pasos y el panel justo debajo de la barra superior, midiendo su altura real. */
  function ubicarBarras(){
    const hd = $('header.top'); if(!hd) return; let hb = 0;
    [...hd.children].forEach(c => { if(getComputedStyle(c).display !== 'none'){ const r = c.getBoundingClientRect(); if(r.height) hb = Math.max(hb, r.bottom); } });
    const nav = $('nav.steps'), st = document.documentElement.style; st.setProperty('--navt', (hb + 8) + 'px');
    let ct = hb + 8; if(nav && !nav.hidden){ const ol = nav.querySelector('ol'); ct = hb + 8 + (ol ? ol.getBoundingClientRect().height : 44) + 8; }
    st.setProperty('--cardt', ct + 'px');
  }

  /* Preferencias de "Qué mostrar" guardadas en el navegador (clave propia por práctica). */
  const CAMPOS = ['card', 'scope', 'labels', 'proyector'];
  function cargarPreferencias(clave, base){
    const ui = Object.assign({card:true, scope:true, labels:true, proyector:false, clean:false}, base || {});
    try{ Object.assign(ui, JSON.parse(localStorage.getItem(clave) || '{}'), {clean:false}); }catch(e){}
    return ui;
  }
  function guardarPreferencias(clave, ui, campos){
    const o = {}; (campos || CAMPOS).forEach(k => o[k] = ui[k]);
    try{ localStorage.setItem(clave, JSON.stringify(o)); }catch(e){}
  }
  /* Clases que ocultan paneles (no-card, no-scope, clean), modo proyector y estado de los botones [data-ui]. */
  function aplicarClases(ui){
    const b = document.body;
    b.classList.toggle('no-card', !ui.card); b.classList.toggle('no-scope', !ui.scope); b.classList.toggle('clean', !!ui.clean);
    proyector(!!ui.proyector);
    $$('[data-ui]').forEach(x => x.setAttribute('aria-pressed', String(!!ui[x.dataset.ui])));
  }
  /* Modo proyector: letra más grande, paneles opacos, más contraste. */
  function proyector(on){ document.documentElement.classList.toggle('proyector', !!on); }

  /* Aviso corto abajo, con acción opcional (Deshacer). Se cierra solo. */
  let avisoT = 0;
  function aviso(texto, o){
    o = o || {}; let a = $('#labAviso');
    if(!a){ a = document.createElement('div'); a.id = 'labAviso'; a.className = 'aviso'; a.setAttribute('role', 'status'); document.body.appendChild(a); }
    a.innerHTML = '<span>' + texto + '</span>' + (o.accion ? '<button type="button">' + (o.textoAccion || 'Deshacer') + '</button>' : '');
    a.hidden = false; clearTimeout(avisoT);
    const cerrar = () => { a.hidden = true; if(o.alCerrar) o.alCerrar(); };
    if(o.accion) $('button', a).onclick = () => { clearTimeout(avisoT); a.hidden = true; o.accion(); };
    avisoT = setTimeout(cerrar, o.ms || 8000);
    return {cerrar: () => { clearTimeout(avisoT); a.hidden = true; }};
  }

  /* Botón principal del panel: el marcado con data-principal. Es el que disparan Espacio, Enter
     y el botón grande de la barra táctil. Un solo botón principal por panel. */
  function principal(){ return $('.card [data-principal]'); }

  /* Barra de acción (táctil) + indicador de teclas (escritorio), desde una sola declaración.
     const barra = Lab.ui.barraAccion({pad:'#pad', hud:'#hud', accion: nombre => …});
     barra.pintar({
       pad: true|false, hud: true|false,           // cuál se ve ahora
       titulo: 'Oblicuo', tituloCambia: true,      // botón que rota la variante (acción 'titulo')
       valores: ['θ = 35°', 'V₀ = 2,0 m/s'],
       grupos: [{id:'th', menos:'θ−', mas:'θ+', nombre:'el ángulo'}],   // acciones 'th-' y 'th+'
       principal: {texto:'Lanzar', inactivo:false},                      // acción 'principal'
       teclas: [['Espacio','lanzar'], ['← →','ángulo']]
     }); */
  function barraAccion(cfg){
    const pad = $(cfg.pad), hud = $(cfg.hud); let firma = '';
    function pintar(e){
      if(pad){
        pad.hidden = !e.pad;
        if(e.pad){
          const g = e.grupos || [], f = g.map(x => x.id).join() + '|' + !!e.tituloCambia;
          if(f !== firma){            // solo se reconstruye si cambia la estructura (no se corta un botón mantenido)
            firma = f; const mitad = Math.ceil(g.length / 2);
            const grp = x => '<span class="pad-grp"><button class="pb" type="button" data-a="' + x.id + '-" aria-label="Bajar ' + esc(x.nombre || x.id) + '">' + x.menos + '</button><button class="pb" type="button" data-a="' + x.id + '+" aria-label="Subir ' + esc(x.nombre || x.id) + '">' + x.mas + '</button></span>';
            pad.innerHTML = '<div class="pad-top">' + (e.tituloCambia ? '<button class="pad-type" type="button" data-t></button>' : '<b class="pad-type" data-t style="cursor:default"></b>') + '<span class="pad-val"></span></div>' +
              '<div class="pad-row">' + g.slice(0, mitad).map(grp).join('') + '<button class="pb go" type="button" data-go></button>' + g.slice(mitad).map(grp).join('') + '</div>';
            $$('[data-a]', pad).forEach(b => mantener(b, () => cfg.accion(b.dataset.a)));
            $('[data-go]', pad).onclick = () => cfg.accion('principal');
            if(e.tituloCambia) $('[data-t]', pad).onclick = () => cfg.accion('titulo');
          }
          const t = $('[data-t]', pad); t.textContent = e.titulo || ''; t.hidden = !e.titulo;
          $('.pad-val', pad).textContent = (e.valores || []).join(' · ');
          $('.pad-top', pad).hidden = !e.titulo && !(e.valores || []).length;
          const go = $('[data-go]', pad), p = e.principal || {}; go.textContent = p.texto || 'Iniciar'; go.disabled = !!p.inactivo;
        }
      }
      if(hud){
        hud.hidden = !e.hud;
        if(e.hud) hud.innerHTML = (e.titulo ? '<b>' + e.titulo + '</b>' : '') + (e.valores || []).map(v => '<span>' + v + '</span>').join('') +
          '<span class="keys">' + (e.teclas || []).map(([k, d]) => k.split(' ').map(x => '<kbd>' + x + '</kbd>').join('') + ' ' + d).join(' · ') + '</span>';
      }
    }
    return {pintar};
  }

  /* Ventana de instrumento: se arrastra por su barra de título, se pliega y se cierra (en celular queda fija).
     Lab.ui.ventana('#scopeWrap', {asa:'.ps-title', alCerrar: fn, alCambiar: fn});
     Dentro: botones con data-ven="plegar" y data-ven="cerrar". */
  function ventana(sel, o){
    const v = $(sel); if(!v) return; o = o || {}; const asa = $(o.asa, v) || v; let d = null;
    const suelta = () => { v.style.left = v.style.top = v.style.right = v.style.bottom = v.style.width = ''; };
    asa.style.touchAction = 'none'; asa.style.cursor = 'move';
    asa.addEventListener('pointerdown', e => { if(e.target.closest('button') || innerWidth <= 760) return;
      const r = v.getBoundingClientRect(); d = {x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height}; asa.setPointerCapture(e.pointerId); e.preventDefault(); });
    asa.addEventListener('pointermove', e => { if(!d) return;
      v.style.width = d.w + 'px'; v.style.right = v.style.bottom = 'auto';
      v.style.left = Math.max(4, Math.min(innerWidth - d.w - 4, e.clientX - d.x)) + 'px';
      v.style.top = Math.max(4, Math.min(innerHeight - 40, e.clientY - d.y)) + 'px'; });
    ['pointerup', 'pointercancel'].forEach(ev => asa.addEventListener(ev, () => { d = null; }));
    addEventListener('resize', suelta);
    $$('[data-ven]', v).forEach(b => b.addEventListener('click', () => {
      if(b.dataset.ven === 'cerrar'){ if(o.alCerrar) o.alCerrar(); } else { v.classList.toggle('plegada'); if(o.alCambiar) o.alCambiar(); } }));
    return {suelta};
  }

  /* Botón que repite la acción mientras se mantiene presionado. También responde a Enter/Espacio. */
  function mantener(boton, accion){
    let t1 = 0, t2 = 0; const parar = () => { clearTimeout(t1); clearInterval(t2); };
    boton.addEventListener('pointerdown', e => { e.preventDefault(); accion(); t1 = setTimeout(() => { t2 = setInterval(accion, 70); }, 380); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => boton.addEventListener(ev, parar));
    boton.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); accion(); } });
    boton.addEventListener('contextmenu', e => e.preventDefault());
  }

  /* Atajos de teclado. Ignora lo que se escribe en campos, las combinaciones con Ctrl/Cmd/Alt,
     y Espacio/Enter cuando el foco está en un botón (ese botón ya responde solo).
     mapa = { 'h': fn, 'ArrowLeft': fn(e), ' ': fn, ... } (letras en minúscula). Si fn devuelve false, la tecla sigue su curso. */
  function teclas(mapa){
    document.addEventListener('keydown', e => {
      const t = e.target;
      if(t.closest && t.closest('input,select,textarea')) return;
      if(e.metaKey || e.ctrlKey || e.altKey) return;
      if(t.closest && t.closest('button,summary') && (e.key === ' ' || e.key === 'Enter')) return;
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key, f = mapa[k];
      if(f && f(e) !== false) e.preventDefault();
    });
  }

  Lab.ui = Object.assign(Lab.ui || {}, {
    deslizador, ponerDeslizador, opciones, casilla, interruptor, lecturas, fila, montar,
    esTactil, ubicarBarras, cargarPreferencias, guardarPreferencias, aplicarClases, proyector,
    aviso, principal, barraAccion, ventana, mantener, teclas, version: '2.1'});
})();
