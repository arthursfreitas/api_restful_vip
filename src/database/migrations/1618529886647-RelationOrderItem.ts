import {MigrationInterface, QueryRunner} from "typeorm";

export class RelationOrderItem1618529886647 implements MigrationInterface {
    name = 'RelationOrderItem1618529886647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `UQ_4245ac34add1ceeb505efc98777` ON `clients`");
        await queryRunner.query("DROP INDEX `UQ_b48860677afe62cd96e12659482` ON `clients`");
        await queryRunner.query("CREATE TABLE `order_item` (`item_order_code` varchar(36) NOT NULL, `product_code` varchar(255) NOT NULL, `order_code` varchar(255) NOT NULL, `quantity` int NOT NULL, PRIMARY KEY (`item_order_code`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `clients` DROP COLUMN `created_At`");
        await queryRunner.query("ALTER TABLE `clients` DROP COLUMN `updated_At`");
        await queryRunner.query("ALTER TABLE `products` DROP COLUMN `created_At`");
        await queryRunner.query("ALTER TABLE `products` DROP COLUMN `updated_At`");
        await queryRunner.query("ALTER TABLE `orders` DROP COLUMN `created_At`");
        await queryRunner.query("ALTER TABLE `orders` DROP COLUMN `updated_At`");
        await queryRunner.query("ALTER TABLE `clients` ADD `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `clients` ADD `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `products` ADD `quantity` int NOT NULL");
        await queryRunner.query("ALTER TABLE `products` ADD `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `products` ADD `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `orders` ADD `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `orders` ADD `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `orders` ADD `clientClientCode` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `orders` CHANGE `payment_type` `payment_type` enum ('MONEY', 'CARD', 'CHECK') NOT NULL");
        await queryRunner.query("ALTER TABLE `order_item` ADD CONSTRAINT `FK_9dd8fc543ff8971afe56abebe10` FOREIGN KEY (`order_code`) REFERENCES `orders`(`order_code`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `order_item` ADD CONSTRAINT `FK_40cd8e15d03716a2f381a256516` FOREIGN KEY (`product_code`) REFERENCES `products`(`product_code`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `orders` ADD CONSTRAINT `FK_0bc9d6d86501fa195f79db265a0` FOREIGN KEY (`clientClientCode`) REFERENCES `clients`(`client_code`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `orders` DROP FOREIGN KEY `FK_0bc9d6d86501fa195f79db265a0`");
        await queryRunner.query("ALTER TABLE `order_item` DROP FOREIGN KEY `FK_40cd8e15d03716a2f381a256516`");
        await queryRunner.query("ALTER TABLE `order_item` DROP FOREIGN KEY `FK_9dd8fc543ff8971afe56abebe10`");
        await queryRunner.query("ALTER TABLE `orders` CHANGE `payment_type` `payment_type` enum ('money', 'card', 'check') NOT NULL DEFAULT 'money'");
        await queryRunner.query("ALTER TABLE `orders` DROP COLUMN `clientClientCode`");
        await queryRunner.query("ALTER TABLE `orders` DROP COLUMN `updated_at`");
        await queryRunner.query("ALTER TABLE `orders` DROP COLUMN `created_at`");
        await queryRunner.query("ALTER TABLE `products` DROP COLUMN `updated_at`");
        await queryRunner.query("ALTER TABLE `products` DROP COLUMN `created_at`");
        await queryRunner.query("ALTER TABLE `products` DROP COLUMN `quantity`");
        await queryRunner.query("ALTER TABLE `clients` DROP COLUMN `updated_at`");
        await queryRunner.query("ALTER TABLE `clients` DROP COLUMN `created_at`");
        await queryRunner.query("ALTER TABLE `orders` ADD `updated_At` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP");
        await queryRunner.query("ALTER TABLE `orders` ADD `created_At` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP");
        await queryRunner.query("ALTER TABLE `products` ADD `updated_At` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP");
        await queryRunner.query("ALTER TABLE `products` ADD `created_At` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP");
        await queryRunner.query("ALTER TABLE `clients` ADD `updated_At` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP");
        await queryRunner.query("ALTER TABLE `clients` ADD `created_At` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP");
        await queryRunner.query("DROP TABLE `order_item`");
        await queryRunner.query("CREATE UNIQUE INDEX `UQ_b48860677afe62cd96e12659482` ON `clients` (`email`)");
        await queryRunner.query("CREATE UNIQUE INDEX `UQ_4245ac34add1ceeb505efc98777` ON `clients` (`cpf`)");
    }

}
