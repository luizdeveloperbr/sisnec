import { RouteObject } from "react-router-dom";
import { IReceita } from "@/componentes/Receita/types";
import { Producao as ProducaoType } from "@/componentes/Producao/types";
import SetorPage from "@/pages/Setor/page";
import {
	findReceitas,
	getComponente,
	getHistorico,
	getReceita,
	RegistraComponente,
} from "@/database/lib";
import { filterComponentes, handleFormdata } from "@/http";

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

const route: RouteObject = {
	path: ":setor",
	Component: SetorPage,
	action: async ({ request }) => {
		const formdata: FormData = await request.formData();
		const [total_produzido_value, receita_value] = await handleFormdata(
			formdata,
			["total_produzido", "receita"],
		);
		let componentes = await filterComponentes(formdata, [
			"total_produzido",
			"receita",
		]);
		await Promise.all([
			RegistraComponente(componentes, {
				receita: Number(receita_value),
				total_produzido: Number(total_produzido_value),
			}),
		]);
		return null;
	},
	loader: async ({ params }: any) => {
		const receitas = await findReceitas(Number(params.setor));
		const produtos = await Promise.all(
			receitas.map(async ({ codigo }) => {
				const receita: IReceita = await getReceita(codigo);
				const componentes: IComponente[] = await getComponente(codigo);
				const historico: ProducaoType[] = await getHistorico(codigo);
				return { ...receita, componentes, historico };
			}),
		);
		return produtos;
	},
};
export default route;
