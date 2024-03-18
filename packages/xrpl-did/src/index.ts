interface XrplDIDConfig {
  address: string
  networkId: number
}

export class XrplDID {
  public did: string
  public address: string

  constructor(config: XrplDIDConfig) {
    this.address = config.address
    this.did = `xrpl:${config.networkId}:${config.address}`
  }
}
