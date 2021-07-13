import { NextApiRequest, NextApiResponse } from 'next'
import { NFTData } from '../../interfaces/interfaces'
import { CosmosClient } from "@azure/cosmos"

const endpoint = "https://your-account.documents.azure.com";
const key = "<database account masterkey>";
const client = new CosmosClient({ endpoint, key });
const databaseid = "databaseId"
const containerid = "containerId"


export default async function (req: NextApiRequest, res: NextApiResponse) {
	const body = req.body

	if (!body) res.status(400).json("no id provided")

	let nftData: NFTData

	const sound = await getSoundNFTData(JSON.parse(req.body))
	if (typeof nftData === 'string' || nftData instanceof String){

		res.status(404).json(sound)
	}
	else {
		nftData = sound as NFTData
		res.status(200).json(nftData)
	}
}

export async function getSoundNFTData(tokenName: string): Promise<NFTData | string>{
    if(!/[^a-zA-Z0-9]/.test(tokenName)){

        const database = (await client.databases.createIfNotExists({ id: databaseid })).database //client.database(databaseid).read()
        const container = (await database.containers.createIfNotExists({ id: containerid })).container //client.container(containerid).read()
        const res = await container.items
                    .query("SELECT * from t WHERE t.TokenName = " + tokenName)
                    .fetchAll()

        if(Array.isArray(res))
        {
            const nftData =  res[0]
            const meta = nftData["Metadata"]
            let nft: NFTData 
            nft.arweave = meta["arweave_id_sound"]
            nft.ipfs = meta["ipfs_id_sound"]
            nft.web = meta["arweave_website_uri"]

            return nft
        }
    }
    else {
        return "Wrong id"
    }
    
    return "Wrong request"
}