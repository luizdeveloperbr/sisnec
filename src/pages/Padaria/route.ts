import Database from "@tauri-apps/plugin-sql";
import { RouteObject } from "react-router";
import { format } from "date-fns";
import PadariaPage from "./page";
import { getReceita, getComponente } from "@/database/lib";
import { IReceita } from "@/componentes/Receita/types";
import { IComponente } from "@/componentes/Componente/types";
import { Producao as ProducaoType } from "@/componentes/Producao/types";

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
				const historico: ProducaoType[] = await db.select(
					`
						SELECT  
							p.codigo AS receita_codigo,
							p.data AS data_producao,
							cc.descricao AS receita,
							p.total_produzido,
							'[' || GROUP_CONCAT(
								'{"componente_id":' || p.componente_id || 
								',"descricao":"' || c.descricao || '"' || 
								',"medida":' || p.medida || 
								'}'
							) || ']' AS componentes
						FROM Producao p
						JOIN Componente cc ON p.codigo = cc.codigo
						JOIN Componente c ON p.componente_id = c.codigo
						WHERE p.codigo = $1
						GROUP BY p.codigo, p.data;
			
			`,
					[element.codigo],
				);
				return { ...receita, componentes, historico };
			}),
		);

		return produtos;
	},
};
export default route;
