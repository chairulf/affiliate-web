export interface Deeplink {
  offerId: number
  url: string
  userId: string
  generatedLink?: string
}

export interface DeeplinkResponse {
  deeplink: string
  offerId: number
  status: string
}
