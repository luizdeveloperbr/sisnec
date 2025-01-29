import { IComponente } from "@/componentes/Componente/types";
import { useState } from "react";
import { Input } from "@/shadcn/ui/input";
import Database from "@tauri-apps/plugin-sql";
import {ComponenteCreateReceita} from "@/componentes/Componente";

const ReceitaPage = () => {
	const [componenteReceita, setComponenteReceita] = useState<IComponente[]>([]);
	const [componente, setComponente] = useState<IComponente>();
	const [produto, setProduto] = useState<{
		codigo: number;
		descricao: string;
	}>();

	function handleNewComponente() {
		setComponenteReceita((old) => [componente, ...old]);
	}

	async function findReceita(cod: any, setFunc: (arg0: any) => void) {
		let descricaoInput = "%" + cod + "%";
		const db = await Database.load("sqlite:data.db");
		const queryComponente: IComponente[] = await db.select(
			"select * from Componente where codigo like $1",
			[descricaoInput],
		);
		setFunc(queryComponente[0]);
	}

	return (
		<div className="receita-wrap">
			<Input
				className="h-receita-codigo w-40 border-gray-600"
				placeholder="cod_receita"
				onChange={(e) => findReceita(e.target.value,setProduto)}
			/>
			<div className="h-receita-descricao border-gray-600">
				{produto?.descricao ?? "S/DESCRICAO"}
			</div>
			<div className="h-embalagem-tipo">embalagem</div>
			<div className="h-quantidade">QNT</div>
			<div className="h-custo-embalagem">
				custo
				<br />
				unidade
			</div>
			<div className="h-porc-emb-rms">
				custo <br /> produzido
			</div>
			<div className="h-custo-produzido">*</div>
			<div className="h-componente-codigo">codigo</div>
			<div className="h-componente-descricao">descrição</div>

			<ComponenteCreateReceita componenteProp={{codigo: 0,custo: 0,descricao: "string",embalagem: "",estoque:0,medida: 0,peso_liquido: 0,tipo: 1}} />

		</div>
	);
};
export default ReceitaPage;
