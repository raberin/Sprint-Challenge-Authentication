const axios = require("axios");
const bcrypt = require("bcryptjs");
const db = require("../database/dbConfig.js");
const tokenService = require("../auth/token-service.js");

const { authenticate } = require("../auth/authenticate");

module.exports = server => {
  server.post("/api/register", register);
  server.post("/api/login", login);
  server.get("/api/jokes", authenticate, getJokes);
};

async function register(req, res) {
  // implement user registration
  let user = req.body;

  //hashes the password and saves password as hashed password in db
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  console.log(user);

  try {
    const addedUser = await db("users").insert(user);
    res.status(201).json(addedUser);
  } catch (err) {
    res.status(500).json({ message: "error in registration" });
  }
}

function login(req, res) {
  // implement user login
  let { username, password } = req.body;

  db("users")
    .where({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        //Generates token
        const token = tokenService.generateToken(user);
        res.status(200).json({
          message: `Welcome ${user.username}!, have a token...`,
          token
        });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: "application/json" }
  };

  axios
    .get("https://icanhazdadjoke.com/search", requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: "Error Fetching Jokes", error: err });
    });
}
