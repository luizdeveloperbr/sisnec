import './App.css'
import { useState } from 'react';
import CodigoSearchBox from './componentes/CodigoSearch';
import Receita from './componentes/Receita';
// import AdicionarComponente from './componentes/AdicionarComponente';
function App() {
  const [codigo, setCodigo] = useState<number>(0)
  return (
    <div className="main">
      <CodigoSearchBox setCodigoFunc={setCodigo} />
        {/* <AdicionarComponente receita={codigo} /> */}
        <Receita codigoInterno={codigo} />
    </div>
  );
}

export default App;
