const Users = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('./sendMail')
const {google} = require("googleapis")
const {OAuth2} = google.auth
const fetch = require('node-fetch')


const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID)

const {CLIENT_URL} = process.env

const userController ={
        register: async (req, res)=>{
            try{
                const {username, email, password} = req.body
                
                if(!username || !email || !password)
                return res.status(400).json({msg:"Por favor llena todos los campos."})
                
                if(!validateEmail(email))
                return res.status(400).json({msg:"Ingresa un correo válido."})

                const user = await Users.findOne({email})
                if(user) return res.status(400).json({msg:"El correo ingresado ya existe."})

                if(password.length < 6)
                return res.status(400).json({msg:"La contraseña debe tener mínimo 6 caracteres"})

                const passwordHash = await bcrypt.hash(password, 10)
                
                const newUser = {
                    username, email, password: passwordHash
                }

                const activation_token = createActivationToken(newUser)

                const url = `${CLIENT_URL}/user/activate/${activation_token}`
                sendMail(email, url, "Verificar cuenta")
               

                res.json({msg:"!Usuario registrado! Por favor activa tu email para continuar."})
            }catch(err){
                return res.status(500).json({msg:err.message})
            }
        },
        activateEmail: async (req,res)=>{
            try {
                const {activation_token} = req.body
                const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET )

                console.log(user)
                const {username, email, password} = user

                const check = await Users.findOne({email})
                if(check) return res.status(400).json({msg:"El correo ya existe."})

                const newUser = new Users({
                    username, email, password
                })

                await newUser.save()

                res.json({msg: "La cuenta ha sido activada satisfactoriamente."})

            } catch (err) {
                return res.status(500).json({msg:err.message})
            }
        }, 
        login: async (req, res)=>{
            try {
                const {email, password} = req.body
                const user = await Users.findOne({email})
                if(!user) return res.status(400).json({msg: "El correo ingresado no está en nuestra base de datos."})

                const isMatch = await bcrypt.compare(password, user.password)
                if(!isMatch) return res.status(400).json({msg:"La contraseña es incorrecta."})

                

                const refresh_token = createRefreshToken({id: user._id})
                res.cookie('refreshtoken',refresh_token,{
                    httpOnly: true,
                    path: "/user/refresh_token",
                    maxAge: 7*24*60*60*1000
                })

                res.json({msg:"Login success!", rf_token:refresh_token})
                



            } catch (err) {
                return res.status(500).json({msg:err.message})
            }
        },
        getAccesToken: (req, res)=>{
            
            try {
                const rf_token = req.body.rf_token
                console.log(rf_token)
                if(!rf_token) return  res.status(401).json({msg: "Por favor ingresa en tu cuenta."})

                jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user )=>{
                    if(err) return res.status(402).json({msg: "Por favor ingresa en tu cuenta."})

                    const access_token = createAccessToken({id:user.id})
                    res.json({access_token})
                })
            } catch (err) {
                console.log(res)
                return res.status(500).json({msg:err.message})
                
            }
            
        },
        forgotPassword: async (req, res)=>{
            try {
                const {email}= req.body
                const user = await Users.findOne({email})
                if(!user) return res.status(400).json({msg:"El correo no existe en nuestra base de datos."})

                const access_token = createAccessToken({id:user._id})
                const url = `${CLIENT_URL}/user/reset/${access_token}`

                sendMail(email, url, "Reestablecer contraseña")
                res.json({msg: "Se te envió un correo para reestablecer la contraseña."})

            } catch (err) {
                return res.status(500).json({msg:err.message})
            }
        },
        resetPassword: async (req, res)=>{
            try {
                const {password} = req.body
                const passwordHash = await bcrypt.hash(password, 10)
            
                await Users.findOneAndUpdate({_id: req.user.id},{
                    password: passwordHash
                })

                res.json({msg:"La contrasñea ha sido reestablecida."})
            } catch (err) {
                return res.status(500).json({msg:err.message})
            }
        }, 
        getUserInfo : async (req, res)=>{
            try {
                const user = await  Users.findById(req.user.id).select('-password')

                res.json(user)
            } catch (err) {
                return res.status(500).json({msg:err.message})
            }
        },
        getUsersAllInfo: async (req,res)=>{
            try {
                console.log(req.user)
                const users = await Users.find().select('-password')
                res.json(users)
            } catch (err) {
                return res.status(500).json({msg:err.message})
            }
        }, 
        logout: async (req,res)=>{
            try {
                res.clearCookie('refreshtoken', {path: "/user/refresh_token"})
                return res.json({msg:"Sesión cerrada."})
            } catch (err) {
                return res.status(500).json({msg:err.message})
            }
        }, 
        updateUser: async (req,res)=>{
            try {
                const {username,avatar}= req.body
                await Users.findOneAndUpdate({_id: req.user.id},{
                    username, avatar
                })

                res.json({msg:"Información actualizada."})
            } catch (err) {
                return res.status(500).json({msg:err.message})
            }
        },
        updateUsersRol: async (req,res)=>{
            try {
                const {role}= req.body
                await Users.findOneAndUpdate({_id: req.params.id},{
                    role
                })

                res.json({msg:"Rol actualizado."})
            } catch (err) {
                return res.status(500).json({msg:err.message})
            }
        },
        deleteUser: async(req,res)=>{
            try {
                await Users.findByIdAndDelete(req.params.id)
                res.json({msg:"Se borró correctamente el usuario."})
            } catch (err) {
                return res.status(500).json({msg:err.message})
            }
        },
        googleLogin: async(req, res)=>{
            try {
                const {tokenId} = req.body

                const verify = await client.verifyIdToken({idToken:tokenId, audience:process.env.MAILING_SERVICE_CLIENT_ID})

                
                const {email_verified, email, name, picture} = verify.payload

                const password = email + process.env.GOOGLE_SECRET
                const passwordHash = await bcrypt.hash(password, 10)

                if(!email_verified) return res.status(400).json({msg:"Error verificando el correo."})

               
                    const user = await Users.findOne({email})
                    if(user){
                        const isMatch = await bcrypt.compare(password, user.password)
                        if(!isMatch) return res.status(400).json({msg:"La contraseña es incorrecta o ya existe una cuenta con ese correo."})

                        const refresh_token = createRefreshToken({id: user._id})
                        res.cookie('refreshtoken',refresh_token,{
                            httpOnly: true,
                            path: "/user/refresh_token",
                            maxAge: 7*24*60*60*1000
                        })
        
                        res.json({msg:"Login success!", rf_token:refresh_token})

                        
                    }else{
                        const newUser = new Users({
                            username:name, email, password: passwordHash, avatar: picture
                        })
                        await newUser.save()
                        const refresh_token = createRefreshToken({id: newUser._id})
                            res.cookie('refreshtoken',refresh_token,{
                                httpOnly: true,
                                path: "/user/refresh_token",
                                maxAge: 7*24*60*60*1000
                            })
            
                            res.json({msg:"Login success!", rf_token:refresh_token})
    
                    }
                


            } catch (err) {
                return res.status(500).json({msg:err.message})
            }
        },
        faceLogin: async(req, res)=>{
            try {
                const {accessToken, userID} = req.body

               const URL =`https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`

               const data = await fetch(URL).then(res => res.json())
               .then(res=>{
                   return res
               })

               

                
                const { email, name, picture} = data

                const password = email + process.env.FACE_SECRET
                const passwordHash = await bcrypt.hash(password, 10)

                

               
                    const user = await Users.findOne({email})
                    if(user){
                        const isMatch = await bcrypt.compare(password, user.password)
                        if(!isMatch) return res.status(400).json({msg:"La contraseña es incorrecta o ya existe una cuenta con ese correo."})

                        const refresh_token = createRefreshToken({id: user._id})
                        res.cookie('refreshtoken',refresh_token,{
                            httpOnly: true,
                            path: "/user/refresh_token",
                            maxAge: 7*24*60*60*1000
                        })
        
                        res.json({msg:"Login success!", rf_token:refresh_token})

                        
                    }else{
                        const newUser = new Users({
                            username:name, email, password: passwordHash, avatar: picture.data.url
                        })
                        await newUser.save()
                        const refresh_token = createRefreshToken({id: newUser._id})
                            res.cookie('refreshtoken',refresh_token,{
                                httpOnly: true,
                                path: "/user/refresh_token",
                                maxAge: 7*24*60*60*1000
                            })
            
                            res.json({msg:"Login success!", rf_token:refresh_token})
    
                    }
                


            } catch (err) {
                return res.status(500).json({msg:err.message})
            }
        },
       

        
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const createActivationToken = (payload)=>{
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn:"5m"})
}

const createAccessToken = (payload)=>{
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn:"15m"})
}

const createRefreshToken = (payload)=>{
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn:"7d"})
}

module.exports = userController