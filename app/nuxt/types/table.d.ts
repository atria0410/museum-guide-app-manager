type Content = SerializeObject<{
  id: number
  name: string
  position: number
  isRecommend: boolean
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}>

type Language = SerializeObject<{
  id: number
  name: string
  label: string
  position: number
  isValid: boolean
  createdAt: Date
  updatedAt: Date
}>

type User = SerializeObject<{
  id: number
  lastName: string
  firstName: string
  iconPath: string
  loginId: string
  isAdmin: boolean
  isValid: boolean
  createdAt: Date
  updatedAt: Date
}>
