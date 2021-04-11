import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { isLength, isMatch } from "../../utils/validation/Validation";
import {
  showErrMsg,
  showSuccessMsg,
} from "../../utils/notification/Notification";
import "./profile.css";
import {fetchAllUsers, dispatchGetAllUsers} from "../../../redux/actions/usersAction"

const initialState = {
  username: "",
  password: "",
  cf_password: "",
  err: "",
  success: "",
};

function Profile() {
  const auth = useSelector((state) => state.auth);
  const token = useSelector((state) => state.token);
  const users = useSelector((state) => state.users);

  const { user, isAdmin } = auth;
  const [data, setData] = useState(initialState);
  const [avatar, setAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [callback, setCallback] = useState(false);

  const { username, password, cf_password, err, success } = data;

  const dispatch = useDispatch();

  useEffect(() => {
      if(isAdmin){
           fetchAllUsers(token).then(res=>{
            dispatch(dispatchGetAllUsers(res))
          })
      }
  },[token, isAdmin, dispatch, callback])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, err: "", success: "" });
  };

  const changeAvatar = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      if (!file)
        return setData({
          ...data,
          err: "No se subió el archivo.",
          success: "",
        });

      if (file.size > 1024 * 1024) {
        return setData({
          ...data,
          err: "El archivo es demasiado grande.",
          success: "",
        });
      }

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return setData({
          ...data,
          err: "El formato del archivo es inválido.",
          success: "",
        });

      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);
      const res = await axios.post(
        "https://pi-gest-viaje.herokuapp.com/api/upload_avatar",
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: token,
          },
        }
      );

      setLoading(false);
      setAvatar(res.data.url);
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  const updateInfo = () => {
    try {
      axios.patch(
        "https://pi-gest-viaje.herokuapp.com/user/update",
        {
          username: username ? username : user.username,
          avatar: avatar ? avatar : user.avatar,
        },
        { headers: { Authorization: token } }
      );

      setData({ ...data, err: "", success: "Actualización exitosa" });
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  const updatePassword = () => {
    if (isLength(password))
      return setData({
        ...data,
        err: "La contraseña debe tener mínimo 6 caracteres.",
        success: "",
      });

    if (!isMatch(password, cf_password))
      return setData({
        ...data,
        err: "Las contraseñas no coinciden.",
        success: "",
      });

    try {
      axios.post(
        "https://pi-gest-viaje.herokuapp.com/user/reset",
        {
          password,
        },
        { headers: { Authorization: token } }
      );

      setData({ ...data, err: "", success: "Actualización exitosa" });
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  const handleUpdate = () => {
    if (username || avatar) updateInfo();
    if (password) updatePassword();
  };

 const handleDelete= async (id)=>{
   try {
     if(user._id!==id){
      if(window.confirm("¿Estás seguro de eliminar al usuario?")){
        setLoading(true)
        await axios.delete(`https://pi-gest-viaje.herokuapp.com/user/delete/${id}`,{
          headers:{
            Authorization: token
          }
        })
        setLoading(false)
        setCallback(!callback)
      }
     }
     
   } catch (err) {
    setData({ ...data, err: err.response.data.msg, success: "" });
   }
 }
  return (
    <>
      <div>
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}
        {loading && <h3>Cargando...</h3>}
      </div>
      <div className="profile_page">
        <div className="col-left">
          <h2>{isAdmin ? "Perfil de administrador" : "Perfil de usuario"}</h2>
          <div className="avatar">
            <img src={avatar ? avatar : user.avatar} alt="Avatar"></img>
            <span>
              <i className="fas fa-camera"></i>
              <p>Cambiar imagen</p>
              <input
                type="file"
                name="file"
                id="file_up"
                onChange={changeAvatar}
              ></input>
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="username">Nombre de usuario</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Tu nombre de usuario"
              defaultValue={user.username}
              onChange={handleChange}
            ></input>
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Tu correo electrónico"
              defaultValue={user.email}
              disabled
            ></input>
          </div>

          <div className="form-group">
            <label htmlFor="paswword">Nueva contraseña</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Tu  contraseña"
              value={password}
              onChange={handleChange}
            ></input>
          </div>

          <div className="form-group">
            <label htmlFor="cf_password">Confirma la nueva contraseña</label>
            <input
              type="password"
              name="cf_password"
              id="cf_password"
              placeholder="Confirma la contraseña"
              value={cf_password}
              onChange={handleChange}
            ></input>
          </div>
          <button disabled={loading} onClick={handleUpdate}>
            Actualizar
          </button>
        </div>

        {isAdmin? <div className="col-right">
          <h2>Usuarios</h2>

          <div style={{ overflowX: "auto" }}>
            <table className="users">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre de usuario</th>
                  <th>Correo</th>
                  <th>Administrador</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
               
                {
                  users.map(user=>(
                    <tr key={user._id}>
                    <td>{user._id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{
                    user.role === 1
                    ? <i className="fas fa-check" title="Administrador"></i>
                    : <i className="fas fa-times" title="Usuario"></i>
                  }</td>
                  <td>
                    <Link to={`/edit_user/${user._id}`}>
                    <i className="fas fa-edit" title="Editar"></i>
                    </Link>
                    <i className="fas fa-trash-alt" onClick={()=>handleDelete(user._id)}></i>
                  </td>
                    </tr>
                  ))
                }
                 
                
              </tbody>
            </table>
          </div>
        </div>:null}
      </div>
    </>
  );
}

export default Profile;
