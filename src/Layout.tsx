import { Link, Outlet } from "react-router-dom";
import { Button } from "@/shadcn/ui/button";
function LayoutPage() {

	return (
		<div className="main m-2">
			<ul className="flex justify-center gap-2">
				<li>
					<Button asChild>
						<Link to="/">Home</Link>
					</Button>
				</li>
				<li>
					<Button asChild>
						<Link to="/96">Material de Uso</Link>
					</Button>
				</li>
				<li>
					<Button asChild>
						<Link to="/35">Padaria</Link>
					</Button>
				</li>
				<li>
					<Button asChild>
						<Link to="/45">Confeitaria</Link>
					</Button>
				</li>
				<li>
					<Button asChild>
						<Link to="/31">Horti</Link>
					</Button>
				</li>
				<li>
					<Button asChild>
						<Link to="/95">Atelier</Link>
					</Button>
				</li>
				<li>
					<Button asChild>
						<Link to="/cadastro">Cadastro</Link>
					</Button>
				</li>
				<li>
					<Button asChild>
						<Link to="/receita">Receitas</Link>
					</Button>
				</li>
			</ul>
			<Outlet />
		</div>
	);
}

export default LayoutPage;
