import Database from '@tauri-apps/plugin-sql';
import React, { useEffect, useState } from "react"
import './Receita.css'
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
}

const Receita = ({ codigoInterno }: { codigoInterno: number }) => {
    const [receita, setReceita] = useState<IReceita[]>([])
  const [componentes, setCoponentes] = useState<IComponente[]>([])

  useEffect(()=>{
    async function bootstrap() {
      const db = await Database.load("sqlite:data.db");
      setReceita(await db.select("SELECT Componente.codigo, Componente.descricao, Receita.rendimento FROM Receita JOIN Componente ON Receita.codigo = Componente.codigo WHERE Componente.codigo = $1;",[codigoInterno]))
      setCoponentes(await db.select("SELECT Componente.codigo, Componente.descricao, Componente.peso_liquido, Componente_Receita.medida FROM Componente_Receita JOIN Componente ON Componente_Receita.componente_codigo = Componente.codigo WHERE Componente_Receita.receita_codigo = $1;", [codigoInterno]))
    }
    bootstrap()

  },[codigoInterno])


  return (

    <div className="receita-wrap">
    <div className="h-receita-codigo">
     {receita.length == 0 ? <h2>0000-0</h2>: <h2>{receita[0].codigo}</h2>}
    </div>
    <div className="h-receita-descricao">
    {receita.length == 0 ? <h2>receita não encontrada</h2>: <h2 className="receita-descricao_text">{receita[0].descricao}</h2>}
    </div>
    <div className="h-embalagem-tipo">embalagem</div>
    <div className="h-quantidade">QTD</div>
  <div className="h-custo-embalagem">custo embalagem</div>
    <div className="h-porc-emb-rms">% da emb RMS</div>
    <div className="h-custo-produzido">custo produzido</div>
    <div className="h-componente-codigo">
      codigo
    </div>
    <div className="h-componente-descricao">
     descrição
    </div>
    {receita.length != 0 ? componentes.map((componente,index) => {
      let porcentagemRMS = componente.medida / receita[0].rendimento / componente.peso_liquido
      return (
        <React.Fragment key={index}>
        <div >{componente.codigo}</div>
        <div>{componente.descricao}</div>
        <div>KG</div>
        <div><Decimal digitos={3} value={componente.peso_liquido} /></div>
        <div><Decimal digitos={3} value={componente.medida} /></div>
        <div>R$ 10,00</div>
        <div><Decimal digitos={6} value={porcentagemRMS} /></div>
        <div>R$ 1,99</div>
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
    <div></div>
    <div className="rendimento">RENDIMENTO {">>>>"}</div>
    {receita.length == 0 ? <div>1,000</div>: <div><Decimal digitos={3} value={receita[0].rendimento} /></div>}
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    </div>    
  )
}
export default Receita