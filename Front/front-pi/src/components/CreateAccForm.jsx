import React, { useState } from "react";
import UsersService from "../services/users";
import Message from "./Message";

function CreateAccForm() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newUser, setNewUser] = useState({});
  const [emptyCamps, setEmptyCamps] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    UsersService.addUser(name, username, password)
      .then((result) => {
        console.log(result);
        setNewUser(result.data);
        window.location.assign("/");
      })
      .catch((error) => {
        if (error.response.status===401) {
          setMessage("El usuario ya existe.");
        }else{
            setMessage("Faltan campos por llenar.");
        }

        setEmptyCamps(true);
        setTimeout(() => {
          setEmptyCamps(false);
        }, 3000);
      });
  };

  console.log(newUser);

  function handleName(e) {
    setName(e.target.value);
  }

  function handleUsername(e) {
    setUsername(e.target.value);
  }

  function handlePassword(e) {
    setPassword(e.target.value);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Nombre y apellidos: </label>
        <input id="name" value={name} onChange={handleName}></input>
        <label>Nombre de usuario: </label>
        <input id="username" value={username} onChange={handleUsername}></input>
        <label>Contraseña: </label>
        <input id="password" value={password} onChange={handlePassword}></input>
        <button>Crear cuenta</button>
        {emptyCamps ? (
          <Message msg={message}></Message>
        ) : null}
      </form>
    </div>
  );
}

export default CreateAccForm;
