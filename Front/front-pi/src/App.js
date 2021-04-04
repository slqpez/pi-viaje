import "./App.css";
import { Link } from "react-router-dom";
import logo from "./logo.png";

function App() {
  return (
    <div className="App">
      <header>
      <img src={logo} alt="logo"></img>
        <nav>
          <ul>
            <li>
           
              <Link to="/createAccount" className="Link">
                Crear cuenta
              </Link>
            </li>
            <li>
              <Link to="/login" className="Link">
                Ingresar
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
      <div className="info">
      <h1>Kesesa. <br></br>¡No busques más!</h1>
        <p className="p">En nuestra aplicación, puedes guardar todos los documentos, tiquetes, e información correspondiente a tus viajes.
        Nunca te tendrás qué preguntar de nuevo, ¿Dónde están mis papelessss?</p>
        <Link to="/createAccount" className="btn-create">Empieza ya</Link>
      </div>
       
      </main>
    </div>
  );
}

export default App;
