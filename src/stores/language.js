import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', () => {
  const locale = ref('ko')

  const translations = {
    ko: {
      home: '홈',
      survey: '설문지',
      board: '게시판 목록',
      write: '글쓰기',
      toggleBtn: 'English',
      heroTitle: '💬 여행자 광장',
      heroDesc: '서울을 누비는 여행자들의 생생한 발걸음과 꿀팁이 머무는 곳',
      newPost: '새 글 쓰기'
    },
    en: {
      home: 'Home',
      survey: 'Survey',
      board: 'Board List',
      write: 'Write',
      toggleBtn: '한국어',
      heroTitle: '💬 Traveler Plaza',
      heroDesc: 'A place where the footprints and tips of travelers in Seoul gather',
      newPost: 'New Post'
    }
  }

  const toggleLanguage = () => {
    locale.value = locale.value === 'ko' ? 'en' : 'ko'
  }

  const t = (key) => {
    return translations[locale.value][key] || key
  }

  return {
    locale,
    toggleLanguage,
    t
  }
})