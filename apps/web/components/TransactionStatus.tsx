import {
  Flex,
  Stack,
  Image
} from "@chakra-ui/react"
 
export default function TransactionStatus({state}: {state: 1|2|3|4}) {
  return (
      <>
        <Flex
            display="column"
            align="center"
            justify="center"
            height="10vh"
            mb="5vh"
            transition="all 0.3s ease-out"
        >
            <Stack
              w="100%"
              align="center" margin="auto"
            >
                {/* {
                    state === 1 ? <Image src="/animated-icons/waitinganim.gif" height="90px" width="90px"/> :
                    state === 2 ? <Image src="/animated-icons/confirmanim.gif" height="90px" width="90px"/> : 
                    state === 3 ? <Image src="/animated-icons/generateanim.gif" height="90px" width="90px"/> :
                    <Image src="/animated-icons/mintanim.gif" height="90px" width="90px"/> 
                } */}
                    <Image src="/animated-icons/waitanim.gif" height="90px" width="90px"/> 
                    <Image src="/animated-icons/confirmanim.gif" height="90px" width="90px"/>  
                    <Image src="/animated-icons/generateanim.gif" height="90px" width="90px"/>
                    <Image src="/animated-icons/mintanim.gif" height="90px" width="90px"/> 
            </Stack> 
        </Flex>
      </>
  )
}
