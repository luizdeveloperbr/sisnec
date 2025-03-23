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
						<Link to="/material-uso">96</Link>
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
				<li>
					<Button asChild>
						<Link to="/receita">Receitas</Link>
					</Button>
				</li>
				<li>
					<Button asChild>
						<Link to="/horti">Horti</Link>
					</Button>
				</li>
			</ul>
			<Outlet />
		</div>
	);
}

export default LayoutPage;
