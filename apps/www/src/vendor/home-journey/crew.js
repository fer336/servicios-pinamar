// Each figure faces local -Z; the tool grip and both wrists share one pose.
function buildCrew(scene) {
  const T=THREE, cube=new T.BoxGeometry(), sphere=new T.SphereGeometry(1,8,6), cylinder=new T.CylinderGeometry(1,1,1,8);
  const materials=new Map(),up=new T.Vector3(0,1,0);
  const placements=[[4.66,0,1.03,1.57],[.10,.39,3.15,-.88],[4.56,0,.1,1.57],[4.70,0,-2.13,1.57],[-4.85,1.25,-.37,-1.57],[-5.57,0,3.42,.67],[2.65,.39,2.21,0]];
  const colors=[0xc6a775,0x51818b,0x526e87,0x6e8065,0xd7ddc9,0xc58547,0xc1a04b];
  const uniforms=placements.map(([x,y,z,rotation],job)=>{
    const root=new T.Group();root.position.set(x,y,z);root.rotation.y=rotation;scene.add(root);
    function part(geometry,color,x,y,z,w,h,d,parent=root){
      if(!materials.has(color))materials.set(color,new T.MeshLambertMaterial({color,flatShading:true}));
      const obj=new T.Mesh(geometry,materials.get(color));obj.position.set(x,y,z);obj.scale.set(w,h,d);obj.castShadow=true;parent.add(obj);return obj;
    }
    const block=(color,x,y,z,w,h,d,parent)=>part(cube,color,x,y,z,w,h,d,parent);
    const ball=(color,x,y,z,w,h,d,parent)=>part(sphere,color,x,y,z,w,h,d,parent);
    function setRod(obj,a,b,r){
      const v=new T.Vector3(...a),end=new T.Vector3(...b),delta=end.clone().sub(v);
      obj.position.copy(v.add(end).multiplyScalar(.5));obj.scale.set(r,delta.length(),r);obj.quaternion.setFromUnitVectors(up,delta.normalize());
    }
    function rod(color,a,b,r,parent=root){const obj=part(cylinder,color,0,0,0,1,1,1,parent);setRod(obj,a,b,r);return obj}
    const navy=0x354746,skin=job%2?0xb58264:0xc79a7b,shirt=colors[job],orange=0xd99648,metal=0xabb7ae,rubber=0x394746;
    const crouch=job===2?.33:0,waist=.87-crouch,shoulder=1.34-crouch;
    for(const side of [-1,1]){
      const foot=side*.13,kneeZ=job===2?-.21:side*.09;
      rod(navy,[foot,.15,side*.13],[foot,.48-crouch*.42,kneeZ],.094);
      rod(navy,[foot,.48-crouch*.42,kneeZ],[side*.105,waist,.04],.105);
      block(0x493f34,foot,.09,side*.13-.045,.19,.16,.31);
    }
    block(shirt,0,waist+.25,0,.45,.53,.26);block(navy,0,waist+.04,0,.46,.085,.27);
    block(0x887352,-.23,waist,.04,.09,.19,.15);
    for(const side of [-1,1])block(0xdace8e,side*.14,waist+.29,.133,.042,.43,.012);
    ball(skin,0,shoulder+.22,-.018,.148,.194,.146);
    ball(job===4?0xe3ddc6:job===5?orange:0xf1e4b9,0,shoulder+.35,0,.17,.112,.165);
    block(job===5?orange:0xd7c9a0,0,shoulder+.318,-.028,.347,.035,.34);
    if(job>=4){block(0x385250,0,shoulder+.245,-.142,.225,.065,.028);if(job===4)ball(0xe0dfcd,0,shoulder+.154,-.137,.106,.075,.057)}
    const arms=[-1,1].map(side=>({side,upper:rod(shirt,[0,0,0],[0,.1,0],.08),lower:rod(shirt,[0,0,0],[0,.1,0],.063),glove:ball(rubber,0,0,0,.073,.075,.081)}));

    const tool=new T.Group();root.add(tool);
    const tip=(color,a,b,r)=>rod(color,a,b,r,tool);
    const clamp=value=>Math.max(0,Math.min(1,value));
    const effects={tiles:[],drops:[],bats:[],net:[],jets:[]};
    let roller,needle,branch,saw,hose;
    if(job===0){
      tip(rubber,[0,0,0],[0,.24,-.07],.035);
      tip(metal,[0,.21,-.07],[.12,.34,-.15],.021);
      roller=tip(0xd6dec4,[-.16,.34,-.16],[.16,.34,-.16],.075);
      // Paint lies on the actual right wall at X=3.9, behind the contacting roller.
      for(let column=0;column<4;column++)for(let row=0;row<18;row++){
        const tile=block(0x618a78,-.48+column*.32,.66+row*.085,-.754,.324,.089,.012);
        effects.tiles.push({mesh:tile,at:column*2.15+row/17*1.65});
      }
      part(cylinder,0xd9cfae,.62,.15,.18,.16,.28,.16);
      part(cylinder,0x618a78,.62,.294,.18,.144,.009,.144);
    } else if(job===1){
      tip(rubber,[0,-.08,.05],[0,.07,-.18],.045);
      tip(metal,[0,.07,-.18],[0,.10,-.75],.022);
      block(0x507774,.64,.19,.16,.34,.35,.48);
      for(const x of [.44,.84])ball(rubber,x,.10,.24,.08,.10,.1);
      // Surface cells disappear in the same swept path as the impact point.
      for(let row=0;row<4;row++)for(let col=0;col<18;col++){
        const tile=block(0x716f4e,-.64+col*.075,.022,-1.04-row*.19,.076,.016,.195);
        const sweep=row%2?17-col:col;
        effects.tiles.push({mesh:tile,at:row*2.05+sweep/17*1.8});
      }
      for(let i=0;i<7;i++)effects.jets.push(rod(0xa1c7c9,[0,0,0],[0,.1,0],.009));
      for(let i=0;i<9;i++)effects.drops.push(ball(0xa9cccd,0,0,0,.024,.018,.024));
      hose=rod(rubber,[.64,.2,.16],[0,.6,-.4],.022);
    } else if(job===2){
      tip(0xaa6748,[0,-.14,0],[0,.20,0],.034);
      tip(metal,[-.065,.22,-.02],[.058,.22,-.02],.048);
      block(metal,-.05,.26,-.01,.045,.085,.075,tool);
      part(cylinder,0x9aaea7,.1,1.05,-.596,.075,.18,.075);
      for(let i=0;i<7;i++)effects.drops.push(ball(0x7db5c4,.1,0,-.61,.032,.058,.032));
      block(0x536e67,.1,.025,-.60,.31,.012,.24);
    } else if(job===3){
      block(0x46594d,0,.08,-.05,.18,.24,.09,tool);
      ball(0xe9e4c8,0,.19,-.108,.078,.077,.022,tool);
      needle=block(0x374f45,0,.211,-.133,.013,.068,.012,tool);
      hose=rod(0x303f3b,[0,.1,0],[0,.24,-.25],.018);
      // A second outward-facing scale makes the reading legible from the camera.
      const meter=part(cylinder,0xddd9bb,.12,1.22,-.47,.10,.027,.10);
      meter.rotation.x=Math.PI/2;
      effects.indicator=block(0xb58945,.12,1.24,-.45,.015,.073,.015);
    } else if(job===4){
      // Ladder feet meet the ground; the figure stands at the upper rungs.
      for(const side of [-1,1])rod(metal,[side*.31,-1.25,.48],[side*.31,1.68,-.53],.033);
      for(let i=0;i<11;i++){
        const y=-1.11+i*.245,z=.48-(y+1.25)/2.93*1.01;
        rod(metal,[-.31,y,z],[.31,y,z],.025);
      }
      block(orange,0,.98,.16,.29,.12,.08);
      tip(rubber,[0,0,0],[0,.12,-.035],.035);
      block(orange,0,.15,-.055,.12,.14,.07,tool);
      // One-way exclusion curtain hangs at the underside of the roof.
      block(0x35473b,0,1.50,-.52,.84,.18,.13);
      for(let i=0;i<10;i++)effects.net.push(rod(0xa6baa0,[-.44+i*.096,1.57,-.54],[-.44+i*.096,.70,-.64],.008));
      for(let i=0;i<10;i++)effects.net.push(rod(0xa6baa0,[-.44,.70+i*.096,-.64],[.44,.70+i*.096,-.64],.008));
      const shape=new T.Shape();
      shape.moveTo(0,0);shape.lineTo(.18,.19);shape.lineTo(.48,.12);shape.lineTo(.36,-.02);
      shape.lineTo(.25,.015);shape.lineTo(.17,-.10);shape.lineTo(.08,-.025);shape.lineTo(0,-.07);
      const wingGeometry=new T.ExtrudeGeometry(shape,{depth:.018,bevelEnabled:false});
      for(let i=0;i<4;i++){
        const bat=new T.Group();bat.scale.setScalar(.62);root.add(bat);
        ball(0x3a3330,0,0,0,.065,.115,.058,bat);
        const wings=[-1,1].map(side=>{
          const pivot=new T.Group();bat.add(pivot);
          const wing=part(wingGeometry,0x413a36,0,.02,0,side,1,1,pivot);
          // Positive scales preserve normals in both renderers.
          if(side<0){wing.scale.x=1;pivot.rotation.y=Math.PI}
          return {pivot,side};
        });
        for(const side of [-1,1])meshEar(side,bat);
        function meshEar(side,parent){const ear=part(new T.ConeGeometry(.032,.09,4),0x3a3330,side*.04,.12,0,1,1,1,parent)}
        effects.bats.push({root:bat,wings});
      }
    } else if(job===5){
      tip(orange,[0,-.23,.09],[0,.24,-.09],.04);
      saw=rod(metal,[0,1,0],[0,2,0],.025);
      effects.blade=block(0x4c5750,0,2.43,-1.16,.21,.075,.075);
      branch=new T.Group();branch.position.set(.01,2.43,-1.16);root.add(branch);
      rod(0x735f45,[0,0,0],[.26,.05,.38],.045,branch);
      ball(0x426546,.22,.11,.34,.29,.16,.35,branch);
      effects.stump=rod(0xa98b61,[-.09,2.43,-1.23],[.01,2.43,-1.16],.045);
    } else if(job===6){
      // Isolated board, tool contact, closed cover, then exterior-light test.
      block(0x465650,0,1.20,-.65,.62,.64,.12);
      block(0xd3d8c8,0,1.20,-.577,.53,.55,.025);
      for(const x of [-.13,.13]){
        block(0xeee7cf,x,1.20,-.54,.17,.31,.06);
        block(0x4d5c56,x,1.20,-.50,.10,.075,.022);
        for(const y of [1.08,1.32])ball(metal,x,y,-.494,.027,.027,.012);
        rod(x<0?0x658b9a:0x9f7753,[x,1.41,-.55],[x,1.52,-.55],.015);
      }
      effects.cover=new T.Group();effects.cover.position.set(-.32,1.20,-.55);root.add(effects.cover);
      block(0x87958a,.31,0,.035,.61,.64,.055,effects.cover);
      block(0x344f45,.50,0,.074,.045,.12,.025,effects.cover);
      block(0xd8d9c9,-.48,1.37,-.64,.18,.27,.12);
      effects.switch=block(0x3c5e4d,-.48,1.37,-.555,.07,.13,.035);
      effects.switch.name='electric-isolator';
      rod(0x56665b,[.30,1.53,-.64],[.76,1.53,-.64],.021);
      rod(0x56665b,[.76,1.53,-.64],[.76,1.85,-.64],.021);
      block(0x354e43,.76,1.89,-.62,.27,.37,.20);
      const lamp=block(0xa9b7a6,.76,1.87,-.508,.19,.23,.025);
      lamp.material=lamp.material.clone();lamp.name='electric-lamp';effects.lamp=lamp;
      effects.lightPool=block(0xe4cc8e,.76,1.61,-.702,.40,.16,.015);
      tip(orange,[0,0,.05],[0,0,-.08],.038);
      tip(metal,[0,0,-.08],[0,0,-.235],.012);
      block(0x394f47,.57,.11,.10,.42,.22,.28);
      rod(metal,[.44,.23,.10],[.70,.23,.10],.022);
    }
    const messages=[
      ['Pintando la fachada','Pintura aplicada'],
      ['Retirando la suciedad','Superficie limpia'],
      ['Ajustando la unión con pérdida','Pérdida detenida'],
      ['Revisando la conexión y la lectura','Lectura estabilizada'],
      ['Instalando la malla en el alero','Murciélagos fuera · malla instalada'],
      ['Cortando la rama con pértiga','Rama cortada'],
      ['Circuito aislado · ajustando el tablero','Luminaria encendida · prueba finalizada']
    ];
    const duration=[10,9,7,7,10,7,10][job];
    function update(elapsed){
      const time=Math.max(0,Math.min(duration,elapsed));
      const working=time<duration, wave=Math.sin(time*2.6);
      let grip=[.05,1.03,-.52];
      tool.rotation.set(0,0,0);
      if(job===0){
        const stroke=Math.min(3,Math.floor(time/2.15)),phase=clamp((time-stroke*2.15)/1.65);
        const rollerY=.66+phase*1.445;
        grip=[-.48+stroke*.32,rollerY-.34,-.52];
        effects.tiles.forEach(tile=>tile.mesh.visible=time>=tile.at);
        roller.rotation.x=time*6;
      }
      if(job===1){
        const row=Math.min(3,Math.floor(time/2.05)),phase=clamp((time-row*2.05)/1.8);
        const impact=new T.Vector3(row%2?.635-phase*1.275:-.64+phase*1.275,.035,-1.04-row*.19);
        grip=[impact.x*.24,.91,-.38];
        tool.quaternion.setFromUnitVectors(new T.Vector3(0,0,-1),impact.clone().sub(new T.Vector3(...grip)).normalize());
        tool.position.set(...grip);tool.updateMatrix();
        const nozzle=new T.Vector3(0,.10,-.75).applyMatrix4(tool.matrix);
        effects.jets.forEach((jet,i)=>{
          const end=impact.clone().add(new T.Vector3((i-3)*.025,0,Math.sin(i)*.035));
          setRod(jet,nozzle.toArray(),end.toArray(),.009);jet.visible=working;
        });
        effects.tiles.forEach(tile=>tile.mesh.visible=time<tile.at);
        effects.drops.forEach((drop,i)=>{
          const phase=(time*3+i*.17)%1;
          drop.position.set(impact.x+Math.cos(i)*phase*.22,.05+Math.sin(phase*Math.PI)*.14,impact.z+Math.sin(i)*phase*.18);
          drop.visible=working;
        });
        setRod(hose,[.64,.2,.16],grip,.022);
      }
      if(job===2){
        grip=[.10,.83,-.55];tool.rotation.z=time<4.8?.32*Math.sin(time*5):0;
        effects.drops.forEach((drop,i)=>{
          drop.visible=time<4.8;drop.position.y=1.05-((time*1.8+i*.15)%1)*1.04;
        });
      }
      if(job===3){
        grip=[.02,1.10,-.49];
        const reading=time<4.8?Math.sin(time*4)*.55*Math.exp(-time*.3):.12;
        needle.rotation.z=reading;effects.indicator.rotation.z=reading;
        setRod(hose,[.12,.70,-.58],[grip[0],grip[1]-.04,grip[2]],.018);
      }
      if(job===4){
        grip=[-.39+Math.min(1,time/4)*.78,1.41,-.52];
        effects.net.forEach((line,i)=>line.visible=time>=i/20*3.5);
        effects.bats.forEach((bat,i)=>{
          const flight=clamp((time-2.0-i*.55)/3.7);
          bat.root.visible=flight<1;
          bat.root.position.set((i-1.5)*.22+Math.sin(flight*3+i)*flight*.28,1.43+flight*.9,-.48+flight*3.0);
          bat.root.rotation.y=.25*Math.sin(time+i);
          bat.wings.forEach(({pivot,side})=>pivot.rotation.y=(side<0?Math.PI:0)+side*Math.sin(time*18+i)*.65);
        });
      }
      if(job===5){
        grip=[.025,1.22,-.49];const cutting=time<4.6,stroke=cutting?.045*Math.sin(time*15):0;
        const point=[stroke,2.43,-1.16];
        setRod(saw,grip,point,.025);effects.blade.position.set(...point);
        const fall=clamp((time-4.6)/1.1);
        branch.position.set(.01+fall*.32,2.43-2.25*fall*fall,-1.16+fall*.41);
        branch.rotation.z=fall*1.18;branch.rotation.x=fall*.45;
      }
      if(job===6){
        const powered=time>=8;
        effects.cover.rotation.y=-1.95*(1-clamp((time-6)/1.2));
        effects.switch.rotation.x=powered?-.35:.35;
        effects.lamp.material.color.setHex(powered?0xffe2a0:0xa9b7a6);
        effects.lamp.material.emissive.setHex(powered?0x6d4e15:0x000000);
        effects.lightPool.visible=powered;
        if(time<6){
          const terminal=Math.min(3,Math.floor(time/1.5));
          grip=[terminal%2?.13:-.13,terminal<2?1.08:1.32,-.255];
          tool.rotation.z=Math.sin(time*8)*.5;
        }else if(time<7.2){
          const doorPoint=new T.Vector3(.5,0,.09);
          effects.cover.updateMatrix();doorPoint.applyMatrix4(effects.cover.matrix);
          grip=doorPoint.toArray();
        }else grip=[-.48,1.37,-.51];
        tool.visible=time<6;
      }
      tool.position.set(...grip);
      for(const arm of arms){
        const side=arm.side;
        const hand=[grip[0]+side*.055,grip[1]+(side<0?.08:-.03),grip[2]+(side<0?-.065:.035)];
        const elbow=[side*.28+grip[0]*.36,(shoulder+hand[1])*.5-.13,(hand[2]+.06)*.42];
        setRod(arm.upper,[side*.21,shoulder,0],elbow,.081);
        setRod(arm.lower,elbow,hand,.064);arm.glove.position.set(...hand);
      }
      root.updateMatrixWorld(true);
      const label=job===6&&working&&time>=6?(time<7.2?'Cerrando la tapa del tablero':'Probando la iluminación exterior'):messages[job][working?0:1];
      return {done:!working,label};
    }
    root.visible=false;update(0);return {root,update,duration};
  });
  return uniforms;
}
