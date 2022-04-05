import { NextApiRequest, NextApiResponse } from 'next'
import { SoundListData } from '../../../../interfaces/interfaces'
import prisma from '../../../../lib/prisma'

export default async function (req: NextApiRequest, res: NextApiResponse) {

    const { collection } = req.query
    const { page } = req.query

    if(collection && page && !isNaN(Number(page))) {
        const nftListData = await prisma.metadata.findMany({
            skip: (Number(page) - 1) * 9,
            take: 9
        })
        const sld: SoundListData = {
            page: Number(page),
            collection: collection.toString(),
            nfts: nftListData
            
        } 
        if(sld && sld.nfts) return res.json(sld)
    }
    return res.json({result: 'Not found'})
}

