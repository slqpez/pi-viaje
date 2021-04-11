import ACTIONS from "./index"
import axios from "axios"

export const dispatchLogin =()=>{
    return {
        type:ACTIONS.LOGIN
    }
}

export const fetchUser =async(token)=>{
    const res = await axios.get("https://pi-gest-viaje.herokuapp.com/user/info",{
        headers: {
            Authorization:token
        }
    })
    console.log(res)
    return res
   
}

export const dispatchGetUser =(res)=>{
    
    return {
        type: ACTIONS.GET_USER,
        payload:{
            user:res.data,
            isAdmin: res.data.role ===1 ?true:false
        }
    }
   
}