import { createContext } from 'react'

type GraphQL = {
  type: 'graphql'
  URI: string
}

type Koios = {
  type: 'koios'
}

type QueryAPI = GraphQL | Koios

type Config = {
  isMainnet: boolean
  queryAPI: QueryAPI
}

const defaultConfig: Config = {
  isMainnet: false,
  // queryAPI: { type: 'koios' }
  queryAPI: { type: 'graphql',  URI: 'https://graphql-api.testnet.dandelion.link/'}
}

const ConfigContext = createContext<[Config, (x: Config) => void]>([defaultConfig, (_) => { }])

export type { Config }
export { ConfigContext, defaultConfig }
