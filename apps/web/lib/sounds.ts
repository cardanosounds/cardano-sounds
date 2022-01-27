import { DatabaseTx } from '../interfaces/databaseTx';
import { container } from './db'

const getByTokenNameQuery = (tokenName: string) => {
    return (
        { query: "SELECT * from t WHERE LOWER(t.Metadata.token_name) = @tokenname",
            parameters: [{
                name: "@tokenname",
                value: tokenName.toLowerCase() 
            }]
        }
    )
}

export default async function getSoundNFTData(tokenName: string){
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

export async function getSoundsNFTData(collection: string, page: number): Promise<Array<DatabaseTx> | String>{
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