import React, {useState} from 'react'
import axios from "axios"
import {isEmail} from "../../utils/validation/Validation"
import {showErrMsg, showSuccessMsg} from "../../utils/notification/Notification"
import "./forgotPassword.css"

const initialState ={
    email:"",
    err:"",
    success:""
}

function ForgotPassword() {
    const [data,setData] = useState(initialState)

    const {email,err,success} = data

    const handleChangeInput = e =>{
            const {name, value} = e.target
            setData({...data, [name]:value, err:"", success:""})
    }

    const forgotPassword = async ()=>{
        if(!isEmail(email))
        return setData({...data,err:"Correo inválido.", success:""})
        try {
            const res = await axios.post("https://pi-gest-viaje.herokuapp.com/user/forgot", {email})
            return setData({...data,err:"", success: res.data.msg})
        } catch (err) {
            err.response.data.msg  && setData({...data,err:err.response.data.msg, success:""})
        }
    }

    return (
        <div className="fg_password">
            <h2 className="h2-forgot">¿Olvidaste tu contraseña?</h2>

            <div className="row">
                {err && showErrMsg(err)}
                {success && showSuccessMsg(success)}

                <label htmlFor="email">Ingresa tu correo</label>
                <input className="input-forgot" type="email" name="email" id="email" value={email} onChange={handleChangeInput}></input>
                <button className="btn-forgot" onClick={forgotPassword}>Verificar</button>
            </div>
        </div>
    )
}

export default ForgotPassword
