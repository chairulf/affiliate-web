import type { IOfferRepository } from '@/domain/repositories/IOfferRepository'
import type { Offer } from '@/domain/entities/Offer'
import type { OffersResponseDTO } from '@/data/dto/OfferDTO'
import { OfferMapper } from '@/data/mappers/OfferMapper'
import apiClient from '@/api/apiClient'

export class OfferRepositoryImpl implements IOfferRepository {
  async getOffers(page: number): Promise<Offer[]> {
    try {
      const response = await apiClient.get<OffersResponseDTO>(`/offers?page=${page}`)
      return response.data.data.map((dto) => OfferMapper.toDomain(dto))
    } catch (error) {
      console.error('Error fetching offers:', error)
      throw error
    }
  }

  async getOfferById(id: number): Promise<Offer | null> {
    try {
      const offers = await this.getOffers(1)
      return offers.find((offer) => offer.offerId === id) || null
    } catch (error) {
      console.error('Error fetching offer by id:', error)
      return null
    }
  }
}
