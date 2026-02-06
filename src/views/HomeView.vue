<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useOfferStore } from '@/stores/offerStore'
import { useRouter, useRoute } from 'vue-router'
import BannerCarousel from '@/components/BannerCarousel.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'

const offerStore = useOfferStore()
const router = useRouter()
const route = useRoute()
const selectedCategory = ref<string>('All')
const userId = ref<string>('')

onMounted(() => {
  const userIdParam = route.query.user_id as string
  if (userIdParam) {
    userId.value = userIdParam
    localStorage.setItem('user_id', userIdParam)
  } else {
    const storedUserId = localStorage.getItem('user_id')
    if (storedUserId) {
      userId.value = storedUserId
    }
  }

  offerStore.fetchOffers(1)
})

const filteredOffers = computed(() => {
  if (selectedCategory.value === 'All') {
    return offerStore.offers
  }

  return offerStore.offers.filter(offer => {
    if (!offer.categories) return false
    const categories = offer.categories.split(',').map(c => c.trim())
    return categories.includes(selectedCategory.value)
  })
})

const handleCategoryChange = (category: string) => {
  selectedCategory.value = category
}

const goToOfferDetail = (offerId: number) => {
  router.push({ name: 'offer-detail', params: { id: offerId } })
}
</script>

<template>
  <div class="home-container">
    <div class="hero-header">
      <h1 class="main-title">Smart Shopping Starts Here</h1>
      <p class="subtitle">Discover trusted deals and promotions</p>
    </div>

    <main class="main-content">
      <BannerCarousel />

      <CategoryFilter
        v-if="!offerStore.loading && offerStore.offers.length > 0"
        :offers="offerStore.offers"
        @filter-change="handleCategoryChange"
      />

      <div v-if="offerStore.loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div v-else-if="filteredOffers.length === 0" class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>No offers found</h3>
        <p>Try selecting another category</p>
      </div>

      <div v-else class="offers-section">
        <div class="section-header">
          <h2 class="section-title">
            {{ selectedCategory === 'All' ? 'All Offers' : selectedCategory }}
          </h2>
          <span class="offer-count">{{ filteredOffers.length }} offers</span>
        </div>

        <div class="offers-grid">
          <div
            v-for="offer in filteredOffers"
            :key="offer.offerId"
            class="offer-card"
            @click="goToOfferDetail(offer.offerId)"
          >
            <div class="offer-logo">
              <img :src="offer.logoUrl" :alt="offer.offerName" />
            </div>
            <div class="offer-info">
              <h3>{{ offer.offerName }}</h3>
              <p class="offer-category">{{ offer.categories }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #4facfe 100%);
  position: relative;
  overflow-x: hidden;
  padding: 0;
}

.hero-header {
  text-align: center;
  padding: 2rem 1.5rem 1.5rem;
  color: white;
}

.main-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 1rem;
  font-weight: 400;
  margin: 0;
  opacity: 0.95;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1rem 3rem;
  position: relative;
  z-index: 1;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 4rem;
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

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.no-results h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.no-results p {
  font-size: 1rem;
  margin: 0;
  opacity: 0.9;
}

.offers-section {
  margin-top: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.offer-count {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.offers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}

.offer-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.offer-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
}

.offer-card:active {
  transform: translateY(-4px);
}

.offer-logo {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
}

.offer-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 0.5rem;
}

.offer-info h3 {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #1a1a2e;
  line-height: 1.3;
}

.offer-category {
  font-size: 0.75rem;
  color: #666;
  margin: 0;
  font-weight: 500;
}

@media (min-width: 480px) {
  .offers-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.25rem;
  }

  .offer-card {
    padding: 1.75rem 1.25rem;
  }

  .offer-logo {
    width: 90px;
    height: 90px;
  }

  .offer-info h3 {
    font-size: 0.95rem;
  }

  .offer-category {
    font-size: 0.8rem;
  }

  .section-title {
    font-size: 1.75rem;
  }
}

@media (min-width: 768px) {
  .hero-header {
    padding: 3rem 2rem 2rem;
  }

  .main-title {
    font-size: 2.25rem;
  }

  .subtitle {
    font-size: 1.15rem;
  }

  .main-content {
    padding: 1.5rem 2rem 4rem;
  }

  .offers-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .offer-card {
    padding: 2rem 1.5rem;
  }

  .offer-logo {
    width: 100px;
    height: 100px;
  }

  .offer-info h3 {
    font-size: 1rem;
  }

  .offer-category {
    font-size: 0.85rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .offer-count {
    font-size: 1rem;
    padding: 0.6rem 1.25rem;
  }
}

@media (min-width: 1024px) {
  .main-title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .offers-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 2rem;
  }

  .section-title {
    font-size: 2.25rem;
  }
}
</style>
