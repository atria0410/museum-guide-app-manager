import { PrismaClient } from '@prisma/client'
import yup from '../utils/yup.custom'

const router = createRouter()
const prisma = new PrismaClient()

router.get(
  '/',
  defineEventHandler(async (event) => {
    return await prisma.$transaction(async (prisma) => {
      const query = getQuery(event)
      const skip: number = Number(query.skip) || 0
      const take: number = Number(query.take) || 100
      const sortKey: string = (query.sortKey as string) || 'position'
      const sortOrder: string = (query.sortOrder as string) || 'asc'

      const language = await prisma.language.findMany({
        orderBy: { [sortKey]: sortOrder },
        skip,
        take
      })
      const totalLength = await prisma.language.count()

      return { items: language, totalLength }
    })
  })
)

router.post(
  '/',
  defineEventHandler(async (event) => {
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
)

router.put(
  '/:id',
  defineEventHandler(async (event) => {
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
)

router.delete(
  '/:id',
  defineEventHandler(async (event) => {
    return await prisma.$transaction(async (prisma) => {
      const id = Number(getRouterParam(event, 'id'))
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
)

export default useBase('/api/languages', router.handler)
