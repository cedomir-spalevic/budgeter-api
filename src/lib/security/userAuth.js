const { generateAccessToken } = require("./accessToken");
const { generateRefreshToken } = require("./refreshToken");
const { getRefreshTokensCollection } = require("services/mongodb");

const saveRefreshToken = async (req, refreshToken) => {
   const refreshTokenCollection = await getRefreshTokensCollection(req);
   await refreshTokenCollection.create(refreshToken);
};

module.exports.generateUserAuth = async (req, userId) => {
   const refreshToken = generateRefreshToken(userId);
   const accessToken = generateAccessToken(userId, refreshToken.token);
   await saveRefreshToken(req, refreshToken);
   return {
      accessToken: accessToken.token,
      expires: accessToken.expires,
      refreshToken: refreshToken.token
   };
};