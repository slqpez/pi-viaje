const app = require("../index.js");
const usersRouter = require("express").Router();
const User = require("../models/User.js");
const notFound = require("../middlewares/notFound.js");
const handleErrors = require("../middlewares/handleErrors.js");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

usersRouter.get("/", (req, res) => {
  User.find({}).then((users) => {
    res.json(users).end();
  });
});

usersRouter.get("/:id", (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then((user) => res.json(user).end())
    .catch((err) =>
      res.status(400).send({ error: "Id used is malformed" }).end()
    );
});

usersRouter.post("/", async (req, res) => {
  try {
    const user = req.body;
    const passwordHash = await bcrypt.hash(user.password, 10);

    if (!user.username || !user.password) {
      return res.status(400).json({
        error: "required content field is missing.",
      });
    }

    const newUser = new User({
      username: user.username,
      name: user.name,
      passwordHash,
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
   
  } catch (e) {
    res.status(401).json("El usuario ya existe.");
  
  }
});

usersRouter.delete("/:id", (req, res) => {
  const id = req.params.id;
  User.findByIdAndDelete(id)
    .then((user) => res.status(204).json(user))
    .catch((err) =>
      res.status(400).send({ error: "Id used is malformed" }).end()
    );
});

usersRouter.put("/:id", (req, res) => {
  const id = req.params.id;
  const user = req.body;

  const newNote = {
    username: user.username,
    name: user.name,
    passwordHash: user.password,
  };
  User.findByIdAndUpdate(id, newNote, { new: true }).then((user) =>
    res.status(200).json(user).end()
  );
});

usersRouter.use(notFound);
usersRouter.use(handleErrors);

module.exports = usersRouter;
