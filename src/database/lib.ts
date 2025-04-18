import Database from "@tauri-apps/plugin-sql";
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
		"SELECT Componente.embalagem,Componente_Receita.componente_required, Componente.tipo ,Componente.estoque, Componente.custo, Componente.codigo, Componente.descricao, Componente.peso_liquido, Componente_Receita.medida FROM Componente_Receita JOIN Componente ON Componente_Receita.componente_codigo = Componente.codigo WHERE Componente_Receita.receita_codigo = $1;",
		[codigoInterno],
	);
	return data;
}

export async function getHistorico(codigoInterno: number) {
	const db = await Database.load("sqlite:data.db");
	const data: ProducaoType[] = await db.select(
		`
			SELECT  
				p.codigo AS receita_codigo,
				p.data AS data_producao,
				cc.descricao AS receita,
				cc.embalagem AS embalagem,
				p.total_produzido,
				'[' || GROUP_CONCAT(
					'{"componente_id":' || p.componente_id || 
					',"descricao":"' || c.descricao || '"' || 
					',"embalagem":"' || c.embalagem || '"' || 
					',"peso_liquido":"' || c.peso_liquido || '"' || 
					',"medida":' || p.medida || 
					'}'
				) || ']' AS componentes
			FROM Producao p
			JOIN Componente cc ON p.codigo = cc.codigo
			JOIN Componente c ON p.componente_id = c.codigo
			WHERE p.codigo = $1
			GROUP BY p.codigo, p.data;

`,
		[codigoInterno],
	);

	return data;
}
export async function findComponente(
	codigo: string,
	fnLocal: (arg0: any) => void,
) {
	const db = await Database.load("sqlite:data.db");
	const queryComponente: IComponente[] = await db.select(
		"select * from Componente where codigo = $1",
		[codigo],
	);
	fnLocal(queryComponente[0]);
}
