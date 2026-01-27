<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Offer } from '@/domain/entities/Offer'

interface Props {
  offers: Offer[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  filterChange: [category: string]
}>()

const selectedCategory = ref<string>('All')

const categories = computed(() => {
  const categorySet = new Set<string>()
  categorySet.add('All')
  
  props.offers.forEach(offer => {
    if (offer.categories) {
      const cats = offer.categories.split(',').map(c => c.trim())
      cats.forEach(cat => {
        if (cat) categorySet.add(cat)
      })
    }
  })
  
  return Array.from(categorySet)
})

const selectCategory = (category: string) => {
  selectedCategory.value = category
  emit('filterChange', category)
}

const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, string> = {
    'All': '🏠',
    'Fashion': '👗',
    'Electronics': '💻',
    'Food': '🍔',
    'Travel': '✈️',
    'Beauty': '💄',
    'Sports': '⚽',
    'Books': '📚',
    'Home': '🏡',
    'Toys': '🎮',
    'Health': '💊',
    'Automotive': '🚗'
  }
  return iconMap[category] || '🏷️'
}
</script>

<template>
  <div class="category-filter">
    <div class="category-scroll">
      <button
        v-for="category in categories"
        :key="category"
        :class="['category-btn', { active: selectedCategory === category }]"
        @click="selectCategory(category)"
      >
        <span class="category-icon">{{ getCategoryIcon(category) }}</span>
        <span class="category-name">{{ category }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.category-filter {
  width: 100%;
  margin: 1.5rem 0;
  position: relative;
}

.category-scroll {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding: 0.5rem 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.category-scroll::-webkit-scrollbar {
  display: none;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.85);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  font-size: 0.9rem;
  font-weight: 600;
  color: #555;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
  position: relative;
}

.category-btn:hover:not(.active) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.95);
}

.category-btn.active {
  background: #6b7bf5;
  color: white;
  box-shadow: 0 6px 20px rgba(107, 123, 245, 0.5);
  transform: translateY(-3px);
}

.category-btn.active:hover {
  background: #5a6be8;
  box-shadow: 0 8px 24px rgba(107, 123, 245, 0.6);
}

.category-btn.active .category-icon,
.category-btn.active .category-name {
  color: white;
}

.category-icon {
  font-size: 1.2rem;
  line-height: 1;
}

.category-name {
  font-size: 0.9rem;
}

@media (min-width: 640px) {
  .category-scroll {
    gap: 1rem;
  }

  .category-btn {
    padding: 0.875rem 1.5rem;
    font-size: 0.95rem;
  }

  .category-icon {
    font-size: 1.3rem;
  }

  .category-name {
    font-size: 0.95rem;
  }
}

@media (min-width: 768px) {
  .category-filter {
    margin: 2rem 0;
  }

  .category-scroll {
    justify-content: center;
    flex-wrap: wrap;
  }

  .category-btn {
    padding: 1rem 1.75rem;
    font-size: 1rem;
  }

  .category-icon {
    font-size: 1.4rem;
  }

  .category-name {
    font-size: 1rem;
  }
}
</style>
