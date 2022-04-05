import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'

export default async function (req: NextApiRequest, res: NextApiResponse) {

    const { collection } = req.query
    const { page } = req.query

    if(collection && page && !isNaN(Number(page))) {
        const nftListData = await prisma.metadata.findMany({
            skip: (Number(page) - 1) * 9,
            take: 9
        })
        if(nftListData) return res.json(nftListData)
    }
    return res.json({result: 'Not found'})
}

