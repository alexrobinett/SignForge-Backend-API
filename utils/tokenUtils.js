const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
  return jwt.sign(
    { UserInfo: { userId: user._id, email: user.email, name: user.firstName } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '30m' }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { userId: user._id, email: user.email, name: user.firstName },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '5d' }
  );
}

module.exports = { generateAccessToken, generateRefreshToken };
