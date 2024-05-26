
import { IsString, IsEmail, MinLength, IsOptional, IsBoolean, MaxLength, IsNumber } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @MinLength(1)
    title: string;

    @IsString()
    @MinLength(1)
    content: string;


    @IsString()
    @MinLength(3)
    image: string;

    @IsNumber()
    userId: number;

}