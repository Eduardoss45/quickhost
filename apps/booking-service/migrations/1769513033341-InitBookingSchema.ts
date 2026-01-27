import { MigrationInterface, QueryRunner } from "typeorm";

export class InitBookingSchema1769513033341 implements MigrationInterface {
    name = 'InitBookingSchema1769513033341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."bookings_status_enum" AS ENUM('PENDING', 'CONFIRMED', 'CANCELED')`);
        await queryRunner.query(`CREATE TABLE "bookings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accommodationId" uuid NOT NULL, "hostId" uuid NOT NULL, "guestId" uuid NOT NULL, "checkInDate" date NOT NULL, "checkOutDate" date NOT NULL, "totalDays" integer NOT NULL, "pricePerNight" numeric(10,2) NOT NULL, "cleaningFee" numeric(10,2) NOT NULL, "serviceFeeMultiplier" numeric(5,2) NOT NULL, "finalAmount" numeric(10,2) NOT NULL, "status" "public"."bookings_status_enum" NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_438df52e27f906157c2afd47f5" ON "bookings" ("accommodationId", "checkInDate") `);
        await queryRunner.query(`CREATE INDEX "IDX_c90bbb4624b45e0ca5df89a355" ON "bookings" ("status", "createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_bbabc2dde4796bff9c567ccd30" ON "bookings" ("accommodationId", "checkInDate", "checkOutDate") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_bbabc2dde4796bff9c567ccd30"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c90bbb4624b45e0ca5df89a355"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_438df52e27f906157c2afd47f5"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`DROP TYPE "public"."bookings_status_enum"`);
    }

}
