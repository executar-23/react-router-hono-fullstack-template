export type ConnectorKind = 'straight' | 'elbow' | 'fork' | 'merge' | 'arrow';
export interface FlowEdge { from: string; to: string; kind: ConnectorKind; trunk?: string }
export type ResourceNodeState = 'default' | 'hover' | 'expanded' | 'collapsed' | 'selected' | 'disabled';
export interface FlowNodeGeometry { id: string; x: number; y: number; width: 300; height: number }
export interface FlowPort { x: number; y: number }
export interface FlowFork { anchor: FlowPort; ports: FlowPort[]; trunk: string; merge?: boolean; dependency?: boolean }
export const components = ['FlowCanvas','FlowColumn','ResourceNode','PrimaryNode','BindingNode','ExpandableNode','NodeHeader','CountBadge','StatusDot','StatusPill','SectionLabel','ActionRow','Connector','ForkConnector','ArrowConnector','Junction','CanvasCollapseHandle'] as const;
