import { MigrationInterface, QueryRunner } from "typeorm";

export class InitAuthSchema1768726627255 implements MigrationInterface {
    name = 'InitAuthSchema1768726627255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_favorites" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "accommodation_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6c472a19a7423cfbbf6b7c75939" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_48cf416ad0df8e7ac7e8d4ae65" ON "user_favorites" ("user_id", "accommodation_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_48cf416ad0df8e7ac7e8d4ae65"`);
        await queryRunner.query(`DROP TABLE "user_favorites"`);
    }

}
