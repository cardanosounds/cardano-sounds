const CosmosClient = require("@azure/cosmos").CosmosClient;
import { Container } from "@azure/cosmos";
import { DatabaseTx } from "../interfaces/databaseTx"


const key = process.env.COSMOS_KEY || "<cosmos key>";
const endpoint = process.env.COSMOS_ENDPOINT || "<cosmos endpoint>";
const containerId = process.env.COSMOS_CONTAINER || "<cosmos container>";
const databaseId = process.env.COSMOS_DATABASE || "<cosmos database>";

const querySpec = (txid: string) => {
    return {
        query: "SELECT * FROM t WHERE  t.tx_hash = @txid",
        parameters: [{
            name: "@txid",
            value: txid 
        }]
    }
};

const getTransaction = async (txid: string): Promise<DatabaseTx | string>  => {
    let cont = container()
    const { resources: items } = await cont.items.query(querySpec(txid)).fetchAll();
    
    if(items.length > 0) { 
        let item: DatabaseTx = items[0]
        return item
    } else {
        return "not found"
    }
}

export default getTransaction

export function container(): Container {
    const client = new CosmosClient({ endpoint, key })
    return  client.database(databaseId).container(containerId);
}



const queryFinishedSpec = () => {
    return {
        query: "SELECT * FROM t WHERE  t.status = @status",
        parameters: [{
            name: "@status",
            value: "Finished" 
        }]
    }
};

const getFinishedTransactions = async (page: number): Promise<Array<DatabaseTx> | string>  => {
    let cont = container()
    const { resources: items } = await cont.items.query(queryFinishedSpec()).fetchAll();
    
    if(items.length > 0) { 
        const txs: Array<DatabaseTx> = items 
        return txs
    } else {
        return "not found"
    }
}