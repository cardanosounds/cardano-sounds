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
    {/*var nftListData = await getSoundsNFTData(collection.toString(), Number(page))*/}
        var nftListData = getSoundsNFTTestData()


    if(nftListData instanceof String) return nftListData 

    {/*const data:SoundListData = 
    {
        collection: collection.toString(),
        page: Number(page.toString()),
        nfts: nftListData
    }*/}
    
    res.json(nftListData)

}

const getSoundsNFTTestData = () => {
    return {
                collection: "all",
                page: 1,
                nfts: [{
                        amount: [{quantity: 25000000, unit: "lovelace"}],
                        id: "CSNFT6",
                        output_Index: 0,
                        senderAddress: "addr112233334444555666678777788888999911100000",
                        metadata: {
                            arweave_id_sound: "hjdf92o3heohdj293hjo2hij3hj0pihjn09",
                            ipfs_id_sound: "ipfs://",
                            image: "ipfs://",
                            player: "randomdancers-light",
                            id: "CSNFT1",
                            probability: 0.001,
                            rarity: "",
                            sounds: [
                                {category: "enrichment", probability: 0.01, filename: "sound1"},
                                {category: "melody", probability: 0.01, filename: "sound2"},
                                {category: "bass", probability: 0.01, filename: "sound3"},
                                {category: "enrichment", probability: 0.01, filename: "sound4"},
                                {category: "enrichment", probability: 0.01, filename: "sound5"}
                            ],
                            token_name: "CSNFT1",
                            arweave_website_uri: ""        
                        },
                        status: "done",
                        tx_Hash: "poj32ohjdf92o3heohdj293hjo2hij3hj0pihjn09o3hdoihwohj02",
                        created: "8/4/2021 10:00pm"
                        },
                        {
                        amount: [{quantity: 25000000, unit: "lovelace"}],
                        id: "CSNFT5",
                        output_Index: 0,
                        senderAddress: "addr112233334444555666678777788888999911100000",
                        metadata: {
                            arweave_id_sound: "hjdf92o3heohdj293hjo2hij3hj0pihjn09",
                            ipfs_id_sound: "ipfs://",
                            image: "ipfs://",
                            player: "superformula-2-dark",
                            id: "CSNFT2",
                            probability: 0.001,
                            rarity: "",
                            sounds: [
                                {category: "enrichment", probability: 0.01, filename: "sound1"},
                                {category: "melody", probability: 0.01, filename: "sound2"},
                                {category: "bass", probability: 0.01, filename: "sound3"},
                                {category: "enrichment", probability: 0.01, filename: "sound4"},
                                {category: "enrichment", probability: 0.01, filename: "sound5"}
                            ],
                            token_name: "CSNFT2",
                            arweave_website_uri: ""        
                        },
                        status: "done",
                        tx_Hash: "poj32ohjdf92o3heohdj293hjo2hij3hj0pihjn09o3hdoihwohj02",
                        created: "8/4/2021 10:05pm"
                        },
                        {
                        amount: [{quantity: 25000000, unit: "lovelace"}],
                        id: "CSNFT4",
                        output_Index: 0,
                        senderAddress: "addr112233334444555666678777788888999911100000",
                        metadata: {
                            arweave_id_sound: "hjdf92o3heohdj293hjo2hij3hj0pihjn09",
                            ipfs_id_sound: "ipfs://",
                            image: "ipfs://",
                            player: "randomdancers-light",
                            id: "CSNFT3",
                            probability: 0.001,
                            rarity: "",
                            sounds: [
                                {category: "enrichment", probability: 0.01, filename: "sound1"},
                                {category: "melody", probability: 0.01, filename: "sound2"},
                                {category: "bass", probability: 0.01, filename: "sound3"},
                                {category: "enrichment", probability: 0.01, filename: "sound4"},
                                {category: "enrichment", probability: 0.01, filename: "sound5"}
                            ],
                            token_name: "CSNFT3",
                            arweave_website_uri: ""        
                        },
                        status: "done",
                        tx_Hash: "poj32ohjdf92o3heohdj293hjo2hij3hj0pihjn09o3hdoihwohj02",
                        created: "8/4/2021 10:10pm"
                        }, 
              ]
            }
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