export function createInput(canvas) {
  const keys = new Set();
  const input = { keys, mouseX: 480, mouseY: 180, clear() { keys.clear(); } };
  const controls = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD']);
  function isEditing(target) {
    return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
  }
  window.addEventListener('keydown', event => {
    if (isEditing(event.target) || !controls.has(event.code)) return;
    event.preventDefault();
    keys.add(event.code);
  });
  window.addEventListener('keyup', event => keys.delete(event.code));
  canvas.addEventListener('pointermove', event => {
    const rect = canvas.getBoundingClientRect();
    input.mouseX = (event.clientX - rect.left) * canvas.width / rect.width;
    input.mouseY = (event.clientY - rect.top) * canvas.height / rect.height;
  });
  return input;
}
