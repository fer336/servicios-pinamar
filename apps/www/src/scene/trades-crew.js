// Five more trades for the home journey, drawn in the same procedural style as the vendored crew.js (which stays
// byte-identical): herrería (fence, sign, roof structure), durlock and carpintería. Same contract as buildCrew:
// each entry is {root, update(elapsed) -> {done, label}, duration}; every figure faces local -Z.
function buildTradesCrew(scene) {
  const T = THREE, cube = new T.BoxGeometry(), sphere = new T.SphereGeometry(1, 8, 6), cylinder = new T.CylinderGeometry(1, 1, 1, 8);
  const materials = new Map(), glows = new Map(), up = new T.Vector3(0, 1, 0);
  const clamp = (value) => Math.max(0, Math.min(1, value));
  // [x, y, z, rotation]: the fence and the sign stand in the front garden, the roof structure on the right,
  // the drywall on the back wall of the house and the new deck in the front-left garden.
  const placements = [[-1.0, 0, 6.0, Math.PI], [1.7, 0, 6.2, Math.PI], [4.5, 1.0, 6.2, -Math.PI / 2], [-1.4, 0, -3.62, Math.PI], [-4.3, 0, 6.4, 0]];
  const shirts = [0x5d6f7a, 0x7a5f4c, 0x4f6a73, 0xb9a27c, 0x8a6a3e];
  const navy = 0x354746, metal = 0xabb7ae, steel = 0x5b6567, rubber = 0x394746, orange = 0xd99648;
  const messages = [
    ['Soldando los barrotes de la reja', 'Reja terminada'],
    ['Soldando el marco del cartel', 'Cartel terminado'],
    ['Soldando las correas de perfil C', 'Estructura de techo terminada'],
    ['Colocando la placa de durlock', 'Junta masillada · placa terminada'],
    ['Colocando las tablas del deck', 'Deck de madera terminado']
  ];
  const durations = [9, 8, 9.5, 10, 10];

  return placements.map(([x, y, z, rotation], job) => {
    const root = new T.Group(); root.position.set(x, y, z); root.rotation.y = rotation; scene.add(root);
    // The figure lives in its own group so it can walk along the work while the work stays put.
    const body = new T.Group(); root.add(body);
    function part(geometry, color, x, y, z, w, h, d, parent = body) {
      if (!materials.has(color)) materials.set(color, new T.MeshLambertMaterial({ color, flatShading: true }));
      const obj = new T.Mesh(geometry, materials.get(color)); obj.position.set(x, y, z); obj.scale.set(w, h, d); obj.castShadow = true; parent.add(obj); return obj;
    }
    // Unlit material: sparks and the arc stay bright whatever the light.
    function glowing(geometry, color, parent = root) {
      if (!glows.has(color)) glows.set(color, new T.MeshBasicMaterial({ color }));
      const obj = new T.Mesh(geometry, glows.get(color)); parent.add(obj); return obj;
    }
    const block = (color, x, y, z, w, h, d, parent) => part(cube, color, x, y, z, w, h, d, parent);
    const ball = (color, x, y, z, w, h, d, parent) => part(sphere, color, x, y, z, w, h, d, parent);
    function setRod(obj, a, b, r) {
      const v = new T.Vector3(...a), end = new T.Vector3(...b), delta = end.clone().sub(v);
      obj.position.copy(v.add(end).multiplyScalar(.5)); obj.scale.set(r, Math.max(.001, delta.length()), r);
      obj.quaternion.setFromUnitVectors(up, delta.normalize());
    }
    function rod(color, a, b, r, parent = body) { const obj = part(cylinder, color, 0, 0, 0, 1, 1, 1, parent); setRod(obj, a, b, r); return obj; }
    const fixed = (color, a, b, r) => rod(color, a, b, r, root);
    const fixedBlock = (color, x, y, z, w, h, d) => block(color, x, y, z, w, h, d, root);

    // Figure, as in crew.js: legs, torso, head, headgear and two arms solved towards one grip point.
    const welder = job < 3, kneeling = job === 4;
    const skin = job % 2 ? 0xb58264 : 0xc79a7b, shirt = shirts[job];
    const crouch = kneeling ? .33 : 0, waist = .87 - crouch, shoulder = 1.34 - crouch;
    for (const side of [-1, 1]) {
      const foot = side * .13, kneeZ = kneeling ? -.21 : side * .09;
      rod(navy, [foot, .15, side * .13], [foot, .48 - crouch * .42, kneeZ], .094);
      rod(navy, [foot, .48 - crouch * .42, kneeZ], [side * .105, waist, .04], .105);
      block(0x493f34, foot, .09, side * .13 - .045, .19, .16, .31);
    }
    block(shirt, 0, waist + .25, 0, .45, .53, .26); block(navy, 0, waist + .04, 0, .46, .085, .27);
    block(0x887352, -.23, waist, .04, .09, .19, .15);
    ball(skin, 0, shoulder + .22, -.018, .148, .194, .146);
    if (welder) {
      // Leather apron, cap and a welding mask with its dark green lens over the face.
      block(0x7d5a3c, 0, waist + .2, -.135, .4, .5, .02);
      ball(0x3d4a48, 0, shoulder + .33, 0, .16, .1, .16);
      block(0x2f3a38, 0, shoulder + .21, -.15, .28, .29, .05);
      block(0x4f6b3c, 0, shoulder + .25, -.178, .17, .065, .012);
    } else {
      for (const side of [-1, 1]) block(0xdace8e, side * .14, waist + .29, .133, .042, .43, .012);
      ball(job === 3 ? 0xf1e4b9 : orange, 0, shoulder + .35, 0, .17, .112, .165);
      block(job === 3 ? 0xd7c9a0 : orange, 0, shoulder + .318, -.028, .347, .035, .34);
    }
    const arms = [-1, 1].map((side) => ({ side, upper: rod(shirt, [0, 0, 0], [0, .1, 0], .08), lower: rod(shirt, [0, 0, 0], [0, .1, 0], .063), glove: ball(welder ? 0x8a5a36 : rubber, 0, 0, 0, .073, .075, .081) }));

    const tool = new T.Group(); body.add(tool);
    const tip = (color, a, b, r) => rod(color, a, b, r, tool);
    let seed = 7 + job * 31;
    const random = () => { seed = seed * 16807 % 2147483647; return seed / 2147483647; };

    // Welding: a flickering arc at the joint and a fountain of sparks that fall under gravity and bounce off the floor.
    const sparks = [];
    let arc = null;
    if (welder) {
      tip(rubber, [0, -.07, .05], [0, .05, -.05], .03);
      tip(metal, [0, .05, -.05], [0, .02, -.2], .016);
      fixedBlock(0x3d5f7a, .75, (job === 2 ? -1 : 0) + .2, .25, .3, .36, .42);
      fixedBlock(0xd99648, .75, (job === 2 ? -1 : 0) + .3, .036, .08, .05, .012);
      arc = glowing(sphere, 0xeaf6ff);
      const streak = new T.CylinderGeometry(1, 1, 1, 4);
      for (let i = 0; i < 30; i++) {
        const angle = random() * Math.PI * 2, speed = .5 + random() * 1.3;
        sparks.push({
          mesh: glowing(streak, i % 3 ? 0xffc65a : 0xfff3c4),
          v: [Math.cos(angle) * speed, .5 + random() * 1.6, Math.sin(angle) * speed], offset: random()
        });
      }
    }
    const floor = job === 2 ? -1 : 0;
    function weld(point, time, on) {
      arc.visible = on && Math.sin(time * 47) > -.55;
      arc.position.set(...point);
      arc.scale.setScalar(.035 + .03 * Math.abs(Math.sin(time * 29)));
      for (const spark of sparks) {
        const life = .55, t = ((time * 1.7 + spark.offset) % 1) * life;
        const p = [point[0] + spark.v[0] * t, point[1] + spark.v[1] * t - 4.9 * t * t, point[2] + spark.v[2] * t];
        p[1] = Math.max(floor + .02, p[1]);
        const tail = [p[0] - spark.v[0] * .035, p[1] - (spark.v[1] - 9.8 * t) * .035, p[2] - spark.v[2] * .035];
        setRod(spark.mesh, tail, p, .009);
        spark.mesh.visible = on;
      }
    }
    const pieces = [];
    let hose = null, drill = null, trowel = null, boardB = null, panel = null;

    if (job === 0) {
      // Fence: posts and rails are in place; each vertical bar appears as it is welded to the top rail.
      for (const side of [-1, 1]) fixedBlock(steel, side * 1.02, .72, -.62, .075, 1.44, .075);
      for (const yRail of [.2, 1.22]) fixedBlock(steel, 0, yRail, -.62, 2.04, .055, .05);
      for (let i = 0; i < 12; i++) {
        const bx = -.9 + i * 1.8 / 11;
        const bar = fixed(steel, [bx, .2, -.62], [bx, 1.36, -.62], .017);
        const finial = part(new T.ConeGeometry(1, 1, 4), steel, bx, 1.4, -.62, .03, .08, .03, root);
        const bead = fixedBlock(0x8d8f88, bx, 1.2, -.6, .05, .05, .02);
        pieces.push({ meshes: [bar, finial, bead], at: i * .62, x: bx });
      }
      hose = rod(rubber, [.75, .3, .25], [0, .6, -.3], .02, root);
    } else if (job === 1) {
      // Welding table with the sign frame lying on it; the steel plate goes on once the frame is closed.
      fixedBlock(0x5f5953, 0, .76, -.78, 1.5, .05, .78);
      for (const [lx, lz] of [[-.68, -.44], [.68, -.44], [-.68, -1.12], [.68, -1.12]]) fixed(steel, [lx, 0, lz], [lx, .74, lz], .025);
      const corners = [[-.56, -.5], [.56, -.5], [.56, -1.06], [-.56, -1.06], [-.56, -.5]];
      const steps = 26, perimeter = [];
      for (let e = 0; e < 4; e++) {
        const [ax, az] = corners[e], [bx, bz] = corners[e + 1];
        const n = Math.round(steps * Math.hypot(bx - ax, bz - az) / 3.36);
        for (let s = 0; s < n; s++) perimeter.push([ax + (bx - ax) * s / n, az + (bz - az) * s / n, ax + (bx - ax) * (s + 1) / n, az + (bz - az) * (s + 1) / n]);
      }
      perimeter.forEach(([ax, az, bx, bz], i) => {
        const seg = fixed(steel, [ax, .81, az], [bx, .81, bz], .022);
        pieces.push({ meshes: [seg], at: .3 + i / perimeter.length * 5.6, x: (ax + bx) / 2, z: (az + bz) / 2 });
      });
      panel = new T.Group(); root.add(panel);
      block(0x173f38, 0, .835, -.78, 1.06, .014, .5, panel);
      for (let row = 0; row < 2; row++) for (let c = 0; c < (row ? 5 : 7); c++) block(0xf1e4b9, -.36 + c * .12 + row * .06, .845, -.68 - row * .17, .08, .008, .08, panel);
      hose = rod(rubber, [.75, .3, .25], [0, .6, -.3], .02, root);
    } else if (job === 2) {
      // Scaffold under the worker; square tube posts and beams, then C purlins welded one by one, then the sheets.
      for (const [sx, sz] of [[-.38, -.32], [.38, -.32], [-.38, .38], [.38, .38]]) fixed(metal, [sx, -1, sz], [sx, -.04, sz], .022);
      fixed(metal, [-.38, -.9, .38], [.38, -.1, .38], .015); fixed(metal, [-.38, -.1, -.32], [.38, -.9, -.32], .015);
      fixedBlock(0x8a7f68, 0, -.03, 0, .86, .06, .8);
      for (const px of [-1.2, 1.2]) for (const pz of [-.55, -2.45]) fixedBlock(steel, px, .22, pz, .11, 2.44, .11);
      for (const pz of [-.55, -2.45]) fixedBlock(steel, 0, 1.46, pz, 2.6, .13, .09);
      for (let i = 0; i < 7; i++) {
        const px = -1.08 + i * .36;
        const web = fixedBlock(0x6f7a7a, px, 1.58, -1.5, .025, .11, 1.98);
        const flange = fixedBlock(0x6f7a7a, px + .025, 1.63, -1.5, .05, .018, 1.98);
        pieces.push({ meshes: [web, flange], at: i * .98, x: px });
      }
      for (let s = 0; s < 3; s++) {
        const sheet = fixedBlock(s % 2 ? 0x9aa9a8 : 0xa8b5b2, -.87 + s * .87, 1.7, -1.5, .9, .025, 2.2);
        pieces.push({ meshes: [sheet], at: 7.2 + s * .45, sheet: true });
      }
      hose = rod(rubber, [.75, -.7, .25], [0, .9, -.3], .02, root);
    } else if (job === 3) {
      // Drywall on the back wall: studs, a first board already screwed, the second one slides in, then compound.
      for (const sx of [-1.0, 0, 1.0]) fixedBlock(0x9aa4a3, sx, 1.35, -.565, .05, 2.25, .02);
      fixedBlock(0xd5d3c9, -.5, 1.35, -.54, .99, 2.2, .025);
      boardB = fixedBlock(0xcfcdc2, .5, 1.35, -.54, .99, 2.2, .025);
      for (let i = 0; i < 6; i++) {
        const screw = fixedBlock(0x6b6f6a, .06, .45 + i * .35, -.525, .025, .025, .01);
        pieces.push({ meshes: [screw], at: 1.9 + i * .42, y: .45 + i * .35 });
      }
      for (let i = 0; i < 20; i++) {
        const strip = fixedBlock(0xffffff, 0, .3 + i * .105, -.521, .22, .108, .01);
        pieces.push({ meshes: [strip], at: 4.6 + i / 19 * 4, y: .3 + i * .105, compound: true });
      }
      drill = new T.Group(); tool.add(drill);
      block(0x2f6f8f, 0, .02, -.08, .07, .09, .2, drill); block(rubber, 0, -.07, -.02, .05, .14, .06, drill);
      rod(metal, [0, .02, -.18], [0, .02, -.25], .008, drill);
      trowel = new T.Group(); tool.add(trowel);
      rod(0x7d5a3c, [0, -.06, 0], [0, .04, -.04], .02, trowel);
      block(metal, 0, .05, -.07, .24, .13, .008, trowel);
      fixedBlock(0xd8d4c8, .7, .14, .1, .32, .28, .32); fixedBlock(0xfaf8f0, .7, .285, .1, .28, .01, .28);
    } else if (job === 4) {
      // Deck: the joists are down; each board drops into place and gets nailed at the near joist.
      for (const jz of [-.5, -1.15, -1.8]) fixedBlock(0x7a5a3a, 0, .06, jz, 2.3, .1, .08);
      for (let i = 0; i < 11; i++) {
        const bx = -1 + i * .2;
        const board = fixedBlock(i % 2 ? 0xb47d4c : 0xc28c58, bx, .14, -1.15, .185, .04, 1.5);
        pieces.push({ meshes: [board], at: i * .82, x: bx });
      }
      fixedBlock(0xc28c58, 1.55, .08, -.2, .26, .16, 1.3); fixedBlock(0xb47d4c, 1.55, .19, -.2, .26, .05, 1.3);
      tip(0x8a5a36, [0, -.12, .02], [0, .12, -.02], .022);
      block(steel, 0, .14, -.04, .05, .06, .16, tool);
    }

    const duration = durations[job];
    function update(elapsed) {
      const time = Math.max(0, Math.min(duration, elapsed));
      let working = time < duration - .6, label = null;
      let grip = [0, 1.0, -.5], bodyX = 0;
      tool.rotation.set(0, 0, 0);
      if (job === 0) {
        const i = Math.min(11, Math.floor(time / .62)), phase = (time - i * .62) / .62, welding = working && phase > .12 && phase < .88;
        pieces.forEach((piece, k) => piece.meshes.forEach((m, j) => m.visible = j === 2 ? time >= piece.at + .55 : time >= piece.at));
        const point = [pieces[i].x, 1.2, -.6];
        bodyX = pieces[i].x * .55;
        grip = [point[0] + .02 * Math.sin(time * 9), 1.2, -.42];
        weld(point, time, welding);
      }
      if (job === 1) {
        const welding = time < 6, closing = time >= 6 && working;
        let current = pieces[0];
        pieces.forEach((piece) => { piece.meshes[0].visible = time >= piece.at; if (time >= piece.at) current = piece; });
        panel.visible = time >= 6.3;
        panel.position.y = .3 * (1 - clamp((time - 6.3) / .4));
        const point = [current.x, .83, current.z];
        bodyX = current.x * .45;
        grip = welding ? [point[0], .98, point[2] + .16] : [0, .98, -.55];
        tool.rotation.x = -.8; tool.visible = welding || !working;
        weld(point, time, welding && time > .3);
        if (closing) label = 'Colocando la chapa con el logo';
      }
      if (job === 2) {
        const i = Math.min(6, Math.floor(time / .98)), phase = (time - i * .98) / .98, welding = time < 6.86 && phase > .15 && phase < .85;
        pieces.forEach((piece) => piece.meshes.forEach((m) => m.visible = time >= piece.at));
        const purlin = pieces[i];
        const point = [purlin.x, 1.53, -.6];
        bodyX = Math.max(-.25, Math.min(.25, purlin.x * .25));
        grip = time < 6.86 ? [point[0] + .02 * Math.sin(time * 8), 1.5, -.42] : [0, 1.2, -.45];
        weld(point, time, welding);
        if (time >= 6.86 && working) label = 'Colocando las chapas del techo';
      }
      if (job === 3) {
        const slide = clamp(time / 1.6);
        boardB.position.x = .5 + (1 - slide) * (1 - slide) * 1.1;
        pieces.forEach((piece) => piece.meshes[0].visible = time >= piece.at);
        drill.visible = time >= 1.6 && time < 4.4; trowel.visible = time >= 4.4;
        if (time < 1.6) { grip = [boardB.position.x - .38, 1.2, -.46]; bodyX = .1; label = 'Colocando la placa de durlock'; }
        else if (time < 4.4) {
          const s = Math.min(5, Math.floor((time - 1.9) / .42));
          grip = [.06, .45 + Math.max(0, s) * .35, -.27]; bodyX = .05; label = 'Atornillando la placa a los montantes';
        } else {
          const p = clamp((time - 4.6) / 4);
          // He steps to the side of the joint so the camera sees the compound go on behind the trowel.
          grip = working ? [.04 * Math.sin(time * 6), .32 + p * 2.0, -.44] : [-.2, 1.0, -.45]; bodyX = -.5;
          if (working) label = 'Pasando la llana con masilla en la junta';
        }
      }
      if (job === 4) {
        const i = Math.min(10, Math.floor(time / .82)), phase = (time - i * .82) / .82;
        pieces.forEach((piece) => {
          const m = piece.meshes[0]; m.visible = time >= piece.at;
          m.position.y = .14 + .35 * Math.pow(1 - clamp((time - piece.at) / .22), 2);
        });
        const bx = pieces[i].x;
        bodyX = bx;
        const swing = working && phase > .3 ? Math.abs(Math.sin((phase - .3) * Math.PI * 3.4)) : 0;
        grip = [bx + .05, .34 + swing * .22, -.46];
        tool.rotation.x = -.5 + swing * 1.1;
      }
      body.position.x = bodyX;
      const g = [grip[0] - bodyX, grip[1], grip[2]];
      tool.position.set(...g);
      if (hose) setRod(hose, job === 2 ? [.75, -.7, .25] : [.75, .3, .25], grip, .02);
      for (const arm of arms) {
        const side = arm.side;
        const hand = [g[0] + side * .055, g[1] + (side < 0 ? .08 : -.03), g[2] + (side < 0 ? -.065 : .035)];
        const elbow = [side * .28 + g[0] * .36, (shoulder + hand[1]) * .5 - .13, (hand[2] + .06) * .42];
        setRod(arm.upper, [side * .21, shoulder, 0], elbow, .081);
        setRod(arm.lower, elbow, hand, .064); arm.glove.position.set(...hand);
      }
      root.updateMatrixWorld(true);
      return { done: !working, label: label || messages[job][working ? 0 : 1] };
    }
    root.visible = false; update(0);
    return { root, update, duration };
  });
}
