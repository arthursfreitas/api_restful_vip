import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class Produtos1618103176738 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'produtos',
        columns: [
          {
            name: 'codigo_produto',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'nome',
            type: 'varchar',
          },
          {
            name: 'cor',
            type: 'varchar',
          },
          {
            name: 'tamanho',
            type: 'varchar',
          },
          {
            name: 'valor',
            type: 'varchar',
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
    await queryRunner.dropTable('produtos')
  }
}
