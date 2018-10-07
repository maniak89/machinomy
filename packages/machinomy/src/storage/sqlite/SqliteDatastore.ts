import * as sqlite from 'better-sqlite3'

export default class SqliteDatastore {
  database: sqlite

  constructor (database: sqlite) {
    this.database = database
    this.database.pragma('journal_mode = WAL')
  }

  async run (query: string, params?: any): Promise<void> {
    const st = this.database.prepare(query)
    params ? st.run(params) : st.run()
  }

  async close (): Promise<void> {
    this.database.close()
  }

  async get <A> (query: string, params?: any): Promise<A | null> {
    const st = this.database.prepare(query)
    return params ? st.get(params) : st.get()
  }

  async all <A> (query: string, params?: any): Promise<Array<A>> {
    const st = this.database.prepare(query)
    return params ? st.all(params) : st.all()
  }
}
