import { NextApiRequest, NextApiResponse } from 'next'
import { NFTData, SoundListData } from "../../../../interfaces/interfaces"

import { CosmosClient, DatabaseResponse } from "@azure/cosmos"

const endpoint = "https://your-account.documents.azure.com";
const key = "<database account masterkey>";
const client = new CosmosClient({ endpoint, key });
const databaseid = "databaseId"
const containerid = "containerId"

export default async function (req: NextApiRequest, res: NextApiResponse): Promise<Array<NFTData> | String> {

    const { collection } = req.query
    const { page } = req.query


    if(collection && page && !isNaN(Number(page)))
        var nftListData = await getSoundsNFTData(collection.toString(), Number(page))


    if(nftListData instanceof String) return nftListData 

    const data:SoundListData = 
    {
        collection: collection.toString(),
        page: Number(page.toString()),
        nfts: nftListData
    }
    
    res.json(data)

}

async function getSoundsNFTData(collection: string, page: number): Promise<Array<NFTData> | String>{
    if(!/[^a-zA-Z0-9]/.test(collection)){
        const database = (await client.databases.createIfNotExists({ id: databaseid })).database //client.database(databaseid).read()
        const container = (await database.containers.createIfNotExists({ id: containerid })).container //client.container(containerid).read()

        const offset = page == 1 ? 0 : (page - 1) * 9 
        const res = await container.items
                    .query(`SELECT * from t WHERE t.Status = 'done' ORDER BY 'created' OFFSET ${offset} LIMIT 9`)
                    .fetchAll() 

        let nfts: Array<NFTData>
        if(Array.isArray(res))
        {
            nfts = res as unknown as Array<NFTData>
        }
        else return "No sounds found."

        return nfts
    }
    else {
        return "Wrong input"
    }
}