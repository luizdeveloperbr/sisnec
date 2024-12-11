import "./App.css";
import { useEffect, useState } from "react";
import CodigoSearchBox from "./componentes/CodigoSearch";
import Receita from "./componentes/Receita";
import Producao from "./componentes/Producao";
import Database from "@tauri-apps/plugin-sql";
// import AdicionarComponente from './componentes/AdicionarComponente';
function App() {
	const [codigo, setCodigo] = useState<number>(0);
	const codigos = [12467,87432]
	// const [listaProduzido, setListaProduzido] = useState<Array<any>>([])
	useEffect(() => {
		async function bootstrap() {
			let db = await Database.load('sqlite:data.db')
			let result:Array<{receita_codigo: number, data_producao: string, receita: string, total_produzido: number, componentes: string}> = await db.select(`
				SELECT  
					p.codigo AS receita_codigo,
					p.data AS data_producao,
					cc.descricao AS receita,
					p.total_produzido,
					'[' || GROUP_CONCAT(
						'{"componente_id":' || p.componente_id || 
						',"descricao":"' || c.descricao || '"' || 
						',"medida":' || p.medida || 
						'}'
					) || ']' AS componentes
				FROM Producao p
				JOIN Componente cc ON p.codigo = cc.codigo
				JOIN Componente c ON p.componente_id = c.codigo
				WHERE p.codigo = $1
				GROUP BY p.codigo, p.data;

`, [codigo])
				console.log("App.tsx1", result)
				console.log("App.tsx2",JSON.parse(result[2].componentes))

				// setListaProduzido(result)

		}
		bootstrap()
	}, [codigo])

	return (
		<div className="main">
			<CodigoSearchBox setCodigoFunc={setCodigo} />
			{/* <AdicionarComponente receita={codigo} /> */}
			<Receita codigoInterno={codigo} />
			{codigos.map(c => <Producao codigoInterno={c} />)}
			<ul>
				{/* {listaProduzido.map(item => <li>{item.componente} - {item.medida}</li>)} */}
			</ul>
		</div>
	);
}

export default App;
