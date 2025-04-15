import "./Receita.css";
import { useState, useRef } from "react";
import { useFetcher, useLoaderData } from "react-router";
// import Database from "@tauri-apps/plugin-sql";
import { decimal, money } from "@/utils";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";

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

const ReceitaPage = () => {
	const [receita] =
		useState<Pick<IComponente, "codigo" | "descricao">>();
	const [local, setLocal] = useState<IComponente>();
	const [componentes, setComponentes] = useState<IComponente[]>([]);

	const medida = useRef<HTMLInputElement>(null);
	const fetcher = useFetcher();

	const allReceitas = useLoaderData<{ total: number }>();

	// async function findComponente(cod: string, setFunc: (arg0: any) => void) {
	// 	const db = await Database.load("sqlite:data.db");
	// 	const queryComponente: IComponente[] = await db.select(
	// 		"select * from Componente where codigo = $1",
	// 		[cod],
	// 	);
	// 	setFunc(queryComponente[0]);
	// }

	// async function findReceita(cod: any, setFunc: (arg0: any) => void) {
	// 	const db = await Database.load("sqlite:data.db");
	// 	const queryComponente: IComponente[] = await db.select(
	// 		"select * from Componente where codigo = $1",
	// 		[cod],
	// 	);
	// 	setFunc(queryComponente[0]);
	// }

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		fetcher.submit(event.currentTarget);
		return;
	}

	function handleAddComponent() {
		let medidaValue = medida.current?.valueAsNumber;
		let data = Object.assign({ medida: medidaValue }, local);
		setComponentes((old) => [...old, data]);
		setLocal(undefined);
	}

	return (
		<fetcher.Form method="post" onSubmit={handleSubmit}>
			<div className="flex justify-center mt-[10px]">
				<select className="border border-black rounded h-10" name="secao">
					<option value="35">padaria</option>
					<option value="96">material de uso</option>
					<option value="95" selected>atelier</option>
				</select>
				<span>{allReceitas.total}</span>
			</div>
			<div className="form-wrap">
				<Input
					className="border-gray-600"
					name="codigo"
					required
					// onChange={(e) => findReceita(e.target.value, setReceita)}
				/>
				<div className="h-receita-descricao border-gray-600">
					{receita?.descricao}
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
				<div>*</div>
				<div>*</div>
				<div className="h-componente-codigo">codigo</div>
				<div className="h-componente-descricao">descrição</div>
				{componentes?.map((componente) => (
					<>
						<div key={componente.codigo}>{componente.codigo}</div>
						<Input
							name={componente?.codigo.toString()}
							defaultValue={componente.medida}
							type="hidden"
						/>
						<div>{componente.descricao}</div>
						<div>{componente.embalagem}</div>
						<div>{componente.peso_liquido}</div>
						<div>{componente.medida}</div>
						<div>{money(componente.custo)}</div>
						<div>{money(componente.medida * componente.custo)}</div>
						<div>***</div>
					</>
				))}
				<Input
					className="border-gray-600 text-center"
					// onChange={(e) => findComponente(e.target.value, setLocal)}
				/>
				<Input
					className="placeholder:text-black border-gray-600"
					placeholder={local?.descricao}
					type="text"
					disabled
				/>
				<div>{local?.embalagem}</div>
				<div>{decimal(local?.peso_liquido || 0, 3)}</div>
				<Input
					type="number"
					step="0.001"
					required
					className="border-gray-600"
					ref={medida}
				/>
				<div>{money(local?.custo || 0)}</div>
				<div></div>
				<Button
					disabled={local?.codigo == undefined}
					type="button"
					onClick={handleAddComponent}
				>
					add
				</Button>
				<div></div>
				<div className="rendimento-a">RENDIMENTO {">>>>"}</div>
				<Input
					className="border-gray-600"
					type="number"
					step="0.001"
					name="rendimento"
					required
				/>
				<div></div>
				<Button type="submit">Criar</Button>
				<div>{/*money(somaTotal)*/}X</div>
			</div>
		</fetcher.Form>
	);
};
export default ReceitaPage;
