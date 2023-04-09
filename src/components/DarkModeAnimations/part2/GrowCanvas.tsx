import {
  CIRCLEPOSITIONSTATE,
  CIRCLEVALUES,
} from "@/types/GrowwingCircleCanvas";
import { useEffect, useRef } from "react";
import styles from "./GrowCanvas.module.scss";

const COLORS = {
  light: "#fff",
  dark: "#778899",
  //   dark: "#191c1a",
};

const RADIUS_GROWTH_PER_MS = 0.025;
const GROWTH_FUNCTION_EXPONENTIAL = 2.9;
const PIXEL_SCALING_FACTOR = 0.5;

const circlePositionCoordinates: CIRCLEPOSITIONSTATE = {
  x: 0,
  y: 0,

  resetMouseState: () => {
    circlePositionCoordinates.x = 0;
    circlePositionCoordinates.y = 0;
  },
};

// ↓GrowingCircle "m"achine method
const m = {
  ctx: null as unknown as CanvasRenderingContext2D,
  isDark: new Boolean(),
  radiusMultiplier: 0,
  maxRadiusMultiplier: 0,
  timeAtPreviousDraw: 0,
  width: 0,
  height: 0,

  createMachine: (ctx: CanvasRenderingContext2D, isDark: boolean) => {
    m.ctx = ctx;
    m.isDark = isDark;
    m.width = Math.max(window.screen.width, window.innerWidth);
    m.height = Math.max(window.screen.height, window.innerHeight);
    m.maxRadiusMultiplier =
      Math.max(m.width, m.height) ** (1.0 / GROWTH_FUNCTION_EXPONENTIAL);
    m.timeAtPreviousDraw = Date.now();

    const { width, height } = m.ctx.canvas.getBoundingClientRect();
    if (m.ctx.canvas.width !== width || m.ctx.canvas.height !== height) {
      const { devicePixelRatio: originalRatio = 1 } = window;
      const lowerResolutionRatio = originalRatio * PIXEL_SCALING_FACTOR;
      m.ctx.canvas.width = width * lowerResolutionRatio;
      m.ctx.canvas.height = height * lowerResolutionRatio;
      m.ctx.scale(lowerResolutionRatio, lowerResolutionRatio);
    }

    return m.start;
  },

  start: () => {
    // return m.isDark ? m.shrinkCircle : m.growCircle;
    return m.shrinkCircle;
  },

  growCircle: () => {
    m.radiusMultiplier = m.radiusMultiplier +=
      RADIUS_GROWTH_PER_MS * Math.max(1, Date.now() - m.timeAtPreviousDraw);
    return m.verifyCircleBounds;
  },

  shrinkCircle: () => {
    m.radiusMultiplier = m.radiusMultiplier -=
      RADIUS_GROWTH_PER_MS * Math.max(1, Date.now() - m.timeAtPreviousDraw);
    return m.verifyCircleBounds;
  },

  verifyCircleBounds: () => {
    console.log("first");
    if (
      (m.radiusMultiplier <= 0 && m.isDark) ||
      (m.radiusMultiplier >= m.maxRadiusMultiplier && !m.isDark)
    ) {
      m.ctx.fillStyle = m.isDark ? COLORS.dark : COLORS.light;
      m.ctx.fillRect(0, 0, m.width, m.height);
      m.radiusMultiplier = m.isDark ? 0 : m.maxRadiusMultiplier;
      return null;
    }
    m.ctx.clearRect(0, 0, m.width, m.height);
    return m.drawCircle;
  },

  drawCircle: () => {
    m.ctx.fillStyle = COLORS.light;
    m.ctx.beginPath();
    m.ctx.arc(
      circlePositionCoordinates.x,
      circlePositionCoordinates.y,
      m.radiusMultiplier ** GROWTH_FUNCTION_EXPONENTIAL,
      0,
      2 * Math.PI
    );
    m.ctx.fill();
    m.timeAtPreviousDraw = Date.now();

    return new Promise((rtn) => {
      const returnAfterAnimating = () => {
        rtn(m.start);
      };
      window.requestAnimationFrame(returnAfterAnimating);
    });
  },
};

const GrowCanvas = ({ isDark }: { isDark: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    const ctx: CanvasRenderingContext2D = canvas!.getContext("2d")!;

    let stateMachine: any = m.createMachine(ctx, isDark);
    let isStateMachinePowered = true;

    const stateMachineRunner = () => {
      if (stateMachine !== null && isStateMachinePowered) {
        if (stateMachine instanceof Function) {
          stateMachine = stateMachine();
          stateMachineRunner();
        } else {
          stateMachine.then((val: any) => {
            stateMachine = val();
            stateMachineRunner();
          });
        }
      }
    };

    stateMachineRunner();

    const handleClick = (event: CustomEvent<CIRCLEPOSITIONSTATE>) => {
      circlePositionCoordinates.x = event.detail.x;
      circlePositionCoordinates.y = event.detail.y;
    };
    window.addEventListener(
      "darkModeToggle",
      handleClick as EventListenerOrEventListenerObject
    );

    return () => {
      window.removeEventListener(
        "darkModeToggle",
        handleClick as EventListenerOrEventListenerObject
      );
    };
  }, [isDark]);

  return <canvas className={styles.size} ref={canvasRef} />;
};

export default GrowCanvas;
