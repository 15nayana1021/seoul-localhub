import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import attractionData from '../assets/data/seoul_attraction.json'
import cultureData from '../assets/data/seoul_culture.json'
import festivalData from '../assets/data/seoul_festival.json'
import courseData from '../assets/data/seoul_course.json'
import sportsData from '../assets/data/seoul_leports.json'
import accommodationData from '../assets/data/seoul_accommodation.json'
import shoppingData from '../assets/data/seoul_shopping.json'

export const useTourStore = defineStore('tour', () => {
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

  const filterPremiumPlaces = (items) => {
    if (!items) return []
    return items.filter(item => {
      const normalizedTitle = item.title.replace(/\s+/g, '').toLowerCase()
      return targetPlaces.some(target => {
        const normalizedTarget = target.replace(/\s+/g, '').toLowerCase()
        return normalizedTitle.includes(normalizedTarget) || normalizedTarget.includes(normalizedTitle)
      })
    })
  }

  const tourData = ref({
    attraction: filterPremiumPlaces(attractionData.items || []),
    culture: filterPremiumPlaces(cultureData.items || []),
    festival: filterPremiumPlaces(festivalData.items || []),
    course: filterPremiumPlaces(courseData.items || []),
    sports: filterPremiumPlaces(sportsData.items || []),
    accommodation: filterPremiumPlaces(accommodationData.items || []),
    shopping: filterPremiumPlaces(shoppingData.items || [])
  })

  const allRawItems = computed(() => {
    const categories = [
      { items: attractionData.items || [], cat: 'attraction' },
      { items: cultureData.items || [], cat: 'culture' },
      { items: festivalData.items || [], cat: 'festival' },
      { items: courseData.items || [], cat: 'course' },
      { items: sportsData.items || [], cat: 'sports' },
      { items: accommodationData.items || [], cat: 'accommodation' },
      { items: shoppingData.items || [], cat: 'shopping' }
    ]

    const combined = []
    categories.forEach(({ items, cat }) => {
      items.forEach(item => {
        combined.push({
          ...item,
          category: cat
        })
      })
    })
    return combined
  })

  const currentCategory = ref('attraction')

  const currentItems = computed(() => {
    return tourData.value[currentCategory.value] || []
  })

  const changeCategory = (category) => {
    if (tourData.value[category]) {
      currentCategory.value = category
    }
  }

  return {
    tourData,
    allRawItems,
    currentCategory,
    currentItems,
    changeCategory
  }
})