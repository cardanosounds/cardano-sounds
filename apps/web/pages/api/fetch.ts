import { NextApiRequest, NextApiResponse } from 'next'

export default async function (req: NextApiRequest, res: NextApiResponse) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });

    for (let i = 1; i < 10; i++) {
        await sendData(i, res);
    }
    res.end();
}
async function keepSendingData(res: NextApiResponse){
for (let i:number = 1; i < 10; i++) {
    await sleep(1000);
    sendData(i, res);
    }
    
} 

const sendData = async (id: number, res: NextApiResponse) => {
    await sleep(1000);
    res.write('event: message\n');
    res.write('data: ' + 'fuck');
    res.write('\n\n');
};
  
const sleep = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
    });
};