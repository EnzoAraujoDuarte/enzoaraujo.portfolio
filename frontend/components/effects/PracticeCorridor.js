import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { ScrollTrigger } from '../../lib/gsap';

const COLS = 14;
const ROWS = 14;
const SPACING = 6.0;
const FOCUS = 2.4;
const PLATE = 4.6;

const vertexShader = `
attribute vec2 aCell;
attribute vec3 aScatter;
attribute float aSpin;
attribute float aDelay;

uniform vec2 uCell;
uniform float uSize;
uniform float uAssemble;

varying vec2 vUv;
varying float vFade;

mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }
mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }

void main() {
  /* aCell is the integer cell index. Multiplying by uCell once maps the quad's
     own 0..1 uv onto this cell's slice of the texture. */
  vUv = (aCell + uv) * uCell;

  /* Cells resolve on staggered clocks, so the plate knits together from its
     edges instead of snapping into place all at once. */
  float t = clamp((uAssemble - aDelay * 0.3) / 0.7, 0.0, 1.0);
  float e = 1.0 - pow(1.0 - t, 3.0);

  vec3 local = rotX(aSpin * (1.0 - e) * 2.2) * rotY(aSpin * (1.0 - e) * 1.6) * position;
  vec3 target = vec3(((aCell + 0.5) * uCell - 0.5) * uSize, 0.0);
  vec3 placed = mix(target + aScatter, target, e);

  vFade = e;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(local + placed, 1.0);
}`;

const fragmentShader = `
uniform sampler2D uTexture;
uniform float uAssemble;
varying vec2 vUv;
varying float vFade;

void main() {
  vec4 color = texture2D(uTexture, vUv);

  /* The plates were lit for print on white. Against ink they need the shadows
     opened up, or the art the whole section is built around never arrives. */
  color.rgb = pow(color.rgb, vec3(0.78)) * 1.28;

  /* Ember rides the seams while the plate is still coming together. */
  color.rgb += vec3(1.0, 0.30, 0.11) * (1.0 - vFade) * 0.22;

  /* Assembled plates hold full weight; the ones still travelling stay quiet
     so only one image is ever the subject. */
  float presence = mix(0.18, 1.0, uAssemble);
  gl_FragColor = vec4(color.rgb, color.a * vFade * presence);
}`;

/**
 * Seven plates standing along one corridor, and a camera that walks it.
 *
 * Each plate is an instanced grid of quads sampling its own texture. A plate
 * arrives scattered, assembles as the camera reaches it and disperses once it
 * is behind — the discipline is something built out of fragments, which is the
 * argument the rest of the page is making in words.
 *
 * One canvas, one draw call per plate. The DOM copy lives outside, so the text
 * stays selectable and legible whatever the GPU is doing.
 */
export default function PracticeCorridor({ images, onBeat }) {
  const containerRef = useRef(null);
  const beatRef = useRef(onBeat);
  const [failed, setFailed] = useState(false);

  // Held in a ref so a parent re-render cannot tear down the whole scene.
  beatRef.current = onBeat;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearAlpha(0);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
    camera.position.set(0, 0, 6);

    // ---- one geometry, shared by every plate --------------------------------
    const cellSize = PLATE / COLS;
    const base = new THREE.PlaneGeometry(cellSize * 0.995, cellSize * 0.995);
    const geometry = new THREE.InstancedBufferGeometry();
    geometry.index = base.index;
    geometry.attributes = base.attributes;
    geometry.instanceCount = COLS * ROWS;

    const cells = new Float32Array(COLS * ROWS * 2);
    const scatter = new Float32Array(COLS * ROWS * 3);
    const spin = new Float32Array(COLS * ROWS);
    const delay = new Float32Array(COLS * ROWS);

    for (let y = 0; y < ROWS; y += 1) {
      for (let x = 0; x < COLS; x += 1) {
        const i = y * COLS + x;
        cells[i * 2] = x;
        cells[i * 2 + 1] = y;

        // Scatter outward from the centre, so the plate reads as blown apart
        // rather than randomly dusted.
        const dx = x / COLS - 0.5;
        const dy = y / ROWS - 0.5;
        const spread = 0.7 + Math.random() * 0.9;
        scatter[i * 3] = dx * spread * 2.2 + (Math.random() - 0.5) * 0.35;
        scatter[i * 3 + 1] = dy * spread * 2.2 + (Math.random() - 0.5) * 0.35;
        scatter[i * 3 + 2] = (Math.random() - 0.5) * 2.6;

        spin[i] = (Math.random() - 0.5) * 2;
        delay[i] = Math.random();
      }
    }

    geometry.setAttribute('aCell', new THREE.InstancedBufferAttribute(cells, 2));
    geometry.setAttribute('aScatter', new THREE.InstancedBufferAttribute(scatter, 3));
    geometry.setAttribute('aSpin', new THREE.InstancedBufferAttribute(spin, 1));
    geometry.setAttribute('aDelay', new THREE.InstancedBufferAttribute(delay, 1));

    // ---- a plate per discipline --------------------------------------------
    const loader = new THREE.TextureLoader();
    const plates = images.map((src, index) => {
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTexture: { value: null },
          uCell: { value: new THREE.Vector2(1 / COLS, 1 / ROWS) },
          uSize: { value: PLATE },
          uAssemble: { value: 0 },
        },
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.frustumCulled = false;
      mesh.position.z = -index * SPACING;
      // A slight alternating offset keeps the corridor from reading as a tunnel
      // of identical squares.
      mesh.position.x = (index % 2 === 0 ? -1 : 1) * 0.55;
      scene.add(mesh);

      loader.load(src, (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        material.uniforms.uTexture.value = texture;
        draw();
      });

      return { mesh, material };
    });

    const draw = () => renderer.render(scene, camera);

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      draw();
    };

    // ---- scroll drives the walk --------------------------------------------
    const travel = (images.length - 1) * SPACING;
    let lastBeat = -1;

    const apply = (progress) => {
      const z = 6 - progress * travel;
      camera.position.z = z;

      plates.forEach(({ mesh, material }, index) => {
        const distance = Math.abs(z - 6 - mesh.position.z);
        material.uniforms.uAssemble.value = 1 - Math.min(distance / FOCUS, 1);
      });

      const beat = Math.round(progress * (images.length - 1));
      if (beat !== lastBeat) {
        lastBeat = beat;
        beatRef.current?.(beat);
      }

      draw();
    };

    // Pinning an element that measures zero locks the page at zero: the pin
    // spacer keeps whatever size it saw. So the trigger is only created once
    // the container actually has a box, and it is rebuilt if that box changes.
    let trigger = null;

    const setup = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height || trigger) return;

      trigger = ScrollTrigger.create({
        trigger: container.closest('[data-corridor-root]') || container,
        start: 'top top',
        end: () => `+=${window.innerHeight * (images.length - 0.2)}`,
        pin: container.closest('[data-corridor-viewport]') || container,
        scrub: 0.8,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => apply(self.progress),
      });

      apply(0);
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (!trigger) setup();
      else ScrollTrigger.refresh();
    });
    resizeObserver.observe(container);

    resize();
    setup();
    draw();

    return () => {
      trigger?.kill();
      resizeObserver.disconnect();
      plates.forEach(({ material }) => {
        material.uniforms.uTexture.value?.dispose();
        material.dispose();
      });
      base.dispose();
      geometry.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [images]);

  if (failed) return null;

  return <div ref={containerRef} aria-hidden="true" className="absolute inset-0" />;
}
