/**
 * ファイルオブジェクトをBase64に変換する
 * @param file ファイルオブジェクト
 * @returns Base64
 */
export const fileToBase64 = async (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
  })
