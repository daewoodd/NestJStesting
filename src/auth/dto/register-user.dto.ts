import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty, ApiBody } from '@nestjs/swagger';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
