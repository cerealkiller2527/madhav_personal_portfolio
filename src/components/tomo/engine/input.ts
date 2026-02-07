export const KEY = {
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
  UP: "ArrowUp",
  DOWN: "ArrowDown",
  SPACE: " ",
  ENTER: "Enter",
  F: "f",
  N: "n",
} as const;

const TRACKED = new Set<string>([
  KEY.LEFT,
  KEY.RIGHT,
  KEY.UP,
  KEY.DOWN,
  KEY.SPACE,
  KEY.ENTER,
  KEY.F,
  KEY.N,
]);

const held = new Set<string>();
const justDown = new Set<string>();

/** Returns true every frame while key is held — use for movement / shooting. */
export function isPressed(key: string): boolean {
  return held.has(key);
}

/** Returns true once per physical press — use for menu navigation / toggles. */
export function consumeKey(key: string): boolean {
  if (justDown.has(key)) {
    justDown.delete(key);
    return true;
  }
  return false;
}

export function onKeyDown(e: KeyboardEvent): void {
  if (TRACKED.has(e.key)) {
    e.preventDefault();
    if (!held.has(e.key)) {
      justDown.add(e.key);
    }
    held.add(e.key);
  }
}

export function onKeyUp(e: KeyboardEvent): void {
  if (TRACKED.has(e.key)) {
    e.preventDefault();
    held.delete(e.key);
    justDown.delete(e.key);
  }
}

export function clearKeys(): void {
  held.clear();
  justDown.clear();
}
