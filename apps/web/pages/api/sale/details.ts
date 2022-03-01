import { NextApiRequest, NextApiResponse } from 'next'

const saleDate =  new Date("2022-02-24 20:00:00 GMT+0100") 

export default (_: NextApiRequest, res: NextApiResponse) => {
  const dt = new Date()
  const addr = process.env.SALE_ADDRESS || "";
  const price = process.env.SALE_PRICE || 0;

  if(dt.getTime() > saleDate.getTime()) {
    res.status(200).json({ status: "open", address: addr, price: price })
  } else {
    res.status(200).json({ status: "wait", datetime: "2022-02-25 19:00:00 GMT+0100" })
  }
}