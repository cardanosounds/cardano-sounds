import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const postId = req.query.id;

  const first = await prisma.metadata.findFirst()
//   res.json(posts)
  res.json({first: first})
  
}