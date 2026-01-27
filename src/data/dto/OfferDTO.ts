export interface OfferDTO {
  offer_id: number
  merchant_id: number
  offer_name: string
  description: string
  preview_url: string
  logo_url: string
  currency: string
  offer_type: string
  countries: string
  categories: string
  application_status: string
  offer_status: string
  validation_terms: number
  payment_terms: number
  tracking_link: string
  last_synced_at: string
}

export interface OffersResponseDTO {
  data: OfferDTO[]
  status: string
}
