import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SerializeResponseTo } from '../interceptors/serialize.interceptor';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UserDto } from '../users/dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@SerializeResponseTo(UserDto)
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Get('/whoami')
  whoAmI(@Session() session: any) {
    return this.userService.findOne(session.userId);
  }

  @Post('/signup')
  async signup(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);

    session.userId = user.id;

    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);

    session.userId = user.id;

    return user;
  }
}
