import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  return await prisma.$transaction(async (prisma) => {
    const query = getQuery(event)
    const skip: number = Number(query.skip) || 0
    const take: number = Number(query.take) || 100
    const sortKey: string = (query.sortKey as string) || 'position'
    const sortOrder: string = (query.sortOrder as string) || 'asc'

    const contents = await prisma.content.findMany({
      orderBy: { [sortKey]: sortOrder },
      skip,
      take
    })
    const totalLength = await prisma.content.count()

    return { items: contents, totalLength }
  })
})
