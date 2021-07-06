import React from "react"
import { Flex, Box, Image, InputGroup, Input, InputRightElement, useToast } from "@chakra-ui/react"
import { CopyIcon } from "@chakra-ui/icons"

export default function Address( { display } : { display?: "flex" | "none" | Array <"flex" | "none"> }   ) {

    const toast = useToast()

    if(typeof(display) === "undefined") {
        display = "flex"
    }
    
    return(
        <Flex 
            direction="column" 
            display={ display } 
            w={["100%", "100%", "30vw"]} 
        >
            <Box >
                <Image 
                    src="/images/qr.png" 
                    ml={["5vw", "5vw", "unset"]} 
                    w={["70vw", "70vw", "20vw"]} 
                    h={["70vw", "70vw", "20vw"]}
                    mt={["unset", "unset", "5vh"]}
                />
            </Box>
            <InputGroup 
                mt={["5vh", "5vh", "5vh"]}
                w={["85vw", "85vw", "20vw", "20vw", "20vw", "20vw"]}
                onClick={
                    () => {
                        navigator.clipboard.writeText("addr11565FAKE63454rsdfgb363454rsd9556363454rsdfgb363454r")
                        toast({
                            title: "Copied",
                            status: "success",
                            duration: 1500,
                            isClosable: true
                        })
                    }
                } 
            >
                <Input 
                    placeholder="addr11565FAKE63454rsdfgb363454rsd9556363454rsdfgb363454r" 
                    id="address"
                    isDisabled
                />
                <InputRightElement children=
                    {
                        <CopyIcon 
                        color="gray.600" />
                    } 
                />
            </InputGroup>
        </Flex>
    )
}