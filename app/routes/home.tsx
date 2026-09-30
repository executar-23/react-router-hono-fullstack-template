import type { Route } from "./+types/home";
import { HubShell } from "~/components/hub/hub-shell";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Hub Editorial · Risco Cognitivo" },
		{
			name: "description",
			content:
				"Hub editorial do Risco Cognitivo: conteúdos, argumentos, evidências, derivados por canal, calendário e distribuição.",
		},
	];
}

export default function Home() {
	return <HubShell />;
}
