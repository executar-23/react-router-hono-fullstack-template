import type { Route } from "./+types/design-system";
import { DesignSystemCatalog } from "~/components/design-system/catalog";
import manifest from "../../../design-system.manifest.json";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "Design System · Hub Editorial" },
		{ name: "description", content: "Tokens, callouts, dados, plain text e componentes do design system canônico." },
		{ name: "robots", content: "noindex" },
	];
}

export default function DesignSystem() {
	return <DesignSystemCatalog backHref="/" backLabel="Hub Editorial" source={manifest.source} />;
}
