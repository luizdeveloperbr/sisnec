import Database from "@tauri-apps/plugin-sql";
import React, { useEffect, useState } from "react";
import Decimal from "../Decimal";
import { IComponente } from "./Componente.types";
export default function ComponenteProducao({
	componente,
	form,
}: { componente: IComponente; form: any }) {
	const [descricao, setDescricao] = useState<string>();
	const [medida, setMedida] = useState<number>();
	const [componentes, setComponentes] = useState<IComponente[]>([]);
	// procurar pela descrição
	useEffect(() => {
		async function bootstrap() {
			let descricaoInput = "%" + descricao + "%";
			const db = await Database.load("sqlite:data.db");
			const queryComponente: IComponente[] = await db.select(
				"select * from Componente where descricao like $1",
				[descricaoInput],
			);
			if (queryComponente.length !== 0) {
				setComponentes(queryComponente);
			}
		}
		bootstrap();
	}, [descricao]);
	return (
		<React.Fragment>
			<input
				type="number"
				value={componentes[0]?.codigo ?? componente.codigo}
				readOnly
			/>
			{componente.tipo == 6 && componente.estoque <= 0 ? (
				<a>{componente.descricao}</a>
			) : (
				<input
					placeholder={componente.descricao}
					type="text"
					list={componente.descricao}
					readOnly={componente.estoque !== null}
					onChange={(e) => setDescricao(e.target.value)}
				/>
			)}
			<datalist id={componente.descricao}>
				{componentes?.map((c, i) => (
					<option key={i} value={c.descricao}>
						{c.codigo}
					</option>
				))}
			</datalist>
			<div>
				<Decimal value={componente.estoque} digitos={3} />
			</div>
			<input
				type="number"
				max={componente.estoque}
				min={0}
				step="0.001"
				{...form.register(`${componentes[0]?.codigo ?? componente.codigo} `, {
					value: medida,
				})}
				onChange={(e) => setMedida(Number(e.target.value))}
			/>
		</React.Fragment>
	);
}
