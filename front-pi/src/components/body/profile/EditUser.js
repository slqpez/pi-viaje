import React,{useState, useEffect} from 'react'
import {useParams, useHistory} from "react-router-dom"
import {useSelector} from "react-redux"
import axios from "axios"
import { showErrMsg, showSuccessMsg } from "../../utils/notification/Notification"

function EditUser() {
    const {id} = useParams()
    const history = useHistory()
    const [editUser,setEditUser] = useState([])

    
    const users = useSelector(state => state.users)
    const token = useSelector(state => state.token)


    const[checkAdmin,setCheckAdmin]= useState(false)
    const[err, setErr]= useState(false)
    const[success, setSuccess]= useState(false)
    const[num, setNum]= useState(0)


    useEffect(()=>{
        if(users.length !== 0){
            users.forEach(user => {
                if(user._id === id){
                    setEditUser(user)
                    setCheckAdmin(user.role===1?true:false)
                }
            })
        }
        else{
            history.push("/profile")
        }
    } ,[users,id, history])

    const handleUpdate= async ()=>{
        try {
            if(num %2 !==0){
                const res = await axios.patch(`https://pi-gest-viaje.herokuapp.com/user/update_rol/${editUser._id}`,{
                    role: checkAdmin?1:0
                },{
                    headers:{
                        Authorization: token
                    }
                })
                setSuccess(res.data.msg)
                setNum(0)
            }
        } catch (err) {
                err.response.data.msg && setErr(err.response.data.msg )
        }
    }
   

    const handleCheck =()=>{
        setSuccess("")
        setErr("")
        setCheckAdmin(!checkAdmin)
        setNum(num + 1)
    }
   

    return (
        <div>

            <div>
                <button onClick={()=> history.goBack()}>Volver</button>
            </div>

             <div className="col-left">
          <h2>Editar usuario</h2>
         

          <div className="form-group">
            <label htmlFor="username">Nombre de usuario</label>
            <input
              type="text"
              name="username"
              id="username"
              
              defaultValue={editUser.username}
              disabled
            ></input>
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo</label>
            <input
              type="email"
              name="email"
              id="email"
              
              defaultValue={editUser.email}
              
              disabled
            ></input>
          </div>

          <div className="form-group">
           <input type="checkbox" id="isAdmin" checked={checkAdmin} onChange={handleCheck}></input>
           <label htmlFor="isAdmin">Es administrador</label>
          </div>

          

         
          <button  onClick={handleUpdate}>
            Actualizar
          </button>

          {err && showErrMsg(err)}
          {success && showSuccessMsg(success)}
        </div>
        </div>
    )
}

export default EditUser
