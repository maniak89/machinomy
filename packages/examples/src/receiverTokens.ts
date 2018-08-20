import * as path from 'path'
import * as fs from 'fs-extra'
import * as Web3 from 'web3'
import Machinomy from 'machinomy'
import HDWalletProvider from '@machinomy/hdwallet-provider'
import Logger from '@machinomy/logger'

const payment = require(path.resolve('./payment.json'))
const PROVIDER = process.env.PROVIDER || 'https://rinkeby.infura.io'
const MNEMONIC_SENDER = process.env.MNEMONIC_SENDER || 'peanut giggle name tree canoe tube render ketchup survey segment army will'
const MNEMONIC_RECEIVER = process.env.MNEMONIC_RECEIVER || 'peanut giggle name tree canoe tube render ketchup survey segment army will'
const LOG = new Logger('machinomy-receiver')

async function run () {
  fs.removeSync(path.resolve('./sender-receiver'))

  LOG.info(`PROVIDER = ${PROVIDER}`)
  LOG.info(`MNEMONIC SENDER = ${MNEMONIC_SENDER}`)
  LOG.info(`MNEMONIC RECEIVER = ${MNEMONIC_RECEIVER}`)

  const provider1 = new HDWalletProvider(MNEMONIC_SENDER, PROVIDER)
  const provider2 = new HDWalletProvider(MNEMONIC_RECEIVER, PROVIDER)
  const senderAccount = await provider1.getAddress(0)
  const receiverAccount = await provider2.getAddress(0)
  const receiverWeb3 = new Web3(provider2)
  const receiverMachinomy = new Machinomy(
    receiverAccount,
    receiverWeb3, {
      databaseUrl: 'nedb://sender-receiver/database.nedb'
    }
  )

  LOG.info(`Sender: ${senderAccount}`)
  LOG.info(`Receiver: ${receiverAccount}`)
  LOG.info(`Accept payment: ${JSON.stringify(payment)}`)

  await receiverMachinomy.acceptPayment({
    payment: payment
  })

  LOG.info(`Start closing channel with channelID ${payment.channelId}`)

  await receiverMachinomy.close(payment.channelId)

  LOG.info(`Channel ${payment.channelId} was successfully closed.`)
  LOG.info(`Trace the last transaction via https://rinkeby.etherscan.io/address/${receiverAccount}`)
  LOG.info(`Receiver done.`)

  process.exit(0)
}

run().catch(err => {
  console.error(err)
})
