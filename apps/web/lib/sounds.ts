import { SoundListData } from "../interfaces/interfaces"

export function getSoundNFTData(id: string){

}

export async function getSoundsNFTData(collection: string, page: number): Promise<SoundListData>{
    const res = await fetch(`http://localhost:3000/api/sounds/${collection}/${page}`)

    let data = await res.json() 
    

    return data;
}