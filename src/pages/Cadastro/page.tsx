import { Componente } from "@/componentes/Componente/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shadcn/ui/table";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
import { decimal, money } from "@/utils";
import { useLoaderData, Form } from "react-router-dom";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";

export default function CadastroPage() {
    const insumos = useLoaderData<Componente[]>();
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Codigo</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Estoque</TableHead>
                        <TableHead className="text-right">Custo</TableHead>
                    </TableRow>
                </TableHeader>
            </Table>
            <ScrollArea className="h-[500px]">
                <Table>
                    <TableBody>
                        {insumos.map((insumo) => (
                            <TableRow>
                                <TableCell className="font-medium">{insumo.codigo}</TableCell>
                                <TableCell>{insumo.descricao}</TableCell>
                                <TableCell>{decimal(insumo.estoque, 3)}/{insumo.embalagem}</TableCell>
                                <TableCell className="text-right">
                                    {money(insumo.custo)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
            <Form className="grid grid-cols-5 gap-2" action="/cadastro" method="post">
                <Input required name="codigo" type="number" placeholder="codigo"></Input>
                <Input required name="descricao" placeholder="descrição"></Input>
                <Input name="estoque" type="number" placeholder="estoque"></Input>
                <Input name="custo" type="number" placeholder="custo"></Input>
                <Button type="submit">send</Button>
            </Form>
        </>
    );
}
