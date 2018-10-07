import ChannelId from '../ChannelId'
import ITransaction from './ITransaction'

export default interface ITokensDatabase {
  save (token: string, channelId: ChannelId | string, transaction?: ITransaction): Promise<void>
  isPresent (token: string): Promise<boolean>
}
