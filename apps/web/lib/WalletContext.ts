import { createContext } from 'react';

const WalletContext = createContext({
  walletApi: null,
  update: (data) => {}
})

export default WalletContext