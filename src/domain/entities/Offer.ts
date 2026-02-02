export interface Commission {
  [key: string]: string
}

export interface Offer {
  offerId: number
  merchantId: number
  offerName: string
  description: string
  previewUrl: string
  logoUrl: string
  currency: string
  offerType: string
  countries: string
  categories: string
  applicationStatus: string
  offerStatus: string
  validationTerms: number
  paymentTerms: number
  trackingLink: string
  lastSyncedAt: string
  commissions: Commission[] | null
}
