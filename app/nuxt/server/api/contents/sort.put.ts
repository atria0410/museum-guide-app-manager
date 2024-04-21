import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  for (const [index, content] of body.entries()) {
    await prisma.content.update({
      where: { id: content.id },
      data: {
        position: index + 1
      }
    })
  }

  return { msg: 'ok' }
})
