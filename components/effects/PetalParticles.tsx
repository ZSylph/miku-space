"use client";

import { useEffect, useRef } from "react";

interface Petal {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
  swayAmplitude: number;
  swayFrequency: number;
  swayPhase: number;
  rotation: number;
  rotationSpeed: number;
}

function getPetalCount(): number {
  const width = window.innerWidth;
  if (width >= 1024) return 45;
  if (width >= 768) return 30;
  return 15;
}

function isDarkMode(): boolean {
  return document.documentElement.classList.contains("dark");
}

function createPetal(canvasWidth: number, canvasHeight: number): Petal {
  const dark = isDarkMode();
  const isPink = Math.random() < 0.6;
  const color = isPink ? "#F5C6D0" : "#A8E6E1";
  const size = 6 + Math.random() * 8; // 6-14px
  const speed = 0.5 + Math.random() * 1.0; // 0.5-1.5px per frame at 60fps baseline
  const opacity = dark
    ? 0.3 + Math.random() * 0.4 // 0.3-0.7
    : 0.15 + Math.random() * 0.25; // 0.15-0.4

  return {
    x: Math.random() * canvasWidth,
    y: -size - Math.random() * canvasHeight,
    size,
    speed,
    opacity,
    color,
    swayAmplitude: 20 + Math.random() * 20, // 20-40px
    swayFrequency: 0.001 + Math.random() * 0.002, // random frequency
    swayPhase: Math.random() * Math.PI * 2,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.02,
  };
}

function initPetals(count: number, canvasWidth: number, canvasHeight: number): Petal[] {
  const petals: Petal[] = [];
  for (let i = 0; i < count; i++) {
    const petal = createPetal(canvasWidth, canvasHeight);
    // Distribute vertically so they don't all start at top
    petal.y = Math.random() * canvasHeight;
    petals.push(petal);
  }
  return petals;
}

export default function PetalParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const petalsRef = useRef<Petal[]>([]);
  const lastTimeRef = useRef<number>(0);
  const darkModeRef = useRef<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prefersReducedMotion.matches) {
      return;
    }

    let dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    function resize() {
      if (!canvas || !ctx) return;
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();

    const targetCount = getPetalCount();
    petalsRef.current = initPetals(targetCount, width, height);
    darkModeRef.current = isDarkMode();

    function updatePetal(petal: Petal, deltaTime: number) {
      const timeScale = deltaTime / 16.67; // normalize to ~60fps

      petal.y += petal.speed * timeScale;
      petal.rotation += petal.rotationSpeed * timeScale;

      const sway = Math.sin(Date.now() * petal.swayFrequency + petal.swayPhase) * petal.swayAmplitude;
      const swayedX = petal.x + sway;

      // Check dark mode changes and update opacity range accordingly
      const dark = isDarkMode();
      if (dark !== darkModeRef.current) {
        darkModeRef.current = dark;
        // Re-roll opacity within new range to maintain visual consistency
        petal.opacity = dark
          ? 0.3 + Math.random() * 0.4
          : 0.15 + Math.random() * 0.25;
      }

      // Reset when petal goes below canvas
      if (petal.y > height + petal.size) {
        const newPetal = createPetal(width, height);
        petal.x = newPetal.x;
        petal.y = -petal.size;
        petal.size = newPetal.size;
        petal.speed = newPetal.speed;
        petal.opacity = newPetal.opacity;
        petal.color = newPetal.color;
        petal.swayAmplitude = newPetal.swayAmplitude;
        petal.swayFrequency = newPetal.swayFrequency;
        petal.swayPhase = newPetal.swayPhase;
        petal.rotation = newPetal.rotation;
        petal.rotationSpeed = newPetal.rotationSpeed;
      }

      return { x: swayedX, y: petal.y };
    }

    function drawPetal(petal: Petal, x: number, y: number) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(petal.rotation);
      ctx.globalAlpha = petal.opacity;
      ctx.fillStyle = petal.color;

      // Draw simplified ellipse (2:1 aspect ratio)
      const rx = petal.size;
      const ry = petal.size * 0.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    function animate(timestamp: number) {
      if (document.hidden) {
        lastTimeRef.current = timestamp;
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Cap delta time to avoid huge jumps after tab switch
      const clampedDelta = Math.min(deltaTime, 100);

      ctx?.clearRect(0, 0, width, height);

      for (const petal of petalsRef.current) {
        const pos = updatePetal(petal, clampedDelta);
        drawPetal(petal, pos.x, pos.y);
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    function handleResize() {
      resize();
      const newCount = getPetalCount();
      const currentCount = petalsRef.current.length;
      if (newCount > currentCount) {
        const additional = initPetals(newCount - currentCount, width, height);
        petalsRef.current.push(...additional);
      } else if (newCount < currentCount) {
        petalsRef.current = petalsRef.current.slice(0, newCount);
      }
    }

    function handleVisibilityChange() {
      if (!document.hidden) {
        lastTimeRef.current = 0;
      }
    }

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Listen for dark mode changes via class on html element
    const darkModeObserver = new MutationObserver(() => {
      // Dark mode change will be picked up in next updatePetal call
    });
    darkModeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      darkModeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
