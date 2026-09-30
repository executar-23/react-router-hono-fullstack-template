import modulesJson from "../../app/data/hub/modules.json";

interface ModuleDef {
	id: string;
	idField?: string;
}

const MODULES = modulesJson as unknown as ModuleDef[];

export const MODULE_IDS = MODULES.map((m) => m.id) as [string, ...string[]];

export function isModuleId(id: string): boolean {
	return MODULES.some((m) => m.id === id);
}

/** Campo de código único do módulo (ex.: Content_ID), quando existe. */
export function codeFieldOf(moduleId: string): string | undefined {
	return MODULES.find((m) => m.id === moduleId)?.idField;
}
