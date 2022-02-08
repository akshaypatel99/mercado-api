import { setTokens, tokenCookies, validateAccessToken, validateRefreshToken } from "../helpers/util";
import { User } from "../db/models";
import { NextFunction, Request, Response } from "express";
import { frontendProdURL } from "../config/environment";

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
    const { accessToken, refreshToken } = setTokens(user);
    req.user = decodedRefreshToken.user;

    // Update cookies with new tokens
    // const cookies = tokenCookies(userTokens);

    res.cookie('access', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: frontendProdURL,
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week 
    });
    res.cookie('refresh', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: frontendProdURL,
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week 
    });

    return next();
  }
  next();
}