import { gql, ApolloClient, InMemoryCache } from '@apollo/client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Config } from './config'

const getKoiosHost = ({ isMainnet }: Config) => isMainnet ? 'api.koios.rest' : 'testnet.koios.rest'
const createKoios = (config: Config) => axios.create({ baseURL: `https://${getKoiosHost(config)}` })

type Assets = Map<string, bigint>

type Value = {
  lovelace: bigint
  assets: Assets
}

type UTxO = {
  txHash: string
  index: number
  lovelace: bigint
  assets: {
    policyId: string
    assetName: string
    quantity: bigint
  }[]
}

const getBalance = (utxos: UTxO[]): Value => {
  const assets: Assets = new Map()

  utxos && utxos.forEach((utxo) => {
    utxo.assets.forEach(({ policyId, assetName, quantity }) => {
      const id = policyId + assetName
      const value = (assets.get(id) || BigInt(0)) + BigInt(quantity)
      assets.set(id, value)
    })
  })

  return {
    lovelace: utxos.map(({ lovelace }) => BigInt(lovelace)).reduce((acc, v) => acc + v, BigInt(0)),
    assets
  }
}

type QueryResult<T> =
  | { type: 'ok', data: T }
  | { type: 'loading' }
  | { type: 'error' }


const AssetUTxOQuery = gql`
query UTxOWithAssetQuery($address: String!, $policyId: String!, $asset: String!) {
  utxos(where: { 
    address: { _eq: $address }, _and: {
    tokens: { 
      asset: {
          policyId: {	
              _eq: $policyId
            }, 
          _and:	{
            assetName: {
              _eq: $asset
            }
          }
        }
      }
    }
  }) {
    txHash
    index
  }
}`

type Asset = {
  policyId: string,
  name: string
}

const useAssetUTxOsQuery = (address: string, asset: Asset, config: Config) => {
  const [result, setResult] = useState<QueryResult<UTxO[]>>({ type: 'loading' })

  useEffect(() => {
    let isMounted = true

    switch (config.queryAPI.type) {
      case 'graphql': {
        const apollo = new ApolloClient({
          uri: config.queryAPI.URI,
          cache: new InMemoryCache()
        })

        type QueryData = {
          utxos: {
            txHash: string
            index: number
            value: string
            tokens: {
              asset: {
                policyId: string
                assetName: string
              }
              quantity: string
            }[]
          }[]
        }

        type QueryVars = {
          address: string,
          policyId: string,
          asset: string
        }

        address && apollo.query<QueryData, QueryVars>({
          query: AssetUTxOQuery,
          variables: { address: address, policyId: asset.policyId, asset: asset.name }
        }).then(({ data }) => {
          const utxos = data?.utxos

          isMounted && utxos && setResult({
            type: 'ok',
            data: utxos.map((utxo) => {
              return {
                txHash: utxo.txHash,
                index: utxo.index,
                lovelace: BigInt(utxo.value),
                assets: utxo.tokens.map(({ asset, quantity }) => {
                  return {
                    policyId: asset.policyId,
                    assetName: asset.assetName,
                    quantity: BigInt(quantity)
                  }
                })
              }
            })
          })
        }).catch(() => {
          isMounted && setResult({ type: 'error' })
        })
      }

      case 'koios': {
        const koios = createKoios(config)

        address && koios.get('/api/v0/address_info', { params: { _address: address } })
          .then(({ data }) => {
            type Info = {
              balance: string
              stake_address: string
              utxo_set: {
                tx_hash: string
                tx_index: number
                value: string
                asset_list: {
                  policy_id: string
                  asset_name: string
                  quantity: string
                }[]
              }[]
            }
            const info: Info = data?.[0]

            isMounted && info && setResult({
              type: 'ok',
              data: info.utxo_set.map((utxo) => {
                return {
                  txHash: utxo.tx_hash,
                  index: utxo.tx_index,
                  lovelace: BigInt(utxo.value),
                  assets: utxo.asset_list.map((asset) => {
                    return {
                      policyId: asset.policy_id,
                      assetName: asset.asset_name,
                      quantity: BigInt(asset.quantity)
                    }
                  })
                }
              })?.filter(info => info.assets?.find(asst => asst.assetName == asset.name && asst.policyId == asset.policyId))
            })
          }).catch(() => {
            isMounted && setResult({ type: 'error' })
          })
      }
    }

    return () => {
      isMounted = false
    }
  }, [address, config])

  return result
}


const UTxOsQuery = gql`
query UTxOsByAddress($address: String!) {
  utxos(where: { address: { _eq: $address } }) {
    txHash
    index
    value
    tokens {
      asset {
        policyId
        assetName
      }
      quantity
    }
  }
}`

const useAddressUTxOsQuery = (address: string, config: Config) => {
  const [result, setResult] = useState<QueryResult<UTxO[]>>({ type: 'loading' })

  useEffect(() => {
    let isMounted = true

    switch (config.queryAPI.type) {
      case 'graphql': {
        const apollo = new ApolloClient({
          uri: config.queryAPI.URI,
          cache: new InMemoryCache()
        })

        type QueryData = {
          utxos: {
            txHash: string
            index: number
            value: string
            tokens: {
              asset: {
                policyId: string
                assetName: string
              }
              quantity: string
            }[]
          }[]
        }

        type QueryVars = {
          address: string
        }

        address && apollo.query<QueryData, QueryVars>({
          query: UTxOsQuery,
          variables: { address: address }
        }).then(({ data }) => {
          const utxos = data?.utxos

          isMounted && utxos && setResult({
            type: 'ok',
            data: utxos.map((utxo) => {
              return {
                txHash: utxo.txHash,
                index: utxo.index,
                lovelace: BigInt(utxo.value),
                assets: utxo.tokens.map(({ asset, quantity }) => {
                  return {
                    policyId: asset.policyId,
                    assetName: asset.assetName,
                    quantity: BigInt(quantity)
                  }
                })
              }
            })
          })
        }).catch(() => {
          isMounted && setResult({ type: 'error' })
        })
      }

      case 'koios': {
        const koios = createKoios(config)

        address && koios.get('/api/v0/address_info', { params: { _address: address } })
          .then(({ data }) => {
            type Info = {
              balance: string
              stake_address: string
              utxo_set: {
                tx_hash: string
                tx_index: number
                value: string
                asset_list: {
                  policy_id: string
                  asset_name: string
                  quantity: string
                }[]
              }[]
            }
            const info: Info = data?.[0]

            isMounted && info && setResult({
              type: 'ok',
              data: info.utxo_set.map((utxo) => {
                return {
                  txHash: utxo.tx_hash,
                  index: utxo.tx_index,
                  lovelace: BigInt(utxo.value),
                  assets: utxo.asset_list.map((asset) => {
                    return {
                      policyId: asset.policy_id,
                      assetName: asset.asset_name,
                      quantity: BigInt(asset.quantity)
                    }
                  })
                }
              })
            })
          }).catch(() => {
            isMounted && setResult({ type: 'error' })
          })
      }
    }

    return () => {
      isMounted = false
    }
  }, [address, config])

  return result
}

type ProtocolParameters = {
  minFeeA: number
  minFeeB: number
  poolDeposit: number
  keyDeposit: number
  coinsPerUtxoWord: number
  maxValSize: number
  maxTxSize: number
  slot: number
  priceMem: number
  priceStep: number
}

const ProtocolParametersQuery = gql`
query getProtocolParameters {
  cardano {
    tip {
      slotNo
    }
    currentEpoch {
      protocolParams {
        minFeeA
        minFeeB
        poolDeposit
        keyDeposit
        coinsPerUtxoWord
        maxValSize
        maxTxSize
        priceMem
        priceStep
      }
    }
  }
}`

const useProtocolParametersQuery = (config: Config) => {
  const [result, setResult] = useState<QueryResult<ProtocolParameters>>({ type: 'loading' })

  useEffect(() => {
    let isMounted = true

    switch (config.queryAPI.type) {
      case 'graphql': {
        const apollo = new ApolloClient({
          uri: config.queryAPI.URI,
          cache: new InMemoryCache()
        })

        type QueryData = {
          cardano: {
            tip: {
              slotNo: number
            }
            currentEpoch: {
              protocolParams: {
                minFeeA: number
                minFeeB: number
                poolDeposit: number
                keyDeposit: number
                coinsPerUtxoWord: number
                maxValSize: string
                maxTxSize: number
                priceMem: number
                priceStep: number
              }
            }
          }
        }

        apollo.query<QueryData>({ query: ProtocolParametersQuery }).then(({ data }) => {
          const params = data?.cardano.currentEpoch.protocolParams

          params && isMounted && setResult({
            type: 'ok',
            data: {
              minFeeA: params.minFeeA,
              minFeeB: params.minFeeB,
              poolDeposit: params.poolDeposit,
              keyDeposit: params.keyDeposit,
              coinsPerUtxoWord: params.coinsPerUtxoWord,
              maxValSize: parseFloat(params.maxValSize),
              maxTxSize: params.maxTxSize,
              slot: data.cardano.tip.slotNo,
              priceMem: params.priceMem,
              priceStep: params.priceStep

            }
          })
        }).catch(() => {
          isMounted && setResult({ type: 'error' })
        })
      }

      case 'koios': {
        const koios = createKoios(config)
        koios.get('/api/v0/tip').then(({ data }) => {
          type Tip = {
            hash: string
            epoch: number
            abs_slot: number
            epoch_slot: number
            block_no: number
            block_time: string
          }
          const tip: Tip = data?.[0]
          tip && koios.get('/api/v0/epoch_params', { params: { _epoch_no: tip.epoch } }).then(({ data }) => {
            type KoiosProtocolParameters = {
              min_fee_a: number
              min_fee_b: number
              key_deposit: number
              pool_deposit: number
              coins_per_utxo_word: number
              max_val_size: number
              max_tx_size: number
              price_mem: number
              price_step: number
            }
            const params: KoiosProtocolParameters = data?.[0]
            params && isMounted && setResult({
              type: 'ok',
              data: {
                minFeeA: params.min_fee_a,
                minFeeB: params.min_fee_b,
                poolDeposit: params.pool_deposit,
                keyDeposit: params.key_deposit,
                coinsPerUtxoWord: params.coins_per_utxo_word,
                maxValSize: params.max_val_size,
                maxTxSize: params.max_tx_size,
                slot: tip.abs_slot,
                priceMem: params.price_mem,
                priceStep: params.price_step
              }
            })
          }).catch(() => {
            isMounted && setResult({ type: 'error' })
          })
        }).catch(() => {
          isMounted && setResult({ type: 'error' })
        })
      }
    }

    return () => {
      isMounted = false
    }
  }, [config])

  return result
}

export type { Value, ProtocolParameters, UTxO }

export { getBalance, useAddressUTxOsQuery, useProtocolParametersQuery, useAssetUTxOsQuery }
