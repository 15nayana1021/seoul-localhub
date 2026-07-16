<template>
  <div class="home-container">
    <div class="blobs" aria-hidden="true">
      <div class="blob b1"></div>
      <div class="blob b2"></div>
    </div>

    <header class="home-header">
      <span class="badge">LOCAL TOUR GUIDE</span>
      <h2>서울, 당신만의 여행지</h2>
      <p class="muted">분위기별로 골라보는 추천 코스</p>
    </header>

    <div class="search-wrapper">
      <div class="search-bar-container">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          :value="searchQuery" 
          @input="searchQuery = $event.target.value"
          placeholder="14대 명소를 넘어 서울의 모든 명소, 쇼핑, 숙박 검색..." 
          @focus="isDropdownOpen = true"
          class="search-input"
        />
        <button v-if="searchQuery" @click="clearSearch" class="btn-clear-search">✕</button>
      </div>
      <ul v-if="isDropdownOpen && searchResults.length > 0" class="search-dropdown">
        <li 
          v-for="result in searchResults" 
          :key="result.id || result.title"
          @click="selectSearchResult(result)"
          class="dropdown-item"
        >
          <span class="result-cat">{{ getCategoryLabel(result.category) }}</span>
          <span class="result-title">{{ result.title }}</span>
          <span class="result-addr" v-if="result.addr1">{{ result.addr1 }}</span>
        </li>
      </ul>
    </div>

    <section class="map-section" style="margin: 20px 0; width: 100%;">
      <LeafletMap 
        :items="mapItems" 
        :active-item="selectedItem" 
        @select-item="handleMarkerClick"
      />
    </section>

    <section class="places-grid">
      <div v-if="isSearchedAndNotListed" class="temp-searched-section">
        <h4 class="temp-title">🔍 검색한 추천 장소</h4>
        <article
          ref="tempRef"
          class="place-card active-neon temp-searched-card"
          @click="focusOnMap(selectedItem)"
        >
          <div class="place-body">
            <span class="category-tag searched-tag">{{ getCategoryLabel(selectedItem.category) }}</span>
            <h3 class="place-title">{{ selectedItem.title }}</h3>
            <p class="place-addr" v-if="selectedItem.addr1">🚗 주소: {{ selectedItem.addr1 }}</p>
            <p class="place-tel" v-if="selectedItem.tel">📞 문의: {{ selectedItem.tel }}</p>
          </div>
        </article>
        <hr class="section-divider" />
      </div>

      <article
        v-for="place in filtered"
        :key="place.id || place.title"
        :ref="(el) => setCardRef(el, place.id || place.title)"
        :class="['place-card', { 'active-neon': selectedItem?.title === place.title }]"
        @click="focusOnMap(place)"
      >
        <div class="place-body">
          <span class="category-tag">{{ getCategoryLabel(currentCategory) }}</span>
          <h3 class="place-title">{{ place.title }}</h3>
          <p class="place-addr" v-if="place.addr1">🚗 주소: {{ place.addr1 }}</p>
          <p class="place-tel" v-if="place.tel">📞 문의: {{ place.tel }}</p>
        </div>
      </article>

      <p v-if="!filtered.length && !isSearchedAndNotListed" class="muted">조건에 맞는 명소가 없습니다.</p>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onBeforeUpdate, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useTourStore } from '../stores/tour' //
import LeafletMap from '../components/LeafletMap.vue'

const tourStore = useTourStore() //

const currentCategory = computed(() => tourStore.currentCategory)
const filtered = computed(() => tourStore.currentItems) //

const selectedItem = ref(null) 
const cardRefs = reactive(new Map())
const tempRef = ref(null) 

const searchQuery = ref('')
const searchResults = ref([])
const isDropdownOpen = ref(false)

watch(searchQuery, (newQuery) => {
  console.log('⌨️ 입력 중인 검색어:', newQuery)
  
  const query = newQuery.trim().toLowerCase().replace(/\s+/g, '')
  if (!query) {
    searchResults.value = []
    isDropdownOpen.value = false
    return
  }

  searchResults.value = (tourStore.allRawItems || []).filter(item => {
    const rawTitle = item.title || ''
    const rawAddr = item.addr1 || ''

    const titleNormalized = rawTitle.toLowerCase().replace(/\s+/g, '')
    const addrNormalized = rawAddr.toLowerCase().replace(/\s+/g, '')

    return titleNormalized.includes(query) || addrNormalized.includes(query)
  }).slice(0, 7)

  console.log('🔍 검색 매칭 데이터 리스트:', searchResults.value)
})

const mapItems = computed(() => {
  const base = [...filtered.value]
  if (selectedItem.value && !base.some(item => item.title === selectedItem.value.title)) {
    base.push(selectedItem.value)
  }
  return base
})

const isSearchedAndNotListed = computed(() => {
  if (!selectedItem.value) return false
  return !filtered.value.some(item => item.title === selectedItem.value.title)
})

const selectSearchResult = (result) => {
  selectedItem.value = result
  searchQuery.value = result.title
  isDropdownOpen.value = false

  nextTick(() => {
    if (tempRef.value) {
      tempRef.value.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  })
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  selectedItem.value = null
}

const handleOutsideClick = (e) => {
  const wrapper = document.querySelector('.search-wrapper')
  if (wrapper && !wrapper.contains(e.target)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick)
})

onBeforeUpdate(() => {
  cardRefs.clear()
})

const setCardRef = (el, id) => {
  if (el) {
    cardRefs.set(id, el)
  }
}

const getCategoryLabel = (cat) => {
  const labels = { 
    attraction: '관광지', 
    culture: '문화/예술', 
    festival: '축제/행사', 
    course: '코스',
    sports: '레포츠', 
    accommodation: '숙박', 
    shopping: '쇼핑' 
  }
  return labels[cat] || '명소'
}

const focusOnMap = (place) => {
  selectedItem.value = place
}

const handleMarkerClick = (place) => {
  selectedItem.value = place
  
  const uniqueId = place.id || place.title
  
  if (isSearchedAndNotListed.value) {
    nextTick(() => {
      if (tempRef.value) tempRef.value.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
    return
  }

  const targetCard = cardRefs.get(uniqueId)
  if (targetCard) {
    targetCard.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    })
  }
}
</script>

<style scoped>
.home-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
  box-sizing: border-box;
  font-family: 'Noto Sans KR', sans-serif;
  color: var(--text);
  position: relative;
}

.home-header {
  text-align: center;
  margin-bottom: 20px;
}
.badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: #9b7cff;
  background: rgba(155, 124, 255, 0.08);
  padding: 4px 12px;
  border-radius: 999px;
  margin-bottom: 8px;
}
.home-header h2 {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
}
.muted {
  font-size: 13px;
  color: #736077;
  margin-top: 6px;
}

.search-wrapper {
  position: relative;
  max-width: 540px;
  margin: 0 auto 24px;
  z-index: 1010; 
}
.search-bar-container {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 14px;
  font-size: 14px;
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 12px 40px 12px 38px;
  border-radius: 14px;
  border: 1px solid rgba(155, 124, 255, 0.2);
  background: rgba(255, 255, 255, 0.95);
  font-size: 14px;
  font-weight: 600;
  outline: none;
  box-shadow: 0 4px 15px rgba(155, 124, 255, 0.04);
  transition: all 0.3s ease;
}
.search-input:focus {
  border-color: #9b7cff;
  box-shadow: 0 4px 20px rgba(155, 124, 255, 0.12);
}
.btn-clear-search {
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  color: #736077;
  font-size: 14px;
  cursor: pointer;
  padding: 4px;
}

.search-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(155, 124, 255, 0.15);
  border-radius: 14px;
  box-shadow: 0 10px 35px rgba(24, 16, 40, 0.08);
  max-height: 280px;
  overflow-y: auto;
  margin: 0;
  padding: 6px 0;
  list-style: none;
  text-align: left;
}
.dropdown-item {
  padding: 11px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.2s;
}
.dropdown-item:hover {
  background: rgba(155, 124, 255, 0.04);
}
.result-cat {
  font-size: 9px;
  font-weight: 700;
  color: #9b7cff;
  background: rgba(155, 124, 255, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}
.result-title {
  font-size: 13px;
  font-weight: 700;
  color: #2f213f;
}
.result-addr {
  font-size: 11px;
  color: #736077;
  margin-left: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.map-section {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(24,16,40,0.06);
}

.temp-searched-section {
  grid-column: 1 / -1;
  text-align: left;
}
.temp-title {
  font-size: 14px;
  font-weight: 700;
  color: #ff8ab6;
  margin: 0 0 12px;
}
.searched-tag {
  color: #ff8ab6 !important;
  background: rgba(255, 138, 182, 0.08) !important;
}
.section-divider {
  border: 0;
  height: 1px;
  background: rgba(155, 124, 255, 0.1);
  margin: 24px 0 12px;
}

.places-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-top: 24px;
}
@media (min-width: 768px) {
  .places-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

.place-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 20px;
  border: 1px solid rgba(24,16,40,0.06);
  box-shadow: 0 8px 24px rgba(24,16,40,0.04);
  text-align: left;
  cursor: pointer;
  transition: all 240ms ease;
}
.place-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(155, 124, 255, 0.08);
}

.category-tag {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  color: #9b7cff;
  background: rgba(155, 124, 255, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
  margin-bottom: 8px;
}
.place-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 8px;
}
.place-addr, .place-tel {
  font-size: 12px;
  color: #736077;
  margin: 4px 0 0;
}

.place-card.active-neon {
  border-color: #9b7cff !important;
  box-shadow: 0 0 15px rgba(155, 124, 255, 0.35), 0 4px 20px rgba(155, 124, 255, 0.1) !important;
  transform: translateY(-4px) scale(1.02);
  background: linear-gradient(180deg, #ffffff, rgba(155, 124, 255, 0.03)) !important;
}
</style>