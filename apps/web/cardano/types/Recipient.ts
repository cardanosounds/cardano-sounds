import { PlutusData } from '../custom_modules/@emurgo/cardano-serialization-lib-browser';
import { Asset, MintedAsset } from './index';

export default interface Recipient {
    address: string;
    amount: string;
    assets?: Asset[];
    mintedAssets?: MintedAsset[];
    datum?: PlutusData;
};
