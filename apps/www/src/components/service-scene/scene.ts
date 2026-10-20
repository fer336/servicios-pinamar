import type * as ThreeNamespace from 'three';

type Three = typeof ThreeNamespace;
type Vec3 = [number, number, number];

export interface ServiceSceneHandle {
  setMode(mode: number): void;
  dispose(): void;
}

interface Worker {
  g: ThreeNamespace.Group;
  armL: ThreeNamespace.Group;
  armR: ThreeNamespace.Group;
  legL: ThreeNamespace.Group;
  legR: ThreeNamespace.Group;
}

// Mode indexes follow sceneModes: 0 pintura, 1 hidrolavado, 2 plomería, 3 gas.
export function createServiceScene(T: Three, container: HTMLElement, canvas: HTMLCanvasElement): ServiceSceneHandle {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.outputColorSpace = T.SRGBColorSpace;

  const scene = new T.Scene();
  scene.fog = new T.Fog(0xe6ece8, 30, 52);
  const camera = new T.PerspectiveCamera(30, 1, 0.1, 100);

  scene.add(new T.HemisphereLight(0xfffaf0, 0x9fb3a3, 1.3));
  const sun = new T.DirectionalLight(0xfff0d8, 2.3);
  sun.position.set(7, 12, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -9;
  sun.shadow.camera.right = 9;
  sun.shadow.camera.top = 9;
  sun.shadow.camera.bottom = -9;
  sun.shadow.bias = -0.0005;
  scene.add(sun);

  const mat = (color: number, options: ThreeNamespace.MeshStandardMaterialParameters = {}) =>
    new T.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...options });
  const part = (parent: ThreeNamespace.Object3D, geometry: ThreeNamespace.BufferGeometry, material: ThreeNamespace.Material, x: number, y: number, z: number) => {
    const mesh = new T.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const box = (parent: ThreeNamespace.Object3D, w: number, h: number, d: number, material: ThreeNamespace.Material, x: number, y: number, z: number) =>
    part(parent, new T.BoxGeometry(w, h, d), material, x, y, z);
  const tube = (parent: ThreeNamespace.Object3D, points: Vec3[], radius: number, material: ThreeNamespace.Material) => {
    const curve = new T.CatmullRomCurve3(points.map(([x, y, z]) => new T.Vector3(x, y, z)), false, 'catmullrom', 0.05);
    const mesh = new T.Mesh(new T.TubeGeometry(curve, 96, radius, 10, false), material);
    parent.add(mesh);
    return mesh;
  };

  const world = new T.Group();
  scene.add(world);

  const dune = new T.Mesh(new T.CylinderGeometry(7.2, 7.8, 0.7, 64), mat(0xe6d7b8));
  dune.position.y = -0.35;
  dune.receiveShadow = true;
  world.add(dune);
  const lawn = new T.Mesh(new T.CylinderGeometry(4.7, 4.7, 0.04, 48), mat(0xb7c4a5));
  lawn.position.y = 0.02;
  lawn.receiveShadow = true;
  world.add(lawn);

  const pineMat = mat(0x285f51, { roughness: 0.9 });
  const trunkMat = mat(0x6b4a33);
  const pine = (x: number, z: number, s: number) => {
    const g = new T.Group();
    part(g, new T.CylinderGeometry(0.08 * s, 0.12 * s, 0.9 * s, 8), trunkMat, 0, 0.45 * s, 0);
    for (let i = 0; i < 3; i++) {
      part(g, new T.ConeGeometry((0.9 - i * 0.22) * s, 1.1 * s, 10), pineMat, 0, (1.1 + i * 0.55) * s, 0);
    }
    g.position.set(x, 0, z);
    world.add(g);
  };
  pine(-4.6, -1.8, 1.25);
  pine(-3.4, -3.8, 1);
  pine(3.9, -2.8, 1.4);
  pine(5.1, 0.4, 0.9);
  pine(-5.3, 1.6, 0.85);

  // House
  const house = new T.Group();
  world.add(house);
  const wallMat = mat(0xf5f2eb, { transparent: true });
  box(house, 4.2, 2.2, 3, wallMat, 0, 1.14, 0);
  box(house, 2.4, 1.8, 2.6, wallMat, -0.9, 3.14, -0.1);
  const roofMat = mat(0x173f38, { roughness: 0.6 });
  box(house, 4.6, 0.16, 3.4, roofMat, 0, 2.32, 0);
  box(house, 2.8, 0.16, 3.0, roofMat, -0.9, 4.12, -0.1);
  const glass = mat(0x1d3b3a, { roughness: 0.15, metalness: 0.3, emissive: 0x0d2422, transparent: true });
  box(house, 1.5, 1.2, 0.06, glass, 1.05, 1.2, 1.52);
  box(house, 0.8, 1.2, 0.06, glass, -1.25, 1.2, 1.52);
  box(house, 1.4, 0.9, 0.06, glass, -0.9, 3.2, 1.22);
  box(house, 0.06, 1.0, 1.4, glass, 2.12, 1.3, 0.5);
  box(house, 0.7, 1.6, 0.06, mat(0x8a5a3b), -0.25, 0.92, 1.52);

  const deckMat = mat(0x5f584c);
  const plankMat = mat(0x4b453b);
  box(house, 4.8, 0.14, 1.8, deckMat, 0, 0.09, 2.45);
  for (let i = 0; i < 9; i++) box(house, 0.03, 0.15, 1.8, plankMat, -2.2 + i * 0.55, 0.095, 2.45);

  // Plumbing (x-ray view)
  const pipeMat = new T.MeshStandardMaterial({ color: 0x2f8fd8, emissive: 0x1b6fb8, emissiveIntensity: 0, roughness: 0.4, metalness: 0.2, transparent: true, opacity: 0 });
  const pipes = [
    tube(house, [[1.9, 0.2, 1.0], [1.9, 1.6, 1.0], [0.4, 1.6, 1.0], [0.4, 3.0, 0.6], [-0.4, 3.0, 0.6]], 0.06, pipeMat),
    tube(house, [[-1.8, 0.2, -1.0], [-1.8, 0.6, -1.35], [1.2, 0.6, -1.35], [1.2, 0.8, -1.3]], 0.05, pipeMat),
    tube(house, [[-1.4, 2.4, 0.4], [-1.4, 3.6, 0.4], [-0.2, 3.6, 0.4]], 0.045, pipeMat)
  ];
  const dropMat = new T.MeshBasicMaterial({ color: 0x7cc4ff, transparent: true, opacity: 0 });
  const drop = new T.Mesh(new T.SphereGeometry(0.09, 16, 12), dropMat);
  house.add(drop);

  // Gas
  const gasMat = new T.MeshStandardMaterial({ color: 0xe8892b, emissive: 0xe06a12, emissiveIntensity: 0, roughness: 0.4, transparent: true, opacity: 0 });
  box(house, 0.4, 0.6, 0.3, mat(0xc9ccc6, { metalness: 0.5, roughness: 0.4 }), 2.35, 0.7, -0.6);
  const gasPipe = tube(house, [[2.35, 0.4, -0.6], [2.35, 0.25, -0.6], [1.4, 0.25, -0.6], [1.4, 0.25, -1.1], [0.2, 0.25, -1.1], [0.2, 0.9, -1.1]], 0.05, gasMat);
  const heater = box(house, 0.6, 0.7, 0.35, mat(0xdedad2), 0.2, 1.25, -1.15);
  const flameMat = new T.MeshBasicMaterial({ color: 0xff9a2e, transparent: true, opacity: 0 });
  const flame = new T.Mesh(new T.ConeGeometry(0.12, 0.35, 12), flameMat);
  flame.position.set(0.2, 1.12, -0.93);
  house.add(flame);
  const flameLight = new T.PointLight(0xff8a2a, 0, 4);
  flameLight.position.set(0.2, 1.3, -0.6);
  house.add(flameLight);

  // Workers: low-poly figures in the brand uniform; limbs hang from pivots so they can animate
  const skinMat = mat(0xd9a77f);
  const pantsMat = mat(0x2d3a4a);
  const bootMat = mat(0x3a2a1f);
  const shirtMat = mat(0x285f51);
  const capMat = mat(0xe9c84a, { roughness: 0.5 });
  const steelMat = mat(0xb8bcc0, { metalness: 0.8, roughness: 0.3 });
  const darkMat = mat(0x2b2b2b);
  const makeWorker = (x: number, y: number, z: number): Worker => {
    const g = new T.Group();
    const limb = (px: number, py: number, w: number, h: number, material: ThreeNamespace.Material) => {
      const pivot = new T.Group();
      pivot.position.set(px, py, 0);
      part(pivot, new T.BoxGeometry(w, h, w), material, 0, -h / 2, 0);
      g.add(pivot);
      return pivot;
    };
    const legL = limb(-0.1, 0.62, 0.17, 0.62, pantsMat);
    const legR = limb(0.1, 0.62, 0.17, 0.62, pantsMat);
    part(legL, new T.BoxGeometry(0.19, 0.08, 0.26), bootMat, 0, -0.6, 0.04);
    part(legR, new T.BoxGeometry(0.19, 0.08, 0.26), bootMat, 0, -0.6, 0.04);
    part(g, new T.BoxGeometry(0.46, 0.6, 0.26), shirtMat, 0, 0.93, 0);
    part(g, new T.SphereGeometry(0.15, 16, 12), skinMat, 0, 1.4, 0);
    part(g, new T.CylinderGeometry(0.165, 0.17, 0.09, 16), capMat, 0, 1.5, 0);
    part(g, new T.BoxGeometry(0.2, 0.03, 0.14), capMat, 0, 1.46, 0.15);
    const armL = limb(-0.3, 1.18, 0.12, 0.52, shirtMat);
    const armR = limb(0.3, 1.18, 0.12, 0.52, shirtMat);
    part(armL, new T.SphereGeometry(0.07, 10, 8), skinMat, 0, -0.55, 0);
    part(armR, new T.SphereGeometry(0.07, 10, 8), skinMat, 0, -0.55, 0);
    g.position.set(x, y, z);
    house.add(g);
    return { g, armL, armR, legL, legR };
  };
  // Arm angle a points the arm along (0, -cos a, -sin a) in the worker's frame (+z = forward)
  const setArms = (w: Worker, a: number) => {
    w.armL.rotation.x = a;
    w.armR.rotation.x = a;
  };
  const show = (w: Worker, s: number) => {
    w.g.visible = s > 0.01;
    w.g.scale.setScalar(Math.max(0.001, s));
  };
  const aim = (w: Worker, target: ThreeNamespace.Vector3) => {
    const dx = target.x - w.g.position.x;
    const dz = target.z - w.g.position.z;
    w.g.rotation.y = Math.atan2(dx, dz);
    const dy = target.y - (w.g.position.y + 1.18);
    setArms(w, -Math.PI / 2 - Math.atan2(dy, Math.hypot(dx, dz)));
  };

  // Painter with a roller held in both hands, working the left wall
  const painter = makeWorker(-2.95, 0, 0);
  painter.g.rotation.y = Math.PI / 2;
  part(painter.armR, new T.CylinderGeometry(0.02, 0.02, 0.6, 8), darkMat, -0.3, -0.6, 0).rotation.z = Math.PI / 2;
  part(painter.armR, new T.CylinderGeometry(0.02, 0.02, 0.26, 8), darkMat, -0.3, -0.72, 0);
  const rollerMat = mat(0xa9bba9, { roughness: 1 });
  part(painter.armR, new T.CylinderGeometry(0.1, 0.1, 0.55, 16), rollerMat, -0.3, -0.88, 0).rotation.z = Math.PI / 2;
  part(painter.g, new T.CylinderGeometry(0.16, 0.13, 0.3, 16), mat(0xf5f2eb), 0.45, 0.15, -0.35);

  // Pressure washing: one worker on the ground (walls + deck), one on the lower roof
  const washer = new T.Group();
  box(washer, 0.5, 0.45, 0.35, mat(0xf2c230, { roughness: 0.5 }), 3.3, 0.25, 3.9);
  house.add(washer);
  const hydroA = makeWorker(2.6, 0, 3.7);
  const hydroB = makeWorker(1.8, 2.4, -1.35);
  const lance = (w: Worker) => {
    part(w.armR, new T.CylinderGeometry(0.025, 0.025, 0.8, 8), darkMat, -0.15, -0.85, 0);
    const tip = new T.Object3D();
    tip.position.set(-0.15, -1.25, 0);
    w.armR.add(tip);
    return tip;
  };
  const tipA = lance(hydroA);
  const tipB = lance(hydroB);
  const makeSpray = (count: number) => {
    const positions = new Float32Array(count * 3);
    const seed = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) seed[i] = Math.random();
    const geometry = new T.BufferGeometry();
    const attribute = new T.BufferAttribute(positions, 3);
    geometry.setAttribute('position', attribute);
    const material = new T.PointsMaterial({ color: 0xcfeaff, size: 0.05, transparent: true, opacity: 0, depthWrite: false });
    const points = new T.Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);
    const update = (from: ThreeNamespace.Vector3, to: ThreeNamespace.Vector3, t: number) => {
      for (let i = 0; i < count; i++) {
        const p = (t * 1.8 + seed[i * 3]) % 1;
        const ex = to.x + (seed[i * 3 + 1] - 0.5) * 0.35;
        const ey = to.y + (seed[i * 3 + 2] - 0.5) * 0.2;
        const ez = to.z + (seed[i * 3 + 1] - 0.5) * 0.35;
        positions[i * 3] = from.x + (ex - from.x) * p;
        positions[i * 3 + 1] = from.y + (ey - from.y) * p + Math.sin(p * Math.PI) * 0.12;
        positions[i * 3 + 2] = from.z + (ez - from.z) * p;
      }
      attribute.needsUpdate = true;
    };
    return { points, material, update };
  };
  const sprayA = makeSpray(320);
  const sprayB = makeSpray(320);

  // Plumbing: vanity with a leak, plumber kneeling underneath with a wrench
  const vanityMat = mat(0xf7f7f4, { roughness: 0.4 });
  box(house, 0.9, 0.8, 0.5, vanityMat, 1.2, 0.42, -1.2);
  part(house, new T.CylinderGeometry(0.2, 0.16, 0.1, 20), vanityMat, 1.2, 0.86, -1.15);
  part(house, new T.CylinderGeometry(0.025, 0.025, 0.25, 8), steelMat, 1.2, 0.95, -1.38);
  const plumber = makeWorker(1.2, -0.28, -0.4);
  plumber.g.rotation.y = Math.PI;
  plumber.legL.rotation.x = 1.3;
  plumber.legR.rotation.x = 1.3;
  part(plumber.armR, new T.BoxGeometry(0.05, 0.28, 0.04), steelMat, 0, -0.68, 0);
  const toolbox = box(house, 0.45, 0.22, 0.25, mat(0xc0392b, { roughness: 0.5 }), 1.85, 0.12, -0.3);

  // Gas: one fitter at the water heater, one checking the meter with a detector
  const gasA = makeWorker(0.2, 0, -0.3);
  gasA.g.rotation.y = Math.PI;
  part(gasA.armR, new T.BoxGeometry(0.05, 0.28, 0.04), steelMat, 0, -0.68, 0);
  const gasB = makeWorker(3.1, 0, -0.6);
  gasB.g.rotation.y = -Math.PI / 2;
  part(gasB.armR, new T.BoxGeometry(0.12, 0.2, 0.06), mat(0xf2c230, { roughness: 0.5 }), -0.15, -0.66, 0);
  const led = part(gasB.armR, new T.SphereGeometry(0.03, 8, 6), new T.MeshBasicMaterial({ color: 0x4ade80 }), -0.15, -0.62, 0.04);

  const views = [
    { pos: new T.Vector3(-10, 5.4, 10), tgt: new T.Vector3(-0.2, 1.7, 0) },
    { pos: new T.Vector3(8, 6, 11.5), tgt: new T.Vector3(0.6, 1.3, 1.2) },
    { pos: new T.Vector3(8.5, 4.5, 3), tgt: new T.Vector3(1.1, 0.6, -0.7) },
    { pos: new T.Vector3(9, 5.5, 4.5), tgt: new T.Vector3(1.2, 1, -0.6) }
  ];
  const camPos = views[0].pos.clone();
  const camTgt = views[0].tgt.clone();

  const palette = [0xf5f2eb, 0xdccbb0, 0xa9bba9, 0xe9d6c8].map((c) => new T.Color(c));
  const dirtyDeck = new T.Color(0x5f584c);
  const cleanDeck = new T.Color(0xc39566);
  const dirtyPlank = new T.Color(0x4b453b);
  const cleanPlank = new T.Color(0x9c7048);
  const dirtyWall = new T.Color(0xa59d8a);
  const dirtyRoof = new T.Color(0x56584a);
  const cleanRoof = new T.Color(0x173f38);
  const tmpColor = new T.Color();
  const targetA = new T.Vector3();
  const targetB = new T.Vector3();
  const worldA = new T.Vector3();
  const worldB = new T.Vector3();
  const tipWorldA = new T.Vector3();
  const tipWorldB = new T.Vector3();
  const st = { mode: 0, wallOp: 1, pipe: 0, gas: 0, water: 0, roll: 1, clean: 0, paintIdx: 0, paintT: 0, yaw: 0, yawT: 0 };

  const resize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  let drag: { x: number; start: number } | null = null;
  const onDown = (e: PointerEvent) => {
    drag = { x: e.clientX, start: st.yawT };
    canvas.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    if (!drag) return;
    st.yawT = Math.max(-1.3, Math.min(1.3, drag.start + (e.clientX - drag.x) * 0.006));
  };
  const onUp = () => {
    drag = null;
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);

  // Stop drawing while the scene is off-screen
  let visible = true;
  const intersectionObserver = new IntersectionObserver((entries) => {
    visible = entries[0]?.isIntersecting ?? true;
  });
  intersectionObserver.observe(container);

  const timer = new T.Timer();
  const approach = (current: number, target: number, speed: number, dt: number) => current + (target - current) * (1 - Math.exp(-speed * dt));
  let raf = 0;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    timer.update(now);
    if (!visible) return;
    const dt = Math.min(timer.getDelta(), 0.05);
    const t = timer.getElapsed();
    const m = st.mode;
    const xray = m === 2 || m === 3;

    const sway = reduceMotion ? 0 : Math.sin(t * 0.25) * 0.1;
    st.yaw = approach(st.yaw, st.yawT + sway, 4, dt);
    world.rotation.y = st.yaw;

    st.wallOp = approach(st.wallOp, xray ? 0.18 : 1, 3, dt);
    st.pipe = approach(st.pipe, m === 2 ? 1 : 0, 3, dt);
    st.gas = approach(st.gas, m === 3 ? 1 : 0, 3, dt);
    st.water = approach(st.water, m === 1 ? 1 : 0, 4, dt);
    st.roll = approach(st.roll, m === 0 ? 1 : 0, 4, dt);

    wallMat.opacity = st.wallOp;
    wallMat.depthWrite = st.wallOp > 0.98;
    // Windows fade with the walls so the x-ray view is not blocked by opaque glass
    glass.opacity = 0.25 + 0.75 * st.wallOp;
    glass.depthWrite = st.wallOp > 0.98;
    heater.visible = st.wallOp < 0.9;

    pipeMat.opacity = st.pipe;
    pipeMat.emissiveIntensity = st.pipe * (0.55 + 0.25 * Math.sin(t * 3));
    pipes.forEach((pipe) => {
      pipe.visible = st.pipe > 0.01;
    });
    const dropPhase = (t * 0.35) % 1;
    drop.position.set(1.2, 0.55 - dropPhase * 0.5, -1.05);
    dropMat.opacity = st.pipe * (dropPhase < 0.85 ? 1 : (1 - dropPhase) / 0.15);
    drop.visible = st.pipe > 0.01;

    gasMat.opacity = st.gas;
    gasMat.emissiveIntensity = st.gas * (0.5 + 0.2 * Math.sin(t * 4));
    gasPipe.visible = st.gas > 0.01;
    flameMat.opacity = st.gas * (0.8 + 0.2 * Math.sin(t * 21));
    flame.scale.set(1, 1 + 0.18 * Math.sin(t * 17), 1);
    flameLight.intensity = st.gas * (1.6 + 0.3 * Math.sin(t * 23));

    // Painting cycles the palette; pressure washing goes from dirty to clean
    if (m === 0) {
      st.paintT += dt;
      if (st.paintT > 3.2) {
        st.paintT = 0;
        st.paintIdx = (st.paintIdx + 1) % palette.length;
      }
    }
    const paint = palette[st.paintIdx];
    if (m === 1) {
      st.clean = Math.min(1, st.clean + dt * 0.14);
      wallMat.color.lerp(tmpColor.copy(dirtyWall).lerp(paint, st.clean), 1 - Math.exp(-6 * dt));
      roofMat.color.lerp(tmpColor.copy(dirtyRoof).lerp(cleanRoof, st.clean), 1 - Math.exp(-6 * dt));
    } else {
      wallMat.color.lerp(paint, 1 - Math.exp(-2.2 * dt));
      roofMat.color.lerp(cleanRoof, 1 - Math.exp(-2.2 * dt));
    }
    rollerMat.color.lerp(paint, 1 - Math.exp(-4 * dt));
    deckMat.color.copy(dirtyDeck).lerp(cleanDeck, st.clean);
    plankMat.color.copy(dirtyPlank).lerp(cleanPlank, st.clean);

    // Painter: arms sweep the roller up and down while he steps along the wall
    show(painter, st.roll);
    if (painter.g.visible) {
      const a = -1.9 - 0.7 * Math.sin(t * 2.6);
      setArms(painter, a);
      painter.g.position.x = -2.2 + Math.sin(a) * 0.85;
      painter.g.position.z = Math.sin(t * 0.6) * 0.9;
      painter.legL.rotation.x = 0.15 * Math.sin(t * 1.2);
      painter.legR.rotation.x = -painter.legL.rotation.x;
    }

    // Pressure washing: both workers aim their lance at a moving target
    show(hydroA, st.water);
    show(hydroB, st.water);
    washer.visible = st.water > 0.01;
    washer.scale.setScalar(Math.max(0.001, st.water));
    sprayA.material.opacity = st.water * 0.85;
    sprayB.material.opacity = st.water * 0.85;
    sprayA.points.visible = sprayB.points.visible = st.water > 0.01;
    if (st.water > 0.01) {
      if ((t * 0.1) % 1 < 0.6) targetA.set(0.2 + Math.sin(t * 0.8) * 1.7, 1.2 + Math.sin(t * 1.9) * 0.7, 1.55);
      else targetA.set(Math.sin(t * 0.9) * 1.9, 0.17, 2.45 + Math.sin(t * 2.3) * 0.5);
      targetB.set(1.3 + Math.sin(t * 0.7) * 0.85, 2.41, 0.6 + Math.sin(t * 1.1) * 0.85);
      aim(hydroA, targetA);
      aim(hydroB, targetB);
      scene.updateMatrixWorld();
      tipA.getWorldPosition(tipWorldA);
      tipB.getWorldPosition(tipWorldB);
      sprayA.update(tipWorldA, house.localToWorld(worldA.copy(targetA)), t);
      sprayB.update(tipWorldB, house.localToWorld(worldB.copy(targetB)), t);
    }

    // Plumber turning the wrench under the sink
    show(plumber, st.pipe);
    toolbox.visible = st.pipe > 0.01;
    if (plumber.g.visible) setArms(plumber, -1.35 + 0.2 * Math.sin(t * 6));

    // Gas fitters
    show(gasA, st.gas);
    show(gasB, st.gas);
    if (st.gas > 0.01) {
      setArms(gasA, -Math.PI / 2 + 0.12 * Math.sin(t * 5));
      setArms(gasB, -1.45 + 0.08 * Math.sin(t * 3));
      led.visible = Math.sin(t * 8) > 0;
    }

    const view = views[m];
    camPos.lerp(view.pos, 1 - Math.exp(-2 * dt));
    camTgt.lerp(view.tgt, 1 - Math.exp(-2 * dt));
    camera.position.copy(camPos);
    camera.lookAt(camTgt);
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(frame);

  return {
    setMode(mode: number) {
      if (mode === 1 && st.mode !== 1) st.clean = 0;
      st.mode = mode;
    },
    dispose() {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      scene.traverse((object) => {
        if (object instanceof T.Mesh || object instanceof T.Points) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
    }
  };
}
