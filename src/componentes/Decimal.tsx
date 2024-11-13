const Decimal = ({digitos, value}: {digitos: number, value: number, className?: string}) => {
    return (
        <span style={{maxWidth: '100px'}}>{Intl.NumberFormat('pt-br',{minimumFractionDigits: digitos}).format(value ?? 1)}</span>
    )
}
export default Decimal