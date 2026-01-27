import type { IDeeplinkRepository } from '@/domain/repositories/IDeeplinkRepository'
import type { Deeplink, DeeplinkResponse } from '@/domain/entities/Deeplink'
import type { DeeplinkRequestDTO, DeeplinkResponseDTO } from '@/data/dto/DeeplinkDTO'
import apiClient from '@/api/apiClient'

export class DeeplinkRepositoryImpl implements IDeeplinkRepository {
  async generateDeeplink(request: Deeplink): Promise<DeeplinkResponse> {
    try {
      const payload: DeeplinkRequestDTO = {
        offer_id: request.offerId,
        url: request.url,
        user_id: request.userId,
      }

      const response = await apiClient.post<DeeplinkResponseDTO>('/deeplink/generate', payload)
      
      return {
        deeplink: response.data.data.tracking_link,
        offerId: request.offerId,
        status: response.data.status,
      }
    } catch (error) {
      console.error('Error generating deeplink:', error)
      throw error
    }
  }
}
