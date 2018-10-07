import * as Datastore from 'nedb'
import IEngine from '../IEngine'
import IExec from '../IExec'
import NedbDatastore from './NedbDatastore'
import ITransaction from '../ITransaction'

let db = new Map<string, NedbDatastore>()

class EmptyTransaction implements ITransaction {
  async commit (): Promise<void> {
    return
  }
  async rollback (): Promise<void> {
    return
  }

}

export default class EngineNedb implements IEngine, IExec<NedbDatastore> {
  datastore: NedbDatastore

  constructor (path: string, inMemoryOnly: boolean = false) {
    let found = db.get(path)
    if (found) {
      this.datastore = found
    } else {
      let datastore = new Datastore({ filename: path, autoload: true, inMemoryOnly: inMemoryOnly })
      this.datastore = new NedbDatastore(datastore)
      db.set(path, this.datastore)
    }
  }

  isConnected (): boolean {
    return true
  }

  connect (): Promise<void> {
    return Promise.resolve()
  }

  close (): Promise<void> {
    return Promise.resolve()
  }

  async drop (): Promise<void> {
    await this.exec(async client => {
      await client.remove({}, { multi: true })
    })
  }

  async exec <B> (fn: (client: NedbDatastore) => B): Promise<B> {
    return fn(this.datastore)
  }

  async execTransaction (callback: (transaction: ITransaction) => Promise<void>): Promise<void> {
    return callback(new EmptyTransaction())
  }
}
