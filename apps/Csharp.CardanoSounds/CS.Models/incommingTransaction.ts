export interface IncommingTransaction {
    id: string;
    tx_Hash: string;
    output_Index: number;
    amount: TokenValue[];
    senderAddress: string;
    status: string;
    created: string;
}