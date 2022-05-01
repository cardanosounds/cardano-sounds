import { useContext, useState } from "react";
import { LibraryValidator } from '../cardano/off-chain'
import { validatorAddressTestnet } from '../cardano/on-chain/nftMediaLibPlutus'
import { AlwaysSucceedsPlutusValidator } from '../cardano/on-chain/alwaysSuceedsPlutus'
import { Button } from "@chakra-ui/react";

export default function TestButton() {
 
    

    const makeTx = async () => {
        const validator = new LibraryValidator()
        validator.unlock({assetName: "43534e465438", policyId: "74f43bdf645aaeb25f39c6392cdb771ff4eb4da0c017cc183c490b8f"}, 2)
      
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