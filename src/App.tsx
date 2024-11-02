import { useState } from 'react';
import CodigoSearchBox from './componentes/CodigoSearch';
import Receita from './componentes/Receita';
function App() {
  const [codigo, setCodigo] = useState<number>(0)
  return (
    <div>
      <CodigoSearchBox setCodigoFunc={setCodigo} />
        <Receita codigoInterno={codigo} />
    </div>
  );
}

export default App;
