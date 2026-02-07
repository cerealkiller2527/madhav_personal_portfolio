import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  PLAYER_HEIGHT,
  BAR_WIDTH,
  BAR_HEIGHT,
  BAR_X,
  BAR_Y,
  COLORS,
  PLAYER_SKINS,
} from "./constants";
import type { Player, Enemy, Boss, Bullet, DynamicObject, Star, WorldState } from "./types";

const FONT_NAME = "NothingFont";

function rect(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number): void {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

export function drawPlayer(ctx: CanvasRenderingContext2D, player: Player): void {
  const { x, width, height, color } = player;
  const py = PLAYER_HEIGHT;
  rect(ctx, color, x, py, width, height);
  rect(ctx, COLORS.BLACK, x + 5, py + height - 5, 40, 10);
  rect(ctx, COLORS.BLACK, x + 10, py + height - 10, 30, 10);
  rect(ctx, COLORS.BLACK, x, py, 5, height - 10);
  rect(ctx, COLORS.BLACK, x + 5, py, 5, height - 15);
  rect(ctx, COLORS.BLACK, x + 10, py, 5, height - 30);
  rect(ctx, COLORS.BLACK, x + 15, py, 5, height - 40);
  rect(ctx, COLORS.BLACK, x + width - 5, py, 5, height - 10);
  rect(ctx, COLORS.BLACK, x + width - 10, py, 5, height - 15);
  rect(ctx, COLORS.BLACK, x + width - 15, py, 5, height - 30);
  rect(ctx, COLORS.BLACK, x + width - 20, py, 5, height - 40);
  rect(ctx, COLORS.BLACK, x + 20, py + 10, 10, 10);
}

export function drawEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy): void {
  const { x, y, width, height } = enemy;
  rect(ctx, COLORS.PURPLE, x, y, width, height);
  rect(ctx, COLORS.BLACK, x + 15, y + height - 5, 25, 5);
  rect(ctx, COLORS.BLACK, x + 20, y + height - 10, 15, 5);
  rect(ctx, COLORS.BLACK, x + 10, y + height - 15, 35, 5);
  rect(ctx, COLORS.BLACK, x + 20, y + height - 20, 15, 5);
  rect(ctx, COLORS.BLACK, x, y + height - 5, 5, 5);
  rect(ctx, COLORS.BLACK, x + 5, y + height - 10, 10, 5);
  rect(ctx, COLORS.BLACK, x, y + height - 20, 5, 10);
  rect(ctx, COLORS.BLACK, x, y, 5, 5);
  rect(ctx, COLORS.BLACK, x + 10, y + 5, 7.5, 7.5);
  rect(ctx, COLORS.BLACK, x + width - 5, y + height - 5, 5, 5);
  rect(ctx, COLORS.BLACK, x + width - 15, y + height - 10, 10, 5);
  rect(ctx, COLORS.BLACK, x + width - 5, y + height - 20, 5, 10);
  rect(ctx, COLORS.BLACK, x + width - 5, y, 5, 5);
  rect(ctx, COLORS.BLACK, x + width - 17.5, y + 5, 7.5, 7.5);
}

export function drawBoss(ctx: CanvasRenderingContext2D, boss: Boss): void {
  const { x, y, width } = boss;
  rect(ctx, COLORS.PURPLE, x, y, width, boss.height);
  rect(ctx, COLORS.BLACK, x, y, 50, 5);
  rect(ctx, COLORS.BLACK, x, y, 40, 10);
  rect(ctx, COLORS.BLACK, x, y + 10, 25, 10);
  rect(ctx, COLORS.BLACK, x, y + 20, 10, 10);
  rect(ctx, COLORS.BLACK, x, y + 40, 10, 10);
  rect(ctx, COLORS.BLACK, x, y + 50, 20, 10);
  rect(ctx, COLORS.BLACK, x + 30, y + 50, 40, 10);
  rect(ctx, COLORS.BLACK, x + 40, y + 45, 20, 10);
  rect(ctx, COLORS.BLACK, x + 30, y + 55, 50, 5);
  rect(ctx, COLORS.BLACK, x + 50, y + 20, 15, 15);
  rect(ctx, COLORS.BLACK, x + 92.5, y + 20, 15, 15);
  rect(ctx, COLORS.BLACK, x + width - 50, y, 50, 5);
  rect(ctx, COLORS.BLACK, x + width - 40, y, 40, 10);
  rect(ctx, COLORS.BLACK, x + width - 25, y + 10, 25, 10);
  rect(ctx, COLORS.BLACK, x + width - 10, y + 20, 10, 10);
  rect(ctx, COLORS.BLACK, x + width - 10, y + 40, 10, 10);
  rect(ctx, COLORS.BLACK, x + width - 20, y + 50, 20, 10);
  rect(ctx, COLORS.BLACK, x + width - 70, y + 50, 40, 10);
  rect(ctx, COLORS.BLACK, x + width - 60, y + 45, 20, 10);
  rect(ctx, COLORS.BLACK, x + width - 80, y + 55, 30, 5);
  rect(ctx, COLORS.BLACK, x + width - 65, y + 20, 15, 15);
}

export function drawBullet(ctx: CanvasRenderingContext2D, bullet: Bullet): void {
  rect(ctx, COLORS.WHITE, bullet.x, bullet.y, bullet.width, bullet.height);
  rect(ctx, COLORS.ORANGE, bullet.x - 1.5, bullet.y - 6.5, 8, 6.5);
  rect(ctx, COLORS.RED, bullet.x + 1.5, bullet.y + bullet.height, 2, 10);
}

export function drawStars(ctx: CanvasRenderingContext2D, stars: Star[]): void {
  for (const { x, y, color, radius } of stars) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawEnemyBar(ctx: CanvasRenderingContext2D, total: number, remaining: number): void {
  const fillRatio = total > 0 ? remaining / total : 0;
  const filledWidth = Math.floor(BAR_WIDTH * fillRatio);
  rect(ctx, COLORS.RED, BAR_X, BAR_Y, BAR_WIDTH, BAR_HEIGHT);
  rect(ctx, COLORS.GREEN, BAR_X, BAR_Y, filledWidth, BAR_HEIGHT);
}

export function drawScore(ctx: CanvasRenderingContext2D, score: number): void {
  ctx.font = `36px ${FONT_NAME}`;
  ctx.fillStyle = COLORS.WHITE;
  ctx.fillText(`Score: ${score}`, 10, 10 + 36);
}

export function drawLevelSummary(ctx: CanvasRenderingContext2D, summary: string): void {
  const maxWidth = SCREEN_WIDTH - 40;
  const lineHeight = 24;
  ctx.font = `24px ${FONT_NAME}`;
  const words = summary.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? current + " " + word : word;
    const m = ctx.measureText(test);
    if (m.width < maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  let y = SCREEN_HEIGHT - 60 - (lines.length - 1) * lineHeight;
  for (const line of lines) {
    const tw = ctx.measureText(line).width;
    ctx.fillStyle = COLORS.WHITE;
    ctx.fillText(line, (SCREEN_WIDTH - tw) / 2, y + lineHeight);
    y += lineHeight;
  }
}

export function drawObjects(ctx: CanvasRenderingContext2D, objects: DynamicObject[]): void {
  for (const obj of objects) {
    try {
      obj.draw(obj, ctx);
    } catch {
      // skip
    }
  }
}

export function drawAllEntities(state: WorldState, ctx: CanvasRenderingContext2D): void {
  drawPlayer(ctx, state.player);
  if (state.boss) {
    drawBoss(ctx, state.boss);
  } else {
    for (const enemy of state.enemies) {
      drawEnemy(ctx, enemy);
    }
  }
  for (const bullet of state.bullets) {
    drawBullet(ctx, bullet);
  }
}

export function drawMenu(ctx: CanvasRenderingContext2D, selectedOption: number): void {
  ctx.fillStyle = COLORS.BLACK;
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  const options = ["Start Game", "Choose Color", "Quit"];
  ctx.font = `48px ${FONT_NAME}`;
  for (let i = 0; i < options.length; i++) {
    ctx.fillStyle = i === selectedOption ? COLORS.GREEN : COLORS.WHITE;
    const tw = ctx.measureText(options[i]).width;
    ctx.fillText(options[i], (SCREEN_WIDTH - tw) / 2, SCREEN_HEIGHT / 2 + i * 50 + 48 / 2);
  }
}

export function drawSkinMenu(ctx: CanvasRenderingContext2D, selectedSkin: number): void {
  ctx.fillStyle = COLORS.BLACK;
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  ctx.font = `48px ${FONT_NAME}`;
  for (let i = 0; i < PLAYER_SKINS.length; i++) {
    const label = `StarShip ${i + 1}`;
    ctx.fillStyle = PLAYER_SKINS[i];
    const tw = ctx.measureText(label).width;
    const x = (SCREEN_WIDTH - tw) / 2;
    const y = SCREEN_HEIGHT / 2 + i * 50 + 48 / 2;
    ctx.fillText(label, x, y);
    if (i === selectedSkin) {
      ctx.strokeStyle = COLORS.WHITE;
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 10, y - 48, tw + 20, 48 + 10);
    }
  }
}

export function drawGameOver(ctx: CanvasRenderingContext2D, score: number): void {
  ctx.font = `48px ${FONT_NAME}`;
  ctx.fillStyle = COLORS.WHITE;
  const line1 = "Game Over!";
  const line2 = `Final Score: ${score}`;
  const line3 = "Press SPACE to Restart";
  const w1 = ctx.measureText(line1).width;
  const w2 = ctx.measureText(line2).width;
  const w3 = ctx.measureText(line3).width;
  ctx.fillText(line1, (SCREEN_WIDTH - w1) / 2, SCREEN_HEIGHT / 2 - 50 + 48 / 2);
  ctx.fillStyle = COLORS.ORANGE;
  ctx.fillText(line2, (SCREEN_WIDTH - w2) / 2, SCREEN_HEIGHT / 2 + 48 / 2);
  ctx.fillStyle = COLORS.WHITE;
  ctx.font = `36px ${FONT_NAME}`;
  ctx.fillText(line3, (SCREEN_WIDTH - w3) / 2, SCREEN_HEIGHT / 2 + 60 + 36 / 2);
}

const LOADING_MESSAGES = [
  "Scanning sector...",
  "Analyzing threat data...",
  "Calibrating weapons...",
  "Generating hostiles...",
  "Deploying defenses...",
  "All systems go!",
];

const BOSS_LOADING_MESSAGES = [
  "WARNING: Large signature...",
  "Scanning command ship...",
  "Charging main batteries...",
  "Locking weapons...",
  "Boss approaching...",
  "Brace for impact!",
];

export function drawLevelTransition(
  ctx: CanvasRenderingContext2D,
  stars: Star[],
  nextLevel: number,
  progress: number,
  summary: string,
  score: number,
  isBossLevel: boolean
): void {
  ctx.fillStyle = COLORS.BLACK;
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  drawStars(ctx, stars);

  const messages = isBossLevel ? BOSS_LOADING_MESSAGES : LOADING_MESSAGES;

  // Level complete banner (fades in early)
  if (progress < 0.3) {
    const alpha = Math.min(1, progress / 0.15);
    ctx.globalAlpha = alpha;
    ctx.font = `56px ${FONT_NAME}`;
    ctx.fillStyle = COLORS.GREEN;
    const complete = `Level ${nextLevel - 1} Complete!`;
    const cw = ctx.measureText(complete).width;
    ctx.fillText(complete, (SCREEN_WIDTH - cw) / 2, SCREEN_HEIGHT / 2 - 120);
    ctx.globalAlpha = 1;
  }

  // "Generating Level X..." title
  if (progress >= 0.15) {
    ctx.font = `48px ${FONT_NAME}`;
    ctx.fillStyle = isBossLevel ? COLORS.RED : COLORS.ORANGE;
    const title = isBossLevel ? `BOSS FIGHT - Level ${nextLevel}` : `Level ${nextLevel}`;
    const tw = ctx.measureText(title).width;
    ctx.fillText(title, (SCREEN_WIDTH - tw) / 2, SCREEN_HEIGHT / 2 - 40);
  }

  // Progress bar
  if (progress >= 0.2) {
    const barProgress = Math.min(1, (progress - 0.2) / 0.7);
    const barW = 400;
    const barH = 16;
    const barX = (SCREEN_WIDTH - barW) / 2;
    const barY = SCREEN_HEIGHT / 2 + 10;
    ctx.strokeStyle = COLORS.WHITE;
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barW, barH);
    ctx.fillStyle = isBossLevel ? COLORS.RED : COLORS.GREEN;
    ctx.fillRect(barX + 2, barY + 2, (barW - 4) * barProgress, barH - 4);

    ctx.font = `20px ${FONT_NAME}`;
    ctx.fillStyle = COLORS.WHITE;
    const pct = `${Math.floor(barProgress * 100)}%`;
    ctx.fillText(pct, barX + barW + 12, barY + 14);
  }

  // Rotating status message
  if (progress >= 0.2) {
    const msgProgress = Math.min(1, (progress - 0.2) / 0.7);
    const msgIdx = Math.min(Math.floor(msgProgress * messages.length), messages.length - 1);
    ctx.font = `22px ${FONT_NAME}`;
    ctx.fillStyle = "rgb(100,100,120)";
    const msg = messages[msgIdx];
    const mw = ctx.measureText(msg).width;
    ctx.fillText(msg, (SCREEN_WIDTH - mw) / 2, SCREEN_HEIGHT / 2 + 55);
  }

  // Level summary (appears at 70%)
  if (progress >= 0.7 && summary) {
    const alpha = Math.min(1, (progress - 0.7) / 0.2);
    ctx.globalAlpha = alpha;
    ctx.font = `26px ${FONT_NAME}`;
    ctx.fillStyle = COLORS.WHITE;
    const sw = ctx.measureText(summary).width;
    ctx.fillText(summary, (SCREEN_WIDTH - sw) / 2, SCREEN_HEIGHT / 2 + 95);
    ctx.globalAlpha = 1;
  }

  drawScore(ctx, score);
}
