/* Deliberate navigation only: wheel/touch gestures belong to the page and canvas. */
function returnEditFocus() {
  const id = draft?.selected;
  if (lastTrigger?.isConnected) lastTrigger.focus();
  else document.querySelector(`[data-inspect="${id}"]`)?.focus();
}
document.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.inspect) inspect(b.dataset.inspect, b);
  if (b.dataset.execute) choose(b.dataset.execute, true);
  if (b.dataset.detail) {
    const id = b.dataset.detail; state.ui.graphSelected = id; state.ui.details[id] = !state.ui.details[id]; save(); renderMap();
    document.querySelector(`[data-detail="${id}"]`)?.focus();
  }
  if (b.dataset.collapse) { const n = byId(b.dataset.collapse); n.expanded = n.expanded === false; save(); renderMap(); document.querySelector(`[data-collapse="${n.id}"]`)?.focus(); }
  if (b.dataset.phase) { state.ui.mapPhase = b.dataset.phase; state.ui.graphMode = 'structure'; state.ui.graphSelected = b.dataset.phase === 'all' ? state.graph.nodes[0].id : b.dataset.phase; $('search').value = ''; state.zoom = 1; save(); renderMap(); $('canvas').scrollTo(0, 0); }
  if (b.dataset.showDeps) { state.ui.graphSelected = b.dataset.showDeps; state.ui.graphMode = 'dependencies'; state.list = false; save(); renderMap(); $('canvas').scrollTo(0, 0); }
  if (b.dataset.removeEdge) { draft.edges = draft.edges.filter(x => x.id !== b.dataset.removeEdge); dirty = true; renderDependencies(); }
});
$('scrollTab').onclick = () => { state.view = 'scroll'; save(); render(); };
$('mapTab').onclick = () => { state.view = 'map'; save(); render(); };
$('scope').onchange = e => { state.scope = e.target.value; if (state.scope === 'workflow' || state.scope === 'phase') state.ui.taskPhase = 'all'; state.selected = queue()[0]?.id; contextOpen = false; save(); render(); };
$('taskPhase').onchange = e => { state.ui.taskPhase = e.target.value; if (['workflow', 'phase'].includes(state.scope)) state.scope = 'action'; state.selected = queue()[0]?.id; contextOpen = false; save(); render(); };
$('prev').onclick = () => navigate(-1); $('next').onclick = () => navigate(1); $('complete').onclick = finish;
$('defer').onclick = () => { const n = current(), m = state.meta[n.id]; m.deferred = !m.deferred; if (n.status === 'IN_PROGRESS') n.status = 'READY'; if (state.timer.item === n.id) stopTimer(); save(); render(); };
$('contextButton').onclick = () => { contextOpen = !contextOpen; renderFocus(); };
$('start').onclick = toggleTimer;
$('reset').onclick = () => { const item = byId(state.timer.item); if (item?.status === 'IN_PROGRESS') item.status = 'READY'; stopTimer(); save(); render(); };
$('duration').onchange = e => { if (state.timer.mode === 'running' || state.timer.mode === 'paused') { e.target.value = state.duration; tell('Encerre a sessão de foco para mudar a duração.'); return; } state.duration = Number(e.target.value); stopTimer(); save(); tick(); };
$('auto').onchange = e => { state.auto = e.target.checked; save(); }; setInterval(tick, 250);
$('graphMode').onchange = e => { state.ui.graphMode = e.target.value; state.list = false; save(); renderMap(); $('canvas').scrollTo(0, 0); };
$('nodeSelect').onchange = e => { state.ui.graphSelected = e.target.value; save(); renderMap(); };
$('listButton').onclick = () => { state.list = !state.list; save(); renderMap(); };
$('search').oninput = renderMap;
$('minus').onclick = () => { state.zoom = Math.max(.5, state.zoom - .25); save(); renderMap(); };
$('plus').onclick = () => { state.zoom = Math.min(2, state.zoom + .25); save(); renderMap(); };
$('expandAll').onclick = () => { state.graph.nodes.forEach(n => { state.ui.details[n.id] = true; n.expanded = true; }); save(); renderMap(); };
$('collapseAll').onclick = () => { state.ui.details = {}; save(); renderMap(); };
$('fit').onclick = () => { state.list = false; state.zoom = 1; renderMap(); const node = document.querySelector(`[data-node="${state.ui.graphSelected}"]`); node?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'instant' }); save(); };
let pan = null;
$('canvas').addEventListener('pointerdown', e => { if (e.pointerType === 'touch' || e.button !== 0 || e.target.closest('button,article')) return; pan = { x: e.clientX, y: e.clientY, left: $('canvas').scrollLeft, top: $('canvas').scrollTop }; $('canvas').setPointerCapture(e.pointerId); });
$('canvas').addEventListener('pointermove', e => { if (pan) { $('canvas').scrollLeft = pan.left - e.clientX + pan.x; $('canvas').scrollTop = pan.top - e.clientY + pan.y; } });
$('canvas').addEventListener('pointerup', () => pan = null); $('canvas').addEventListener('pointercancel', () => pan = null);
$('scrollView').addEventListener('keydown', e => { if (e.target.closest('input,textarea,select,button') || document.querySelector('dialog[open]')) return; if (['ArrowDown','ArrowUp'].includes(e.key)) { e.preventDefault(); navigate(e.key === 'ArrowDown' ? 1 : -1); } });
