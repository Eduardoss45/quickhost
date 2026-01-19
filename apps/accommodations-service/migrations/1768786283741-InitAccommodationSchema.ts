import { MigrationInterface, QueryRunner } from "typeorm";

export class InitAccommodationSchema1768786283741 implements MigrationInterface {
    name = 'InitAccommodationSchema1768786283741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "authorId" uuid NOT NULL, "authorName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "accommodationId" uuid, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "accommodations" DROP COLUMN "final_price"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_65164a81a1ad7d6c1a2fc4c1431" FOREIGN KEY ("accommodationId") REFERENCES "accommodations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_65164a81a1ad7d6c1a2fc4c1431"`);
        await queryRunner.query(`ALTER TABLE "accommodations" ADD "final_price" numeric(10,2)`);
        await queryRunner.query(`DROP TABLE "comments"`);
    }

}
