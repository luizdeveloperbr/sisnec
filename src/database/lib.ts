import { neon } from "@neondatabase/serverless";
let sql = neon(import.meta.env.VITE_NEON_URL as string)
import { drizzle } from "drizzle-orm/neon-http"

const db = drizzle({client: sql})
// import { IReceita } from "@/componentes/Receita/types";
// import { Producao as ProducaoType } from "@/componentes/Producao/types";
// interface IComponente {
// 	codigo: number;
// 	descricao: string;
// 	peso_liquido: number;
// 	medida: number;
// 	custo: number;
// 	estoque: number;
// 	embalagem: string;
// 	componente_required: number;
// 	tipo: number;
// }

export async function getReceita(codigoInterno: number) {
	const data = await db.execute(
		`SELECT Componente.codigo, Componente.descricao, Receita.rendimento FROM Receita JOIN Componente ON Receita.codigo = Componente.codigo WHERE Componente.codigo = ${codigoInterno};`,
	);
	return data.rows[0];
}

export async function getComponente(codigoInterno: number) {
	const data = await db.execute(
		`SELECT Componente.embalagem,Componente_Receita.componente_required, Componente.tipo ,Componente.estoque, Componente.custo, Componente.codigo, Componente.descricao, Componente.peso_liquido, Componente_Receita.medida FROM Componente_Receita JOIN Componente ON Componente_Receita.componente_codigo = Componente.codigo WHERE Componente_Receita.receita_codigo = ${codigoInterno};`	);
	return data.rows;
}

export async function getHistorico(codigoInterno: number) {
	const data = await db.execute(
		`SELECT  
            p.codigo AS receita_codigo,
            p.data AS data_producao,
            cc.descricao AS receita,
            cc.embalagem AS embalagem,
            p.total_produzido,
            '[' || STRING_AGG(
                '{"componente_id":' || p.componente_id || 
                ',"descricao":"' || c.descricao || '"' || 
                ',"embalagem":"' || c.embalagem || '"' || 
                ',"peso_liquido":"' || c.peso_liquido || '"' || 
                ',"medida":' || p.medida || 
                '}', 
                ','
            ) || ']' AS componentes
        FROM Producao p
        JOIN Componente cc ON p.codigo = cc.codigo
        JOIN Componente c ON p.componente_id = c.codigo
        WHERE p.codigo = ${codigoInterno}
        GROUP BY p.codigo, p.data, cc.descricao, cc.embalagem, p.total_produzido;
`	);

	return data.rows;
}

export async function insertProducaoComponentes(values: any){
    console.log("values", values)
     await db.execute(`INSERT INTO Producao (codigo, total_produzido, componente_id, medida, data) VALUES (${values.receita}, ${values.total_produzido}, ${values.componente_id}, ${values.medida}, ${values.data})`);
}

export async function updateComponente(values: any){
     await db.execute(
        `UPDATE Componente SET estoque = estoque - ${values.medida} WHERE codigo = ${values.componente_id}`	);
}

export async function insertProducaoReceita(values: any){
     await db.execute(
        `UPDATE Componente SET estoque = estoque + ${values.total_produzido} WHERE codigo = ${values.receita}`	);
}

// export async function findComponente(
// 	codigo: string,
// 	fnLocal: (arg0: any) => void,
// ) {
// 	const db = await Database.load("sqlite:data.db");
// 	const queryComponente: IComponente[] = await db.select(
// 		"select * from Componente where codigo = $1",
// 		[codigo],
// 	);
// 	fnLocal(queryComponente[0]);
// }
