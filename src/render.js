import { settings as s, colors as c } from './data.js';
export function render(ctx, world, input, paused) {
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = c.shadow; ctx.fillRect(0, 0, s.width, s.height);
  ctx.fillStyle = c.floor; ctx.fillRect(s.wall, s.wall, s.width - 2 * s.wall, s.height - 2 * s.wall);
  ctx.strokeStyle = c.shadow; ctx.lineWidth = 1;
  for (let x = 16; x < s.width; x += 16) { ctx.beginPath(); ctx.moveTo(x, 16); ctx.lineTo(x, 344); ctx.stroke(); }
  for (let y = 16; y < s.height; y += 16) { ctx.beginPath(); ctx.moveTo(16, y); ctx.lineTo(624, y); ctx.stroke(); }
  ctx.strokeStyle = c.lightStone; ctx.strokeRect(15.5, 15.5, 609, 329);
  for (const bullet of world.bullets) {
    if (!bullet.active) continue;
    const x = Math.round(bullet.x), y = Math.round(bullet.y);
    ctx.fillStyle = c.cyanDark; ctx.fillRect(x - 4, y - 4, 8, 8);
    ctx.fillStyle = c.cyan; ctx.fillRect(x - 2, y - 2, 4, 4);
  }
  const p = world.player, x = Math.round(p.x), y = Math.round(p.y);
  // Figura provisional de 32×32, con luz arriba a la izquierda.
  ctx.fillStyle = c.outline; ctx.fillRect(x - 11, y - 16, 22, 20); ctx.fillRect(x - 16, y + 3, 32, 13);
  ctx.fillStyle = c.cloth; ctx.fillRect(x - 13, y + 5, 26, 8);
  ctx.fillStyle = c.clothLight; ctx.fillRect(x - 13, y + 5, 10, 5);
  ctx.fillStyle = c.bone; ctx.fillRect(x - 8, y - 13, 16, 14);
  ctx.fillStyle = c.white; ctx.fillRect(x - 8, y - 13, 10, 4);
  ctx.fillStyle = c.outline; ctx.fillRect(x - 5, y - 6, 3, 4); ctx.fillRect(x + 3, y - 6, 3, 4);
  ctx.strokeStyle = c.cyanDark; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(p.angle) * 21, y + Math.sin(p.angle) * 21); ctx.stroke();
  ctx.fillStyle = c.outline; ctx.beginPath(); ctx.arc(x, y, p.radius + 1, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = c.white; ctx.beginPath(); ctx.arc(x, y, p.radius, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = c.cyan; ctx.lineWidth = 1;
  ctx.strokeRect(Math.round(input.mouseX) - 5, Math.round(input.mouseY) - 5, 10, 10);
  if (paused) {
    ctx.fillStyle = c.outline; ctx.fillRect(184, 142, 272, 66);
    ctx.fillStyle = c.white; ctx.font = '16px monospace'; ctx.textAlign = 'center';
    ctx.fillText('PAUSA', 320, 169); ctx.font = '10px monospace'; ctx.fillText('Haz clic para continuar', 320, 190);
  }
}
