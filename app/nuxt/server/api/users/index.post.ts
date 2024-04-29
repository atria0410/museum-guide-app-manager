import { PrismaClient } from '@prisma/client'
import yup from '@/server/utils/yup.custom'
import fs from 'node:fs'
import { userIconPath } from '@/server/utils/constants'

const prisma = new PrismaClient()

const CreateSchema = yup.object().shape({
  lastName: yup.string().required(),
  firstName: yup.string().required(),
  icon: yup.string(),
  loginId: yup.string().required().unique(prisma.user, 'loginId'),
  password: yup.string().required(),
  passwordConfirmation: yup
    .string()
    .required()
    .oneOf([yup.ref('password')], 'パスワードが一致しません。'),

  isAdmin: yup.bool().required()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // バリデーションチェック
  const values = await CreateSchema.validate(body, { abortEarly: false }).catch((e) => {
    const errorObj: any = {}
    for (const item of e.inner) {
      errorObj[item.path] = item.errors[0]
    }
    throw createError({ statusCode: 400, statusMessage: e.message, data: errorObj })
  })

  // アイコンパス
  let iconPath = null

  // アイコン画像ファイルを保存
  if (values.icon) {
    const fileName = crypto.randomUUID() + '.png'
    iconPath = `${userIconPath}/${fileName}`
    fs.writeFile(iconPath, formatBase64(values.icon), 'base64', (err) => {
      if (err) {
        // TODO: エラーハンドリング
      }
    })
  }

  // 登録
  const createdLanguage = await prisma.user.create({
    data: {
      lastName: values.lastName,
      firstName: values.firstName,
      iconPath: iconPath,
      loginId: values.loginId,
      hashedPassword: '',
      isAdmin: values.isAdmin
    }
  })

  return createdLanguage
})
