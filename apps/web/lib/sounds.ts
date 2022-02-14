import { DatabaseTx } from '../interfaces/databaseTx';
import { container } from './db'

const getByTokenNameQuery = (tokenName: string) => {
    var val = {"token_name": tokenName.toUpperCase() }
    console.log("val")
    console.log(val)
    return (
        { query: "SELECT * from t WHERE ARRAY_CONTAINS(t.metadata, @tokenname, true)",
            parameters: [{
                name: "@tokenname",
                value: val
            }]
        }
    )
}

export default async function getSoundNFTData(tokenName: string){
    if(!/[^a-zA-Z0-9]/.test(tokenName)){
        const res = await container().items
                    .query(getByTokenNameQuery(tokenName))
                    .fetchNext()

        if(Array.isArray(res.resources))
        {
            const data = res.resources[0]?.metadata
            
            if(data) return data.find(d => d.token_name == tokenName.toUpperCase())
        }
        return "Wrong id"
    }
    else {
        return "Wrong id"
    }
}

export async function getSoundsNFTData(collection: string, page: number): Promise<Array<DatabaseTx> | String>{
    if(!/[^a-zA-Z0-9]/.test(collection)){
        // const database = (await client.databases.createIfNotExists({ id: databaseid })).database //client.database(databaseid).read()
        // const container = (await database.containers.createIfNotExists({ id: containerid })).container //client.container(containerid).read()
        const offset = (page - 1) * 9 
        const res = await container().items
                    .query(`SELECT * from t WHERE t.status = 'generated' ORDER BY t.created OFFSET ${offset} LIMIT 9`)
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