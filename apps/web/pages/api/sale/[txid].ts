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
        if(randNum >= 0.4) {
          if(randNum >= 0.6) {
              if(randNum >= 0.8) {
                data = txid + ' done'
              }
              else {
                data = 'music generated for ' + txid
              } 
          }
          else {
              'waiting for sound generation ' + txid
          } 
        }
        else {
            'transaction ' + txid + ' received'
        } 
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