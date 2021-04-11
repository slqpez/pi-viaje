import { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/header/Header";
import Body from "./components/body/Body";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {dispatchLogin , fetchUser, dispatchGetUser} from "./redux/actions/authAction"

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const auth = useSelector((state) => state.auth);

  const rf_token = localStorage.getItem("rf_token")

   useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
       const getToken = async () => {
          const res = await axios.post(
          "https://pi-gest-viaje.herokuapp.com/user/refresh_token", {rf_token}
           
        );  
       
        dispatch({type: 'GET_TOKEN', payload:res.data.access_token})
      };
      getToken(); 
    }
  }, [auth.isLogged, rf_token, dispatch]); 


  useEffect(()=>{
    if(token){
      const getUser=()=>{
        dispatch(dispatchLogin())
        
        return fetchUser(token).then(res=>{
          dispatch(dispatchGetUser(res))
        })
      }
      getUser()
    }
  },[token, dispatch])

  return (
    <Router>
      <div className="App">
        <Header />
        <Body></Body>
      </div>
    </Router>
  );
}

export default App;
