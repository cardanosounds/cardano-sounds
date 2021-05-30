import { NextApiRequest, NextApiResponse } from 'next'
import { NFTData } from "../../../interfaces/interfaces"

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { query } = req.query

    const qArray: string[] = typeof(query) !== "undefined" ? query as string[] : []

    let page: number = 1
    let collection: string = ""

    switch(qArray.length) {
        case 0: {
            break;
        }
        case 1: {
            //only page
            page = qArray[0] as unknown as number
            break;
        }
        case 2: {
            //collection/page
            page = qArray[0] as unknown as number
            collection = qArray[1]
            break;
        }
        default: {
            break;
        }
    }
    

}