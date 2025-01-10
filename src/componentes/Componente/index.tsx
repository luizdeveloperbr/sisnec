import Database from "@tauri-apps/plugin-sql";
import React, { useEffect, useState } from "react";
import { IComponente } from "./types";
import { Link } from "react-router-dom";
import { decimal } from "@/utils";
import { Input } from "@/shadcn/ui/input";
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
			<Input
				className="border-gray-600 text-center"
				value={local?.codigo ?? componenteProp.codigo}
				disabled
			/>
			<Input
				className="placeholder:text-black border-gray-600"
				placeholder={componenteProp.descricao}
				type="search"
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
			{/* <div> */}
			{local?.estoque == undefined &&
			componenteProp.tipo == 6 &&
			componenteProp.estoque <= 0 ? (
				<Link
					className="border border-gray-600 rounded-md"
					to={`/producao/${componenteProp.codigo}`}
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
			{/* </div> */}
			<Input
				type="number"
				className="border-gray-600"
				max={local?.estoque ?? componenteProp.estoque}
				min={0}
				name={String(local?.codigo ?? componenteProp.codigo)}
				step="0.001"
			/>
		</React.Fragment>
	);
}
