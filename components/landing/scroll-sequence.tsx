"use client";

import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 151;

function getFrameUrl(index: number): string {
  const pad = String(index + 1).padStart(3, "0");
  return `/sequence/ezgif-frame-${pad}.jpg`;
}

export function ScrollSequence() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const currentFrameRef = useRef<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let isDisposed = false;

    // Helper to render a specific frame
    const renderFrame = (index: number) => {
      const img = imagesRef.current[index];
      if (!img || !img.complete || !canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const imgWidth = img.naturalWidth || displayWidth;
      const imgHeight = img.naturalHeight || displayHeight;

      // Cover math
      const canvasRatio = displayWidth / displayHeight;
      const imgRatio = imgWidth / imgHeight;

      let drawWidth = displayWidth;
      let drawHeight = displayHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawWidth = displayWidth;
        drawHeight = displayWidth / imgRatio;
        offsetY = (displayHeight - drawHeight) / 2;
      } else {
        drawHeight = displayHeight;
        drawWidth = displayHeight * imgRatio;
        offsetX = (displayWidth - drawWidth) / 2;
      }

      ctx.clearRect(0, 0, displayWidth, displayHeight);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      ctx.restore();
    };

    // Calculate frame from scroll position
    const updateScrollProgress = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      const targetFrame = Math.min(
        Math.floor(progress * TOTAL_FRAMES),
        TOTAL_FRAMES - 1
      );

      if (targetFrame !== currentFrameRef.current) {
        currentFrameRef.current = targetFrame;
        // If the targeted frame is loaded, render it; otherwise render the closest loaded frame
        if (imagesRef.current[targetFrame]?.complete) {
          renderFrame(targetFrame);
        } else {
          // Find closest loaded frame
          for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
            const before = targetFrame - offset;
            const after = targetFrame + offset;
            if (before >= 0 && imagesRef.current[before]?.complete) {
              renderFrame(before);
              break;
            }
            if (after < TOTAL_FRAMES && imagesRef.current[after]?.complete) {
              renderFrame(after);
              break;
            }
          }
        }
      }
    };

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(updateScrollProgress);
    };

    const handleResize = () => {
      renderFrame(currentFrameRef.current);
    };

    // 1. Load the first frame immediately
    const firstImg = new Image();
    firstImg.src = getFrameUrl(0);
    firstImg.onload = () => {
      if (isDisposed) return;
      imagesRef.current[0] = firstImg;
      setIsLoaded(true);
      renderFrame(0);
    };

    // 2. Load remaining frames progressively
    const preloadImages = () => {
      // Prioritize keyframes first (every 5th frame), then all remaining
      const keyframeIndices: number[] = [];
      const restIndices: number[] = [];

      for (let i = 1; i < TOTAL_FRAMES; i++) {
        if (i % 5 === 0) {
          keyframeIndices.push(i);
        } else {
          restIndices.push(i);
        }
      }

      const queue = [...keyframeIndices, ...restIndices];

      const loadNextBatch = (batchSize: number) => {
        if (isDisposed || queue.length === 0) return;
        const currentBatch = queue.splice(0, batchSize);

        currentBatch.forEach((idx) => {
          const img = new Image();
          img.src = getFrameUrl(idx);
          img.onload = () => {
            if (isDisposed) return;
            imagesRef.current[idx] = img;
            // If user is currently sitting on this frame, render it now
            if (currentFrameRef.current === idx) {
              renderFrame(idx);
            }
          };
        });

        if (queue.length > 0) {
          if ("requestIdleCallback" in window) {
            (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(() =>
              loadNextBatch(batchSize)
            );
          } else {
            setTimeout(() => loadNextBatch(batchSize), 16);
          }
        }
      };

      loadNextBatch(10);
    };

    preloadImages();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className={`h-full w-full object-cover transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Subtle ambient gradient overlay for optimal text contrast and high-end depth */}
      <div className="absolute inset-0 bg-navy-950/20 backdrop-brightness-[0.97]" />
    </div>
  );
}
