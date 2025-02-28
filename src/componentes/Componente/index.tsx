import Database from "@tauri-apps/plugin-sql";
import React, { useEffect, useState, useRef } from "react";
import { IComponente } from "./types";
import { Link } from "react-router-dom";
import { decimal, money } from "@/utils";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
export function ComponenteProducao({
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

export function ComponenteCreateReceita({
	componenteProp,
}: { componenteProp: IComponente }) {
	const [descricao, setDescricao] = useState<string>();
	const [local, setLocal] = useState<IComponente>();
	const [componentes,  setComponentes] = useState<IComponente[]>([])

	const medida = useRef<HTMLInputElement>(null)

	useEffect(() => {
		async function bootstrap() {
			// let descricaoInput = "%" + descricao + "%";
			const db = await Database.load("sqlite:data.db");
			const queryComponente: IComponente[] = await db.select(
				"select * from Componente where codigo = $1",
				[descricao],
			);
			setLocal(queryComponente[0]);
		}
		bootstrap();
	}, [descricao]);

	function handleAddComponent() {
		let med = Number(medida.current?.value.replace(",", "."))
		let data = Object.assign({medida: med}, local)
		console.log("local", local)
		setComponentes(old => [...old, data])
		setLocal(undefined)
	}

	return (
		<React.Fragment>
			{componentes?.map(i => <>
					<div key={i.codigo}>{i.codigo}</div>
					<div>{i.descricao}</div>
					<div>{i.embalagem}</div>
					<div>{i.peso_liquido}</div>
					<div>{i.medida}</div>
					<div>{money(i.custo)}</div>
					<div>{money(i.custo / i.medida)}</div>
					<div>***</div>
				</>)}
			<Input
				className="border-gray-600 text-center"
				onChange={(e) => setDescricao(e.target.value)}
				onKeyDown={e => {
					if(e.key === "Enter"){
						console.log("enter")
						medida.current?.focus()
					}
				}}
			/>
			<Input
				className="placeholder:text-black border-gray-600"
				placeholder={local?.descricao ?? componenteProp.descricao}
				type="text"
				disabled
			/>
			<div>{local?.embalagem}</div>
			<div>{decimal(local?.peso_liquido || 0, 3)}</div>
			<Input
				// placeholder="quantidade"
				step="0.001"
				className="border-gray-600"
				ref={medida}
			// value={decimal(local?.estoque ?? componenteProp.estoque, 3)}
			/>
			<div>{money(local?.custo || 0)}</div>
			<div></div>
			<Button onClick={handleAddComponent}>+</Button>
		</React.Fragment>
	);
}