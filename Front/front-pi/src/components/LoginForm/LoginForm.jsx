import React, { useState } from "react";
import UsersService from "../../services/users";
import Message from "../Message";
import spinner from "./spinner.gif"
import "./LoginForm.css"

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //const [user, setUser] = useState({});
  const [islogged, setIslogged] = useState(true);
  const [showSpinner, setShowSpinner]= useState(false);

  function handleUsername(e) {
    setUsername(e.target.value);
  }

  function handlePassword(e) {
    setPassword(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSpinner(true)
    UsersService.login(username, password)
      .then((result) => {
        //setUser(result.data);
        window.location.assign(".#/sesionpage");
        
      })
      .catch(() => {
        setIslogged(false);
        setShowSpinner(false)
        setTimeout(() => {
          setIslogged(true);
        }, 3000);
      });
  };

  return (
    <div className="LoginForm">
      <div className="card">
        <form className="form" onSubmit={handleSubmit}>
          <label>Nombre de usuario: </label>
          <input
          className="input"
            id="nameLogin"
            value={username}
            onChange={handleUsername}
          ></input>
          <label>Constraseña: </label>
          <input
          className="input"
            type="password"
            id="passwordLogin"
            value={password}
            onChange={handlePassword}
          ></input>
          <button className="button">Ingresar</button>
          {!islogged ? (
            <Message msg="El usuario o la contraseña no existen."></Message>
          ) : null}
        </form>
        {showSpinner?<img  className="spinner" src={spinner} alt="spinner"></img>:null}
      </div>
      
    </div>
  );
}

export default LoginForm;
