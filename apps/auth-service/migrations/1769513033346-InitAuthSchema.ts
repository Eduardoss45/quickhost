import { MigrationInterface, QueryRunner } from "typeorm";

export class InitAuthSchema1769513033346 implements MigrationInterface {
    name = 'InitAuthSchema1769513033346'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(150) NOT NULL, "social_name" character varying(150), "email" character varying(255) NOT NULL, "password" character varying NOT NULL, "cpf" character varying(11), "birth_date" date, "phone_number" character varying(20), "profile_picture_url" character varying, "refreshTokenHash" character varying, "passwordResetToken" character varying, "passwordResetExpiresAt" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_230b925048540454c8b4c481e1c" UNIQUE ("cpf"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_favorites" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "accommodation_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6c472a19a7423cfbbf6b7c75939" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_48cf416ad0df8e7ac7e8d4ae65" ON "user_favorites" ("user_id", "accommodation_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_48cf416ad0df8e7ac7e8d4ae65"`);
        await queryRunner.query(`DROP TABLE "user_favorites"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
