import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 1. @ 대신 상대 경로(../)를 사용하여 7개의 JSON 파일을 안전하게 불러옵니다.
import attractionData from '../assets/data/seoul_attraction.json'
import cultureData from '../assets/data/seoul_culture.json'
import festivalData from '../assets/data/seoul_festival.json'
import courseData from '../assets/data/seoul_course.json'
import sportsData from '../assets/data/seoul_leports.json'
import accommodationData from '../assets/data/seoul_accommodation.json'
import shoppingData from '../assets/data/seoul_shopping.json'

export const useTourStore = defineStore('tour', () => {
  // 2. 7가지 전체 카테고리 데이터를 반응형 상태로 정의합니다.
  const tourData = ref({
    attraction: attractionData.items || [],
    culture: cultureData.items || [],
    festival: festivalData.items || [],
    course: courseData.items || [],
    sports: sportsData.items || [],
    accommodation: accommodationData.items || [],
    shopping: shoppingData.items || []
  })

  // 기본 활성화 카테고리를 '관광지(attraction)'로 설정합니다.
  const currentCategory = ref('attraction')

  // 현재 선택된 카테고리의 실제 데이터 아이템 리스트를 반환합니다.
  const currentItems = computed(() => {
    return tourData.value[currentCategory.value] || []
  })

  // 카테고리 전환 함수
  const changeCategory = (category) => {
    if (tourData.value[category]) {
      currentCategory.value = category
    }
  }

  return {
    tourData,
    currentCategory,
    currentItems,
    changeCategory
  }
})