import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/shadcn/ui/collapsible";
import './Historico.css'
import { Producao as ProducaoType } from "@/componentes/Producao/types";
import { decimal } from "@/utils";
// import {parse}  from "date-fns/fp";

const Historico = ({ produto }: { produto: { historico: ProducaoType[] } }) => {
	// let date = parse(produto.historico[1].data_producao,'t')
	// console.log(date.toString())
	return (
		<>
			{produto.historico.length !== 0 ? produto.historico.map((prod, index) => {
				const comps: {
					descricao: string;
					componente_id: number;
					medida: number;
				}[] = JSON.parse(prod.componentes);

				return (
					<Collapsible
						key={index}
						className="border border-black rounded-sm text-3xl my-1"
					>
						<CollapsibleTrigger className="grid grid-cols-historico w-full uppercase">
							<div>{prod.receita_codigo}</div>
							<div>{prod.receita}</div>
							<div>{decimal(prod.total_produzido, 3)} KG</div>
							<div>{prod.data_producao}</div>
						</CollapsibleTrigger>
						<CollapsibleContent className="uppercase text-center">
							{comps.map((item) => (
								<div
									className="grid item grid-cols-historico border"
									key={item.componente_id}
								>
									<div>{item.componente_id}</div>
									<div className="text-left">{item.descricao}</div>
									<div>{decimal(item.medida, 3)} KG</div>
									<div>-</div>
								</div>
							))}
						</CollapsibleContent>
					</Collapsible>
				);
			}): <div className="text-center w-full border border-black mb-2"><h2>SEM HISTORICO DE PRODUÇÃO</h2></div>}
		</>
	);
};
export default Historico;
