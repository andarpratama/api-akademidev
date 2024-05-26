import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatedUser: User): Promise<User | undefined> {
    try {
      const user = await this.userService.update(+id, updatedUser);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      this.handleError(error, 'Error updating user by ID');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.userService.remove(+id);
      return;
    } catch (error) {
      this.handleError(error, 'Error deleting user by ID');
    }
  }

  private handleError(error: any, message: string) {
    // Log the error or perform any additional error handling
    console.error(error);
    throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
