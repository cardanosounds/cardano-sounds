import { TIMEOUT } from 'dns';
import { NextApiRequest, NextApiResponse } from 'next'

let data : string = "waiting for transaction"
let dataNum: number = 0
export default async function (req: NextApiRequest, res: NextApiResponse) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });

    const { txid } = req.query 

    //console.log(Array.isArray(txid) ? txid[0] : txid) 

    const randNum: number = Math.random()

    if(randNum >= 0.2 ) {
      
          data =   'waiting for sound generation ' + txid
    
    }
    else data = "NFT created"

    setTimeout(
        () => {
            res.write('event: message\n')
            res.write('data: ' + data)
            res.write('\n\n')
            res.end()
        },
        1000
    )
    dataNum++
}