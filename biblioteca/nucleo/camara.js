/* =====================================================================
   CÁMARA COMPARTIDA · Simulaciones del Laboratorio de Física (UNAL Medellín)
   Para three.js r159 (build clásico). Reemplaza a OrbitControls con la misma
   interfaz básica: target, update(), minDistance, maxDistance, maxPolarAngle,
   minPolarAngle, enabled y addEventListener('change', fn).

   · Arrastrar con un dedo o clic izquierdo: girar alrededor del objetivo.
   · Clic derecho, Shift + arrastrar o dos dedos: desplazar.
   · Rueda del mouse o pellizco: acercar HACIA EL PUNTO bajo el cursor o entre
     los dedos (no siempre hacia el centro).
   Uso: const controls = new THREE.CamaraOrbita(camera, renderer.domElement);
   ===================================================================== */
(function () {
  'use strict';
  if (typeof THREE === 'undefined') return;
  const V3 = THREE.Vector3;

  class CamaraOrbita {
    constructor(camera, dom, opts) {
      opts = opts || {};
      this.camera = camera; this.dom = dom;
      this.target = new V3();
      this.enabled = true;
      this.minDistance = opts.minDistance ?? 0.1;
      this.maxDistance = opts.maxDistance ?? 100;
      this.minPolarAngle = opts.minPolarAngle ?? 0.01;
      this.maxPolarAngle = opts.maxPolarAngle ?? Math.PI - 0.01;
      this.rotateSpeed = opts.rotateSpeed ?? 1;
      this.zoomSpeed = opts.zoomSpeed ?? 1;
      this._fns = [];
      this._ptrs = new Map();
      this._ray = new THREE.Raycaster();
      this._bind();
    }
    addEventListener(type, fn) { if (type === 'change') this._fns.push(fn); }
    removeEventListener(type, fn) { this._fns = this._fns.filter(f => f !== fn); }
    _emit() { for (const f of this._fns) f({ type: 'change', target: this }); }

    /* Reimpone los límites a la posición actual de la cámara. */
    update() {
      const off = this.camera.position.clone().sub(this.target);
      const sph = new THREE.Spherical().setFromVector3(off);
      sph.phi = Math.min(this.maxPolarAngle, Math.max(this.minPolarAngle, sph.phi));
      sph.radius = Math.min(this.maxDistance, Math.max(this.minDistance, sph.radius));
      sph.makeSafe();
      this.camera.position.copy(this.target).add(off.setFromSpherical(sph));
      this.camera.lookAt(this.target);
      this._emit();
    }

    rotate(dx, dy) {
      const off = this.camera.position.clone().sub(this.target);
      const sph = new THREE.Spherical().setFromVector3(off);
      const k = 2 * Math.PI / Math.max(1, this.dom.clientHeight) * this.rotateSpeed;
      sph.theta -= dx * k; sph.phi -= dy * k;
      this.camera.position.copy(this.target).add(off.setFromSpherical(sph));
      this.update();
    }

    pan(dx, dy) {
      const cam = this.camera, dist = cam.position.distanceTo(this.target);
      const h = 2 * dist * Math.tan(cam.fov * Math.PI / 360) / Math.max(1, this.dom.clientHeight);
      const right = new V3().setFromMatrixColumn(cam.matrix, 0), up = new V3().setFromMatrixColumn(cam.matrix, 1);
      const d = right.multiplyScalar(-dx * h).add(up.multiplyScalar(dy * h));
      cam.position.add(d); this.target.add(d); this.update();
    }

    /* Punto de la escena hacia el que se acerca: el plano que pasa por el
       objetivo, perpendicular a la mirada, bajo el punto (cx, cy) de la pantalla. */
    _pointAt(cx, cy) {
      const r = this.dom.getBoundingClientRect();
      const ndc = new THREE.Vector2((cx - r.left) / r.width * 2 - 1, -(cy - r.top) / r.height * 2 + 1);
      this.camera.updateMatrixWorld();
      this._ray.setFromCamera(ndc, this.camera);
      const n = this.camera.getWorldDirection(new V3());
      const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(n, this.target);
      const p = new V3();
      return this._ray.ray.intersectPlane(plane, p) ? p : this.target.clone();
    }

    /* k < 1 acerca, k > 1 aleja; la cámara y el objetivo se escalan alrededor del punto. */
    zoomAt(k, cx, cy) {
      const dist = this.camera.position.distanceTo(this.target);
      k = Math.min(this.maxDistance / dist, Math.max(this.minDistance / dist, k));
      if (Math.abs(k - 1) < 1e-6) return;
      const p = cx == null ? this.target.clone() : this._pointAt(cx, cy);
      this.camera.position.sub(p).multiplyScalar(k).add(p);
      this.target.sub(p).multiplyScalar(k).add(p);
      this.update();
    }

    _bind() {
      const dom = this.dom;
      dom.addEventListener('contextmenu', e => e.preventDefault());
      dom.addEventListener('wheel', e => {
        if (!this.enabled) return;
        e.preventDefault();
        const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
        this.zoomAt(Math.exp(dy * 0.0015 * this.zoomSpeed), e.clientX, e.clientY);
      }, { passive: false });

      dom.addEventListener('pointerdown', e => {
        if (!this.enabled) return;
        dom.setPointerCapture?.(e.pointerId);
        this._ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
        this._mode = (e.button === 2 || e.shiftKey || e.ctrlKey || e.metaKey) ? 'pan' : 'rotate';
        this._pinch = null;
      });
      const end = e => { this._ptrs.delete(e.pointerId); this._pinch = null; };
      dom.addEventListener('pointerup', end);
      dom.addEventListener('pointercancel', end);
      dom.addEventListener('pointermove', e => {
        if (!this.enabled || !this._ptrs.has(e.pointerId)) return;
        const prev = this._ptrs.get(e.pointerId), dx = e.clientX - prev.x, dy = e.clientY - prev.y;
        this._ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (this._ptrs.size >= 2) {
          const [a, b] = [...this._ptrs.values()];
          const d = Math.hypot(a.x - b.x, a.y - b.y), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
          if (this._pinch) {
            if (d > 0 && this._pinch.d > 0) this.zoomAt(this._pinch.d / d, mx, my);
            this.pan(mx - this._pinch.mx, my - this._pinch.my);
          }
          this._pinch = { d, mx, my };
          return;
        }
        if (this._mode === 'pan') this.pan(dx, dy); else this.rotate(dx, dy);
      });
    }
  }
  THREE.CamaraOrbita = CamaraOrbita;
})();
