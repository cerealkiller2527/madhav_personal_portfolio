import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  PLAYER_HEIGHT,
  COLORS,
} from "./constants";
import { createDynamicObject } from "./entities";
import type { WorldState, Enemy, DynamicObject } from "./types";

/* ── Helpers ─────────────────────────────────────────────── */

function aabb(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ── Mechanic building blocks ────────────────────────────── */

function powerUp(state: WorldState, chance = 3): void {
  if (Math.floor(Math.random() * 1001) >= chance) return;
  const x = Math.floor(Math.random() * (SCREEN_WIDTH - 20));
  const speed = 1.5 + Math.random() * 2;
  const draw = (obj: DynamicObject, ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = COLORS.BLUE;
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.WHITE;
    ctx.font = "12px NothingFont";
    ctx.fillText("F", obj.x - 4, obj.y + 4);
  };
  const update = (obj: DynamicObject) => {
    obj.y += speed;
    if (obj.y > SCREEN_HEIGHT) { state.objects = state.objects.filter((o) => o !== obj); return; }
    if (aabb(state.player.x, PLAYER_HEIGHT, state.player.width, state.player.height, obj.x - 10, obj.y - 10, 20, 20)) {
      state.player.fastFire = true;
      state.objects = state.objects.filter((o) => o !== obj);
    }
  };
  state.objects.push(createDynamicObject(x, 0, draw, update));
}

function meteorShower(state: WorldState, chance = 3): void {
  if (Math.floor(Math.random() * 100) >= chance) return;
  const x = 20 + Math.floor(Math.random() * (SCREEN_WIDTH - 70));
  const speed = 2 + Math.random() * 3;
  const draw = (obj: DynamicObject, ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "rgb(150, 75, 0)";
    ctx.beginPath();
    ctx.ellipse(obj.x + 15, obj.y + 7.5, 15, 7.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.RED;
    ctx.beginPath();
    ctx.ellipse(obj.x + 15, obj.y + 7.5, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  };
  const update = (obj: DynamicObject) => {
    obj.y += speed;
    if (obj.y > SCREEN_HEIGHT) { state.objects = state.objects.filter((o) => o !== obj); return; }
    if (aabb(state.player.x, PLAYER_HEIGHT, state.player.width, state.player.height, obj.x, obj.y, 30, 15)) {
      state.player.x = Math.floor(SCREEN_WIDTH / 2 - state.player.width / 2);
      state.score -= 50;
      state.objects = state.objects.filter((o) => o !== obj);
    }
  };
  state.objects.push(createDynamicObject(x, 0, draw, update));
}

function gravityWell(state: WorldState): void {
  if (Math.floor(Math.random() * 2001) >= 2) return;
  const x = 100 + Math.floor(Math.random() * (SCREEN_WIDTH - 200));
  const y = 100 + Math.floor(Math.random() * (SCREEN_HEIGHT - 300));
  let pulse = 0;
  const draw = (obj: DynamicObject, ctx: CanvasRenderingContext2D) => {
    pulse += 0.05;
    const r = 15 + Math.sin(pulse) * 3;
    ctx.fillStyle = "rgb(150, 0, 255)";
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(150, 0, 255, 0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, r + 30, 0, Math.PI * 2);
    ctx.stroke();
  };
  const update = (obj: DynamicObject) => {
    for (const bullet of state.bullets) {
      const dx = obj.x - bullet.x;
      const dy = obj.y - bullet.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        const force = 500 / (dist * dist);
        const angle = Math.atan2(dy, dx);
        bullet.x += Math.cos(angle) * force;
        bullet.y += Math.sin(angle) * force;
      }
    }
    const o = obj as { timer?: number };
    if (o.timer !== undefined) { o.timer -= 1; if (o.timer <= 0) state.objects = state.objects.filter((x) => x !== obj); }
  };
  state.objects.push(createDynamicObject(x, y, draw, update, { timer: 600 }));
}

function homingMissile(state: WorldState): void {
  if (Math.floor(Math.random() * 1201) >= 2) return;
  const spd = 5;
  const x = state.player.x + Math.floor(state.player.width / 2);
  const y = PLAYER_HEIGHT;
  let trail = 0;
  const draw = (obj: DynamicObject, ctx: CanvasRenderingContext2D) => {
    trail += 0.2;
    ctx.fillStyle = COLORS.RED;
    ctx.beginPath();
    ctx.moveTo(obj.x, obj.y);
    ctx.lineTo(obj.x - 5, obj.y + 15);
    ctx.lineTo(obj.x + 5, obj.y + 15);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = `rgba(255,100,0,${0.3 + Math.sin(trail) * 0.2})`;
    ctx.beginPath();
    ctx.arc(obj.x, obj.y + 18, 4, 0, Math.PI * 2);
    ctx.fill();
  };
  const update = (obj: DynamicObject) => {
    if (state.enemies.length > 0) {
      let nearest: Enemy = state.enemies[0];
      let nd = Math.hypot(nearest.x + nearest.width / 2 - obj.x, nearest.y + nearest.height / 2 - obj.y);
      for (let i = 1; i < state.enemies.length; i++) {
        const e = state.enemies[i];
        const d = Math.hypot(e.x + e.width / 2 - obj.x, e.y + e.height / 2 - obj.y);
        if (d < nd) { nearest = e; nd = d; }
      }
      const dx = nearest.x + nearest.width / 2 - obj.x;
      const dy = nearest.y + nearest.height / 2 - obj.y;
      if (nd > 0) { obj.x += (spd * dx) / nd; obj.y += (spd * dy) / nd; }
      if (aabb(obj.x - 5, obj.y, 10, 15, nearest.x, nearest.y, nearest.width, nearest.height)) {
        state.enemies = state.enemies.filter((e) => e !== nearest);
        state.score += 20;
        state.objects = state.objects.filter((o) => o !== obj);
        return;
      }
    }
    if (obj.y < 0) state.objects = state.objects.filter((o) => o !== obj);
  };
  state.objects.push(createDynamicObject(x, y, draw, update));
}

function movingObstacle(state: WorldState): void {
  if (Math.floor(Math.random() * 1201) >= 2) return;
  const x = 20 + Math.floor(Math.random() * (SCREEN_WIDTH - 90));
  const y = PLAYER_HEIGHT - (100 + Math.floor(Math.random() * 100));
  const spd = Math.random() < 0.5 ? -2.5 : 2.5;
  const draw = (obj: DynamicObject, ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "rgb(100,100,100)";
    ctx.fillRect(obj.x, obj.y, 50, 10);
    ctx.fillStyle = "rgb(80,80,80)";
    ctx.fillRect(obj.x + 5, obj.y + 2, 40, 6);
  };
  const update = (obj: DynamicObject) => {
    const ext = obj as unknown as { speed: number };
    obj.x += ext.speed;
    if (obj.x < 20 || obj.x + 50 > SCREEN_WIDTH - 20) { ext.speed = -ext.speed; obj.x += ext.speed; }
    state.bullets = state.bullets.filter((b) => !aabb(b.x, b.y, b.width, b.height, obj.x, obj.y, 50, 10));
    const o = obj as { timer?: number };
    if (o.timer !== undefined) { o.timer -= 1; if (o.timer <= 0) state.objects = state.objects.filter((x) => x !== obj); }
  };
  const o = createDynamicObject(x, y, draw, update, { speed: spd, timer: 600 });
  o.width = 50; o.height = 10;
  state.objects.push(o);
}

function fogOfWar(state: WorldState): void {
  if (Math.floor(Math.random() * 1201) >= 2) return;
  const intensity = [120, 160, 200][Math.floor(Math.random() * 3)];
  const draw = (_obj: DynamicObject, ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.globalAlpha = intensity / 255;
    ctx.fillStyle = "rgb(20,10,30)";
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    const px = state.player.x + state.player.width / 2;
    const py = PLAYER_HEIGHT + state.player.height / 2;
    const grad = ctx.createRadialGradient(px, py, 30, px, py, 200);
    grad.addColorStop(0, "rgba(0,0,0,1)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    ctx.restore();
  };
  const update = (obj: DynamicObject) => {
    const o = obj as { timer?: number };
    if (o.timer !== undefined) { o.timer -= 1; if (o.timer <= 0) state.objects = state.objects.filter((x) => x !== obj); }
  };
  state.objects.push(createDynamicObject(0, 0, draw, update, { timer: 400 }));
}

function blackHole(state: WorldState): void {
  if (Math.floor(Math.random() * 2001) >= 2) return;
  const x = 100 + Math.floor(Math.random() * (SCREEN_WIDTH - 200));
  const y = 100 + Math.floor(Math.random() * (SCREEN_HEIGHT - 300));
  let spin = 0;
  const draw = (obj: DynamicObject, ctx: CanvasRenderingContext2D) => {
    spin += 0.08;
    ctx.save();
    ctx.translate(obj.x, obj.y);
    ctx.rotate(spin);
    const g = ctx.createRadialGradient(0, 0, 2, 0, 0, 25);
    g.addColorStop(0, "rgb(40,0,60)");
    g.addColorStop(0.6, "rgb(10,0,20)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(150,0,255,0.4)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(0, 0, 10 + i * 8, spin + i * 2, spin + i * 2 + Math.PI); ctx.stroke(); }
    ctx.restore();
  };
  const update = (obj: DynamicObject) => {
    for (const enemy of state.enemies) {
      const dx = obj.x - enemy.x; const dy = obj.y - enemy.y; const d = Math.hypot(dx, dy);
      if (d < 200) { const f = Math.min(5, 1500 / (d * d)); const a = Math.atan2(dy, dx); enemy.x += Math.cos(a) * f; enemy.y += Math.sin(a) * f; }
    }
    for (const b of state.bullets) {
      const dx = obj.x - b.x; const dy = obj.y - b.y; const d = Math.hypot(dx, dy);
      if (d < 200) { const f = 1500 / (d * d); const a = Math.atan2(dy, dx); b.x += Math.cos(a) * f; b.y += Math.sin(a) * f; }
    }
    const o = obj as { timer?: number };
    if (o.timer !== undefined) { o.timer -= 1; if (o.timer <= 0) state.objects = state.objects.filter((x) => x !== obj); }
  };
  state.objects.push(createDynamicObject(x, y, draw, update, { timer: 800 }));
}

function enemyBomber(state: WorldState): void {
  if (Math.floor(Math.random() * 201) >= 2) return;
  if (state.enemies.length === 0) return;
  const e = state.enemies[Math.floor(Math.random() * state.enemies.length)];
  const bx = e.x + e.width / 2;
  const by = e.y + e.height;
  const speed = 3 + Math.random() * 2;
  const draw = (obj: DynamicObject, ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = COLORS.RED;
    ctx.fillRect(obj.x - 2, obj.y, 4, 8);
    ctx.fillStyle = COLORS.ORANGE;
    ctx.fillRect(obj.x - 1, obj.y - 3, 2, 3);
  };
  const update = (obj: DynamicObject) => {
    obj.y += speed;
    if (obj.y > SCREEN_HEIGHT) { state.objects = state.objects.filter((o) => o !== obj); return; }
    if (aabb(state.player.x, PLAYER_HEIGHT, state.player.width, state.player.height, obj.x - 2, obj.y, 4, 8)) {
      state.score -= 30;
      state.player.x = Math.floor(SCREEN_WIDTH / 2 - state.player.width / 2);
      state.objects = state.objects.filter((o) => o !== obj);
    }
  };
  state.objects.push(createDynamicObject(bx, by, draw, update));
}

function scorePickup(state: WorldState): void {
  if (Math.floor(Math.random() * 801) >= 2) return;
  const x = Math.floor(Math.random() * (SCREEN_WIDTH - 20));
  const speed = 1 + Math.random() * 1.5;
  let sparkle = 0;
  const draw = (obj: DynamicObject, ctx: CanvasRenderingContext2D) => {
    sparkle += 0.1;
    ctx.fillStyle = `rgba(255,200,0,${0.6 + Math.sin(sparkle) * 0.4})`;
    ctx.beginPath();
    const cx = obj.x; const cy = obj.y;
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const r = i % 2 === 0 ? 8 : 4;
      const method = i === 0 ? "moveTo" : "lineTo";
      ctx[method](cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    }
    ctx.closePath();
    ctx.fill();
  };
  const update = (obj: DynamicObject) => {
    obj.y += speed;
    if (obj.y > SCREEN_HEIGHT) { state.objects = state.objects.filter((o) => o !== obj); return; }
    if (aabb(state.player.x, PLAYER_HEIGHT, state.player.width, state.player.height, obj.x - 8, obj.y - 8, 16, 16)) {
      state.score += 50;
      state.objects = state.objects.filter((o) => o !== obj);
    }
  };
  state.objects.push(createDynamicObject(x, 0, draw, update));
}

function minefield(state: WorldState): void {
  if (Math.floor(Math.random() * 3001) >= 2) return;
  const x = 40 + Math.floor(Math.random() * (SCREEN_WIDTH - 80));
  const y = 80 + Math.floor(Math.random() * (PLAYER_HEIGHT - 200));
  let blink = 0;
  const draw = (obj: DynamicObject, ctx: CanvasRenderingContext2D) => {
    blink += 0.06;
    ctx.fillStyle = `rgba(255,50,50,${0.5 + Math.sin(blink) * 0.3})`;
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = COLORS.RED;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, 12, 0, Math.PI * 2);
    ctx.stroke();
  };
  const update = (obj: DynamicObject) => {
    for (let i = state.bullets.length - 1; i >= 0; i--) {
      const b = state.bullets[i];
      if (Math.hypot(b.x - obj.x, b.y - obj.y) < 14) {
        state.bullets.splice(i, 1);
        state.objects = state.objects.filter((o) => o !== obj);
        return;
      }
    }
    if (aabb(state.player.x, PLAYER_HEIGHT, state.player.width, state.player.height, obj.x - 12, obj.y - 12, 24, 24)) {
      state.score -= 40;
      state.player.x = Math.floor(SCREEN_WIDTH / 2 - state.player.width / 2);
      state.objects = state.objects.filter((o) => o !== obj);
    }
    const o = obj as { timer?: number };
    if (o.timer !== undefined) { o.timer -= 1; if (o.timer <= 0) state.objects = state.objects.filter((x) => x !== obj); }
  };
  state.objects.push(createDynamicObject(x, y, draw, update, { timer: 900 }));
}

function laserSweep(state: WorldState): void {
  if (Math.floor(Math.random() * 2001) >= 2) return;
  const startY = 60;
  const speed = 0.8;
  let alpha = 0;
  const draw = (obj: DynamicObject, ctx: CanvasRenderingContext2D) => {
    alpha += 0.1;
    ctx.fillStyle = `rgba(255,0,0,${0.15 + Math.sin(alpha) * 0.1})`;
    ctx.fillRect(0, obj.y - 15, SCREEN_WIDTH, 30);
    ctx.fillStyle = `rgba(255,100,100,${0.6 + Math.sin(alpha) * 0.3})`;
    ctx.fillRect(0, obj.y - 1, SCREEN_WIDTH, 2);
  };
  const update = (obj: DynamicObject) => {
    obj.y += speed;
    if (obj.y > PLAYER_HEIGHT + 50) { state.objects = state.objects.filter((o) => o !== obj); return; }
    state.bullets = state.bullets.filter((b) => Math.abs(b.y - obj.y) > 16);
  };
  state.objects.push(createDynamicObject(0, startY, draw, update));
}

function acidRain(state: WorldState): void {
  if (Math.floor(Math.random() * 120) >= 2) return;
  const x = Math.floor(Math.random() * SCREEN_WIDTH);
  const speed = 3 + Math.random() * 3;
  const draw = (obj: DynamicObject, ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "rgb(50,220,50)";
    ctx.fillRect(obj.x, obj.y, 3, 10);
    ctx.fillStyle = "rgb(30,180,30)";
    ctx.fillRect(obj.x, obj.y + 10, 3, 5);
  };
  const update = (obj: DynamicObject) => {
    obj.y += speed;
    if (obj.y > SCREEN_HEIGHT) { state.objects = state.objects.filter((o) => o !== obj); return; }
    if (aabb(state.player.x, PLAYER_HEIGHT, state.player.width, state.player.height, obj.x, obj.y, 3, 15)) {
      state.score -= 20;
      state.objects = state.objects.filter((o) => o !== obj);
    }
  };
  state.objects.push(createDynamicObject(x, -10, draw, update));
}

function turretAlly(state: WorldState): void {
  if (Math.floor(Math.random() * 3001) >= 2) return;
  const x = 50 + Math.floor(Math.random() * (SCREEN_WIDTH - 100));
  const y = PLAYER_HEIGHT + 30;
  let cooldown = 0;
  const draw = (obj: DynamicObject, ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = COLORS.TEAL;
    ctx.fillRect(obj.x - 8, obj.y, 16, 12);
    ctx.fillStyle = COLORS.WHITE;
    ctx.fillRect(obj.x - 2, obj.y - 8, 4, 8);
  };
  const update = (obj: DynamicObject) => {
    cooldown++;
    if (cooldown >= 40) {
      cooldown = 0;
      state.bullets.push({ width: 3, height: 8, x: obj.x, y: obj.y - 10, dy: -8 });
    }
    const o = obj as { timer?: number };
    if (o.timer !== undefined) { o.timer -= 1; if (o.timer <= 0) state.objects = state.objects.filter((x) => x !== obj); }
  };
  state.objects.push(createDynamicObject(x, y, draw, update, { timer: 600 }));
}

function solarFlare(state: WorldState): void {
  if (Math.floor(Math.random() * 3001) >= 2) return;
  let frame = 0;
  const draw = (_obj: DynamicObject, ctx: CanvasRenderingContext2D) => {
    frame++;
    if (frame < 30) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, 0.8 - frame / 30);
      ctx.fillStyle = "rgb(255,255,200)";
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      ctx.restore();
    }
  };
  const update = (obj: DynamicObject) => {
    const o = obj as { timer?: number };
    if (o.timer !== undefined) { o.timer -= 1; if (o.timer <= 0) state.objects = state.objects.filter((x) => x !== obj); }
  };
  state.objects.push(createDynamicObject(0, 0, draw, update, { timer: 60 }));
}

function warpPortal(state: WorldState): void {
  if (Math.floor(Math.random() * 3001) >= 2) return;
  const x1 = 80 + Math.floor(Math.random() * 300);
  const y1 = 100 + Math.floor(Math.random() * 200);
  const x2 = SCREEN_WIDTH - 80 - Math.floor(Math.random() * 300);
  const y2 = 100 + Math.floor(Math.random() * 200);
  let spin = 0;
  const draw = (_obj: DynamicObject, ctx: CanvasRenderingContext2D) => {
    spin += 0.05;
    for (const [px, py] of [[x1, y1], [x2, y2]]) {
      ctx.strokeStyle = COLORS.TEAL;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, py, 18 + Math.sin(spin) * 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(0,255,255,0.3)";
      ctx.beginPath();
      ctx.arc(px, py, 25, spin, spin + Math.PI * 1.5);
      ctx.stroke();
    }
  };
  const update = (obj: DynamicObject) => {
    for (const b of state.bullets) {
      if (Math.hypot(b.x - x1, b.y - y1) < 20) { b.x = x2; b.y = y2; }
      else if (Math.hypot(b.x - x2, b.y - y2) < 20) { b.x = x1; b.y = y1; }
    }
    const o = obj as { timer?: number };
    if (o.timer !== undefined) { o.timer -= 1; if (o.timer <= 0) state.objects = state.objects.filter((x) => x !== obj); }
  };
  state.objects.push(createDynamicObject(0, 0, draw, update, { timer: 800 }));
}

function magneticField(state: WorldState): void {
  if (Math.floor(Math.random() * 60) >= 2) return;
  const px = state.player.x + state.player.width / 2;
  for (const obj of state.objects) {
    const dx = px - obj.x;
    const dist = Math.abs(dx);
    if (dist < 300 && dist > 10) {
      obj.x += (dx / dist) * 0.5;
    }
  }
}

/* ── Level themes ────────────────────────────────────────── */

export interface LevelTheme {
  name: string;
  summary: string;
  mechanic: (state: WorldState) => void;
}

const ALL_THEMES: LevelTheme[] = [
  { name: "Supply Drop", summary: "Blue orbs grant rapid fire!", mechanic: (s) => { powerUp(s, 5); } },
  { name: "Meteor Storm", summary: "Dodge the falling meteors!", mechanic: (s) => { meteorShower(s, 4); } },
  { name: "Gravity Field", summary: "Gravity wells bend your bullets!", mechanic: (s) => { gravityWell(s); } },
  { name: "Guided Strike", summary: "Homing missiles seek enemies!", mechanic: (s) => { homingMissile(s); } },
  { name: "Barricade Run", summary: "Barriers block your shots!", mechanic: (s) => { movingObstacle(s); } },
  { name: "Dark Sector", summary: "Fog limits your vision!", mechanic: (s) => { fogOfWar(s); } },
  { name: "Event Horizon", summary: "Black holes warp everything!", mechanic: (s) => { blackHole(s); } },
  { name: "Return Fire", summary: "Enemies shoot back at you!", mechanic: (s) => { enemyBomber(s); } },
  { name: "Star Harvest", summary: "Collect stars for bonus points!", mechanic: (s) => { scorePickup(s); } },
  { name: "Minefield", summary: "Mines litter the battlefield!", mechanic: (s) => { minefield(s); } },
  { name: "Laser Alley", summary: "Laser beams destroy your bullets!", mechanic: (s) => { laserSweep(s); } },
  { name: "Acid Storm", summary: "Green acid rains from above!", mechanic: (s) => { acidRain(s); } },
  { name: "Turret Defense", summary: "Auto-turrets help you fight!", mechanic: (s) => { turretAlly(s); } },
  { name: "Solar Flare", summary: "Blinding flashes obscure the field!", mechanic: (s) => { solarFlare(s); } },
  { name: "Warp Zone", summary: "Portals teleport your bullets!", mechanic: (s) => { warpPortal(s); } },
  { name: "Danger Zone", summary: "Meteors + enemy fire! Stay sharp!", mechanic: (s) => { meteorShower(s, 3); enemyBomber(s); } },
  { name: "Warp Space", summary: "Gravity + black holes bend reality!", mechanic: (s) => { gravityWell(s); blackHole(s); } },
  { name: "Armed & Loaded", summary: "Missiles + power-ups! Go wild!", mechanic: (s) => { homingMissile(s); powerUp(s, 6); } },
  { name: "Obstacle Course", summary: "Barriers + meteors! Navigate carefully!", mechanic: (s) => { movingObstacle(s); meteorShower(s, 2); } },
  { name: "Blind Combat", summary: "Fog + return fire! Listen closely!", mechanic: (s) => { fogOfWar(s); enemyBomber(s); } },
  { name: "Magnetic Storm", summary: "Magnetic fields pull pickups to you!", mechanic: (s) => { scorePickup(s); magneticField(s); powerUp(s, 4); } },
  { name: "Minefield Fog", summary: "Mines in the dark! Tread carefully!", mechanic: (s) => { fogOfWar(s); minefield(s); } },
  { name: "Laser Defense", summary: "Turrets help but lasers destroy bullets!", mechanic: (s) => { turretAlly(s); laserSweep(s); } },
  { name: "Acid & Fire", summary: "Acid rain + enemy bombs! Pure chaos!", mechanic: (s) => { acidRain(s); enemyBomber(s); } },
  { name: "Full Arsenal", summary: "All weapons online! Missiles + turrets + power-ups!", mechanic: (s) => { homingMissile(s); turretAlly(s); powerUp(s, 5); } },
  { name: "Gravity Gauntlet", summary: "Gravity + barriers + meteors!", mechanic: (s) => { gravityWell(s); movingObstacle(s); meteorShower(s, 2); } },
  { name: "Stellar Chaos", summary: "Black holes + acid + flares!", mechanic: (s) => { blackHole(s); acidRain(s); solarFlare(s); } },
  { name: "Warp Assault", summary: "Portals + enemy fire + meteors!", mechanic: (s) => { warpPortal(s); enemyBomber(s); meteorShower(s, 2); } },
  { name: "Total Darkness", summary: "Fog + mines + acid! Survive the void!", mechanic: (s) => { fogOfWar(s); minefield(s); acidRain(s); } },
  { name: "Omega Storm", summary: "Everything at once! Good luck!", mechanic: (s) => { meteorShower(s, 3); enemyBomber(s); blackHole(s); powerUp(s, 4); } },
];

/* ── Level deck (shuffled, never repeats in a session) ──── */

export class LevelDeck {
  private themes: LevelTheme[];
  private index = 0;

  constructor() {
    this.themes = shuffle([...ALL_THEMES]);
  }

  next(): LevelTheme {
    if (this.index >= this.themes.length) {
      this.themes = shuffle([...ALL_THEMES]);
      this.index = 0;
    }
    return this.themes[this.index++];
  }

  peek(): LevelTheme | null {
    if (this.index >= this.themes.length) return null;
    return this.themes[this.index];
  }

  reset(): void {
    this.themes = shuffle([...ALL_THEMES]);
    this.index = 0;
  }
}

/* ── Tutorial mechanic (level 1 only, fixed) ─────────────── */

const TUTORIAL_THEME: LevelTheme = {
  name: "Tutorial",
  summary: "Arrows move, Space shoots. Destroy all enemies!",
  mechanic: () => {},
};

export function getTutorialTheme(): LevelTheme {
  return TUTORIAL_THEME;
}
