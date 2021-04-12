import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./login.css";
import axios from "axios";
import {
  showErrMsg,
  showSuccessMsg,
} from "../../utils/notification/Notification";
import { dispatchLogin } from "../../../redux/actions/authAction";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";

const initialState = {
  email: "",
  password: "",
  err: "",
  success: "",
};

function Login() {
  const [user, setUser] = useState(initialState);
  const dispatch = useDispatch();
  const history = useHistory();

  const { email, password, err, success } = user;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value, err: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://pi-gest-viaje.herokuapp.com/user/login",
        { email, password }
      );
      setUser({ ...user, err: "", success: res.data.msg });
      localStorage.setItem("rf_token", res.data.rf_token);
      localStorage.setItem("firstLogin", true);
      dispatch(dispatchLogin());
      history.push("/");
    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: "" });
    }
  };

  const responseGoogle = async (response) => {
    try {
      const res = await axios.post(
        "https://pi-gest-viaje.herokuapp.com/user/google_login",
        {
          tokenId: response.tokenId,
        }
      );

      setUser({ ...user, err: "", success: res.data.msg });
      localStorage.setItem("rf_token", res.data.rf_token);
      localStorage.setItem("firstLogin", true);
      dispatch(dispatchLogin());
      history.push("/");
    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: "" });
    }
  };

  const responseFacebook = async (response) => {
    const { accessToken, userID } = response;
    try {
      const res = await axios.post(
        "https://pi-gest-viaje.herokuapp.com/user/face_login",
        {
          accessToken,
          userID,
        }
      );

      setUser({ ...user, err: "", success: res.data.msg });
      localStorage.setItem("rf_token", res.data.rf_token);
      localStorage.setItem("firstLogin", true);
      dispatch(dispatchLogin());
      history.push("/");
    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: "" });
    }
  };

  return (
    <div className="login_page">
      <h2 className="h2-login">Ingresar</h2>
      {err && showErrMsg(err)}
      {success && showSuccessMsg(success)}
      <form onSubmit={handleSubmit} className="form form-login">
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
        <div className="login-footer">
          <button type="submit" className="btn-login">
            INGRESAR
          </button>
        </div>

        <p>
          ¿Eres nuevo?{" "}
          <Link className="link-register" to="/register">
            Crea tu cuenta
          </Link>
        </p>

        <Link className="forgot-link" to="/forgot_password">
          Olvidé mi contraseña.
        </Link>
      </form>

      <div className="hr">O ingresa con otra cuenta</div>

      <div className="social">
        <GoogleLogin
          className="google"
          clientId="619443560297-gc5stc95cck4lbuu07ecvappr6g2ra0c.apps.googleusercontent.com"
          buttonText="Ingresar con Google"
          onSuccess={responseGoogle}
          cookiePolicy={"single_host_origin"}
        />

        <FacebookLogin
          cssClass="face"
          appId="3102371846658493"
          autoLoad={false}
          textButton="Ingresar con Facebook"
          fields="name,email,picture"
          callback={responseFacebook}
        />
      </div>
    </div>
  );
}

export default Login;
