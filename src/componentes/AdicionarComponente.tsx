import { SubmitHandler, useForm } from "react-hook-form"
import Database from "@tauri-apps/plugin-sql"
import { IComponente } from "./Receita"
export default function AdicionarComponente(props: {receita: number}){
    const {register, handleSubmit} = useForm<Partial<IComponente>>()
    const addComponente: SubmitHandler<Partial<IComponente>> = async (formData: Partial<IComponente>) => {
        
        const receita = props.receita
        const codigo = Number(formData.codigo)
        const medida = Number(formData.medida)
        
        const db = await Database.load("sqlite:data.db")
        const componenteExiste: IComponente[] = await db.select("select * from Componente where codigo = $1",[codigo])
        if(componenteExiste.length > 0){
               const insert = await db.execute("insert into Componente_Receita(receita_codigo, componente_codigo, medida) values ($1, $2, $3)",[receita,codigo,medida])
                insert.rowsAffected == 1 ? alert("success") : null
        }else{
            throw Error("compoente não existe")
        }
    }
    return (
        <form onSubmit={handleSubmit(addComponente)}>
            <input type="number" required {...register("codigo")} />
            <input type="number" step="0.1" required {...register("medida")} />
            <button type="submit">add+</button>
        </form>
    )
}