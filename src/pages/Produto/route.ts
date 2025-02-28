import { getComponente, getReceita } from "@/database/lib"
import ProdutoPage from "./page"
import { RouteObject } from "react-router-dom"
import Database from "@tauri-apps/plugin-sql";
import { format } from "date-fns";
const route: RouteObject = {
	path:"/produto/:codigo",
	Component: ProdutoPage,
	action: async ({ request }: {request: Request}) => {
			const db = await Database.load("sqlite:data.db");
			// data from request
			const formData = await request.formData()
			const receita = formData.get("receita");
			const total_produzido = formData.get("total_produzido");
			const componentes = formData.entries();
			//define timestamp
			const timestamp = format(new Date(), "yyyy-MM-dd H:mm:ss");
			//list only components
			const allComponentes = Array.from(componentes).filter(
				([key]) => key !== "total_produzido" && key !== "receita",
			);
	
			const persistComponentes = allComponentes.map(async ([componente_id, medida]) => {
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
	
			await Promise.all(persistComponentes);
	
			await db.execute(
				"update Componente set estoque = estoque + $1 WHERE codigo = $2",
				[Number(total_produzido), Number(receita)],
			);
	
			return null;
		} ,
	loader: async ({params}) => {
		let { codigo } = params
		const receita = await getReceita(Number(codigo))
		const componentes = await getComponente(Number(codigo))
		return {...receita, componentes}
	}
	}
export default route