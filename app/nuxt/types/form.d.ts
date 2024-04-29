type FormDialogMode = 'new' | 'edit'

type LoginForm = {
  loginId: string
  password: string
}

type ContentForm = {
  id?: number
  name: string
  isRecommend: boolean
  isPublic: boolean
  details: ContentDetailForm[]
  images: (string | null)[]
}

type ContentDetailForm = {
  id?: number
  languageId: number
  title?: string
  explanation?: string
  audioFile?: string
}

type LanguageForm = {
  id?: number
  name: string
  label: string
  isValid: boolean
}

type LanguageFormError = {
  name: string
  label: string
}

type UserForm = {
  id?: number
  lastName: string
  firstName: string
  loginId: string
  password: string
  passwordConfirmation: string
  icon?: string
  isAdmin: boolean
}

type UserFormError = {
  lastName: string
  firstName: string
  icon: string
  loginId: string
  password: string
  passwordConfirmation: string
}
