import Database from "@tauri-apps/plugin-sql";
import { RouteObject } from "react-router";
import ReceitaPage from "@/pages/Receitas/page";
const route: RouteObject = {
	path: "/receita",
	Component: ReceitaPage,
	action: async ({ request }) => {
		const db = await Database.load("sqlite:data.db");
		const formdata = await request.formData();
		const codigo = formdata.get("codigo");
		const rendimento = formdata.get("rendimento");
		const secao = formdata.get("secao");
		const componentes = Array.from(formdata.entries()).filter(
			([key]) => key !== "codigo" && key !== "rendimento" && key !== "secao",
		);
		await db.execute(
			"insert or ignore into Receita(codigo, rendimento, secao) values ($1, $2, $3)",
			[Number(codigo), Number(rendimento), Number(secao)],
		);

		const addComponentes = componentes.map(async ([componente_id, medida]) => {
			if (Boolean(medida)) {
				await db.execute(
					"insert or ignore into Componente_Receita(receita_codigo, componente_codigo, medida) values ($1, $2, $3)",
					[Number(codigo), Number(componente_id), Number(medida)],
				);
			}
			// return null
		});
		await Promise.all(addComponentes);
		return null;
	},
	loader: async () => {
		const db = await Database.load("sqlite:data.db");
		const allReceitas: { total: number }[] = await db.select(
			"select count(codigo) as total from Receita",
		);
		return allReceitas[0];
	},
};
export default route;
