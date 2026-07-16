<template>
  <div class="result-container">
    <div class="blobs" aria-hidden="true">
      <div class="blob b1"></div>
      <div class="blob b2"></div>
    </div>

    <div v-if="!hasPrefs" class="card no-prefs-card">
      <span class="warning-emoji">⚠️</span>
      <h2>아직 성향 테스트를 진행하지 않으셨습니다!</h2>
      <p class="muted">나의 세부 여행 취향을 분석하고 AI 맞춤 코스를 빌드하려면 먼저 설문을 완료해 주세요.</p>
      <button @click="goToSurvey" class="btn-retry">🎯 설문지 작성하러 가기</button>
    </div>

    <div class="card" v-else>
      
      <div class="utility-bar" v-if="!isLoading">
        <button @click="downloadCourseImage" class="btn-utility download-btn">
          📸 이미지로 저장
        </button>
        <button @click="shareCourse" class="btn-utility share-btn">
          📤 카톡 및 소셜 공유
        </button>
      </div>

      <div id="capture-area" class="capture-box">
        <header class="result-header">
          <span class="badge">AI CUSTOM COURSE</span>
          <h2>✨ AI가 설계한 나만의 서울 맞춤 여행 코스</h2>
          <p class="muted">당신의 성향 설문 결과를 바탕으로 서울 공공데이터를 융합하여 특별한 하루 코스를 설계했습니다.</p>
        </header>

        <div v-if="isLoading" class="loading-area">
          <div class="spinner"></div>
          <h3>AI 가이드가 최적의 여행 경로를 설계하고 있습니다...</h3>
          <p class="muted">성향에 딱 맞는 명소, 액티비티, 숙박 및 쇼핑 정보를 조합하는 중입니다.</p>
        </div>

        <div v-else>
          <section class="map-section">
            <LeafletMap 
              :items="aiRecommendedPlaces" 
              :active-item="selectedItem"
              @select-item="handleMarkerClick"
            />
          </section>

          <WeatherSummary :travel-info="travelInfo" />

          <section class="ai-report-card">
            <h3 class="report-title">🤖 AI 가이드의 맞춤 코스 제안서</h3>
            <p class="ai-text-content">{{ aiCoursePlan }}</p>
          </section>

          <section class="places-section">
            <h3 class="section-title">📌 코스 포함 명소 상세 정보</h3>
            <div class="places-grid">
              <article
                v-for="place in aiRecommendedPlaces"
                :key="place.id || place.title"
                :ref="(el) => setCardRef(el, place.id || place.title)"
                :class="['place-card', { 'active-neon': selectedItem?.title === place.title }]"
                @click="focusOnMap(place)"
              >
                <div class="place-body">
                  <span class="category-tag">{{ getCategoryLabel(place.category) }}</span>
                  <h4 class="place-title">{{ place.title }}</h4>
                  <p class="place-addr" v-if="place.addr1">🚗 주소: {{ place.addr1 }}</p>
                  <p class="place-tel" v-if="place.tel">📞 문의: {{ place.tel }}</p>
                </div>
              </article>
            </div>
          </section>
        </div>
      </div>

      <div class="action-buttons" v-if="!isLoading">
        <button @click="retry" class="btn-retry">🔄 테스트 다시 하기</button>
        <button @click="goHome" class="btn-home">🏠 홈으로 가기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, onBeforeUpdate } from 'vue' 
import { useRouter } from 'vue-router'
import { useTourStore } from '../stores/tour' 
import LeafletMap from '../components/LeafletMap.vue' 
import WeatherSummary from '../components/WeatherSummary.vue' 
import html2canvas from 'html2canvas'

const router = useRouter()
const tourStore = useTourStore() 

const hasPrefs = ref(false) 
const isLoading = ref(true)
const aiCoursePlan = ref('')
const aiRecommendedPlaces = ref([])
const travelInfo = ref({})

const selectedItem = ref(null)
const cardRefs = reactive(new Map()) 

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
    sports: '레포츠', 
    accommodation: '숙박', 
    shopping: '쇼핑' 
  }
  return labels[cat] || '명소'
}

const checkPreferences = () => {
  try {
    const rawPrefs = localStorage.getItem('userPreferences')
    if (!rawPrefs) return false

    const parsed = JSON.parse(rawPrefs)
    const requiredKeys = ['waiting', 'vibe', 'energy', 'sns', 'placeType']
    const isValid = requiredKeys.every(key => parsed[key] && parsed[key].trim() !== '')
    
    return isValid
  } catch (e) {
    return false
  }
}

const generateAICourse = async (userPrefs) => {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('API Key가 설정되지 않았습니다. .env 파일을 확인해주세요.')
    }

    const rawSurveyData = localStorage.getItem('surveyData') 
    const surveyData = rawSurveyData ? JSON.parse(rawSurveyData) : { 
      stayText: '당일치기 여행',
      ageGroup: '20대',
      companion: '친구',
      mbti: 'ENFP'
    }

    travelInfo.value = {
      startDate: surveyData.startDate || '',
      endDate: surveyData.endDate || ''
    }

    const getCategoryList = (cat, limit) => {
      const list = tourStore.tourData[cat] || []
      return list.slice(0, limit).map(p => ({
        title: p.title,
        addr1: p.addr1,
        mapx: p.mapx,
        mapy: p.mapy,
        tel: p.tel,
        id: p.id,
        category: p.category
      }))
    }

    const tourContext = {
      attraction: getCategoryList('attraction', 15),
      culture: getCategoryList('culture', 15),
      festival: getCategoryList('festival', 15),
      sports: getCategoryList('sports', 10),
      accommodation: getCategoryList('accommodation', 10),
      shopping: getCategoryList('shopping', 10)
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `
              당신은 서울 여행 전문 AI 큐레이터입니다.
              사용자의 여행 기본 정보와 성향 프로필을 지능적으로 매칭 및 융합하여, 완벽한 연계 코스 일정표와 추천 장소 리스트를 JSON 형식으로 정확히 반환해야 합니다.

              [사용자의 여행 정보 및 성향]
              - 여행 일정 요약: ${surveyData.stayText}
              - 나이대 및 동행인: ${surveyData.ageGroup}의 동행인 '${surveyData.companion}'과 함께하는 여행입니다.
              - 사용자의 MBTI: ${surveyData.mbti}
              - 맛집 웨이팅 감수 여부: ${userPrefs.waiting}
              - 선호 식도락 분위기: ${userPrefs.vibe}
              - 여행 시 활동 에너지량: ${userPrefs.energy}
              - SNS 사용 정도: ${userPrefs.sns}
              - 선호 공간 스타일: ${userPrefs.placeType}

              [서울 공공데이터 소스]
              ${JSON.stringify(tourContext)}

              [반환 형식 요구사항]
              오직 아래의 JSON 구조 한 가지만 반환하세요. 앞뒤에 다른 설명이나 마크다운 코드 블록(\`\`\`json)은 절대로 적지 마세요.
              {
                "coursePlan": "AI 가이드가 친절하고 전문적인 어조(~요, ~습니다)로 작성하는 사용자 취향 맞춤형 하루 스케줄(오전-오후-저녁) 연계 스토리 해설",
                "recommendedPlaces": [
                  { "id": "데이터에서 엄선한 장소의 id", "title": "선택한 장소의 title", "addr1": "주소", "mapx": "경도(mapx)", "mapy": "위도(mapy)", "tel": "전화번호", "category": "카테고리 영문명(sports/culture/attraction/shopping/accommodation 중 하나)" }
                ]
              }
            `
          },
          {
            role: 'user',
            content: "나의 여행 정보와 성향 데이터를 바탕으로 가장 가치 있고 감동적인 나만의 서울 일치형 코스를 설계해 줘."
          }
        ]
      })
    })

    if (!response.ok) throw new Error('AI 코스 생성 통신에 실패했습니다.')

    const data = await response.json()
    let cleanText = data.choices[0].message.content.trim()
    
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '').trim()
    }
    
    const resultJson = JSON.parse(cleanText)
    aiCoursePlan.value = resultJson.coursePlan
    aiRecommendedPlaces.value = resultJson.recommendedPlaces

  } catch (error) {
    console.error(error)
    aiCoursePlan.value = "⚠️ 죄송합니다. 여행 설문 결과를 동적으로 융합하는 중 통신 지연이 발생했습니다. 아래에서 기본 추천 명소들을 대신 확인해 보세요!"
    const fallbackList = Object.values(tourStore.tourData).flat()
    aiRecommendedPlaces.value = fallbackList.slice(0, 5) 
  } finally {
    isLoading.value = false
  }
}

const focusOnMap = (place) => {
  selectedItem.value = place
}

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

const downloadCourseImage = async () => {
  const captureArea = document.getElementById('capture-area')
  if (!captureArea) return

  alert('📸 나만의 서울 여행 코스 이미지를 빌드하는 중입니다. 잠시만 기다려 주세요!')

  try {
    const canvas = await html2canvas(captureArea, {
      useCORS: true,
      logging: false,
      backgroundColor: '#fbf9ff',
      scale: 2
    })

    const imageUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `seoul-course-${Date.now()}.png`
    link.click()
  } catch (error) {
    console.error('이미지 빌딩 실패:', error)
    alert('죄송합니다. 지도 타일 로딩 지연 등으로 이미지 저장에 실패했습니다. 다시 한 번 시도해 주세요!')
  }
}

const shareCourse = async () => {
  const shareData = {
    title: '🗺️ AI가 설계한 나만의 서울 맞춤 여행 코스',
    text: '내 여행 성향 설문을 바탕으로 완벽한 하루 코스가 완성되었습니다! 확인하러 가기 ⬇️',
    url: window.location.href
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      console.log('소셜 공유 취소 또는 중단됨', err)
    }
  } else {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('🔗 링크가 성공적으로 클립보드에 복사되었습니다!\n카카오톡 대화방에 붙여넣기(Ctrl+V)해서 친구에게 바로 공유해 보세요!')
    } catch (err) {
      alert('링크 복사에 실패했습니다. 주소창의 주소를 직접 복사해 주세요!')
    }
  }
}

onMounted(() => {
  if (checkPreferences()) {
    hasPrefs.value = true
    const saved = localStorage.getItem('userPreferences')
    generateAICourse(JSON.parse(saved))
  } else {
    hasPrefs.value = false
    isLoading.value = false
  }
})

const goToSurvey = () => {
  router.push('/survey')
}

const retry = () => {
  localStorage.removeItem('userPreferences')
  localStorage.removeItem('surveyData')
  router.push('/survey')
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.result-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
  background: linear-gradient(180deg, #fff6fb 0%, #fffdf8 60%);
  position: relative;
  overflow: hidden;
  font-family: 'Noto Sans KR', system-ui, -apple-system, sans-serif;
  color: var(--text);
}

.blobs { position: absolute; inset: 0; pointer-events: none; }
.blob { position: absolute; filter: blur(36px); opacity: 0.95; transform: translateZ(0); }
.b1 { width: 360px; height: 360px; left: -80px; top: -60px; background: radial-gradient(circle at 30% 30%, rgba(155,124,255,0.4), transparent 40%); }
.b2 { width: 280px; height: 280px; right: -60px; top: 40px; background: radial-gradient(circle at 30% 30%, rgba(255,138,182,0.25), transparent 40%); }

.card {
  width: 100%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 22px;
  padding: 32px;
  box-shadow: 0 14px 40px rgba(24,16,40,0.08);
  border: 1px solid rgba(155,124,255,0.08);
  backdrop-filter: blur(6px);
  position: relative;
  z-index: 2;
  text-align: center;
}

.no-prefs-card {
  padding: 64px 32px;
}
.warning-emoji {
  font-size: 48px;
  display: block;
  margin-bottom: 20px;
}

.utility-bar {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px dashed rgba(155, 124, 255, 0.15);
  padding-bottom: 14px;
}
.btn-utility {
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.download-btn {
  background: rgba(155, 124, 255, 0.08);
  color: #9b7cff;
  border: 1px solid rgba(155, 124, 255, 0.15);
}
.download-btn:hover {
  background: #9b7cff;
  color: #ffffff;
}
.share-btn {
  background: rgba(255, 138, 182, 0.08);
  color: #ff8ab6;
  border: 1px solid rgba(255, 138, 182, 0.15);
}
.share-btn:hover {
  background: #ff8ab6;
  color: #ffffff;
}

.capture-box {
  padding: 10px;
  border-radius: 16px;
  background: transparent;
}

.result-header { margin-bottom: 24px; text-align: center; }
.badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: #9b7cff;
  background: rgba(155, 124, 255, 0.08);
  padding: 4px 12px;
  border-radius: 999px;
  margin-bottom: 12px;
}
.result-header h2 { font-size: 26px; font-weight: 700; color: var(--text); margin: 0; }
.muted { font-size: 13px; color: #736077; margin-top: 8px; }

.loading-area { padding: 60px 20px; display: flex; flex-direction: column; align-items: center; }
.spinner { width: 44px; height: 44px; border: 4px solid rgba(155, 124, 255, 0.1); border-top-color: #9b7cff; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px; }
@keyframes spin { to { transform: rotate(360deg); } }

.map-section {
  width: 100%;
  height: 380px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(24,16,40,0.06);
  border: 1px solid rgba(155,124,255,0.08);
  margin-bottom: 28px;
}

.ai-report-card {
  background: linear-gradient(135deg, rgba(155, 124, 255, 0.04), rgba(255, 138, 182, 0.04));
  border-radius: 16px;
  border: 1px solid rgba(155, 124, 255, 0.12);
  padding: 22px;
  margin-bottom: 32px;
  text-align: left;
}
.report-title { font-size: 16px; font-weight: 700; color: var(--text); margin: 0 0 12px; border-left: 4px solid #9b7cff; padding-left: 8px; }
.ai-text-content { font-size: 14px; line-height: 1.65; color: #3b3042; white-space: pre-line; }

.places-section { text-align: left; margin-bottom: 32px; }
.section-title { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 16px; border-left: 4px solid #ff8ab6; padding-left: 8px; }
.places-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
@media (min-width: 768px) { .places-grid { grid-template-columns: repeat(2, 1fr); } }

.place-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 18px;
  border: 1px solid rgba(20, 14, 30, 0.04);
  box-shadow: 0 8px 24px rgba(24,16,40,0.04);
  cursor: pointer;
  transition: all 240ms ease;
}
.place-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(155, 124, 255, 0.08);
}

.category-tag { display: inline-block; font-size: 10px; font-weight: 700; color: #9b7cff; background: rgba(155, 124, 255, 0.08); padding: 2px 6px; border-radius: 4px; margin-bottom: 8px; }
.place-title { font-size: 15px; font-weight: 700; color: var(--text); margin: 0 0 6px; }
.place-addr, .place-tel { font-size: 12px; color: #736077; margin: 2px 0; }

.place-card.active-neon {
  border-color: #9b7cff !important;
  box-shadow: 0 0 15px rgba(155, 124, 255, 0.35), 0 4px 20px rgba(155, 124, 255, 0.1) !important;
  transform: translateY(-4px) scale(1.02);
  background: linear-gradient(180deg, #ffffff, rgba(155, 124, 255, 0.03)) !important;
}

.action-buttons { display: flex; gap: 12px; justify-content: center; margin-top: 24px; }
.btn-retry {
  background: linear-gradient(90deg, #9b7cff, #ff8ab6);
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(155, 124, 255, 0.2);
  transition: transform 200ms ease;
  margin-top: 16px;
}
.btn-retry:hover { transform: translateY(-2px); }
.btn-home {
  background: #f3f0f5;
  color: #4f4255;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 16px;
}
.btn-home:hover { background: #e6e1ea; }
</style>