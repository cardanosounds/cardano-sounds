import { NextApiRequest, NextApiResponse } from 'next'
import { NFTData } from "../../../../interfaces/interfaces"

import { CosmosClient, DatabaseResponse } from "@azure/cosmos"

const endpoint = "https://your-account.documents.azure.com";
const key = "<database account masterkey>";
const client = new CosmosClient({ endpoint, key });
const databaseid = "databaseId"
const containerid = "containerId"

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
            web:"arweavewebsite.net",
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

async function getSoundsNFTData(collection: string, page: string): Promise<Array<NFTData> | String>{
    if(!/[^a-zA-Z0-9]/.test(collection) && isNaN(+page)){
        const database = (await client.databases.createIfNotExists({ id: databaseid })).database //client.database(databaseid).read()
        const container = (await database.containers.createIfNotExists({ id: containerid })).container //client.container(containerid).read()
        const res = await container.items
                    .query("SELECT * from t WHERE t.Status = 'done'")
                    .fetchAll()

        let nfts: Array<NFTData>
        if(Array.isArray(res))
        {
            for(const nftData in res)
            {
                const meta = nftData["Metadata"]
                let nft: NFTData 
                nft.arweave = meta["arweave_id_sound"]
                nft.ipfs = meta["ipfs_id_sound"]
                nft.web = meta["arweave_website_uri"]
                
                nfts.push(nft)
            }
        }
        return nfts
    }
    else {
        return "Wrong input"
    }
}