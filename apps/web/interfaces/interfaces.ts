import { DatabaseTx } from "./databaseTx"

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
    nfts: DatabaseTx[]
    collection: string
    page: number
}

export interface Metadata {
	id: string;
	policy_id: string;
	token_name: string;
	player: string;
	image: string;
	probability: number;
	rarity: string;
	sounds: Sound[];
	arweave_id_sound: string;
	ipfs_id_sound: string;
	arweave_website_uri: string;
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
}

export interface NFTData extends IncommingTransaction {
    metadata: Metadata;
}