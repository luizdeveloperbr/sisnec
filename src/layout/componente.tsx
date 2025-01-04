// import "./App.css";
// import { useEffect, useState } from "react";
// import CodigoSearchBox from "@/componentes/CodigoSearch";
// import Database from "@tauri-apps/plugin-sql";
import { Link, Outlet } from "react-router-dom";
// import { Producao } from "@/componentes/Producao/types";
import { Button } from "@/shadcn/ui/button";

function LayoutPage() {
	// const [codigo, setCodigo] = useState<number>(0);


	return (
		<div className="main m-2">
			{/* <CodigoSearchBox setCodigoFunc={setCodigo} /> */}
			<ul className="flex justify-center gap-2">
				<li><Button asChild><Link to="/">Home</Link></Button></li>
				<li><Button asChild><Link to="/padaria">Padaria</Link></Button></li>
				<li><Button asChild><Link to="/produzido">Produzido</Link></Button></li>
				{/* <li><Button asChild><Link to={`/producao/${codigo}`}>Produção</Link></Button></li> */}
			</ul>
			<Outlet />
			<ul>
				{/* {listaProduzido.map(item => <li>{item.componente} - {item.medida}</li>)} */}
			</ul>
		</div>
	);
}

export default LayoutPage;
