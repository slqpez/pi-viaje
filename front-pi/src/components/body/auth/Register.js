import React, { useState } from "react";
import {Link} from "react-router-dom"
import "./login.css"
import axios from "axios"
import {showErrMsg, showSuccessMsg} from "../../utils/notification/Notification"
import {isEmail,isEmpty,isLength,isMatch} from "../../utils/validation/Validation"

const initialState = {
  username: "",
  email: "",
  password: "",
  cf_password:"",
  err: "",
  success: "",
};

function Register() {
  const [user, setUser] = useState(initialState);
   

  const {username, email, password,cf_password, err, success}= user

    const handleChangeInput =e=>{
        const {name, value}= e.target
        setUser({...user,[name]:value, err:"", success:"" })
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(isEmpty(username) || isEmpty(password))
        return setUser({...user, err: "Por favor llene los campos.", success:"" })

        if(!isEmail(email))
        return setUser({...user, err: "El correo es inválido.", success:"" })

        if(isLength(password))
        return setUser({...user, err: "La contraseña debe tener mínimo 6 caracteres.", success:"" })

        if(!isMatch(password, cf_password))
        return setUser({...user, err: "Las contraseñas no coinciden.", success:"" })

        try {
          const res = await axios.post("https://pi-gest-viaje.herokuapp.com/user/register",{
              username, email, password
          })

          setUser({...user, err:"", success:res.data.msg})
           
        } catch (err) {
            err.response.data.msg && setUser({...user, err: err.response.data.msg, success:"" })
            console.log( err.response.data.msg)
        }
    }

  return (
    <div className="login_page">
      <h2 className="h2-login">Resgistro</h2>
      {err && showErrMsg(err)}
      {success && showSuccessMsg(success)}
      <form onSubmit={handleSubmit} className="form form-login">
      <div className="login-username-section">
          <label htmlFor="username">Nombre de ususario</label>
          <input
            type="text"
            placeholder="Ingresa tu nombre de usuario"
            id="username"
            value={username}
            name="username"
            onChange={handleChangeInput}
          ></input>
        </div>
        <div className="login-email-section">
          <label htmlFor="email">Correo</label>
          <input
            type="text"
            placeholder="Ingresa tu correo"
            id="email"
            value={email}
            name="email"
            onChange={handleChangeInput}
          ></input>
        </div>
        <div className="login-password-section">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            placeholder="Ingresa tu contraseña"
            id="password"
            value={password}
            name="password"
            onChange={handleChangeInput}
          ></input>
        </div>
        <div className="login-cf_password-section">
          <label htmlFor="cf_password">Confirma tu contraseña</label>
          <input
            type="cf_password"
            placeholder="Confirma tu contraseña"
            id="cf_password"
            value={cf_password}
            name="cf_password"
            onChange={handleChangeInput}
          ></input>
        </div>
        <div className="login-footer">
          <button type="submit" className="btn-login">
            CREAR CUENTA
          </button>
          
        </div>

        <p>¿Ya tienes cuenta? <Link to ="/login">Ingresar</Link></p>
      </form>
      
    </div>
  );
}

export default Register;
