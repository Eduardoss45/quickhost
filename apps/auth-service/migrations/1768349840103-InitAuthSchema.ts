import { MigrationInterface, QueryRunner } from "typeorm";

export class InitAuthSchema1768349840103 implements MigrationInterface {
    name = 'InitAuthSchema1768349840103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(150) NOT NULL, "social_name" character varying(150), "email" character varying(255) NOT NULL, "password" character varying NOT NULL, "cpf" character varying(11), "birth_date" date, "phone_number" character varying(20), "profile_picture_url" character varying, "refreshTokenHash" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_230b925048540454c8b4c481e1c" UNIQUE ("cpf"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
