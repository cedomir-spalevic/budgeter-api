import { generateAccessToken } from "./accessToken.js";
import { generateRefreshToken } from "./refreshToken.js";
import { getRefreshTokensCollection } from "../../services/mongodb.js";

const saveRefreshToken = async (refreshToken) => {
   const refreshTokenCollection = await getRefreshTokensCollection();
   await refreshTokenCollection.create(refreshToken);
};

export const generateUserAuth = async (req, userId) => {
   const refreshToken = generateRefreshToken(userId);
   const accessToken = generateAccessToken(userId, refreshToken.token);
   await saveRefreshToken(refreshToken);
   return {
      accessToken: accessToken.token,
      expires: accessToken.expires,
      refreshToken: refreshToken.token
   };
};