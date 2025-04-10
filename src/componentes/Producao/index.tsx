import React, { useState } from "react";
import "./Producao.css";
import { Button } from "@/shadcn/ui/button";
import { Link, useFetcher } from "react-router-dom";
import { Input } from "@/shadcn/ui/input";
// import Database from "@tauri-apps/plugin-sql";
import { decimal } from "@/utils";

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

function ComponenteProducao({
	componenteProp,
}: { componenteProp: IComponente }) {
	const [componentes] = useState<IComponente[]>([]);
	const [local] = useState<IComponente>();

	// async function findComponente(
	// 	e: any,
	// 	fnComponente: (arg0: any) => void,
	// 	fnLocal: (arg0: any) => void,
	// ) {
	// 	let descricaoInput = "%" + e + "%";
	// 	const db = await Database.load("sqlite:data.db");
	// 	const queryComponente: IComponente[] = await db.select(
	// 		"select * from Componente where descricao like $1",
	// 		[descricaoInput],
	// 	);
	// 	if (queryComponente.length !== 1) {
	// 		fnComponente(queryComponente);
	// 	} else {
	// 		fnLocal(queryComponente[0]);
	// 	}
	// }

	return (
		<React.Fragment>
			<Input
				className="border-gray-600 text-center"
				value={local?.codigo ?? componenteProp.codigo}
				disabled
			/>
			<Input
				className="text-cyan-600 placeholder:text-black border-gray-600"
				placeholder={componenteProp.descricao}
				type="search"
				list={componenteProp.descricao}
				disabled={componenteProp.estoque !== 0}
				// onChange={(e) =>
				// 	findComponente(e.target.value, setComponentes, setLocal)
				// }
			/>
			<datalist id={componenteProp.descricao}>
				{componentes?.map((c, i) => (
					<option key={i} value={c.descricao}>
						{c.codigo}
					</option>
				))}
			</datalist>
			{local?.estoque == undefined &&
			componenteProp.tipo == 6 &&
			componenteProp.estoque <= 0 ? (
				<Link
					className="border border-gray-600 rounded-md"
					to={`/produto/${componenteProp.codigo}`}
				>
					<span
						className={
							(local?.estoque ?? componenteProp.estoque)
								? " text-center"
								: "text-red-600 text-center"
						}
					>
						{decimal(local?.estoque ?? componenteProp.estoque, 3)}
					</span>
				</Link>
			) : (
				<Input
					className={
						(local?.estoque ?? componenteProp.estoque)
							? "border-gray-600 text-center"
							: "text-red-600 border-gray-600 text-center"
					}
					disabled
					value={decimal(local?.estoque ?? componenteProp.estoque, 3)}
				/>
			)}
			<Input
				type="number"
				className="border-gray-600"
				required={Boolean(componenteProp.componente_required)}
				max={local?.estoque ?? componenteProp.estoque}
				min={0}
				name={String(local?.codigo ?? componenteProp.codigo)}
				step="0.001"
			/>
		</React.Fragment>
	);
}

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
			<Input
				id="prod"
				className="border-gray-600"
				name="total_produzido"
				required
				type="number"
				step="0.001"
			/>
			{produto.componentes?.map((componente) => {
				return (
					<ComponenteProducao
						key={componente.codigo}
						componenteProp={componente}
					/>
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
