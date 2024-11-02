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
    <>
    { receita.length == 0 ? <p>wait...</p> :
    <div className="receita-wrap">
    <div className="receita-codigo">
      <h2 className="receita-codigo_text">{receita[0].codigo}</h2>
    </div>
    <div className="receita-descricao">
      <h2 className="receita-descricao_text">{receita[0].descricao}</h2>
    </div>
    <div className="embalagem-1">embalagem</div>
    <div className="quantidade">QTD</div>
  <div className="custo-embalagem">custo embalagem</div>
    <div className="porc-emb-rms">% da emb RMS</div>
    <div className="custo-produzido">custo produzido</div>
    <div className="componente-codigo">
      codigo
    </div>
    <div className="componente-descricao">
     descrição
    </div>
    {componentes.map((componente,index) => {
      let porcentagemRMS = componente.medida / receita[0].rendimento / componente.peso_liquido
      return (
        <React.Fragment key={index}>
        <div>{componente.codigo}</div>
        <div>{componente.descricao}</div>
        <div>3</div>
        <Decimal digitos={3} value={componente.peso_liquido} />
        <Decimal digitos={3} value={componente.medida} />
        <div className="componente-custo-embalagem">6</div>
        <Decimal className="componente-porc-rms" digitos={6} value={porcentagemRMS} />
        <div className="componente-custo-produzido">8</div>
        </React.Fragment>
      )
    })}
    <div></div>
    <div></div>
    <div></div>
    <Decimal digitos={3} value={receita[0].rendimento} />
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    </div>    }
    </>

  )
}
export default Receita