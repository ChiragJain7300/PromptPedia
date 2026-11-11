import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Updated username',
    example: 'alex_new_handle',
    minLength: 2,
    maxLength: 60,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  username?: string;

  @ApiPropertyOptional({
    description: 'Updated profile image URL',
    example: 'https://example.com/avatar.png',
  })
  @IsOptional()
  @IsString()
  image?: string;
}

