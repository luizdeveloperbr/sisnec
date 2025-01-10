import Database from "@tauri-apps/plugin-sql";
import { getReceita, getComponente } from "@/database/lib";
import PadariaPage from "./page";
import { RouteObject } from "react-router";
import { IReceita } from "@/componentes/Receita/types";
import { IComponente } from "@/componentes/Componente/types";
import { format } from "date-fns";

const route: RouteObject = {
	path: "/padaria",
	Component: PadariaPage,
	id: "35",
	action: async ({ request }) => {
		const db = await Database.load("sqlite:data.db");
		const formData = await request.formData();
		const receita = formData.get("receita");
		const total_produzido = formData.get("total_produzido");
		const timestamp = format(new Date(), "dd-MM-yyyy pp");
		console.log(Array.from(formData.keys()));
		const componentes = Array.from(formData.entries()).filter(
			([key]) => key !== "total_produzido" && key !== "receita",
		);

		const updatePromises = componentes.map(async ([componente_id, medida]) => {
			if (Boolean(medida)) {
				await db.execute(
					"insert into Producao(codigo, total_produzido, componente_id, medida, data) values ($1, $2, $3, $4, $5)",
					[
						Number(receita),
						Number(total_produzido),
						Number(componente_id),
						Number(medida),
						timestamp,
					],
				);
				await db.execute(
					"update Componente set estoque = estoque - $1 WHERE codigo = $2",
					[Number(medida), Number(componente_id)],
				);
			}
		});

		await Promise.all(updatePromises);

		await db.execute(
			"update Componente set estoque = estoque + $1 WHERE codigo = $2",
			[Number(total_produzido), Number(receita)],
		);

		return null;
	},
	loader: async () => {
		const db = await Database.load("sqlite:data.db");
		const codigos: { codigo: number }[] = await db.select(
			"select codigo from Receita where secao = 35",
		);
		const produtos = await Promise.all(
			codigos.map(async (element) => {
				const receita: IReceita = await getReceita(element.codigo);
				const componentes: IComponente[] = await getComponente(element.codigo);
				return { ...receita, componentes };
			}),
		);
		return produtos;
	},
};
export default route;
