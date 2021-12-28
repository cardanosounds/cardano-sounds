import { NextApiRequest, NextApiResponse } from 'next'
import { NFTData, SoundListData } from "../../../../interfaces/interfaces"

// import { CosmosClient, DatabaseResponse } from "@azure/cosmos"

// const endpoint = "https://your-account.documents.azure.com";
// const key = "<database account masterkey>";
// const client = new CosmosClient({ endpoint, key });
// const databaseid = "databaseId"
// const containerid = "containerId"

import { container } from '../../../../lib/db'
import { DatabaseTx } from '../../../../interfaces/databaseTx'

export default async function (req: NextApiRequest, res: NextApiResponse): Promise<Array<DatabaseTx> | String> {

    const { collection } = req.query
    const { page } = req.query


    if(collection && page && !isNaN(Number(page)))
    {
        const nftListData = await getSoundsNFTData(collection.toString(), Number(page))
        // var nftListData = getSoundsNFTData()
        // console.log("nftListData")
        // console.log(nftListData)

        if(nftListData instanceof String) return nftListData 

        const data:SoundListData = 
        {
            collection: collection.toString(),
            page: Number(page.toString()),
            nfts: nftListData
        }
    
        res.json(data)
    }

}

async function getSoundsNFTData(collection: string, page: number): Promise<Array<DatabaseTx> | String>{
    if(!/[^a-zA-Z0-9]/.test(collection)){
        // const database = (await client.databases.createIfNotExists({ id: databaseid })).database //client.database(databaseid).read()
        // const container = (await database.containers.createIfNotExists({ id: containerid })).container //client.container(containerid).read()
        const offset = (page - 1) * 9 
        const res = await container().items
                    .query(`SELECT * from t WHERE t.status = 'finished' ORDER BY t.created OFFSET ${offset} LIMIT 9`)
                    .fetchAll() 
        let nfts: Array<DatabaseTx>
        if(Array.isArray(res.resources))
        {
            nfts = res.resources as unknown as Array<DatabaseTx>
        }
        else return "No sounds found."

        return nfts
    }
    else {
        return "Wrong input"
    }
}