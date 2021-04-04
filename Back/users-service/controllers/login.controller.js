
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/User.js");

loginRouter.post("/", async (req, res) => {
    try{
        const body = req.body;
  const { username, password } = body;
  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(passwordCorrect && user)) {
    res.status(401).json({
      error: "Invalid user or password",
    });
  }

  const userForToken = {
    id: user._id,
    name: user.name,
    username: user.username,
  };
  const token = jwt.sign(userForToken, process.env.SECRET);

  res.send({
    name: user.name,
    username: user.username,
    token,
  })
    }catch(e){
        console.log(e, "Algo salió mal")
    }
  
});

module.exports = loginRouter;
