import "./Receita.css";
import React from "react";
import { decimal, money } from "@/utils";

type ComponenteReceita = {
	codigo: number;
	descricao: string;
	peso_liquido: number;
	medida: number;
	custo: number;
};

interface IComponente {
	codigo: number;
	descricao: string;
	peso_liquido: number;
	medida: number;
	custo: number;
	estoque: number;
	embalagem: string;
	componente_required: number;
	tipo: number;
}

const Receita = ({
	produto,
}: {
	produto: {
		codigo: number;
		descricao: string;
		rendimento: number;
		componentes: IComponente[];
	};
}) => {
	// Função para calcular a porcentagem RMS de um componente
	const calcularPorcentagemRMS = (componente: ComponenteReceita) => {
		if (!produto) return 0;
		return componente.medida / produto?.rendimento / componente.peso_liquido;
	};

	// Calcula a soma dos custos
	const somaTotal = produto.componentes.reduce((acc, componente) => {
		const porcentagemRMS = calcularPorcentagemRMS(componente);
		return acc + componente.custo * porcentagemRMS;
	}, 0);

	return (
		<div className="receita-wrap">
			<div className="h-receita-codigo">
				<h2>{produto?.codigo}</h2>
			</div>
			<div className="h-receita-descricao">
				<h2 className="receita-descricao_text">{produto?.descricao}</h2>
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
			{produto.componentes?.map((componente) => {
				const porcentagemRMS = calcularPorcentagemRMS(componente);
				return (
					<React.Fragment key={componente.codigo}>
						<div>{componente.codigo}</div>
						<div className="componente-descricao">{componente.descricao}</div>
						<div>{componente.embalagem}</div>
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
				<span>{decimal(produto?.rendimento ?? 0, 3)} </span>
			</div>
			<div></div>
			<div></div>
			<div></div>
			<div>{money(somaTotal)}</div>
		</div>
	);
};
export default Receita;
