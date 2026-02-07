import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  PLAYER_HEIGHT,
  COLORS,
  PLAYER_SKINS,
  FPS,
  BOSS_FREQUENCY,
} from "./constants";
import {
  createPlayer,
  createInitialEnemies,
  createBoss,
  createBullet,
} from "./entities";
import { KEY, isPressed, consumeKey, clearKeys } from "./input";
import { bulletEnemy, bulletBoss } from "./collision";
import {
  drawStars,
  drawEnemyBar,
  drawScore,
  drawLevelSummary,
  drawObjects,
  drawAllEntities,
  drawMenu,
  drawSkinMenu,
  drawGameOver,
  drawLevelTransition,
} from "./renderer";
import { LevelDeck, getTutorialTheme } from "./levels";
import type { LevelTheme } from "./levels";
import type { WorldState, GameState, Star } from "./types";

const TRANSITION_FRAMES = 180;

function generateStars(num: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < num; i++) {
    stars.push({
      x: Math.floor(Math.random() * SCREEN_WIDTH),
      y: Math.floor(Math.random() * SCREEN_HEIGHT),
      color: Math.random() < 0.5 ? COLORS.BLUE : COLORS.WHITE,
      radius: 1 + Math.floor(Math.random() * 3),
    });
  }
  return stars;
}

function createWorldState(level: number, skin: string, theme: LevelTheme): WorldState {
  const player = createPlayer(skin);
  return {
    player,
    enemies: createInitialEnemies(),
    boss: null,
    bullets: [],
    objects: [],
    score: 0,
    level,
    boss_frequency: BOSS_FREQUENCY,
    gameOver: false,
    dynamic_function: theme.mechanic,
    level_summary: theme.summary,
  };
}

function updateBullets(state: WorldState): void {
  state.bullets = state.bullets.filter((b) => {
    b.y += b.dy;
    return b.y >= 0 && b.y <= SCREEN_HEIGHT;
  });
}

function updateEnemies(state: WorldState): void {
  if (state.enemies.length === 0) return;
  const leftmost = Math.min(...state.enemies.map((e) => e.x));
  const rightmost = Math.max(...state.enemies.map((e) => e.x + e.width));
  const changeDirection = rightmost >= SCREEN_WIDTH - 20 || leftmost <= 20;
  const moveDown = changeDirection;
  for (const enemy of state.enemies) {
    if (changeDirection) enemy.direction *= -1;
    enemy.x += enemy.speed * enemy.direction;
    if (moveDown) enemy.y += 10;
    if (enemy.y + enemy.height >= PLAYER_HEIGHT) {
      state.gameOver = true;
      break;
    }
  }
}

function handleCollisionsE(state: WorldState): void {
  outer: for (let bi = state.bullets.length - 1; bi >= 0; bi--) {
    const bullet = state.bullets[bi];
    for (let ei = state.enemies.length - 1; ei >= 0; ei--) {
      if (bulletEnemy(bullet, state.enemies[ei])) {
        state.enemies.splice(ei, 1);
        state.bullets.splice(bi, 1);
        state.score += 10;
        break outer;
      }
    }
  }
}

function handleCollisionsBoss(state: WorldState): void {
  if (!state.boss) return;
  for (let i = state.bullets.length - 1; i >= 0; i--) {
    if (bulletBoss(state.bullets[i], state.boss)) {
      state.boss.health -= 1;
      state.bullets.splice(i, 1);
      break;
    }
  }
}

function spawnBoss(state: WorldState): void {
  state.boss = createBoss(Math.floor(SCREEN_WIDTH / 2 - 60), 50);
  state.boss.maxHP = 20 + 12 * state.level;
  state.boss.health = state.boss.maxHP;
  state.boss.speed = 2 + state.level * 0.25;
}

function updateBoss(state: WorldState): void {
  if (!state.boss) return;
  if (state.boss.x <= 20 || state.boss.x + state.boss.width >= SCREEN_WIDTH - 20) {
    state.boss.direction *= -1;
  }
  state.boss.x += state.boss.speed * state.boss.direction;
  if (Math.floor(Math.random() * 100) > 97) state.boss.y += 10;
  if (state.boss.y + state.boss.height >= PLAYER_HEIGHT) {
    state.gameOver = true;
    return;
  }
  handleCollisionsBoss(state);
}

function triggerNuke(state: WorldState): void {
  state.enemies.length = 0;
}

function advanceLevel(state: WorldState, theme: LevelTheme): void {
  state.objects = [];
  state.boss = null;
  state.bullets = [];
  state.level += 1;
  state.player.fastFire = false;
  state.player.nuke_available = true;
  state.enemies = createInitialEnemies();
  state.dynamic_function = theme.mechanic;
  state.level_summary = theme.summary;
  for (const e of state.enemies) {
    e.speed = 1 + state.level * 0.3;
  }
}

export type TickResult = "running" | "stopped";

export class Game {
  private state: WorldState;
  private gameState: GameState = "menu";
  private menuOption = 0;
  private skinOption = 0;
  private playerSkin: string = COLORS.GREEN;
  private stars: Star[];
  private levelTransitionFrames = 0;
  private lastTime = 0;
  private ctx: CanvasRenderingContext2D | null = null;
  private deck = new LevelDeck();

  constructor() {
    this.stars = generateStars(100);
    this.state = createWorldState(1, this.playerSkin, getTutorialTheme());
  }

  setCanvas(ctx: CanvasRenderingContext2D | null): void {
    this.ctx = ctx;
  }

  tick(): TickResult {
    const ctx = this.ctx;
    if (!ctx) return "running";

    const now = performance.now();
    const dt = now - this.lastTime;
    this.lastTime = now;
    const frameInterval = 1000 / FPS;
    if (dt < frameInterval) return "running";

    /* ── Menu ──────────────────────────────────────────── */
    if (this.gameState === "menu") {
      if (consumeKey(KEY.UP)) this.menuOption = (this.menuOption - 1 + 3) % 3;
      if (consumeKey(KEY.DOWN)) this.menuOption = (this.menuOption + 1) % 3;
      if (consumeKey(KEY.ENTER)) {
        if (this.menuOption === 0) {
          this.deck.reset();
          this.state = createWorldState(1, this.playerSkin, getTutorialTheme());
          this.state.player.color = this.playerSkin;
          this.gameState = "playing";
        } else if (this.menuOption === 1) {
          this.gameState = "skin_menu";
          this.skinOption = 0;
        } else {
          return "stopped";
        }
      }
      ctx.fillStyle = COLORS.BLACK;
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      drawStars(ctx, this.stars);
      drawMenu(ctx, this.menuOption);
      return "running";
    }

    /* ── Skin Menu ─────────────────────────────────────── */
    if (this.gameState === "skin_menu") {
      if (consumeKey(KEY.UP)) this.skinOption = (this.skinOption - 1 + PLAYER_SKINS.length) % PLAYER_SKINS.length;
      if (consumeKey(KEY.DOWN)) this.skinOption = (this.skinOption + 1) % PLAYER_SKINS.length;
      if (consumeKey(KEY.ENTER)) {
        this.playerSkin = PLAYER_SKINS[this.skinOption];
        this.gameState = "menu";
      }
      ctx.fillStyle = COLORS.BLACK;
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      drawStars(ctx, this.stars);
      drawSkinMenu(ctx, this.skinOption);
      return "running";
    }

    /* ── Game Over ─────────────────────────────────────── */
    if (this.gameState === "game_over") {
      ctx.fillStyle = COLORS.BLACK;
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      drawStars(ctx, this.stars);
      drawGameOver(ctx, this.state.score);
      if (consumeKey(KEY.SPACE)) {
        clearKeys();
        this.deck.reset();
        this.state = createWorldState(1, this.playerSkin, getTutorialTheme());
        this.gameState = "playing";
        this.state.player.color = this.playerSkin;
      }
      return "running";
    }

    /* ── Level Transition ──────────────────────────────── */
    if (this.levelTransitionFrames > 0) {
      const progress = 1 - this.levelTransitionFrames / TRANSITION_FRAMES;
      const isBossLevel = this.state.level % BOSS_FREQUENCY === 0;
      drawLevelTransition(
        ctx,
        this.stars,
        this.state.level,
        progress,
        this.state.level_summary,
        this.state.score,
        isBossLevel
      );
      this.levelTransitionFrames--;
      return "running";
    }

    /* ── Game Over check ───────────────────────────────── */
    if (this.state.gameOver) {
      this.gameState = "game_over";
      return "running";
    }

    /* ── Boss spawn ────────────────────────────────────── */
    if (this.state.level % this.state.boss_frequency === 0 && this.state.boss === null && this.state.enemies.length > 0) {
      spawnBoss(this.state);
    }

    /* ── Player input ──────────────────────────────────── */
    if (isPressed(KEY.LEFT) && this.state.player.x > 20) {
      this.state.player.x -= this.state.player.speed;
    }
    if (isPressed(KEY.RIGHT) && this.state.player.x < SCREEN_WIDTH - this.state.player.width - 20) {
      this.state.player.x += this.state.player.speed;
    }
    if (isPressed(KEY.SPACE)) {
      if (this.state.player.fastFire) {
        this.state.bullets.push(createBullet(this.state.player.x + Math.floor(this.state.player.width / 2), PLAYER_HEIGHT, -10));
      } else {
        const hasPlayerBullet = this.state.bullets.some((b) => b.dy < 0);
        if (!hasPlayerBullet) {
          this.state.bullets.push(createBullet(this.state.player.x + Math.floor(this.state.player.width / 2), PLAYER_HEIGHT, -10));
        }
      }
    }
    if (consumeKey(KEY.F)) {
      this.state.player.fastFire = !this.state.player.fastFire;
    }
    if (consumeKey(KEY.N)) {
      triggerNuke(this.state);
    }

    /* ── Update ────────────────────────────────────────── */
    updateBullets(this.state);

    if (this.state.boss) {
      updateBoss(this.state);
      if (this.state.boss && this.state.boss.health <= 0) {
        this.state.boss = null;
        const theme = this.deck.next();
        advanceLevel(this.state, theme);
        this.levelTransitionFrames = TRANSITION_FRAMES;
        return "running";
      }
    } else {
      updateEnemies(this.state);
      handleCollisionsE(this.state);
      if (this.state.enemies.length === 0) {
        const theme = this.deck.next();
        advanceLevel(this.state, theme);
        this.levelTransitionFrames = TRANSITION_FRAMES;
        return "running";
      }
    }

    for (const obj of this.state.objects) {
      try {
        obj.update(obj);
      } catch {
        // skip
      }
    }

    try {
      this.state.dynamic_function(this.state);
    } catch {
      // skip
    }

    /* ── Draw ──────────────────────────────────────────── */
    ctx.fillStyle = COLORS.BLACK;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    drawStars(ctx, this.stars);
    drawAllEntities(this.state, ctx);
    drawObjects(ctx, this.state.objects);
    if (this.state.boss) {
      drawEnemyBar(ctx, this.state.boss.maxHP, this.state.boss.health);
    } else {
      drawEnemyBar(ctx, 24, this.state.enemies.length);
    }
    drawScore(ctx, this.state.score);
    drawLevelSummary(ctx, this.state.level_summary);

    return "running";
  }

  start(): void {
    this.lastTime = performance.now();
  }
}
