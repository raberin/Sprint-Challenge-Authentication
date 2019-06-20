const jwt = require("jsonwebtoken");

const secrets = require("./secrets.js");

module.exports = {
  generateToken
};

//Created a token when a user logs in
function generateToken(user) {
  const payload = {
    subject: user.id
  };

  const options = {
    expiresIn: "1d"
  };

  return jwt.sign(payload, secrets.jwtSecret, options);
}
