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


export interface MintMetadataFileInput {
    name: string;
    ipfsHash: string;
    mediaType: string;
    arweaveHash: string;
  }