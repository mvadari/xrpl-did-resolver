# XRPL DID Resolver

This library is intended to represent domains accessed through https as
[Decentralized Identifiers](https://w3c.github.io/did-core/#identifier)
and retrieve an associated [DID Document](https://w3c.github.io/did-core/#did-document-properties)

It supports the proposed [`did:xrpl` method spec](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0040d-decentralized-identity).

It requires the `did-resolver` library, which is the primary interface for resolving DIDs.

## DID method

To encode a DID for an HTTPS domain, simply prepend `did:xrpl:` to domain name.

eg: `rNsD97gAPq9V3DRBfWkV32N6ihbF5oWBrD -> did:xrpl:rNsD97gAPq9V3DRBfWkV32N6ihbF5oWBrD`

## DID Document

The DID resolver takes the domain and forms a [well-known URI](https://tools.ietf.org/html/rfc5785)
to access the DID Document.

For a did `did:xrpl:rNsD97gAPq9V3DRBfWkV32N6ihbF5oWBrD`, the resolver will attempt to access the document stored in the `DID` object of the account `rNsD97gAPq9V3DRBfWkV32N6ihbF5oWBrD`.

A minimal DID Document might contain the following information:

```json
{
  "@context": "https://w3id.org/did/v1",
  "id": "did:xrpl:rNsD97gAPq9V3DRBfWkV32N6ihbF5oWBrD",
  "publicKey": [
    {
      "id": "did:xrpl:rNsD97gAPq9V3DRBfWkV32N6ihbF5oWBrD#owner",
      "type": "Secp256k1VerificationKey2018",
      "controller": "did:xrpl:rNsD97gAPq9V3DRBfWkV32N6ihbF5oWBrD",
      "publicKeyHex": "04ab0102bcae6c7c3a90b01a3879d9518081bc06123038488db9cb109b082a77d97ea3373e3dfde0eccd9adbdce11d0302ea5c098dbb0b310234c8689501749274"
    }
  ],
  "assertionMethod": [ "did:xrpl:rNsD97gAPq9V3DRBfWkV32N6ihbF5oWBrD#owner" ],
  "authentication": [ "did:xrpl:rNsD97gAPq9V3DRBfWkV32N6ihbF5oWBrD#owner" ]
}
```

Note: this example uses the `Secp256k1VerificationKey2018` type and an `publicKeyHex` as a publicKey entry, signaling
that this DID is claiming to control the private key associated with that publicKey.

## Resolving a DID document

The resolver presents a simple `resolver()` function that returns a ES6 Promise returning the DID document.

```js
import { Resolver } from 'did-resolver'
import { getResolver } from 'xrpl-did-resolver'

const xrplResolver = getResolver()

const didResolver = new Resolver({
    ...xrplResolver
    //...you can flatten multiple resolver methods into the Resolver
})

didResolver.resolve('did:xrpl:rNsD97gAPq9V3DRBfWkV32N6ihbF5oWBrD').then(doc => console.log(doc))

// You can also use ES7 async/await syntax
;(async () => {
    const doc = await didResolver.resolve('did:xrpl:rNsD97gAPq9V3DRBfWkV32N6ihbF5oWBrD')
    console.log(doc)
})();
```
