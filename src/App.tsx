// import "./App.css";
import Database from '@tauri-apps/plugin-sql';
import Receita, {IReceita ,IComponente} from './componentes/Receita'
import { useEffect, useState } from 'react';
function App() {
  const [receita, setProduto] = useState<IReceita[]>([{codigo: 9, descricao: "*",rendimento: 0}])
  const [componentes, setCoponentes] = useState<IComponente[]>([])
 useEffect(() => {
    async function bootstrap(){
      const db = await Database.load("sqlite:data.db");
      setProduto(await db.select("SELECT Componente.codigo, Componente.descricao, Receita.rendimento FROM Receita JOIN Componente ON Receita.codigo = Componente.codigo WHERE Componente.codigo = 12467;"))
      setCoponentes(await db.select("SELECT Componente.codigo, Componente.descricao, Componente.peso_liquido, Componente_Receita.medida FROM Componente_Receita JOIN Componente ON Componente_Receita.componente_codigo = Componente.codigo WHERE Componente_Receita.receita_codigo = 12467;"))
    }
    console.log(componentes)
    bootstrap()
  },[])

  return (
    <div>
      <Receita receita={receita} componentes={componentes} />
    </div>
  );
}

export default App;
