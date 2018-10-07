import IEngine from '../IEngine'
import * as pg from 'pg'
import IExec from '../IExec'
import PostgresTransaction from './PostgresTransaction'
import ITransaction from '../ITransaction'

export default class EnginePostgres implements IEngine, IExec<pg.Client> {
  private readonly url?: string
  private connectionInProgress?: Promise<pg.Client>
  private _client?: pg.Client

  constructor (url?: string) {
    this.url = url
  }

  async connect (): Promise<void> {
    await this.ensureConnection()
  }

  isConnected (): boolean {
    return Boolean(this._client)
  }

  async close (): Promise<void> {
    if (!this._client) {
      return Promise.resolve()
    }

    await this._client.end()
    this._client = undefined
  }

  async drop (): Promise<void> {
    await this.exec(client => {
      return Promise.all([
        client.query('TRUNCATE channel CASCADE'),
        client.query('TRUNCATE payment CASCADE'),
        client.query('TRUNCATE token CASCADE')
      ])
    })
  }

  async exec<B> (fn: (client: pg.Client) => B): Promise<B> {
    let client = await this.ensureConnection()
    return fn(client)
  }

  async ensureConnection (): Promise<pg.Client> {
    if (this._client) {
      return this._client
    }

    if (this.connectionInProgress) {
      return this.connectionInProgress
    }

    const connectionString = { connectionString: this.url }
    const client = new pg.Client(connectionString)

    this.connectionInProgress = client.connect().then(() => {
      this._client = client
      return client
    })

    return this.connectionInProgress
  }

  async execTransaction (callback: (transaction: ITransaction) => Promise<void>): Promise<void> {
    let client = await this.ensureConnection()
    const result = new PostgresTransaction(client)
    await result.run()
  }
}
