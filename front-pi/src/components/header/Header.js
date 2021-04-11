import React, {useState} from "react";
import { Link } from "react-router-dom";
import "./header.css";
import { useSelector } from "react-redux";
import axios from "axios";

function Header() {
  const auth = useSelector((state) => state.auth);
  const [show, setShow] = useState(false)

  

  const { user, isLogged } = auth;

  const handleDrop =(e)=>{
    setShow(!show)
  }

  const handleLogout= async ()=>{
      try {
        await axios.get("https://pi-gest-viaje.herokuapp.com/user/logout")
        localStorage.removeItem("firstLogin")
        localStorage.removeItem("rf_token")
        window.location.href ="/"
      } catch (err) {
        window.location.href ="/"
      }
  }

  const userLink = () => {
    return (
      <li className="dropdown" onClick={handleDrop}>
        <Link className="avatar-link" to="#">
          <img className="avatar" src={user.avatar} alt="avatar"></img>
          {user.username}
        </Link>
        <ul className={show?"drop-menu ":"hidden"} >
          <li className="li-menu"><Link className="menu-link" to="/profile">Perfil</Link></li>
          <li className="li-menu"><Link onClick={handleLogout} className="menu-link" to="/">Cerrar sesión</Link></li>
        </ul>
      </li>
    );
  };

  return (
    <header>
      <div className="logo">
        <h1>
          <Link className="logo-text" to="/">
            Kesesa
          </Link>
        </h1>
      </div>
      <ul>
        <li>
          <Link className="header-links" to="/register">
            Crear cuenta
          </Link>
        </li>

        {isLogged ? (
          userLink()
        ) : (
          <li>
            <Link className="header-links" to="/login">
              Ingresar
            </Link>
          </li>
        )}
      </ul>
    </header>
  );
}

export default Header;
