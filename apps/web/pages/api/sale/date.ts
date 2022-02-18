import { NextApiRequest, NextApiResponse } from 'next'

export default (_: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ datetime: new Date("2022-02-25 19:00:00 GMT+0100") })
}