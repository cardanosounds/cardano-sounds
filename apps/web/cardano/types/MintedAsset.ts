import { Redeemer } from "../custom_modules/@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib";

export default interface MintedAsset {
    assetName: string;
    quantity: string;
    policyId: string;
    policyScript: string;
    address?: string;
    redeemer?: Redeemer
};
