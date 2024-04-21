import { PrismaClient } from '@prisma/client'
import yup from '@/server/utils/yup.custom'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  const languageSchema = yup.object().shape({
    name: yup.string().required().unique(prisma, 'name', id),
    label: yup.string().required().unique(prisma, 'label', id),
    isValid: yup.bool().required()
  })

  // バリデーションチェック
  const values = await languageSchema.validate(body, { abortEarly: false }).catch((error) => {
    const errorObj: any = {}
    for (const item of error.inner) {
      errorObj[item.path] = item.errors[0]
    }
    throw createError({ statusCode: 400, statusMessage: error.message, data: errorObj })
  })

  // 更新
  const updatedLanguage = await prisma.language.update({
    where: { id },
    data: {
      name: values.name,
      label: values.label,
      isValid: values.isValid
    }
  })

  return updatedLanguage
})
