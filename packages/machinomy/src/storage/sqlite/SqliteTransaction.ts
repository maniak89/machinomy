import SqliteDatastore from './SqliteDatastore'
import ITransaction from '../ITransaction'

export default class SqliteTransaction implements ITransaction {
  private datastore: SqliteDatastore
  private callback: (transaction: ITransaction) => Promise<void>

  constructor (datastore: SqliteDatastore, callback: (transaction: ITransaction) => Promise<void>) {
    this.datastore = datastore
    this.callback = callback
  }

  async run () {
    this.datastore.database.prepare('BEGIN').run()
    try {
      await this.callback(this)
      await this.commit()
    } catch (err) {
      await this.rollback()
      throw err
    }
  }

  async commit (): Promise<void> {
    this.datastore.database.prepare('COMMIT').run()
  }

  async rollback (): Promise<void> {
    this.datastore.database.prepare('ROLLBACK').run()
  }
}
