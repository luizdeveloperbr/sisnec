import Database from "@tauri-apps/plugin-sql";
import React, { useEffect, useState } from "react";
import Decimal from "../Decimal";
import { IComponente } from "./Componente.types";
import { UseFormReturn } from "react-hook-form";
export default function ComponenteProducao({
	componenteProp,
	formCtx,
}: { componenteProp: IComponente; formCtx: UseFormReturn }) {
	const [descricao, setDescricao] = useState<string>();
	const [medida, setMedida] = useState<number>();
	const [componentes, setComponentes] = useState<IComponente[]>([]);
	const [local, setLocal] = useState<IComponente>()
	// procurar pela descrição
	useEffect(() => {
		async function bootstrap() {
			let descricaoInput = "%" + descricao + "%";
			const db = await Database.load("sqlite:data.db");
			const queryComponente: IComponente[] = await db.select(
				"select * from Componente where descricao like $1",
				[descricaoInput],
			);
			if (queryComponente.length !== 1) {
				setComponentes(queryComponente);
			}else{
				setLocal(queryComponente[0])
			}
		}
		bootstrap();
	}, [descricao]);
	return (
		<React.Fragment>
				<div>{local?.codigo ?? componenteProp.codigo}</div>
			{componenteProp.tipo == 6 && componenteProp.estoque <= 0 ? (
				<a>{componenteProp.descricao}</a>
			) : (
				<input
					placeholder={componenteProp.descricao}
					type="text"
					list={componenteProp.descricao}
					disabled={componenteProp.estoque !== 0}
					onChange={(e) => setDescricao(e.target.value)}
				/>
			)}
			<datalist id={componenteProp.descricao}>
				{componentes?.map((c, i) => (
					<option key={i} value={c.descricao}>
						{c.codigo}
					</option>
				))}
			</datalist>
			<div>
				<Decimal value={local?.estoque ?? componenteProp.estoque} digitos={3} />
			</div>
			<input
				type="number"
				max={local?.estoque ?? componenteProp.estoque}
				min={0}
				step="0.001"
				{...formCtx.register(`${local?.codigo ?? componenteProp.codigo} `, {
					value: medida,
				})}
				onChange={(e) => setMedida(Number(e.target.value))}
			/>
		</React.Fragment>
	);
}
