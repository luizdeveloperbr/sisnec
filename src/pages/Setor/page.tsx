import { useLoaderData } from "react-router";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/shadcn/ui/tabs";
import Historico from "@/componentes/Historico";
import Producao from "@/componentes/Producao";
import Receita from "@/componentes/Receita";
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

export default function SetorPage() {
	const produtos =
		useLoaderData<
			{
				codigo: number;
				descricao: string;
				rendimento: number;
				componentes: IComponente[];
				historico: ProducaoType[];
			}[]
		>();
	return (
		<div className="mt-2">
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
		</div>
	);
}
