import dayjs from 'dayjs'

/**
 * 数字をカンマ区切りにフォーマットする
 * @param num 数字（例：1234567.89）
 * @returns カンマ区切りされた数字（例：1,234,567.89）
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

/**
 * DateオブジェクトをYYYY/MM/DDにフォーマットする
 * @param date Dateオブジェクト
 * @returns フォーマットされた日付（例：2024/04/17）
 */
export const formatDate = (date: Date): string => {
  return dayjs(date).format('YYYY/MM/DD')
}

/**
 * DateオブジェクトをYYYYY/MM/DD HH:mm:ssにフォーマットする
 * @param date Dateオブジェクト
 * @returns フォーマットされた日付（例：2024/04/17 15:08:45）
 */
export const formatDateTime = (date: Date): string => {
  return dayjs(date).format('YYYY/MM/DD HH:mm:ss')
}
