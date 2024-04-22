import * as yup from 'yup'
import * as ja from 'yup-locale-ja'
import type { PrismaClient } from '@prisma/client'

yup.setLocale(ja.suggestive)

yup.addMethod(yup.string, 'unique', function (prisma: PrismaClient, target: string, excludeId?: number) {
  return this.test('unique', '既に登録済みです', async function (value) {
    if (excludeId) {
      const result = await prisma.language.findFirst({ where: { [target]: value, id: { not: excludeId } } })
      return result === null
    } else {
      const result = await prisma.language.findFirst({ where: { [target]: value } })
      return result === null
    }
  })
})

declare module 'yup' {
  interface StringSchema<TType, TContext> {
    unique(prisma: PrismaClient, target: string, excludeId?: number): StringSchema<TType, TContext>
  }
}

yup.addMethod(yup.mixed<FileList>, 'fileSize', function (size: number) {
  return this.test('fileSize', 'ファイルサイズが大きすぎます。', function (files) {
    if (files === undefined || files.length === 0) return true
    return files[0].size <= size
  })
})

declare module 'yup' {
  interface MixedSchema<TType, TContext> {
    fileSize(size: number): yup.MixedSchema<TType, TContext>
  }
}

export default yup
