type Content = SerializeObject<{
  id: number
  name: string
  position: number
  isRecommend: boolean
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}>

type ContentForm = {
  id?: number
  name: string
  details: ContentDetailForm[]
}

type ContentDetailForm = {
  id?: number
  languageId: number
  title: string
  explanation: string
  audioPath: string
}

type Language = SerializeObject<{
  id: number
  name: string
  label: string
  position: number
  isValid: boolean
  createdAt: Date
  updatedAt: Date
}>

type LanguageForm = {
  id?: number
  name: string
  label: string
  isValid: boolean
}

type FormDialogMode = 'new' | 'edit'
