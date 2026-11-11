import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';
import { Prompt } from './entities/prompt.entity';
import { PromptsController } from './prompts.controller';
import { PromptsService } from './prompts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Prompt, User])],
  controllers: [PromptsController],
  providers: [PromptsService],
  exports: [TypeOrmModule, PromptsService],
})
export class PromptsModule {}
