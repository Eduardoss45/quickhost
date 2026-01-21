import { MigrationInterface, QueryRunner } from "typeorm";

export class InitBookingSchema1768991156412 implements MigrationInterface {
    name = 'InitBookingSchema1768991156412'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_438df52e27f906157c2afd47f5" ON "bookings" ("accommodationId", "checkInDate") `);
        await queryRunner.query(`CREATE INDEX "IDX_c90bbb4624b45e0ca5df89a355" ON "bookings" ("status", "createdAt") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_c90bbb4624b45e0ca5df89a355"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_438df52e27f906157c2afd47f5"`);
    }

}
