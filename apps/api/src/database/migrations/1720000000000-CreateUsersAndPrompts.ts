import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersAndPrompts1720000000000
  implements MigrationInterface
{
  name = 'CreateUsersAndPrompts1720000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await queryRunner.query(
      'CREATE TYPE "prompt_visibility" AS ENUM (\'public\', \'private\')',
    );
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" varchar(255) NOT NULL,
        "username" varchar(60) NOT NULL,
        "image" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_users_email" UNIQUE ("email"),
        CONSTRAINT "uq_users_username" UNIQUE ("username")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "prompts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" varchar(120) NOT NULL,
        "content" text NOT NULL,
        "tag" varchar(50) NOT NULL,
        "visibility" "prompt_visibility" NOT NULL DEFAULT 'public',
        "creator_id" uuid NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "fk_prompts_creator" FOREIGN KEY ("creator_id")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      'CREATE INDEX "idx_prompts_tag" ON "prompts" ("tag")',
    );
    await queryRunner.query(
      'CREATE INDEX "idx_prompts_visibility" ON "prompts" ("visibility")',
    );
    await queryRunner.query(
      'CREATE INDEX "idx_prompts_creator_id" ON "prompts" ("creator_id")',
    );
    await queryRunner.query(`
      CREATE INDEX "idx_prompts_search" ON "prompts"
      USING gin (to_tsvector('english', coalesce("title", '') || ' ' || coalesce("content", '') || ' ' || coalesce("tag", '')))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "idx_prompts_search"');
    await queryRunner.query('DROP INDEX "idx_prompts_creator_id"');
    await queryRunner.query('DROP INDEX "idx_prompts_visibility"');
    await queryRunner.query('DROP INDEX "idx_prompts_tag"');
    await queryRunner.query('DROP TABLE "prompts"');
    await queryRunner.query('DROP TABLE "users"');
    await queryRunner.query('DROP TYPE "prompt_visibility"');
  }
}
