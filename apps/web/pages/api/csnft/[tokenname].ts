import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'


export default async function (req: NextApiRequest, res: NextApiResponse) {
	const { tokenname } = req.query
    
	if (typeof(tokenname) === "undefined") res.status(400).json("no id provided")

  	const nft = await prisma.metadata.findFirst({
		  where: {
			  token_name: tokenname.toString().toUpperCase()
		  }	
	  })

	res.status(200).json(nft)
}
