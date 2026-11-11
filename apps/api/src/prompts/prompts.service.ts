import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { FindPromptsQueryDto } from './dto/find-prompts.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';
import { Prompt, PromptVisibility } from './entities/prompt.entity';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class PromptsService {
  constructor(
    @InjectRepository(Prompt)
    private readonly promptRepository: Repository<Prompt>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(query: FindPromptsQueryDto): Promise<PaginatedResult<Prompt>> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 20;

    const qb = this.promptRepository
      .createQueryBuilder('prompt')
      .leftJoinAndSelect('prompt.creator', 'creator')
      .orderBy('prompt.createdAt', 'DESC');

    if (query.creatorId) {
      qb.andWhere('prompt.creatorId = :creatorId', {
        creatorId: query.creatorId,
      });
    }

    if (query.tag) {
      const cleanTag = query.tag.replace(/^#/, '').trim().toLowerCase();
      qb.andWhere('LOWER(prompt.tag) = :tag', { tag: cleanTag });
    }

    if (query.visibility) {
      qb.andWhere('prompt.visibility = :visibility', {
        visibility: query.visibility,
      });
    } else if (!query.creatorId) {
      qb.andWhere('prompt.visibility = :publicVisibility', {
        publicVisibility: PromptVisibility.Public,
      });
    }

    if (query.search && query.search.trim().length > 0) {
      const searchPattern = `%${query.search.trim().toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(prompt.title) LIKE :search OR LOWER(prompt.content) LIKE :search OR LOWER(prompt.tag) LIKE :search OR LOWER(creator.username) LIKE :search)',
        { search: searchPattern },
      );
    }

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findOne(id: string): Promise<Prompt> {
    const prompt = await this.promptRepository.findOne({
      where: { id },
      relations: ['creator'],
    });

    if (!prompt) {
      throw new NotFoundException(`Prompt with ID "${id}" was not found.`);
    }

    return prompt;
  }

  async findByUserId(userId: string): Promise<Prompt[]> {
    return this.promptRepository.find({
      where: { creatorId: userId },
      relations: ['creator'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(dto: CreatePromptDto): Promise<Prompt> {
    const content = dto.content ?? dto.prompt;
    if (!content || !content.trim()) {
      throw new BadRequestException('Prompt content is required.');
    }

    const creatorId = dto.creatorId ?? dto.userId;
    if (!creatorId) {
      throw new BadRequestException('A valid creatorId (or userId) is required.');
    }

    const creator = await this.userRepository.findOne({
      where: { id: creatorId },
    });

    if (!creator) {
      throw new NotFoundException(`Creator with ID "${creatorId}" was not found.`);
    }

    const derivedTitle =
      dto.title && dto.title.trim().length > 0
        ? dto.title.trim()
        : content.trim().slice(0, 60).replace(/\n/g, ' ') || 'Untitled Prompt';

    const cleanTag = dto.tag.replace(/^#/, '').trim().toLowerCase();

    const prompt = this.promptRepository.create({
      title: derivedTitle,
      content: content.trim(),
      tag: cleanTag,
      visibility: dto.visibility ?? PromptVisibility.Public,
      creatorId,
      creator,
    });

    return this.promptRepository.save(prompt);
  }

  async update(id: string, dto: UpdatePromptDto): Promise<Prompt> {
    const prompt = await this.findOne(id);

    if (dto.title !== undefined) {
      prompt.title = dto.title.trim();
    }

    const newContent = dto.content ?? dto.prompt;
    if (newContent !== undefined) {
      prompt.content = newContent.trim();
    }

    if (dto.tag !== undefined) {
      prompt.tag = dto.tag.replace(/^#/, '').trim().toLowerCase();
    }

    if (dto.visibility !== undefined) {
      prompt.visibility = dto.visibility;
    }

    return this.promptRepository.save(prompt);
  }

  async remove(id: string): Promise<void> {
    const result = await this.promptRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Prompt with ID "${id}" was not found.`);
    }
  }
}

