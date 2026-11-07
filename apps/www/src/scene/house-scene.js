// Shared geometry for the orbital overview and the service detail cameras.
// Derived from the design package's scene.js (sha256 e2750e9b...). Local changes: the house now stands on a
// sunny pine forest (dense pines, undergrowth, forest floor) with warm light.
function buildHouseViewer(host) {
  const T = THREE;
  const scene = new T.Scene();
  const camera = new T.OrthographicCamera(-12,12,8,-8,.1,180);
  let renderer;
  try { renderer = new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'}); } catch {}
  const canvas = renderer ? renderer.domElement : document.createElement('canvas');
  host.append(canvas);
  if(renderer){renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputEncoding=T.sRGBEncoding;}
  scene.add(new T.HemisphereLight(0xdcecf2,0xd2bb90,.8));
  const sun=new T.DirectionalLight(0xffdca6,.9);
  sun.position.set(9,11,16);sun.castShadow=true;
  Object.assign(sun.shadow.camera,{left:-14,right:14,top:14,bottom:-14});sun.shadow.mapSize.set(1024,1024);sun.shadow.normalBias=.035;scene.add(sun);
  const materials=new Map(),cube=new T.BoxGeometry(),meshes=[];
  function mesh(geometry,color,x,y,z,sx=1,sy=1,sz=1){
    if(!materials.has(color)) materials.set(color,new T.MeshLambertMaterial({color,flatShading:true}));
    const obj=new T.Mesh(geometry,materials.get(color));obj.position.set(x,y,z);obj.scale.set(sx,sy,sz);
    obj.castShadow=true;obj.receiveShadow=true;scene.add(obj);meshes.push(obj);return obj;
  }
  function box(x,y,z,w,h,d,color){return mesh(cube,color,x,y,z,w,h,d)}
  const greens=[0x406650,0x466e54,0x325943,0x567655];
  const foliage=new T.ConeGeometry(1,1,8),trunk=new T.CylinderGeometry(.8,1,1,7),bush=new T.IcosahedronGeometry(1,0);
  function pine(x,z,h,i){
    mesh(trunk,0x816d50,x,h*.30,z,.10*h/5,h*.60,.10*h/5);
    for(let j=0;j<5;j++){const r=h*(.197-j*.029);const branch=mesh(foliage,greens[(i+j)%4],x,h*(.40+.128*j),z,r,h*(.48-.042*j),r);branch.rotation.y=i*.8+j*.49;}
  }
  // Forest floor: a wide island of needle-covered earth so the house sits inside the pine forest.
  box(0,-.49,0,20,.65,16,0x6f6045);
  box(0,-.12,0,20,.18,16,0x9d966a);
  // Entry paving, cedar terrace and full-height glazing.
  for(let i=0;i<6;i++)box(3.25,.015,2.7+i*.51,1.13,.08,.37,0xd3ceba);
  box(-.55,.16,1.5,8.4,.38,4.9,0x936c48);
  for(let i=0;i<39;i++)box(-4.62+i*.213,.365,1.5,.200,.04,4.88,i%3===0?0xc89665:0xbc885a);
  box(0,1.62,-.8,7.8,2.8,4.5,0xe0d7bb);
  box(-.68,1.61,1.47,5.3,2.38,.08,0x496969);
  for(let i=0;i<6;i++)box(-3.35+i*1.06,1.61,1.54,.055,2.42,.08,0x343f37);
  box(-.65,2.8,1.54,5.51,.09,.09,0x3c463f);
  for(let i=0;i<14;i++)box(2.09+i*.126,1.66,1.49,.087,2.71,.09,i%2?0xa97e57:0xbc9166);
  box(0,3.03,-.55,8.62,.24,5.45,0x555e55);
  box(-.87,3.92,-1.17,5.7,1.65,3.6,0xbd946f);
  for(let i=0;i<42;i++)box(-3.65+i*.135,3.94,.655,.068,1.55,.085,0xa47751);
  box(-1.05,4.05,.72,4.07,.92,.1,0x435c5b);
  for(let i=0;i<5;i++)box(-3.08+i*1.017,4.05,.8,.05,.99,.06,0x313f37);
  box(-.9,4.83,-1.1,6.27,.18,4.13,0x50594f);
  box(1.18,5.08,-2,.43,.66,.5,0x6a6b5d);
  // Pergola, outdoor seating, planters and exterior utilities.
  for(const x of [-4.38,-1.02])box(x,1.66,3.43,.10,2.57,.10,0x8e6b4d);
  box(-2.70,2.95,3.43,3.55,.15,.14,0x976f4b);
  for(let i=0;i<12;i++)box(-4.44+i*.318,3.03,2.42,.11,.14,2.29,0xb08c64);
  box(-2.7,.72,2.61,2.24,.42,.64,0xd0c3a1);box(-2.7,.97,2.31,2.24,.47,.13,0xe1dac1);
  box(-2.6,.63,3.45,1.04,.11,.46,0x805c40);
  for(const x of [-3,-2.2])box(x,.48,3.45,.07,.28,.29,0x5a5444);
  for(const [x,z] of [[3.96,.2],[3.96,-.2]])box(x,1.15,z,.077,1.85,.082,0x74999a);
  box(3.99,1.98,0,.08,.10,.53,0x74999a);
  box(4.05,1.05,-2.1,.31,.83,.68,0xd2cfb4);
  // The dial faces out into the service yard, alongside the technician's hand.
  const meterDial=mesh(trunk,0x304a43,4.217,1.23,-1.99,.125,.032,.125);
  meterDial.rotation.z=Math.PI/2;
  const meterFace=mesh(trunk,0xc8c9ae,4.239,1.23,-1.99,.094,.018,.094);
  meterFace.rotation.z=Math.PI/2;
  box(4.255,1.245,-1.976,.018,.068,.018,0x544636).rotation.x=.62;
  box(3.98,.40,-2.1,.10,.59,.10,0xc1a560);
  // The entry paving continues as a trail through the front clearing.
  for(let i=0;i<5;i++)box(3.25,.015,5.76+i*.51,1.13,.08,.37,0xd3ceba);
  let seed=42;
  function random(){seed=seed*16807%2147483647;return seed/2147483647}
  for(const [i,p] of [[-6,-3.1,6.9],[-4.9,-4.7,7.9],[.6,-4.8,6.6],[5.9,-4.4,7.4],[6.6,-2.8,5.1],[-6.45,2.2,4.5]].entries())pine(...p,i);
  for(let i=0;i<35;i++){const x=4.9+random()*1.8,z=.8+random()*3.9,r=.22+random()*.38;mesh(bush,greens[i%4],x,.06+r*.45,z,r,r*.69,r*.86);}
  for(let i=0;i<24;i++){let x=-6.9+random()*3.7,z=4.4+random()*.8;mesh(bush,0xb1b391,x,.04,z,.16,.13,.19);}
  // Forest: moss patches, undergrowth and a dense ring of pines. Tall trees stay behind and beside the house so
  // they never hide the front or the workers; the clearing in front only gets low shrubs and young pines.
  for(let i=0;i<9;i++)box(-8+random()*16,-.108,-6.4+random()*12.4,1.4+random()*2.2,.016,1.1+random()*1.8,i%2?0x82965a:0x738a52);
  // Each service camera looks at its worker from a fixed side: keep a clearing along that line of sight so the
  // forest frames the scene from behind and the sides instead of hiding the work. [camera angle, target x, target z]
  const lookouts=[[1.04,4.15,.92],[.69,.1,2.68],[.7,4.25,.1],[.81,4.26,-2.02],[-1.08,-4.8,-.15],[-.28,-5.88,2.98]];
  const inView=(x,z,w)=>lookouts.some(([a,tx,tz])=>{const dx=x-tx,dz=z-tz,along=dx*Math.sin(a)+dz*Math.cos(a);return along>.3&&Math.abs(dx*Math.cos(a)-dz*Math.sin(a))<w});
  const trees=[[-6,-3.1],[-4.9,-4.7],[.6,-4.8],[5.9,-4.4],[6.6,-2.8],[-6.45,2.2]];
  const free=(x,z,gap)=>trees.every(t=>Math.hypot(t[0]-x,t[1]-z)>gap);
  let planted=0;
  for(let n=0;n<900&&planted<72;n++){
    const x=-9.3+random()*18.6,z=-7.3+random()*14.6;
    if(x>-5.5&&x<6.3&&z>-3.7&&z<5.7)continue;
    let h=4.3+random()*4.4;
    if(z>5.7||(x>6.3&&z>-2.2))h=1.6+random()*1.1;
    else if(x<-5.5&&z>.6)h=2.2+random()*1.4;
    if(inView(x,z,2.3+h*.14)||!free(x,z,h>3?1.35:.8))continue;
    trees.push([x,z]);pine(x,z,h,planted+7);planted++;
  }
  for(let i=0;i<70;i++){
    const x=-9.4+random()*18.8,z=-7.4+random()*14.8;
    if((x>-5.4&&x<6.2&&z>-3.6&&z<5.6)||inView(x,z,1.7))continue;
    const r=.18+random()*.36;mesh(bush,greens[i%4],x,.05+r*.45,z,r,r*.7,r*.86);
  }
  const fern=new T.ConeGeometry(1,1,5);
  for(let i=0;i<60;i++){
    const x=-9.4+random()*18.8,z=-7.4+random()*14.8;
    if((x>-5.2&&x<6.2&&z>-3.4&&z<5.5)||inView(x,z,1.4))continue;
    const h=.3+random()*.4;mesh(fern,i%3?0x7f9f63:0x9bb36f,x,h*.5-.02,z,.09,h,.09);
  }
  for(let i=0;i<14;i++){
    const x=-9.2+random()*18.4,z=-7.2+random()*14.4;
    if((x>-5.2&&x<6.2&&z>-3.4&&z<5.5)||inView(x,z,1.5))continue;
    const r=.16+random()*.3;mesh(bush,0x9a9484,x,.0+r*.3,z,r,r*.55,r*.8);
  }
  scene.updateMatrixWorld(true);
  // Software projection shares the same camera when WebGL is unavailable.
  const crew=buildCrew(scene);
  let active=-1,visible=true,lastTime=0,loopId=0,crewStarted=0,workDone=false;
  const actionStatus=document.querySelector("#actionStatus");
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  function makeFaces(objects){
    const faces=[];
    for(const obj of objects){
      const g=obj.geometry, pos=g.attributes.position,ids=g.index?.array;
      for(let i=0;i<(ids?.length||pos.count);i+=3){
        const vs=[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(pos,ids?ids[i+j]:i+j).applyMatrix4(obj.matrixWorld));
        const normal=vs[1].clone().sub(vs[0]).cross(vs[2].clone().sub(vs[0])).normalize();
        const tone=.61+.32*Math.max(0,normal.dot(sun.position.clone().normalize()));
        faces.push({vs,rgb:obj.material.color.toArray().map(c=>Math.min(255,Math.round(c*tone*255)))});
      }
    }
    return faces;
  }
  const faces=renderer?[]:makeFaces(meshes);
  let pixels,depthBuffer,basePixels,baseDepth,cachedView;
  const pose={angle:.66,targetX:0,targetY:2.45,targetZ:0,lift:.45,span:15.5};
  function paint(now=performance.now()){
    const width=host.clientWidth,height=host.clientHeight;if(!width||!height)return;
    const scale=renderer?1:Math.min(1,850/width,780/height);
    const w=Math.round(width*scale),h=Math.round(height*scale);
    if(active>=0){
      const elapsed=reduced.matches?crew[active].duration:(now-crewStarted)/1000;
      const result=crew[active].update(elapsed);
      workDone=result.done;
      if(actionStatus&&actionStatus.textContent!==result.label)actionStatus.textContent=result.label;
    }
    const aspect=w/h;
    const landscapeHalfHeight=Math.max(pose.span/2/aspect,pose.span*.29);
    // Mobile has a dedicated scene area, clear of the description and controls.
    const compact=matchMedia('(max-width:780px), (max-width:1000px) and (max-height:550px)').matches;
    const mobileSpans=[4.4,4.8,3.8,4.4,5.8,5.4,4.2];
    const mobileHalfHeights=[1.75,1.7,1.65,1.85,2.8,2.55,1.8];
    const half=active>=0 ? compact?Math.max(mobileSpans[active]/2/aspect,mobileHalfHeights[active]):Math.min(landscapeHalfHeight,pose.span*.41) : landscapeHalfHeight;
    const xOffset=active>=0&&!compact?-half*aspect*.25:0;
    const yOffset=0;
    Object.assign(camera,{top:half+yOffset,bottom:-half+yOffset,left:-half*aspect+xOffset,right:half*aspect+xOffset});
    camera.position.set(pose.targetX+32*Math.sin(pose.angle),pose.targetY+32*pose.lift,pose.targetZ+32*Math.cos(pose.angle));
    camera.lookAt(pose.targetX,pose.targetY,pose.targetZ);camera.updateProjectionMatrix();camera.updateMatrixWorld();
    if(renderer){if(canvas.clientWidth!==renderer.domElement.width/renderer.getPixelRatio()||canvas.clientHeight!==renderer.domElement.height/renderer.getPixelRatio())renderer.setSize(w,h,false);renderer.render(scene,camera);return}
    const ctx=canvas.getContext('2d');if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}
    // A depth buffer keeps large roof and ground triangles behind the trim.
    if(!pixels||pixels.width!==w||pixels.height!==h){
      pixels=ctx.createImageData(w,h);depthBuffer=new Float32Array(w*h);
    }
    function rasterize(batch){
    for(const f of batch){
      const [a,b,c]=f.vs.map(v=>{
        const p=v.clone().project(camera);
        return {x:(1+p.x)*w/2,y:(1-p.y)*h/2,z:p.z};
      });
      const area=(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
      if(area>=0)continue;
      const x0=Math.max(0,Math.floor(Math.min(a.x,b.x,c.x))),x1=Math.min(w-1,Math.ceil(Math.max(a.x,b.x,c.x)));
      const y0=Math.max(0,Math.floor(Math.min(a.y,b.y,c.y))),y1=Math.min(h-1,Math.ceil(Math.max(a.y,b.y,c.y)));
      for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
        const dx=x+.5-a.x,dy=y+.5-a.y;
        const u=(dx*(c.y-a.y)-dy*(c.x-a.x))/area;
        const v=((b.x-a.x)*dy-(b.y-a.y)*dx)/area;
        if(u<0||v<0||u+v>1)continue;
        const z=a.z+u*(b.z-a.z)+v*(c.z-a.z),i=y*w+x;
        if(z>=depthBuffer[i])continue;
        depthBuffer[i]=z;const j=i*4;
        pixels.data[j]=f.rgb[0];pixels.data[j+1]=f.rgb[1];pixels.data[j+2]=f.rgb[2];pixels.data[j+3]=255;
      }
    }
    }
    const view=[w,h,xOffset,yOffset,...Object.values(pose)].join("/");
    if(view!==cachedView){
      pixels.data.fill(0);depthBuffer.fill(Infinity);rasterize(faces);
      basePixels=pixels.data.slice();baseDepth=depthBuffer.slice();cachedView=view;
    }else{pixels.data.set(basePixels);depthBuffer.set(baseDepth)}
    if(active>=0){
      const moving=[];crew[active].root.traverseVisible(obj=>{if(obj.isMesh)moving.push(obj)});
      rasterize(makeFaces(moving));
    }
    ctx.putImageData(pixels,0,0);
  }
  let transition=null,dirty=true;
  function render(now){
    loopId=0;
    if(!visible||document.hidden)return;
    if(transition){
      const t=Math.min(1,(now-transition.start)/680),ease=t*t*(3-2*t);
      for(const key in pose)pose[key]=transition.from[key]+(transition.to[key]-transition.from[key])*ease;
      if(t===1)transition=null;
      dirty=true;
    }
    if(dirty||(active>=0&&!workDone&&!reduced.matches&&now-lastTime>1000/(renderer?30:18))){
      paint(now);dirty=false;lastTime=now;
    }
    if(transition||(active>=0&&!workDone&&!reduced.matches))wake();
  }
  function wake(){if(!loopId&&visible&&!document.hidden)loopId=requestAnimationFrame(render)}
  new ResizeObserver(()=>{dirty=true;wake()}).observe(host);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;wake()}).observe(host);
  document.addEventListener('visibilitychange',wake);
  const move=function(target,index,instant=false){
    if(active!==index){if(active>=0)crew[active].root.visible=false;active=index;if(index>=0){crew[index].root.visible=true;crewStarted=performance.now();workDone=false;if(actionStatus)actionStatus.textContent=crew[index].update(0).label;}}
    if(instant||reduced.matches){transition=null;Object.assign(pose,target)}
    else transition={from:{...pose},to:target,start:performance.now()};
    dirty=true;wake();
  };
  move.replay=()=>{
    if(active<0)return;
    crewStarted=performance.now();workDone=false;dirty=true;wake();
  };
  return move;
}
