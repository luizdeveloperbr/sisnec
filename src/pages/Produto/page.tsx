import ProducaoComponente from "@/componentes/Producao";
import { useLoaderData } from "react-router-dom";

const ProdutoPage = () => {
	const data = useLoaderData<any>();
	return <ProducaoComponente produto={data} />;
};

export default ProdutoPage;
