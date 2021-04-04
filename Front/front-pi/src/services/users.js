import axios from 'axios'

const baseUrlLogin = "http://localhost:3002/api/login"
const baseUrlUsers = "http://localhost:3002/api/users"

const login = (username, password)=>{
   return  axios.post(baseUrlLogin, {
      username,
      password
    })

   }

   const addUser =(name,username,password)=>{
      return axios.post(baseUrlUsers, {
         name,
         username,
         password
      })
   }

   export default {login, addUser}