import { NextApiRequest, NextApiResponse } from 'next'
import { SoundListData } from "../../../../interfaces/interfaces"

// import { CosmosClient, DatabaseResponse } from "@azure/cosmos"

// const endpoint = "https://your-account.documents.azure.com";
// const key = "<database account masterkey>";
// const client = new CosmosClient({ endpoint, key });
// const databaseid = "databaseId"
// const containerid = "containerId"

import { container } from '../../../../lib/db'
import { DatabaseTx } from '../../../../interfaces/databaseTx'
import { getSoundsNFTData } from '../../../../lib/sounds'

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
            nfts: nftListData.map(x => x.metadata).flat(1)
        }
    
        res.json(data)
    }

}

