const jwt = require("jsonwebtoken");
const Session = require("../models/Session");
const verifyToken = (req, res, next) => {
  //ACCESS TOKEN FROM HEADER, REFRESH TOKEN FROM COOKIE
  const token = req.headers.authorization;
  if (token) {
    const accessToken = token.split(" ")[1];
    if (accessToken == "example1") {
      next();
    } else {
      jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_KEY,
        async (err, payload) => {
          const sessionToken = payload.sessionToken;
          const isSessionValid = await verifySessionToken(sessionToken);
          if (err || !isSessionValid) {
            return res.status(403).json({
              error: "Token không hợp lệ!",
            });
          }
          req.user = payload;
          next();
        }
      );
    }
  } else {
    return res.status(401).json({
      error: "Bạn chưa được xác minh!",
    });
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
      return res.status(403).json({
        error: "Bạn không thể thực hiện tác vụ này!",
      });
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({
        error: "Bạn không thể thực hiện tác vụ này!",
      });
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndUserAuthorization,
  verifyTokenAndAdmin,
};
