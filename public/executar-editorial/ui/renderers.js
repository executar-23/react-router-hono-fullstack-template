/* UI state is separate from editorial data; opening a node never changes task scope. */
const phases = () => state.graph.nodes.filter(n => state.meta[n.id].scope === 'phase');
state.ui = { version: 1, mapPhase: state.meta[state.selected]?.phase || phases()[0]?.id,
  graphMode: 'structure', graphSelected: state.selected, details: {}, taskPhase: 'all', ...(state.ui || {}) };
if (!state.ui.version) state.ui.version = 1;
state.zoom = Math.max(.5, Math.min(2, state.zoom || 1));
function render() {
  const n = current(); if (n) state.selected = n.id;
  const q = queue(), finished = q.filter(done).length;
  $('projectTitle').textContent = state.graph.nodes.find(n => n.kind === 'root')?.title || 'Plano editorial';
  $('summary').textContent = `${finished} de ${q.length} ${state.scope === 'action' ? 'ações' : 'itens'} concluídos`;
  $('progress').style.width = (q.length ? finished / q.length * 100 : 0) + '%';
  $('scope').value = state.scope;
  $('taskPhase').innerHTML = '<option value="all">Todas as fases</option>' + phases().map(p => `<option value="${p.id}">${esc(p.title.replace('FASE ', ''))}</option>`).join('');
  $('taskPhase').value = state.ui.taskPhase;
  $('scrollView').hidden = state.view !== 'scroll'; $('mapView').hidden = state.view !== 'map';
  for (const [id, view] of [['scrollTab', 'scroll'], ['mapTab', 'map']]) {
    $(id).classList.toggle('active', state.view === view); $(id).setAttribute('aria-pressed', state.view === view);
  }
  $('duration').value = state.duration; $('auto').checked = state.auto;
  renderFocus(); if (state.view === 'map') renderMap(); tick();
}
function renderFocus() {
  const n = current(), q = queue();
  if (!n || !q.length) { $('focus').innerHTML = '<article class="focuscard"><h2>Nenhum item nesta seleção</h2><p>Escolha outra fase ou granularidade.</p></article>'; ['prev', 'next', 'complete', 'defer', 'contextButton', 'start'].forEach(id => $(id).disabled = true); return; }
  const m = state.meta[n.id], i = q.findIndex(x => x.id === n.id), waiting = blockers(n.id);
  const incomplete = descendants(n.id).filter(c => !done(c));
  $('focus').innerHTML = `<article class="focuscard"><div class="focus-top"><span class="eyebrow">${esc(byId(m.phase)?.title || 'WORKFLOW')}</span>${badge(n)}</div><h2>${esc(n.title)}</h2>${m.deferred ? '<p class="muted">Adiado · retome quando estiver pronto.</p>' : ''}<div class="focus-meta"><span>${esc(n.owner || 'Responsável a definir')}</span><button data-inspect="${n.id}">Editar detalhes</button></div>${!done(n) && (waiting.length || incomplete.length) ? `<section class="blocker-box"><b>${waiting.length ? 'Pré-requisitos pendentes' : 'Conclua os itens deste agrupamento'}</b>${(waiting.length ? waiting : incomplete).slice(0, 4).map(c => `<button data-execute="${c.id}">${esc(c.title)} →</button>`).join('')}${incomplete.length > 4 && !waiting.length ? `<span>Mais ${incomplete.length - 4} itens no plano mental.</span>` : ''}</section>` : ''}<div class="context" ${contextOpen ? '' : 'hidden'}><p class="muted">${esc(path(n).join(' / '))}</p><p>${esc(n.description || 'Adicione uma descrição em Editar detalhes.')}</p><p>Planejado: ${date(m.start)} a ${date(m.due)}</p>${relations(n)}<label for="quickNote">Notas<textarea id="quickNote">${esc(m.notes)}</textarea></label></div></article>`;
  $('taskPosition').textContent = `${i + 1} / ${q.length}`;
  $('prev').disabled = i <= 0; $('next').disabled = i >= q.length - 1;
  $('complete').disabled = !done(n) && (effective(n) === 'BLOCKED' || incomplete.length > 0);
  $('complete').textContent = done(n) ? 'Reabrir item' : `Concluir ${state.scope === 'action' ? 'ação' : 'item'}`;
  $('defer').disabled = false; $('contextButton').disabled = false;
  $('defer').textContent = m.deferred ? 'Retomar item' : 'Adiar';
  $('contextButton').setAttribute('aria-expanded', contextOpen);
  $('contextButton').textContent = contextOpen ? 'Fechar contexto' : 'Contexto e notas';
  $('quickNote')?.addEventListener('input', e => { m.notes = e.target.value; save(); });
}
function navigate(step) {
  const q = queue(), i = q.findIndex(n => n.id === state.selected), next = q[i + step];
  if (!next) return; state.selected = next.id; contextOpen = false; save(); render();
}
function choose(id, execute = false) {
  const n = byId(id); if (!n) return;
  if (execute) { state.selected = id; state.scope = state.meta[id].scope; state.ui.taskPhase = 'all'; state.view = 'scroll'; contextOpen = false; }
  else state.ui.graphSelected = id;
  save(); render();
}
function nodeHeight(n, primary = false) {
  const expanded = primary || state.ui.details[n.id];
  return expanded ? Math.max(180, Math.max(58, Math.ceil(n.title.length / 23) * 20 + 16) + 156 + (state.ui.graphMode === 'structure' && children(n.id).length ? 36 : 0)) : 58;
}
function flowNode(n, y, role = 'resource') {
  const primary = role === 'primary', expanded = primary || !!state.ui.details[n.id], cs = children(n.id);
  const header = FLOW.NodeHeader(n.id, esc(n.title), cs.length, expanded);
  const body = expanded ? `<div class="node-body" data-component="ExpandableNode">${badge(n)}<p>${esc({action:'Ação',task:'Tarefa',phase:'Fase',workflow:'Workflow'}[state.meta[n.id].scope])} · ${incoming(n.id).length} pré-requisitos</p><div class="node-actions" data-component="ActionRow"><button data-inspect="${n.id}">Editar</button><button data-execute="${n.id}">Executar →</button></div></div>${cs.length && state.ui.graphMode === 'structure' ? FLOW.CanvasCollapseHandle(n.id, n.expanded !== false, cs.length) : ''}` : '';
  const attrs = `class="flow-node ${expanded ? 'expanded' : 'collapsed'} ${primary ? 'primary' : ''} ${state.ui.graphSelected === n.id ? 'selected' : ''}" data-status="${effective(n)}" style="left:0;top:${y}px;height:${nodeHeight(n, primary)}px"`;
  return (primary ? FLOW.PrimaryNode : role === 'binding' ? FLOW.BindingNode : FLOW.ResourceNode)(n.id, header, body, attrs);
}
function visibleNodes() {
  const root = state.ui.mapPhase === 'all' ? state.graph.nodes.find(n => n.kind === 'root') : byId(state.ui.mapPhase);
  const result = [], term = $('search').value.trim().toLocaleLowerCase();
  const keep = new Set();
  if (term) for (const n of state.graph.nodes.filter(n => n.title.toLocaleLowerCase().includes(term))) {
    let id = n.id; keep.add(id); let p; while ((p = state.graph.edges.find(e => e.relation === 'hierarchy' && e.target === id))) { keep.add(p.source); id = p.source; }
  }
  function walk(n, depth) { if (!n || term && !keep.has(n.id)) return; result.push({ n, depth }); if (n.expanded !== false || term) children(n.id).forEach(c => walk(c, depth + 1)); }
  walk(root, 0); return result;
}
function renderMap() {
  const ui = state.ui, deps = ui.graphMode === 'dependencies';
  $('graphMode').value = ui.graphMode; $('nodeSelectLabel').hidden = !deps; $('search').hidden = deps;
  $('nodeSelect').innerHTML = state.graph.nodes.map(n => `<option value="${n.id}">${esc(n.title)}</option>`).join('');
  $('nodeSelect').value = ui.graphSelected;
  const phaseButton = (p, i) => { const actions = descendants(p.id).filter(n => state.meta[n.id].scope === 'action'); return `<button class="phase-button ${ui.mapPhase === p.id ? 'active' : ''}" data-phase="${p.id}" aria-pressed="${ui.mapPhase === p.id}"><span class="phase-num">${String(i + 1).padStart(2, '0')}</span><span><strong>${esc(p.title.replace(/^FASE \d+: /, ''))}</strong><small>${actions.filter(done).length}/${actions.length} ações concluídas</small></span></button>`; };
  $('phaseNav').innerHTML = phases().map(phaseButton).join('') + `<button class="phase-button ${ui.mapPhase === 'all' ? 'active' : ''}" data-phase="all">Plano completo · 49 nós</button>`;
  $('canvas').hidden = state.list; $('outline').hidden = !state.list;
  $('listButton').textContent = state.list ? 'Ver em grafo' : 'Ver em lista';
  $('zoomLabel').textContent = Math.round(state.zoom * 100) + '%';
  $('minus').disabled = state.zoom <= .5; $('plus').disabled = state.zoom >= 2;
  let visible, pos = new Map(), columns = new Map(), lines = '', w = 0, h = 0;
  const addColumn = (depth, node, y, role = 'resource') => { const x = 24 + depth * (FLOW.width + FLOW.columnGap); pos.set(node.id, { x, y, h: nodeHeight(node, role === 'primary') }); columns.set(depth, (columns.get(depth) || '') + flowNode(node, y, role)); w = Math.max(w, x + FLOW.width + 24); h = Math.max(h, y + nodeHeight(node, role === 'primary') + 24); };
  if (deps) {
    const n = byId(ui.graphSelected) || current(); ui.graphSelected = n.id;
    const origins = incoming(n.id).map(e => byId(e.source)), outputs = state.graph.edges.filter(e => e.relation === 'dependency' && e.source === n.id).map(e => byId(e.target));
    const total = ns => ns.reduce((sum, n) => sum + nodeHeight(n) + FLOW.gap, 0) - (ns.length ? FLOW.gap : 0);
    const extent = Math.max(total(origins), total(outputs), nodeHeight(n, true));
    addColumn(1, n, 60 + (extent - nodeHeight(n, true)) / 2, 'primary');
    for (const [depth, ns, role] of [[0, origins, 'resource'], [2, outputs, 'binding']]) { let y = 60 + (extent - total(ns)) / 2; for (const node of ns) { addColumn(depth, node, y, role); y += nodeHeight(node) + FLOW.gap; } }
    const p = pos.get(n.id), cy = p.y + p.h / 2;
    lines += FLOW.ForkConnector({ x: p.x, y: cy }, origins.map(n => { const s = pos.get(n.id); return { x: s.x + FLOW.width, y: s.y + s.h / 2 }; }), { trunk: 'incoming-' + n.id, merge: true, dependency: true });
    lines += FLOW.ForkConnector({ x: p.x + FLOW.width, y: cy }, outputs.map(n => { const t = pos.get(n.id); return { x: t.x, y: t.y + t.h / 2 }; }), { trunk: 'outgoing-' + n.id, dependency: true });
    w = 3 * (FLOW.width + FLOW.columnGap) - FLOW.columnGap + 48; h = Math.max(h, 400);
    visible = [...origins, n, ...outputs].map(n => ({ n, depth: 0 }));
    if (!origins.length) columns.set(0, '<p class="flow-empty">Este item não tem pré-requisitos explícitos.</p>');
    if (!outputs.length) columns.set(2, '<p class="flow-empty">Este item não bloqueia outros itens.</p>');
    $('mapCount').textContent = `${origins.length} origens → item central → ${outputs.length} destinos · relações FS explícitas`;
  } else {
    visible = visibleNodes(); const allowed = new Set(visible.map(x => x.n.id));
    function size(n) { const cs = children(n.id).filter(c => allowed.has(c.id)); return Math.max(nodeHeight(n), cs.reduce((sum, c) => sum + size(c), 0) + Math.max(0, cs.length - 1) * FLOW.gap); }
    function layout(n, depth, top) { const cs = children(n.id).filter(c => allowed.has(c.id)), extent = size(n); addColumn(depth, n, top + (extent - nodeHeight(n)) / 2); let y = top; for (const c of cs) { layout(c, depth + 1, y); y += size(c) + FLOW.gap; } }
    if (visible.length) layout(visible[0].n, 0, 60);
    for (const { n } of visible) { const cs = children(n.id).filter(c => allowed.has(c.id)); if (!cs.length) continue; const p = pos.get(n.id); lines += FLOW.ForkConnector({ x: p.x + FLOW.width, y: p.y + p.h / 2 }, cs.map(c => { const s = pos.get(c.id); return { x: s.x, y: s.y + s.h / 2 }; }), { trunk: 'hierarchy-' + n.id }); }
    $('mapCount').textContent = `${visible.length} nós nesta seleção · 49 no plano · 14 dependências FS no total`;
  }
  const allowed = new Set(visible.map(x => x.n.id));
  function outlineNode(n) { const cs = children(n.id).filter(c => allowed.has(c.id)); return `<li><div class="outrow">${cs.length || children(n.id).length ? `<button data-collapse="${n.id}" aria-expanded="${n.expanded !== false}">${n.expanded === false ? '+' : '−'} ${children(n.id).length}</button>` : ''}<button class="title" data-inspect="${n.id}">${esc(n.title)}</button>${badge(n)}<button data-execute="${n.id}">Executar</button></div>${relations(n)}${cs.length && !deps ? `<ul>${cs.map(outlineNode).join('')}</ul>` : ''}</li>`; }
  const roots = deps ? visible : visible.filter(x => !state.graph.edges.some(e => e.relation === 'hierarchy' && e.target === x.n.id && allowed.has(e.source)));
  $('outline').innerHTML = '<ul>' + roots.map(x => outlineNode(x.n)).join('') + '</ul>';
  $('stage').style.width = Math.max(w, 350) * state.zoom + 'px'; $('stage').style.height = Math.max(h, 350) * state.zoom + 'px';
  $('stage').innerHTML = visible.length ? `<div class="graph-inner" style="width:${w}px;height:${h}px;transform:scale(${state.zoom})"><svg class="edges-layer" data-component="EdgesLayer" width="${w}" height="${h}" aria-hidden="true"><defs><marker id="flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#0a6fdb"/></marker></defs>${lines}</svg><div data-component="NodesLayer">${[...columns].map(([depth, html]) => FLOW.FlowColumn(24 + depth * (FLOW.width + FLOW.columnGap), deps ? ['Pré-requisitos', 'Item central', 'Libera / bindings'][depth] : ['Fase / workflow', 'Tarefas / fases', 'Ações / tarefas', 'Ações'][depth], html)).join('')}</div></div>` : '<p style="padding:24px">Nenhum item encontrado nesta fase. Escolha Plano completo para buscar em todas.</p>';
  const selected = byId(ui.graphSelected);
  $('graphSelection').innerHTML = selected ? `<span><b>${esc(selected.title)}</b></span><button data-inspect="${selected.id}">Editar detalhes</button><button data-show-deps="${selected.id}">Ver dependências</button><button data-execute="${selected.id}">Executar →</button>` : '';
}
