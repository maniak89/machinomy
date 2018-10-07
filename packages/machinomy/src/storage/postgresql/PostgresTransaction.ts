import * as pg from 'pg'
import ITransaction from '../ITransaction'

export default class PostgresTransaction implements ITransaction {
  private client: pg.Client

  constructor (client: pg.Client) {
    this.client = client
  }

  async run () {
    await this.client.query('START TRANSACTION;')
  }

  async commit (): Promise<void> {
    await this.client.query('COMMIT;')
  }

  async rollback (): Promise<void> {
    await this.client.query('ROLLBACK;')
  }
}
