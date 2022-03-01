import { useEffect, useState } from "react";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import {
  Flex,
  Image
} from "@chakra-ui/react"
 
export default function TransactionStatus({state}: {state: 1|2|3|4}) {
  const progress = state === 1 ? 0 : state === 2 ? 25 : state === 3 ? 75 : 100
  
  return (
      <>
        <Flex
            align="center"
            justify="center"
            height={["unset", "unset", "10vh"]}
            margin={["10vh 0 0 -15vh", "10vh 0 0 -15vh", "initial"]}
            mb="5vh"
            transition="all 0.3s ease-out"
            transform={["rotate(90deg)","rotate(90deg)", "none"]}
            width={["40vh", "40vh", "40vw"]}
        >
            
              <ProgressBar percent={progress} width="100%">
                <Step width="90px"  transition="scale">
                  {({ accomplished }) => (
                    <>
                      <div
                        className={`indexedStep ${
                          accomplished ? "accomplished" : null
                        }`}
                      >
                        <Flex transform={["rotate(-90deg)","rotate(-90deg)", "none"]}>
                        {
                          state === 1 ? <Image style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }} src="/animated-icons/waitanim.gif" height="90px" width="90px"/> :
                          <Image style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }} src="/icons/wait.png" height="70px" width="70px"/>
                        }
                        </Flex>
                      </div>
                    </>
                  )}
                </Step>
                <Step width="90px"  transition="scale">
                  {({ accomplished }) => (
                    <>
                      <div
                        className={`indexedStep ${
                          accomplished ? "accomplished" : null
                        }`}
                      >
                        <Flex transform={["rotate(-90deg)","rotate(-90deg)", "none"]}>
                        {
                          state === 2 ? <Image src="/animated-icons/generateanim-flatten.gif" height="90px" width="90px"/> : 
                          <Image style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }} src="/icons/generate-flatten.png" height="75px" width="75px"/>
                        }
                        </Flex>
                      </div>
                    </>
                  )}
                </Step>
                <Step transition="scale">
                  {({ accomplished }) => (
                    <>
                      <Flex
                        width="90px"
                        className={`indexedStep ${
                          accomplished ? "accomplished" : null
                        }`}
                      >
                        <Flex transform={["rotate(-90deg)","rotate(-90deg)", "none"]}>
                        {
                          state === 3 ? <Image src="/animated-icons/mint-new.gif" height="90px" width="90px"/> : 
                          <Image style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }} src="/icons/mint.png" height="75px" width="75px !important"/>
                        }
                        </Flex>
                      </Flex>
                    </>
                  )}
                </Step>
              </ProgressBar>
        </Flex>
      </>
  )
}
