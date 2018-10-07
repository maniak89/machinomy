import Payment from '../payment'
import ChannelId from '../ChannelId'
import ITransaction from './ITransaction'

export default interface IPaymentsDatabase {
  save (token: string, payment: Payment, transaction?: ITransaction): Promise<void>
  firstMaximum (channelId: ChannelId | string): Promise<Payment | null>
  findByToken (token: string): Promise<Payment | null>
}
