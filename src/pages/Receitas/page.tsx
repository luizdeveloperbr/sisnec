import { IComponente } from "@/componentes/Componente/types";
import { useState } from "react";
import { Input } from "@/shadcn/ui/input";
import Database from "@tauri-apps/plugin-sql";
import {ComponenteCreateReceita} from "@/componentes/Componente";

const ReceitaPage = () => {

	const [produto, setProduto] = useState<{
		codigo: number;
		descricao: string;
	}>();

	async function findReceita(cod: any, setFunc: (arg0: any) => void) {
		// let descricaoInput = "%" + cod + "%";
		const db = await Database.load("sqlite:data.db");
		const queryComponente: IComponente[] = await db.select(
			"select * from Componente where codigo = $1",
			[cod],
		);
		setFunc(queryComponente[0]);
	}

	return (
		<div className="receita-wrap">
			<Input
				className="border-gray-600"
				onChange={(e) => findReceita(e.target.value,setProduto)}
			/>
			<div className="h-receita-descricao border-gray-600">
				{produto?.descricao}
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

			<ComponenteCreateReceita componenteProp={{codigo: 0,componente_required: 0,custo: 0,descricao: "string",embalagem: "",estoque:0,medida: 0,peso_liquido: 0,tipo: 1}} />
<div></div>
			<div className="rendimento-a">RENDIMENTO {">>>>"}</div>
				<Input className="border-gray-600" />
			{/* <div></div> */}
			<div></div>
			<div></div>
			<div>{/*money(somaTotal)*/}X</div>
		</div>
	);
};
export default ReceitaPage;
