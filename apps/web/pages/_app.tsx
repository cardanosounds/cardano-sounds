import '../styles/global.css'
import { useState } from 'react'
import { AppProps } from 'next/app'
import { ChakraProvider } from "@chakra-ui/react"
import theme from '../styles/theme'
import "@fontsource/share-tech-mono";
import "font-awesome/css/font-awesome.css"
import { StoreProvider } from 'easy-peasy'
import store from '../store'
// const TIMEOUT: number = 400

export default function App({ Component, pageProps }: AppProps) {
  const [state, setState] = useState({
    walletApi: null,
    update
  })

  function update(data) {
    setState(Object.assign({}, state, data));
  }
  return (
    <StoreProvider store={store}>
      <ChakraProvider theme={theme}>
          <Component {...pageProps} 
          />
      </ChakraProvider>
    </StoreProvider>
  )
}