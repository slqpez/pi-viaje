import './App.css';
import {Link} from "react-router-dom"

function App() {
  return (
    <div className="App">
      <Link to="/createAccount">Crear cuenta</Link> <br></br>
      <Link to="/login">Ingresar</Link>
    </div>
  );
}

export default App;
