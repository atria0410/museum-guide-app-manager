type ContentForm = {
  id?: number
  name: string
  isRecommend: boolean
  isPublic: boolean
  details: ContentDetailForm[]
  images: File[]
}

type ContentDetailForm = {
  id?: number
  languageId: number
  title: string
  explanation: string
  audioPath: string?
}

type LanguageForm = {
  id?: number
  name: string
  label: string
  isValid: boolean
}

type FormDialogMode = 'new' | 'edit'
