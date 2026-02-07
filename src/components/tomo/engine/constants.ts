export const SCREEN_WIDTH = 1000;
export const SCREEN_HEIGHT = 700;
export const PLAYER_HEIGHT = SCREEN_HEIGHT - 150;

export const BAR_WIDTH = SCREEN_WIDTH - 40;
export const BAR_HEIGHT = 15;
export const BAR_X = 20;
export const BAR_Y = SCREEN_HEIGHT - 5;

export const COLORS = {
  WHITE: "rgb(255, 255, 255)",
  BLACK: "rgb(0, 0, 0)",
  GREEN: "rgb(0, 255, 0)",
  RED: "rgb(255, 0, 0)",
  PURPLE: "rgb(200, 0, 255)",
  ORANGE: "rgb(255, 200, 0)",
  BLUE: "rgb(0, 0, 255)",
  TEAL: "rgb(0, 255, 255)",
} as const;

export const PLAYER_SKINS = [
  COLORS.GREEN,
  COLORS.BLUE,
  COLORS.ORANGE,
  COLORS.TEAL,
] as const;

export const FPS = 60;
export const BOSS_FREQUENCY = 2;
export const ENEMIES_PER_ROW = 8;
export const ENEMY_ROWS = 3;
export const ENEMY_GRID_OFFSET = 60;
export const ENEMY_GRID_START = 50;
