import {UserService} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import bcrypt from 'bcrypt';
import {User, UserWithRelations} from '../models';
import {UserRepository} from '../repositories';

export type Credentials = {
  email: string;
  password: string;
  role: string;
};

export class MyUserService implements UserService<User, Credentials> {
  private readonly saltRounds = 10;

  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  async verifyCredentials(credentials: Credentials): Promise<User> {

    const user = await this.userRepository.findOne({
      where: {email: credentials.email},
    });

    if (!user) {
      throw new HttpErrors.Unauthorized('Invalid email or password.');
    }

    // Modifed -------------------->>>>
    const userPass = await this.userRepository.findCredentials(user.id);
    let passwordMatches = false;
    if (userPass?.password) {

      passwordMatches = await bcrypt.compare(credentials.password, userPass.password);
    }
    if (!passwordMatches) {
      throw new HttpErrors.Unauthorized('Invalid email or password.');
    }

    return user;
  }

  convertToUserProfile(user: User): UserProfile {
    return {
      [securityId]: user.toString(),
      name: user.username,
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async findUserById(id: string): Promise<User & UserWithRelations> {
    const userId = String(id);
    const user = await this.userRepository.findOne({
      where: {'id': userId},
    });

    if (!user) {
      throw new HttpErrors.Unauthorized('Invalid user');
    }

    return user;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }
}
