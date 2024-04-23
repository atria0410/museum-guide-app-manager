import { PrismaClient } from '@prisma/client'
import yup from '@/server/utils/yup.custom'
import fs from 'node:fs'

const prisma = new PrismaClient()

const ContentSchema = yup.object().shape({
  name: yup.string().required().unique(prisma, 'name'),
  isRecommend: yup.bool().required(),
  isPublic: yup.bool().required(),
  details: yup.array().of(
    yup.object().shape({
      languageId: yup.number().required(),
      title: yup.string().required(),
      explanation: yup.string().required(),
      audioPath: yup.string()
    })
  ),
  images: yup.array()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const base64Data = body.images[0].replace(/^data:\w+\/[a-zA-Z_0-9-.]+;base64,/, '')

  const path = `${process.cwd()}/public/img.png`
  fs.writeFile(path, base64Data, 'base64', (err) => {
    console.log('エラー', err)
  })

  return { msg: 'a' }

  // // バリデーションチェック
  // const values = await ContentSchema.validate(body, { abortEarly: false }).catch((e) => {
  //   const errorObj: any = {}
  //   for (const item of e.inner) {
  //     errorObj[item.path] = item.errors[0]
  //   }
  //   console.log(errorObj)
  //   throw createError({ statusCode: 400, statusMessage: e.message, data: errorObj })
  // })

  // // positionの最大値を取得
  // const { _max } = await prisma.content.aggregate({
  //   _max: { position: true }
  // })
  // const maxPosition = _max.position || 0

  // // 登録
  // const createdContent = await prisma.content.create({
  //   data: {
  //     name: values.name,
  //     position: maxPosition + 1,
  //     isRecommend: values.isRecommend,
  //     isPublic: values.isPublic,
  //     details: { create: values.details },
  //     images: { create: values.images }
  //   }
  // })

  // return createdContent
})
