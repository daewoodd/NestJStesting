import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Response,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from './dto/login-user';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly UserService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // findOneByEmailAndPassword has exception handling, already.
    const user = await this.UserService.findOneByEmailAndPassword(
      email,
      password,
    );
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    } else {
      throw new NotFoundException('Invalid credentials');
    }
  }

  async login(email: string, password: string): Promise<any> {
    try {
      // exception handling being done in function itself
      const user = await this.UserService.findOneByEmailAndPassword(
        email,
        password,
      );

      console.log('\n\nIn login');
      console.log(user);

      if (user === null) {
        throw new NotFoundException('User not found.');
      }

      const payload = { sub: user.uid, username: user.name };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new InternalServerErrorException('Internal server error.');
    }
  }

  async register(name: string, email: string, password: string) {
    try {
      const user = await this.UserService.create({
        name,
        email,
        password,
      });
      return {
        uid: user.uid,
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to register user.');
    }
  }

  async verify(token: string): Promise<any> {
    try {
      const decoded = await this.jwtService.verify(token);
      return decoded; // Returns user info from JWT payload
    } catch (err) {
      throw new Error('Invalid token');
    }
  }

  async userInfo(uid: string): Promise<any> {
    try {
      const user = this.UserService.findOne(+uid); // Fetch user details from database
      if (user === null) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch user details.');
    }
  }
}
