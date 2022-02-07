import { setTokens, tokenCookies, validateAccessToken, validateRefreshToken } from "../helpers/util";
import { User } from "../db/models";
import { NextFunction, Request, Response } from "express";

export default async function validateTokensMiddleware(req: Request, res: Response, next: NextFunction) {
  const refreshToken = req.cookies['refresh'];
  const accessToken = req.cookies['access'];
  if (!accessToken && !refreshToken) return next();

  // If access token is valid, continue
  const decodedAccessToken = validateAccessToken(accessToken);
  
  if (typeof decodedAccessToken !== 'string' && decodedAccessToken.user) {
    req.user = decodedAccessToken.user;
    return next();
  }

  // If access token is invalid, check refresh token
  const decodedRefreshToken = validateRefreshToken(refreshToken);

  if(typeof decodedRefreshToken !== 'string' && decodedRefreshToken.user) {
    const user = await User.findById(decodedRefreshToken.user._id).lean();

    // If refresh token is invalid, clear cookies
    if (!user) {
      res.clearCookie('refresh');
      res.clearCookie('access');
      return next();
    }

    // If refresh token is valid, set new tokens and continue
    const userTokens = setTokens(user);
    req.user = decodedRefreshToken.user;

    // Update cookies with new tokens
    const cookies = tokenCookies(userTokens);
    res.cookie(...cookies.access);
    res.cookie(...cookies.refresh);

    return next();
  }
  next();
}