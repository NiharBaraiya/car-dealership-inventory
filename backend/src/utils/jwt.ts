import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthPayload } from '../types';

export const generateToken = (payload: AuthPayload): string => {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.jwtSecret, options);
};

export const verifyToken = (token: string): AuthPayload => {
  return jwt.verify(token, env.jwtSecret) as AuthPayload;
};
