import { connection } from '../database';

import User from '../models/User';

interface UserDTO {
  name: string;
  email: string;
  password: string;
}

class UsersRepository {
  public async create(data: UserDTO): Promise<User> {
    const user = {
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const [id] = await connection('users').insert(user);

    return { id, ...user };
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await connection<User>('users').where({ email }).first();

    return user;
  }

  public async findById(id: number): Promise<User | undefined> {
    const user = await connection<User>('users').where({ id }).first();

    return user;
  }
}

export default UsersRepository;
