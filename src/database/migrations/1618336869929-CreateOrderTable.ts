import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateOrderTable1618336869929 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'order_code',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'note',
            type: 'varchar',
          },
          {
            name: 'payment_type',
            enum: ['money', 'card', 'check'],
            type: 'enum',
            default: '"money"',
          },
          {
            name: 'created_at',
            type: 'timestamp',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
          },
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('orders')
  }
}
