// import { IReceita } from "@/componentes/Receita/types";
import { getComponente, getHistorico, getReceita, insertProducaoComponentes, insertProducaoReceita, updateComponente } from "@/database/lib";
// import { Producao as ProducaoType } from "@/componentes/Producao/types";
import SetorPage from "@/pages/Setor/page";
import { RouteObject } from "react-router-dom";
import { format } from "date-fns";
import { neon } from "@neondatabase/serverless";

let sql = neon(import.meta.env.VITE_NEON_URL as string)

// interface IComponente {
// 	codigo: number;
// 	descricao: string;
// 	peso_liquido: number;
// 	medida: number;
// 	custo: number;
// 	estoque: number;
// 	embalagem: string;
// 	componente_required: number;
// 	tipo: number;
// } 
const route: RouteObject = {
                path: ":setor",
                Component: SetorPage,
                action: async ({ request }) => {
                        const formData = await request.formData();
                        const receita = formData.get("receita");
                        const total_produzido = formData.get("total_produzido");
                        const timestamp = format(new Date(), "yyyy-MM-dd");
                        const componentes = Array.from(formData.entries()).filter(
                            ([key]) => key !== "total_produzido" && key !== "receita",
                        );
                
                        const updatePromises = componentes.map(async ([componente_id, medida]) => {
                            if (Boolean(medida)) {
                                // await db.execute(
                                //     "insert into Producao(codigo, total_produzido, componente_id, medida, data) values ($1, $2, $3, $4, $5)",
                                //     [
                                //         Number(receita),
                                //         Number(total_produzido),
                                //         Number(componente_id),
                                //         Number(medida),
                                //         timestamp,
                                //     ],
                                // );
                                console.log("inserindo", {
                                    receita: Number(receita),
                                    total_produzido: Number(total_produzido),
                                    componente_id: Number(componente_id),
                                    medida: Number(medida),
                                    data: timestamp,
                                })
                                await insertProducaoComponentes({
                                    receita: Number(receita),
                                    total_produzido: Number(total_produzido),
                                    componente_id: Number(componente_id),
                                    medida: Number(medida),
                                    data: timestamp,
                                })

                                // await db.execute(
                                //     "update Componente set estoque = estoque - $1 WHERE codigo = $2",
                                //     [Number(medida), Number(componente_id)],
                                // );
                                await updateComponente({
                                    componente_id: Number(componente_id),
                                    medida: Number(medida),
                                })
                            }
                        });
                
                        await Promise.all(updatePromises);
                
                        // await db.execute(
                        //     "update Componente set estoque = estoque + $1 WHERE codigo = $2",
                        //     [Number(total_produzido), Number(receita)],
                        // );

                        await insertProducaoReceita({
                            receita: Number(receita),
                            total_produzido: Number(total_produzido),
                        })
                
                        return null;
                    },
                loader: async ({ params }: any) => {
                    const codigos = await sql`select codigo from Receita where secao = ${params.setor}`
                    const produtos = await Promise.all(
                        codigos.map(async ({codigo}) => {
                            const receita = await getReceita(codigo);
                            const componentes = await getComponente(codigo);
                            const historico = await getHistorico(codigo);
                            return { ...receita, componentes, historico };
                        }),
                    );
                    return produtos;
                },
            }
export default route