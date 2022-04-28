import { TransactionUnspentOutput } from "../custom_modules/@emurgo/cardano-serialization-lib-browser";
import { ProtocolParameters } from "../query-api";
import Delegation from "./Delegation";
import WalletOutput from "./WalletOutput";

export default interface TransactionParams {
    protocolParameters: ProtocolParameters,
    paymentAddress: string,
    walletOutputs: WalletOutput[],
    metadata: object | null,
    metadataHash: string | null,
    addMetadata: boolean,
    utxosRaw: TransactionUnspentOutput[] | undefined,
    ttl: number,
    multiSig: boolean,
    delegation: Delegation | null
    // ,
    // datums?: PlutusData[],
    // redeemers: Redeemer[],
    // plutusValidators: PlutusScript[],
    // plutusPolicies: PlutusScript[],
    // burn: boolean
}