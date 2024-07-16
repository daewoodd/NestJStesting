import {
  Controller,
  Request,
  Post,
  UseGuards,
  ValidationPipe,
  Body,
  Bind,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Bind(Request())
  async login(@Body(new ValidationPipe()) req: LoginUserDto) {
    const { email, password } = req;
    return this.authService.login(email, password);
  }

  @UseGuards(LocalAuthGuard)
  @Post('register')
  async register(@Body(new ValidationPipe()) registerUserDto: RegisterUserDto) {
    const { name, email, password } = registerUserDto;
    // console.log(name, email, password);
    return this.authService.register(name, email, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
