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
 * A photograph given one axis of depth.
 *
 * The depth map came out of Depth Anything V2 at the portrait's own resolution,
 * so the two textures align pixel for pixel. There is no time uniform on
 * purpose: this is the still moment of the page, and it should only ever move
 * because the visitor moved.
 */
const fragmentShader = `
uniform sampler2D uTexture;
uniform sampler2D uDepth;
uniform vec2 uMouse;
uniform float uStrength;
varying vec2 vUv;

void main() {
  float depth = texture2D(uDepth, vUv).r;

  /* Centred so the mid-plane stays put and the face and background part
     around it, instead of the whole frame sliding. */
  vec2 offset = uMouse * (depth - 0.5) * 0.018 * uStrength;
  vec4 color = texture2D(uTexture, vUv + offset);

  /* A touch of separation: the nearer the pixel, the less it is dimmed. */
  color.rgb *= mix(0.82, 1.0, depth);

  /* The same grade the rest of the photography carries — pulled toward the
     palette so a colour photo does not sit outside the page. */
  float luma = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
  color.rgb = mix(vec3(luma), color.rgb, 0.72);
  color.rgb = (color.rgb - 0.5) * 1.05 + 0.5;

  gl_FragColor = color;
}`;

export default function DepthPortrait({ imageSrc, depthSrc, className = '' }) {
  const containerRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const reduced = prefersReducedMotion();

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    } catch {
      setFailed(true);
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearAlpha(0);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const uniforms = {
      uTexture: { value: null },
      uDepth: { value: null },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uStrength: { value: reduced ? 0 : 1 },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: true });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    scene.add(mesh);

    const draw = () => renderer.render(scene, camera);

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      if (uniforms.uTexture.value) draw();
    };

    let loaded = 0;
    const loader = new THREE.TextureLoader();
    const load = (src, key) =>
      loader.load(src, (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        uniforms[key].value = texture;
        loaded += 1;
        // Both textures in hand, paint once without waiting for a frame.
        if (loaded === 2) {
          resize();
          draw();
        }
      });

    load(imageSrc, 'uTexture');
    load(depthSrc, 'uDepth');

    // ---- pointer ----------------------------------------------------------
    const target = { x: 0, y: 0 };
    let frameId = null;
    let settled = 0;

    const tick = () => {
      frameId = requestAnimationFrame(tick);
      const m = uniforms.uMouse.value;
      const dx = target.x - m.x;
      const dy = target.y - m.y;
      m.x += dx * 0.06;
      m.y += dy * 0.06;
      draw();

      // Parked once it has caught up with the pointer.
      settled = Math.abs(dx) + Math.abs(dy) < 0.0008 ? settled + 1 : 0;
      if (settled > 20) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    const wake = () => {
      if (reduced || frameId !== null || document.hidden) return;
      settled = 0;
      frameId = requestAnimationFrame(tick);
    };

    const onPointerMove = (event) => {
      const rect = container.getBoundingClientRect();
      target.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      target.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      wake();
    };

    const onPointerLeave = () => {
      target.x = 0;
      target.y = 0;
      wake();
    };

    // ---- entrance ---------------------------------------------------------
    const trigger = reduced
      ? null
      : ScrollTrigger.create({
          trigger: container,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            gsap.fromTo(
              uniforms.uStrength,
              { value: 0 },
              { value: 1, duration: 1.2, ease: 'expo.out', onUpdate: draw }
            );
          },
        });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    if (!reduced) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      container.addEventListener('pointerleave', onPointerLeave, { passive: true });
    }

    resize();

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      trigger?.kill();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      geometry.dispose();
      material.dispose();
      uniforms.uTexture.value?.dispose();
      uniforms.uDepth.value?.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [imageSrc, depthSrc]);

  if (failed) {
    return (
      <img
        src={imageSrc}
        alt=""
        className={`h-full w-full object-cover ${className}`}
        width={760}
        height={760}
      />
    );
  }

  return <div ref={containerRef} className={`h-full w-full ${className}`} />;
}
