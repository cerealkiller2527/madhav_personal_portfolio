import type { Bullet, Enemy, Boss } from "./types";

function aabb(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

export function bulletEnemy(bullet: Bullet, enemy: Enemy): boolean {
  return aabb(bullet.x, bullet.y, bullet.width, bullet.height, enemy.x, enemy.y, enemy.width, enemy.height);
}

export function bulletBoss(bullet: Bullet, boss: Boss): boolean {
  return aabb(bullet.x, bullet.y, bullet.width, bullet.height, boss.x, boss.y, boss.width, boss.height);
}
