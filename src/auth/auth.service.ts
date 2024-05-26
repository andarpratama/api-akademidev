import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token:this.jwtService.sign(payload),
    };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      // Omit the password when sending the user object
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateUserByPayload(payload: any): Promise<any> {
    const user = await this.userService.findOne(payload.sub); // assuming sub is the user's ID
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async register(payload: any): Promise<any> {
    const user = await this.userService.create(payload);
    return user;
  }
}