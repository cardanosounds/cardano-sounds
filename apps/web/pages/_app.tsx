import '../styles/global.css'
import { AppProps } from 'next/app'
import { ChakraProvider } from "@chakra-ui/react"
import theme from '../styles/theme'
import "@fontsource/space-mono"; 


// const TIMEOUT: number = 400

export default function App({ Component, pageProps }: AppProps) {

  return <>
        <ChakraProvider theme={theme}>
            <Component {...pageProps} 
            />
        </ChakraProvider>
        </>
}