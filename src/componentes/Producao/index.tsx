import Database from "@tauri-apps/plugin-sql";
import { useEffect, useState } from "react";
import {
	useForm,
	FormProvider,
	SubmitHandler,
	FieldValues,
} from "react-hook-form";
import Componente from "../Componente";
import "./Producao.css";
import { getReceita } from "../../database/lib";
import { format } from "date-fns";
export interface IReceita {
	codigo: number;
	descricao: string;
	rendimento: number;
}

export interface IComponente {
	codigo: number;
	descricao: string;
	peso_liquido: number;
	medida: number;
	custo: number;
	estoque: number;
	tipo: number;
}

const Producao = ({ codigoInterno }: { codigoInterno: number }) => {
	const [receita, setReceita] = useState<IReceita>();
	const [componentes, setComponentes] = useState<IComponente[]>([]);
	const [total_produzido, setTotalProduzido] = useState<number>();

	const handleProducao: SubmitHandler<FieldValues> = async (formData) => {
		const db = await Database.load("sqlite:data.db");
		let timestamp = format(new Date(),"dd-MM-yyyy");
		let componentes = Object.entries(formData);
		let filterComponentes = componentes.filter(
			(e) => e[0] !== "total_produzido",
		);
		filterComponentes.forEach(async (e) => {
			let [componente_id, medida] = e;
			await db.execute(
				"insert into Producao(codigo, total_produzido, componente_id, medida, data) values ($1, $2, $3, $4, $5)",
				[
					codigoInterno,
					formData.total_produzido,
					componente_id,
					medida,
					timestamp,
				],
			);
		});
	};

	// função de inserção da produção no banco de dados
	const methods = useForm();
	useEffect(() => {
		async function bootstrap() {
			const db = await Database.load("sqlite:data.db");
			const receitas = await getReceita(codigoInterno)
			setReceita(receitas)
			setComponentes(
				await db.select(
					"SELECT Componente.tipo ,Componente.estoque, Componente.custo, Componente.codigo, Componente.descricao, Componente.peso_liquido, Componente_Receita.medida FROM Componente_Receita JOIN Componente ON Componente_Receita.componente_codigo = Componente.codigo WHERE Componente_Receita.receita_codigo = $1;",
					[codigoInterno],
				),
			);
		}
		bootstrap();
	}, [codigoInterno]);

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={methods.handleSubmit(handleProducao)}
				className="producao-wrap"
			>
				<div>
					<h2>{receita?.codigo}</h2>
				</div>
				<div>
					<h2>{receita?.descricao}</h2>
				</div>
				<div className="head-title-padrao">estoque</div>
				<div>
					<label htmlFor="prod">Produzido</label>
				</div>
				<div>codigo</div>
				<div>descrição</div>
				<input
					id="prod"
					type="number"
					step="0.001"
					{...methods.register("total_produzido", { value: total_produzido })}
					onChange={(e) => setTotalProduzido(Number(e.target.value))}
				/>
				{componentes?.map((componente) => {
					return (
						<Componente
							key={componente.codigo}
							componente={componente}
							form={methods}
						/>
					);
				})}
				<div className="producao-rendimento">RENDIMENTO {">>>>"}</div>
				<div>X</div>
				<button type="submit" className="submt">
					Salvar
				</button>
			</form>
		</FormProvider>
	);
};
export default Producao;
