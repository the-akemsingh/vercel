"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Crystal = { x: number; y: number; z: number; rotation: number; speed: number; scale: number };

function createParticleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) return null;

  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
  gradient.addColorStop(0.28, "rgba(255, 255, 255, 0.42)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function CrystallineHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const field = new THREE.Group();
    scene.add(field);
    const geometry = new THREE.ConeGeometry(0.1, 0.42, 5, 1);
    const material = new THREE.MeshStandardMaterial({
      color: "#22c55e",
      roughness: 0.42,
      metalness: 0.35,
      flatShading: true,
      transparent: true,
      opacity: 0.8,
    });
    const crystalCount = 90;
    const crystals = new THREE.InstancedMesh(geometry, material, crystalCount);
    const crystalsData: Crystal[] = [];
    const matrix = new THREE.Matrix4();
    const rotation = new THREE.Euler();
    const position = new THREE.Vector3();
    const scale = new THREE.Vector3();

    for (let index = 0; index < crystalCount; index += 1) {
      const crystal = {
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 5.2,
        z: (Math.random() - 0.5) * 3 - 1.2,
        rotation: Math.random() * Math.PI,
        speed: 0.16 + Math.random() * 0.2,
        scale: 0.6 + Math.random() * 1.4,
      };
      crystalsData.push(crystal);
      position.set(crystal.x, crystal.y, crystal.z);
      rotation.set(Math.random(), crystal.rotation, Math.random());
      scale.setScalar(crystal.scale);
      matrix.compose(position, new THREE.Quaternion().setFromEuler(rotation), scale);
      crystals.setMatrixAt(index, matrix);
    }
    crystals.instanceMatrix.needsUpdate = true;
    field.add(crystals);

    const particleTexture = createParticleTexture();
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(160 * 3);
    for (let index = 0; index < particlePositions.length; index += 3) {
      particlePositions[index] = (Math.random() - 0.5) * 8;
      particlePositions[index + 1] = (Math.random() - 0.5) * 5;
      particlePositions[index + 2] = (Math.random() - 0.5) * 2;
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: "#bbf7d0",
      size: 0.13,
      map: particleTexture ?? undefined,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    field.add(particles);

    scene.add(new THREE.AmbientLight("#ffffff", 1.3));
    const keyLight = new THREE.DirectionalLight("#ffffff", 2.3);
    keyLight.position.set(1.5, 2.5, 5);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight("#22c55e", 7, 8);
    rimLight.position.set(-2.5, -1.5, 2);
    scene.add(rimLight);

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let frameId = 0;
    let isInView = true;

    const applyThemeColors = () => {
      const styles = getComputedStyle(document.documentElement);
      scene.background = null;
      material.color.set(styles.getPropertyValue("--color-accent").trim());
      particleMaterial.color.set(styles.getPropertyValue("--color-accent-soft").trim());
      rimLight.color.set(styles.getPropertyValue("--color-accent").trim());
    };

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.targetX = event.clientX / window.innerWidth - 0.5;
      pointer.targetY = event.clientY / window.innerHeight - 0.5;
    };

    const render = (time: number) => {
      if (!isInView) {
        frameId = requestAnimationFrame(render);
        return;
      }

      pointer.x += (pointer.targetX - pointer.x) * 0.035;
      pointer.y += (pointer.targetY - pointer.y) * 0.035;
      field.rotation.x = pointer.y * 0.24;
      field.rotation.y = pointer.x * 0.34;

      if (!prefersReducedMotion.matches) {
        const elapsed = time * 0.001;
        crystalsData.forEach((crystal, index) => {
          position.set(crystal.x, crystal.y + Math.sin(elapsed * crystal.speed + index) * 0.06, crystal.z);
          rotation.set(index * 0.18, crystal.rotation + elapsed * crystal.speed, 0.3);
          scale.setScalar(crystal.scale);
          matrix.compose(position, new THREE.Quaternion().setFromEuler(rotation), scale);
          crystals.setMatrixAt(index, matrix);
        });
        crystals.instanceMatrix.needsUpdate = true;
        particles.rotation.z = elapsed * 0.018;
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    };

    const viewObserver = new IntersectionObserver(([entry]) => {
      isInView = entry.isIntersecting;
    });
    const themeObserver = new MutationObserver(applyThemeColors);

    resize();
    applyThemeColors();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    viewObserver.observe(canvas);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      viewObserver.disconnect();
      themeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      particleTexture?.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="crystalline-hero" aria-hidden="true" />;
}
