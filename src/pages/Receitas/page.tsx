import React from "react"
import { IComponente } from "@/componentes/Componente/types"
import { decimal, money } from "@/utils"
import { useState } from "react"
import { Input } from "@/shadcn/ui/input"
import Database from "@tauri-apps/plugin-sql"
import { Button } from "@/shadcn/ui/button"

const ReceitaPage = () => {
    const [descricao, setDescricao] = useState<string>();
    const [componenteReceita, setComponenteReceita] = useState<IComponente[]>([]);
    const [componente, setComponente] = useState<IComponente>();
    const [local, setLocal] = useState<IComponente>();
    const [produto, setProduto] = useState<{ codigo: number; descricao: string }>()

    function handleNewComponente() {
        let componenteAdd = Object.assign()
        setComponenteReceita(old => [componente, ...old])
    }

    async function findReceita(cod: any, setFunc: (arg0: any) => void) {
        let descricaoInput = "%" + cod + "%";
        const db = await Database.load("sqlite:data.db");
        const queryComponente: IComponente[] = await db.select(
            "select * from Componente where codigo like $1",
            [descricaoInput],
        );
        setFunc(queryComponente[0])
        console.log("findReceita", queryComponente)
    }

    return (
        <div className="receita-wrap">
            <Input className="h-receita-codigo w- border-gray-600" placeholder="cod_receita" onChange={e => findReceita(e.target.value, setProduto)} />
            <div className="h-receita-descricao border-gray-600">{produto?.descricao}</div>
            <div className="h-embalagem-tipo">embalagem</div>
            <div className="h-quantidade">QNT</div>
            <div className="h-custo-embalagem">
                custo
                <br />
                unidade
            </div>
            <div className="h-porc-emb-rms">
                custo <br /> produzido
            </div>
            <div className="h-custo-produzido">
                *
            </div>
            <div className="h-componente-codigo">codigo</div>
            <div className="h-componente-descricao">descrição</div>
            {componenteReceita?.map((component) => {
                // const porcentagemRMS = calcularPorcentagemRMS(componente);
                return (
                    <React.Fragment key={component.codigo}>
                        <div>{component.codigo}</div>
                        <div className="componente-descricao">{component.descricao}</div>
                        <div>{component.embalagem}</div>
                        <div>
                            <span>{decimal(component.peso_liquido, 3)}</span>
                        </div>
                        <div>
                            <span>{decimal(component.medida, 3)} </span>
                        </div>
                        <div>{money(component.custo)}</div>
                        <div>
                            <span>-</span>
                        </div>
                        <div>-</div>
                    </React.Fragment>
                );
            })}
            {/* <React.Fragment> */}
            <Input placeholder="codigo" onChange={e => findReceita(e.target.value, setComponente)} />
            <div className="componente-descricao">{componente?.descricao}</div>
            <div>{componente?.embalagem}</div>
            <div>
                <span>{decimal(componente?.peso_liquido ?? 0, 3)}</span>
            </div>
            <Input placeholder="quantidade" />
            <div>{money(componente?.custo ?? 0)}</div>
            <div>
                <span>{money(1.99 * 0)}</span>
            </div>
            <Button variant="default" onClick={handleNewComponente}>+</Button>
            {/* </React.Fragment> */}

            {/* <div></div>
            <div className="rendimento">RENDIMENTO {">>>>"}</div>
                <Input className="border-gray-600" required/>
            <div></div>
            <div></div>
            <div></div>
            <div>{money(1)}</div> */}
        </div>
    )
    // return (
    //     <>
    //     <Button asChild><Link to="/receita">Home</Link></Button>
    //     <Form method="post" action="/receita" className="grid grid-cols-3">
    //         <Input
    //             name="codigo"
    //             type="number"
    //             placeholder="codigo_receita"
    //         />
    //         <Input name="rendimento" type="number" placeholder="rendimento" />
    //         <select name="secao">
    //             <option value="45">confeitaria</option>
    //         </select>
    //         <Button type="submit">send</Button>
    //     </Form>
    //     </>
    // )
}
export default ReceitaPage