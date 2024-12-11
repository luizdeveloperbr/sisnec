import { SubmitHandler, useForm } from "react-hook-form";
import Database from "@tauri-apps/plugin-sql";
import { IComponente } from "./Componente/Componente.types";
import { useEffect, useState } from "react";
export default function AdicionarComponente(props: { receita: number }) {
	const [componente, setComponente] = useState<IComponente[]>();
	const [descricao, setDescricao] = useState<string>();

	const { register, handleSubmit } = useForm<{ medida: number }>();

	const addComponente: SubmitHandler<{ medida: number }> = async (formData: {
		medida: number;
	}) => {
		const receita = props.receita;
		const medida = Number(formData.medida);

		const db = await Database.load("sqlite:data.db");
		const queryCodigo: IComponente[] = await db.select(
			"select codigo from Componente where descricao = $1",
			[descricao],
		);
		const { codigo } = queryCodigo[0];
		if (queryCodigo.length > 0) {
			const insert = await db.execute(
				"insert into Componente_Receita(receita_codigo, componente_codigo, medida) values ($1, $2, $3)",
				[receita, codigo, medida],
			);
			insert.rowsAffected == 1 ? alert("success") : null;
		} else {
			throw Error("compoente não existe");
		}
	};

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
				setComponente(queryComponente);
			}
		}
		bootstrap();
	}, [descricao]);

	return (
		<form
			onSubmit={handleSubmit(addComponente)}
			style={{ maxWidth: "fit-content" }}
		>
			<fieldset
				style={{ display: "grid", gap: "2px", gridTemplateColumns: "3fr 1fr" }}
			>
				<legend>Adicionar Componente</legend>
				<input
					placeholder="pesquise a produto"
					type="text"
					list="dbComponentes"
					onChange={(e) => setDescricao(e.target.value)}
				/>
				<datalist id="dbComponentes">
					{componente?.map((c) => (
						<option key={c.codigo} value={c.descricao}>
							{c.codigo}
						</option>
					))}
				</datalist>
				<button type="reset">X</button>
				{/* <div> */}
				<input
					placeholder="quantidade"
					type="number"
					step="0.001"
					required
					{...register("medida")}
				/>
				<button type="submit">+</button>
				{/* </div> */}
			</fieldset>
		</form>
	);
}
