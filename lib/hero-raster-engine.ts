import { backgroundFragment, backgroundVertex, pointFragment, pointVertex } from './hero-raster-shaders';

type Options = { onReady: () => void; onFailure: () => void };
type Program = { program: WebGLProgram; attribute: number; uniforms: Record<string, WebGLUniformLocation | null> };

export class RasterEngine {
  private gl: WebGLRenderingContext;
  private programs: Program[] = [];
  private buffers: WebGLBuffer[] = [];
  private textures: WebGLTexture[] = [];
  private progress = 0;
  private stageHeight = 1;
  private heroHeight = 1;
  private still = false;
  private pan = 0;
  private raf = 0;
  private resizeObserver: ResizeObserver;
  private running = false;
  private disposed = false;
  private failed = false;
  private ready = false;
  private elapsed = 0;
  private lastTime = 0;
  private enter = 0;
  private width = 1;
  private height = 1;
  private dpr = 1;
  private points = 0;
  private pointer = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, strength: 0, target: 0 };
  private lost = (event: Event) => { event.preventDefault(); this.fail(); };

  constructor(private canvas: HTMLCanvasElement, private panorama: HTMLImageElement, private atlas: HTMLImageElement, private options: Options) {
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
    if (!gl || gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) < 2) throw new Error('Point renderer unavailable');
    this.gl = gl; this.init();
    this.resizeObserver = new ResizeObserver(() => { this.resize(); if (!this.running) this.draw(); });
    this.resizeObserver.observe(canvas); this.resize();
    canvas.addEventListener('webglcontextlost',this.lost);
    Promise.all([panorama.decode(), atlas.decode()]).then(() => {
      if (this.disposed || this.failed) return;
      [panorama,atlas].forEach((image,i)=>{
        gl.activeTexture(gl.TEXTURE0+i); gl.bindTexture(gl.TEXTURE_2D,this.textures[i]);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
      });
      this.ready = true; this.draw(); options.onReady();
    }).catch(() => { if (!this.disposed) this.fail(); });
  }

  private init() {
    const gl = this.gl;
    const makeProgram = (vertex: string, fragment: string, attribute: string): Program => {
      const shaders: WebGLShader[] = [];
      for (const [type,source] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]] as const) {
        const shader=gl.createShader(type)!;
        gl.shaderSource(shader,source); gl.compileShader(shader);
        if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) {
          const message=gl.getShaderInfoLog(shader); gl.deleteShader(shader);
          throw new Error(message || 'Shader compilation failed');
        }
        shaders.push(shader);
      }
      const program=gl.createProgram()!;
      shaders.forEach(shader=>gl.attachShader(program,shader)); gl.linkProgram(program);
      shaders.forEach(shader=>gl.deleteShader(shader));
      if (!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Shader link failed');
      gl.useProgram(program);
      const uniforms: Program['uniforms']={};
      ['size','pointer','pointerStrength','time','enter','dpr','imageAspect','atlasAspect','progress','stageHeight','heroHeight','layer','still','pan'].forEach(name=>{uniforms[name]=gl.getUniformLocation(program,'u_'+name);});
      gl.uniform1i(gl.getUniformLocation(program,'u_panorama'),0);
      gl.uniform1i(gl.getUniformLocation(program,'u_atlas'),1);
      return {program,attribute:gl.getAttribLocation(program,attribute),uniforms};
    };
    this.programs=[makeProgram(backgroundVertex,backgroundFragment,'a_position'),makeProgram(pointVertex,pointFragment,'a_uv')];
    this.buffers=[gl.createBuffer()!,gl.createBuffer()!];
    gl.bindBuffer(gl.ARRAY_BUFFER,this.buffers[0]);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    for(let i=0;i<2;i++){
      const texture=gl.createTexture()!;this.textures.push(texture);
      gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,texture);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([0,0,0,255]));
    }
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
    this.canvas.dataset.renderer='webgl-particles'; this.canvas.dataset.dotDiameter='3.05';
  }

  private resize() {
    const rect=this.canvas.getBoundingClientRect();
    this.width=Math.max(1,rect.width); this.height=Math.max(1,rect.height);
    this.dpr=Math.min(window.devicePixelRatio || 1,1.75);
    this.canvas.width=Math.round(this.width*this.dpr); this.canvas.height=Math.round(this.height*this.dpr);
    const gl=this.gl; gl.viewport(0,0,this.canvas.width,this.canvas.height);
    // Smaller mobile dots retain facial detail; original desktop spacing and
    // bounded geometry keep the wider composition inexpensive.
    const t=Math.max(0,Math.min(1,(this.width-500)/600));
    const pitch=Math.max(1.95+1.85*t*t*(3-2*t),Math.sqrt(this.width*this.height/145000));
    const vertices:number[]=[];
    for(let y=pitch/2;y<this.height+pitch;y+=pitch) for(let x=pitch/2;x<this.width+pitch;x+=pitch) vertices.push(x/this.width,y/this.height);
    this.points=vertices.length/2;
    gl.bindBuffer(gl.ARRAY_BUFFER,this.buffers[1]); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
    this.canvas.dataset.particles=String(this.points);
  }

  setPointer(x:number,y:number,inside:boolean) {
    if(inside && this.pointer.strength<.01){this.pointer.x=x;this.pointer.y=y;}
    this.pointer.targetX=x; this.pointer.targetY=y; this.pointer.target=inside ? 1 : 0;
  }

  setScene(progress:number,stageHeight:number,still:boolean,pan:number,heroHeight:number) {
    this.progress=progress;this.stageHeight=Math.max(1,stageHeight);this.heroHeight=Math.max(1,heroHeight);this.still=still;this.pan=pan;
    this.canvas.dataset.progress=progress.toFixed(3);
    if(!this.running){this.enter=1;this.draw();}
  }

  setRunning(value:boolean) {
    if(this.disposed || this.failed) return;
    if(value===this.running) {
      if(!value && this.ready) {this.enter=1;this.draw();}
      return;
    }
    this.running=value;this.canvas.dataset.running=String(value);
    if(value) {this.lastTime=performance.now();this.raf=requestAnimationFrame(this.tick);}
    else {cancelAnimationFrame(this.raf);this.raf=0;this.pointer.strength=0;this.enter=1;this.draw();}
  }

  private tick=(now:number)=>{
    if(!this.running || this.disposed || this.failed) return;
    const dt=Math.min(.05,(now-this.lastTime)/1000);this.lastTime=now;this.elapsed+=dt;
    this.enter=Math.min(1,this.enter+dt/1.45);
    const weight=1-Math.exp(-dt*4.5);
    this.pointer.x+=(this.pointer.targetX-this.pointer.x)*weight;
    this.pointer.y+=(this.pointer.targetY-this.pointer.y)*weight;
    this.pointer.strength+=(this.pointer.target-this.pointer.strength)*weight;
    this.draw();this.raf=requestAnimationFrame(this.tick);
  };

  private draw() {
    if(this.disposed || this.failed || !this.ready || this.gl.isContextLost()) return;
    const gl=this.gl;
    try {
      this.programs.forEach(({program,attribute,uniforms:u},i)=>{
        gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,this.buffers[i]);
        gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);
        gl.uniform2f(u.size,this.width,this.height);gl.uniform2f(u.pointer,this.pointer.x,this.pointer.y);
        gl.uniform1f(u.pointerStrength,this.pointer.strength);gl.uniform1f(u.time,this.elapsed);
        gl.uniform1f(u.enter,this.enter);gl.uniform1f(u.dpr,this.dpr);
        gl.uniform1f(u.imageAspect,this.panorama.naturalWidth/this.panorama.naturalHeight);
        gl.uniform1f(u.atlasAspect,this.atlas.naturalWidth/this.atlas.naturalHeight);
        gl.uniform1f(u.progress,this.progress);gl.uniform1f(u.stageHeight,this.stageHeight);
        gl.uniform1f(u.heroHeight,this.heroHeight);
        gl.uniform1f(u.still,this.still ? 1 : 0);gl.uniform1f(u.pan,this.pan);
        if(i===0) gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
        else {
          // Destination underneath, falling source patches above it.
          if(this.progress>.25){gl.uniform1f(u.layer,1);gl.drawArrays(gl.POINTS,0,this.points);}
          if(this.progress<.94){gl.uniform1f(u.layer,0);gl.drawArrays(gl.POINTS,0,this.points);}
        }
        gl.disableVertexAttribArray(attribute);
      });
    } catch {this.fail();}
  }
  private fail() {
    this.failed=true;this.running=false;cancelAnimationFrame(this.raf);
    this.canvas.dataset.renderer='fallback';this.options.onFailure();
  }
  dispose() {
    this.disposed=true;cancelAnimationFrame(this.raf);this.resizeObserver.disconnect();
    this.canvas.removeEventListener('webglcontextlost',this.lost);
    this.textures.forEach(t=>this.gl.deleteTexture(t));this.buffers.forEach(b=>this.gl.deleteBuffer(b));
    this.programs.forEach(({program})=>this.gl.deleteProgram(program));
  }
}
