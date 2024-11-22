import Database from '@tauri-apps/plugin-sql';
import React, { useEffect, useState } from "react"
import './Producao.css'
import Decimal from "./Decimal";
export interface IReceita {
  codigo: number
  descricao: string
  rendimento: number
}

export interface IComponente {
  codigo: number
  descricao: string
  peso_liquido: number
  medida: number
  custo: number
  estoque: number
}

const Producao = ({ codigoInterno }: { codigoInterno: number }) => {
    const [receita, setReceita] = useState<IReceita[]>([])
    const [componentes, setComponentes] = useState<IComponente[]>([])

  useEffect(()=>{
    async function bootstrap() {
      const db = await Database.load("sqlite:data.db");
      setReceita(await db.select("SELECT Componente.codigo, Componente.descricao, Receita.rendimento FROM Receita JOIN Componente ON Receita.codigo = Componente.codigo WHERE Componente.codigo = $1;",[codigoInterno]))
      setComponentes(await db.select("SELECT Componente.estoque, Componente.custo, Componente.codigo, Componente.descricao, Componente.peso_liquido, Componente_Receita.medida FROM Componente_Receita JOIN Componente ON Componente_Receita.componente_codigo = Componente.codigo WHERE Componente_Receita.receita_codigo = $1;", [codigoInterno]))
    }
    bootstrap()

  },[codigoInterno])


  // Função para calcular a porcentagem RMS de um componente
  const calcularPorcentagemRMS = (componente: IComponente) => {
    return componente.medida / receita[0].rendimento / componente.peso_liquido;
  };

    // Calcula a soma dos custos
  //   const somaTotal = componentes.reduce((acc, componente) => {
  //     const porcentagemRMS = calcularPorcentagemRMS(componente)
  //     return acc + (componente.custo * porcentagemRMS);
  // }, 0);

  return (
    <div className="producao-wrap">
    <div>
     <h2>{receita[0]?.codigo}</h2>
    </div>
    <div>
     <h2 >{receita[0]?.descricao}</h2>
    </div>
    <div className="head-title-padrao">Padrão</div>
    <div className="head-title-produzido"><label htmlFor="prod">Produzido</label><input id='prod' type="text" style={{width: '150px'}}/></div>
    <div className="head-title-emb">% da emb RMS</div>
    <div>codigo</div>
    <div>
     descrição
    </div>
    {receita.length != 0 ? componentes.map((componente) => {
      const porcentagemRMS = calcularPorcentagemRMS(componente)
      return (
        <React.Fragment key={componente.codigo}>
        <div>{componente.codigo}</div>
        <input type="text" readOnly={componente.estoque > 0} placeholder={componente.descricao} style={{backgroundColor:  componente.estoque <= 0 ? 'red': ''}}/>
        <div><Decimal digitos={3} value={componente.medida} /></div>
        {/* <div> */}
          <input type="number" name="" placeholder="0,000" id="" />
        {/* </div> */}
        <div><Decimal digitos={6} value={porcentagemRMS} /></div>
        </React.Fragment>
      )
    }): <>
      <div>0000-0</div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </>}
    <div className="producao-rendimento">RENDIMENTO {">>>>"}</div>
    <div><Decimal digitos={3} value={receita[0]?.rendimento} /></div>
    </div>   
  )
}
export default Producao