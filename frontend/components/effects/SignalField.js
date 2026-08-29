import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { prefersReducedMotion } from '../../lib/motion';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

/**
 * Noise resolving into signal.
 *
 * The plate is sampled through two offsets: a curl-noise field that carries the
 * turbulence, and a CPU-relaxed flow map that carries pointer velocity. Both
 * are scaled by uniforms GSAP owns, so the shader itself stays stateless —
 * the easing curve can change without touching a line of GLSL.
 */
const fragmentShader = `
uniform sampler2D uTexture;
uniform sampler2D uFlow;
uniform vec2 uCover;
uniform float uTime;
uniform float uTurbulence;
uniform float uAberration;
varying vec2 vUv;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

/* Divergence-free field: the wisps swirl instead of piling up. */
vec2 curl(vec2 p) {
  float e = 0.08;
  float n1 = snoise(vec2(p.x, p.y + e));
  float n2 = snoise(vec2(p.x, p.y - e));
  float n3 = snoise(vec2(p.x + e, p.y));
  float n4 = snoise(vec2(p.x - e, p.y));
  return vec2(n1 - n2, n4 - n3) / (2.0 * e);
}

void main() {
  vec2 uv = (vUv - 0.5) * uCover + 0.5;

  vec2 flow = texture2D(uFlow, vUv).rg;
  vec2 drift = curl(uv * 2.6 + uTime) * 0.006 * uTurbulence;
  vec2 offset = drift + flow * 0.035;

  float mag = length(offset);
  vec2 dir = mag > 0.00001 ? offset / mag : vec2(0.0);
  float split = 0.0035 * uAberration * (0.35 + mag * 26.0);

  vec3 col;
  col.r = texture2D(uTexture, uv + offset + dir * split).r;
  col.g = texture2D(uTexture, uv + offset).g;
  col.b = texture2D(uTexture, uv + offset - dir * split).b;

  /* Ember lives only in the brightest wisps, and only while it is still
     turbulent — order is monochrome. */
  float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col += vec3(1.0, 0.30, 0.11) * pow(luma, 4.0) * uTurbulence * 0.6;

  gl_FragColor = vec4(col, 1.0);
}`;

export default function SignalField({ imageSrc, className = '' }) {
  const containerRef = useRef(null);
  const [isWebGLAvailable, setIsWebGLAvailable] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const reduced = prefersReducedMotion();

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
    } catch {
      setIsWebGLAvailable(false);
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0b0b0c, 1);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    // A clip-space quad fills the frame whatever the container does, so resize
    // never touches the camera or the geometry.
    const camera = new THREE.Camera();

    // Coarser grid on phones: the relaxation loop is O(size²) on the CPU.
    const size = window.innerWidth < 768 ? 12 : 24;
    const data = new Float32Array(4 * size * size);
    const flowTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
    flowTexture.magFilter = THREE.LinearFilter;
    flowTexture.minFilter = THREE.LinearFilter;
    flowTexture.needsUpdate = true;

    const uniforms = {
      uTexture: { value: null },
      uFlow: { value: flowTexture },
      uCover: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uTurbulence: { value: 0.8 },
      uAberration: { value: 1 },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
    const mesh = new THREE.Mesh(geometry, material);
    // The quad is already in clip space, so the camera's frustum test is both
    // meaningless and capable of culling it away entirely.
    mesh.frustumCulled = false;
    scene.add(mesh);

    let imageAspect = 16 / 9;

    const applyCover = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      // Let three write the CSS size too: skipping it leaves the element at the
      // drawing-buffer size, so a DPR of 2 renders the canvas at double scale.
      renderer.setSize(width, height);
      const containerAspect = width / height;
      if (containerAspect > imageAspect) {
        uniforms.uCover.value.set(1, imageAspect / containerAspect);
      } else {
        uniforms.uCover.value.set(containerAspect / imageAspect, 1);
      }
      if (uniforms.uTexture.value) renderer.render(scene, camera);
      wake();
    };

    const loader = new THREE.TextureLoader();
    loader.load(imageSrc, (texture) => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      imageAspect = texture.image.width / texture.image.height;
      uniforms.uTexture.value = texture;
      applyCover();
      // Draw once synchronously. requestAnimationFrame never fires in a hidden
      // document, so without this the plate stays black until the tab is focused.
      renderer.render(scene, camera);
    });

    // ---- pointer velocity -------------------------------------------------
    const pointer = { x: 0.5, y: 0.5, prevX: 0.5, prevY: 0.5, vX: 0, vY: 0, moved: false };

    const onPointerMove = (event) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      pointer.vX = x - pointer.prevX;
      pointer.vY = y - pointer.prevY;
      pointer.x = x;
      pointer.y = y;
      pointer.prevX = x;
      pointer.prevY = y;
      pointer.moved = true;
      wake();
    };

    // ---- loop -------------------------------------------------------------
    let frameId = null;
    let idleFrames = 0;
    let onScreen = true;

    const stop = () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    function wake() {
      if (reduced) {
        if (uniforms.uTexture.value) renderer.render(scene, camera);
        return;
      }
      idleFrames = 0;
      if (frameId === null && onScreen && !document.hidden) {
        frameId = requestAnimationFrame(tick);
      }
    }

    function tick() {
      frameId = requestAnimationFrame(tick);
      uniforms.uTime.value += 0.001;

      let energy = 0;
      for (let i = 0; i < size * size; i += 1) {
        data[i * 4] *= 0.92;
        data[i * 4 + 1] *= 0.92;
        energy += Math.abs(data[i * 4]) + Math.abs(data[i * 4 + 1]);
      }

      if (pointer.moved) {
        const gx = size * pointer.x;
        const gy = size * pointer.y;
        const radius = size * 0.16;
        for (let i = 0; i < size; i += 1) {
          for (let j = 0; j < size; j += 1) {
            const distSq = (gx - i) ** 2 + (gy - j) ** 2;
            if (distSq < radius * radius) {
              const index = 4 * (i + size * j);
              const power = Math.min(radius / Math.sqrt(distSq || 0.0001), 10);
              data[index] += 22 * pointer.vX * power;
              data[index + 1] -= 22 * pointer.vY * power;
            }
          }
        }
        pointer.moved = false;
        pointer.vX = 0;
        pointer.vY = 0;
      }

      flowTexture.needsUpdate = true;
      renderer.render(scene, camera);

      // Nothing left to resolve: park the loop until something asks for it.
      idleFrames = energy < 0.002 ? idleFrames + 1 : 0;
      if (idleFrames > 90) stop();
    }

    // ---- scroll -----------------------------------------------------------
    // The whole choreography is one number. Turbulence and aberration settle
    // across the first viewport: noise on arrival, signal by the time you leave.
    const trigger = reduced
      ? null
      : ScrollTrigger.create({
          trigger: container,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            uniforms.uTurbulence.value = gsap.utils.interpolate(0.8, 0.05, p);
            uniforms.uAberration.value = 1 - p;
            wake();
          },
        });

    const resizeObserver = new ResizeObserver(applyCover);
    resizeObserver.observe(container);

    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) wake();
      else stop();
    });
    visibility.observe(container);

    const onVisibilityChange = () => (document.hidden ? stop() : wake());
    document.addEventListener('visibilitychange', onVisibilityChange);
    if (!reduced) container.addEventListener('pointermove', onPointerMove, { passive: true });

    applyCover();
    wake();


    return () => {
      stop();
      trigger?.kill();
      resizeObserver.disconnect();
      visibility.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      container.removeEventListener('pointermove', onPointerMove);
      geometry.dispose();
      material.dispose();
      flowTexture.dispose();
      uniforms.uTexture.value?.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [imageSrc]);

  if (!isWebGLAvailable) {
    return (
      <div
        aria-hidden="true"
        className={`h-full w-full bg-cover bg-center ${className}`}
        style={{ backgroundImage: `url(${imageSrc})` }}
      />
    );
  }

  return <div ref={containerRef} aria-hidden="true" className={`h-full w-full overflow-hidden ${className}`} />;
}
