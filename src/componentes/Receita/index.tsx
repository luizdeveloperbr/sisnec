import "./Receita.css";
import { IReceita } from "./Receita.types";

import Database from "@tauri-apps/plugin-sql";
import React, { useEffect, useState } from "react";
import Decimal from "../Decimal";
import { ComponenteReceita } from "../Componente/Componente.types";

const Receita = ({ codigoInterno }: { codigoInterno: number }) => {
	const [receita, setReceita] = useState<IReceita[]>([]);
	const [componentes, setComponentes] = useState<ComponenteReceita[]>([]);

	useEffect(() => {
		async function bootstrap() {
			const db = await Database.load("sqlite:data.db");
			setReceita(
				await db.select(
					"SELECT Componente.codigo, Componente.descricao, Receita.rendimento FROM Receita JOIN Componente ON Receita.codigo = Componente.codigo WHERE Componente.codigo = $1;",
					[codigoInterno],
				),
			);
			setComponentes(
				await db.select(
					"SELECT Componente.estoque, Componente.custo, Componente.codigo, Componente.descricao, Componente.peso_liquido, Componente_Receita.medida FROM Componente_Receita JOIN Componente ON Componente_Receita.componente_codigo = Componente.codigo WHERE Componente_Receita.receita_codigo = $1;",
					[codigoInterno],
				),
			);
		}
		bootstrap();
	}, [codigoInterno]);

	// Função para calcular a porcentagem RMS de um componente
	const calcularPorcentagemRMS = (componente: ComponenteReceita) => {
		return componente.medida / receita[0]?.rendimento / componente.peso_liquido;
	};

	// Calcula a soma dos custos
	const somaTotal = componentes.reduce((acc, componente) => {
		const porcentagemRMS = calcularPorcentagemRMS(componente);
		return acc + componente.custo * porcentagemRMS;
	}, 0);

	return (
		<div className="receita-wrap">
			<div className="h-receita-codigo">
				<h2>{receita[0]?.codigo}</h2>
			</div>
			<div className="h-receita-descricao">
				<h2 className="receita-descricao_text">{receita[0]?.descricao}</h2>
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
							<div>
								{componente.codigo}
							</div>
							<div className="componente-descricao">{componente.descricao}</div>
							<div>KG</div>
							<div>
								<Decimal digitos={3} value={componente.peso_liquido} />
							</div>
							<div>
								<Decimal digitos={3} value={componente.medida} />
							</div>
							<div>
								{Intl.NumberFormat("pt-br", {
									style: "currency",
									currency: "brl",
								}).format(componente.custo)}
							</div>
							<div>
								<Decimal digitos={6} value={porcentagemRMS} />
							</div>
							<div>
								{Intl.NumberFormat("pt-br", {
									style: "currency",
									currency: "brl",
								}).format(componente.custo * porcentagemRMS)}
							</div>
						</React.Fragment>
					);
				})}
			<div></div>
			<div className="rendimento">RENDIMENTO {">>>>"}</div>
			<div>
				<Decimal digitos={3} value={receita[0]?.rendimento} />
			</div>
			<div></div>
			<div></div>
			<div></div>
			<div>
				{Intl.NumberFormat("pt-br", {
					style: "currency",
					currency: "brl",
				}).format(somaTotal)}
			</div>
		</div>
	);
};
export default Receita;
