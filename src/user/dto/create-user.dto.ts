import { IsString, IsEmail, MinLength, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(1)
    firstName: string;

    @IsString()
    @MinLength(1)
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(255)
    password: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}