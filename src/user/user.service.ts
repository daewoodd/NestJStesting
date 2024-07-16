import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import passport from 'passport';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: Prisma.UserCreateInput) {
    try {
      console.log('\n\nIn create');
      console.log(`New user:`);
      console.log('email:', createUserDto.email);
      console.log('name:', createUserDto.name);
      console.log('original pass:', createUserDto.password);
      createUserDto.password = await bcrypt.hashSync(
        createUserDto.password,
        10,
      );
      console.log('encrypted pass:', createUserDto.password);
      return await this.databaseService.user.create({
        data: createUserDto,
      });
    } catch (error) {
      throw new Error('Failed to create user');
    }
  }

  async findAll() {
    try {
      return await this.databaseService.user.findMany();
    } catch (error) {
      throw new Error('Failed to find all users');
    }
  }

  async findOne(uid: number) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: {
          uid,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found.');
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to find user');
    }
  }

  async findOneByEmailAndPassword(email: string, password: string) {
    try {
      console.log('\n\nIn findOnyByEmailAndPassword');
      console.log('original pass:', password); // For logging only
      console.log('email', email);

      const user = await this.databaseService.user.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found.');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return user; // Password matches
      } else {
        throw new NotFoundException('Invalid password.'); // Password mismatch
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to find user by email and password',
      );
    }
  }

  async update(uid: number, updateUserDto: Prisma.UserUpdateInput) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: {
          uid,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found.');
      }

      // Perform user validation here
      // ...

      return await this.databaseService.user.update({
        where: {
          uid,
        },
        data: updateUserDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(uid: number) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: {
          uid,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found.');
      }

      // Perform user validation here
      // ...

      return await this.databaseService.user.delete({
        where: {
          uid,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to remove user');
    }
  }
}
