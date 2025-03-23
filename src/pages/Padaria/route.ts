import Database from "@tauri-apps/plugin-sql";
import { RouteObject } from "react-router";
import { format } from "date-fns";
import PadariaPage from "./page";
import { getReceita, getComponente, getHistorico } from "@/database/lib";
import { IReceita } from "@/componentes/Receita/types";
import { Producao as ProducaoType } from "@/componentes/Producao/types";

interface IComponente {
	codigo: number;
	descricao: string;
	peso_liquido: number;
	medida: number;
	custo: number;
	estoque: number;
	embalagem: string;
	componente_required: number;
	tipo: number;
}


const route: RouteObject = {
	path: "/padaria",
	Component: PadariaPage,
	id: "35",
	action: async ({ request }) => {
		const db = await Database.load("sqlite:data.db");
		const formData = await request.formData();
		const receita = formData.get("receita");
		const total_produzido = formData.get("total_produzido");
		const timestamp = format(new Date(), "yyyy-MM-dd H:mm:ss");
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
				const historico: ProducaoType[] = await getHistorico(element.codigo);
				return { ...receita, componentes, historico };
			}),
		);

		return produtos;
	},
};
export default route;
