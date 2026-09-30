// Compartilhado entre o servidor OpenAuth (auth/) e o Worker principal (workers/api),
// para que tipos e validação do token fiquem consistentes.
import { createSubjects } from "@openauthjs/openauth/subject";
import { object, string } from "valibot";

export const subjects = createSubjects({
	user: object({
		id: string(),
		email: string(),
	}),
});
