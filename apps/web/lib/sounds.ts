import { NFTData, SoundListData } from "../interfaces/interfaces"
import { CosmosClient, DatabaseResponse } from "@azure/cosmos"

const endpoint = "https://your-account.documents.azure.com";
const key = "<database account masterkey>";
const client = new CosmosClient({ endpoint, key });
const databaseid = "databaseId"
const containerid = "containerId"


export async function getSoundsNFTData(collection: string, page: number): Promise<SoundListData>{
    const res = await fetch(`http://localhost:3000/api/sounds/${collection}/${page}`)

    let data = await res.json() 
    

    return data;
}

export async function getSoundNFTData(tokenName: string): Promise<NFTData>{
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
        return
    }
    
    return
}