import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/options';

import { userRepository } from '../repositories';

class UserService {
  createUser = async ({ email, password: userPassword, name }) => {
    try {
      const hashedPassword = await bcrypt.hash(userPassword, 10);
      const user = await userRepository.createUser({ email, hashedPassword, name });

      const { password, ...userWithoutPassword } = user;

      return { user: userWithoutPassword };
    } catch (e) {
        return e;
    }
  }

  getUserByEmail = (email) => {
    return userRepository.getUserByEmail(email);
  }

  getUserById = (id) => {
    return userRepository.getUserById(id);
  }

  getUserInfoBySession = async () => {
    const session = await getServerSession(authOptions);
    const { user } = session;

    return await this.getUserByEmail(user.email);
  }

}

export const userService = new UserService();
