import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['prompts'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" was not found.`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: [{ email: dto.email }, { username: dto.username }],
    });

    if (existing) {
      throw new ConflictException(
        existing.email === dto.email
          ? `User with email "${dto.email}" already exists.`
          : `Username "${dto.username}" is already taken.`,
      );
    }

    const user = this.userRepository.create({
      email: dto.email,
      username: dto.username,
      image: dto.image ?? null,
    });

    return this.userRepository.save(user);
  }

  async upsert(dto: CreateUserDto): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (user) {
      let modified = false;
      if (dto.image && user.image !== dto.image) {
        user.image = dto.image;
        modified = true;
      }
      if (modified) {
        user = await this.userRepository.save(user);
      }
      return user;
    }

    // Check if desired username is available, or append random suffix
    let username = dto.username;
    const existingUsername = await this.userRepository.findOne({
      where: { username },
    });

    if (existingUsername) {
      const suffix = Math.floor(1000 + Math.random() * 9000);
      username = `${username.slice(0, 55)}_${suffix}`;
    }

    user = this.userRepository.create({
      email: dto.email,
      username,
      image: dto.image ?? null,
    });

    return this.userRepository.save(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (dto.username && dto.username !== user.username) {
      const existing = await this.userRepository.findOne({
        where: { username: dto.username },
      });
      if (existing) {
        throw new ConflictException(`Username "${dto.username}" is already taken.`);
      }
      user.username = dto.username;
    }

    if (dto.image !== undefined) {
      user.image = dto.image;
    }

    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`User with ID "${id}" was not found.`);
    }
  }
}

