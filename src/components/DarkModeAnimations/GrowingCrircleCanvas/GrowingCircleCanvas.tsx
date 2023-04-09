import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import styles from "./GrowingCricleCanvas.module.scss";

type CIRCLEPOSITIONSTATE = {
  x: number;
  y: number;
};

const COLORS = {
  light: "#fff",
  dark: "#191c1a",
  // light: "#ccc",
  // dark: "#000",
};

const GrowingCircleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [shouldDraw, setShouldDraw] = useState(false);
  const [circlePosition, setCirclePosition] = useState<CIRCLEPOSITIONSTATE>({
    x: 0,
    y: 0,
  });
  console.log(theme);
  const draw = (ctx: CanvasRenderingContext2D, radius: number) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    console.log(isDark ? "dark" : "light");
    ctx.fillStyle = isDark ? COLORS.dark : COLORS.light;
    ctx.beginPath();
    ctx.arc(
      circlePosition.x,
      circlePosition.y,
      Math.pow(radius, 2.9),
      0,
      2 * Math.PI
    );
    ctx.fill();
  };

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    const context: CanvasRenderingContext2D = canvas!.getContext("2d")!;

    let radius = 0;
    let animationFrameId: number;

    const { width, height } = context.canvas.getBoundingClientRect();
    // 解像度
    if (context.canvas.width !== width || context.canvas.height !== height) {
      const { devicePixelRatio: originalRatio = 1 } = window;
      const lowerResolutionRatio = originalRatio * 0.5;
      context.canvas.width = width * lowerResolutionRatio;
      context.canvas.height = height * lowerResolutionRatio;
      context.scale(lowerResolutionRatio, lowerResolutionRatio);
    }

    const handleClick = (event: CustomEvent<CIRCLEPOSITIONSTATE>) => {
      setShouldDraw(true);
      circlePosition.x = event.detail.x;
      circlePosition.y = event.detail.y;
    };

    const render = () => {
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const maxRadiusMultiplier = Math.pow(
        Math.max(screenWidth, screenHeight),
        1.1 / 2.9
      );

      radius += 0.15;

      if (radius < maxRadiusMultiplier) {
        draw(context, radius);
        animationFrameId = window.requestAnimationFrame(render);
      }
    };

    if (shouldDraw) {
      render();
    }

    window.addEventListener(
      "darkModeToggle",
      handleClick as EventListenerOrEventListenerObject
    );

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener(
        "darkModeToggle",
        handleClick as EventListenerOrEventListenerObject
      );
    };
  }, [draw]);

  return (
    <>
      <p>{theme}</p>
      <canvas
        className={`${styles.size} 
        `}
        ref={canvasRef}
      />
    </>
  );
};

export default GrowingCircleCanvas;
