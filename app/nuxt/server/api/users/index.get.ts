import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  return await prisma.$transaction(async (prisma) => {
    const query = getQuery(event)
    const skip: number = Number(query.skip) || 0
    const take: number = Number(query.take) || 100
    const sortKey: string = (query.sortKey as string) || 'id'
    const sortOrder: string = (query.sortOrder as string) || 'asc'

    const users = await prisma.user.findMany({
      select: {
        id: true,
        lastName: true,
        firstName: true,
        iconPath: true,
        loginId: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { [sortKey]: sortOrder },
      skip,
      take
    })
    const totalLength = await prisma.user.count()

    return { items: users, totalLength }
  })
})
