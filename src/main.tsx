import "./layout.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@/layout/componente";
// import ProducaoRoute from "@/pages/Producao/route";
import PadariaRoute from "@/pages/Padaria/route";
import CadastroRoute from "@/pages/Cadastro/route";
import ConfeitariaRoute from "@/pages/Confeitaria/route";
import ReceitaRoute from "@/pages/Receitas/route";
import MaterialUso from "@/pages/MaterialUso/route";

const router = createBrowserRouter([
	{
		path: "/",
		Component: Layout,
		children: [
			// ProducaoRoute,
			PadariaRoute,
			ConfeitariaRoute,
			ReceitaRoute,
			MaterialUso,
		],
	},
	CadastroRoute,
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
