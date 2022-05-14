
import { C } from "lucid-cardano";
import { NativeScript } from "lucid-cardano/custom_modules/cardano-multiplatform-lib-browser";
import { AssetInfoBF } from '../interfaces'

const SlotLength = 432000
const shelleyStart = (isMainnet: boolean): number => isMainnet ? 4924800 : 4924800 + 129600 - SlotLength
const networkOffset = (isMainnet: boolean): number => isMainnet ? 1596491091 : 1599294016 + 129600 - SlotLength
const estimateDateBySlot = (slot: number, isMainnet: boolean): Date => new Date((slot - shelleyStart(isMainnet) + networkOffset(isMainnet)) * 1000)
const estimateSlotByDate = (date: Date, isMainnet: boolean): number => Math.floor(date.getTime() / 1000) + shelleyStart(isMainnet) - networkOffset(isMainnet)
const slotSinceShelley = (slot: number, isMainnet: boolean): number => slot - shelleyStart(isMainnet)
const getEpochBySlot = (slot: number, isMainnet: boolean) => Math.floor(slotSinceShelley(slot, isMainnet) / SlotLength) + (isMainnet ? 208 : 80) + 1
const getSlotInEpochBySlot = (slot: number, isMainnet: boolean) => slotSinceShelley(slot, isMainnet) % SlotLength

export type Policy = { 
    policyId: string, script: NativeScript, lockSlot: number, paymentKeyHash: string 
}

const DATUM_LABEL = 405;

const createLockingPolicyScript = (expirationTime: Date, walletAddress: string, mainnet: boolean = true) => {
    const lockSlot = !expirationTime ? undefined : estimateSlotByDate(expirationTime, mainnet)
    
    const paymentKeyHash = C.BaseAddress.from_address(
        C.Address.from_bech32(walletAddress)
    )
      .payment_cred()
      .to_keyhash();

    const nativeScripts = C.NativeScripts.new();
    const script = C.ScriptPubkey.new(paymentKeyHash);
    const nativeScript = C.NativeScript.new_script_pubkey(script);
    if(lockSlot) {
      const lockScript = C.NativeScript.new_timelock_expiry(
        C.TimelockExpiry.new(C.BigNum.from_str(lockSlot.toString()))
      );
      nativeScripts.add(lockScript);
    }
    nativeScripts.add(nativeScript);
    const finalScript = C.NativeScript.new_script_all(
      C.ScriptAll.new(nativeScripts)
    );
    const policyId = Buffer.from(
      C.ScriptHash.from_bytes(
        finalScript.hash(C.ScriptHashNamespace.NativeScript).to_bytes()
      ).to_bytes(),
    ).toString("hex");
    const keyHashString = Buffer.from(
      paymentKeyHash.to_bytes(),
    ).toString("hex");
    return { policyId: policyId, script: finalScript, lockSlot: lockSlot, paymentKeyHash: keyHashString };
}

const getAssetsInfo: (unit: string) => Promise<AssetInfoBF> = async (unit: string) => {
  return (await (await fetch(`https://cardano-testnet.blockfrost.io/api/v0/assets/${unit}`, { headers: {
      project_id: 'testnetRvOtxC8BHnZXiBvdeM9b3mLbi8KQPwzA'
  }})).json() as AssetInfoBF)
}

export { estimateDateBySlot, estimateSlotByDate, getEpochBySlot, getSlotInEpochBySlot, createLockingPolicyScript, getAssetsInfo, DATUM_LABEL, SlotLength }
