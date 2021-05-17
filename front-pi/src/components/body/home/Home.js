import React from "react";
import "./home.css";
import {Link} from "react-router-dom"
function Home() {
  return (
    <div className="home-page">
      <main className="main-home">
        <h2 className="title-home">Kesesa</h2>
        <p className="txt-home">
          Ya no tendrás que preguntarte... ¿En dónde están mis papelessss?
        </p>
        <p className="txt-home">
          En Kesesa, puedes almacenar toda la información y documentos
          referentes a tus viajes.
        </p>
        <Link className="btn-home" to="/register">REGISTRARSE</Link>
      </main>
    </div>
  );
}

export default Home;
