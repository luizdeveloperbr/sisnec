// import CodigoSearchBox from "@/componentes/CodigoSearch";
import { Link, Outlet } from "react-router-dom";
import { Button } from "@/shadcn/ui/button";

function LayoutPage() {
	return (
		<div className="main m-2">
			{/* <CodigoSearchBox setCodigoFunc={setCodigo} /> */}
			<ul className="flex justify-center gap-2">
				<li>
					<Button asChild>
						<Link to="/">Home</Link>
					</Button>
				</li>
				<li>
					<Button asChild>
						<Link to="/padaria">Padaria</Link>
					</Button>
				</li>
				<li>
					<Button asChild>
						<Link to="/confeitaria">Confeitaria</Link>
					</Button>
				</li>
				<li>
					<Button asChild>
						<Link to="/cadastro">Cadastro</Link>
					</Button>
				</li>
			</ul>
			<Outlet />
		</div>
	);
}

export default LayoutPage;
