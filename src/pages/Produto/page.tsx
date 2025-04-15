import ProducaoComponente from "@/componentes/Producao";
import { useLoaderData } from "react-router";

const ProdutoPage = () => {
	const data = useLoaderData();
	//@ts-ignore
	return <ProducaoComponente produto={data} />;
};

export default ProdutoPage;