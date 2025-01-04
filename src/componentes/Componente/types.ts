export interface Componente {
	codigo: number;
	descricao: string;
	peso_liquido: number;
	medida: number;
	custo: number;
	estoque: number;
	tipo: number;
}

export type ComponenteReceita = {
	codigo: number;
	descricao: string;
	peso_liquido: number;
	medida: number;
	custo: number;
};

export interface IComponente {
	codigo: number;
	descricao: string;
	peso_liquido: number;
	medida: number;
	custo: number;
	estoque: number;
	tipo: number;
}
