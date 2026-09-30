import { LogIn, ShieldAlert } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { HubStore } from "~/lib/hub/use-hub-store";

/** Tela de entrada: o Hub só grava dados para o administrador autenticado (OpenAuth). */
export function LoginGate({ store }: { store: HubStore }) {
	const forbidden = store.mode === "forbidden";
	return (
		<main className="flex min-h-screen items-center justify-center bg-background p-6">
			<div className="w-full max-w-sm space-y-5 rounded-xl border bg-card p-6 shadow-sm">
				<div className="flex size-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
					RC
				</div>
				<div className="space-y-1">
					<h1 className="text-xl">Hub Editorial</h1>
					<p className="text-sm text-muted-foreground">Risco Cognitivo</p>
				</div>
				{forbidden ? (
					<p role="alert" className="flex gap-2 text-sm text-[var(--color-critical-default)]">
						<ShieldAlert className="mt-0.5 size-4 shrink-0" />
						Esta conta não tem acesso de administrador.
					</p>
				) : (
					<p className="text-sm text-muted-foreground">
						Entre com o e-mail do administrador para ver e editar os dados.
					</p>
				)}
				<div className="flex flex-col gap-2">
					{forbidden ? (
						<Button onClick={() => void store.logout()}>Trocar de conta</Button>
					) : (
						<Button asChild>
							<a href="/api/auth/login">
								<LogIn /> Entrar
							</a>
						</Button>
					)}
					<Button variant="outline" onClick={store.startLocal}>
						Usar modo local (só neste navegador)
					</Button>
				</div>
			</div>
		</main>
	);
}
