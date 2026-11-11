import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

import { PromptVisibility } from '../entities/prompt.entity';

export class UpdatePromptDto {
  @ApiPropertyOptional({
    description: 'Updated title of the prompt',
    example: 'Updated Next.js Architecture',
    maxLength: 120,
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @ApiPropertyOptional({
    description: 'Updated prompt content',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    description: 'Legacy alias for content',
  })
  @IsOptional()
  @IsString()
  prompt?: string;

  @ApiPropertyOptional({
    description: 'Updated tag',
    example: 'nextjs',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  tag?: string;

  @ApiPropertyOptional({
    description: 'Updated visibility level',
    enum: PromptVisibility,
  })
  @IsOptional()
  @IsEnum(PromptVisibility)
  visibility?: PromptVisibility;
}

