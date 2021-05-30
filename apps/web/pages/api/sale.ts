import { NextApiRequest, NextApiResponse } from 'next'

let data : string = "waiting for transaction"
let dataNum: number = 0
export default async function (req: NextApiRequest, res: NextApiResponse) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });

    const randNum: number = Math.random()

    if(randNum >= 0.2 ) {
        if(randNum >= 0.4) {
          if(randNum >= 0.6) {
              if(randNum >= 0.8) {
                data = "done"
              }
              else {
                data = "music generated"
              } 
          }
          else {
              "waiting for sound generation"
          } 
        }
        else {
            "transaction received"
        } 
    }
    else data = "bla"


    res.write('event: message\n')
    res.write('data: ' + data)
    res.write('\n\n')
    
    dataNum++

    res.end()
}