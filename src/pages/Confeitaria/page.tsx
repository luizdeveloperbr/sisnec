import { IComponente } from "@/componentes/Componente/types";
import Producao from "@/componentes/Producao";
import Receita from "@/componentes/Receita"
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/shadcn/ui/tabs";
import Database from "@tauri-apps/plugin-sql";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Producao as ProducaoType} from "@/componentes/Producao/types";

const Historico = ({codigoInterno}:{codigoInterno: number}) => {
	const [produzido, setProduzido] = useState<ProducaoType[]>([])
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
		
		`,[codigoInterno]);
		setProduzido(result)
			}
			bootstrap()
	},[])

	return(
		<ul>
			{produzido.map(prod => <li>{prod?.receita_codigo} | {prod?.receita} | {prod?.total_produzido}</li>)}
		</ul>
	)
}

export default function ConfeitariaPage() {
	const produtos =
		useLoaderData<
			{ codigo: number; descricao: string; rendimento: number; componentes: IComponente[] }[]
		>();
	return (
		<>
			{produtos.map((produto) => (
				<Tabs key={produto.codigo} defaultValue="producao">
					<TabsList className="flex justify-center">
						<TabsTrigger value="receita">Receita</TabsTrigger>
						<TabsTrigger value="producao">Produção</TabsTrigger>
						<TabsTrigger value="historico">Histórico Produzido</TabsTrigger>
					</TabsList>
					<TabsContent value="receita">
						<Receita produto={produto} />
					</TabsContent>
					<TabsContent value="producao">
						<Producao produto={produto} />
					</TabsContent>
					<TabsContent value="historico">
						<Historico codigoInterno={produto.codigo} />
					</TabsContent>
				</Tabs>
			))}
		</>
	);
}
