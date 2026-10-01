import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("admin/design-system", "routes/admin/design-system.tsx"),
] satisfies RouteConfig;
