export function money(value: number): string {
	return Intl.NumberFormat("pt-br", {
		style: "currency",
		currency: "brl",
	}).format(value);
}
export function decimal(value: number, digits: number): string {
	return Intl.NumberFormat("pt-br", { minimumFractionDigits: digits }).format(
		value,
	);
}
