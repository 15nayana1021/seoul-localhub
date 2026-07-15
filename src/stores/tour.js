import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// JSON 파일들을 상대 경로로 안전하게 로드합니다
import attractionData from '../assets/data/seoul_attraction.json'
import cultureData from '../assets/data/seoul_culture.json'
import festivalData from '../assets/data/seoul_festival.json'
import courseData from '../assets/data/seoul_course.json'
import sportsData from '../assets/data/seoul_leports.json'
import accommodationData from '../assets/data/seoul_accommodation.json'
import shoppingData from '../assets/data/seoul_shopping.json'

export const useTourStore = defineStore('tour', () => {
  // 🌟 A님이 직접 엄선하신 서울 프리미엄 명소 14곳 정의
  const targetPlaces = [
    '경복궁',
    '남산서울타워',
    '여의도한강공원',
    '청계천',
    '광화문',
    '국립중앙박물관',
    '롯데월드타워&롯데월드몰',
    '신사동 가로수길',
    '경리단길',
    '홍대',
    '태그호이어 현대백화점 더현대 서울',
    '서울신라호텔',
    '시그니엘 서울',
    '송파구 호수벚꽃축제'
  ]

  // 공공데이터 내 이름에 띄어쓰기나 괄호가 섞여 있어도 완벽히 매칭해내기 위한 헬퍼 함수
  const filterPremiumPlaces = (items) => {
    if (!items) return []
    return items.filter(item => {
      // 장소 이름에서 모든 공백과 대소문자를 통일하여 비교합니다.
      const normalizedTitle = item.title.replace(/\s+/g, '').toLowerCase()
      return targetPlaces.some(target => {
        const normalizedTarget = target.replace(/\s+/g, '').toLowerCase()
        return normalizedTitle.includes(normalizedTarget) || normalizedTarget.includes(normalizedTitle)
      })
    })
  }

  // 🌟 7가지 데이터 전체에 필터를 적용하여, 오직 14대 명소만 가집니다.
  const tourData = ref({
    attraction: filterPremiumPlaces(attractionData.items || []),
    culture: filterPremiumPlaces(cultureData.items || []),
    festival: filterPremiumPlaces(festivalData.items || []),
    course: filterPremiumPlaces(courseData.items || []),
    sports: filterPremiumPlaces(sportsData.items || []),
    accommodation: filterPremiumPlaces(accommodationData.items || []),
    shopping: filterPremiumPlaces(shoppingData.items || [])
  })

  // 기본 활성화 카테고리
  const currentCategory = ref('attraction')

  // 현재 활성화된 데이터 목록 반환
  const currentItems = computed(() => {
    return tourData.value[currentCategory.value] || []
  })

  // 카테고리 전환 액션
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