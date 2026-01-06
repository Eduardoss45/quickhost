import { MigrationInterface, QueryRunner } from "typeorm";

export class InitAuthSchema1767655666623 implements MigrationInterface {
    name = 'InitAuthSchema1767655666623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "refreshTokenHash" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refreshTokenHash"`);
    }

}
