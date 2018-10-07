import ITransaction from './ITransaction'

export default interface IEngine {
  connect (): Promise<void>
  isConnected (): boolean
  close (): Promise<void>
  drop (): Promise<void>
  execTransaction (callback: (transaction: ITransaction) => Promise<void>): Promise<void>
}
