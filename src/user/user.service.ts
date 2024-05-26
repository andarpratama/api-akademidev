import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Check if the email is already in use
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException(
          `Email address ${createUserDto.email} is already in use`,
        );
      }

      // Ensure that a valid password is provided
      if (!createUserDto.password) {
        throw new BadRequestException('Password is required');
      }

      // Hash the password
      const saltOrRounds = 10; // Adjust this as needed
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltOrRounds,
      );

      // Replace the plain text password with the hashed one
      createUserDto.password = hashedPassword;

      const newUser = this.userRepository.create(createUserDto);
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException(
        `Unable to create user: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving users');
    }
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, updatedUser: User): Promise<User | undefined> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { id },
      });
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      // Update fields
      existingUser.username = updatedUser.username;
      existingUser.email = updatedUser.email;
      // Update other fields as needed

      return await this.userRepository.save(existingUser);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Error updating user');
      }
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Error deleting user');
      }
    }
  }
}
