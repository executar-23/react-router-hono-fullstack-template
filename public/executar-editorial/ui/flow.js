/* Framework-free adapter of the blog UI. Graph primitives share measured geometry. */
const FLOW = (() => {
  const width = 300, columnGap = 80, gap = 20, radius = 8;
  const Connector = (d, { kind = 'straight', trunk = '', arrow = false, dependency = false } = {}) =>
    `<path data-component="${arrow ? 'ArrowConnector' : 'Connector'}" data-kind="${kind}" data-trunk="${trunk}" class="flow-edge ${dependency ? 'dependency' : ''}" d="${d}" ${arrow ? 'marker-end="url(#flow-arrow)"' : ''}/>`;
  const Junction = (x, y, trunk, dependency) => `<circle data-component="Junction" data-trunk="${trunk}" class="flow-junction ${dependency ? 'dependency' : ''}" cx="${x}" cy="${y}" r="3"/>`;
  // A group owns one shared vertical trunk, rather than N origin-to-target curves.
  function ForkConnector(anchor, ports, { trunk, merge = false, dependency = false } = {}) {
    if (!ports.length) return '';
    const bus = merge ? anchor.x - columnGap / 2 : anchor.x + columnGap / 2;
    const ys = [anchor.y, ...ports.map(p => p.y)], low = Math.min(...ys), high = Math.max(...ys);
    const opts = { kind: merge ? 'merge' : 'fork', trunk, dependency };
    const r = Math.min(radius, (high - low) / 2);
    let html = `<g data-component="ForkConnector" data-kind="${opts.kind}" data-trunk="${trunk}">`;
    if (high > low) html += Connector(`M ${bus} ${low + r} V ${high - r}`, opts);
    const direction = merge ? -1 : 1;
    for (const port of [...ports, anchor]) {
      const side = port === anchor ? -direction : direction;
      let d;
      if (r && port.y === low) d = `M ${bus} ${low + r} Q ${bus} ${low} ${bus + side * r} ${low} H ${port.x}`;
      else if (r && port.y === high) d = `M ${bus} ${high - r} Q ${bus} ${high} ${bus + side * r} ${high} H ${port.x}`;
      else d = `M ${bus} ${port.y} H ${port.x}`;
      html += Connector(d, { ...opts, arrow: dependency && (merge ? port === anchor : port !== anchor) });
      if (port.y > low && port.y < high) html += Junction(bus, port.y, trunk, dependency);
    }
    return html + '</g>';
  }
  const FlowColumn = (x, label, html) => `<section data-component="FlowColumn" style="left:${x}px"><span class="flow-column-label" data-component="SectionLabel">${label}</span>${html}</section>`;
  const NodeHeader = (id, title, count, expanded) => `<div class="flow-node-header" data-component="NodeHeader"><span class="status-dot" data-component="StatusDot"></span><button class="node-title" data-detail="${id}" aria-expanded="${expanded}">${title}</button>${count ? `<span class="count-badge" data-component="CountBadge">${count}</span>` : ''}<button class="node-chevron" data-detail="${id}" aria-label="${expanded ? 'Recolher' : 'Expandir'} detalhes" aria-expanded="${expanded}">${expanded ? '⌃' : '⌄'}</button></div>`;
  const ResourceNode = (id, header, body, attrs = '') => `<article data-component="ResourceNode" data-node="${id}" ${attrs}>${header}${body}</article>`;
  const PrimaryNode = (...args) => ResourceNode(...args).replace('data-component="ResourceNode"', 'data-component="PrimaryNode"');
  const BindingNode = (...args) => ResourceNode(...args).replace('data-component="ResourceNode"', 'data-component="BindingNode"');
  const CanvasCollapseHandle = (id, expanded, count) => `<button class="collapse-handle" data-component="CanvasCollapseHandle" data-collapse="${id}" aria-expanded="${expanded}" aria-label="${expanded ? 'Recolher' : 'Expandir'} ${count} descendentes">${expanded ? '⌃ Recolher' : '⌄ Expandir'} · ${count}</button>`;
  return { width, columnGap, gap, Connector, ForkConnector, Junction, FlowColumn, NodeHeader, ResourceNode, PrimaryNode, BindingNode, CanvasCollapseHandle };
})();
