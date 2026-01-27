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

onMounted(async () => {
  if (!offer.value) {
    await offerStore.fetchOffers(1)
    offer.value = offerStore.getOfferById(Number(route.params.id))
  }
})

const goBack = () => {
  router.push({ name: 'home' })
}

const cashbackRate = computed(() => {
  const rates: Record<string, string> = {
    'Marketplace': 's/d 2,6%',
    'Fashion': 's/d 3,5%',
    'Electronics': 's/d 2,8%',
    'Travel': 's/d 4,2%',
  }
  return rates[offer.value?.categories || ''] || 's/d 2,5%'
})

const estimatedDays = computed(() => {
  if (!offer.value) return 0
  return Math.ceil((offer.value.validationTerms + offer.value.paymentTerms) / 2)
})

git
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
      <div class="cashback-info">
        <h2>Cashback {{ cashbackRate }}</h2>
        <div class="cashback-details">
          <div class="cashback-item">
            <p class="cashback-label">{{ offer.categories }}, Olahraga & Aktivitas Luar Ruang (maks 50rb)</p>
            <p class="cashback-rate">2,6%</p>
          </div>
          <p class="cashback-max">Maksimal Rp50.000 per barang</p>

          <div class="cashback-item">
            <p class="cashback-label">Home & Living, Kesehatan & Kecantikan (maks 50rb)</p>
            <p class="cashback-rate">1,95%</p>
          </div>
          <p class="cashback-max">Maksimal Rp50.000 per barang</p>

          <div class="cashback-item">
            <p class="cashback-label">Ibu & Anak, Mainan, Buku & Stationery (maks 50rb)</p>
            <p class="cashback-rate">1,3%</p>
          </div>
          <p class="cashback-max">Maksimal Rp50.000 per barang</p>

          <button class="see-more-btn">Lihat 2 lainnya →</button>
        </div>
      </div>

      <div class="info-box">
        <p>💰 Cashback akan diperbaiki setelah masa validasi</p>
      </div>

      <div class="timeline-section">
        <h2>Perkiraan waktu Cashback</h2>
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-icon-wrapper">
              <div class="timeline-icon active">
                <div class="icon-circle"></div>
              </div>
              <div class="timeline-line"></div>
            </div>
            <div class="timeline-content">
              <h3>Pembelian</h3>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-icon-wrapper">
              <div class="timeline-icon">
                <div class="icon-circle"></div>
              </div>
              <div class="timeline-line"></div>
            </div>
            <div class="timeline-content">
              <h3>Dilacak dalam</h3>
              <p class="timeline-days">{{ estimatedDays }} hari</p>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-icon-wrapper">
              <div class="timeline-icon">
                <div class="icon-circle"></div>
              </div>
            </div>
            <div class="timeline-content">
              <h3>Terkonfirmasi dalam</h3>
              <p class="timeline-days">{{ offer.validationTerms }} hari</p>
            </div>
          </div>
        </div>
      </div>

      <div class="terms-section">
        <h2>Syarat dan pengecualian</h2>
        <div class="terms-item" @click="showExclusions = !showExclusions">
          <div class="terms-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Pengecualian</span>
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            :style="{ transform: showExclusions ? 'rotate(180deg)' : 'rotate(0deg)' }"
          >
            <path d="M5 7.5l5 5 5-5" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
        </div>

        <div v-if="showExclusions" class="exclusions-content">
          <p><strong>Kamu tidak akan</strong> mendapat Cashback pada:</p>
          <ul>
            <li>Utilities; Mobil Bahan Bakar Bensin; Mobil Listrik;</li>
            <li>Mobil Bekas; Mobil Baru; Rokok Filter; Rokok Kretek;</li>
            <li>Logam Mulia & Perhiasan; Investasi; Donasi; Rokok</li>
            <li>dan Korek; Media Digital; Mobil</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="action-footer">
      <button
        class="activate-btn"
        @click="handleGenerateDeeplink"
        :disabled="isGeneratingLink"
      >
        {{ isGeneratingLink ? 'Menghasilkan link...' : 'Diingat ya' }}
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
}

.cashback-rate {
  font-weight: 700;
  font-size: 1.1rem;
  color: #1a1a2e;
  margin: 0;
  white-space: nowrap;
}

.cashback-max {
  font-size: 0.85rem;
  color: #666;
  margin: -0.5rem 0 0.5rem 0;
}

.see-more-btn {
  background: transparent;
  border: none;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 0;
  text-align: left;
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

</style>
