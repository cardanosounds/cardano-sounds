import { NextApiRequest, NextApiResponse } from 'next'
import { NFTData } from '../../../interfaces/interfaces'
import { CosmosClient } from "@azure/cosmos"
import { container } from '../../../lib/db'
import { Metadata } from '../../../interfaces/databaseTx'

// const endpoint = "https://your-account.documents.azure.com";
// const key = "<database account masterkey>";
// const client = new CosmosClient({ endpoint, key });
// const databaseid = "databaseId"
// const containerid = "containerId"


export default async function (req: NextApiRequest, res: NextApiResponse) {
	const { tokenname } = req.query
    console.log(tokenname)
    
	if (typeof(tokenname) === "undefined") res.status(400).json("no id provided")

	let nftData: Metadata

	const sound = await getSoundNFTData(tokenname as string)

	if (typeof nftData === 'string' || nftData instanceof String){
		res.status(404).json(sound)
	}
	else {
		nftData = sound as unknown as Metadata
		res.status(200).json(nftData)
	}
}
const getByTokenNameQuery = (tokenName: string) => {
    return (
        { query: "SELECT t.Metadata from t WHERE t.Metadata.token_name = @tokenname",
            parameters: [{
                name: "@tokenname",
                value: tokenName 
            }]
        }
    )
}

export async function getSoundNFTData(tokenName: string){
    if(!/[^a-zA-Z0-9]/.test(tokenName)){
        const res = await container().items
                    .query(getByTokenNameQuery(tokenName))
                    .fetchNext()
        return res.resources;
    }
    else {
        return "Wrong id"
    }
}