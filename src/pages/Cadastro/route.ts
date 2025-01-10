import Database from "@tauri-apps/plugin-sql";
import { RouteObject } from "react-router-dom";
import CadastroPage from "./page";
const route: RouteObject = {
	path: "/cadastro",
	Component: CadastroPage,
	action: async ({ request }) => {
		const formdata = await request.formData();
		const codigo = formdata.get("codigo");
		const descricao = formdata.get("descricao");
		const estoque = formdata.get("estoque");
		const custo = formdata.get("custo");
		const db = await Database.load("sqlite:data.db");
		await db.execute(
			"insert into Componente(codigo,descricao,estoque,custo) values ($1, $2, $3, $4)",
			[Number(codigo), descricao, Number(estoque), Number(custo)],
		);
		return null;
	},
	loader: async () => {
		const db = await Database.load("sqlite:data.db");
		const result = await db.select("SELECT * FROM Componente");
		return result;
	},
};

export default route;
