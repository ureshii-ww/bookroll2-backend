import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './schemas/user.schema';

@Controller('user')
export class UserController {

  constructor(private userService: UserService) {}

  @ApiOperation({summary: 'Создание пользователя'})
  @ApiBody({type: CreateUserDto})
  @ApiResponse({status: 200, type: User})
  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
