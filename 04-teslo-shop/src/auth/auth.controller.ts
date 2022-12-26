import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { User } from './entities/user.entity';

import { Auth, GetUser, META_ROLES, RawHeaders } from './decorators';

import { AuthStatusDto, CreateUserDto, LoginUserDto } from './dto';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }
  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User,
    @RawHeaders() rawHeaders: string[],
  ) {
    return {
      ok: true,
      message: 'hola mundo',
      user,
      rawHeaders,
    };
  }
  @Get('private2')
  //@SetMetadata('roles', ['admin', 'super-user'])
  @RoleProtected(ValidRoles.user, ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard) // no se manda una nueva instancia como new UseRoleGuard() para que así siempre reutilice la misma
  testingPrivateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  testingPrivateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }
}
