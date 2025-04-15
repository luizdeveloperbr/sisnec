import "./layout.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "@/Layout";
// import ProdutoRoute from "@/pages/Produto/route";
// import CadastroRoute from "@/pages/Cadastro/route";
// import ReceitaRoute from "@/pages/Receitas/route";
import SetorRoute from "@/pages/Setor/route"

const router = createBrowserRouter([
	{
		path: "/",
		Component: Layout,
		children: [
			SetorRoute
		]
	},
	// CadastroRoute,
	// ProdutoRoute,
	// ReceitaRoute
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
