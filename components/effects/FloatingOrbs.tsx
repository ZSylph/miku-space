"use client";

import { useEffect, useRef } from "react";

interface Orb {
  x: number;
  y: number;
  size: number; // radius in px
  color: string; // #FFFFFF or #A8E6E1
  baseOpacity: number; // 0.2 - 0.5
  opacityPhase: number; // random start phase for sine wave
  opacitySpeed: number; // cycles per second-ish
  speedX: number; // px per frame at 60fps
  speedY: number; // px per frame at 60fps
  blur: number; // px
}

const ORB_COUNT = 18;

function isDarkMode(): boolean {
  return document.documentElement.classList.contains("dark");
}

function createOrb(canvasWidth: number, canvasHeight: number): Orb {
  const dark = isDarkMode();
  const size = 2 + Math.random() * 6; // 2-8px radius
  const color = Math.random() < 0.5 ? "#FFFFFF" : "#A8E6E1";
  const baseOpacity = 0.2 + Math.random() * 0.3; // 0.2-0.5
  const opacityPhase = Math.random() * Math.PI * 2;
  const opacitySpeed = 0.0008 + Math.random() * 0.0012; // ~0.05-0.11 Hz
  const speedX = (Math.random() - 0.5) * 0.4; // -0.2 to +0.2
  const speedY = (Math.random() - 0.5) * 0.4; // -0.2 to +0.2
  const blur = dark
    ? 4 + Math.random() * 8 // 4-12px
    : 6 + Math.random() * 10; // 6-16px

  return {
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    size,
    color,
    baseOpacity,
    opacityPhase,
    opacitySpeed,
    speedX,
    speedY,
    blur,
  };
}

function initOrbs(count: number, canvasWidth: number, canvasHeight: number): Orb[] {
  const orbs: Orb[] = [];
  for (let i = 0; i < count; i++) {
    orbs.push(createOrb(canvasWidth, canvasHeight));
  }
  return orbs;
}

export default function FloatingOrbs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const orbsRef = useRef<Orb[]>([]);
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

    orbsRef.current = initOrbs(ORB_COUNT, width, height);
    darkModeRef.current = isDarkMode();

    function updateOrb(orb: Orb, deltaTime: number) {
      const timeScale = deltaTime / 16.67; // normalize to ~60fps

      // Slow drift
      orb.x += orb.speedX * timeScale;
      orb.y += orb.speedY * timeScale;

      // Edge wrap
      if (orb.x < -orb.size - orb.blur) {
        orb.x = width + orb.size + orb.blur;
      } else if (orb.x > width + orb.size + orb.blur) {
        orb.x = -orb.size - orb.blur;
      }
      if (orb.y < -orb.size - orb.blur) {
        orb.y = height + orb.size + orb.blur;
      } else if (orb.y > height + orb.size + orb.blur) {
        orb.y = -orb.size - orb.blur;
      }

      // Breathing opacity (sine wave, amplitude ±0.15)
      const now = Date.now();
      const breathe = Math.sin(now * orb.opacitySpeed + orb.opacityPhase);
      const opacity = Math.max(0.05, Math.min(1, orb.baseOpacity + breathe * 0.15));

      // Dark mode blur adjustment
      const dark = isDarkMode();
      if (dark !== darkModeRef.current) {
        darkModeRef.current = dark;
        orb.blur = dark
          ? 4 + Math.random() * 8
          : 6 + Math.random() * 10;
      }

      return opacity;
    }

    function drawOrb(orb: Orb, opacity: number) {
      if (!ctx) return;
      ctx.save();
      ctx.globalAlpha = opacity;

      // Create radial gradient for soft glow
      const gradient = ctx.createRadialGradient(
        orb.x, orb.y, 0,
        orb.x, orb.y, orb.size + orb.blur
      );
      gradient.addColorStop(0, orb.color);
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.size + orb.blur, 0, Math.PI * 2);
      ctx.fill();

      // Core bright spot
      ctx.fillStyle = orb.color;
      ctx.globalAlpha = opacity * 0.8;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.size * 0.5, 0, Math.PI * 2);
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

      for (const orb of orbsRef.current) {
        const opacity = updateOrb(orb, clampedDelta);
        drawOrb(orb, opacity);
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    function handleResize() {
      resize();
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
      // Dark mode change will be picked up in next updateOrb call
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
        zIndex: 1,
      }}
      aria-hidden="true"
    />
  );
}
