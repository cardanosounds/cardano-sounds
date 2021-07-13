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

