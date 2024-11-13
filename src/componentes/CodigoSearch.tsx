import { useForm, SubmitHandler } from "react-hook-form";
import './CodigoSearch.css'
import SearchIcon from '../assets/search.svg'
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
    <form onSubmit={handleSubmit(inputCode)} className="codigo_search">
      <input type="search" {...register("codigo")} className="codigo_search-input"/>
      <button type="submit"><img src={SearchIcon} alt="" /></button>
    </form>
  )
}