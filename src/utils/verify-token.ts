import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const auth = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const token = req.header('auth-token');
  if (!token) return res.status(403).send('Access Denied');

  // May need to Prepend 'Bearer' before token
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.body.user = verified;
    return next();
  } catch (err) {
    return res.status(401).send({ message: 'Invalid token' });
  }
};

export default auth;
