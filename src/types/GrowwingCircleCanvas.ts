export type CIRCLEVALUES = {
  ctx: CanvasRenderingContext2D;
  isDark: boolean;
  radiusMultiplier: null;
  maxRadiusMultiplier: number;
  timeAtPreviousDraw: null;
  width: number;
  height: number;
};

export type CIRCLEPOSITIONSTATE = {
  x: number;
  y: number;
  resetMouseState: () => void;
};
