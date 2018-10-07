export default interface ITransaction {
  commit (): Promise<void>
  rollback (): Promise<void>
}
