import { useForm, SubmitHandler } from "react-hook-form";

type FormSearchCode = {
  codigo: number
}

export default function CodigoSearchBox(props: { setCodigoFunc: (_: number) => void; }){
  const {register, handleSubmit} = useForm<FormSearchCode>();
  const inputCode: SubmitHandler<FormSearchCode> = (formData: FormSearchCode) => {
    const {codigo} = formData
    props.setCodigoFunc(Number(codigo))
  }
  return (
    <form onSubmit={handleSubmit(inputCode)}>
      <input type="number" {...register("codigo")} />
      <button type="submit">find</button>
    </form>
  )
}