import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

import { PromptVisibility } from '../entities/prompt.entity';

export class FindPromptsQueryDto {
  @ApiPropertyOptional({
    description: 'Search keyword across title, content, tag, and creator username',
    example: 'react',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter prompts by exact tag',
    example: 'webdev',
  })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({
    description: 'Filter prompts created by a specific user UUID',
    example: 'c39af8a0-c20b-44fd-adfe-e0c60c7cb724',
  })
  @IsOptional()
  @IsUUID()
  creatorId?: string;

  @ApiPropertyOptional({
    description: 'Filter by visibility (defaults to public for general feeds)',
    enum: PromptVisibility,
  })
  @IsOptional()
  @IsEnum(PromptVisibility)
  visibility?: PromptVisibility;

  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page (max 100)',
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

