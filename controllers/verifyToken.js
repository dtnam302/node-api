const jwt = require("jsonwebtoken");
const Session = require("../models/Session");
const verifyToken = (req, res, next) => {
  //ACCESS TOKEN FROM HEADER, REFRESH TOKEN FROM COOKIE
  const token = req.headers.authorization;
  const refreshToken = req.cookies.refreshToken;
  if (token) {
    const accessToken = token.split(" ")[1];
    jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_KEY,
      async (err, payload) => {
        const sessionToken = payload.sessionToken;
        const isSessionValid = await verifySessionToken(sessionToken);
        if (err || !isSessionValid) {
          return res.status(403).json("Token is not valid!");
        }
        req.user = payload;
        next();
      }
    );
  } else {
    return res.status(401).json("You're not authenticated");
  }
};

const verifySessionToken = async (sessionToken) => {
  const isSessionExist = (await Session.findById(sessionToken).count()) > 0;
  return isSessionExist;
};

const verifyTokenAndUserAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json("You're not allowed to do that!");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json("You're not allowed to do that!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndUserAuthorization,
  verifyTokenAndAdmin,
};
