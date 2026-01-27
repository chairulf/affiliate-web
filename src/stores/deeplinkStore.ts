import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DeeplinkResponse } from '@/domain/entities/Deeplink'
import DIContainer from '@/di/container'

export const useDeeplinkStore = defineStore('deeplink', () => {
  const deeplink = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const deeplinkRepository = DIContainer.getInstance().getDeeplinkRepository()

  async function generateDeeplink(offerId: number, url: string, userId: string = 'abcd') {
    loading.value = true
    error.value = null
    deeplink.value = null
    try {
      const response: DeeplinkResponse = await deeplinkRepository.generateDeeplink({
        offerId,
        url,
        userId,
      })
      deeplink.value = response.deeplink
      return response
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to generate deeplink'
      throw e
    } finally {
      loading.value = false
    }
  }

  function resetDeeplink() {
    deeplink.value = null
    error.value = null
  }

  return {
    deeplink,
    loading,
    error,
    generateDeeplink,
    resetDeeplink,
  }
})
