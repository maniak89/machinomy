import * as BigNumber from 'bignumber.js'
import { PaymentChannel } from '../PaymentChannel'
import ChannelId from '../ChannelId'
import ITransaction from './ITransaction'

export default interface IChannelsDatabase {
  save (paymentChannel: PaymentChannel, transaction?: ITransaction): Promise<void>
  saveOrUpdate (paymentChannel: PaymentChannel, transaction?: ITransaction): Promise<void>
  deposit (channelId: ChannelId | string, value: BigNumber.BigNumber, transaction?: ITransaction): Promise<void>
  firstById (channelId: ChannelId | string): Promise<PaymentChannel | null>
  spend (channelId: ChannelId | string, spent: BigNumber.BigNumber, transaction?: ITransaction): Promise<void>
  all (): Promise<Array<PaymentChannel>>
  allOpen (): Promise<PaymentChannel[]>
  allSettling (): Promise<PaymentChannel[]>
  findUsable (sender: string, receiver: string, amount: BigNumber.BigNumber): Promise<PaymentChannel | null>
  findBySenderReceiver (sender: string, receiver: string): Promise<Array<PaymentChannel>>
  findBySenderReceiverChannelId (sender: string, receiver: string, channelId: ChannelId | string): Promise<PaymentChannel | null>
  updateState (channelId: ChannelId | string, state: number, transaction?: ITransaction): Promise<void>
}
