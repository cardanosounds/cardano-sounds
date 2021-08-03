import { NextApiRequest, NextApiResponse } from 'next'
import { NFTData } from '../../../interfaces/interfaces'
import { CosmosClient } from "@azure/cosmos"

const endpoint = "https://your-account.documents.azure.com";
const key = "<database account masterkey>";
const client = new CosmosClient({ endpoint, key });
const databaseid = "databaseId"
const containerid = "containerId"


export default async function (req: NextApiRequest, res: NextApiResponse) {
	const { tokenname } = req.query
    console.log(tokenname)
    
	if (typeof(tokenname) === "undefined") res.status(400).json("no id provided")

	let nftData: NFTData

	const sound = await getSoundNFTData(tokenname as string)

	if (typeof nftData === 'string' || nftData instanceof String){
		res.status(404).json(sound)
	}
	else {
		nftData = sound as unknown as NFTData
		res.status(200).json(nftData)
	}
}


export async function getSoundNFTData(tokenName: string){
    if(!/[^a-zA-Z0-9]/.test(tokenName)){
        const database = (await client.databases.createIfNotExists({ id: databaseid })).database //client.database(databaseid).read()
        const container = (await database.containers.createIfNotExists({ id: containerid })).container //client.container(containerid).read()
        const res = await container.items
                    .query("SELECT * from t WHERE t.TokenName = " + tokenName)
                    .fetchNext()

        return res;
    }
    else {
        return "Wrong id"
    }
}