import { LibraryValidator } from '../cardano/off-chain'
import { Button } from "@chakra-ui/react";
import { validator, validatorAddressTestnet } from '../cardano/on-chain/nftMediaLibPlutus';

export default function TestButton() {
 
    const makeTx = async () => {
        const plutusValidator = new LibraryValidator(
            validator,
            validatorAddressTestnet
        )
        plutusValidator.lock({assetName: "csnft19", policyId: "74f43bdf645aaeb25f39c6392cdb771ff4eb4da0c017cc183c490b8f"}, 2)
      
    }

    return (
        <>
            <Button onClick={() => makeTx()}>Click</Button>
        </>
    )
}