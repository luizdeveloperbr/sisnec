import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shadcn/ui/table";
// import { ScrollArea } from "@/shadcn/ui/scroll-area";
// import { findComponente } from "@/database/lib";
import { decimal, money } from "@/utils";
import { useLoaderData, useFetcher, Link } from "react-router";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import { useState, useRef } from "react";

interface Componente {
	codigo: number;
	descricao: string;
	peso_liquido: number;
	embalagem: string;
	custo: number;
	estoque: number;
	tipo: number;
}

export default function CadastroPage() {
	const [local, setLocal] = useState<Pick<Componente, "codigo" | "descricao"> | undefined>();
	const insumos: Array<{codigo: number, descricao: string, peso_liquido: number, embalagem: string, custo: number, estoque: number}> = useLoaderData();
	const fetch = useFetcher();
	//@ts-ignore
	const codigoRef = useRef<HTMLInputElement>(null);

	function handlerSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget;
		fetch.submit(form);
		setLocal(undefined);
		form.reset();
		codigoRef.current?.focus();
	}
	return (
		// <>
			<div className="main m-2">
						<ul className="flex justify-center gap-2">
							<li>
								<Button asChild>
									<Link to="/">Home</Link>
								</Button>
							</li>
						</ul>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Codigo</TableHead>
						<TableHead>Descrição</TableHead>
						<TableHead>Embalagem</TableHead>
						<TableHead>Estoque</TableHead>
						<TableHead>Custo</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{insumos.map((insumo) => (
						<TableRow key={insumo.codigo}>
							<TableCell className="font-medium">{insumo.codigo}</TableCell>
							<TableCell>{insumo.descricao}</TableCell>
							<TableCell>
								{insumo.embalagem.split("/")[0]} ~{" "}
								{decimal(insumo.peso_liquido, 3)}
							</TableCell>
							<TableCell>{decimal(insumo.estoque, 3)}</TableCell>
							<TableCell>{money(insumo.custo)}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			{/* </ScrollArea> */}
			<fetch.Form
				className="grid grid-cols-4 gap-2"
				onSubmit={handlerSubmit}
				method="post"
			>
				<Input
					name="codigo"
					placeholder="codigo"
					type="number"
					required
					ref={codigoRef}
					// onChange={(e) => findComponente(e.target.value, setLocal)}
				></Input>
				<Input
					placeholder={local?.descricao ?? "descriçao"}
					className="placeholder:text-black"
				/>
				<Input
					name="estoque"
					required
					type="number"
					placeholder="estoque"
				></Input>
				<Button type="submit">send</Button>
			</fetch.Form>
		{/* </> */}
		</div>
	);
}
