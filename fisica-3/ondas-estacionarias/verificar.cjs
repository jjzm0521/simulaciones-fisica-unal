// Verifica el mismo modelo que ejecuta el HTML, sin dependencias externas.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, 'simulacion-ondas-cuerda.html'), 'utf8');
const source = html.match(/<script id="physics">([\s\S]*?)<\/script>/)[1];
const P = vm.runInNewContext(source + '\nPhysics');
const p = {length:1.2,mass:100,density:1,uLength:.001,uMass:.1,uDensity:.01,uFrequency:.05};
const near = (a,b,tol=1e-9) => assert.ok(Math.abs(a-b)<tol, `${a} != ${b}`);
const m = P.model(p);
near(m.tension,.9776);
near(m.v,Math.sqrt(977.6));
near(P.model({...p,mass:400}).v,2*m.v);
near(P.model({...p,density:4}).v,m.v/2);
near(P.model({...p,length:2.4}).f1,m.f1/2);
const exact = Array.from({length:9},(_,i)=>({n:i+1,f:(i+1)*m.f1,u:.05}));
const a=P.analysis(p,exact);
near(a.v,m.v); near(a.fit.c,0); near(a.fit.R2,1);
assert.ok(a.u>0 && a.fit.ub>0 && a.k<2);
near(a.fit.ub,.05/Math.sqrt(60));
assert.equal(P.fit(exact.slice(0,2)),null);
assert.equal(P.fit([{n:1,f:1,u:1},{n:1,f:2,u:1},{n:1,f:3,u:1}]),null);
const biased=P.analysis(p,exact.map(r=>({...r,f:r.f*1.1})));
near(biased.error,10); assert.ok(biased.k>2);
const offset=P.fit(exact.map(r=>({...r,f:r.f+2})));
near(offset.b,m.f1); near(offset.c,2);
const noisy=P.analysis(p,exact.map((r,i)=>({...r,f:r.f+(i%2?1:-1)})));
assert.ok(noisy.fit.ub>a.fit.ub);
const peak=(f)=>{let peak=0;const q=P.response(p,f);for(let j=0;j<=400;j++)peak=Math.max(peak,P.shape(q,j/400).amp);return peak;};
for(let n=1;n<=9;n++){
 const q=P.response(p,n*m.f1);
 near(P.shape(q,0).amp,0); near(P.shape(q,1).amp,0,1e-10);
 assert.ok(peak(n*m.f1)>peak((n-.4)*m.f1), `Resonancia ${n} no visible`);
 assert.ok(peak(n*m.f1)>.9);
}
for(const script of html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(script[1]);
console.log('OK: unidades, escalas físicas, regresión, incertidumbres, compatibilidad, 9 resonancias, extremos nodales y sintaxis.');
