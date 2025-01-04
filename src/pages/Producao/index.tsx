import Producao from "@/componentes/Producao"
import { Producao as ProducaoType } from "@/componentes/Producao/types"
import { useLoaderData } from "react-router-dom"

export default function ProducaoPage(){
    const data = useLoaderData<ProducaoType[]>()
    return (
        <div>
        <h1>Produção</h1>
        {data.map(producao => <p>{producao.receita_codigo} | {producao.receita} | {producao.total_produzido} | {producao.data_producao}</p>)}
        <Producao codigoInterno={10804} />
        </div>

    )
}