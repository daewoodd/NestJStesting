import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { OnModuleInit } from '@nestjs/common';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Connected to database!\n');
    } catch (error) {
      console.log(`Error in connecting to the database: \n\n ${error.message}`);
      throw new InternalServerErrorException();
    }
  }
}
