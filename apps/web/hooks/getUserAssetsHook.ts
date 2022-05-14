import { Assets } from "lucid-cardano"
import { useEffect, useState } from "react"
import { getAssetsInfo } from "../cardano/utils"
import { ArweaveSrc, AssetView, IpfsSrc } from "../interfaces"


export default function getUserAssetsHook() {
    const [userAssetViews, setUserAssetViews] = useState<AssetView[] | 'loading'>('loading')

    const loadUserAssets = async () => {
        const { Lucid, Blockfrost } = await import('lucid-cardano')
        await Lucid.initialize(
            'Testnet',
            new Blockfrost('https://cardano-testnet.blockfrost.io/api/v0', 'testnetRvOtxC8BHnZXiBvdeM9b3mLbi8KQPwzA')
        )
        await Lucid.selectWallet('nami')
        const walletAddr = Lucid.wallet.address

        const utxos = await Lucid.utxosAt(walletAddr)
        
        const assetsArray = utxos.map(utxo => utxo.assets)

        let totalAssets: Assets = {}

        assetsArray.forEach(assets => 
            Object.keys(assets).forEach(asset => {
                if(totalAssets[asset]){
                    totalAssets[asset] = totalAssets[asset] as bigint + (assets[asset] as bigint)
                } else {
                    totalAssets[asset] = assets[asset]
                }
            })
        )
        if(!totalAssets) {
            setUserAssetViews([])
            return
        }

        console.log({length: Object.keys(totalAssets).length})
        setUserAssetViews(
            await Promise.all(Object.keys(totalAssets).map(async unit => {
                const assetInfo = await getAssetsInfo(unit)
                if(assetInfo) {
                    console.log(assetInfo)
                    return {
                        assetPolicyId: assetInfo.policy_id,
                        quantity: totalAssets[unit],
                        assetAsciiName: 
                            assetInfo.onchain_metadata && assetInfo.onchain_metadata.name ?
                            assetInfo.onchain_metadata.name :
                            assetInfo.asset_name ?
                                Buffer.from(assetInfo.asset_name, 'hex').toString('ascii') :
                                '',
                        assetImgSrc: 
                            assetInfo.onchain_metadata && assetInfo.onchain_metadata.image ?
                                assetInfo.onchain_metadata.image.includes('ipfs') ?
                                assetInfo.onchain_metadata.image.replace('ipfs://', '').replace('ipfs/', '') as IpfsSrc :
                                assetInfo.onchain_metadata.image.includes('ar://') ?
                                    assetInfo.onchain_metadata.image.replace('ar://', '') as ArweaveSrc :
                                    assetInfo.onchain_metadata.image
                                : 'default'
                    } as AssetView
                }
            }
        )))
    }


    useEffect(() => {
        loadUserAssets()
    }, [])

    return [userAssetViews, loadUserAssets]
}