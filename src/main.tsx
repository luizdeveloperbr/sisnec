import "./layout.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@/Layout";
// import ProducaoRoute from "@/pages/Producao/route";
import PadariaRoute from "@/pages/Padaria/route";
import CadastroRoute from "@/pages/Cadastro/route";
import ConfeitariaRoute from "@/pages/Confeitaria/route";
import ReceitaRoute from "@/pages/Receitas/route";
import MaterialUso from "@/pages/MaterialUso/route";
import ProdutoRoute from "@/pages/Produto/route";
import HortiRoute from "@/pages/Horti/route";

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
			ProdutoRoute,
			CadastroRoute,
			HortiRoute,
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
