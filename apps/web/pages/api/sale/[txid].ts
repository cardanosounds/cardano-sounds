import { NextApiRequest, NextApiResponse } from 'next'
import { instanceOfDatabaseTx } from '../../../interfaces/databaseTx';
import getTransaction from '../../../lib/db'

export default async function (req: NextApiRequest, res: NextApiResponse) {
    let data: string = "not found"
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Encoding': 'none',
    });
    const { txid } = req.query 
    
    const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    const isTxidSafe = txid.length === 64 && !format.test(txid.toString()) ? true : false 

    const reply = async () => {
        const dbres = !isTxidSafe ? 'not found' : await getTransaction(txid.toString())

        if(dbres !== 'not found' && instanceOfDatabaseTx(dbres)) {
            data = JSON.stringify(dbres)
        } 

        res.write('event: message\n')
        res.write('data: ' + data)
        res.write('\n\n')
    }
    
    await reply()

    setInterval(async () => {
        await reply()
    }, 18000)
}
