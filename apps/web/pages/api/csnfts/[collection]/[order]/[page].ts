import { NextApiRequest, NextApiResponse } from 'next'
import { SoundListData } from '../../../../../interfaces/interfaces'
import prisma from '../../../../../lib/prisma'

export default async function (req: NextApiRequest, res: NextApiResponse) {

    const { collection } = req.query
    const { order } = req.query
    const { page } = req.query
    let q: any = {
        skip: (Number(page) - 1) * 9,
        take: 9
    }
    if(collection != 'all') q['where'] = { collection: collection }
    if(order != 'default') {
        const orDirParam = order.toString().slice(0, 2)
        const orDir = orDirParam == 'as' ? 'asc' : orDirParam == 'de' ? 'desc' : null
        if(orDir) {
            q['orderBy'] = {}
            q['orderBy'][order.toString().slice(2, order.toString().length)] = orDir
        }
    }
    if(collection && page && !isNaN(Number(page))) {
        const nftListData = await prisma.metadata.findMany(q)
        const sld: SoundListData = {
            page: Number(page),
            collection: collection.toString(),
            nfts: nftListData
            
        } 
        if(sld && sld.nfts) return res.json(sld)
    }
    return res.json({result: 'Not found'})
}

