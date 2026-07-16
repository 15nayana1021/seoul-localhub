<template>
  <div class="survey-container">
    <div class="blobs" aria-hidden="true">
      <div class="blob b1"></div>
      <div class="blob b2"></div>
    </div>

    <div v-if="currentStep < questions.length" class="card survey-card">
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressPercent + '%' }"></div>
      </div>
      
      <span class="q-badge">질문 {{ currentStep + 1 }} / {{ questions.length }}</span>
      <h3 class="question-text">{{ currentQuestion.text }}</h3>

      <div class="options-list">
        <button 
          v-for="(option, idx) in currentQuestion.options" 
          :key="idx" 
          @click="selectOption(currentQuestion.key, option.value)"
          class="option-btn"
        >
          {{ option.text }}
        </button>
      </div>
    </div>

    <div v-else class="card loading-card">
      <div class="spinner"></div>
      <h3>당신의 서울 여행 성향을 분석 중입니다...</h3>
      <p class="muted">서울의 공공데이터와 매핑하여 최상의 당일치기 코스를 생성하고 있습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const questions = [
  {
    key: 'waiting',
    text: '인기 맛집을 발견했다! 하지만 대기 줄이 엄청나다면?',
    options: [
      { text: '줄이 길어도 상관없어! 무조건 대기하고 먹는다 (YES)', value: 'YES' },
      { text: '기다리는 시간은 아깝다! 한산하고 조용한 근처 맛집을 찾는다 (NO)', value: 'NO' }
    ]
  },
  {
    key: 'vibe',
    text: '선호하는 식사 장소나 주변 맛집 분위기는?',
    options: [
      { text: 'SNS에서 화제되고 유명 관광객들이 가득한 핫플레이스 맛집', value: '관광객 맛집' },
      { text: '동네 주민들만 아는 깊고 아기자기한 골목 로컬 맛집', value: '로컬 맛집' }
    ]
  },
  {
    key: 'energy',
    text: '이번 여행에서 내가 소화할 수 있는 활동성과 에너지량은?',
    options: [
      { text: '2만 보는 기본! 아침부터 저녁까지 꽉 채운 랜드마크 마스터 투어', value: '2만 보 랜드마크 투어' },
      { text: '체력 아끼며 힐링 위주로! 5천 보 이하로 느리게 쉬엄쉬엄 여행', value: '5천 보 쉬엄쉬엄 여행' }
    ]
  },
  {
    key: 'sns',
    text: '여행지를 고를 때 인스타그램이나 SNS 업로드 여부가 중요한가요?',
    options: [
      { text: '인생샷 건지는 비주얼 명소나 감성 포토존 위주가 최고! (YES)', value: 'YES' },
      { text: '사진보다는 장소 고유의 쾌적함과 고요한 실속형 힐링 중심! (NO)', value: 'NO' }
    ]
  },
  {
    key: 'placeType',
    text: '내가 좀 더 마음 편하게 다닐 수 있는 공간 스타일은?',
    options: [
      { text: '대형 현대식 쇼핑몰이나 복잡하지만 볼거리 많은 초대형 유명 관광지', value: '유명 관광지' },
      { text: '서정적이고 아기자기한 전통 골목길이나 조용하고 고즈넉한 동네', value: '고즈넉한 동네' }
    ]
  }
]

const currentStep = ref(0)
const answers = ref({})

const currentQuestion = computed(() => questions[currentStep.value])
const progressPercent = computed(() => (currentStep.value / questions.length) * 100)

const selectOption = (key, value) => {
  answers.value[key] = value
  
  if (currentStep.value < questions.length - 1) {
    currentStep.value++
  } else {
    currentStep.value++
    localStorage.setItem('userPreferences', JSON.stringify(answers.value))
    
    setTimeout(() => {
      router.push('/result')
    }, 1500)
  }
}
</script>

<style scoped>
.survey-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
  background: linear-gradient(180deg, #fff6fb 0%, #fffdf8 60%);
  position: relative;
  overflow: hidden;
  font-family: 'Noto Sans KR', sans-serif;
  color: var(--text);
}

.blobs { position: absolute; inset: 0; pointer-events: none; }
.blob { position: absolute; filter: blur(36px); opacity: 0.95; }
.b1 { width: 360px; height: 360px; left: -80px; top: -60px; background: radial-gradient(circle at 30% 30%, rgba(155,124,255,0.4), transparent 40%); }
.b2 { width: 280px; height: 280px; right: -60px; top: 40px; background: radial-gradient(circle at 30% 30%, rgba(255,138,182,0.25), transparent 40%); }

.card {
  width: 100%;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 22px;
  padding: 32px;
  box-shadow: 0 14px 40px rgba(24,16,40,0.08);
  border: 1px solid rgba(155,124,255,0.08);
  backdrop-filter: blur(6px);
  position: relative;
  z-index: 2;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 24px;
}
.progress {
  height: 100%;
  background: linear-gradient(90deg, #9b7cff, #ff8ab6);
  transition: width 0.3s ease;
}

.q-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: #9b7cff;
  background: rgba(155, 124, 255, 0.08);
  padding: 4px 12px;
  border-radius: 999px;
  margin-bottom: 12px;
}

.question-text {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.45;
  margin: 0 0 28px;
  text-align: left;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.option-btn {
  background: #ffffff;
  border: 1px solid rgba(155, 124, 255, 0.12);
  padding: 16px 20px;
  border-radius: 12px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  cursor: pointer;
  transition: all 200ms ease;
}
.option-btn:hover {
  border-color: #9b7cff;
  background: rgba(155, 124, 255, 0.04);
  transform: translateY(-2px);
}

.loading-card {
  text-align: center;
  padding: 64px 32px;
}
.spinner {
  width: 44px;
  height: 44px;
  border: 4px solid rgba(155, 124, 255, 0.1);
  border-top-color: #9b7cff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
}
@keyframes spin { to { transform: rotate(360deg); } }
.muted { font-size: 13px; color: #736077; margin-top: 8px; }
</style>