import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import LoginForm from "./components/LoginForm/LoginForm";
import CreateAccForm from "./components/CreateAccForm/CreateAccForm"
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SesionPage from "./components/SesionPage";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/">
          <App />
        </Route>
        <Route exact path="/login">
          <LoginForm />
        </Route>
        <Route exact path="/createAccount">
          <CreateAccForm />
        </Route>
        <Route exact path="/sesionpage">
          <SesionPage />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
