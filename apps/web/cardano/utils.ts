
import { Assets, C, Tx, WalletProvider } from "lucid-cardano";
import { NativeScript } from "lucid-cardano/custom_modules/cardano-multiplatform-lib-browser";

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

const mintTx = async (policy : {
  policyId: string;
  script: NativeScript;
  lockSlot: number;
  paymentKeyHash: string;
}, metadata: any, mintAssets: Assets, walletName: string) => {
  const { Lucid, Blockfrost } = await import('lucid-cardano')
    await Lucid.initialize(
      'Mainnet',
      new Blockfrost('https://cardano-mainnet.blockfrost.io/api/v0', 'mainnetGHf1olOJblaj5LD8rcRudajSJGKRU6IL')
    )
    await Lucid.selectWallet(walletName as WalletProvider)
    const walletAddr = Lucid.wallet.address
    const policyScript: {
      type: string;
      scripts: any[];
    } = {
      type: "all",
      scripts: [
        {
          keyHash: policy.paymentKeyHash,
          type: "sig",
        }
      ],
    }
    if (policy.lockSlot) policyScript.scripts.push({ slot: policy.lockSlot, type: "before" })
    fetch(`https://pool.pm/register/policy/${policy.policyId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(policyScript),
    })
      .then((res) => res.json())
      .then(console.log);
    
    const tx = await Tx.new()
              .attachMetadataWithConversion(721, metadata)
              .attachMintingPolicy({
                  type: "Native",
                  script: Buffer.from(policy.script.to_bytes()).toString('hex')
              })
              .mintAssets(mintAssets)
              .addSigner(walletAddr)
              .complete();

    const signedTx = (await tx.sign()).complete();
    return await signedTx.submit();
}

export { estimateDateBySlot, estimateSlotByDate, getEpochBySlot, getSlotInEpochBySlot, createLockingPolicyScript, mintTx, DATUM_LABEL, SlotLength }
