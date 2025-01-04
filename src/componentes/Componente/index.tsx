import Database from "@tauri-apps/plugin-sql";
import React, { useEffect, useState } from "react";
import { IComponente } from "./types";
import { Link } from "react-router-dom";
import { decimal } from "@/utils";
export default function ComponenteProducao({
	componenteProp,
}: { componenteProp: IComponente }) {
	const [descricao, setDescricao] = useState<string>();
	const [componentes, setComponentes] = useState<IComponente[]>([]);
	const [local, setLocal] = useState<IComponente>();
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
			} else {
				setLocal(queryComponente[0]);
			}
		}
		bootstrap();
	}, [descricao]);
	return (
		<React.Fragment>
			<div>{local?.codigo ?? componenteProp.codigo}</div>
			<input
				className="disabled:cursor-not-allowed"
				placeholder={componenteProp.descricao}
				type="search"
				// onEmptied={() => console.log("limpo")}
				list={componenteProp.descricao}
				disabled={componenteProp.estoque !== 0}
				onChange={(e) => setDescricao(e.target.value)}
			/>
			<datalist id={componenteProp.descricao}>
				{componentes?.map((c, i) => (
					<option key={i} value={c.descricao}>
						{c.codigo}
					</option>
				))}
			</datalist>
			<div>
				{local?.estoque == undefined &&
				componenteProp.tipo == 6 &&
				componenteProp.estoque <= 0 ? (
					<Link to={`/producao/${componenteProp.codigo}`}>
						<span>{decimal(local?.estoque ?? componenteProp.estoque, 3)}</span>
					</Link>
				) : (
					<span>{decimal(local?.estoque ?? componenteProp.estoque, 3)}</span>
				)}
			</div>
			<input
				type="number"
				max={local?.estoque ?? componenteProp.estoque}
				min={0}
				name={String(local?.codigo ?? componenteProp.codigo)}
				step="0.001"
			/>
		</React.Fragment>
	);
}
