import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  return await prisma.$transaction(async (prisma) => {
    const id = Number(getRouterParam(event, 'id'))

    // 言語に紐づくコンテンツを全て削除する
    await prisma.contentDetail.deleteMany({
      where: { languageId: id }
    })

    // 削除
    const deletedLanguage = await prisma.language.delete({
      where: { id }
    })

    // 削除したレコードより後ろの表示順を詰める
    const backwardLanguageList = await prisma.language.findMany({
      where: {
        position: { gt: deletedLanguage.position }
      }
    })

    for (const backwardLanguage of backwardLanguageList) {
      await prisma.language.update({
        where: { id: backwardLanguage.id },
        data: {
          position: backwardLanguage.position - 1
        }
      })
    }

    return deletedLanguage
  })
})
