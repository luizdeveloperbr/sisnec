import React, { useEffect, useState } from "react"
import './Receita.css'
type TMedidas = {
  componente_id: number
  medida: number
}

interface IComponente {
  codigo: number
  descricao: string
  peso_liquido: number
}

export interface IProduto extends Partial<IComponente> {
  componentes: IComponente[]
  medidas: TMedidas[]
  rendimento: number
}



const Receita = ({ produto, componentes, medidas }: { produto: IProduto, componentes: IComponente[], medidas: TMedidas[] }) => {
  const [displayComponentes, setDislayComponentes] = useState<(IComponente & TMedidas)[]>([])

  useEffect(() => {
    componentes.forEach(componente => {
      let medidaEncontradada = medidas.find(medida => medida.componente_id === componente.codigo)
      let componenteComMedida = Object.assign(componente, medidaEncontradada)
      setDislayComponentes(displayComponentes => [...displayComponentes, componenteComMedida])
    })
  }, [])
  return (
    <div className="receita-wrap">
    <div className="receita-codigo">
      <h2 className="receita-codigo_text">{produto.codigo}</h2>
    </div>
    <div className="receita-descricao">
      <h2 className="receita-descricao_text">{produto.descricao}</h2>
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
    {displayComponentes.map((componente,index) => {
      let porcentagemRMS = componente.medida / produto.rendimento / componente.peso_liquido
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
    </div>

  )
}
export default Receita