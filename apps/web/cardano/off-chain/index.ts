import { PlutusData, C, Lucid, Blockfrost, Tx, SpendingValidator } from 'lucid-cardano'
import { createLockingPolicyScript, DATUM_LABEL, Policy } from "../utils";
export const fromHex = (hex) => Buffer.from(hex, "hex");
export const toHex = (bytes) => Buffer.from(bytes).toString("hex");

export class LibraryDatum {
    private lockTokenPolicy: string
    private lockTokenName: string
    private lovelacePrice: BigInt

    constructor({
        lockTokenPolicy,
        lockTokenName,
        lovelacePrice
    }: {
        lockTokenPolicy: string,
        lockTokenName: string,
        lovelacePrice: BigInt
    }) {
        this.lockTokenPolicy = lockTokenPolicy
        this.lockTokenName = lockTokenName
        this.lovelacePrice = lovelacePrice
    }
    // {
    //     \"constructor\":0,
    //     \"fields\":[
    //         {
    //             \"constructor\":0,
    //             \"fields\":[
    //                 {\"bytes\":\"\"},   --policy   
    //                 {\"bytes\":\"\"}    --tokenName  
    //             ]
    //         },
    //         {\"int\":10000000}           --lovelacePrice
    //     ]
    // }
    toPlutusData: () => PlutusData = () => {
        const fieldsInner = C.PlutusList.new();
        fieldsInner.add(C.PlutusData.new_bytes(fromHex(this.lockTokenPolicy)));
        fieldsInner.add(C.PlutusData.new_bytes(fromHex(this.lockTokenName)));

        const libraryInput = C.PlutusList.new();
        libraryInput.add(
            C.PlutusData.new_constr_plutus_data(
                C.ConstrPlutusData.new(
                    C.BigNum.zero(),
                    fieldsInner
                )
            )
        )

        libraryInput.add(C.PlutusData.new_integer(C.BigInt.from_str(this.lovelacePrice.toString())))

        return C.PlutusData.new_constr_plutus_data(
            C.ConstrPlutusData.new(
                C.BigNum.zero(),
                libraryInput
            )
        )
    }

    asPlutusDataHexString: () => string = () => {
        return toHex(this.toPlutusData().to_bytes())
    }
}

export enum LibraryAction {
    Unlock = 0,
    Use = 1
}

export class LibraryRedeemer {
    private libraryAction: LibraryAction

    constructor(_libraryAction: LibraryAction) {
        this.libraryAction = _libraryAction
    }
    // {
    //     \"constructor\":0,
    //     \"fields\":[]
    // }
    toPlutusData = () => {
        return C.PlutusData.new_constr_plutus_data(
            C.ConstrPlutusData.new(
                C.BigNum.from_str(this.libraryAction.toString()),
                C.PlutusList.new()
            )
        )

    }
    toRedeemer = (index: number = 0) => {
        return C.Redeemer.new(
            C.RedeemerTag.new_spend(),
            C.BigNum.from_str(index.toString()),
            this.toPlutusData(),
            C.ExUnits.new(
                C.BigNum.from_str("59900"),
                C.BigNum.from_str("17804354")
            )
        );
    }
    asPlutusDataHexString = () => {
        return  toHex(this.toPlutusData().to_bytes())
    }
}

export type Asset = {
    assetName: string
    policyId: string
}

export class LibraryValidator {
    validatorAddress: string
    spendingValidator: SpendingValidator

    constructor(validatorHex: string, validatorAddress: string) {
        this.spendingValidator = {
            type: 'Plutus',
            script: // 590ff6
                validatorHex
        }
        this.validatorAddress = validatorAddress
    }

    lock = async (
        asset: Asset,
        adaPrice: number
    ) => {
        asset.assetName = Buffer.from(asset.assetName, 'ascii').toString('hex')
        await Lucid.initialize(
            'Testnet',
            new Blockfrost('https://cardano-testnet.blockfrost.io/api/v0', 'testnetRvOtxC8BHnZXiBvdeM9b3mLbi8KQPwzA')
        )
        await Lucid.selectWallet('nami')
        const walletAddr = Lucid.wallet.address

        if (!walletAddr) return
        const policy: Policy = createLockingPolicyScript(null, walletAddr)//address: string, expirationTime: Date, protocolParameters: ProtocolParameters
       
        const lockTokenMint = {
            assetName: 'CSlock' + Buffer.from(asset.assetName, 'hex').toString('ascii'),
            quantity: '1',
            policyId: policy.policyId,
            policyScript: policy.script,
            address: walletAddr
        }
        const datum = new LibraryDatum({
            lockTokenPolicy: lockTokenMint.policyId,
            lockTokenName: Buffer.from(lockTokenMint.assetName, 'ascii').toString('hex'),
            lovelacePrice: BigInt(adaPrice * 1000000)
        }).asPlutusDataHexString()
        
        let assets = {}
        assets[asset.policyId + asset.assetName] = BigInt(1)
        assets['lovelace'] = BigInt(2500000)

        let mintAssets = {}
        mintAssets[lockTokenMint.policyId + Buffer.from(lockTokenMint.assetName, 'ascii').toString('hex')] = BigInt(1)

        const tx = await Tx.new()
                .attachMetadataWithConversion(DATUM_LABEL, { 0: "0x" + datum })
                .attachMintingPolicy({
                    type: "Native",
                    script: Buffer.from(policy.script.to_bytes()).toString('hex')
                })
                .mintAssets(mintAssets)
                .payToContract(this.validatorAddress, datum, assets)
                .complete();

        const signedTx = (await tx.sign()).complete();

        const txHash = await signedTx.submit();

        console.log({ submittedTxHash: txHash })
    }

    unlock = async (
        asset: Asset,
        adaPrice: number,
        // validatorUtxo: UTxO,
    ) => {
        asset.assetName = Buffer.from(asset.assetName, 'ascii').toString('hex')
        console.log({
            asset: asset,
            adaPrice: adaPrice,
            metadata: null
        })
        await Lucid.initialize(
            'Testnet',
            new Blockfrost('https://cardano-testnet.blockfrost.io/api/v0', 'testnetRvOtxC8BHnZXiBvdeM9b3mLbi8KQPwzA')
        )
        await Lucid.selectWallet('nami')
        const walletAddr = Lucid.wallet.address

        if (!walletAddr) return

        const policy: Policy = createLockingPolicyScript(null, walletAddr)//address: string, expirationTime: Date, protocolParameters: ProtocolParameters

        const lockTokenBurn = {
            assetName: 'CSlock' + Buffer.from(asset.assetName, 'hex').toString('ascii'),
            quantity: '-1',
            policyId: policy.policyId,
            policyScript: policy.script,
            address: walletAddr
        }

        const datum = new LibraryDatum({
            lockTokenPolicy: lockTokenBurn.policyId,
            lockTokenName: Buffer.from(lockTokenBurn.assetName, 'ascii').toString('hex'),
            lovelacePrice: BigInt(adaPrice * 1000000)
        }).asPlutusDataHexString()

        const redeemer = new LibraryRedeemer(LibraryAction.Unlock).asPlutusDataHexString()       
        // let walletUtxos = await Lucid.utxosAt(walletAddr)
        // console.log('walletUtxos')
        // console.log(walletUtxos)
        let utxos = await Lucid.utxosAt(this.validatorAddress)//, asset.policyId + asset.assetName)
        console.log({utxos: utxos})
        if(!utxos)
            throw "no validator utxos with an asset"
        utxos = [utxos[3]]
        utxos = utxos.map((utxo) => {
            // for each utxo the user owns we add the datum for this user in the transaction.
            utxo.datum = datum;
            return utxo
        })

        let mintAssets = {
            [lockTokenBurn.policyId + Buffer.from(lockTokenBurn.assetName, 'ascii').toString('hex')]: BigInt(-1)
        }

        const tx = await Tx.new()
            .attachMintingPolicy({
                type: "Native",
                script: Buffer.from(policy.script.to_bytes()).toString('hex')
            })
            .mintAssets(mintAssets)
            .collectFrom(utxos, redeemer)
            .attachSpendingValidator(this.spendingValidator)
            .addSigner(walletAddr)
            .complete();

        const signedTx = (await tx.sign()).complete();

        const txHash = await signedTx.submit();

        console.log({ submittedTxHash: txHash })
    }

    use = async (
        asset: Asset,
        adaPrice: number,
        // validatorUtxo: UTxO,
    ) => {
        asset.assetName = Buffer.from(asset.assetName, 'ascii').toString('hex')
        console.log({
            asset: asset,
            adaPrice: adaPrice,
            metadata: null
        })
        await Lucid.initialize(
            'Testnet',
            new Blockfrost('https://cardano-testnet.blockfrost.io/api/v0', 'testnetRvOtxC8BHnZXiBvdeM9b3mLbi8KQPwzA')
        )
        await Lucid.selectWallet('nami')
        const walletAddr = Lucid.wallet.address

        if (!walletAddr) return

        const policy: Policy = createLockingPolicyScript(null, walletAddr)//address: string, expirationTime: Date, protocolParameters: ProtocolParameters

        const lockTokenBurn = {
            assetName: 'CSlock' + Buffer.from(asset.assetName, 'hex').toString('ascii'),
            quantity: '1',
            policyId: policy.policyId,
            policyScript: policy.script,
            address: walletAddr
        }

        const datum = new LibraryDatum({
            lockTokenPolicy: lockTokenBurn.policyId,
            lockTokenName: Buffer.from(lockTokenBurn.assetName, 'ascii').toString('hex'),
            lovelacePrice: BigInt(adaPrice * 1000000)
        }).asPlutusDataHexString()

        const redeemer = new LibraryRedeemer(LibraryAction.Use).asPlutusDataHexString()

        let utxos = await Lucid.utxosAt(this.validatorAddress)///, asset.policyId + asset.assetName)
        console.log({utxos: utxos})
        if(!utxos) {
            throw "no validator utxos with an asset"
        }
        utxos = [utxos[2]].map((utxo) => {
            // for each utxo the user owns we add the datum for this user in the transaction.
            utxo.datum = datum;
            return utxo
        })

        let assets = {
            [asset.policyId + asset.assetName]: BigInt(1),
            ['lovelace']: BigInt(6500000)
        }

        const tx = await Tx.new()
            .collectFrom(utxos, redeemer)
            .attachSpendingValidator(this.spendingValidator)
            .payToContract(this.validatorAddress, datum, assets)
            .addSigner(walletAddr)
            .complete();

        const signedTx = (await tx.sign()).complete();

        const txHash = await signedTx.submit();

        console.log({ submittedTxHash: txHash })
    }
}
