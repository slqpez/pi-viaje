import React, { useState } from "react";
import UsersService from "../../services/users";
import Message from "../Message";
import "./CreateAccForm.css";

function CreateAccForm() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newUser, setNewUser] = useState({});
  const [emptyCamps, setEmptyCamps] = useState(false);
  const [message, setMessage] = useState({
    type:"succes",
    msg:""
  });
  

  const handleSubmit = (e) => {
    e.preventDefault();
    UsersService.addUser(name, username, password)
      .then((result) => {
        
        setNewUser(result.data);
        setMessage({...message,msg:"Usuario creado exitosamente."})
        setEmptyCamps(true);
        setInterval(()=>{
          window.location.assign("/login");
        },1400)
       
      })
      .catch((error) => {
        if (error.response.status === 401) {
          setMessage({msg:"El usuario ya existe.",type:"error"});
        } else {
          setMessage({msg :"Faltan campos por llenar.",type:"error"});
        }

        setEmptyCamps(true);
        setTimeout(() => {
          setEmptyCamps(false);
        }, 2000);
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
    <div className="CreateAccForm">
      <div className="card">
        <form className="form" onSubmit={handleSubmit}>
          <label>Nombre y apellidos: </label>
          <input className="input" id="name" value={name} onChange={handleName}></input>
          <label>Nombre de usuario: </label>
          <input
          className="input"
            id="username"
            value={username}
            onChange={handleUsername}
          ></input>
          <label>Contraseña: </label>
          <input
          className="input"
            id="password"
            value={password}
            onChange={handlePassword}
            type="password"
          ></input>
          <button className="button">Crear cuenta</button>
          {emptyCamps ? <Message msg={message.msg} type={message.type}></Message> : null}
        </form>
      </div>
    </div>
  );
}

export default CreateAccForm;
