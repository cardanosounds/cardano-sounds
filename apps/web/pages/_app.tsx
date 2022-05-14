import '../styles/global.css'
import { useState } from 'react'
import { AppProps } from 'next/app'
import { ChakraProvider } from "@chakra-ui/react"
import theme from '../styles/theme'
import "@fontsource/share-tech-mono";
import "font-awesome/css/font-awesome.css"
import WalletContext from '../lib/WalletContext';
import { ArjsProvider } from 'arjs-react'

export default function App({ Component, pageProps }: AppProps) {
  const [state, setState] = useState({
    walletApi: null,
    update
  })

  function update(data) {
    setState(Object.assign({}, state, data));
  }
  return <>
    <ArjsProvider
      //Add wallets here
      connectors={{
        arconnect: true,
        arweave: true
      }}
      //enable/disable smartweave contract interaction here
      enableSWC={false}>
      <WalletContext.Provider value={state}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps}
          />
        </ChakraProvider>
      </WalletContext.Provider>
    </ArjsProvider>
  </>
}