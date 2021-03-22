import { Request, Response, NextFunction } from 'express';

import { verify } from 'jsonwebtoken';

import AppError from '../Errors/AppError';

import authConfig from '../configs/auth';

interface ITokenPayload {
  iat: number; // data de criação
  exp: number; // data de expiração
  sub: number; // dados do payload
}

async function Authorization(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const auth = request.headers.authorization;

  if (!auth) {
    throw new AppError('Token is missing', 401);
  }

  const [schema, token] = auth.split(' ');

  if (!schema.match('^Bearer$')) {
    throw new AppError('Token malformed', 401);
  }

  try {
    const decoded = verify(token, authConfig.jwt.secret) as ITokenPayload;

    const { sub } = decoded;

    request.user = {
      id: sub,
    };

    next();
  } catch {
    throw new AppError('Invalid token', 401);
  }
}

export default Authorization;
