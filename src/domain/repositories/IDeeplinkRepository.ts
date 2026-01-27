import type { Deeplink, DeeplinkResponse } from '@/domain/entities/Deeplink'

export interface IDeeplinkRepository {
  generateDeeplink(request: Deeplink): Promise<DeeplinkResponse>
}
