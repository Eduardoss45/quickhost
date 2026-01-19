import { MigrationInterface, QueryRunner } from "typeorm";

export class InitAccommodationSchema1768815725460 implements MigrationInterface {
    name = 'InitAccommodationSchema1768815725460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_65164a81a1ad7d6c1a2fc4c1431"`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "accommodationId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "accommodationId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_65164a81a1ad7d6c1a2fc4c1431" FOREIGN KEY ("accommodationId") REFERENCES "accommodations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_65164a81a1ad7d6c1a2fc4c1431"`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "accommodationId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "accommodationId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_65164a81a1ad7d6c1a2fc4c1431" FOREIGN KEY ("accommodationId") REFERENCES "accommodations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
