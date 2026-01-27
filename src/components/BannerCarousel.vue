<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Banner {
  id: number
  title: string
  subtitle: string
  imageUrl: string
  backgroundColor: string
}

const banners = ref<Banner[]>([
  {
    id: 1,
    title: 'Cashback hingga 50%',
    subtitle: 'Belanja kebutuhan sehari-hari lebih hemat',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop',
    backgroundColor: '#667eea'
  },
  {
    id: 2,
    title: 'Promo Fashion Terbaru',
    subtitle: 'Dapatkan diskon spesial untuk produk fashion favorit',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
    backgroundColor: '#764ba2'
  },
  {
    id: 3,
    title: 'Elektronik Terbaik',
    subtitle: 'Upgrade gadget dengan harga terjangkau',
    imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=400&fit=crop',
    backgroundColor: '#f093fb'
  },
  {
    id: 4,
    title: 'Traveling Hemat',
    subtitle: 'Jelajahi dunia dengan penawaran travel terbaik',
    imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop',
    backgroundColor: '#4facfe'
  }
])

const currentIndex = ref(0)
let autoPlayInterval: number | null = null

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % banners.value.length
}

const prevSlide = () => {
  currentIndex.value = currentIndex.value === 0 ? banners.value.length - 1 : currentIndex.value - 1
}

const goToSlide = (index: number) => {
  currentIndex.value = index
}

const startAutoPlay = () => {
  autoPlayInterval = window.setInterval(() => {
    nextSlide()
  }, 5000)
}

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<template>
  <div class="carousel-container" @mouseenter="stopAutoPlay" @mouseleave="startAutoPlay">
    <div class="carousel-wrapper">
      <div 
        class="carousel-track" 
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div 
          v-for="banner in banners" 
          :key="banner.id" 
          class="carousel-slide"
          :style="{ backgroundColor: banner.backgroundColor }"
        >
          <div class="slide-content">
            <div class="slide-text">
              <h2 class="slide-title">{{ banner.title }}</h2>
              <p class="slide-subtitle">{{ banner.subtitle }}</p>
            </div>
            <div class="slide-image">
              <img :src="banner.imageUrl" :alt="banner.title" />
            </div>
          </div>
        </div>
      </div>

      <button class="carousel-btn prev" @click="prevSlide" aria-label="Previous slide">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button class="carousel-btn next" @click="nextSlide" aria-label="Next slide">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>

    <div class="carousel-indicators">
      <button
        v-for="(banner, index) in banners"
        :key="banner.id"
        :class="['indicator', { active: index === currentIndex }]"
        @click="goToSlide(index)"
        :aria-label="`Go to slide ${index + 1}`"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.carousel-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.carousel-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-slide {
  min-width: 100%;
  height: 200px;
  position: relative;
  background: linear-gradient(135deg, var(--bg-color, #667eea) 0%, rgba(0, 0, 0, 0.1) 100%);
}

.slide-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 1.5rem;
  gap: 1rem;
}

.slide-text {
  flex: 1;
  color: white;
  z-index: 2;
}

.slide-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

.slide-subtitle {
  font-size: 0.95rem;
  margin: 0;
  opacity: 0.95;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
  line-height: 1.4;
}

.slide-image {
  flex: 0 0 40%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.slide-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.95);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  color: #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  opacity: 0;
}

.carousel-container:hover .carousel-btn {
  opacity: 1;
}

.carousel-btn:hover {
  background: white;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.carousel-btn:active {
  transform: translateY(-50%) scale(0.95);
}

.carousel-btn.prev {
  left: 0.5rem;
}

.carousel-btn.next {
  right: 0.5rem;
}

.carousel-indicators {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.2);
}

.indicator.active {
  background: white;
  width: 24px;
  border-radius: 4px;
}

@media (min-width: 640px) {
  .carousel-slide {
    height: 240px;
  }

  .slide-content {
    padding: 2rem;
  }

  .slide-title {
    font-size: 1.75rem;
  }

  .slide-subtitle {
    font-size: 1rem;
  }

  .carousel-btn {
    display: flex;
  }
}

@media (min-width: 768px) {
  .carousel-slide {
    height: 280px;
  }

  .slide-content {
    padding: 2.5rem;
  }

  .slide-title {
    font-size: 2rem;
  }

  .slide-subtitle {
    font-size: 1.1rem;
  }

  .slide-image {
    flex: 0 0 45%;
  }
}

@media (min-width: 1024px) {
  .carousel-slide {
    height: 320px;
  }

  .slide-content {
    padding: 3rem;
  }

  .slide-title {
    font-size: 2.5rem;
  }

  .slide-subtitle {
    font-size: 1.2rem;
  }

  .slide-image {
    flex: 0 0 50%;
  }
}
</style>
