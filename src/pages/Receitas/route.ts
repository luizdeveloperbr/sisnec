import Database from "@tauri-apps/plugin-sql";
import { RouteObject } from "react-router";
import ReceitaPage from "@/pages/Receitas/page"
const route: RouteObject = {
    path:"/receita",
    Component: ReceitaPage,
    action: async ({request}) => {
        const formdata = await request.formData()
        const codigo = formdata.get("codigo");
        const rendimento = formdata.get("rendimento");
        const secao = formdata.get("secao");
        const db = await Database.load("sqlite:data.db");
        await db.execute("insert into Receita(codigo, rendimento, secao) values ($1, $2, $3)",[codigo, rendimento, secao]);
        return null
    }
}
export default route