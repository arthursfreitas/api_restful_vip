import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateProductsTable1618774963284 implements MigrationInterface {
    name = 'CreateProductsTable1618774963284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `products` ADD `deleted_at` datetime(6) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `products` DROP COLUMN `deleted_at`");
    }

}
