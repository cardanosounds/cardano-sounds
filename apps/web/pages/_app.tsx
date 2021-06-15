import '../styles/global.css'
import { AppProps } from 'next/app'
import { ChakraProvider } from "@chakra-ui/react"
import theme from '../styles/theme'
import "@fontsource/share-tech-mono";
import "font-awesome/css/font-awesome.css"


// const TIMEOUT: number = 400

export default function App({ Component, pageProps }: AppProps) {

  return <>
        <ChakraProvider theme={theme}>
            <Component {...pageProps} 
            />
        </ChakraProvider>
        </>
}