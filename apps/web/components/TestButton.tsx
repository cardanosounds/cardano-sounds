import { LibraryValidator } from '../cardano/off-chain'
import { Button } from "@chakra-ui/react";
import { validator, validatorAddressTestnet } from '../cardano/on-chain/nftMediaLibPlutus';

export default function TestButton() {
 
    const makeTx = async () => {
        const plutusValidator = new LibraryValidator(
            validator,
            validatorAddressTestnet
        )
        plutusValidator.lock({assetName: "985001", policyId: "06201e3bc4613cee82dfba9370b5e0470a1cb0c0c00715b8911b6a18"}, 2)
      
    }

    return (
        <>
            <Button onClick={() => makeTx()}>Click</Button>
        </>
    )
}