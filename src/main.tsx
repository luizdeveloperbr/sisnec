import "./layout.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, RouteObject } from "react-router";
import Layout from "@/Layout";
// import ProdutoRoute from "@/pages/Produto/route";
// import CadastroRoute from "@/pages/Cadastro/route";
// import ReceitaRoute from "@/pages/Receitas/route";
import SetorRoute from "@/pages/Setor/route"
const routes: RouteObject[] = [
	{
		path: "/",
		Component: Layout,
		errorElement: <div>error</div>,
		children: [
			SetorRoute
		]
	},
	// CadastroRoute,
	// ProdutoRoute,
	// ReceitaRoute
];

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={createBrowserRouter(routes)} />
	</React.StrictMode>,
);
