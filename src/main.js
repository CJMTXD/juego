import { settings } from './data.js';
import { createInput } from './input.js';
import { createWorld, updateWorld } from './simulation.js';
import { render } from './render.js';

const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
const button = document.querySelector('#pause');
const status = document.querySelector('#status');
const input = createInput(canvas);
const world = createWorld();
let paused = true, previous = 0, accumulator = 0;
function setPaused(value) {
  paused = value; input.clear(); accumulator = 0; previous = performance.now();
  button.textContent = paused ? 'Continuar' : 'Pausar';
  status.textContent = paused ? 'En pausa. Haz clic en la arena o pulsa Continuar.' : 'Arena de práctica · Sin enemigos ni daño en esta fase.';
}
button.addEventListener('click', () => setPaused(!paused));
canvas.addEventListener('pointerdown', () => { canvas.focus(); setPaused(false); });
window.addEventListener('blur', () => setPaused(true));
document.addEventListener('visibilitychange', () => { if (document.hidden) setPaused(true); });
function resize() {
  // Escalado entero cuando cabe; reducción solo en ventanas menores de 640 px.
  const available = Math.max(1, canvas.parentElement.clientWidth - 40);
  const scale = available >= settings.width ? Math.max(1, Math.min(2, Math.floor(available / settings.width))) : available / settings.width;
  canvas.style.width = `${settings.width * scale}px`;
  canvas.style.height = `${settings.height * scale}px`;
}
window.addEventListener('resize', resize); resize();
function frame(now) {
  const elapsed = Math.min(Math.max((now - previous) / 1000, 0), 0.05);
  previous = now;
  if (!paused) {
    accumulator += elapsed;
    while (accumulator >= settings.step) { updateWorld(world, input, settings.step); accumulator -= settings.step; }
  }
  render(ctx, world, input, paused);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
