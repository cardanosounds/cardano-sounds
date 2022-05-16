import { Metadata } from "@prisma/client"

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

export interface Sound {
    probability: number;
    filename: string;
    category: string;
}

export interface SoundListData {
    nfts: Metadata[]
    collection: string
    page: number
}

export interface TokenValue {
    unit: string;
    quantity: number;
}

export interface IncommingTransaction {
    id: string;
    tx_Hash: string;
    output_Index: number;
    amount: TokenValue[];
    senderAddress: string;
    status: string;
    created: string;
    nft_count: string;
}


export type IpfsSrc = String
export type ArweaveSrc = String

export interface AssetView {
    assetAsciiName: string
    assetPolicyId: string
    assetImgSrc: IpfsSrc | ArweaveSrc
    quantity: BigInt
}

export interface AssetInfoBF {
    asset:                string
    policy_id:            string
    asset_name:           string
    fingerprint:          string
    quantity:             string
    initial_mint_tx_hash: string
    mint_or_burn_count:   number
    onchain_metadata:     OnchainMetadata
    metadata:             BFMetadata
}

export interface BFMetadata {
    name:        string
    description: string
    ticker:      string
    url:         string
    logo:        string
    decimals:    number
}

export interface OnchainMetadata {
    name:  string
    image: string
}
export interface MintMetadataFileInput {
    name: string;
    ipfsHash: string;
    mediaType: string;
    arweaveHash: string;
}

export interface NftMetadataInput {
    image: string;
    name: string;
    publisher: string;
    collection: string;
    summary: string;
    description: string;
    metadataName: string;
    quantity: string;
    author: string;
    arweaveHash: string;
}
