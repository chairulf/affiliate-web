import type { Offer } from '@/domain/entities/Offer'

export interface IOfferRepository {
  getOffers(page: number): Promise<Offer[]>
  getOfferById(id: number): Promise<Offer | null>
}
