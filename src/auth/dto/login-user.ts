import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty, ApiBody } from '@nestjs/swagger';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
