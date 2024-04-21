type Language = {
  id: number
  name: string
  label: string
  position: number
  isValid: boolean
  createdAt: Date
  updatedAt: Date
}

type LanguageForm = {
  id?: number
  name: string
  label: string
  isValid: boolean
}

type FormDialogMode = 'new' | 'edit'
