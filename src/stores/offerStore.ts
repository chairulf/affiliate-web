import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Offer } from '@/domain/entities/Offer'
import DIContainer from '@/di/container'

export const useOfferStore = defineStore('offer', () => {
  const offers = ref<Offer[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentOffer = ref<Offer | null>(null)

  const offerRepository = DIContainer.getInstance().getOfferRepository()

  async function fetchOffers(page: number = 1) {
    loading.value = true
    error.value = null
    try {
      offers.value = await offerRepository.getOffers(page)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch offers'
    } finally {
      loading.value = false
    }
  }

  async function fetchOfferById(id: number) {
    loading.value = true
    error.value = null
    try {
      currentOffer.value = await offerRepository.getOfferById(id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch offer'
    } finally {
      loading.value = false
    }
  }

  function getOfferById(id: number): Offer | undefined {
    return offers.value.find((offer) => offer.offerId === id)
  }

  return {
    offers,
    loading,
    error,
    currentOffer,
    fetchOffers,
    fetchOfferById,
    getOfferById,
  }
})
