import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreatePromptDto } from './dto/create-prompt.dto';
import { FindPromptsQueryDto } from './dto/find-prompts.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';
import { Prompt } from './entities/prompt.entity';
import { PromptsService } from './prompts.service';

@ApiTags('prompts')
@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Get()
  @ApiOperation({
    summary: 'Search and list prompts with pagination and filters',
  })
  @ApiResponse({
    status: 200,
    description: 'List of paginated prompts.',
    type: [Prompt],
  })
  findAll(@Query() query: FindPromptsQueryDto) {
    return this.promptsService.findAll(query);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all prompts authored by a specific user' })
  @ApiParam({ name: 'userId', description: 'Creator UUID' })
  @ApiResponse({ status: 200, description: 'User prompts.', type: [Prompt] })
  findByUser(@Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.promptsService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific prompt by ID' })
  @ApiParam({ name: 'id', description: 'Prompt UUID' })
  @ApiResponse({ status: 200, description: 'Prompt found.', type: Prompt })
  @ApiResponse({ status: 404, description: 'Prompt not found.' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.promptsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new prompt' })
  @ApiResponse({
    status: 201,
    description: 'Prompt successfully created.',
    type: Prompt,
  })
  create(@Body() dto: CreatePromptDto) {
    return this.promptsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing prompt' })
  @ApiParam({ name: 'id', description: 'Prompt UUID' })
  @ApiResponse({
    status: 200,
    description: 'Prompt successfully updated.',
    type: Prompt,
  })
  @ApiResponse({ status: 404, description: 'Prompt not found.' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdatePromptDto,
  ) {
    return this.promptsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a prompt by ID' })
  @ApiParam({ name: 'id', description: 'Prompt UUID' })
  @ApiResponse({ status: 204, description: 'Prompt deleted.' })
  @ApiResponse({ status: 404, description: 'Prompt not found.' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.promptsService.remove(id);
  }
}

