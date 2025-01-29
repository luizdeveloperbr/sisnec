import Database from "@tauri-apps/plugin-sql";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/shadcn/ui/collapsible";

import { useEffect, useState } from "react";
import { Producao as ProducaoType } from "@/componentes/Producao/types";
import { decimal } from "@/utils";
const Historico = ({ codigoInterno }: { codigoInterno: number }) => {
	const [produzido, setProduzido] = useState<ProducaoType[]>([]);
	useEffect(() => {
		async function bootstrap() {
			const db = await Database.load("sqlite:data.db");
			let result: ProducaoType[] = await db.select(
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
				[codigoInterno],
			);
			setProduzido(result);
		}
		bootstrap();
	}, []);

	return (
		<>
			{produzido.map((prod,index) => {
				const comps: {
					descricao: string;
					componente_id: number;
					medida: number;
				}[] = JSON.parse(prod.componentes);
				return (
					<Collapsible key={index} className="border border-black rounded-sm text-3xl my-1">
						<CollapsibleTrigger className="grid grid-cols-4 w-full uppercase">
							<div>{prod?.receita_codigo}</div>
							<div>{prod?.receita}</div>
							<div>{decimal(prod?.total_produzido, 3)} KG</div>
							<div>{prod.data_producao}</div>
						</CollapsibleTrigger>
						<CollapsibleContent className=" w-full uppercase text-center">
							{comps.map((item) => (
								<div className="grid grid-cols-4 bg-slate-100 border" key={item.componente_id}>
									<div>{item.componente_id}</div>
									<div className="text-left">{item.descricao}</div>
									<div>{decimal(item.medida, 3)} KG</div>
									<div>-</div>
								</div>
							))}
						</CollapsibleContent>
					</Collapsible>
				);
			})}
		</>
	);
};
export default Historico;
