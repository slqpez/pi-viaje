import React, { useState } from "react";
import UsersService from "../services/users";
import Message from "./Message";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState({});
  const [islogged, setIslogged] = useState(true);

  function handleUsername(e) {
    setUsername(e.target.value);
  }

  function handlePassword(e) {
    setPassword(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    UsersService.login(username, password)
      .then((result) => {
        setUser(result.data);
        window.location.assign("./sesionpage");
        console.log("if");
      })
      .catch(() => {
        console.log();
        setIslogged(false);
        setTimeout(() => {
          setIslogged(true);
        }, 3000);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Nombre de usuario: </label>
        <input
          id="nameLogin"
          value={username}
          onChange={handleUsername}
        ></input>
        <label>Constraseña: </label>
        <input
          type="password"
          id="passwordLogin"
          value={password}
          onChange={handlePassword}
        ></input>{" "}
        <br></br>
        <button>Ingresar</button>
        {!islogged ? <Message msg="El usuario o la contraseña no existen."></Message> : null}
      </form>
    </div>
  );
}

export default LoginForm;
