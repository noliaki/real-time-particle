export const UA: string = navigator.userAgent.toLocaleLowerCase()

export function isPC(): boolean {
  return !/(iphone|ipad|ipod|android)/i.test(UA)
}
