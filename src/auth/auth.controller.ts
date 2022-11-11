import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { SerializeResponseTo } from '../interceptors/serialize.interceptor';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UserDto } from '../users/dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { CurrentUserInterceptor } from '../users/interceptors/current-user.interceptor';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@SerializeResponseTo(UserDto)
@UseInterceptors(CurrentUserInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
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

  @Post('/signout')
  @HttpCode(HttpStatus.OK)
  async signout(@Session() session: any) {
    session.userId = null;
  }
}
