import { Request, Response } from 'express';
import { compare } from 'bcryptjs';

import { sign } from 'jsonwebtoken';
import authConfig from '../configs/auth';
import AppError from '../Errors/AppError';

import UsersRepository from '../repositories/UsersRepository';

class SessionsController {
  async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const usersRepository = new UsersRepository();

    const user = await usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const { expiresIn, secret } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    });

    const userWithoutPassword = { ...user, password: undefined };

    return response.json({ user: userWithoutPassword, token });
  }
}

export default SessionsController;
