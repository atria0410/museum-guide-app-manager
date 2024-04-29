import { PrismaClient } from '@prisma/client'
import fs from 'node:fs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  return await prisma.$transaction(async (prisma) => {
    const id = Number(getRouterParam(event, 'id'))

    // 削除
    const deletedUser = await prisma.user.delete({
      where: { id }
    })

    // アイコン画像ファイル削除
    if (deletedUser.iconPath) {
      fs.rm(deletedUser.iconPath, { force: true }, (err) => {
        if (err) {
          // TODO: エラーハンドリング
        }
      })
    }

    return deletedUser
  })
})
