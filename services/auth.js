const JWT = require("jsonwebtoken");

const secret = process.env.JWT_SECRET || "Super@123"; 
const expiresIn = process.env.JWT_EXPIRES || "1d";   

function createUserToken(user) {
  const payload = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profileImage: user.profileImage,
    role: user.role,
  };

  return JWT.sign(payload, secret, { expiresIn });
}

function verifyToken(token) {
  try {
    return JWT.verify(token, secret);
  } catch (err) {
    return null; 
  }
}

module.exports = {
  createUserToken,
  verifyToken,
};
