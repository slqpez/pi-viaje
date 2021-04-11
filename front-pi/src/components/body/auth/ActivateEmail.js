import React, {useState, useEffect} from 'react'
import {useParams} from "react-router-dom"
import axios from "axios"
import {showSuccessMsg, showSuccess, showErrMsg} from "../../utils/notification/Notification"

function ActivateEmail() {
   const {activation_token}= useParams()
   const [err,setErr] = useState("")
   const [success,setSuccess] = useState("")

   useEffect(() => {
       if(activation_token){
           const activateEmail = async()=>{
               try {
                   const res= await axios.post("https://pi-gest-viaje.herokuapp.com/user/activation",{activation_token})
                   setSuccess(res.data.msg)
               } catch (err) {
                   err.response.data.msg && setErr(err.response.data.msg )
               }
           }
           activateEmail()
       }
       
   }, [activation_token])

    console.log(activation_token)
    return (
        <div className="activate-page">
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}
        </div>
    )
}

export default ActivateEmail
