import { Resolver, DIDDocument, Resolvable } from 'did-resolver'
import { getResolver } from '../src/resolver'
import { Client, DIDSet, Wallet, convertStringToHex } from 'xrpl'

const client = new Client('wss://s.devnet.rippletest.net:51233')

async function setDID(wallet: Wallet, document: any): Promise<void> {
  const jsonDocument = JSON.stringify(document)
  const tx: DIDSet = {
    TransactionType: 'DIDSet',
    Account: wallet.address,
    DIDDocument: convertStringToHex(jsonDocument),
  }
  await client.submitAndWait(tx, { autofill: true, wallet })
}

describe('xrpl did resolver', () => {
  jest.setTimeout(20000)

  let wallet: Wallet
  let did: string
  // const validResponse: DIDDocument = {
  //   '@context': 'https://www.w3.org/ns/did/v1',
  //   id: did,
  //   publicKey: [
  //     {
  //       id: `${did}#owner`,
  //       type: 'EcdsaSecp256k1RecoveryMethod2020',
  //       controller: did,
  //       ethereumAddress: identity,
  //     },
  //   ],
  //   authentication: [`${did}#owner`],
  // }
  let validResponse: any

  let didResolver: Resolvable

  beforeAll(async () => {
    didResolver = new Resolver(getResolver())
    await client.connect()
  })

  afterAll(async () => {
    await client.disconnect()
  })

  beforeEach(async () => {
    wallet = (await client.fundWallet()).wallet
    did = `did:xrpl:${wallet.address}`
    validResponse = {
      '@context': 'https://www.w3.org/ns/did/v1',
      id: did,
    }
  })

  it('resolves document', async () => {
    expect.assertions(2)
    await setDID(wallet, validResponse)
    const result = await didResolver.resolve(did)
    expect(result.didDocument).toEqual(validResponse)
    expect(result.didResolutionMetadata.contentType).toEqual('application/did+ld+json')
  })

  it('fails if the did is not a valid account', async () => {
    expect.assertions(1)
    const result = await didResolver.resolve(did)
    expect(result.didResolutionMetadata.error).toEqual('notFound')
  })

  it('fails if the did document is not valid json', async () => {
    expect.assertions(2)
    await setDID(wallet, 'document')
    const result = await didResolver.resolve(did)
    expect(result.didResolutionMetadata.error).toEqual('unsupportedFormat')
    expect(result.didResolutionMetadata.message).toMatch(
      /DID does not resolve to a valid document containing a JSON document/
    )
  })

  it('fails if the did document id does not match', async () => {
    expect.assertions(2)
    const wrongIdResponse = {
      ...validResponse,
      id: `did:xrpl:${Wallet.generate().address}`,
    }
    await setDID(wallet, wrongIdResponse)
    const result = await didResolver.resolve(did)
    expect(result.didResolutionMetadata.error).toEqual('notFound')
    expect(result.didResolutionMetadata.message).toMatch(/DID document id does not match requested did/)
  })

  it('returns correct contentType without @context', async () => {
    expect.assertions(1)
    const noContextResponse = {
      ...validResponse,
    }
    delete noContextResponse['@context']
    await setDID(wallet, noContextResponse)
    const result = await didResolver.resolve(did)
    expect(result.didResolutionMetadata.contentType).toEqual('application/did+json')
  })
})
