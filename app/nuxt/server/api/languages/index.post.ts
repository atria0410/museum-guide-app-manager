import { PrismaClient } from '@prisma/client'
import yup from '@/server/utils/yup.custom'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const languageSchema = yup.object().shape({
    name: yup.string().required().unique(prisma, 'name'),
    label: yup.string().required().unique(prisma, 'label'),
    isValid: yup.bool().required()
  })

  // バリデーションチェック
  const values = await languageSchema.validate(body, { abortEarly: false }).catch((e) => {
    const errorObj: any = {}
    for (const item of e.inner) {
      errorObj[item.path] = item.errors[0]
    }
    throw createError({ statusCode: 400, statusMessage: e.message, data: errorObj })
  })

  // positionの最大値を取得
  const { _max } = await prisma.language.aggregate({
    _max: { position: true }
  })
  const maxPosition = _max.position || 0

  // 登録
  const createdLanguage = await prisma.language.create({
    data: {
      name: values.name,
      label: values.label,
      isValid: values.isValid,
      position: maxPosition + 1
    }
  })

  return createdLanguage
})
