import { useContext, useState } from "react";
import { ConfigContext } from "../cardano/config";
import { useAssetUTxOsQuery, useProtocolParametersQuery } from "../cardano/query-api";
import useCardanoWallet from "../cardano/useCardanoWallet";
import { LibraryValidator, TestValidator } from '../cardano/off-chain'
import { validatorAddressTestnet } from '../cardano/on-chain/nftMediaLibPlutus'
import { AlwaysSucceedsPlutusValidator } from '../cardano/on-chain/alwaysSuceedsPlutus'
import { Button } from "@chakra-ui/react";

export default function TestButton() {
 
    const [config, _] = useContext(ConfigContext)
    let pParams = useProtocolParametersQuery(config);
    let cardanoWallet = useCardanoWallet()

    const utxosQ = useAssetUTxOsQuery(
        AlwaysSucceedsPlutusValidator.testnetAddress,
        { policyId: '74f43bdf645aaeb25f39c6392cdb771ff4eb4da0c017cc183c490b8f', name: '43534e465438' },
        // { policyId: '74f43bdf645aaeb25f39c6392cdb771ff4eb4da0c017cc183c490b8f', name: '43534e46543231' },
        config
    )

    const makeTx = async () => {
        const validator = new TestValidator(cardanoWallet)
        // console.log({pParams, validator, utxosQ})
        // if(pParams.type !== 'ok') return
        if(pParams.type !== 'ok' || utxosQ.type !== 'ok') return
        const validatorUtxo = utxosQ.data && utxosQ.data.length > 0 ? utxosQ.data[0] : null
        console.log('validatorUtxo: ' + validatorUtxo.txHash+'#'+validatorUtxo.index)
        if(utxosQ.type === 'ok') console.table(utxosQ.data)
        console.log('validatorUtxo')
        console.log(validatorUtxo)


        // await validator.payToScript(pParams.data, {unit: '74f43bdf645aaeb25f39c6392cdb771ff4eb4da0c017cc183c490b8f.CSNFT8', quantity: '1'}, 5, null)
        await validator.spendFromScript(pParams.data, {unit: '74f43bdf645aaeb25f39c6392cdb771ff4eb4da0c017cc183c490b8f.CSNFT8', quantity: '1'}, 5, validatorUtxo)
    }

    return (
        <>  <Button onClick={() => makeTx()}>Click</Button>
                {/* <button onClick={() => makeTx()} className="m-2 p-10 text-white rounded-xl transition-all duration-500 bg-gradient-to-br to-blue-500 via-black from-blue-900 bg-size-200 bg-pos-0 hover:bg-pos-100">
                <h2>
                    Click
                </h2>
                </button>  */}
        </>
    )
}