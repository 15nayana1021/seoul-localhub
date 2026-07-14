<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">LocalHub 서울 데이터 반응성 테스트 (팀원 B)</h1>

    <div class="flex gap-2 mb-6">
      <button 
        v-for="category in categories" 
        :key="category.key"
        @click="tourStore.changeCategory(category.key)"
        :class="[
          'px-4 py-2 rounded-lg font-semibold transition-colors',
          tourStore.currentCategory === category.key 
            ? 'bg-blue-600 text-white' 
            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
        ]"
      >
        {{ category.name }} ({{ tourStore.tourData[category.key]?.length || 0 }}건)
      </button>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-md">
      <h2 class="text-xl font-bold text-blue-600 mb-4">
        현재 카테고리: <span class="underline">{{ tourStore.currentCategory }}</span>
      </h2>

      <p v-if="tourStore.currentItems.length === 0" class="text-gray-500">
        데이터를 불러오는 중이거나 데이터가 없습니다.
      </p>

      <ul v-else class="divide-y divide-gray-100">
        <li 
          v-for="item in tourStore.currentItems.slice(0, 5)" 
          :key="item.contentid" 
          class="py-3"
        >
          <p class="font-semibold text-gray-800">{{ item.title }}</p>
          <p class="text-sm text-gray-500">{{ item.addr1 }}</p>
        </li>
      </ul>
      <p class="text-xs text-gray-400 mt-4">* 화면 편의상 상위 5개 장소만 임시로 보여줍니다.</p>
    </div>
  </div>
</template>

<script setup>
import { useTourStore } from './stores/tour'

// 1. 스토어 불러오기
const tourStore = useTourStore()

// 2. 루프를 돌리기 위한 임시 카테고리 정보 정의
const categories = [
  { key: 'shopping', name: '쇼핑' },
  { key: 'accommodation', name: '숙박' },
  { key: 'course', name: '여행코스' },
  { key: 'festival', name: '축제/행사' },
  { key: 'culture', name: '문화시설' }
]
</script>
