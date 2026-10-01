import { useEffect, useState } from "react";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

function readTheme(): Theme {
	try {
		const saved = localStorage.getItem("theme");
		if (saved === "light" || saved === "dark") return saved;
	} catch {
		// localStorage indisponível (modo privado): cai na preferência do sistema.
	}
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Alterna a classe .dark no <html> (mesmo contrato do theme-toggle do Risco-cognitivo-blog). */
export function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>("light");

	useEffect(() => {
		const initial = readTheme();
		setTheme(initial);
		document.documentElement.classList.toggle("dark", initial === "dark");
	}, []);

	const toggle = () => {
		const next: Theme = theme === "light" ? "dark" : "light";
		setTheme(next);
		document.documentElement.classList.toggle("dark", next === "dark");
		try {
			localStorage.setItem("theme", next);
		} catch {
			// Sem persistência: o tema vale só para esta visita.
		}
	};

	return (
		<Button variant="outline" size="icon" className="relative size-8" onClick={toggle} data-testid="theme-toggle" aria-pressed={theme === "dark"}>
			<Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
			<Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
			<span className="sr-only">Alternar tema claro/escuro</span>
		</Button>
	);
}
