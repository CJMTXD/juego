import { settings as s } from './data.js';

export function createWorld() {
  return {
    player: { x: s.width / 2, y: s.height / 2, angle: 0, radius: s.hitRadius },
    bullets: Array.from({ length: s.bulletCapacity }, () => ({ active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0 })),
    fireTimer: 0,
  };
}

export function updateWorld(world, input, dt) {
  const p = world.player;
  let dx = Number(input.keys.has('KeyD')) - Number(input.keys.has('KeyA'));
  let dy = Number(input.keys.has('KeyS')) - Number(input.keys.has('KeyW'));
  const length = Math.hypot(dx, dy);
  if (length > 0) { dx /= length; dy /= length; }
  // El cuerpo visual permanece dentro de la sala; la hitbox es independiente.
  const margin = s.wall + s.playerSize / 2;
  p.x = Math.max(margin, Math.min(s.width - margin, p.x + dx * s.playerSpeed * dt));
  p.y = Math.max(margin, Math.min(s.height - margin, p.y + dy * s.playerSpeed * dt));
  if (Math.hypot(input.mouseX - p.x, input.mouseY - p.y) > 0.001) {
    p.angle = Math.atan2(input.mouseY - p.y, input.mouseX - p.x);
  }
  for (const bullet of world.bullets) {
    if (!bullet.active) continue;
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    bullet.life -= dt;
    if (bullet.life <= 0 || bullet.x < s.wall || bullet.x > s.width - s.wall || bullet.y < s.wall || bullet.y > s.height - s.wall) bullet.active = false;
  }
  if (world.fireTimer <= 1e-9) {
    // Un pool lleno omite el disparo; nunca reemplaza una bala activa.
    const bullet = world.bullets.find(item => !item.active);
    if (bullet) {
      const cos = Math.cos(p.angle), sin = Math.sin(p.angle);
      bullet.active = true;
      bullet.x = p.x + cos * 20;
      bullet.y = p.y + sin * 20;
      bullet.vx = cos * s.bulletSpeed;
      bullet.vy = sin * s.bulletSpeed;
      bullet.life = 3;
    }
    world.fireTimer += s.fireInterval;
  }
  world.fireTimer -= dt;
}
