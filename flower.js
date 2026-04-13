/* =========================================
   3D VALENTINE BOUQUET — Late Birthday Gift
   Full 360° rotation, bloom hint fix,
   WA message textarea, iOS optimized.
   ========================================= */

(function () {
  'use strict';

  // ── Device ──────────────────────────────
  const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

  const Q = {
    petalSeg: isMobile ? 5 : 8,
    petalRing: isMobile ? 6 : 10,
    latheSeg: isMobile ? 24 : 48,
    shadowSize: isMobile ? 512 : 1024,
    dustCount: isMobile ? 35 : 100,
    burstCount: isMobile ? 30 : 70,
    heartBurst: isMobile ? 5 : 10,
    fillerN: isMobile ? 6 : 12,
    fillerDots: isMobile ? 3 : 5,
    tubeSeg: isMobile ? 8 : 16,
    sphDet: isMobile ? 8 : 12,
    maxHearts: isMobile ? 4 : 10
  };

  // ── State ───────────────────────────────
  const S = {
    bloomed: false,
    blooming: false,
    bloomProg: 0,
    msgVisible: false,
    ready: false,
    mx: 0,
    t: 0
  };

  // ── WhatsApp number (CHANGE THIS) ───────
  const WA_NUMBER = '62081290679370';

  // ── Intro ───────────────────────────────
  const introScreen = document.getElementById('intro-screen');
  const mainScene = document.getElementById('main-scene');
  const bubbles = ['bubble1','bubble2','bubble3','bubble4'].map(id => document.getElementById(id));
  const giftSection = document.getElementById('giftSection');
  const giftBox = document.getElementById('giftBox');

  let delay = 600;
  bubbles.forEach((b, i) => setTimeout(() => b.classList.add('show'), delay + i * 900));
  setTimeout(() => giftSection.classList.add('show'), delay + bubbles.length * 900 + 400);

  let opened = false;
  function openGift() {
    if (opened) return;
    opened = true;
    giftBox.classList.add('opening');
    burstGift();
    setTimeout(() => {
      introScreen.classList.add('exit');
      mainScene.classList.remove('hidden');
      setTimeout(() => { introScreen.style.display = 'none'; init3D(); }, 1000);
    }, 900);
  }

  giftBox.addEventListener('click', openGift);
  giftBox.addEventListener('touchend', e => { e.preventDefault(); openGift(); }, { passive: false });

  function burstGift() {
    const icons = ['heart','star','sparkle','heart','star','heart','sparkle','heart'];
    const rect = giftBox.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height * 0.3;
    const n = isMobile ? 7 : 12;

    for (let i = 0; i < n; i++) {
      const el = document.createElementNS('http://www.w3.org/2000/svg','svg');
      const size = 12 + Math.random() * 10;
      el.setAttribute('viewBox','0 0 24 24');
      el.setAttribute('width', size);
      el.setAttribute('height', size);
      el.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;pointer-events:none;z-index:9999;will-change:transform,opacity;`;

      const type = icons[i % icons.length];
      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      if (type === 'heart') {
        path.setAttribute('d','M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z');
        path.setAttribute('fill', ['#e57397','#f8bbd0','#c2185b'][Math.floor(Math.random()*3)]);
      } else if (type === 'star') {
        path.setAttribute('d','M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4l-6.4 4.8 2.4-7.2-6-4.8h7.6z');
        path.setAttribute('fill', ['#f0d68a','#d4a853'][Math.floor(Math.random()*2)]);
      } else {
        path.setAttribute('d','M12 0l1.8 8.5L22 12l-8.2 3.5L12 24l-1.8-8.5L2 12l8.2-3.5z');
        path.setAttribute('fill','#f0d68a');
      }
      el.appendChild(path);
      document.body.appendChild(el);

      const ang = (Math.random() - 0.5) * Math.PI * 1.4;
      const dist = 50 + Math.random() * 100;
      const dx = Math.sin(ang) * dist;
      const dy = -Math.abs(Math.cos(ang)) * dist - Math.random() * 30;

      requestAnimationFrame(() => {
        el.style.transition = 'all 0.7s cubic-bezier(0.2,0.8,0.3,1)';
        el.style.transform = `translate(${dx}px,${dy}px) rotate(${(Math.random()-0.5)*360}deg) scale(0.15)`;
        el.style.opacity = '0';
      });
      setTimeout(() => el.remove(), 900);
    }
  }

  // ── WhatsApp button logic ───────────────
  const waButton = document.getElementById('waButton');
  const msgInput = document.getElementById('msgInput');

  waButton.addEventListener('click', (e) => {
    e.preventDefault();
    const text = msgInput.value.trim();
    const encoded = encodeURIComponent(text || 'Haii, makasih bunganya!');
    window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, '_blank');
  });

  // ── Three.js ────────────────────────────
  let scene, camera, renderer, controls;
  let bouquetGroup, petalMeshes = [];
  let dustSystem, burstParticles = null;
  let heartPool = [];
  let ambLight, mainLight, rimLight;
  let clock;
  let sharedHeartGeom, heartMats = [];

  function init3D() {
    if (S.ready) return;
    S.ready = true;
    clock = new THREE.Clock();

    const canvas = document.getElementById('flower-canvas');
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0d0a0e, 0.025);

    camera = new THREE.PerspectiveCamera(
      isMobile ? 50 : 42,
      window.innerWidth / window.innerHeight,
      0.1, 50
    );
    camera.position.set(0, 3.5, isMobile ? 8 : 7);
    camera.lookAt(0, 2.2, 0);

    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: false,
      powerPreference: isMobile ? 'low-power' : 'high-performance',
      stencil: false,
      depth: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(dpr);
    renderer.shadowMap.enabled = !isIOS;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.85;
    renderer.outputEncoding = THREE.sRGBEncoding;

    // OrbitControls — FULL 360° rotation
    controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 2.5;
    controls.maxDistance = 18;
    // No polar angle limits → full vertical rotation
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI;
    // No azimuth limits → full horizontal rotation
    controls.minAzimuthAngle = -Infinity;
    controls.maxAzimuthAngle = Infinity;
    controls.target.set(0, 2.2, 0);
    controls.rotateSpeed = isMobile ? 0.6 : 0.9;
    controls.zoomSpeed = isMobile ? 0.8 : 1.0;
    controls.update();

    canvas.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

    preCreate();
    setupLights();
    buildBouquet();
    buildDust();
    buildGround();
    setupUI();

    animate();
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', () => {
      document.hidden ? clock.stop() : clock.start();
    });
  }

  function preCreate() {
    const hs = new THREE.Shape();
    hs.moveTo(0, 0);
    hs.bezierCurveTo(0, -0.04, -0.06, -0.04, -0.06, 0);
    hs.bezierCurveTo(-0.06, 0.04, 0, 0.08, 0, 0.12);
    hs.bezierCurveTo(0, 0.08, 0.06, 0.04, 0.06, 0);
    hs.bezierCurveTo(0.06, -0.04, 0, -0.04, 0, 0);
    sharedHeartGeom = new THREE.ShapeGeometry(hs, isMobile ? 4 : 7);

    [0xc2185b, 0xe57397, 0xf8bbd0].forEach(c => {
      heartMats.push(new THREE.MeshBasicMaterial({
        color: c, side: THREE.DoubleSide, transparent: true, opacity: 0.65
      }));
    });
  }

  // ── Lights ──────────────────────────────
  function setupLights() {
    ambLight = new THREE.AmbientLight(0x2a1520, isMobile ? 0.65 : 0.5);
    scene.add(ambLight);

    mainLight = new THREE.DirectionalLight(0xffeedd, 1.1);
    mainLight.position.set(3, 7, 5);
    if (!isIOS) {
      mainLight.castShadow = true;
      mainLight.shadow.mapSize.set(Q.shadowSize, Q.shadowSize);
      mainLight.shadow.radius = 3;
    }
    scene.add(mainLight);

    rimLight = new THREE.PointLight(0xc2185b, 0.7, 18);
    rimLight.position.set(-3, 4, -2);
    scene.add(rimLight);

    const groundGlow = new THREE.PointLight(0x4a2040, 0.3, 10);
    groundGlow.position.set(0, -0.5, 2);
    scene.add(groundGlow);

    const warmAccent = new THREE.PointLight(0xd4a853, 0.2, 10);
    warmAccent.position.set(2, 5, -1);
    scene.add(warmAccent);

    if (!isMobile) {
      const backFill = new THREE.PointLight(0x6a2040, 0.25, 12);
      backFill.position.set(-2, 2, -4);
      scene.add(backFill);
    }
  }

  // ── Bouquet ─────────────────────────────
  function buildBouquet() {
    bouquetGroup = new THREE.Group();
    scene.add(bouquetGroup);

    mkWrap();
    mkRibbon();

    [
      { x:0,    y:3.4, z:0,    s:1.0,  ry:0 },
      { x:0.5,  y:3.1, z:0.3,  s:0.85, ry:0.8 },
      { x:-0.45,y:3.0, z:0.35, s:0.8,  ry:-0.6 },
      { x:0.35, y:2.85,z:-0.4, s:0.75, ry:1.5 },
      { x:-0.4, y:2.9, z:-0.3, s:0.78, ry:-1.2 }
    ].forEach((c, i) => mkRose(c, i));

    mkFiller();
    mkLeaves();
  }

  function mkWrap() {
    const pts = [];
    const n = isMobile ? 12 : 20;
    for (let i = 0; i <= n; i++) { const t = i/n; pts.push(new THREE.Vector2(0.15+t*0.65, t*2.2)); }
    pts.push(new THREE.Vector2(0.95, 2.3), new THREE.Vector2(1.0, 2.35));

    const mat = new THREE.MeshStandardMaterial({ color: 0xf5e6d8, roughness: 0.75, side: THREE.DoubleSide });
    const w = new THREE.Mesh(new THREE.LatheGeometry(pts, Q.latheSeg), mat);
    w.castShadow = !isIOS; w.receiveShadow = !isIOS;
    bouquetGroup.add(w);

    const tp = [
      new THREE.Vector2(0.7,2.15), new THREE.Vector2(0.85,2.45),
      new THREE.Vector2(0.95,2.6), new THREE.Vector2(1.1,2.75), new THREE.Vector2(1.15,2.8)
    ];
    const tMat = new THREE.MeshStandardMaterial({ color: 0xf8bbd0, roughness: 0.6, transparent: true, opacity: 0.55, side: THREE.DoubleSide });
    bouquetGroup.add(new THREE.Mesh(new THREE.LatheGeometry(tp, isMobile ? 16 : 24), tMat));
    if (!isMobile) {
      const t2 = new THREE.Mesh(new THREE.LatheGeometry(tp, 24), tMat);
      t2.rotation.y = Math.PI / 6; t2.scale.set(0.95, 1.02, 0.95);
      bouquetGroup.add(t2);
    }
  }

  function mkRibbon() {
    const rm = new THREE.MeshStandardMaterial({ color:0xd4a853, roughness:0.2, metalness:0.7, emissive:0xd4a853, emissiveIntensity:0.08 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.035, 6, isMobile?24:48), rm);
    ring.position.y = 1.8; ring.rotation.x = Math.PI/2;
    bouquetGroup.add(ring);

    const bm = new THREE.MeshStandardMaterial({ color:0xd4a853, roughness:0.25, metalness:0.6, side: THREE.DoubleSide });
    const bs = new THREE.Shape();
    bs.moveTo(0,0); bs.quadraticCurveTo(0.15,0.12,0.25,0); bs.quadraticCurveTo(0.15,-0.08,0,0);
    const bg = new THREE.ExtrudeGeometry(bs, { depth:0.03, bevelEnabled:true, bevelThickness:0.008, bevelSize:0.008, bevelSegments:2 });

    const bL = new THREE.Mesh(bg, bm);
    bL.position.set(-0.1,1.8,0.6); bL.rotation.set(0.3,-0.3,0.5); bL.scale.setScalar(1.3);
    bouquetGroup.add(bL);
    const bR = new THREE.Mesh(bg, bm);
    bR.position.set(0.1,1.8,0.6); bR.rotation.set(0.3,0.3,-0.5); bR.scale.setScalar(1.3);
    bouquetGroup.add(bR);

    const ts = isMobile ? 6 : 12;
    [[[-0.05,1.8,0.62],[-0.15,1.5,0.65],[-0.08,1.2,0.6]],
     [[0.05,1.8,0.62],[0.18,1.45,0.68],[0.1,1.15,0.62]]].forEach(pts => {
      const c = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)));
      bouquetGroup.add(new THREE.Mesh(new THREE.TubeGeometry(c, ts, 0.018, 4, false), bm));
    });
  }

  function mkRose(cfg, ri) {
    const rg = new THREE.Group();
    rg.position.set(cfg.x, cfg.y, cfg.z);
    rg.rotation.y = cfg.ry;
    rg.scale.setScalar(cfg.s);

    const sc = new THREE.CatmullRomCurve3([
      new THREE.Vector3(cfg.x*0.3,-0.8,cfg.z*0.3),
      new THREE.Vector3(cfg.x*0.5,-0.4,cfg.z*0.5),
      new THREE.Vector3(0,0,0)
    ]);
    const sm = new THREE.MeshStandardMaterial({ color:0x2d5a27, roughness:0.65, metalness:0.05 });
    rg.add(new THREE.Mesh(new THREE.TubeGeometry(sc, Q.tubeSeg, 0.03, 4, false), sm));

    const cx = new THREE.Mesh(new THREE.ConeGeometry(0.15,0.12,5), new THREE.MeshStandardMaterial({ color:0x2d6b27, roughness:0.6 }));
    cx.position.y = -0.04; cx.rotation.x = Math.PI;
    rg.add(cx);

    const pm = new THREE.MeshStandardMaterial({ color:0xd4a853, roughness:0.4, metalness:0.3, emissive:0xd4a853, emissiveIntensity:0.1 });
    const pistil = new THREE.Mesh(new THREE.SphereGeometry(0.08, Q.sphDet, Q.sphDet), pm);
    pistil.position.y = 0.05;
    rg.add(pistil);

    const cols = [0x8b1a3a, 0xa52050, 0xc2185b, 0xd4426a, 0xe57397, 0xf08aaa];
    const layers = [
      { n:4, r:0.05, w:0.14, h:0.28, cu:0.9,  y:0.02,  ca:0.18, ba:0.4,  li:0 },
      { n:5, r:0.09, w:0.18, h:0.32, cu:0.75, y:0.0,   ca:0.22, ba:0.48, li:1 },
      { n:5, r:0.14, w:0.24, h:0.38, cu:0.55, y:-0.02, ca:0.28, ba:0.56, li:2 },
      { n:6, r:0.2,  w:0.3,  h:0.42, cu:0.4,  y:-0.04, ca:0.32, ba:0.64, li:3 },
      { n:isMobile?6:8, r:0.26, w:0.34, h:0.46, cu:0.28, y:-0.05, ca:0.36, ba:0.72, li:4 },
      { n:isMobile?7:9, r:0.32, w:0.38, h:0.5,  cu:0.18, y:-0.06, ca:0.4,  ba:0.8,  li:5 }
    ];

    layers.forEach(l => {
      for (let i = 0; i < l.n; i++) {
        const ang = (i/l.n)*Math.PI*2 + l.li*0.35 + ri*0.7;
        const petal = mkPetal(l.w, l.h, l.cu, cols[l.li]);
        const piv = new THREE.Group();
        piv.position.set(0, l.y, 0);
        piv.rotation.y = ang;
        piv.rotation.x = -l.ca * Math.PI;
        petal.position.x = l.r;
        petal.rotation.z = -Math.PI * 0.08;
        piv.add(petal);
        rg.add(piv);
        petalMeshes.push({
          pivot: piv, mesh: petal,
          closed: -l.ca * Math.PI,
          bloom: l.ca * Math.PI * 0.25,
          li: l.li, ri, ao: i / l.n
        });
      }
    });

    bouquetGroup.add(rg);
  }

  function mkPetal(w, h, curl, color) {
    const seg = Q.petalSeg, rings = Q.petalRing;
    const v = [], idx = [], uv = [];
    for (let r = 0; r <= rings; r++) {
      const rv = r / rings;
      for (let s = 0; s <= seg; s++) {
        const u = s / seg;
        const wf = Math.sin(rv * Math.PI) * w;
        v.push((u-0.5)*wf, rv*h, -curl*rv*rv*Math.sin(u*Math.PI)*0.25);
        uv.push(u, rv);
      }
    }
    for (let r = 0; r < rings; r++) {
      for (let s = 0; s < seg; s++) {
        const a = r*(seg+1)+s, b=a+1, c=a+(seg+1), d=c+1;
        idx.push(a,b,c, b,d,c);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();

    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({
      color, roughness:0.52, metalness:0.04, side:THREE.DoubleSide, transparent:true, opacity:0.9
    }));
    m.castShadow = !isIOS;
    return m;
  }

  function mkFiller() {
    const mat = new THREE.MeshStandardMaterial({ color:0xffffff, roughness:0.5, emissive:0xffffff, emissiveIntensity:0.05 });
    const dg = new THREE.SphereGeometry(0.025, 4, 4);
    const sg = new THREE.CylinderGeometry(0.008, 0.008, 0.3, 3);
    const smat = new THREE.MeshStandardMaterial({ color:0x3a7033, roughness:0.6 });

    const all = [
      [0.6,3.2,0.2],[-0.55,3.15,0.25],[0.3,3.35,-0.35],[-0.3,3.3,-0.35],
      [0.65,2.9,-0.2],[-0.6,2.85,-0.15],[0.15,3.5,0.3],[-0.2,3.45,0.25],
      [0.5,3.0,0.5],[-0.45,3.05,0.45],[0.7,3.1,0.0],[-0.65,3.0,0.1]
    ].slice(0, Q.fillerN);

    all.forEach(p => {
      const cg = new THREE.Group();
      cg.position.set(p[0], p[1], p[2]);
      for (let i = 0; i < Q.fillerDots; i++) {
        const d = new THREE.Mesh(dg, mat);
        d.position.set((Math.random()-0.5)*0.08,(Math.random()-0.5)*0.06,(Math.random()-0.5)*0.08);
        cg.add(d);
      }
      const st = new THREE.Mesh(sg, smat);
      st.position.y = -0.15;
      cg.add(st);
      bouquetGroup.add(cg);
    });
  }

  function mkLeaves() {
    const ls = new THREE.Shape();
    ls.moveTo(0,0); ls.quadraticCurveTo(0.12,0.06,0.28,0); ls.quadraticCurveTo(0.12,-0.06,0,0);
    const lg = new THREE.ShapeGeometry(ls, isMobile ? 4 : 8);
    const lm = new THREE.MeshStandardMaterial({ color:0x2d6b27, roughness:0.6, metalness:0.02, side:THREE.DoubleSide });
    const dm = new THREE.MeshStandardMaterial({ color:0x1e5020, roughness:0.65, metalness:0.02, side:THREE.DoubleSide });

    const cfg = [
      { p:[0.8,2.6,0.3], r:[0.4,0.5,-0.3], s:2.2, m:lm },
      { p:[-0.75,2.5,0.35], r:[-0.3,-0.4,0.4], s:2.0, m:dm },
      { p:[0.5,2.4,-0.6], r:[0.5,1.2,-0.2], s:1.8, m:lm },
      { p:[-0.55,2.45,-0.5], r:[-0.4,-1.0,0.3], s:1.9, m:dm }
    ];
    if (!isMobile) {
      cfg.push(
        { p:[0.9,2.8,-0.1], r:[0.2,0.8,-0.5], s:1.7, m:lm },
        { p:[-0.85,2.75,0.0], r:[-0.2,-0.7,0.5], s:1.8, m:dm }
      );
    }
    cfg.forEach(c => {
      const leaf = new THREE.Mesh(lg, c.m);
      leaf.position.set(...c.p); leaf.rotation.set(...c.r); leaf.scale.setScalar(c.s);
      leaf.castShadow = !isIOS;
      bouquetGroup.add(leaf);
    });
  }

  function buildGround() {
    const g = new THREE.Mesh(
      new THREE.CircleGeometry(10, isMobile ? 32 : 64),
      new THREE.MeshStandardMaterial({ color:0x0d0a0e, roughness:0.85, metalness:0.1 })
    );
    g.rotation.x = -Math.PI/2; g.position.y = -0.02; g.receiveShadow = !isIOS;
    scene.add(g);
  }

  function buildDust() {
    const n = Q.dustCount;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i*3] = (Math.random()-0.5)*14;
      pos[i*3+1] = Math.random()*9;
      pos[i*3+2] = (Math.random()-0.5)*14;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    dustSystem = new THREE.Points(g, new THREE.PointsMaterial({
      color:0xd4a853, size: isMobile ? 0.05 : 0.035,
      transparent:true, opacity:0.4, blending:THREE.AdditiveBlending, depthWrite:false, sizeAttenuation:true
    }));
    scene.add(dustSystem);
  }

  // ── Bloom ───────────────────────────────
  function triggerBloom() {
    if (S.blooming || S.bloomed) return;
    S.blooming = true;
    document.getElementById('bloomBtn').classList.add('used');
    setTimeout(createBurst, 800);
  }

  function createBurst() {
    const n = Q.burstCount;
    const pos = new Float32Array(n*3), cols = new Float32Array(n*3), vels = [];
    const cs = [new THREE.Color(0xd4a853), new THREE.Color(0xf8bbd0), new THREE.Color(0xffffff), new THREE.Color(0xe57397), new THREE.Color(0xf0d68a)];

    for (let i = 0; i < n; i++) {
      pos[i*3]=0; pos[i*3+1]=3.2; pos[i*3+2]=0;
      const th=Math.random()*Math.PI*2, ph=Math.random()*Math.PI*0.6, sp=0.02+Math.random()*0.05;
      vels.push({ x:Math.sin(ph)*Math.cos(th)*sp, y:Math.cos(ph)*sp*1.5+0.01, z:Math.sin(ph)*Math.sin(th)*sp, d:0.96+Math.random()*0.03, g:0.0003+Math.random()*0.0005 });
      const c = cs[Math.floor(Math.random()*cs.length)];
      cols[i*3]=c.r; cols[i*3+1]=c.g; cols[i*3+2]=c.b;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    const m = new THREE.Points(g, new THREE.PointsMaterial({
      size: isMobile ? 0.08 : 0.06, transparent:true, opacity:1,
      blending:THREE.AdditiveBlending, depthWrite:false, vertexColors:true, sizeAttenuation:true
    }));
    scene.add(m);
    burstParticles = { mesh:m, vels, life:1.0 };
    spawnHearts(Q.heartBurst);
  }

  function spawnHearts(count) {
    for (let i = 0; i < count; i++) {
      const mat = heartMats[Math.floor(Math.random()*heartMats.length)].clone();
      mat.opacity = 0.65;
      const h = new THREE.Mesh(sharedHeartGeom, mat);
      const a = (i/count)*Math.PI*2;
      h.position.set(Math.cos(a)*(0.4+Math.random()*0.5), 3.0+Math.random()*0.4, Math.sin(a)*(0.4+Math.random()*0.5));
      h.scale.setScalar(0.5+Math.random()*0.6);
      h.userData = { rs:0.004+Math.random()*0.008, ss:0.5+Math.random(), sa:0.007+Math.random()*0.013, sp:0.007+Math.random()*0.01, l:1, ph:Math.random()*Math.PI*2 };
      scene.add(h);
      heartPool.push(h);
    }
  }

  function spawnOneHeart() {
    if (heartPool.length >= Q.maxHearts) return;
    const mat = heartMats[Math.floor(Math.random()*heartMats.length)].clone();
    mat.opacity = 0.5;
    const h = new THREE.Mesh(sharedHeartGeom, mat);
    const a = Math.random()*Math.PI*2;
    h.position.set(Math.cos(a)*(0.3+Math.random()*0.4), 3+Math.random()*0.3, Math.sin(a)*(0.3+Math.random()*0.4));
    h.scale.setScalar(0.3+Math.random()*0.4);
    h.userData = { rs:0.003+Math.random()*0.006, ss:0.5+Math.random(), sa:0.005+Math.random()*0.01, sp:0.005+Math.random()*0.008, l:1, ph:Math.random()*Math.PI*2 };
    scene.add(h);
    heartPool.push(h);
  }

  // ── Bloom Hint ──────────────────────────
  function showBloomHint() {
    const hint = document.getElementById('bloomHint');
    const btn = document.getElementById('msgToggle');
    setTimeout(() => {
      hint.classList.add('visible');
      btn.classList.add('hint-glow');
      setTimeout(() => hint.classList.add('fade-out'), 8000);
    }, 1500);
  }

  // ── Bloom Update ────────────────────────
  function updateBloom(dt) {
    if (!S.blooming) return;
    S.bloomProg += dt * 0.22;
    if (S.bloomProg >= 1) {
      S.bloomProg = 1; S.blooming = false; S.bloomed = true;
      showBloomHint();
    }
    const t = easeOutCubic(S.bloomProg);
    petalMeshes.forEach(p => {
      const delay = p.ri*0.06 + p.li*0.1;
      const pt = Math.max(0, Math.min(1, (t - delay*0.15)/(1-delay*0.05)));
      const et = easeOutBack(pt);
      p.pivot.rotation.x = THREE.MathUtils.lerp(p.closed, p.bloom, et);
      p.mesh.position.x = 0.05 + et*0.04*(p.li+1);
    });
    if (rimLight) rimLight.intensity = 0.7 + t*0.8;
    if (ambLight) ambLight.intensity = (isMobile?0.65:0.5) + t*0.35;
    if (mainLight) mainLight.intensity = 1.1 + t*0.4;
  }

  function updateBurst(dt) {
    if (!burstParticles) return;
    const bp = burstParticles;
    bp.life -= dt*0.3;
    if (bp.life <= 0) {
      scene.remove(bp.mesh); bp.mesh.geometry.dispose(); bp.mesh.material.dispose();
      burstParticles = null; return;
    }
    bp.mesh.material.opacity = bp.life;
    const pos = bp.mesh.geometry.attributes.position.array;
    for (let i = 0; i < bp.vels.length; i++) {
      const v = bp.vels[i];
      pos[i*3]+=v.x; pos[i*3+1]+=v.y; pos[i*3+2]+=v.z;
      v.x*=v.d; v.y-=v.g; v.y*=v.d; v.z*=v.d;
    }
    bp.mesh.geometry.attributes.position.needsUpdate = true;
  }

  function updateHearts(dt) {
    for (let i = heartPool.length-1; i >= 0; i--) {
      const h = heartPool[i], u = h.userData;
      h.position.y += u.rs;
      h.position.x += Math.sin(S.t*u.ss+u.ph)*u.sa;
      h.rotation.y += u.sp;
      u.l -= dt*0.12;
      h.material.opacity = Math.max(0, u.l*0.65);
      if (u.l <= 0) { scene.remove(h); h.material.dispose(); heartPool.splice(i, 1); }
    }
  }

  // ── UI Setup ────────────────────────────
  function setupUI() {
    document.getElementById('bloomBtn').addEventListener('click', triggerBloom);

    const msgToggle = document.getElementById('msgToggle');
    const card = document.getElementById('messageCard');
    const hint = document.getElementById('bloomHint');

    msgToggle.addEventListener('click', () => {
      S.msgVisible = !S.msgVisible;
      card.classList.toggle('visible', S.msgVisible);
      if (S.msgVisible) {
        hint.classList.add('fade-out');
        msgToggle.classList.remove('hint-glow');
      }
    });

    // Raycaster click on bouquet
    const rc = new THREE.Raycaster(), cv = new THREE.Vector2();
    renderer.domElement.addEventListener('click', e => {
      cv.x = (e.clientX/window.innerWidth)*2-1;
      cv.y = -(e.clientY/window.innerHeight)*2+1;
      rc.setFromCamera(cv, camera);
      if (rc.intersectObjects(bouquetGroup.children, true).length > 0) triggerBloom();
    });

    let interacted = false;
    controls.addEventListener('change', () => {
      if (!interacted) {
        interacted = true;
        setTimeout(() => document.getElementById('controlsHint').classList.add('fade-out'), 2000);
      }
    });
  }

  // ── Render Loop ─────────────────────────
  let frame = 0;

  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    S.t += dt;
    frame++;

    controls.update();

    if (bouquetGroup) {
      bouquetGroup.rotation.z = Math.sin(S.t*0.4)*0.012;
      bouquetGroup.rotation.x = Math.cos(S.t*0.25)*0.006;
    }

    updateBloom(dt);
    updateBurst(dt);
    updateHearts(dt);

    if (S.bloomed) {
      if (!isMobile || frame%2===0) {
        petalMeshes.forEach(p => {
          p.mesh.scale.setScalar(1 + Math.sin(S.t*1.2+p.li*0.4+p.ri*0.6)*0.005);
        });
      }
      if (Math.random() < (isMobile?0.0012:0.003)) spawnOneHeart();
    }

    if (dustSystem && (!isMobile || frame%3===0)) {
      const pos = dustSystem.geometry.attributes.position.array;
      for (let i = 0; i < pos.length; i+=3) {
        pos[i] += Math.sin(S.t*0.2+i)*0.0005;
        pos[i+1] += Math.sin(S.t*0.15+i*0.4)*0.0004;
        pos[i+2] += Math.cos(S.t*0.18+i*0.3)*0.0005;
      }
      dustSystem.geometry.attributes.position.needsUpdate = true;
      dustSystem.material.opacity = 0.3 + Math.sin(S.t*0.6)*0.1;
    }

    if (rimLight) {
      rimLight.intensity = (S.bloomed?1.5:0.7) + Math.sin(S.t*0.6)*0.1;
    }

    if (!isMobile) {
      camera.position.x += (S.mx*0.2 - camera.position.x)*0.005;
    }

    renderer.render(scene, camera);
  }

  function onResize() {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(dpr);
  }

  function easeOutCubic(t) { return 1-Math.pow(1-t,3); }
  function easeOutBack(t) { const c1=1.70158,c3=c1+1; return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2); }

})();
