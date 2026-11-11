import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

export enum PromptVisibility {
  Public = 'public',
  Private = 'private',
}

@Entity({ name: 'prompts' })
export class Prompt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 120 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Index()
  @Column({ type: 'varchar', length: 50 })
  tag: string;

  @Index()
  @Column({
    type: 'enum',
    enum: PromptVisibility,
    enumName: 'prompt_visibility',
    default: PromptVisibility.Public,
  })
  visibility: PromptVisibility;

  @Index()
  @Column({ name: 'creator_id', type: 'uuid' })
  creatorId: string;

  @ManyToOne(() => User, (user) => user.prompts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
