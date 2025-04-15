import { getComponente, getHistorico, getReceita, insertProducaoComponentes, insertProducaoReceita, updateComponente } from "@/database/lib";
import SetorPage from "@/pages/Setor/page";
import { RouteObject } from "react-router-dom";
import { format } from "date-fns";
import { neon } from "@neondatabase/serverless";

let sql = neon(import.meta.env.VITE_NEON_URL as string)

const route: RouteObject = {
                path: ":setor",
                Component: SetorPage,
                action: async ({ request }) => {
                        const formData = await request.formData();
                        const receita = formData.get("receita");
                        const total_produzido = formData.get("total_produzido");
                        const timestamp = format(new Date(), "yyyy-MM-dd HH:mm:ss");
                        const componentes = Array.from(formData.entries()).filter(
                            ([key]) => key !== "total_produzido" && key !== "receita",
                        );
                
                        const updatePromises = componentes.map(async ([componente_id, medida]) => {
                            if (Boolean(medida)) {
                                await insertProducaoComponentes({
                                    receita: Number(receita),
                                    total_produzido: Number(total_produzido),
                                    componente_id: Number(componente_id),
                                    medida: Number(medida),
                                    data: timestamp,
                                })

                                await updateComponente({
                                    componente_id: Number(componente_id),
                                    medida: Number(medida),
                                })
                            }
                        });
                
                        await Promise.all(updatePromises);
                        
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
                            return { ...receita, componentes ,historico };
                        }),
                    );
                    return produtos;
                },
            }
export default route