import { PrismaClient } from '@prisma/client'
import Prisma from 'prisma'
import nftMeta from './nft_metadata'
const prisma = new PrismaClient()

const metaData: Prisma.MetadataCreateInput[] = nftMeta

async function main() {
    console.log(`Start seeding ...`)
    for (const m of metaData) {
        const metadata = await prisma.metadata.create({
            data: m
        })
        console.log(`Created metadata : ${metadata.token_name}`)
    }
    console.log(`Seeding finished.`)
}


main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })