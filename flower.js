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
    petalSeg: isMobile ? 6 : 8,
    petalRing: isMobile ? 6 : 9,
    latheSeg: isMobile ? 24 : 48,
    shadowSize: isMobile ? 512 : 1024,
    dustCount: isMobile ? 120 : 260,
    burstCount: isMobile ? 55 : 100,
    heartBurst: isMobile ? 8 : 16,
    fillerN: isMobile ? 18 : 26,
    fillerDots: isMobile ? 5 : 8,
    tubeSeg: isMobile ? 8 : 14,
    sphDet: isMobile ? 8 : 12,
    maxHearts: isMobile ? 6 : 14,
    floatingPetalCount: isMobile ? 32 : 64,
    fairyCount: isMobile ? 55 : 110,
    bokehCount: isMobile ? 22 : 44
  };

  // ── State ───────────────────────────────
  const S = {
    bloomed: false,
    blooming: false,
    bloomProg: 0,
    msgVisible: false,
    ready: false,
    mx: 0,
    my: 0,
    t: 0
  };

  // ── WhatsApp number (CHANGE THIS) ───────
  const WA_NUMBER = '62081290679370';

  // ── Intro (WhatsApp Chat Experience) ─────
  const introScreen = document.getElementById('intro-screen');
  const mainScene = document.getElementById('main-scene');
  const giftSection = document.getElementById('giftSection');
  const giftBox = document.getElementById('giftBox');
  const openGiftBtn = document.getElementById('openGiftBtn');
  const waStatus = document.getElementById('waStatus');
  const waChatBody = document.getElementById('waChatBody');

  // ── Background Music (Miguel - Coffee) Dual Controllers ───────────────
  const bgAudio = document.getElementById('bgMusic');
  const waAudioBar = document.getElementById('waAudioBar');
  const waAudioPlayBtn = document.getElementById('waAudioPlayBtn');
  const waPlayIcon = document.getElementById('waPlayIcon');
  const waPauseIcon = document.getElementById('waPauseIcon');
  const waVolSlider = document.getElementById('waVolSlider');
  const waVolText = document.getElementById('waVolText');

  const musicController3D = document.getElementById('musicController3D');
  const musicPlayBtn3D = document.getElementById('musicPlayBtn3D');
  const musicVolSlider3D = document.getElementById('musicVolSlider3D');
  const musicVolText3D = document.getElementById('musicVolText3D');

  let userManuallyPaused = false;

  function setVolume(vol) {
    const clamped = Math.max(0, Math.min(1, vol));
    if (bgAudio) bgAudio.volume = clamped;
    const pct = Math.round(clamped * 100);
    if (waVolSlider) waVolSlider.value = pct;
    if (waVolText) waVolText.textContent = pct + '%';
    if (musicVolSlider3D) musicVolSlider3D.value = pct;
    if (musicVolText3D) musicVolText3D.textContent = pct + '%';
  }

  function updateMusicState(playing) {
    if (waAudioBar) waAudioBar.classList.toggle('playing', playing);
    if (waPlayIcon) waPlayIcon.classList.toggle('hidden', playing);
    if (waPauseIcon) waPauseIcon.classList.toggle('hidden', !playing);

    if (musicController3D) {
      musicController3D.classList.toggle('playing', playing);
      musicController3D.classList.toggle('paused', !playing);
    }
  }

  let chatStarted = false;

  function startMusic() {
    if (!bgAudio || userManuallyPaused) return;
    bgAudio.volume = 0.5;
    setVolume(0.5);
    if (bgAudio.paused) {
      const playPromise = bgAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          updateMusicState(true);
        }).catch((err) => {
          console.log('Autoplay unmuted blocked by browser policy:', err);
        });
      }
    } else {
      updateMusicState(true);
    }
  }

  function initChatAndAudio() {
    if (chatStarted) return;
    chatStarted = true;

    // Dismiss notification banner smoothly if present
    const banner = document.getElementById('waNotifBanner');
    if (banner) {
      banner.classList.add('exit');
      setTimeout(() => { banner.classList.add('hidden'); }, 350);
    }

    // Play music immediately at 50%
    startMusic();

    // Start chat sequence
    runChatSequence();
  }

  function toggleMusic() {
    if (!bgAudio) return;
    if (!chatStarted) {
      initChatAndAudio();
      return;
    }
    if (bgAudio.paused) {
      userManuallyPaused = false;
      bgAudio.volume = (typeof bgAudio.volume === 'number' && bgAudio.volume > 0) ? bgAudio.volume : 0.5;
      const playPromise = bgAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          updateMusicState(true);
        }).catch(err => console.log('Music play error:', err));
      }
    } else {
      userManuallyPaused = true;
      bgAudio.pause();
      updateMusicState(false);
    }
  }

  // Set default initial volume to 50% directly as requested
  if (bgAudio) {
    bgAudio.volume = 0.5;
    setVolume(0.5);
  }

  // Volume slider event handlers
  if (waVolSlider) {
    waVolSlider.addEventListener('input', (e) => {
      const v = parseFloat(e.target.value) / 100;
      setVolume(v);
    });
  }
  if (musicVolSlider3D) {
    musicVolSlider3D.addEventListener('input', (e) => {
      const v = parseFloat(e.target.value) / 100;
      setVolume(v);
    });
  }

  // Play button event handlers
  if (waAudioPlayBtn) waAudioPlayBtn.addEventListener('click', toggleMusic);
  if (musicPlayBtn3D) musicPlayBtn3D.addEventListener('click', toggleMusic);

  // Chat script without emojis or emotes
  const chatScript = [
    {
      bubbleId: 'bubble1',
      parts: [
        { elId: 'bubbleText1', text: 'haiii haii halooo renaa' }
      ]
    },
    {
      bubbleId: 'bubble2',
      parts: [
        { elId: 'bubbleText2', text: 'Happy Late Birthday yaaa!' }
      ]
    },
    {
      bubbleId: 'bubble3',
      parts: [
        { elId: 'bubbleText3', text: 'maaf telat yaaa, soalnya kemarin kita belum kenal WKWKKWKWK' }
      ]
    },
    {
      bubbleId: 'bubble4',
      parts: [
        { elId: 'bubbleText4a', text: 'kamu cantik, imut, lucu, jangan sedihh sedihh yaaaaa.' },
        { elId: 'bubbleText4b', text: 'Happy late birthday sekali lagii!' }
      ]
    }
  ];

  // Smooth lerp camera/view tracking for chat viewport
  let scrollAnimId = null;
  let userIsScrolling = false;
  let scrollTimeout = null;
  if (waChatBody) {
    waChatBody.addEventListener('wheel', () => {
      userIsScrolling = true;
      if (scrollAnimId) cancelAnimationFrame(scrollAnimId);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => { userIsScrolling = false; }, 900);
    }, { passive: true });
  }

  function smoothScrollTo(targetPos, duration = 450) {
    if (!waChatBody) return;
    if (scrollAnimId) cancelAnimationFrame(scrollAnimId);
    const startPos = waChatBody.scrollTop;
    const diff = targetPos - startPos;
    if (Math.abs(diff) < 1) return;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Gentle cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);
      waChatBody.scrollTop = startPos + diff * ease;
      if (progress < 1) {
        scrollAnimId = requestAnimationFrame(step);
      } else {
        scrollAnimId = null;
      }
    }
    scrollAnimId = requestAnimationFrame(step);
  }

  function trackBottom(duration = 400) {
    if (!waChatBody || userIsScrolling) return;
    const target = waChatBody.scrollHeight - waChatBody.clientHeight;
    if (target > waChatBody.scrollTop) {
      smoothScrollTo(target, duration);
    }
  }

  // Typewriter effect function: writes letter by letter gently
  function typeText(element, text, charSpeed = 40) {
    return new Promise((resolve) => {
      let idx = 0;
      element.textContent = '';
      function typeNext() {
        if (idx < text.length) {
          element.textContent += text[idx];
          idx++;
          trackBottom(250);
          setTimeout(typeNext, charSpeed);
        } else {
          trackBottom(350);
          resolve();
        }
      }
      typeNext();
    });
  }

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  async function runChatSequence() {
    await sleep(700);

    for (let i = 0; i < chatScript.length; i++) {
      const msg = chatScript[i];
      const bubbleRow = document.getElementById(msg.bubbleId);

      // Start music autoplay right as the first chat bubble starts!
      if (i === 0) {
        startMusic();
      }

      // Status: sedang mengetik...
      if (waStatus) {
        waStatus.textContent = 'sedang mengetik...';
        waStatus.classList.add('typing');
      }

      await sleep(650);

      // Reveal bubble container
      if (bubbleRow) {
        bubbleRow.classList.add('show');
        trackBottom(350);
      }

      // Type each part smoothly
      for (const part of msg.parts) {
        const el = document.getElementById(part.elId);
        if (el) {
          await typeText(el, part.text, 38);
          await sleep(220);
        }
      }

      // Settle status
      if (waStatus) {
        waStatus.textContent = 'online';
        waStatus.classList.remove('typing');
      }

      trackBottom(400);
      await sleep(800);
    }

    // Gift section delivery
    if (waStatus) {
      waStatus.textContent = 'mengirim bingkisan...';
      waStatus.classList.add('typing');
    }
    await sleep(750);

    if (giftSection) {
      giftSection.classList.add('show');
      trackBottom(500);
      setTimeout(() => trackBottom(400), 250);
    }

    if (waStatus) {
      waStatus.textContent = 'online';
      waStatus.classList.remove('typing');
    }
  }

  // ── Synchronized Audio & Chat Autoplay Manager ──
  function attemptAutoplayOnLoad() {
    if (!bgAudio) {
      initChatAndAudio();
      return;
    }

    bgAudio.volume = 0.5;
    setVolume(0.5);

    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Autoplay allowed by browser policy! Start immediately
        updateMusicState(true);
        initChatAndAudio();
      }).catch((err) => {
        // Autoplay blocked by browser policy without user gesture.
        // Reveal incoming WhatsApp banner to seamlessly capture the first tap
        const banner = document.getElementById('waNotifBanner');
        if (banner) {
          banner.classList.remove('hidden');
        }
      });
    } else {
      initChatAndAudio();
    }
  }

  // Handle interaction fallback to start audio and chat simultaneously
  const waNotifBanner = document.getElementById('waNotifBanner');
  if (waNotifBanner) {
    waNotifBanner.addEventListener('click', (e) => {
      e.stopPropagation();
      initChatAndAudio();
    });
    waNotifBanner.addEventListener('touchend', (e) => {
      e.stopPropagation();
      initChatAndAudio();
    });
  }

  if (introScreen) {
    introScreen.addEventListener('click', () => {
      if (!chatStarted) initChatAndAudio();
    });
    introScreen.addEventListener('touchend', () => {
      if (!chatStarted) initChatAndAudio();
    });
  }

  window.addEventListener('pointerdown', () => {
    if (!chatStarted) initChatAndAudio();
  }, { once: true });

  // Kick off initial autoplay check
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attemptAutoplayOnLoad);
  } else {
    attemptAutoplayOnLoad();
  }

  let opened = false;
  function openGift() {
    if (opened) return;
    opened = true;
    startMusic();
    if (giftBox) giftBox.classList.add('opening');
    burstGift();
    setTimeout(() => {
      introScreen.classList.add('exit');
      mainScene.classList.remove('hidden');
      setTimeout(() => { introScreen.style.display = 'none'; init3D(); }, 850);
    }, 800);
  }

  if (giftBox) {
    giftBox.addEventListener('click', openGift);
    giftBox.addEventListener('touchend', e => { e.preventDefault(); openGift(); }, { passive: false });
  }
  if (openGiftBtn) {
    openGiftBtn.addEventListener('click', openGift);
    openGiftBtn.addEventListener('touchend', e => { e.preventDefault(); openGift(); }, { passive: false });
  }

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

  // ── WhatsApp & Quick-Reply Chip logic ───────────────
  const waButton = document.getElementById('waButton');
  const msgInput = document.getElementById('msgInput');

  if (waButton) {
    waButton.addEventListener('click', (e) => {
      e.preventDefault();
      const text = msgInput ? msgInput.value.trim() : '';
      const encoded = encodeURIComponent(text || 'Haii Daniel, makasih banyak ya bunganya! Suka bangeeet!');
      window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, '_blank');
    });
  }

  // Quick reply chip suggestions
  document.querySelectorAll('.chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-text');
      if (msgInput && text) {
        msgInput.value = text;
        msgInput.focus();
      }
    });
  });

  // ── Three.js ────────────────────────────
  let scene, camera, renderer, controls;
  let bouquetGroup, petalMeshes = [];
  let flowerHeads = [];
  let dustSystem, burstParticles = null;
  let heartPool = [];
  let floatingPetals = [];
  let fairyLightsPoints = null;
  let fairyLightsData = [];
  let bokehPoints = null;
  let bokehData = [];
  let groundPedestalGroup = null;
  let ambLight, mainLight, rimLight, groundGlow, warmAccent, bouquetSpot;
  let clock;
  let sharedHeartGeom, heartMats = [];
  let particleTexture = null;

  // Antigravity Dynamic Physics & Ribbon Simulation
  let dynamicRibbonStreamers = [];
  let currentTilt = { x: 0, y: 0, z: 0 };

  // 3D Peony Asset State (glTF 2.0 Sarah Bernhardt)
  let peonyGLTFGeometry = null;
  let peonyGLTFMaterial = null;
  let peonyGLTFLoaded = false;

  function loadPeonyModel() {
    if (typeof THREE.GLTFLoader === 'undefined') {
      console.warn('GLTFLoader not available, using procedural peonies');
      return;
    }
    const loader = new THREE.GLTFLoader();
    loader.load('peony.glb', (gltf) => {
      let rawMesh = null;
      gltf.scene.traverse((c) => {
        if (c.isMesh && !rawMesh) rawMesh = c;
      });

      if (!rawMesh) {
        console.warn('No mesh found in peony.glb');
        return;
      }

      // Clone geometry and center/normalize
      const geom = rawMesh.geometry.clone();
      // Center in X and Z, and place base/calyx attachment at y = 0
      geom.translate(0, 0.125, 0.067);
      geom.computeVertexNormals();

      // Configure Sarah Bernhardt velvet petal material
      const mat = rawMesh.material.clone();
      mat.side = THREE.DoubleSide;
      mat.roughness = 0.40;
      mat.metalness = 0.02;
      if (mat.map) {
        mat.map.encoding = THREE.sRGBEncoding;
        if (renderer && renderer.capabilities) {
          mat.map.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
        }
      }

      peonyGLTFGeometry = geom;
      peonyGLTFMaterial = mat;
      peonyGLTFLoaded = true;

      // Update active flowerHeads
      flowerHeads.forEach((fh) => {
        const hc = fh.userData.headContainer;
        if (hc) {
          while (hc.children.length > 0) {
            hc.remove(hc.children[0]);
          }
          const mesh = new THREE.Mesh(peonyGLTFGeometry, peonyGLTFMaterial);
          mesh.castShadow = !isIOS;
          mesh.receiveShadow = !isIOS;
          hc.add(mesh);

          const scaleFactor = S.bloomed ? 1.04 : (S.blooming ? 0.82 + easeOutBack(S.bloomProg) * 0.22 : 0.82);
          hc.scale.setScalar(fh.userData.baseScale * scaleFactor);
        }
      });
    }, undefined, (err) => {
      console.warn('Failed to load peony.glb, fallback to procedural:', err);
    });
  }

  function getParticleTexture() {
    if (particleTexture) return particleTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.25, 'rgba(255, 240, 225, 0.85)');
    grad.addColorStop(0.55, 'rgba(235, 140, 175, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    particleTexture = new THREE.CanvasTexture(canvas);
    return particleTexture;
  }

  let floristCardMesh = null;
  let cardTexture = null;
  let cardBackTexture = null;

  function renderCardCanvas(canvas, isFront = true) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // 1. Soft warm ivory-linen handmade paper background
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#fffdfa');
    bgGrad.addColorStop(0.35, '#fcf7ef');
    bgGrad.addColorStop(0.75, '#f8f1e3');
    bgGrad.addColorStop(1, '#f1e6d4');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle paper grain / micro texture
    ctx.fillStyle = 'rgba(180, 150, 120, 0.022)';
    for (let i = 0; i < 3500; i++) {
      const rx = Math.random() * W;
      const ry = Math.random() * H;
      ctx.fillRect(rx, ry, 1.5, 1.5);
    }

    // Soft watercolor blush aura
    const blushGrad = ctx.createRadialGradient(W * 0.5, H * 0.42, 30, W * 0.5, H * 0.42, 320);
    blushGrad.addColorStop(0, 'rgba(248, 187, 208, 0.32)');
    blushGrad.addColorStop(0.55, 'rgba(252, 228, 236, 0.16)');
    blushGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = blushGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Elegant gold foil double border
    ctx.strokeStyle = 'rgba(212, 168, 83, 0.48)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(34, 34, W - 68, H - 68);

    ctx.strokeStyle = 'rgba(212, 168, 83, 0.88)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(48, 48, W - 96, H - 96);

    // Corner decorative gold diamonds & accents
    const corners = [
      [48, 48], [W - 48, 48],
      [48, H - 48], [W - 48, H - 48]
    ];
    ctx.fillStyle = '#d4a853';
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (isFront) {
      // 3. Top Florist Monogram / Botanical Crest
      ctx.fillStyle = '#a88438';
      ctx.font = '32px serif';
      ctx.fillText('❦', W * 0.5, 96);

      ctx.fillStyle = '#b38e4a';
      ctx.font = '700 13px "Nunito", sans-serif';
      if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '6px';
      ctx.fillText('LUXURY FLORAL ATELIER', W * 0.5, 136);

      // Gold divider hairline with central diamond
      ctx.strokeStyle = 'rgba(212, 168, 83, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(W * 0.5 - 170, 168);
      ctx.lineTo(W * 0.5 - 28, 168);
      ctx.moveTo(W * 0.5 + 28, 168);
      ctx.lineTo(W * 0.5 + 170, 168);
      ctx.stroke();

      ctx.fillStyle = '#d4a853';
      ctx.font = '13px serif';
      ctx.fillText('◆', W * 0.5, 168);

      // 4. Hero Calligraphy: "For Rena"
      ctx.fillStyle = '#241914';
      ctx.font = 'italic 76px "Great Vibes", "Lora", Georgia, serif';
      if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '2px';
      ctx.shadowColor = 'rgba(212, 168, 83, 0.28)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;
      ctx.fillText('For Rena', W * 0.5, 256);
      ctx.shadowColor = 'transparent';

      // Fine gold divider
      ctx.strokeStyle = 'rgba(212, 168, 83, 0.40)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(W * 0.5 - 120, 322);
      ctx.lineTo(W * 0.5 + 120, 322);
      ctx.stroke();

      // 5. Main Hero Message: "suka gak bunganya?"
      ctx.fillStyle = '#221813';
      ctx.font = 'italic 600 46px "Lora", Georgia, serif';
      if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0.5px';
      ctx.fillText('suka gak bunganya?', W * 0.5, 396);

      // Subtitle: "Semoga kamu suka ya."
      ctx.fillStyle = '#6b554b';
      ctx.font = 'italic 400 27px "Lora", Georgia, serif';
      if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0.5px';
      ctx.fillText('Semoga kamu suka ya.', W * 0.5, 452);

      // Decorative divider with flower motif
      ctx.fillStyle = '#cda046';
      ctx.font = '18px serif';
      ctx.fillText('❧  ❀  ☙', W * 0.5, 520);

      // 6. Birthday Wish
      ctx.fillStyle = '#9c7234';
      ctx.font = '700 21px "Nunito", sans-serif';
      if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '4px';
      ctx.fillText('HAPPY LATE BIRTHDAY!', W * 0.5, 582);

      ctx.fillStyle = '#57463e';
      ctx.font = 'italic 22px "Lora", Georgia, serif';
      if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0.5px';
      ctx.fillText('semoga hari-harimu selalu mekar indah', W * 0.5, 640);
      ctx.fillText('dan dipenuhi banyak kebahagiaan.', W * 0.5, 680);

      // 7. Signature
      ctx.fillStyle = '#8a7266';
      ctx.font = 'italic 21px "Lora", Georgia, serif';
      ctx.fillText('with all my love,', W * 0.5, 760);

      ctx.fillStyle = '#221813';
      ctx.font = 'italic 62px "Great Vibes", "Lora", Georgia, serif';
      ctx.fillText('Daniel', W * 0.5, 830);

      // 8. Interactive Call-To-Action Button / Badge
      const btnW = 390, btnH = 48, btnX = (W - btnW) / 2, btnY = 918, btnR = 24;
      ctx.fillStyle = 'rgba(212, 168, 83, 0.14)';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(btnX, btnY, btnW, btnH, btnR);
      } else {
        ctx.rect(btnX, btnY, btnW, btnH);
      }
      ctx.fill();

      ctx.strokeStyle = 'rgba(200, 155, 70, 0.72)';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      ctx.fillStyle = '#7a5a22';
      ctx.font = '700 14px "Nunito", sans-serif';
      if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '2px';
      ctx.fillText('✦ KETUK KARTU UNTUK MEMBALAS ✦', W * 0.5, btnY + btnH / 2 + 1);
    } else {
      // Back of card
      ctx.fillStyle = '#a88438';
      ctx.font = '40px serif';
      ctx.fillText('❦', W * 0.5, H * 0.42);

      ctx.fillStyle = '#b38e4a';
      ctx.font = '700 15px "Nunito", sans-serif';
      if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '6px';
      ctx.fillText('FLORAL ATELIER', W * 0.5, H * 0.42 + 55);

      ctx.fillStyle = '#8f776a';
      ctx.font = 'italic 20px "Lora", serif';
      if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '1px';
      ctx.fillText('Special Edition · For Rena', W * 0.5, H * 0.42 + 95);
      ctx.fillText('with love, Daniel', W * 0.5, H * 0.42 + 130);
    }
  }

  function getCardTexture() {
    if (cardTexture) return cardTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 768;
    canvas.height = 1056;
    renderCardCanvas(canvas, true);

    cardTexture = new THREE.CanvasTexture(canvas);
    cardTexture.encoding = THREE.sRGBEncoding;
    cardTexture.generateMipmaps = true;
    cardTexture.minFilter = THREE.LinearMipmapLinearFilter;

    // Refresh when web fonts finish loading
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        renderCardCanvas(canvas, true);
        cardTexture.needsUpdate = true;
      });
    }
    return cardTexture;
  }

  function getCardBackTexture() {
    if (cardBackTexture) return cardBackTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 768;
    canvas.height = 1056;
    renderCardCanvas(canvas, false);

    cardBackTexture = new THREE.CanvasTexture(canvas);
    cardBackTexture.encoding = THREE.sRGBEncoding;
    cardBackTexture.generateMipmaps = true;
    cardBackTexture.minFilter = THREE.LinearMipmapLinearFilter;

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        renderCardCanvas(canvas, false);
        cardBackTexture.needsUpdate = true;
      });
    }
    return cardBackTexture;
  }

  let ribbonTexture = null;
  function getRibbonTexture() {
    if (ribbonTexture) return ribbonTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Crisp pure white silk ribbon background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 128, 1024);

    // Subtle thin gold borders on ribbon edges
    ctx.strokeStyle = 'rgba(212, 168, 83, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 0, 128 - 12, 1024);

    // Gold printed lettering: "FOR RENA" repeating vertically
    ctx.fillStyle = '#b88938';
    ctx.font = 'bold 22px "Nunito", "Lora", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const steps = 7;
    for (let i = 0; i < steps; i++) {
      const y = 80 + i * 145;
      ctx.save();
      ctx.translate(64, y);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('FOR RENA', 0, 0);
      ctx.restore();

      ctx.fillStyle = '#d4a853';
      ctx.beginPath();
      ctx.arc(64, y + 72, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ribbonTexture = new THREE.CanvasTexture(canvas);
    ribbonTexture.encoding = THREE.sRGBEncoding;
    ribbonTexture.wrapS = THREE.RepeatWrapping;
    ribbonTexture.wrapT = THREE.RepeatWrapping;
    return ribbonTexture;
  }

  function init3D() {
    if (S.ready) return;
    S.ready = true;
    clock = new THREE.Clock();

    const canvas = document.getElementById('flower-canvas');
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c0710, 0.022);

    camera = new THREE.PerspectiveCamera(
      isMobile ? 50 : 42,
      window.innerWidth / window.innerHeight,
      0.1, 50
    );
    camera.position.set(0, 3.4, isMobile ? 8.6 : 7.6);
    camera.lookAt(0, 3.0, 0);

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
    renderer.toneMappingExposure = 0.88;
    renderer.outputEncoding = THREE.sRGBEncoding;

    // OrbitControls — FULL 360° rotation with buttery desktop smooth zoom
    controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 3.2;
    controls.maxDistance = 12.0;
    controls.minPolarAngle = 0.1;
    controls.maxPolarAngle = Math.PI - 0.1;
    controls.minAzimuthAngle = -Infinity;
    controls.maxAzimuthAngle = Infinity;
    controls.target.set(0, 3.0, 0);
    controls.rotateSpeed = isMobile ? 0.6 : 0.85;
    controls.zoomSpeed = isMobile ? 0.75 : 0.85;
    controls.update();

    canvas.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
    canvas.addEventListener('wheel', e => e.preventDefault(), { passive: false });

    preCreate();
    setupLights();
    buildAtmosphere();
    buildBouquet();
    loadPeonyModel();
    buildDust();
    buildGround();
    buildBokeh();
    buildFloatingPetals();
    buildFairyLights();
    setupUI();

    animate();
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', e => {
      S.mx = (e.clientX / window.innerWidth) * 2 - 1;
      S.my = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });
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

  // ── Lights (Romantic Multi-Tier Lighting) ──
  function setupLights() {
    ambLight = new THREE.AmbientLight(0x281622, isMobile ? 0.75 : 0.65);
    scene.add(ambLight);

    mainLight = new THREE.DirectionalLight(0xfffaee, 1.35);
    mainLight.position.set(3.5, 7.5, 5);
    if (!isIOS) {
      mainLight.castShadow = true;
      mainLight.shadow.mapSize.set(Q.shadowSize, Q.shadowSize);
      mainLight.shadow.radius = 3.5;
    }
    scene.add(mainLight);

    rimLight = new THREE.PointLight(0xf06292, 0.95, 20);
    rimLight.position.set(-3.5, 4.5, -2.5);
    scene.add(rimLight);

    groundGlow = new THREE.PointLight(0x5c1a40, 0.5, 12);
    groundGlow.position.set(0, -0.1, 2.5);
    scene.add(groundGlow);

    warmAccent = new THREE.PointLight(0xf5d061, 0.4, 12);
    warmAccent.position.set(2.5, 5.2, -1.5);
    scene.add(warmAccent);

    if (!isMobile) {
      const backFill = new THREE.PointLight(0x752848, 0.4, 14);
      backFill.position.set(-2.5, 2.5, -4.5);
      scene.add(backFill);

      bouquetSpot = new THREE.SpotLight(0xfff5e6, 1.1, 14, Math.PI / 4, 0.4, 1.2);
      bouquetSpot.position.set(0.2, 7.5, 3.8);
      bouquetSpot.target.position.set(0, 3.1, 0);
      scene.add(bouquetSpot);
      scene.add(bouquetSpot.target);
    }
  }

  // ── Atmospheric Celestial Dome ────────────
  function buildAtmosphere() {
    const geo = new THREE.SphereGeometry(26, isMobile ? 24 : 32, isMobile ? 12 : 18);
    const pos = geo.attributes.position;
    const cols = [];
    const topCol = new THREE.Color(0x0a0512);
    const midCol = new THREE.Color(0x1a0718);
    const botCol = new THREE.Color(0x040206);

    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const ny = (y + 26) / 52;
      let c;
      if (ny > 0.48) {
        c = midCol.clone().lerp(topCol, (ny - 0.48) * 1.92);
      } else {
        c = botCol.clone().lerp(midCol, ny * 2.08);
      }
      cols.push(c.r, c.g, c.b);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    const mat = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      vertexColors: true,
      depthWrite: false
    });
    scene.add(new THREE.Mesh(geo, mat));
  }

  // ── Bouquet (Lush Giant Peonies & Korean Luxury Packaging) ──
  function buildBouquet() {
    bouquetGroup = new THREE.Group();
    scene.add(bouquetGroup);

    dynamicRibbonStreamers = [];

    mkWrap();
    mkRibbon();

    // 6 Giant Sarah Bernhardt Peonies (Faithful to Photo Composition)
    const peonyConfigs = [
      // 0: Hero Center-Left Giant Bloom (Dominant hero bloom from photo)
      { x: -0.44, y: 3.10, z: 0.32, s: 1.88, rx: 0.35, ry: -0.28, rz: 0.12 },
      // 1: Lower-Center Spill Bloom (Spilling softly forward over white mesh collar)
      { x: 0.02,  y: 2.64, z: 0.50, s: 1.74, rx: 0.52, ry: 0.06,  rz: -0.04 },
      // 2: Center-Mid Core Bloom (Heart depth)
      { x: 0.08,  y: 3.28, z: 0.12, s: 1.68, rx: 0.22, ry: 0.14,  rz: -0.06 },
      // 3: Upper-Left High Bloom (High crown)
      { x: -0.25, y: 3.68, z: -0.04, s: 1.62, rx: 0.16, ry: -0.22, rz: 0.08 },
      // 4: Right-Mid Flank Bloom (Lush right flank from photo)
      { x: 0.48,  y: 3.14, z: 0.20, s: 1.70, rx: 0.28, ry: 0.42,  rz: -0.22 },
      // 5: Back-Right Crown Bloom (Backdrop depth)
      { x: 0.58,  y: 3.56, z: -0.16, s: 1.54, rx: 0.12, ry: 0.65,  rz: -0.24 }
    ];

    flowerHeads = [];
    peonyConfigs.forEach((c, i) => mkPeony(c, i));

    mkFiller();
    mkLeaves();
  }

  function makeCurvedPaper(w, h, rollFactor = 1.0) {
    const g = new THREE.PlaneGeometry(w, h, isMobile ? 10 : 16, isMobile ? 10 : 16);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const nx = x / (w * 0.5);
      const ny = (y + h * 0.5) / h;
      const roll = -Math.pow(Math.abs(nx), 1.6) * (0.24 + ny * 0.16) * rollFactor;
      const flute = Math.sin(nx * Math.PI * 2) * 0.035 * (1 - ny * 0.4);
      pos.setZ(i, roll + flute);
    }
    g.computeVertexNormals();
    return g;
  }

  function mkWrap() {
    // 1. Frosted Translucent Matte Vellum Packaging Paper
    const frostMat = new THREE.MeshStandardMaterial({
      color: 0xf5f8fc,
      roughness: 0.38,
      metalness: 0.02,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide
    });

    // 5 Layered Sculptural Fan Sheets (Cradling the bouquet naturally)
    const backPlanes = [
      // Center back tall fan
      { pos: [0, 3.48, -0.68], rot: [-0.20, 0, 0.02], size: [2.8, 3.8], roll: 1.1 },
      // Back left wing
      { pos: [-1.02, 3.55, -0.52], rot: [-0.16, 0.36, 0.18], size: [2.5, 3.6], roll: 1.25 },
      // Back right wing
      { pos: [1.02, 3.50, -0.52], rot: [-0.16, -0.36, -0.18], size: [2.5, 3.6], roll: 1.25 },
      // Mid left cradling sheet
      { pos: [-1.22, 2.95, -0.12], rot: [-0.06, 0.72, 0.22], size: [2.1, 3.0], roll: 1.4 },
      // Mid right cradling sheet
      { pos: [1.22, 2.90, -0.12], rot: [-0.06, -0.72, -0.22], size: [2.1, 3.0], roll: 1.4 }
    ];

    backPlanes.forEach(bp => {
      const g = makeCurvedPaper(bp.size[0], bp.size[1], bp.roll || 1.0);
      const m = new THREE.Mesh(g, frostMat);
      m.position.set(...bp.pos);
      m.rotation.set(...bp.rot);
      m.castShadow = !isIOS;
      m.receiveShadow = !isIOS;
      bouquetGroup.add(m);
    });

    // Signature Round Black Florist Seal Sticker on Upper Left Sheet
    const sealGroup = new THREE.Group();
    sealGroup.position.set(-0.72, 4.45, -0.58);
    sealGroup.rotation.set(-0.16, 0.36, 0.18);
    const sealBase = new THREE.Mesh(
      new THREE.CircleGeometry(0.13, 24),
      new THREE.MeshStandardMaterial({ color: 0x141416, roughness: 0.35, side: THREE.DoubleSide })
    );
    sealGroup.add(sealBase);
    const sealRing = new THREE.Mesh(
      new THREE.RingGeometry(0.105, 0.118, 24),
      new THREE.MeshBasicMaterial({ color: 0xd4a853, side: THREE.DoubleSide })
    );
    sealRing.position.z = 0.002;
    sealGroup.add(sealRing);
    bouquetGroup.add(sealGroup);

    // 2. Pleated Hand-Gathered Wrapper Cone (Stems handle wrap)
    const segY = 16, segTh = isMobile ? 24 : 36;
    const v = [], idx = [], uv = [];
    for (let j = 0; j <= segY; j++) {
      const ty = j / segY;
      const y = 0.55 + ty * 1.30;
      // Tied waist at y=1.82 is narrow (0.28), flared lower handle (0.38), top flares to 1.15
      const baseR = (ty < 0.65) ? (0.38 - ty * 0.16) : (0.28 + Math.pow((ty - 0.65) / 0.35, 1.6) * 0.90);
      for (let i = 0; i <= segTh; i++) {
        const th = (i / segTh) * Math.PI * 2;
        // Subtle 8-pleat crisp paper folding texture
        const pleat = Math.sin(th * 8) * 0.024 * (1 - ty * 0.4) + Math.cos(th * 16) * 0.008;
        const r = baseR + pleat;
        v.push(Math.cos(th) * r, y, Math.sin(th) * r);
        uv.push(i / segTh, ty);
      }
    }
    for (let j = 0; j < segY; j++) {
      for (let i = 0; i < segTh; i++) {
        const a = j * (segTh + 1) + i, b = a + 1;
        const c = a + (segTh + 1), d = c + 1;
        idx.push(a, b, c, b, d, c);
      }
    }
    const handleGeom = new THREE.BufferGeometry();
    handleGeom.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    handleGeom.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    handleGeom.setIndex(idx);
    handleGeom.computeVertexNormals();

    const handleWrap = new THREE.Mesh(handleGeom, frostMat);
    handleWrap.castShadow = !isIOS;
    handleWrap.receiveShadow = !isIOS;
    bouquetGroup.add(handleWrap);

    // 3. Voluminous Korean Snowball / Honeycomb Mesh Wings & Collar
    const meshMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.68,
      metalness: 0.03,
      transparent: true,
      opacity: 0.86,
      side: THREE.DoubleSide
    });

    // Left Airy Mesh Wing with undulating ruffles
    const leftMeshGeom = new THREE.PlaneGeometry(1.65, 1.35, 14, 10);
    const leftPos = leftMeshGeom.attributes.position;
    for (let i = 0; i < leftPos.count; i++) {
      const u = leftPos.getX(i);
      const w = leftPos.getY(i);
      const ruff = Math.sin(u * 5.0) * 0.08 + Math.cos(w * 4.0) * 0.05;
      leftPos.setZ(i, ruff - Math.pow(u * 0.5, 2) * 0.22);
    }
    leftMeshGeom.computeVertexNormals();
    const leftMesh = new THREE.Mesh(leftMeshGeom, meshMat);
    leftMesh.position.set(-0.85, 2.35, 0.42);
    leftMesh.rotation.set(0.38, -0.45, 0.52);
    bouquetGroup.add(leftMesh);

    // Right Airy Mesh Wing
    const rightMeshGeom = new THREE.PlaneGeometry(1.65, 1.35, 14, 10);
    const rightPos = rightMeshGeom.attributes.position;
    for (let i = 0; i < rightPos.count; i++) {
      const u = rightPos.getX(i);
      const w = rightPos.getY(i);
      const ruff = Math.sin(u * 5.0) * 0.08 + Math.cos(w * 4.0) * 0.05;
      rightPos.setZ(i, ruff - Math.pow(u * 0.5, 2) * 0.22);
    }
    rightMeshGeom.computeVertexNormals();
    const rightMesh = new THREE.Mesh(rightMeshGeom, meshMat);
    rightMesh.position.set(0.85, 2.35, 0.42);
    rightMesh.rotation.set(0.38, 0.45, -0.52);
    bouquetGroup.add(rightMesh);

    // Front Ruffled Mesh Collar (cradling lower spill peony)
    const frontCollarCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.95, 2.25, 0.38),
      new THREE.Vector3(-0.52, 2.05, 0.72),
      new THREE.Vector3(0, 1.98, 0.82),
      new THREE.Vector3(0.52, 2.05, 0.72),
      new THREE.Vector3(0.95, 2.25, 0.38)
    ]);
    const collarGeom = new THREE.TubeGeometry(frontCollarCurve, 18, 0.16, 7, false);
    bouquetGroup.add(new THREE.Mesh(collarGeom, meshMat));

    // 4. Luxury Florist Greeting Card ("For Rena" & "suka gak bunganya?") Tucked into Peonies
    const cardGroup = new THREE.Group();
    // Tucked naturally between right peony blooms and vellum wrap
    cardGroup.position.set(0.58, 3.70, 0.26);
    cardGroup.rotation.set(0.08, -0.28, -0.06);

    const cardW = 0.58;
    const cardH = 0.78;

    // Double-sided 3D card with gilded gold edges
    const cardGeom = new THREE.BoxGeometry(cardW, cardH, 0.007);
    const goldEdgeMat = new THREE.MeshStandardMaterial({
      color: 0xd4a853,
      metalness: 0.88,
      roughness: 0.20
    });
    const cardFrontMat = new THREE.MeshStandardMaterial({
      map: getCardTexture(),
      roughness: 0.26,
      metalness: 0.02
    });
    const cardBackMat = new THREE.MeshStandardMaterial({
      map: getCardBackTexture(),
      roughness: 0.30,
      metalness: 0.02
    });

    // Box faces: +X, -X, +Y, -Y, +Z (Front), -Z (Back)
    const cardMaterials = [
      goldEdgeMat, goldEdgeMat,
      goldEdgeMat, goldEdgeMat,
      cardFrontMat, cardBackMat
    ];

    const cardPaper = new THREE.Mesh(cardGeom, cardMaterials);
    cardPaper.castShadow = !isIOS;
    cardPaper.receiveShadow = !isIOS;
    cardPaper.name = 'floristGreetingCard';
    cardGroup.add(cardPaper);
    floristCardMesh = cardPaper;

    // Slender Golden Wire Stick / Pick (Florist Card Holder)
    // Anchors into the bouquet stem core through the petals
    const cardStick = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 1.35, 8),
      new THREE.MeshStandardMaterial({ color: 0xd4a853, metalness: 0.92, roughness: 0.16 })
    );
    cardStick.position.set(0, -0.65, -0.005);
    cardGroup.add(cardStick);

    // Elegant Golden Card Clamp / Clip clasping bottom edge
    const cardClip = new THREE.Mesh(
      new THREE.TorusGeometry(0.034, 0.006, 8, 24),
      new THREE.MeshStandardMaterial({ color: 0xd4a853, metalness: 0.94, roughness: 0.12 })
    );
    cardClip.position.set(0, -cardH * 0.48, 0.008);
    cardClip.rotation.x = Math.PI / 2;
    cardGroup.add(cardClip);

    bouquetGroup.add(cardGroup);
  }

  function mkRibbon() {
    // Blush Pink Satin Ribbon
    const pinkRibbonMat = new THREE.MeshStandardMaterial({
      color: 0xf6a5c0,
      roughness: 0.28,
      metalness: 0.12,
      side: THREE.DoubleSide
    });
    // Crisp White Designer Ribbon with gold "FOR RENA" print
    const whiteRibbonMat = new THREE.MeshStandardMaterial({
      map: getRibbonTexture(),
      color: 0xffffff,
      roughness: 0.32,
      metalness: 0.06,
      side: THREE.DoubleSide
    });

    // Gather Ring around handle waist
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.052, 6, isMobile ? 24 : 48), pinkRibbonMat);
    ring.position.y = 1.82;
    ring.rotation.x = Math.PI / 2;
    bouquetGroup.add(ring);

    // Double Bow Loops (Pink Outer + White Inner)
    const bs = new THREE.Shape();
    bs.moveTo(0, 0);
    bs.quadraticCurveTo(0.20, 0.18, 0.36, 0);
    bs.quadraticCurveTo(0.20, -0.14, 0, 0);
    const bg = new THREE.ExtrudeGeometry(bs, { depth: 0.038, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2 });

    // Pink Outer Loops
    const bL = new THREE.Mesh(bg, pinkRibbonMat);
    bL.position.set(-0.12, 1.82, 0.70);
    bL.rotation.set(0.3, -0.3, 0.55);
    bL.scale.setScalar(1.50);
    bouquetGroup.add(bL);

    const bR = new THREE.Mesh(bg, pinkRibbonMat);
    bR.position.set(0.12, 1.82, 0.70);
    bR.rotation.set(0.3, 0.3, -0.55);
    bR.scale.setScalar(1.50);
    bouquetGroup.add(bR);

    // White Inner Loops
    const bLi = new THREE.Mesh(bg, whiteRibbonMat);
    bLi.position.set(-0.08, 1.82, 0.74);
    bLi.rotation.set(0.25, -0.22, 0.45);
    bLi.scale.setScalar(1.15);
    bouquetGroup.add(bLi);

    const bRi = new THREE.Mesh(bg, whiteRibbonMat);
    bRi.position.set(0.08, 1.82, 0.74);
    bRi.rotation.set(0.25, 0.22, -0.45);
    bRi.scale.setScalar(1.15);
    bouquetGroup.add(bRi);

    // Center knot
    const knot = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), pinkRibbonMat);
    knot.position.set(0, 1.82, 0.76);
    knot.scale.set(1.25, 0.95, 0.85);
    bouquetGroup.add(knot);

    // Dynamic Fluttering Ribbon Streamers (Pink & White silk cloth strips)
    const streamersConfig = [
      { x: -0.12, y: 1.80, z: 0.74, len: 1.25, mat: pinkRibbonMat, rotZ: 0.12, phase: 0 },
      { x: 0.14,  y: 1.80, z: 0.74, len: 1.30, mat: pinkRibbonMat, rotZ: -0.15, phase: 1.2 },
      { x: -0.04, y: 1.80, z: 0.78, len: 1.15, mat: whiteRibbonMat, rotZ: 0.05, phase: 2.1 },
      { x: 0.06,  y: 1.80, z: 0.78, len: 1.20, mat: whiteRibbonMat, rotZ: -0.08, phase: 3.4 }
    ];

    streamersConfig.forEach((sc, idx) => {
      const g = new THREE.PlaneGeometry(0.062, sc.len, 1, 14);
      g.translate(0, -sc.len * 0.5, 0); // Anchor top at (0, 0, 0)
      const origPos = [];
      const pos = g.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        origPos.push(new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)));
      }
      const mesh = new THREE.Mesh(g, sc.mat);
      mesh.position.set(sc.x, sc.y, sc.z);
      mesh.rotation.set(0.18, 0, sc.rotZ);
      bouquetGroup.add(mesh);

      dynamicRibbonStreamers.push({
        mesh: mesh,
        origPos: origPos,
        len: sc.len,
        phase: sc.phase,
        speed: 1.8 + idx * 0.35
      });
    });
  }

  // ── Giant Sarah Bernhardt Peony Architecture ──
  function mkPeony(cfg, ri) {
    const rg = new THREE.Group();
    rg.position.set(cfg.x, cfg.y, cfg.z);
    rg.rotation.y = cfg.ry || 0;
    if (cfg.rx) rg.rotation.x = cfg.rx;
    if (cfg.rz) rg.rotation.z = cfg.rz;

    // Stem connecting to bouquet core
    const stemStart = new THREE.Vector3(-cfg.x * 0.6, 1.8 - cfg.y, -cfg.z * 0.6);
    const stemMid = new THREE.Vector3(-cfg.x * 0.3, (1.8 - cfg.y) * 0.5 - 0.08, -cfg.z * 0.3);
    const stemEnd = new THREE.Vector3(0, 0, 0);
    const sc = new THREE.CatmullRomCurve3([stemStart, stemMid, stemEnd]);
    const sm = new THREE.MeshStandardMaterial({ color: 0x275222, roughness: 0.65, metalness: 0.02 });
    rg.add(new THREE.Mesh(new THREE.TubeGeometry(sc, Q.tubeSeg, 0.038, 5, false), sm));

    // Green Calyx Base
    const cx = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 7, 6, 0, Math.PI * 2, 0, Math.PI * 0.6),
      new THREE.MeshStandardMaterial({ color: 0x24541f, roughness: 0.62, side: THREE.DoubleSide })
    );
    cx.position.y = -0.07;
    cx.rotation.x = Math.PI;
    rg.add(cx);

    // Peony Flower Head Container
    const headContainer = new THREE.Group();
    headContainer.scale.setScalar(cfg.s * 0.82);

    if (peonyGLTFLoaded && peonyGLTFGeometry) {
      const mesh = new THREE.Mesh(peonyGLTFGeometry, peonyGLTFMaterial);
      mesh.castShadow = !isIOS;
      mesh.receiveShadow = !isIOS;
      headContainer.add(mesh);
    } else {
      buildProceduralPeonyPetals(headContainer, ri);
    }
    rg.add(headContainer);

    // Register for organic breathing sway & zero-g levitation
    rg.userData = {
      swaySpeed: 0.65 + (ri % 4) * 0.2,
      swayPhase: ri * 0.9,
      swayAmpX: 0.015 + (ri % 3) * 0.006,
      swayAmpZ: 0.013 + (ri % 3) * 0.005,
      baseRx: cfg.rx || 0,
      baseRz: cfg.rz || 0,
      baseScale: cfg.s,
      headContainer: headContainer,
      ri: ri
    };
    flowerHeads.push(rg);

    bouquetGroup.add(rg);
  }

  function buildProceduralPeonyPetals(container, ri) {
    // Sarah Bernhardt Soft Cotton-Candy Pink Palette
    const layerPalettes = [
      { base: 0xe85d85, tip: 0xf49cb8 }, // Layer 0: Inner warm rose blush
      { base: 0xee7297, tip: 0xf7b2c9 }, // Layer 1: Pastel rose petal
      { base: 0xf288a8, tip: 0xfac5d6 }, // Layer 2: Soft candy pink
      { base: 0xf69eb8, tip: 0xfcd7e3 }, // Layer 3: Baby pink
      { base: 0xfab4c7, tip: 0xfde3ed }, // Layer 4: Powder blush
      { base: 0xfdc6d5, tip: 0xffedf4 }, // Layer 5: Light champagne pink
      { base: 0xfed8e3, tip: 0xfff5f9 }, // Layer 6: Luminous pearl blush
      { base: 0xffe4ec, tip: 0xffffff }  // Layer 7: Translucent white-pink guard
    ];

    // 8 Layers of dense ruffled Sarah Bernhardt petals
    const layers = [
      { n: 6,  r: 0.03, w: 0.16, h: 0.28, cu: 0.98, y: 0.02,  ca: 0.10, li: 0 },
      { n: 7,  r: 0.06, w: 0.22, h: 0.34, cu: 0.90, y: 0.01,  ca: 0.14, li: 1 },
      { n: 8,  r: 0.10, w: 0.28, h: 0.40, cu: 0.78, y: -0.01, ca: 0.19, li: 2 },
      { n: 9,  r: 0.15, w: 0.34, h: 0.46, cu: 0.65, y: -0.03, ca: 0.25, li: 3 },
      { n: isMobile ? 8 : 10,  r: 0.20, w: 0.40, h: 0.52, cu: 0.52, y: -0.05, ca: 0.31, li: 4 },
      { n: isMobile ? 9 : 11,  r: 0.26, w: 0.45, h: 0.58, cu: 0.38, y: -0.06, ca: 0.38, li: 5 },
      { n: isMobile ? 10 : 12, r: 0.32, w: 0.50, h: 0.62, cu: 0.26, y: -0.07, ca: 0.44, li: 6 },
      { n: isMobile ? 10 : 12, r: 0.38, w: 0.55, h: 0.66, cu: 0.16, y: -0.08, ca: 0.50, li: 7 }
    ];

    layers.forEach(l => {
      const pal = layerPalettes[l.li];
      for (let i = 0; i < l.n; i++) {
        const ang = (i / l.n) * Math.PI * 2 + l.li * 0.44 + ri * 0.68;
        const petal = mkPeonyPetal(l.w, l.h, l.cu, pal.base, pal.tip);
        const piv = new THREE.Group();
        piv.position.set(0, l.y, 0);
        piv.rotation.y = ang;
        piv.rotation.x = -l.ca * Math.PI;
        petal.position.x = l.r;
        petal.rotation.z = -Math.PI * 0.05;
        piv.add(petal);
        container.add(piv);

        petalMeshes.push({
          pivot: piv,
          mesh: petal,
          closed: -l.ca * Math.PI,
          bloom: l.ca * Math.PI * 0.38,
          baseR: l.r,
          li: l.li,
          ri,
          ao: i / l.n
        });
      }
    });
  }

  function mkPeonyPetal(w, h, curl, baseColorHex, tipColorHex) {
    const seg = Q.petalSeg, rings = Q.petalRing;
    const v = [], idx = [], uv = [], cols = [];
    const baseCol = new THREE.Color(baseColorHex);
    const tipCol = new THREE.Color(tipColorHex);

    for (let r = 0; r <= rings; r++) {
      const rv = r / rings;
      const c = baseCol.clone().lerp(tipCol, Math.pow(rv, 0.82));
      for (let s = 0; s <= seg; s++) {
        const u = s / seg;
        // Wavy organic ruffle characteristic of Sarah Bernhardt peonies
        const ruffle = Math.sin(u * Math.PI * 4.5) * 0.038 * rv + Math.cos(rv * Math.PI * 2.5) * 0.012 * rv;
        const edgeCurve = Math.sin(rv * Math.PI);
        const wf = edgeCurve * w * (1 + 0.16 * Math.sin(u * Math.PI * 3));
        const cup = -curl * rv * rv * Math.sin(u * Math.PI) * 0.38 + Math.cos(u * Math.PI * 2) * 0.02 * rv;
        v.push((u - 0.5) * wf + ruffle * 0.45, rv * h, cup);
        uv.push(u, rv);
        cols.push(c.r, c.g, c.b);
      }
    }
    for (let r = 0; r < rings; r++) {
      for (let s = 0; s < seg; s++) {
        const a = r * (seg + 1) + s, b = a + 1, c = a + (seg + 1), d = c + 1;
        idx.push(a, b, c, b, d, c);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    g.setIndex(idx);
    g.computeVertexNormals();

    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.36,
      metalness: 0.02,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.94
    }));
    m.castShadow = !isIOS;
    return m;
  }

  function mkFiller() {
    // Delicate Misty Caspia & Asparagus fern sprigs in crevices between blooms
    const flowerMatWhite = new THREE.MeshStandardMaterial({
      color: 0xfffaf0,
      roughness: 0.38,
      emissive: 0xfff0dd,
      emissiveIntensity: 0.2
    });
    const flowerMatMint = new THREE.MeshStandardMaterial({
      color: 0xc8e6c9,
      roughness: 0.42,
      emissive: 0x81c784,
      emissiveIntensity: 0.15
    });
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x3d6835, roughness: 0.65 });
    const floretGeom = new THREE.SphereGeometry(0.024, 4, 4);
    const twigGeom = new THREE.CylinderGeometry(0.005, 0.005, 0.38, 3);

    // 18 naturally staggered pocket locations around the peony dome
    const pockets = [
      [-0.48, 3.75, 0.02], [0.44, 3.72, 0.06], [-0.78, 3.32, 0.28], [0.74, 3.28, 0.22],
      [-0.18, 3.86, -0.12], [0.15, 3.84, -0.06], [-0.64, 2.72, 0.42], [0.68, 2.70, 0.36],
      [-0.04, 2.96, 0.58], [0.32, 2.82, 0.48], [-0.34, 2.82, 0.50], [0.88, 3.48, -0.12],
      [-0.88, 3.42, -0.10], [0.02, 3.48, 0.24], [-0.22, 3.20, 0.45], [0.24, 3.20, 0.42],
      [-0.52, 2.45, 0.55], [0.55, 2.45, 0.52]
    ];

    pockets.forEach((p, idx) => {
      const cg = new THREE.Group();
      cg.position.set(p[0], p[1], p[2]);
      const mat = idx % 2 === 0 ? flowerMatWhite : flowerMatMint;

      // Small natural spray of 6-9 florets
      const nDots = 6 + (idx % 4);
      for (let i = 0; i < nDots; i++) {
        const d = new THREE.Mesh(floretGeom, mat);
        d.position.set(
          (Math.random() - 0.5) * 0.22,
          (Math.random() - 0.5) * 0.18,
          (Math.random() - 0.5) * 0.20
        );
        d.scale.setScalar(0.75 + Math.random() * 0.6);
        cg.add(d);
      }
      const st = new THREE.Mesh(twigGeom, stemMat);
      st.position.y = -0.14;
      st.rotation.z = (Math.random() - 0.5) * 0.4;
      st.rotation.x = (Math.random() - 0.5) * 0.3;
      cg.add(st);
      bouquetGroup.add(cg);
    });
  }

  function mkLeaves() {
    // Realistic Branching Silver-Dollar Eucalyptus Sprigs (Fluid Arching Foliage)
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x5e8568,
      roughness: 0.46,
      metalness: 0.02,
      side: THREE.DoubleSide
    });
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x46654a,
      roughness: 0.65,
      metalness: 0.01
    });

    // Cupped circular leaf geometry
    const leafGeo = new THREE.CircleGeometry(0.12, 10);
    const lp = leafGeo.attributes.position;
    for (let i = 0; i < lp.count; i++) {
      const r = Math.sqrt(Math.pow(lp.getX(i), 2) + Math.pow(lp.getY(i), 2));
      lp.setZ(i, -Math.pow(r, 2) * 0.16);
    }
    leafGeo.computeVertexNormals();

    const branchConfigs = [
      // 0: Upper-left arch (behind hero peony, sweeping high)
      {
        pts: [[-0.45, 3.4, 0.0], [-0.75, 3.85, 0.08], [-1.05, 4.15, 0.15]],
        leaves: [
          { t: 0.35, rot: [0.2, -0.4, 0.6], s: 1.1 },
          { t: 0.55, rot: [-0.1, 0.5, -0.5], s: 1.05 },
          { t: 0.75, rot: [0.3, -0.3, 0.7], s: 0.95 },
          { t: 0.95, rot: [0.1, 0.2, 0.4], s: 0.85 }
        ]
      },
      // 1: Top-center crown arch (rising above back wrap)
      {
        pts: [[-0.10, 3.5, -0.2], [-0.15, 4.05, -0.25], [-0.25, 4.30, -0.28]],
        leaves: [
          { t: 0.4, rot: [0.1, -0.3, 0.4], s: 1.0 },
          { t: 0.65, rot: [-0.2, 0.4, -0.4], s: 0.95 },
          { t: 0.9, rot: [0.1, 0.1, 0.2], s: 0.8 }
        ]
      },
      // 2: Upper-right arch (framing florist greeting card)
      {
        pts: [[0.55, 3.4, -0.1], [0.85, 3.85, -0.12], [1.12, 4.10, -0.08]],
        leaves: [
          { t: 0.35, rot: [0.1, 0.4, -0.5], s: 1.1 },
          { t: 0.58, rot: [-0.2, -0.4, 0.6], s: 1.0 },
          { t: 0.80, rot: [0.2, 0.5, -0.6], s: 0.9 },
          { t: 0.98, rot: [0.1, 0.2, -0.3], s: 0.75 }
        ]
      },
      // 3: Mid-left flank (bursting beside hero peony)
      {
        pts: [[-0.55, 2.9, 0.25], [-0.95, 3.15, 0.32], [-1.25, 3.30, 0.28]],
        leaves: [
          { t: 0.4, rot: [0.3, -0.5, 0.6], s: 1.15 },
          { t: 0.7, rot: [-0.2, 0.4, -0.4], s: 1.05 },
          { t: 0.95, rot: [0.2, -0.3, 0.5], s: 0.9 }
        ]
      },
      // 4: Mid-right flank (poking out beside right peony)
      {
        pts: [[0.55, 2.9, 0.2], [0.95, 3.15, 0.15], [1.25, 3.25, 0.12]],
        leaves: [
          { t: 0.4, rot: [0.3, 0.5, -0.6], s: 1.15 },
          { t: 0.7, rot: [-0.2, -0.4, 0.4], s: 1.05 },
          { t: 0.95, rot: [0.2, 0.3, -0.5], s: 0.9 }
        ]
      },
      // 5: Lower-left spill (arching forward over white mesh collar)
      {
        pts: [[-0.35, 2.5, 0.45], [-0.65, 2.35, 0.55], [-0.92, 2.20, 0.62]],
        leaves: [
          { t: 0.45, rot: [0.4, -0.3, 0.4], s: 1.05 },
          { t: 0.75, rot: [0.2, 0.4, -0.3], s: 0.95 },
          { t: 0.98, rot: [0.3, -0.2, 0.3], s: 0.85 }
        ]
      },
      // 6: Lower-right spill (arching forward over white mesh collar)
      {
        pts: [[0.35, 2.5, 0.45], [0.65, 2.35, 0.55], [0.92, 2.20, 0.62]],
        leaves: [
          { t: 0.45, rot: [0.4, 0.3, -0.4], s: 1.05 },
          { t: 0.75, rot: [0.2, -0.4, 0.3], s: 0.95 },
          { t: 0.98, rot: [0.3, 0.2, -0.3], s: 0.85 }
        ]
      }
    ];

    branchConfigs.forEach(b => {
      const curve = new THREE.CatmullRomCurve3(b.pts.map(p => new THREE.Vector3(...p)));
      const stemMesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 10, 0.012, 4, false), stemMat);
      stemMesh.castShadow = !isIOS;
      bouquetGroup.add(stemMesh);

      b.leaves.forEach(l => {
        const pt = curve.getPointAt(l.t);
        const lm = new THREE.Mesh(leafGeo, leafMat);
        lm.position.copy(pt);
        lm.rotation.set(...l.rot);
        lm.scale.setScalar(l.s);
        lm.castShadow = !isIOS;
        bouquetGroup.add(lm);
      });
    });
  }

  function buildGround() {
    // Polished reflective dark marble floor
    const g = new THREE.Mesh(
      new THREE.CircleGeometry(14, isMobile ? 32 : 64),
      new THREE.MeshStandardMaterial({
        color: 0x09050b,
        roughness: 0.28,
        metalness: 0.52
      })
    );
    g.rotation.x = -Math.PI / 2;
    g.position.y = -0.02;
    g.receiveShadow = !isIOS;
    scene.add(g);

    groundPedestalGroup = new THREE.Group();
    scene.add(groundPedestalGroup);

    // Inner gold filigree ring
    const innerRing = new THREE.Mesh(
      new THREE.RingGeometry(1.4, 1.48, 64),
      new THREE.MeshBasicMaterial({ color: 0xd4a853, transparent: true, opacity: 0.3, side: THREE.DoubleSide })
    );
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.y = 0.001;
    groundPedestalGroup.add(innerRing);

    // Dotted / radial filigree ring
    const dotsRing = new THREE.Mesh(
      new THREE.RingGeometry(1.85, 1.88, 64),
      new THREE.MeshBasicMaterial({ color: 0xf5d061, transparent: true, opacity: 0.2, side: THREE.DoubleSide })
    );
    dotsRing.rotation.x = -Math.PI / 2;
    dotsRing.position.y = 0.001;
    groundPedestalGroup.add(dotsRing);

    // Outer soft rose aura ring
    const outerRing = new THREE.Mesh(
      new THREE.RingGeometry(2.6, 2.66, 64),
      new THREE.MeshBasicMaterial({ color: 0xe57397, transparent: true, opacity: 0.18, side: THREE.DoubleSide })
    );
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.y = 0.001;
    groundPedestalGroup.add(outerRing);

    // Center soft radial halo under bouquet
    const haloGeom = new THREE.CircleGeometry(2.8, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x481832,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide
    });
    const halo = new THREE.Mesh(haloGeom, haloMat);
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = 0.0005;
    groundPedestalGroup.add(halo);
  }

  function buildDust() {
    const n = Q.dustCount;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = Math.random() * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    dustSystem = new THREE.Points(g, new THREE.PointsMaterial({
      map: getParticleTexture(),
      color: 0xd4a853,
      size: isMobile ? 0.08 : 0.065,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    }));
    scene.add(dustSystem);
  }

  // ── Floating Bokeh Orbs (Ethereal Cinematic Parallax) ──
  function buildBokeh() {
    const n = Q.bokehCount;
    const pos = new Float32Array(n * 3);
    const cols = new Float32Array(n * 3);
    const pTex = getParticleTexture();
    const gold = new THREE.Color(0xf6d365);
    const rose = new THREE.Color(0xff85a6);
    const champagne = new THREE.Color(0xfff3e0);

    for (let i = 0; i < n; i++) {
      const r = 3 + Math.random() * 8;
      const th = Math.random() * Math.PI * 2;
      const y = 1.0 + Math.random() * 8;

      pos[i * 3] = Math.cos(th) * r;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(th) * r;

      const pick = Math.random();
      const c = pick < 0.4 ? gold : (pick < 0.8 ? rose : champagne);
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;

      bokehData.push({
        baseR: r,
        angle: th,
        speed: (0.05 + Math.random() * 0.08) * (Math.random() < 0.5 ? 1 : -1),
        y: y,
        bobSpeed: 0.6 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2
      });
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));

    bokehPoints = new THREE.Points(geo, new THREE.PointsMaterial({
      map: pTex,
      size: isMobile ? 0.4 : 0.6,
      transparent: true,
      opacity: 0.28,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    }));
    scene.add(bokehPoints);
  }

  function updateBokeh(dt) {
    if (!bokehPoints) return;
    const pos = bokehPoints.geometry.attributes.position.array;
    for (let i = 0; i < bokehData.length; i++) {
      const b = bokehData[i];
      b.angle += b.speed * dt * 0.4;
      const r = b.baseR + Math.sin(S.t * 0.4 + b.phase) * 0.4;
      pos[i * 3] = Math.cos(b.angle) * r;
      pos[i * 3 + 1] = b.y + Math.sin(S.t * b.bobSpeed + b.phase) * 0.25;
      pos[i * 3 + 2] = Math.sin(b.angle) * r;
    }
    bokehPoints.geometry.attributes.position.needsUpdate = true;
    bokehPoints.material.opacity = 0.22 + Math.sin(S.t * 0.8) * 0.08;
  }

  // ── Floating & Falling Peony Petals ────────
  function buildFloatingPetals() {
    const count = Q.floatingPetalCount;
    const pGeom = new THREE.PlaneGeometry(0.18, 0.26, 4, 4);
    const pos = pGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i);
      const v = pos.getY(i);
      pos.setZ(i, -Math.sin(v * 4) * 0.038 - Math.sin(u * 8) * 0.02);
    }
    pGeom.computeVertexNormals();

    const petalColors = [0xf8bbd0, 0xfce4ec, 0xf48fb1, 0xffd1dc, 0xffebee];

    for (let i = 0; i < count; i++) {
      const col = petalColors[i % petalColors.length];
      const mat = new THREE.MeshStandardMaterial({
        color: col,
        roughness: 0.38,
        metalness: 0.02,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.78 + Math.random() * 0.18
      });
      const mesh = new THREE.Mesh(pGeom, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 9,
        Math.random() * 9 + 0.5,
        (Math.random() - 0.5) * 9
      );
      mesh.scale.setScalar(0.6 + Math.random() * 0.85);

      mesh.userData = {
        vy: 0.007 + Math.random() * 0.012,
        vx: (Math.random() - 0.5) * 0.005,
        vz: (Math.random() - 0.5) * 0.005,
        rx: 0.012 + Math.random() * 0.022,
        ry: 0.009 + Math.random() * 0.016,
        rz: 0.006 + Math.random() * 0.014,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.8 + Math.random() * 1.2
      };

      scene.add(mesh);
      floatingPetals.push(mesh);
    }
  }

  function updateFloatingPetals(dt) {
    floatingPetals.forEach(p => {
      const u = p.userData;
      p.position.y -= u.vy;
      p.position.x += Math.sin(S.t * u.swaySpeed + u.swayPhase) * 0.005 + u.vx;
      p.position.z += Math.cos(S.t * u.swaySpeed * 0.85 + u.swayPhase) * 0.004 + u.vz;

      p.rotation.x += u.rx;
      p.rotation.y += u.ry;
      p.rotation.z += u.rz;

      if (p.position.y < 0.05) {
        p.position.y = 8 + Math.random() * 2;
        p.position.x = (Math.random() - 0.5) * 9;
        p.position.z = (Math.random() - 0.5) * 9;
      }
    });
  }

  // ── Fairy Lights (Luminous Floating Fireflies) ──
  function buildFairyLights() {
    const n = Q.fairyCount;
    const pos = new Float32Array(n * 3);
    const cols = new Float32Array(n * 3);
    fairyLightsData = [];

    const goldCol = new THREE.Color(0xf5d061);
    const roseCol = new THREE.Color(0xff80ab);
    const pearlCol = new THREE.Color(0xfff8e7);

    for (let i = 0; i < n; i++) {
      const radius = 1.2 + Math.random() * 5.0;
      const angle = Math.random() * Math.PI * 2;
      const y = 0.8 + Math.random() * 5.8;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      const pick = Math.random();
      const col = pick < 0.55 ? goldCol : (pick < 0.85 ? roseCol : pearlCol);
      cols[i * 3] = col.r;
      cols[i * 3 + 1] = col.g;
      cols[i * 3 + 2] = col.b;

      fairyLightsData.push({
        baseRadius: radius,
        angle: angle,
        orbitSpeed: (0.15 + Math.random() * 0.25) * (Math.random() < 0.5 ? 1 : -1),
        y: y,
        yPhase: Math.random() * Math.PI * 2,
        pulseSpeed: 1.5 + Math.random() * 2.5
      });
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(cols, 3));

    fairyLightsPoints = new THREE.Points(g, new THREE.PointsMaterial({
      map: getParticleTexture(),
      size: isMobile ? 0.12 : 0.09,
      transparent: true,
      opacity: 0.75,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    }));
    scene.add(fairyLightsPoints);
  }

  function updateFairyLights(dt) {
    if (!fairyLightsPoints) return;
    const pos = fairyLightsPoints.geometry.attributes.position.array;
    for (let i = 0; i < fairyLightsData.length; i++) {
      const d = fairyLightsData[i];
      d.angle += d.orbitSpeed * dt * 0.6;
      const r = d.baseRadius + Math.sin(S.t * 0.8 + d.yPhase) * 0.22;
      pos[i * 3] = Math.cos(d.angle) * r;
      pos[i * 3 + 1] = d.y + Math.sin(S.t * 1.2 + d.yPhase) * 0.32;
      pos[i * 3 + 2] = Math.sin(d.angle) * r;
    }
    fairyLightsPoints.geometry.attributes.position.needsUpdate = true;
    fairyLightsPoints.material.opacity = 0.6 + Math.sin(S.t * 2.2) * 0.15;
  }

  // ── Bloom ───────────────────────────────
  function triggerBloom() {
    startMusic();
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
      map: getParticleTexture(),
      size: isMobile ? 0.12 : 0.09, transparent:true, opacity:1,
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

    flowerHeads.forEach(fh => {
      const u = fh.userData;
      if (u.headContainer) {
        const delay = (u.ri || 0) * 0.06;
        const pt = Math.max(0, Math.min(1, (t - delay * 0.12) / (1 - delay * 0.04)));
        const et = easeOutBack(pt);
        const currentScale = u.baseScale * (0.82 + et * 0.22);
        u.headContainer.scale.setScalar(currentScale);
        u.headContainer.rotation.y = et * 0.18;
      }
    });

    petalMeshes.forEach(p => {
      const delay = p.ri * 0.05 + p.li * 0.08;
      const pt = Math.max(0, Math.min(1, (t - delay * 0.12) / (1 - delay * 0.04)));
      const et = easeOutBack(pt);
      p.pivot.rotation.x = THREE.MathUtils.lerp(p.closed, p.bloom, et);
      p.mesh.position.x = p.baseR + et * 0.032 * (p.li + 1) * 0.5;
    });
    if (rimLight) rimLight.intensity = 0.8 + t * 0.9;
    if (ambLight) ambLight.intensity = (isMobile ? 0.7 : 0.6) + t * 0.35;
    if (mainLight) mainLight.intensity = 1.25 + t * 0.45;
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
    const msgLayer = document.getElementById('message-layer');
    const msgBackdrop = document.getElementById('messageBackdrop');
    const hint = document.getElementById('bloomHint');
    const cardCloseBtn = document.getElementById('cardCloseBtn');

    function openMessageCard() {
      S.msgVisible = true;
      if (msgLayer) msgLayer.classList.add('active');
      if (card) card.classList.add('visible');
      if (hint) hint.classList.add('fade-out');
      if (msgToggle) msgToggle.classList.remove('hint-glow');

      // Antigravity GSAP 3D Spatial Levitation Entrance
      if (typeof gsap !== 'undefined' && card) {
        gsap.killTweensOf(card);
        gsap.fromTo(card,
          { opacity: 0, scale: 0.80, rotationX: 20, y: 45 },
          { opacity: 1, scale: 1, rotationX: 0, y: 0, duration: 0.65, ease: "power3.out" }
        );
      }

      setTimeout(() => {
        const input = document.getElementById('msgInput');
        if (input) input.focus();
      }, 350);
    }

    function closeMessageCard() {
      if (!S.msgVisible) return;
      if (typeof gsap !== 'undefined' && card) {
        gsap.killTweensOf(card);
        gsap.to(card, {
          opacity: 0,
          scale: 0.85,
          rotationX: -15,
          y: 30,
          duration: 0.38,
          ease: "power2.in",
          onComplete: () => {
            S.msgVisible = false;
            if (card) card.classList.remove('visible');
            if (msgLayer) msgLayer.classList.remove('active');
          }
        });
      } else {
        S.msgVisible = false;
        if (card) card.classList.remove('visible');
        if (msgLayer) msgLayer.classList.remove('active');
      }
    }

    function toggleMessage(show) {
      if (typeof show === 'boolean') {
        show ? openMessageCard() : closeMessageCard();
      } else {
        S.msgVisible ? closeMessageCard() : openMessageCard();
      }
    }

    if (msgToggle) msgToggle.addEventListener('click', () => toggleMessage());
    if (cardCloseBtn) cardCloseBtn.addEventListener('click', () => closeMessageCard());
    if (msgBackdrop) msgBackdrop.addEventListener('click', () => closeMessageCard());

    // Raycaster click on bouquet / 3D greeting card
    const rc = new THREE.Raycaster(), cv = new THREE.Vector2();
    renderer.domElement.addEventListener('click', e => {
      cv.x = (e.clientX / window.innerWidth) * 2 - 1;
      cv.y = -(e.clientY / window.innerHeight) * 2 + 1;
      rc.setFromCamera(cv, camera);

      // If user clicks directly on the 3D tucked greeting card
      if (floristCardMesh) {
        const cardHits = rc.intersectObject(floristCardMesh, true);
        if (cardHits.length > 0) {
          openMessageCard();
          spawnHearts(4);
          return;
        }
      }

      if (rc.intersectObjects(bouquetGroup.children, true).length > 0) {
        triggerBloom();
      }
    });

    // Hover effect over the 3D greeting card
    renderer.domElement.addEventListener('pointermove', e => {
      cv.x = (e.clientX / window.innerWidth) * 2 - 1;
      cv.y = -(e.clientY / window.innerHeight) * 2 + 1;
      rc.setFromCamera(cv, camera);
      if (floristCardMesh && rc.intersectObject(floristCardMesh, true).length > 0) {
        renderer.domElement.style.cursor = 'pointer';
      } else {
        renderer.domElement.style.cursor = 'default';
      }
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
      // Antigravity multi-harmonic orbital floating + interactive pointer parallax damping
      const t = S.t;
      const targetY = Math.sin(t * 0.55) * 0.065 + Math.sin(t * 1.15) * 0.02 + Math.cos(t * 0.28) * 0.015;
      const basePitch = Math.sin(t * 0.42) * 0.022 + Math.cos(t * 0.85) * 0.008;
      const baseRoll = Math.cos(t * 0.50) * 0.018 + Math.sin(t * 0.72) * 0.006;
      const baseYaw = Math.sin(t * 0.32) * 0.015;

      // Pointer parallax spring damping (Antigravity physics — NaN safe)
      const mx = (typeof S.mx === 'number' && !isNaN(S.mx)) ? S.mx : 0;
      const my = (typeof S.my === 'number' && !isNaN(S.my)) ? S.my : 0;

      const targetPitch = basePitch + my * 0.07;
      const targetYaw = baseYaw + mx * 0.10;
      const targetRoll = baseRoll - mx * 0.035;

      currentTilt.x = (isNaN(currentTilt.x) ? 0 : currentTilt.x) + (targetPitch - (isNaN(currentTilt.x) ? 0 : currentTilt.x)) * 0.045;
      currentTilt.y = (isNaN(currentTilt.y) ? 0 : currentTilt.y) + (targetYaw - (isNaN(currentTilt.y) ? 0 : currentTilt.y)) * 0.045;
      currentTilt.z = (isNaN(currentTilt.z) ? 0 : currentTilt.z) + (targetRoll - (isNaN(currentTilt.z) ? 0 : currentTilt.z)) * 0.045;

      bouquetGroup.rotation.set(currentTilt.x, currentTilt.y, currentTilt.z);
      bouquetGroup.position.y += (targetY - bouquetGroup.position.y) * 0.06;
    }

    flowerHeads.forEach(fh => {
      const u = fh.userData;
      const swayX = Math.sin(S.t * u.swaySpeed + u.swayPhase) * u.swayAmpX
                  + Math.cos(S.t * (u.swaySpeed * 1.6) + u.swayPhase) * (u.swayAmpX * 0.35);
      const swayZ = Math.cos(S.t * (u.swaySpeed * 0.85) + u.swayPhase) * u.swayAmpZ
                  + Math.sin(S.t * (u.swaySpeed * 1.4) + u.swayPhase) * (u.swayAmpZ * 0.3);
      const swayY = Math.sin(S.t * 0.75 + u.swayPhase) * 0.016;

      fh.rotation.x = u.baseRx + swayX;
      fh.rotation.z = u.baseRz + swayZ;
      fh.rotation.y = (u.baseRy || 0) + swayY;
    });

    // Dynamic Fluttering Silk Ribbon Streamers
    dynamicRibbonStreamers.forEach(s => {
      const pos = s.mesh.geometry.attributes.position;
      const count = pos.count;
      for (let i = 0; i < count; i++) {
        const orig = s.origPos[i];
        const v = Math.max(0, Math.min(1, -orig.y / s.len));
        const waveX = Math.sin(S.t * s.speed + s.phase + v * 3.8) * 0.038 * Math.pow(v, 1.3);
        const waveZ = Math.cos(S.t * (s.speed * 0.85) + s.phase + v * 3.2) * 0.045 * Math.pow(v, 1.3);
        pos.setXYZ(i, orig.x + waveX, orig.y, orig.z + waveZ);
      }
      pos.needsUpdate = true;
      s.mesh.geometry.computeVertexNormals();
    });

    updateBloom(dt);
    updateBurst(dt);
    updateHearts(dt);
    updateFloatingPetals(dt);
    updateFairyLights(dt);
    updateBokeh(dt);

    if (groundPedestalGroup) {
      groundPedestalGroup.rotation.y = S.t * 0.04;
    }

    if (S.bloomed) {
      if (!isMobile || frame%2===0) {
        flowerHeads.forEach(fh => {
          const u = fh.userData;
          if (u.headContainer) {
            const breathe = 1 + Math.sin(S.t * 1.2 + (u.ri || 0) * 0.7) * 0.012;
            u.headContainer.scale.setScalar(u.baseScale * 1.04 * breathe);
          }
        });
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
      dustSystem.material.opacity = 0.35 + Math.sin(S.t*0.6)*0.1;
    }

    if (rimLight) {
      rimLight.intensity = (S.bloomed?1.5:0.7) + Math.sin(S.t*0.6)*0.1;
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
