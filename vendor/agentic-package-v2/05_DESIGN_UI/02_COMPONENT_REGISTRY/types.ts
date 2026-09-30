// Contrato de integração proposto. Não implementa UI nem execução de agentes.
export type WorkStatus = 'NOT_READY'|'READY'|'IN_PROGRESS'|'BLOCKED'|'DECLARED_DONE'|'VERIFIED';
export interface Node { id:string; kind:'root'|'branch'|'task'|'decision'|'agent'|'tool'|'approval'|'input'|'output'; title:string; description?:string|null; status:WorkStatus; owner?:string|null; evidence?:string[]; expanded?:boolean; groupId?:string|null }
export interface Edge { id:string; source:string; target:string; relation:'hierarchy'|'dependency'|'sequence'|'message'|'return'; label?:string|null }
export interface Graph { id:string; version:'0.1.0'; mode:'hierarchy'|'flow'|'mindmap'|'agents'; nodes:Node[]; edges:Edge[] }
export interface Execution { runId:string; state:'idle'|'queued'|'running'|'awaitingApproval'|'succeeded'|'failed'|'cancelled'; startedAt:string|null; finishedAt:string|null; evidence:string[]; error:string|null }
export interface FieldError { field:string; message:string }
export interface Legend { relation:Edge['relation']; label:string }
export interface Report { id:string; version:string; title:string; generatedAt:string; periodStart:string|null; periodEnd:string|null; owner:string|null; summary:string|null; sections:{id:string; title:string; body:string|null}[]; evidence:string[]; graphId:string|null; graphVersion:string|null }
export interface NodeCardProps { node:Node; selected?:boolean; onSelect:(id:string)=>void; onOpen:(id:string)=>void }
// Uso em um adaptador React a implementar:
// <NodeCard node={graph.nodes[0]} selected={false} onSelect={selectNode} onOpen={openInspector} />
