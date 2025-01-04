// import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import SearchIcon from "../assets/search.svg";
// type FormSearchCode = {
// 	codigo: number;
// };

export default function CodigoSearchBox({
	setCodigoFunc,
}: {
	setCodigoFunc: (_: number) => void;
}) {
	// const { register, handleSubmit } = useForm<FormSearchCode>();
	return (
		<div className="flex justify-center gap-1">
			<Input
				type="text"
				// {...register("codigo")}
				className="my-2 w-fit bg-slate-200"
				onChange={(e) => setCodigoFunc(Number(e.target.value))}
			/>
			<Button variant="outline" className="my-2 bg-slate-200">
				<img src={SearchIcon} alt="" />
			</Button>
		</div>
	);
}
