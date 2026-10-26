import Database from "@tauri-apps/plugin-sql";
import { RouteObject } from "react-router-dom";
import CadastroPage from "./page";
import { format } from "date-fns";
const route: RouteObject = {
	path: "/cadastro",
	Component: CadastroPage,
	action: async ({ request }) => {
		const formdata = await request.formData();
		const codigo = formdata.get("codigo");
		const estoque = formdata.get("estoque");
		const timestamp = format(new Date(), "yyyy-MM-dd H:mm:ss");
		const db = await Database.load("sqlite:data.db");
		// console.log("cadastro", {codigo, estoque})
		await db.execute(
			"update Componente set estoque = estoque + $1, data = $2 where codigo = $3",
			[Number(estoque), timestamp, Number(codigo)],
		);
		return null;
	},
	loader: async () => {
		const timestamp = format(new Date(), "yyyy-MM-dd");
		const db = await Database.load("sqlite:data.db");
		const result = await db.select(
			"SELECT * FROM Componente where data >= datetime($1);",
			[timestamp],
		);
		return result;
	},
};

export default route;
