import "./Producao.css";
import { Button } from "@/shadcn/ui/button";
import Componente from "@/componentes/Componente";
import { IComponente } from "@/componentes/Componente/types";
import { useFetcher } from "react-router-dom";

const ProducaoComponente = ({
	produto,
}: {
	produto: { codigo: number; descricao: string; componentes: IComponente[] };
}) => {
	const fetcher = useFetcher();

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = event.currentTarget;
		fetcher.submit(form);
		form.reset();
	};

	return (
		<fetcher.Form
			method="post"
			className="producao-wrap"
			onSubmit={handleSubmit}
		>
			<input type="hidden" name="receita" defaultValue={produto?.codigo} />
			<h2 className="border-black border">{produto?.codigo}</h2>
			<h2 className="border-black border">{produto?.descricao}</h2>
			<div className="head-title-padrao">estoque</div>
			<div>
				<label htmlFor="prod">Produzido</label>
			</div>
			<div>codigo</div>
			<div>descrição</div>
			<input
				id="prod"
				name="total_produzido"
				required
				type="number"
				step="0.001"
			/>
			{produto.componentes?.map((componente) => {
				return (
					<Componente key={componente.codigo} componenteProp={componente} />
				);
			})}
			<div className="producao-rendimento">RENDIMENTO {">>>>"}</div>
			<div>X</div>
			<Button type="submit" variant="outline" className="submt bg-slate-200">
				Salvar
			</Button>
		</fetcher.Form>
	);
};
export default ProducaoComponente;
