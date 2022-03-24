import { useContext, useState } from "react";
import { ConfigContext } from "../cardano/config";
import { useProtocolParametersQuery } from "../cardano/query-api";
import useCardanoWallet from "../cardano/useCardanoWallet";
import {LibraryValidator} from '../cardano/off-chain'
import { Button } from "@chakra-ui/react";

export default function TestButton() {
 
    const [config, _] = useContext(ConfigContext)
    let pParams = useProtocolParametersQuery(config);
    let cardanoWallet = useCardanoWallet()
    // protocolParameters: ProtocolParameters,
    // asset: Asset,
    // adaPrice: number,
    // metadata: Object = null
    const makeTx = async () => {
        const validator = new LibraryValidator(cardanoWallet)
        console.log({pParams, validator})
        if(pParams.type !== 'ok') return

        await validator.lock(pParams.data, {unit: '10205d334b043dc986643a45cf0554943da622f0c0f31519d482c8f8.TestADAONFT', quantity: '1'}, 5, null)
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