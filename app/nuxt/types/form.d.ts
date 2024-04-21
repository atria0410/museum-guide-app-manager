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

type LanguageForm = {
  id?: number
  name: string
  label: string
  isValid: boolean
}

type FormDialogMode = 'new' | 'edit'
