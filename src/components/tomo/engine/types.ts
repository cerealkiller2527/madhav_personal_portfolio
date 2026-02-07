export type RgbColor = string;

export interface Vec2 {
  x: number;
  y: number;
}

export interface Player {
  width: number;
  height: number;
  x: number;
  color: RgbColor;
  speed: number;
  fastFire: boolean;
  nuke_available: boolean;
}

export interface Enemy {
  width: number;
  height: number;
  x: number;
  y: number;
  speed: number;
  direction: number;
}

export interface Boss {
  width: number;
  height: number;
  x: number;
  y: number;
  maxHP: number;
  health: number;
  speed: number;
  direction: number;
}

export interface Bullet {
  width: number;
  height: number;
  x: number;
  y: number;
  dy: number;
}

export type DrawFn = (obj: DynamicObject, ctx: CanvasRenderingContext2D) => void;
export type UpdateFn = (obj: DynamicObject) => void;

export interface DynamicObject {
  x: number;
  y: number;
  width?: number;
  height?: number;
  draw: DrawFn;
  update: UpdateFn;
  [key: string]: unknown;
}

export interface WorldState {
  player: Player;
  enemies: Enemy[];
  boss: Boss | null;
  bullets: Bullet[];
  objects: DynamicObject[];
  score: number;
  level: number;
  boss_frequency: number;
  gameOver: boolean;
  dynamic_function: (state: WorldState) => void;
  level_summary: string;
}

export interface Star {
  x: number;
  y: number;
  color: RgbColor;
  radius: number;
}

export type GameState = "menu" | "skin_menu" | "playing" | "game_over";
