/* =====================================================================
   INCERTIDUMBRE Y FORMATO · biblioteca compartida (F1 y F3)
   Regla del laboratorio: la incertidumbre se reporta con UNA cifra significativa
   y el valor se redondea a la misma posición decimal. Coma decimal.
   Uso: const {fx, r1, pair, sg} = Lab.fisica;
        pair(1.1683, 0.0234)  ->  ['1,17', '0,02']
   ===================================================================== */
(function(){
  'use strict';
  const Lab = window.Lab = window.Lab || {};
  /* número con dec decimales y coma */
  const fx = (x, dec) => x.toFixed(dec).replace('.', ',');
  /* incertidumbre con una cifra significativa: {u, dec, e} */
  function r1(u){ if(!(u>0)) return {u:0,dec:3,e:-3}; let e=Math.floor(Math.log10(u)+1e-9); let m=Math.round(u/Math.pow(10,e)); if(m>=10){m=1;e++;} return {u:m*Math.pow(10,e),dec:Math.max(0,-e),e}; }
  /* [valor, incertidumbre] como texto, ya redondeados juntos */
  function pair(v,u){ const q=r1(u); if(q.e>0){ const f=Math.pow(10,q.e); return [fx(Math.round(v/f)*f,0),fx(q.u,0)]; } return [fx(v,q.dec),fx(q.u,q.dec)]; }
  /* n cifras significativas */
  function sg(v,n){ n=n||3; if(v===0) return '0'; const e=Math.floor(Math.log10(Math.abs(v))); return fx(v,Math.max(0,n-1-e)); }
  /* para validar lo que escribe el estudiante */
  const num = t => { t=String(t||'').trim().replace(',','.'); return t===''||isNaN(+t)?null:+t; };
  const decs = t => { t=String(t||'').trim().replace(',','.'); const i=t.indexOf('.'); return i<0?0:t.length-i-1; };
  const cifras = t => String(t||'').trim().replace(',','.').replace('-','').replace('.','').replace(/^0+/,'').length;
  Lab.fisica = Object.assign(Lab.fisica||{}, {fx,r1,pair,sg,num,decs,cifras});
})();
