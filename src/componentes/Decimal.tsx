const Decimal = ({ digitos, value }: { digitos: number; value: number }) => {
	return (
		<span style={{ maxWidth: "100px", color: value ? "" : "red" }}>
			{Intl.NumberFormat("pt-br", { minimumFractionDigits: digitos }).format(
				value,
			)}
		</span>
	);
};
export default Decimal;
