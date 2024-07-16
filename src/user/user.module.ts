import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  exports: [UserService],
  providers: [UserService],
  imports: [DatabaseModule],
})
export class UserModule {}
