import { Flex, Heading } from "@chakra-ui/react";
import Layout from "../components/layout";
import { ArjsProvider, useArjs } from 'arjs-react'
import { useState } from "react";

export default function Arweave() {
  const wallet = useArjs();
  const permission = { permissions: ["SIGN_TRANSACTION"] }
  const [key, setKey] = useState('')

  const activate = (connector, key) => wallet.connect(connector, key)
  const getKey = (e) => { setKey(e.target.value) }

  const [balance, setBalance] = useState("Requesting...");
  const [address, setAddress] = useState("Requesting...");

  wallet.ready(() => {
    if (wallet.status == "connected") (async () => {
      console.log(wallet)
      setBalance(wallet.getArweave().ar.winstonToAr(await wallet.getBalance("self")))
      setAddress(await wallet.getAddress())
    })()
  })

  return (
    <Layout>
      <Flex align="center" justify="center" minH="85vh" mt="15vh" m="0">
        <>
          <h1>Wallet</h1>
          {wallet.status == "connected" ? (
            <div>
              <div>Account: {address}</div>
              <div>Balance: {balance}</div>
              <button onClick={() => wallet.disconnect()}>disconnect</button>
            </div>
          ) : (
            <div>
              Connect:
              <button onClick={() => activate('arweave', key)}>Arweave (with Key)</button>
              <input type="text" value={key} placeholder={'key here'} onChange={getKey} />
              <button onClick={() => activate('arconnect', permission)}>ArConnect</button>
            </div>
          )}
        </>
      </Flex>
    </Layout>
  )
}

