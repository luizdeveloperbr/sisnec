import { money,decimal } from "@/utils";
import { Input } from "@/shadcn/ui/input";

interface Componente {
    codigo: number;
    descricao: string;
    embalagem: string;
    peso_liquido: number;
    medida: number;
    custo: number;
}

interface ComponenteAdicionadoProps {
    injectData: Componente[];
}

export const ComponenteAdicionado = ({ injectData }: ComponenteAdicionadoProps) => (
    <>
        {injectData.map((componente) => (
            <>
                <div key={componente.codigo}>{componente.codigo}</div>
                <Input
                    name={componente?.codigo.toString()}
                    defaultValue={componente.medida}
                    type="hidden" />
                <div>{componente.descricao}</div>
                <div>{componente.embalagem}</div>
                <div>{decimal(componente.peso_liquido,3)}</div>
                <div>{decimal(componente.medida,3)}</div>
                <div>{money(componente.custo)}</div>
                <div>{money(componente.medida * componente.custo)}</div>
                <div>***</div>
            </>
        ))}</>
)