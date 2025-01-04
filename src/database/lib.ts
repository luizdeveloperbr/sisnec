import Database from "@tauri-apps/plugin-sql";
import { IReceita } from "@/componentes/Receita/types";
import { IComponente } from "@/componentes/Componente/types";

export async function getReceita(codigoInterno: number) {
	const db = await Database.load("sqlite:data.db");
	const data: IReceita[] = await db.select(
		"SELECT Componente.codigo, Componente.descricao, Receita.rendimento FROM Receita JOIN Componente ON Receita.codigo = Componente.codigo WHERE Componente.codigo = $1;",
		[codigoInterno],
	);
	return data[0];
}
export async function getComponente(codigoInterno: number) {
	const db = await Database.load("sqlite:data.db");
	const data: IComponente[] = await db.select(
		"SELECT Componente.embalagem, Componente.tipo ,Componente.estoque, Componente.custo, Componente.codigo, Componente.descricao, Componente.peso_liquido, Componente_Receita.medida FROM Componente_Receita JOIN Componente ON Componente_Receita.componente_codigo = Componente.codigo WHERE Componente_Receita.receita_codigo = $1;",
		[codigoInterno],
	);
	return data;
}
