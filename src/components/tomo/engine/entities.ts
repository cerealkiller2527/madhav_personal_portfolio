import {
  SCREEN_WIDTH,
  COLORS,
  ENEMIES_PER_ROW,
  ENEMY_ROWS,
  ENEMY_GRID_OFFSET,
  ENEMY_GRID_START,
} from "./constants";
import type { Player, Enemy, Boss, Bullet, DynamicObject, DrawFn, UpdateFn } from "./types";

export function createPlayer(color: string = COLORS.GREEN): Player {
  return {
    width: 50,
    height: 50,
    x: Math.floor(SCREEN_WIDTH / 2 - 25),
    color,
    speed: 12,
    fastFire: false,
    nuke_available: true,
  };
}

export function createEnemy(x: number, y: number): Enemy {
  return {
    width: 55,
    height: 40,
    x,
    y,
    speed: 1,
    direction: 1,
  };
}

export function createInitialEnemies(): Enemy[] {
  const enemies: Enemy[] = [];
  for (let x = 0; x < ENEMIES_PER_ROW; x++) {
    for (let y = 0; y < ENEMY_ROWS; y++) {
      enemies.push(createEnemy(x * ENEMY_GRID_OFFSET + ENEMY_GRID_START, y * ENEMY_GRID_OFFSET + ENEMY_GRID_START));
    }
  }
  return enemies;
}

export function createBoss(x: number, y: number): Boss {
  return {
    width: 200,
    height: 60,
    x,
    y,
    maxHP: 30,
    health: 30,
    speed: 2,
    direction: 1,
  };
}

export function createBullet(x: number, y: number, dy: number): Bullet {
  return {
    width: 5,
    height: 10,
    x,
    y,
    dy,
  };
}

export function createDynamicObject(
  x: number,
  y: number,
  draw: DrawFn,
  update: UpdateFn,
  extra: Record<string, unknown> = {}
): DynamicObject {
  return {
    x,
    y,
    draw,
    update,
    ...extra,
  };
}
