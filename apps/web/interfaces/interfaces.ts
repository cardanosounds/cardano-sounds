export interface ContextualHref {
    makeContextualHref: (extraQueryParams: { [key: string]: any }) => string
    returnHref: string
}
  
export interface CollectionData {
    id: string
    date: string
    title: string
    image: string
    contentHtml: string
}

export interface TxStatusData {
    iconFrom: string
    iconTo: string
    status: string
}

export interface NFTData {
    ipfs: string
    arweave: string
    web: string
    rarity: number
    buyingTx: string
    mintTx: string
    assetHash: string
    tokenName: string
    attributes: Sound []
    player: string
}

export interface Sound {
    name: string
    probability: number
    media: string
}

export interface SoundListData {
    nfts: NFTData[]
    last: boolean
    collection: string
    page: number
}