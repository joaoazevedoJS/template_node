import { json, Request, Response } from 'express';
import { hash } from 'bcryptjs';

import AppError from '../Errors/AppError';

import UsersRepository from '../repositories/UsersRepository';

class UsersController {
  async create(request: Request, response: Response): Promise<Response> {
    const { email, password, name } = request.body;

    const usersRepository = new UsersRepository();

    const emailAlreadyExist = await usersRepository.findByEmail(email);

    if (emailAlreadyExist) {
      throw new AppError('Email already exist', 401);
    }

    const passwordHashed = await hash(password, 10);

    const user = await usersRepository.create({
      email,
      name,
      password: passwordHashed,
    });

    const userWithoutPassword = { ...user, password: undefined };

    return response.json(userWithoutPassword);
  }

  // Exemplo de rota com autenticação, olhar a pasta routes!
  async read(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    return response.json({ message: `User_id: ${id}` });
  }
}

export default UsersController;
