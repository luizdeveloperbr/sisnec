import Database from "@tauri-apps/plugin-sql";
import { IReceita } from "@/componentes/Receita/types";
import { getComponente, getHistorico, getReceita } from "@/database/lib";
import { Producao as ProducaoType } from "@/componentes/Producao/types";
import SetorPage from "@/pages/Setor/page";
import { RouteObject } from "react-router-dom";
import { format } from "date-fns";
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
                        const db = await Database.load("sqlite:data.db");
                        const formData = await request.formData();
                        const receita = formData.get("receita");
                        const total_produzido = formData.get("total_produzido");
                        const timestamp = format(new Date(), "yyyy-MM-dd H:mm:ss");
                        const componentes = Array.from(formData.entries()).filter(
                            ([key]) => key !== "total_produzido" && key !== "receita",
                        );
                
                        const updatePromises = componentes.map(async ([componente_id, medida]) => {
                            if (Boolean(medida)) {
                                await db.execute(
                                    "insert into Producao(codigo, total_produzido, componente_id, medida, data) values ($1, $2, $3, $4, $5)",
                                    [
                                        Number(receita),
                                        Number(total_produzido),
                                        Number(componente_id),
                                        Number(medida),
                                        timestamp,
                                    ],
                                );
                                await db.execute(
                                    "update Componente set estoque = estoque - $1 WHERE codigo = $2",
                                    [Number(medida), Number(componente_id)],
                                );
                            }
                        });
                
                        await Promise.all(updatePromises);
                
                        await db.execute(
                            "update Componente set estoque = estoque + $1 WHERE codigo = $2",
                            [Number(total_produzido), Number(receita)],
                        );
                
                        return null;
                    },
                loader: async ({ params }: any) => {
                    const db = await Database.load("sqlite:data.db");
                    const codigos: { codigo: number }[] = await db.select(
                        "select codigo from Receita where secao = $1",
                        [params.setor],
                    );
                    const produtos = await Promise.all(
                        codigos.map(async ({codigo}) => {
                            const receita: IReceita = await getReceita(codigo);
                            const componentes: IComponente[] = await getComponente(codigo);
                            const historico: ProducaoType[] = await getHistorico(codigo);
                            return { ...receita, componentes, historico };
                        }),
                    );
                    return produtos;
                },
            }
export default route