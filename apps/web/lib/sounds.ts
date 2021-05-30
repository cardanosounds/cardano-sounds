import { SoundListData } from "../interfaces/interfaces"

export function getSoundNFTData(id: string){

}

export async function getSoundsNFTData(query: string): Promise<SoundListData>{
    const res = await fetch(`api/sounds${query}`)

    const data = await res.json() as SoundListData

    return data;
}