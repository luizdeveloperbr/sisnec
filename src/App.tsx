// import "./App.css";
import Database from '@tauri-apps/plugin-sql';
import { invoke } from '@tauri-apps/api/core';
import Receita, {IProduto as Produto} from './componentes/Receita'
import { useEffect, useState } from 'react';
function App() {
  const [r_name, setR_name] = useState<any>("luiz")
  async function invoke_tauri(nome: string) {
    setR_name(await invoke("greet", {name: nome}))
  }

  // useEffect(() => {
  //   async function boots(){
  //     const db = await Database.load("sqlite:data.db");
  //     const table = await db.execute("create table teste (id TEXT)")
  //     console.log(table.rowsAffected)
  //   }
  //   boots()
  // },[])

  useEffect(() => {
    async function bootstrap(){
      const db = await Database.load("sqlite:data.db");
    //  const populate = await db.execute("insert into teste (id) values ('sqlitee')")
    //   console.log(populate.rowsAffected)
      const text = await db.select("select * from teste")
      console.log(text)
    }
    bootstrap()
  },[r_name])

let paoRechQueijo: Produto = {
  codigo: 12467,
  descricao: "pão rech c/ queijo",
  rendimento: 12,
  componentes: [
    {codigo: 3605892, descricao: "quejo ralado parmesão kg", peso_liquido: 1},
    {codigo: 2736926, descricao: "requeijão culinario 1,800kg", peso_liquido: 1.8},
    {codigo: 87432, descricao: "massa salgada kg (uso)", peso_liquido: 1},
    {codigo: 22012, descricao: "queijo mussarela p/ fatiar kg", peso_liquido: 1}

  ],
  medidas: [
    {componente_id: 3605892, medida: 0.120},
    {componente_id: 2736926, medida: 0.5},
    {componente_id: 87432, medida: 12},
    {componente_id: 22012, medida: 1.2}

  ]
}
  return (
    <div>
      <h1>receita</h1>
      <p>{r_name}</p>
      <button onClick={() => invoke_tauri("eduardo")}>Eduardo</button>
      <Receita produto={paoRechQueijo} componentes={paoRechQueijo.componentes} medidas={paoRechQueijo.medidas} />
      <Receita produto={paoRechQueijo} componentes={paoRechQueijo.componentes} medidas={paoRechQueijo.medidas} />
    </div>
  );
}

export default App;
