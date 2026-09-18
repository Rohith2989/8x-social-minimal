// One persistent, equal-diameter point field carries the studio into the Creator Atlas.
const field = `
precision highp float;
uniform sampler2D u_panorama;
uniform sampler2D u_atlas;
uniform vec2 u_size;
uniform vec2 u_pointer;
uniform float u_pointerStrength;
uniform float u_time;
uniform float u_enter;
uniform float u_dpr;
uniform float u_imageAspect;
uniform float u_atlasAspect;
uniform float u_progress;
uniform float u_stageHeight;
uniform float u_heroHeight;
uniform float u_layer;
uniform float u_still;
uniform float u_pan;
float hash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123); }
// Adjacent dots share a release time. The front climbs in small, stepped patches.
float releaseStart(vec2 px) {
  float patch=hash(vec2(floor(px.x/45.6),floor(px.y/22.8)));
  return .19+.43*(1.-clamp(px.y/u_heroHeight,0.,1.))+patch*.065;
}
vec2 photographUV(vec2 uv) {
  float aspect=u_size.x/u_heroHeight;
  // Cover the extended room. Layout bounds preserve the entire approved centre
  // at every width; only newly outpainted side scenery leaves the viewport.
  vec2 scale=vec2(min(1.,aspect/u_imageAspect),min(1.,u_imageAspect/aspect));
  return (uv-.5)*scale+.5;
}
float photoEdge(vec2 px) {
  return smoothstep(0.,22.,px.y)*(1.-smoothstep(u_heroHeight-40.,u_heroHeight,px.y));
}
float photographCoverage(vec2 uv) {
  vec2 source=photographUV(uv);
  return step(0.,source.x)*step(source.x,1.)*step(0.,source.y)*step(source.y,1.);
}
vec3 photograph(vec2 uv) {
  vec2 source=photographUV(uv);
  if(source.x<0. || source.x>1. || source.y<0. || source.y>1.) return vec3(.99);
  return texture2D(u_panorama,source).rgb;
}
vec3 pigment(vec3 c) {
  float l=clamp(dot(c,vec3(.2126,.7152,.0722))*1.07,0.,1.);
  vec3 colour=mix(vec3(.022,.035,.050),vec3(.28,.20,.073),smoothstep(.045,.32,l));
  colour=mix(colour,vec3(.84,.53,.045),smoothstep(.27,.52,l));
  colour=mix(colour,vec3(1.,.827,.22),smoothstep(.49,.73,l));
  return mix(colour,vec3(.995,.98,.92),smoothstep(.72,.96,l));
}
vec3 voiceInk(float x) {
  vec3 ink=vec3(1.,.83,.22);
  ink=mix(ink,vec3(.48,.69,.91),smoothstep(.18,.22,x));
  ink=mix(ink,vec3(.98,.955,.86),smoothstep(.38,.42,x));
  ink=mix(ink,vec3(.68,.57,.88),smoothstep(.59,.63,x));
  return mix(ink,vec3(.98,.33,.20),smoothstep(.79,.83,x));
}
vec4 portrait(vec2 px) {
  // Contain all five voices, including on mobile. No hidden panning crop.
  float virtualWidth=u_size.x*.94;
  float bandHeight=min(u_size.y*.70,virtualWidth/u_atlasAspect);
  float bandTop=max(16.,(u_size.y*.74-bandHeight)*.5);
  vec2 uv=vec2((px.x-u_size.x*.5)/virtualWidth+.5+u_pan,(px.y-bandTop)/bandHeight);
  if(uv.y<0. || uv.y>1.) return vec4(0.);
  float aspect=virtualWidth/bandHeight;
  vec2 scale=vec2(max(1.,aspect/u_atlasAspect),max(1.,u_atlasAspect/aspect));
  vec2 source=(uv-.5)*scale+.5;
  if(source.x<0. || source.x>1. || source.y<0. || source.y>1.) return vec4(0.);
  float lum=texture2D(u_atlas,source).r;
  float light=min(1.,pow(lum,.52)*1.30);
  vec3 ink=mix(voiceInk(source.x),vec3(1.,.97,.90),smoothstep(.40,.85,lum)*.38);
  return vec4(ink*light,smoothstep(.018,.12,lum));
}
`;
export const backgroundVertex = `
attribute vec2 a_position;
varying vec2 v_uv;
void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}
`;
export const backgroundFragment = field + `
varying vec2 v_uv;
void main(){
  vec2 px=vec2(v_uv.x,1.-v_uv.y)*u_size;
  vec2 uv=vec2(v_uv.x,px.y/u_heroHeight);
  vec3 colour=mix(pigment(photograph(uv)),vec3(.974,.977,.971),.44);
  colour=mix(vec3(17./255.),colour,smoothstep(0.,.58,u_enter));
  float retained=(1.-smoothstep(releaseStart(px)-.025,releaseStart(px)+.025,u_progress))*step(px.y,u_heroHeight);
  vec3 surround=vec3(17./255.);
  gl_FragColor=vec4(mix(surround,colour,retained*photographCoverage(uv)*photoEdge(px)),1.);
}
`;
export const pointVertex = field + `
attribute vec2 a_uv;
varying vec3 v_colour;
varying float v_opacity;
void main(){
  vec2 origin=a_uv*u_size;
  vec2 px=origin;
  float seed=hash(floor(origin/3.8));
  float arrival=smoothstep(0.,1.,clamp(u_enter*1.6-a_uv.x*.38,0.,1.));
  if(u_layer<.5){
    // Hold the source planar. Gravity acts only after its local patch releases.
    float drop=clamp((u_progress-releaseStart(origin))/.24,0.,1.);
    float gravity=drop*drop;
    px.y+=gravity*u_size.y*.82;
    float strand=hash(vec2(floor(origin.x/7.6),9.));
    float sparse=step(.70,strand);
    float retained=1.-smoothstep(.025,.10,drop);
    v_opacity=arrival*step(origin.y,u_heroHeight)*photographCoverage(vec2(a_uv.x,origin.y/u_heroHeight))*(1.-smoothstep(.70,1.,drop))*mix(sparse,1.,retained);
    v_opacity*=photoEdge(origin);
    float landingOffset=u_size.y*.23*(1.-smoothstep(.52,.90,u_progress));
    vec4 landing=portrait(vec2(px.x,px.y-landingOffset));
    float landingReady=smoothstep(.29,.47,u_progress);
    float fallFade=1.-smoothstep(.39,.65,px.y/u_size.y);
    v_opacity*=mix(1.,fallFade*(1.-landing.a*landingReady),smoothstep(.03,.15,drop));
    vec3 studio=pigment(photograph(vec2(a_uv.x,origin.y/u_heroHeight)));
    vec3 ink=voiceInk(a_uv.x)*(.55+.45*seed);
    v_colour=mix(studio,ink,smoothstep(.09,.48,drop));
  }else{
    // A separate destination registration avoids ghosting two photographs together.
    vec4 person=portrait(origin);
    float patch=hash(vec2(floor(origin.x/30.4),floor(origin.y/22.8)));
    float start=.18+.18*(1.-a_uv.y)+patch*.04;
    float assembled=smoothstep(start,start+.10,u_progress);
    float settle=1.-smoothstep(.52,.90,u_progress);
    px.y+=u_size.y*.23*settle;
    // Small vertical registration travel, no lateral wobble or image scaling.
    px.y-=(1.-assembled)*15.;
    v_colour=person.rgb;
    v_opacity=person.a*assembled;
  }
  px.x+=(sin(a_uv.y*10.+a_uv.x*4.-u_time*.32)*.35+sin(a_uv.y*24.+u_time*.23)*.12)*(1.-u_still);
  px.y+=cos(a_uv.x*11.-u_time*.21)*.25*(1.-u_still);
  px+=vec2((seed-.5)*80.,(hash(a_uv.yx)-.5)*55.)*(1.-arrival);
  vec2 delta=origin-u_pointer;
  // A broad, restrained deflection preserves the image and neighbouring dot spacing.
  float force=exp(-pow(length(delta)/135.,2.))*u_pointerStrength*(1.-u_still);
  px+=(delta/135.)*force*6.;
  gl_Position=vec4(px.x/u_size.x*2.-1.,1.-px.y/u_size.y*2.,0.,1.);
  gl_PointSize=mix(1.65,3.05,smoothstep(500.,1100.,u_size.x))*u_dpr;
}
`;
export const pointFragment = `
precision highp float;
varying vec3 v_colour;
varying float v_opacity;
void main(){
  float alpha=(1.-smoothstep(.39,.5,length(gl_PointCoord-.5)))*v_opacity;
  gl_FragColor=vec4(v_colour,alpha);
}
`;
