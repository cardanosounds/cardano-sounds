import { PlutusData } from '../custom_modules/@emurgo/cardano-serialization-lib-browser';
import { Asset, MintedAsset } from './index';
import ValidatorInput from './ValidatorInput';

export default interface WalletOutput {
    address: string
    amount: string
    assets?: Asset[]
    mintedAssets?: MintedAsset[]
    datum?: PlutusData
    scInput?: ValidatorInput
};
