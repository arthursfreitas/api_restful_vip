import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class Pedidos1618154765855 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pedidos',
        columns: [
          {
            name: 'codigo_pedido',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'data_pedido',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'observacao',
            type: 'varchar',
          },
          {
            name: 'forma_de_pagamento',
            type: 'enum',
            enum: ['DINHEIRO', 'CARTÃO', 'CHEQUE'],
            default: '"DINHEIRO"',
            enumName: 'forma_de_pagamento',
          },
          {
            name: 'created_At',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_At',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pedidos')
  }
}
