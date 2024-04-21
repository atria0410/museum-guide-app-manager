import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  for (const [index, language] of body.entries()) {
    await prisma.language.update({
      where: { id: language.id },
      data: {
        position: index + 1
      }
    })
  }

  return { msg: 'ok' }
})
