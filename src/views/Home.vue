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

    <section class="map-section" style="margin: 20px 0; width: 100%;">
      <LeafletMap 
        :items="filtered" 
        :active-item="selectedItem" 
        @select-item="handleMarkerClick"
      />
    </section>

    <section class="places-grid">
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

      <p v-if="!filtered.length" class="muted">조건에 맞는 명소가 없습니다.</p>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onBeforeUpdate } from 'vue'
import { useTourStore } from '../stores/tour' //
import LeafletMap from '../components/LeafletMap.vue'

const tourStore = useTourStore() //

// 현재 선택된 카테고리 상태 (기본값: attraction)
const currentCategory = computed(() => tourStore.currentCategory)
// 필터링된 실제 장소 리스트
const filtered = computed(() => tourStore.currentItems) //

// 🌟 양방향 상태 관리 변수 선언
const selectedItem = ref(null) 
const cardRefs = reactive(new Map()) // reactive 객체 대신 Map 객체로 안전하게 DOM 엘리먼트 수집

// 렌더링이 갱신되기 전에 수집된 DOM 참조 맵 초기화
onBeforeUpdate(() => {
  cardRefs.clear()
})

// 동적 ref 바인딩 헬퍼 함수
const setCardRef = (el, id) => {
  if (el) {
    cardRefs.set(id, el)
  }
}

// 카테고리 영문 코드를 한글로 치환하는 헬퍼 함수
const getCategoryLabel = (cat) => {
  const labels = { 
    attraction: '관광지', 
    culture: '문화/예술', 
    festival: '축제/행사', 
    sports: '레포츠', 
    accommodation: '숙박', 
    shopping: '쇼핑' 
  }
  return labels[cat] || '명소'
}

// 🌟 [카드 ➡️ 지도] 카드를 클릭하면 지도가 해당 좌표로 부드럽게 비행(flyTo)
const focusOnMap = (place) => {
  selectedItem.value = place
}

// 🌟 [지도 ➡️ 카드] 지도 마커를 클릭하면 해당 카드로 자동 스크롤 및 네온 반짝임 작동
const handleMarkerClick = (place) => {
  selectedItem.value = place
  
  const uniqueId = place.id || place.title
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
  margin-bottom: 24px;
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

/* 지도 영역 */
.map-section {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(24,16,40,0.06);
}

/* 명소 리스트 그리드 */
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
  transition: all var(--transition, 240ms);
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

/* 🌟 [인터랙션 핵심] 활성화된 카드 네온 효과 */
.place-card.active-neon {
  border-color: #9b7cff !important;
  box-shadow: 0 0 15px rgba(155, 124, 255, 0.35), 0 4px 20px rgba(155, 124, 255, 0.1) !important;
  transform: translateY(-4px) scale(1.02);
  background: linear-gradient(180deg, #ffffff, rgba(155, 124, 255, 0.03)) !important;
}
</style>