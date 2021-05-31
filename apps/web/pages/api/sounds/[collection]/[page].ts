import { NextApiRequest, NextApiResponse } from 'next'
import { NFTData } from "../../../../interfaces/interfaces"

export default async function (req: NextApiRequest, res: NextApiResponse) {

    const { collection } = req.query
    const { page } = req.query

    const testData = {
        last: true,
        collection: "all",
        page: 1,
        nfts: [{
            ipfs: "string",
            arweave: "string",
            rarity: 1,
            buyingTx: "string",
            mintTx: "string",
            assetHash: "string",
            tokenName: "string",
            attributes: [{
                        name: "string",
                        probability: "number",
                        media: "string"
                    }
                ]
            }
        ]
    }
    
    res.json(testData)

}