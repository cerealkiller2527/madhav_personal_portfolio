"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Game } from "./engine/game";
import { onKeyDown, onKeyUp } from "./engine/input";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "./engine/constants";

export function TomoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);
  const rafRef = useRef<number>(0);
  const [started, setStarted] = useState(false);
  const [focused, setFocused] = useState(true);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    onKeyDown(e.nativeEvent);
  }, []);

  const handleKeyUp = useCallback((e: React.KeyboardEvent) => {
    onKeyUp(e.nativeEvent);
  }, []);

  useEffect(() => {
    if (!started || !focused || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    if (!gameRef.current) {
      const game = new Game();
      gameRef.current = game;
      game.setCanvas(ctx);
      game.start();
    }

    let running = true;
    function loop() {
      if (!running || !gameRef.current) return;
      const result = gameRef.current.tick();
      if (result === "stopped") {
        running = false;
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [started, focused]);

  useEffect(() => {
    return () => {
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    const handleBlur = () => setFocused(false);
    const handleFocus = () => setFocused(true);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const handlePlayClick = () => {
    setStarted(true);
    containerRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      className="relative w-full max-w-[1000px] rounded-lg border border-border bg-black overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <canvas
        ref={canvasRef}
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
        className="block w-full h-auto"
        style={{ aspectRatio: `${SCREEN_WIDTH} / ${SCREEN_HEIGHT}` }}
      />
      {!started && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 rounded-lg cursor-pointer"
          onClick={handlePlayClick}
          onKeyDown={(e) => e.key === "Enter" && handlePlayClick()}
          role="button"
          tabIndex={0}
          aria-label="Click to play Tomo"
        >
          <p className="text-white font-medium text-lg">Click to Play</p>
          <p className="text-muted-foreground text-sm">Arrow keys to move · Space to shoot</p>
        </div>
      )}
      {started && !focused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg pointer-events-none">
          <p className="text-white text-sm">Tab back to focus and play</p>
        </div>
      )}
    </div>
  );
}
