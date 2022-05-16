import { MintMetadataFileInput } from "../interfaces/interfaces"

type MintFileInput = ({ mediaType: any; name: any; src: string | string[]; arweaveId?: undefined; } | { mediaType: any; name: any; arweaveId: string; src: string; })

export const prepMetadata = (imageipfs: string, filesWithType: MintMetadataFileInput[], inputs: { image?: string; name: any; publisher: any; collection: any; summary: any; description: any; metadataName: any; quantity?: string; author?: string; arweaveHash: any }) => {
    console.log(`prepMetadata(${imageipfs}, ${filesWithType})`)
    console.log(filesWithType)
    let returnMeta = {
        [inputs.name]: {
            name: inputs.metadataName,
            image:  !imageipfs || imageipfs === '' ? `ar://${inputs.arweaveHash.replace('ar://', '')}` : `ipfs://${imageipfs.replace('ipfs://', '')}`,
            publisher: ["CardanoSounds.com"].concat(inputs.publisher).filter(s => s !== ''),
        },
    }
    returnMeta = addPropertyToMeta(
        "files",
        getFilesMeta(filesWithType),
        returnMeta,
        inputs.name
    )
    returnMeta = addPropertyToMeta("arweaveId", inputs.arweaveHash, returnMeta, inputs.name)
    returnMeta = addPropertyToMeta("collection", inputs.collection, returnMeta, inputs.name)
    returnMeta = addPropertyToMeta("summary", inputs.summary, returnMeta, inputs.name)
    returnMeta = addPropertyToMeta("description", inputs.description, returnMeta, inputs.name)
    return returnMeta
}

export const getFilesMeta = (filesWithType: any[]) => {
    if (filesWithType.length < 1) {
        return ''
    }
    return filesWithType.map((file: { arweaveHash: string; mediaType: any; name: any; ipfsHash: string }) => (!file.arweaveHash || file.arweaveHash === '' ? (
        {
            mediaType: file.mediaType,
            name: file.name,
            src: `ipfs://${file.ipfsHash.replace('ipfs://', '')}`
        }) 
        : !file.ipfsHash || file.ipfsHash === '' ?
        {
            mediaType: file.mediaType,
            name: file.name,
            src: arweaveString(file)
        }
        :
        {
            mediaType: file.mediaType,
            name: file.name,
            arweaveId: file.arweaveHash,
            src: `ipfs://${file.ipfsHash.replace('ipfs://', '')}`
        }
    ))
}

export const addPropertyToMeta = (propertyName: string, propertyValue: string | string[] | MintFileInput | MintFileInput[], metaObject: { [x: string]: { [x: string]: any };[x: number]: { name: any; image: string; publisher: string[] } }, name: string | number) => {
    console.log("addPropertyToMeta = (propertyName, propertyValue, metaObject)")
    console.log(propertyName, propertyValue, metaObject)
    if (propertyValue !== '' && (!Array.isArray(propertyValue) || propertyValue.length !== 0)) {
        let newPropVal: string | string[] | MintFileInput | MintFileInput[] = propertyValue
        if (typeof propertyValue === "string") {
            if (propertyValue.length > 64) {
                newPropVal = propertyValue.split('\n').map(s => {
                    if(s.length > 64) {
                       return s.match(/(.|[\r\n]){1,64}/g)
                    } else return s
                }).flat(1).filter((val) => val !== '')
                // newPropVal = propertyValue.match(/(.|[\r\n]){1,64}/g)
            }
        }
        metaObject[name][propertyName] = newPropVal
    }
    return metaObject
}

const arweaveString = (file: { arweaveHash: string }) => {
    if (file.arweaveHash.length > 64) {
       let splitString = file.arweaveHash.split('\n').map((s: string) => {
            if(s.length > 64) {
               return s.match(/(.|[\r\n]){1,64}/g)
            } else return s
        }).flat(1).filter((val: string) => val !== '')

        if(splitString[0].includes('ar://')) return splitString

        splitString[0] = `ar://${splitString[0]}`
        return splitString

    }  else return `ar://${file.arweaveHash.replace('ar://', '')}`
} 
