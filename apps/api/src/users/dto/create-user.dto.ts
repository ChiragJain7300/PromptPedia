import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique email address of the user',
    example: 'alex@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Unique username for the user',
    example: 'alex_creator',
    minLength: 2,
    maxLength: 60,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(60)
  username: string;

  @ApiPropertyOptional({
    description: 'Avatar or profile image URL',
    example: 'https://lh3.googleusercontent.com/a/default-user',
  })
  @IsOptional()
  @IsString()
  image?: string;
}

