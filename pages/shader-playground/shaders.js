
let mandelbrotFrag = `#ifdef GL_ES
precision mediump float;
#endif

#define M_PI 3.1415926535897932384626433832795

varying vec2 vTexCoord;

// load images and videos and reference to them using tex0, tex1 etc.
uniform sampler2D tex0;
uniform sampler2D tex1;
// mouse position
uniform vec2 mouse;
// previous mouse position
uniform vec2 pmouse;
// screen resolution
uniform vec2 resolution;
// elapsed time
uniform float time;
// is mouse pressed?
uniform bool mouseIsPressed; 


const int MAX_ITERATION = 256;
const float ZOOM_RADIUS = 0.1;
const float ZOOM_BORDER = 0.005;
float ZOOM_Y = 0.15;
const float ZOOM_VALUE = 1.0 / 5.0;

// fancy palette function
vec3 palette(float t){
    if(t == 1.0)
        t = 0.0;
    float r = t;
    float g = t*t;
    float b = sqrt(t);
    return vec3(r, g, b);
}

vec3 border_palette(float t){
    float val = t + time;
    float b = abs(sin(val));
    float g = abs(cos(val));
    float r = b*g*2.0;
    return vec3(r, g, b);
}

void main() {
    vec2 uv = vTexCoord;
	vec2 m = mouse;
    
	float ratio;
    // correct aspect ratio
    if(resolution.x > resolution.y){
    	ratio = resolution.x / resolution.y;
    	uv.x *= ratio;
        m.x *= ratio;
    } else {
        ratio = resolution.y / resolution.x;
    	uv.y *= ratio;
        m.y *= ratio;
    }
    
    if(m.y - ZOOM_Y - ZOOM_RADIUS < 0.0)
        ZOOM_Y *= -1.0;
    
    
    float center_y = mouseIsPressed ? 0.0 : ZOOM_Y;
    float radius = mouseIsPressed ? 0.5 : ZOOM_RADIUS;
    float zoom = mouseIsPressed ? ZOOM_VALUE / 5.0 : ZOOM_VALUE;
    float d = distance(mouseIsPressed ? vec2(0.5) : vec2(m.x, m.y - center_y), uv);
    
    vec2 offset_x = vec2(-2.0, 0.5);
    vec2 offset_y = vec2(-1.2, 1.2);
    
    if(d < radius){
        uv.y += center_y; 
        if(mouseIsPressed){
        	uv.x = m.x - (0.5 - uv.x) * zoom;
        	uv.y = m.y - (0.5 - uv.y) * zoom;
        } else {
        	uv.x = m.x - (m.x - uv.x) * zoom;
        	uv.y = m.y - (m.y - uv.y) * zoom;
        }
        if(d > radius - ZOOM_BORDER){
        	float angle = atan(uv.y - m.y, uv.x - m.x);
            gl_FragColor = vec4(border_palette(angle), 1.0);
            return;
        }
    }
    
	float x0 = mix(offset_x.x, offset_x.y,  uv.x);
	float y0 = mix(offset_y.x, offset_y.y, uv.y);
    
    float x = 0.0;
    float y = 0.0;
    float x2 = 0.0;
    float y2 = 0.0;
    float w = 0.0;
    int iteration = 0;
    
   	for(int i = 0; i < MAX_ITERATION; i++){
        y = 2.0 * x * y + y0;
        x = x2 - y2 + x0;
        x2 = x * x;
        y2 = y * y;
        if(x2 + y2 > 4.0)
            break;
    	iteration++;
    }
    
    float val = float(iteration) / float(MAX_ITERATION);
    vec3 col = palette(val);
    
    gl_FragColor = vec4(col, 1.0);
}`

let gradientFrag = `#ifdef GL_ES
precision mediump float;
#endif

#define M_PI 3.1415926535897932384626433832795

varying vec2 vTexCoord;

// load images and videos and reference to them using tex0, tex1 etc.
uniform sampler2D tex0;
uniform sampler2D tex1;
// mouse position
uniform vec2 mouse;
// previous mouse position
uniform vec2 pmouse;
// screen resolution
uniform vec2 resolution;
// elapsed time
uniform float time;

void main() {
    vec2 uv = vTexCoord;
    vec3 col = vec3(uv.x, uv.y, 0.0);
    gl_FragColor = vec4(col, 1.0);
}`

let gearFrag = `#ifdef GL_ES
precision mediump float;
#endif

#define M_PI 3.1415926535897932384626433832795

varying vec2 vTexCoord;

// load images and videos and reference to them using tex0, tex1 etc.
uniform sampler2D tex0;
uniform sampler2D tex1;
// mouse position
uniform vec2 mouse;
// previous mouse position
uniform vec2 pmouse;
// screen resolution
uniform vec2 resolution;
// elapsed time
uniform float time;

const float CREST_SIZE = 0.01;
const float BIG_RADIUS = 0.2;
const float SMALL_RADIUS = 0.075;
const float BORDER_EPS = 0.005;

void main() {
    vec2 uv = vTexCoord;
	vec2 m = mouse;
    
	float ratio;
    // correct aspect ratio
    if(resolution.x > resolution.y){
    	ratio = resolution.x / resolution.y;
    	uv.x *= ratio;
        m.x *= ratio;
    } else {
        ratio = resolution.y / resolution.x;
    	uv.y *= ratio;
        m.y *= ratio;
    }
    
    vec3 col = vec3(0.0);
    
    if(uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0){
    	gl_FragColor = vec4(vec3(0.8), 1.0);
        return;
    }
    
    vec2 center = m;
    if(m.x < 0.0 || m.y < 0.0 || m.x > 1.0 || m.y > 1.0){
    	center = vec2(0.5);
    }
    
    float d = distance(uv, center);
    float alpha = atan(uv.y - center.y, uv.x - center.x);
    float crest = sin(time*8.0 + alpha*25.0)*CREST_SIZE;
    if(d < BIG_RADIUS + crest){
        col = vec3(0.25);
    	if(d > BIG_RADIUS + crest - BORDER_EPS){
            col = vec3(0.8);
        }
    }
    
   	if(d < SMALL_RADIUS){
    	col = vec3(0.0);
        if(d > SMALL_RADIUS - BORDER_EPS)
            col = vec3(0.8);
    }
    
    
    gl_FragColor = vec4(col, 1.0);
}`

let flagFrag = `#ifdef GL_ES
precision mediump float;
#endif

#define M_PI 3.1415926535897932384626433832795

varying vec2 vTexCoord;

// load images and videos and reference to them using tex0, tex1 etc.
uniform sampler2D tex0;
uniform sampler2D tex1;
// mouse position
uniform vec2 mouse;
// previous mouse position
uniform vec2 pmouse;
// screen resolution
uniform vec2 resolution;
// elapsed time
uniform float time;

const vec3 BACKGROUND = vec3(0.0);
const vec3 GREEN = vec3(0.0, 0.47, 0.17);
const vec3 WHITE = vec3(1.0);
const vec3 RED = vec3(0.86, 0.0, 0.11);
const vec2 FLAG_SIZE = vec2(0.9, 0.6);

void main() {
    vec2 uv = vTexCoord;
    vec3 col = BACKGROUND;
    
    if(resolution.x > resolution.y)
        uv.x *= resolution.x / resolution.y;
    else
        uv.y *= resolution.y / resolution.x;
    
    uv.x += sin(time + uv.y*10.0)*0.05;
    uv.y += sin(time + uv.x*10.0)*0.05;
    
    if(uv.x < FLAG_SIZE.x * 1.0 / 3.0)
        col = GREEN;
    else if(uv.x < FLAG_SIZE.x * 2.0 / 3.0)
        col = WHITE;
    else
        col = RED;
    
    col *= max(0.5, sin(time + uv.x*10.0 + uv.y*10.0));
    
    if(uv.x > FLAG_SIZE.x || uv.y > FLAG_SIZE.y)
        col = BACKGROUND;
    
    gl_FragColor = vec4(col, 1.0);
}`

let voronoiFrag = `#ifdef GL_ES
precision mediump float;
#endif

#define M_PI 3.1415926535897932384626433832795

varying vec2 vTexCoord;

// load images and videos and reference to them using tex0, tex1 etc.
uniform sampler2D tex0;
uniform sampler2D tex1;
// mouse position
uniform vec2 mouse;
// previous mouse position
uniform vec2 pmouse;
// screen resolution
uniform vec2 resolution;
// elapsed time
uniform float time;

// change the number of points (high values make your pc crash)
// there is one extra point that is your mouse position
const int N_POINTS = 32;
// set the luminosity
const float LUMA = 6.5;
// change the seed for different image
int seed = 1;

float random(){
	const int a = 1664525;
    const int c = 1013904223;
    const float m = pow(2.0, 32.0);
    seed = a * seed + c;
	return mod(float(seed), m) / m;
}

void main() {
    vec2 uv = vTexCoord;
    vec2 points[N_POINTS+1];
    
    for(int i = 0; i < N_POINTS; i++)
        points[i] = vec2(random(), random());
    
    points[N_POINTS] = mouse;
    
    float val = 9999.999;
    for(int i = 0; i < N_POINTS+1; i++){
        float d =  distance(uv, points[i]);
        if(d < val)
            val = d;
    }
    
    vec3 col = vec3(val * LUMA);
    
    gl_FragColor = vec4(col, 1.0);
}`

let customFrag = `// THIS SHADER WILL BE AUTOMATICALLY BE SAVED ON YOUR LOCAL STORAGE
#ifdef GL_ES
precision mediump float;
#endif

#define M_PI 3.1415926535897932384626433832795

varying vec2 vTexCoord;

// load images and videos and reference to them using tex0, tex1 etc.
uniform sampler2D tex0;
uniform sampler2D tex1;
// mouse position
uniform vec2 mouse;
// previous mouse position
uniform vec2 pmouse;
// screen resolution
uniform vec2 resolution;
// elapsed time
uniform float time;
// is mouse pressed?
uniform bool mouseIsPressed;

void main() {
    vec2 uv = vTexCoord;
    vec3 col = vec3(uv.x, uv.y, 0.0);
    gl_FragColor = vec4(col, 1.0);
}`