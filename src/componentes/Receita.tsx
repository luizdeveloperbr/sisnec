import React from "react"
import './Receita.css'

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

const Receita = ({ receita, componentes }: { receita: IReceita[], componentes: IComponente[] }) => {

  return (
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
        <div>{Intl.NumberFormat('pt-br',{minimumFractionDigits: 3}).format(componente.peso_liquido)}</div>
        <div>{Intl.NumberFormat('pt-br',{style:"decimal", minimumFractionDigits: 3}).format(componente.medida)}</div>
        <div className="componente-custo-embalagem">6</div>
        <div className="componente-porc-rms">{Intl.NumberFormat('pt-br',{minimumFractionDigits: 6}).format(porcentagemRMS)}</div>
        <div className="componente-custo-produzido">8</div>
        </React.Fragment>
      )
    })}
    <div></div>
    <div></div>
    <div></div>
    <div>{receita[0].rendimento}</div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    </div>

  )
}
export default Receita