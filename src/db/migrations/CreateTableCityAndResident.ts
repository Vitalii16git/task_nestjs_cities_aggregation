import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableCityAndResident1634510620663
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "cities" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "description" character varying NULL,
        CONSTRAINT "PK_589871db156cc7f92942334ab7e" PRIMARY KEY ("id")
      );

      CREATE TABLE "residents" (
        "id" SERIAL NOT NULL,
        "first_name" character varying NOT NULL,
        "last_name" character varying NOT NULL,
        "city_id" integer NOT NULL,
        CONSTRAINT "PK_589871db156cc7f929424ab7e" PRIMARY KEY ("id")
      );

      ALTER TABLE "residents" ADD CONSTRAINT "FK_45d515503b0253f6443a4a97cf8" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "residents";');
    await queryRunner.query('DROP TABLE "cities";');
  }
}
