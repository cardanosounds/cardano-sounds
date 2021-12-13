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
            display="column"
            align="center"
            justify="center"
            height="10vh"
            mb="5vh"
            transition="all 0.3s ease-out"
        >
            
              <ProgressBar percent={progress} 
               width="45vw">
                <Step width="90px"  transition="scale">
                  {({ accomplished }) => (
                    <>
                      <div
                        className={`indexedStep ${
                          accomplished ? "accomplished" : null
                        }`}
                      >
                        {
                          state === 1 ? <Image style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }} src="/animated-icons/waitanim.gif" height="90px" width="90px"/> :
                          <Image style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }} src="/icons/wait.png" height="70px" width="70px"/>
                        }
                      </div>
                    </>
                  )}
                </Step>
                {/* <Step width="90px">
                  {({ accomplished }) => (
                    <>
                      <div
                        className={`indexedStep ${
                          accomplished ? "accomplished" : null
                        }`}
                      >
                        {
                          // state === 1 ? <Image style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }} src="/animated-icons/confirmanim.gif" height="90px" width="90px"/> : 
                          <Image style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }} src="/icons/confirm.png" height="90px" width="90px"/>
                        }
                      </div>
                    </>
                  )}
                </Step> */}
                <Step width="90px"  transition="scale">
                  {({ accomplished }) => (
                    <>
                      <div
                        className={`indexedStep ${
                          accomplished ? "accomplished" : null
                        }`}
                      >
                        {
                          state === 2 ? <Image src="/animated-icons/generateanim-flatten.gif" height="90px" width="90px"/> : 
                          <Image style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }} src="/icons/generate-flatten.png" height="75px" width="75px"/>
                        }
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
                        {
                          state === 3 ? <Image src="/animated-icons/mintanim2.gif" height="90px" width="90px"/> : 
                          <Image style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }} src="/icons/mint.png" height="75px" width="75px !important"/>
                        }
                      </Flex>
                    </>
                  )}
                </Step>
              </ProgressBar>
        </Flex>
      </>
  )
}
