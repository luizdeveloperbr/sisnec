import Database from "@tauri-apps/plugin-sql";
import ProducaoPage from "@/pages/Producao";
import { RouteObject } from "react-router";
import { Producao } from "@/componentes/Producao/types";

const route: RouteObject = {
	path: "produzido",
	Component: ProducaoPage,
	loader: async () => {
		const db = await Database.load("sqlite:data.db");
		let result: Producao[] = await db.select(
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
            GROUP BY p.codigo, p.data;

`,
		);
		return result;
	},
};
export default route;
