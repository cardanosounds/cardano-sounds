export interface DatabaseTx {
    metadata:       Metadata[];
    id:             string;
    tx_hash:        string;
    output_index:   number;
    amount:         Amount[];
    sender_address: string;
    status:         string;
    created:        string;
    nft_count:      string;
}

export interface Metadata {
    id:                  string;
    token_name:          string;
    player:              string;
    image:               string;
    probability:         number;
    rarity:              string;
    sounds:              Sound[];
    arweave_id_sound:    string;
    ipfs_id_sound:       string;
    arweave_website_uri: string;
}

export interface Sound {
    probability: number;
    filename:    string;
    category:    string;
}

export interface Amount {
    Unit:     string;
    Quantity: number;
}

export function instanceOfDatabaseTx(object: any): object is DatabaseTx {
    return 'tx_hash' in object;
}