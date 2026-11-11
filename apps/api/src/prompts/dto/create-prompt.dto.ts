import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { PromptVisibility } from '../entities/prompt.entity';

export class CreatePromptDto {
  @ApiPropertyOptional({
    description: 'Title of the prompt (derived from content if omitted)',
    example: 'Next.js Clean Architecture Boilerplate',
    maxLength: 120,
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @ApiPropertyOptional({
    description: 'The prompt content / instructions',
    example: 'Write a comprehensive unit test suite in Jest for NestJS...',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    description: 'Legacy alias for content accepted from web clients',
    example: 'Write a comprehensive unit test suite in Jest for NestJS...',
  })
  @IsOptional()
  @IsString()
  prompt?: string;

  @ApiProperty({
    description: 'Category or topic tag',
    example: 'webdev',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  tag: string;

  @ApiPropertyOptional({
    description: 'Visibility level of the prompt',
    enum: PromptVisibility,
    default: PromptVisibility.Public,
  })
  @IsOptional()
  @IsEnum(PromptVisibility)
  visibility?: PromptVisibility;

  @ApiPropertyOptional({
    description: 'UUID of the prompt creator',
    example: 'c39af8a0-c20b-44fd-adfe-e0c60c7cb724',
  })
  @IsOptional()
  @IsUUID()
  creatorId?: string;

  @ApiPropertyOptional({
    description: 'Legacy alias for creatorId accepted from web clients',
    example: 'c39af8a0-c20b-44fd-adfe-e0c60c7cb724',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

