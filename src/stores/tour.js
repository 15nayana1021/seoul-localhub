import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 1. assets/data 폴더에 넣은 JSON 파일들을 임포트합니다.
import shoppingData from '@/assets/data/seoul_shopping.json'
import accommodationData from '@/assets/data/seoul_accommodation.json'
import courseData from '@/assets/data/seoul_course.json'
import festivalData from '@/assets/data/seoul_festival.json'
import cultureData from '@/assets/data/seoul_culture.json'

export const useTourStore = defineStore('tour', () => {
  // 2. 카테고리별 데이터를 하나의 객체로 묶어서 관리합니다.
  const tourData = ref({
    shopping: shoppingData.items || [],
    accommodation: accommodationData.items || [],
    course: courseData.items || [],
    festival: festivalData.items || [],
    culture: cultureData.items || []
  })

  // 현재 사용자가 선택한 카테고리 상태 (기본값: 쇼핑)
  const currentCategory = ref('shopping')

  // 3. 팀원 A가 화면에 그려줄 때 사용할 "현재 필터링된 장소 리스트"
  const currentItems = computed(() => {
    return tourData.value[currentCategory.value] || []
  })

  // 카테고리를 변경하는 함수
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