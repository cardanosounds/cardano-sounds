import dynamic from 'next/dynamic'
import { useState } from "react"
import Buy from "./nami/buy"
import Loader from "../wallet-js/loader"

const WasmComponent = dynamic({
  loader: async () => {
    await Loader.load()
   
    // return () => <div>Adding two numbers: {wasmModule.add(2, 4)}</div>
    return () => <Buy Cardano={Loader.Cardano}></Buy>
  },
})

export default function PayBtn() {
  // const [show, changeShow] = useState(false)
  
  return (
    <div>
      Our WASM component: 
      {/* { show ?  */}
        <WasmComponent/>
        {/* : <p>is not rendered yet</p>
      }
      <button onClick={() => changeShow(true)}>Render WASM Component</button> */}
    </div>
  )
}