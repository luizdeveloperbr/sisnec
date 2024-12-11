import "./Producao.css";
import Database from "@tauri-apps/plugin-sql";
import { useEffect, useState } from "react";
import {
	useForm,
	FormProvider,
	SubmitHandler,
	FieldValues,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Componente from "../Componente";
import { IComponente } from "../Componente/Componente.types";
import { IReceita } from "../Receita/Receita.types";
import { getComponente, getReceita } from "../../database/lib";
import { Input } from "@/components/ui/input";

const Producao = ({codigoInterno}: {codigoInterno: number}) => {
	const [receita, setReceita] = useState<IReceita>();
	const [componentes, setComponentes] = useState<IComponente[]>([]);
	const [total_produzido, setTotalProduzido] = useState<number>();

	const handleProducao: SubmitHandler<FieldValues> = async (formData) => {
		const db = await Database.load("sqlite:data.db");
		console.log("formdata",formData)
		console.log("componentes",componentes)
		let timestamp = format(new Date(),"dd-MM-yyyy pp");
		let Lcomponentes = Object.entries(formData);
		let filterComponentes = Lcomponentes.filter(
			(e) => e[0] !== "total_produzido",
		);
		console.log("funcSubmit", JSON.stringify(filterComponentes))
		filterComponentes.forEach(async (e) => {
			let [componente_id, medida] = e
			console.log("medida", Boolean(medida))
			if(Boolean(medida)){
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
		}
			await db.execute("update Componente set estoque = estoque + $1 WHERE codigo = $2",[formData.total_produzido, codigoInterno])
		});
	};

	const formContext = useForm();

	useEffect(() => {
		async function bootstrap(){
			setReceita(await getReceita(codigoInterno))
			setComponentes([])
			let newComponentes = await getComponente(codigoInterno)
			setComponentes(newComponentes)	
		}
		bootstrap()
		console.log("useEffect",componentes)
	},[codigoInterno])

	return (
		<FormProvider {...formContext}>
			<form
				onSubmit={formContext.handleSubmit(handleProducao)}
				className="producao-wrap"
			>
					<h2 className="border-black border">{receita?.codigo}</h2>
					<h2 className="border-black border">{receita?.descricao}</h2>
				<div className="head-title-padrao">estoque</div>
				<div>
					<label htmlFor="prod">Produzido</label>
				</div>
				<div>codigo</div>
				<div>descrição</div>
				<input
					id="prod"
					required
					type="number"
					step="0.001"
					{...formContext.register("total_produzido", { value: total_produzido })}
					onChange={(e) => setTotalProduzido(Number(e.target.value))}
				/>
				{componentes?.map((componente) => {
					return (
						<Componente
							key={componente.codigo}
							componenteProp={componente}
							formCtx={formContext}
						/>
					);
				})}
				<div>97152</div>
				<div>Reaproveitamento</div>
				<div>?</div>
				<Input {...formContext.register("99999")} className="shadow-md border-gray-600" placeholder="0,000"/>
				<div className="producao-rendimento">RENDIMENTO {">>>>"}</div>
				<div>X</div>
				<Button type="submit" variant="outline" className="submt bg-slate-200">
					Salvar
				</Button>
			</form>
		</FormProvider>
	);
};
export default Producao;
