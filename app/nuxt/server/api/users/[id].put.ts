import { PrismaClient } from '@prisma/client'
import yup from '@/server/utils/yup.custom'
import fs from 'node:fs'
import { userIconPath } from '@/server/utils/constants'

const prisma = new PrismaClient()

const UpdateSchema = yup.object().shape({
  lastName: yup.string().required(),
  firstName: yup.string().required(),
  icon: yup.string(),
  password: yup.string().required(),
  passwordConfirmation: yup
    .string()
    .required()
    .oneOf([yup.ref('password')], 'パスワードが一致しません。'),
  isAdmin: yup.bool().required()
})

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  // バリデーションチェック
  const values = await UpdateSchema.validate(body, { abortEarly: false }).catch((error) => {
    const errorObj: any = {}
    for (const item of error.inner) {
      errorObj[item.path] = item.errors[0]
    }
    throw createError({ statusCode: 400, statusMessage: error.message, data: errorObj })
  })

  // 現在のユーザー情報を取得
  const currentUser = await prisma.user.findUnique({
    where: { id }
  })

  // 現在登録されている画像を削除する
  if (currentUser && currentUser.iconPath) {
    fs.rm(currentUser.iconPath, { force: true }, (err) => {
      if (err) {
        // TODO: エラーハンドリング
      }
    })
  }

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

  // 更新
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      lastName: values.lastName,
      firstName: values.firstName,
      iconPath: iconPath,
      hashedPassword: '',
      isAdmin: values.isAdmin
    }
  })

  return updatedUser
})
