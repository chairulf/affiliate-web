import { mockOffers } from '@/data/mockData'
import type { OffersResponseDTO } from '@/data/dto/OfferDTO'
import type { DeeplinkResponseDTO } from '@/data/dto/DeeplinkDTO'

export function setupMockAPI() {
  const originalFetch = window.fetch

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url

    if (url.includes('/api/offers')) {
      const response: OffersResponseDTO = {
        data: mockOffers,
        status: 'success',
      }
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (url.includes('/api/deeplink/generate') && init?.method === 'POST') {
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      const body = init?.body ? JSON.parse(init.body as string) : {}
      const response: DeeplinkResponseDTO = {
        deeplink: `https://tracking.example.com/deeplink/${body.offer_id}/${body.user_id}`,
        offer_id: body.offer_id,
        status: 'success',
      }
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return originalFetch(input, init)
  }
}
