import { MigrationInterface, QueryRunner } from "typeorm";

export class InitAccommodationSchema1769513033341 implements MigrationInterface {
    name = 'InitAccommodationSchema1769513033341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "authorId" uuid NOT NULL, "authorName" character varying NOT NULL, "rating" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "accommodationId" uuid, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."accommodations_category_enum" AS ENUM('inn', 'chalet', 'apartment', 'home', 'room')`);
        await queryRunner.query(`CREATE TYPE "public"."accommodations_space_type_enum" AS ENUM('full_space', 'limited_space')`);
        await queryRunner.query(`CREATE TABLE "accommodations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text, "creator_id" uuid NOT NULL, "main_cover_image" character varying, "internal_images" jsonb NOT NULL DEFAULT '[]', "is_active" boolean NOT NULL DEFAULT true, "price_per_night" numeric(10,2) NOT NULL DEFAULT '0', "cleaning_fee" numeric(10,2) NOT NULL DEFAULT '0', "discount" boolean NOT NULL DEFAULT false, "average_rating" numeric(3,2) NOT NULL DEFAULT '0', "room_count" integer NOT NULL DEFAULT '1', "bed_count" integer NOT NULL DEFAULT '1', "bathroom_count" integer NOT NULL DEFAULT '1', "guest_capacity" integer NOT NULL DEFAULT '1', "category" "public"."accommodations_category_enum" NOT NULL DEFAULT 'inn', "space_type" "public"."accommodations_space_type_enum" NOT NULL DEFAULT 'full_space', "address" character varying, "city" character varying, "neighborhood" character varying, "postal_code" character varying, "uf" character varying, "wifi" boolean NOT NULL DEFAULT false, "tv" boolean NOT NULL DEFAULT false, "kitchen" boolean NOT NULL DEFAULT false, "washing_machine" boolean NOT NULL DEFAULT false, "parking_included" boolean NOT NULL DEFAULT false, "air_conditioning" boolean NOT NULL DEFAULT false, "pool" boolean NOT NULL DEFAULT false, "jacuzzi" boolean NOT NULL DEFAULT false, "grill" boolean NOT NULL DEFAULT false, "private_gym" boolean NOT NULL DEFAULT false, "beach_access" boolean NOT NULL DEFAULT false, "smoke_detector" boolean NOT NULL DEFAULT false, "fire_extinguisher" boolean NOT NULL DEFAULT false, "first_aid_kit" boolean NOT NULL DEFAULT false, "outdoor_camera" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "next_available_date" date, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a422a200297f93cd5ac87d049e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_65164a81a1ad7d6c1a2fc4c1431" FOREIGN KEY ("accommodationId") REFERENCES "accommodations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_65164a81a1ad7d6c1a2fc4c1431"`);
        await queryRunner.query(`DROP TABLE "accommodations"`);
        await queryRunner.query(`DROP TYPE "public"."accommodations_space_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."accommodations_category_enum"`);
        await queryRunner.query(`DROP TABLE "comments"`);
    }

}
