// Servidor OpenAuth do Hub Editorial.
// Base: vendor/cloudflare-templates/openauth-template (src/index.ts), adaptado:
//  - sem o redirecionamento de demonstração;
//  - só o administrador (ADMIN_EMAIL) consegue concluir o login;
//  - código enviado por e-mail via Resend (RESEND_API_KEY); sem chave só em ambiente não produtivo.
import { issuer } from "@openauthjs/openauth";
import {
	CloudflareStorage,
	type CloudflareStorageOptions,
} from "@openauthjs/openauth/storage/cloudflare";
import { PasswordProvider } from "@openauthjs/openauth/provider/password";
import { PasswordUI } from "@openauthjs/openauth/ui/password";
import { subjects } from "../shared/subjects";

interface AuthEnv {
	AUTH_STORAGE: KVNamespace;
	AUTH_DB: D1Database;
	ENVIRONMENT: string;
	ADMIN_EMAIL: string;
	EMAIL_FROM: string;
	AUTH_CLIENT_ID: string;
	ALLOWED_ORIGIN: string;
	RESEND_API_KEY?: string;
}

const sameEmail = (a: string, b: string) =>
	a.trim().toLowerCase() === b.trim().toLowerCase();

async function sendCode(env: AuthEnv, email: string, code: string) {
	// Só o administrador recebe códigos: não vira relay de e-mail para terceiros.
	if (!sameEmail(email, env.ADMIN_EMAIL)) return;

	const key = env.RESEND_API_KEY;
	const configured = !!key && !key.startsWith("CHANGE_ME");
	if (!configured) {
		// Falha fechada: só desenvolvimento/teste explícitos podem expor o código no log.
		if (env.ENVIRONMENT !== "development" && env.ENVIRONMENT !== "test") {
			throw new Error("RESEND_API_KEY is not configured");
		}
		console.log(JSON.stringify({ level: "warn", message: "auth.code_dev_only", email, code }));
		return;
	}
	const res = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			authorization: `Bearer ${key}`,
			"content-type": "application/json",
		},
		body: JSON.stringify({
			from: env.EMAIL_FROM,
			to: [email],
			subject: "Seu código de acesso ao Hub Editorial",
			text: `Seu código: ${code}\n\nSe não foi você, ignore este e-mail.`,
		}),
	});
	if (!res.ok) {
		throw new Error(`Email provider responded ${res.status}`);
	}
}

export default {
	fetch(request: Request, env: AuthEnv, ctx: ExecutionContext) {
		return issuer({
			storage: CloudflareStorage({
				namespace: env.AUTH_STORAGE as CloudflareStorageOptions["namespace"],
			}),
			subjects,
			providers: {
				password: PasswordProvider(
					PasswordUI({
						sendCode: (email, code) => sendCode(env, email, code),
						copy: { input_code: "Código enviado por e-mail" },
					}),
				),
			},
			theme: {
				title: "Hub Editorial · Risco Cognitivo",
				primary: "#304E83",
			},
			// Só o app configurado pode iniciar o fluxo e receber o redirecionamento.
			allow: async (input) => {
				try {
					return (
						input.clientID === env.AUTH_CLIENT_ID &&
						new URL(input.redirectURI).origin === new URL(env.ALLOWED_ORIGIN).origin
					);
				} catch {
					return false;
				}
			},
			success: async (ctx, value) => {
				if (!sameEmail(value.email, env.ADMIN_EMAIL)) {
					return new Response("Acesso restrito ao administrador.", { status: 403 });
				}
				return ctx.subject("user", {
					id: await getOrCreateUser(env, value.email),
					email: value.email,
				});
			},
		}).fetch(request, env, ctx);
	},
} satisfies ExportedHandler<AuthEnv>;

async function getOrCreateUser(env: AuthEnv, email: string): Promise<string> {
	const result = await env.AUTH_DB.prepare(
		`INSERT INTO user (email) VALUES (?)
		 ON CONFLICT (email) DO UPDATE SET email = email
		 RETURNING id;`,
	)
		.bind(email)
		.first<{ id: string }>();
	if (!result) throw new Error("Unable to process user");
	return result.id;
}
