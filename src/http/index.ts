export async function handleFormdata(formData: any, param: string[]) {
	let arr: string[] = [];
	param.forEach((p) => {
		let r = formData.get(p);
		return arr.push(r);
	});
	return arr;
}

export async function filterComponentes(
	formData: FormData,
	removeKeys: string[],
) {
	let entries = Array.from(formData.entries());
	return entries.filter(
		([key]) => key !== removeKeys[0] && key !== removeKeys[1],
	);
}
