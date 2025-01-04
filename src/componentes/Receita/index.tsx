import "./Receita.css";
import React, { useEffect, useState } from "react";
import { IReceita } from "./types";
import { ComponenteReceita, IComponente } from "../Componente/types";
import { decimal, money } from "@/utils";
import { getComponente, getReceita } from "@/database/lib";


const Receita = ({codigoInterno}: {codigoInterno: number}) => {
	// const { receita, componentes } = useLoaderData<{
	// 	receita: IReceita;
	// 	componentes: IComponente[];
	// }>();
	const [receita, setReceita] = useState<IReceita>()
	const [componentes, setComponentes] = useState<IComponente[]>([])


	// Função para calcular a porcentagem RMS de um componente
	const calcularPorcentagemRMS = (componente: ComponenteReceita) => {
		if(!receita) return 0
		return componente.medida / receita?.rendimento / componente.peso_liquido;
	};

	// Calcula a soma dos custos
	const somaTotal = componentes.reduce((acc, componente) => {
		const porcentagemRMS = calcularPorcentagemRMS(componente);
		return acc + componente.custo * porcentagemRMS;
	}, 0);

	useEffect(() => {
			async function bootstrap(){
				const receita: IReceita = await getReceita(codigoInterno);
				const componentes: IComponente[] = await getComponente(codigoInterno);
				setComponentes(componentes)
				setReceita(receita)
			}
			bootstrap()
	},[codigoInterno])

	return (
		<div className="receita-wrap">
			<div className="h-receita-codigo">
				<h2>{receita?.codigo}</h2>
			</div>
			<div className="h-receita-descricao">
				<h2 className="receita-descricao_text">{receita?.descricao}</h2>
			</div>
			<div className="h-embalagem-tipo">embalagem</div>
			<div className="h-quantidade">QNT</div>
			<div className="h-custo-embalagem">
				custo
				<br />
				unidade
			</div>
			<div className="h-porc-emb-rms">
				% <br /> emb RMS
			</div>
			<div className="h-custo-produzido">
				custo <br /> produzido
			</div>
			<div className="h-componente-codigo">codigo</div>
			<div className="h-componente-descricao">descrição</div>
			{componentes?.map((componente) => {
				const porcentagemRMS = calcularPorcentagemRMS(componente);
				return (
					<React.Fragment key={componente.codigo}>
						<div>{componente.codigo}</div>
						<div className="componente-descricao">{componente.descricao}</div>
						<div>KG</div>
						<div>
							<span>{decimal(componente.peso_liquido, 3)}</span>
						</div>
						<div>
							<span>{decimal(componente.medida, 3)} </span>
						</div>
						<div>{money(componente.custo)}</div>
						<div>
							<span>{decimal(porcentagemRMS, 6)}</span>
						</div>
						<div>{money(componente.custo * porcentagemRMS)}</div>
					</React.Fragment>
				);
			})}
			<div></div>
			<div className="rendimento">RENDIMENTO {">>>>"}</div>
			<div>
				<span>{decimal(receita?.rendimento ?? 0, 3)} </span>
			</div>
			<div></div>
			<div></div>
			<div></div>
			<div>{money(somaTotal)}</div>
		</div>
	);
};
export default Receita;
