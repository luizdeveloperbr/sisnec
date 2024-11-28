import Database from "@tauri-apps/plugin-sql";
import { IReceita } from "../componentes/Receita";

export async function getReceita(codigoInterno: number){
    const db = await Database.load("sqlite:data.db");
        const data: IReceita[] = await db.select(
            "SELECT Componente.codigo, Componente.descricao, Receita.rendimento FROM Receita JOIN Componente ON Receita.codigo = Componente.codigo WHERE Componente.codigo = $1;",
            [codigoInterno],
        )
        return data[0]
}