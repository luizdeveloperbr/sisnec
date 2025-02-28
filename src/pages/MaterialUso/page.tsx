import { IComponente } from "@/componentes/Componente/types";
import { Producao as ProducaoType } from "@/componentes/Producao/types";
import Historico from "@/componentes/Historico";
import Producao from "@/componentes/Producao";
import Receita from "@/componentes/Receita";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/shadcn/ui/tabs";

import { useLoaderData } from "react-router-dom";

export default function PadariaPage() {
	const produtos =
		useLoaderData<
			{
				codigo: number;
				descricao: string;
				rendimento: number;
				componentes: IComponente[];
				historico: ProducaoType[]
			}[]
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
						<Historico produto={produto} />
					</TabsContent>
				</Tabs>
			))}
		</>
	);
}
