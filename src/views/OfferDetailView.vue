<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOfferStore } from '@/stores/offerStore'
import { useDeeplinkStore } from '@/stores/deeplinkStore'

const route = useRoute()
const router = useRouter()
const offerStore = useOfferStore()
const deeplinkStore = useDeeplinkStore()

const offer = ref(offerStore.getOfferById(Number(route.params.id)))
const showExclusions = ref(false)
const isGeneratingLink = ref(false)
const customLink = ref('')
const showLinkError = ref(false)
const showTutorial = ref(false)

onMounted(async () => {
  if (!offer.value) {
    await offerStore.fetchOffers(1)
    offer.value = offerStore.getOfferById(Number(route.params.id))
  }
})

const goBack = () => {
  router.back()
}

const isButtonDisabled = computed(() => {
  if (!offer.value) return true
  if (isGeneratingLink.value) return true
  if (offer.value.requiresCustomLink && !customLink.value.trim()) return true
  return false
})

const isTikTokShop = computed(() => {
  if (!offer.value) return false
  return offer.value.offerName.toLowerCase().includes('tiktok shop')
})

const toggleTutorial = () => {
  showTutorial.value = !showTutorial.value
}

const handleGenerateDeeplink = async () => {
  if (!offer.value) return

  if (offer.value.requiresCustomLink && !customLink.value.trim()) {
    showLinkError.value = true
    return
  }

  showLinkError.value = false
  isGeneratingLink.value = true
  try {
    const userId = localStorage.getItem('user_id') || 'user_id'
    const urlToUse = offer.value.requiresCustomLink ? customLink.value : offer.value.previewUrl

    const response = await deeplinkStore.generateDeeplink(
      offer.value.offerId,
      urlToUse,
      userId
    )

    if (response.deeplink) {
      window.location.href = response.deeplink
    }
  } catch (error) {
    console.error('Failed to generate deeplink:', error)
    alert('Failed to generate link. Please try again.')
  } finally {
    isGeneratingLink.value = false
  }
}

</script>

<template>
  <div v-if="offer" class="detail-container">
    <div class="hero-section">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <div class="hero-bg"></div>
      <div class="offer-header">
        <div class="category-badge">{{ offer.categories }}</div>
        <div class="offer-logo-large">
          <img :src="offer.logoUrl" :alt="offer.offerName" />
        </div>
        <h1 class="offer-title">{{ offer.offerName }}</h1>
      </div>
    </div>

    <div class="content-section">
      <div class="description-section">
        <h2>Description</h2>
        <p>{{ offer.description }}</p>
        <button v-if="isTikTokShop" class="tutorial-btn" @click="toggleTutorial">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
          How to Shop & Get Cashback
        </button>
      </div>

      <div class="cashback-info">
        <h2>Commission</h2>
        <div v-if="offer.commissions && offer.commissions.length > 0" class="cashback-details">
          <div
            v-for="(commission, index) in offer.commissions"
            :key="index"
            class="cashback-item"
          >
            <p class="cashback-label">{{ Object.keys(commission)[0] }}</p>
            <p class="cashback-rate">{{ Object.values(commission)[0] }}</p>
          </div>
          <div v-if="offer.commissionCapped" class="commission-capped">
            <p class="capped-label">Commission Capped:</p>
            <p class="capped-value">{{ offer.commissionCapped }}</p>
          </div>
        </div>
        <div v-else class="cashback-details">
          <p class="no-commission">Commission information not available</p>
        </div>
      </div>

      <div class="info-box">
        <p>💰 Commission will be confirmed after validation period</p>
      </div>

      <div v-if="offer.requiresCustomLink" class="custom-link-section">
        <h2>Product Link Required</h2>
        <p class="link-instruction">Please enter the product link from the merchant's website:</p>
        <div class="input-wrapper">
          <input
            v-model="customLink"
            type="url"
            placeholder="https://"
            class="link-input"
            :class="{ 'error': showLinkError }"
            @input="showLinkError = false"
          />
          <p v-if="showLinkError" class="error-message">⚠️ Please enter a valid product link</p>
        </div>
      </div>

      <div class="timeline-section">
        <h2>Estimated Commission Timeline</h2>
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-icon-wrapper">
              <div class="timeline-icon active">
                <div class="icon-circle"></div>
              </div>
              <div class="timeline-line"></div>
            </div>
            <div class="timeline-content">
              <h3>Purchase</h3>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-icon-wrapper">
              <div class="timeline-icon">
                <div class="icon-circle"></div>
              </div>
            </div>
            <div class="timeline-content">
              <h3>Confirmed by Merchant</h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showTutorial" class="tutorial-modal" @click="toggleTutorial">
      <div class="tutorial-content" @click.stop>
        <button class="close-btn" @click="toggleTutorial">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <div class="tutorial-header">
          <h2 class="tutorial-title">Boost Your Cashback with Product Link Feature</h2>
          <p class="tutorial-subtitle">Follow these steps to get more Cashback from your favorite marketplace.</p>
        </div>

        <div class="tutorial-steps">
          <div class="tutorial-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <div class="step-illustration">
                <div class="phone-mockup">
                  <div class="app-header tiktok-header">
                    <div class="tiktok-logo-small"></div>
                  </div>
                  <div class="product-card">
                    <div class="product-image"></div>
                    <div class="share-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="copy-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <p class="step-text">Open TikTok Shop Malaysia app, find the product you want, then tap the 'share' icon to copy the link.</p>
            </div>
          </div>

          <div class="tutorial-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <div class="step-illustration">
                <div class="phone-mockup">
                  <div class="app-header app-header-primary">
                    <div class="back-arrow"></div>
                    <div class="header-title">Paste Link</div>
                  </div>
                  <div class="paste-content">
                    <div class="input-field-wrapper">
                      <div class="input-field">
                        <div class="input-placeholder"></div>
                        <div class="input-placeholder short"></div>
                      </div>
                      <div class="paste-icon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div class="app-logo-small"></div>
                </div>
              </div>
              <p class="step-text">Return to this app and tap "Paste Link".</p>
            </div>
          </div>

          <div class="tutorial-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <div class="step-illustration">
                <div class="phone-mockup">
                  <div class="app-header tiktok-header">
                    <div class="tiktok-logo-small"></div>
                  </div>
                  <div class="product-card large">
                    <div class="product-image large"></div>
                    <div class="product-details">
                      <div class="product-line"></div>
                      <div class="product-line short"></div>
                    </div>
                  </div>
                  <div class="buy-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </div>
                  <div class="app-logo-small bottom"></div>
                </div>
              </div>
              <p class="step-text">Click "Shop Now" after pasting the link and purchase the product.</p>
            </div>
          </div>
        </div>

        <button class="tutorial-close-btn" @click="toggleTutorial">Got it</button>
      </div>
    </div>

    <div class="action-footer">
      <button
        class="activate-btn"
        @click="handleGenerateDeeplink"
        :disabled="isButtonDisabled"
      >
        {{ isGeneratingLink ? 'Shop Now...' : 'Shop Now' }}
      </button>
    </div>
  </div>

  <div v-else class="loading-container">
    <div class="spinner"></div>
  </div>
</template>

<style scoped>
.detail-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 100px;
}

.hero-section {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #4facfe 100%);
  padding: 1rem 1rem 2rem;
  text-align: center;
}

.back-btn {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  color: white;
  border-radius: 8px;
  transition: background 0.2s;
  backdrop-filter: blur(10px);
  z-index: 10;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.back-btn:active {
  background: rgba(255, 255, 255, 0.4);
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><circle cx="200" cy="150" r="100" fill="%234facfe" opacity="0.3"/><circle cx="600" cy="400" r="150" fill="%23667eea" opacity="0.3"/></svg>');
  background-size: cover;
  opacity: 0.5;
}

.offer-header {
  position: relative;
  z-index: 1;
  padding-top: 2rem;
}

.category-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
}

.offer-logo-large {
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
  background: white;
  border-radius: 20px;
  padding: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.offer-logo-large img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.offer-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.content-section {
  max-width: 800px;
  margin: 1.5rem auto 0;
  padding: 0 1rem;
}

.description-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.description-section h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: #1a1a2e;
}

.description-section p {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #333;
  margin: 0;
  white-space: pre-line;
}

.tutorial-btn {
  margin-top: 1.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.tutorial-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.tutorial-btn:active {
  transform: translateY(0);
}

.cashback-info {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.cashback-info h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: #1a1a2e;
}

.cashback-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cashback-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.cashback-label {
  flex: 1;
  font-size: 0.95rem;
  color: #333;
  margin: 0;
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.5;
}

.cashback-rate {
  font-weight: 700;
  font-size: 1.1rem;
  color: #1a1a2e;
  margin: 0;
  text-align: right;
  min-width: fit-content;
}

.no-commission {
  text-align: center;
  color: #666;
  font-size: 0.95rem;
  padding: 1rem 0;
  margin: 0;
}

.commission-capped {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.capped-label {
  flex: 1;
  font-size: 0.95rem;
  color: #666;
  margin: 0;
  font-weight: 600;
}

.capped-value {
  font-weight: 700;
  font-size: 1.1rem;
  color: #ff6b35;
  margin: 0;
  white-space: nowrap;
}

.info-box {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  border-radius: 8px;
}

.info-box p {
  margin: 0;
  color: #856404;
  font-size: 0.9rem;
}

.custom-link-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.custom-link-section h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: #1a1a2e;
}

.link-instruction {
  font-size: 0.95rem;
  color: #666;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.input-wrapper {
  position: relative;
}

.link-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
  outline: none;
  font-family: inherit;
}

.link-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.link-input.error {
  border-color: #ff6b35;
}

.link-input.error:focus {
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.error-message {
  color: #ff6b35;
  font-size: 0.85rem;
  margin: 0.5rem 0 0 0;
  font-weight: 500;
}

.timeline-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.timeline-section h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 2rem 0;
  color: #1a1a2e;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  position: relative;
}

.timeline-icon-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.timeline-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  flex-shrink: 0;
}

.timeline-icon.active {
  background: #667eea;
}

.icon-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
}

.timeline-line {
  width: 2px;
  height: 40px;
  background: #d0d0d0;
  margin-top: 4px;
}

.timeline-content {
  flex: 1;
  padding-top: 0.5rem;
  padding-bottom: 1.5rem;
}

.timeline-content h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: #1a1a2e;
}

.timeline-content p {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.timeline-days {
  color: #999;
  font-size: 0.9rem;
}

.terms-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.terms-section h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: #1a1a2e;
}

.terms-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.terms-item:hover {
  background: #f8f9fa;
}

.terms-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  color: #1a1a2e;
}

.exclusions-content {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.exclusions-content p {
  margin: 0 0 0.75rem 0;
  color: #333;
}

.exclusions-content ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #666;
}

.exclusions-content li {
  margin-bottom: 0.5rem;
}

.action-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 1rem;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.activate-btn {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: block;
  background: #1a1a2e;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.activate-btn:hover:not(:disabled) {
  background: #2d2d44;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.activate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #4facfe 100%);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.tutorial-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  overflow-y: auto;
  backdrop-filter: blur(4px);
}

.tutorial-content {
  background: white;
  border-radius: 24px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #f5f5f5;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
  z-index: 10;
}

.close-btn:hover {
  background: #e0e0e0;
  color: #333;
}

.tutorial-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.tutorial-icons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.icon-box {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tiktok-icon {
  background: #000;
  color: #fff;
}

.app-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.arrow-icon {
  color: #999;
}

.copy-paste-illustration {
  margin: 1rem 0;
  display: flex;
  justify-content: center;
}

.tutorial-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
}

.tutorial-subtitle {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 2rem 0;
  line-height: 1.5;
}

.tutorial-steps {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.tutorial-step {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1a1a2e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-illustration {
  background: #fef5f5;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: center;
}

.phone-mockup {
  width: 100px;
  height: 140px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.app-header {
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
}

.tiktok-header {
  background: #000;
}

.app-header-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  justify-content: flex-start;
  gap: 0.5rem;
}

.tiktok-logo-small {
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 4px;
}

.back-arrow {
  width: 12px;
  height: 12px;
  border-left: 2px solid white;
  border-bottom: 2px solid white;
  transform: rotate(45deg);
}

.header-title {
  font-size: 0.65rem;
  color: white;
  font-weight: 600;
}

.product-card {
  margin: 0.5rem;
  background: #f5f5f5;
  border-radius: 8px;
  height: 50px;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.5rem;
}

.product-card.large {
  height: 70px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.product-image {
  width: 30px;
  height: 30px;
  background: #ddd;
  border-radius: 6px;
}

.product-image.large {
  width: 100%;
  height: 40px;
}

.product-details {
  flex: 1;
  padding: 0.25rem 0;
}

.product-line {
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  margin-bottom: 0.25rem;
  width: 100%;
}

.product-line.short {
  width: 60%;
}

.share-icon {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.copy-badge {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  background: #1a1a2e;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6rem;
}

.paste-content {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.input-field-wrapper {
  position: relative;
}

.input-field {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  border: 1.5px solid #e0e0e0;
}

.input-placeholder {
  width: 100%;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
}

.input-placeholder.short {
  width: 70%;
}

.paste-icon {
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: #667eea;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
}

.cashback-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 0.25rem;
}

.percentage-badge {
  position: absolute;
  top: 50%;
  right: 0.5rem;
  width: 28px;
  height: 28px;
  background: #ff6b35;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
}

.percentage-badge-large {
  width: 32px;
  height: 32px;
  background: #ff6b35;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(255, 107, 53, 0.4);
}

.cashback-label-small {
  font-size: 0.6rem;
  color: #666;
  font-weight: 600;
}

.percentage-text {
  color: white;
  font-weight: 700;
  font-size: 0.8rem;
}

.app-logo-small {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.app-logo-small.bottom {
  bottom: 0.5rem;
  right: 0.5rem;
}

.buy-button {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  right: 0.5rem;
  height: 24px;
  background: #ff6b35;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
}

.step-text {
  font-size: 0.85rem;
  color: #333;
  line-height: 1.5;
  margin: 0;
}

.tutorial-close-btn {
  width: 100%;
  background: #1a1a2e;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.tutorial-close-btn:hover {
  background: #2d2d44;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.tutorial-close-btn:active {
  transform: translateY(0);
}

@media (max-width: 640px) {
  .tutorial-content {
    padding: 1.5rem;
    border-radius: 20px 20px 0 0;
    max-height: 95vh;
  }

  .tutorial-modal {
    align-items: flex-end;
    padding: 0;
  }
}

</style>
