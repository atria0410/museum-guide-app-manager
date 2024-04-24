/**
 * base64先頭を
 * @param base64 base64
 * @returns ああ
 */
export const formatBase64 = (base64: string): string => {
  return base64.replace(/^data:\w+\/[a-zA-Z_0-9-.]+;base64,/, '')
}
