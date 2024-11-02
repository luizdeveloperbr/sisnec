const Decimal = ({digitos, value, className}: {digitos: number, value: number, className?: string}) => {
    return (
        <div className={className}>{Intl.NumberFormat('pt-br',{minimumFractionDigits: digitos}).format(value)}</div>
    )
}
export default Decimal