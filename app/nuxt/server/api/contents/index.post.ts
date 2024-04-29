import { PrismaClient } from '@prisma/client'
import yup from '@/server/utils/yup.custom'
import fs from 'node:fs'
import { contentImagePath, contentAudioPath } from '@/server/utils/constants'
import { formatBase64 } from '@/server/utils/formatter'

const prisma = new PrismaClient()

const CreateSchema = yup.object().shape({
  name: yup.string().required().unique(prisma.content, 'name'),
  isRecommend: yup.bool().required(),
  isPublic: yup.bool().required(),
  images: yup.array(),
  details: yup.array().of(
    yup.object().shape({
      languageId: yup.number().required(),
      title: yup.string(),
      explanation: yup.string(),
      audioFile: yup.string()
    })
  )
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

  // 画像ファイル書き込み
  const imagePathList: string[] = []
  for (const image of body.images) {
    const fileName = crypto.randomUUID() + '.png'
    const path = `${contentImagePath}/${fileName}`
    fs.writeFile(path, formatBase64(image), 'base64', (err) => {
      if (err) {
        // TODO: エラーハンドリング
      }
    })
    imagePathList.push(path)
  }

  // 音声ファイル書き込み
  const audioPathList: { languageId: number; path: string }[] = []
  for (const detail of body.details) {
    if (!detail.audioFile) break
    const fileName = crypto.randomUUID() + '.mp3'
    const path = `${contentAudioPath}/${fileName}`
    fs.writeFile(path, formatBase64(detail.audioFile), 'base64', (err) => {
      if (err) {
        // TODO: エラーハンドリング
      }
    })
    audioPathList.push({ languageId: detail.languageId, path })
  }

  // positionの最大値を取得
  const { _max } = await prisma.content.aggregate({
    _max: { position: true }
  })
  const maxPosition = _max.position || 0

  // コンテンツ画像配列を作成
  const images = imagePathList.map((path) => {
    return { path }
  })

  // コンテンツ詳細オブジェクト配列を作成
  const details = values.details?.map((detail) => {
    const audioPath = audioPathList.find((path) => path.languageId === detail.languageId)?.path
    return {
      languageId: detail.languageId,
      title: detail.title,
      explanation: detail.explanation,
      audioPath
    }
  })

  // 登録
  const createdContent = await prisma.content.create({
    data: {
      name: values.name,
      position: maxPosition + 1,
      isRecommend: values.isRecommend,
      isPublic: values.isPublic,
      images: { create: images },
      details: { create: details }
    }
  })

  return createdContent
})
