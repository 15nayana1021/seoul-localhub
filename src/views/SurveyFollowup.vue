<template>
  <div class="survey-root">
    <div class="card">
      <header class="card-head">
        <h1>추가 질문</h1>
        <p class="muted">여행 성향을 더 정확히 파악하기 위해 몇 가지 질문을 드립니다.</p>
      </header>

      <div class="progress-container">
        <div class="progress-bar-wrapper">
          <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <span class="progress-text">
          <strong>{{ currentStep + 1 }}</strong> / {{ questions.length }}
        </span>
      </div>

      <div class="question-box">
        <h2 class="question-title">{{ currentQuestion.title }}</h2>
        
        <div class="option-list">
          <button
            v-for="option in currentQuestion.options"
            :key="option"
            :class="['option-card', { active: answers[currentQuestion.id] === option }]"
            @click="selectOption(option)"
          >
            <span class="radio-circle"></span>
            <span class="option-text">{{ option }}</span>
          </button>
        </div>
      </div>

      <div class="navigation-buttons">
        <button class="btn-prev" @click="handlePrev">
          {{ currentStep === 0 ? '이전 단계' : '이전 질문' }}
        </button>
        <button 
          class="btn-next" 
          :disabled="!answers[currentQuestion.id]"
          @click="handleNext"
        >
          {{ currentStep === questions.length - 1 ? '제출' : '다음' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const questions = [
  {
    id: 'waiting',
    title: '맛집에 1시간 기다려도 괜찮다',
    options: ['O', 'X']
  },
  {
    id: 'vibe',
    title: '맛집 유형',
    options: ['관광객 맛집', '로컬 맛집']
  },
  {
    id: 'energy',
    title: '여행 스타일',
    options: ['다리 부서져도 2만 보', '숙소/카페 중심 5천 보']
  },
  {
    id: 'sns',
    title: '여행 중 인스타 스토리 10개 이상 올린다',
    options: ['O', 'X']
  },
  {
    id: 'placeType',
    title: '사람이 많더라도',
    options: ['유명한 관광지', '고즈넉한 동네 거리']
  }
]

const currentStep = ref(0)

const answers = ref({
  waiting: '',
  vibe: '',
  energy: '',
  sns: '',
  placeType: ''
})

const currentQuestion = computed(() => questions[currentStep.value])

const progressPercentage = computed(() => ((currentStep.value + 1) / questions.length) * 100)

const selectOption = (option) => {
  answers.value[currentQuestion.value.id] = option
  
  if (currentStep.value < questions.length - 1) {
    setTimeout(() => {
      currentStep.value++
    }, 300)
  }
}

const handlePrev = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  } else {
    router.push('/survey') //[cite: 4]
  }
}

const handleNext = () => {
  if (!answers.value[currentQuestion.value.id]) return

  if (currentStep.value < questions.length - 1) {
    currentStep.value++
  } else {
    submitSurvey()
  }
}

const submitSurvey = () => {
  localStorage.setItem('userPreferences', JSON.stringify(answers.value)) //[cite: 6]
  router.push('/result')
}
</script>

<style scoped>
.survey-root {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px 16px;
  background: linear-gradient(180deg, #fff6fb 0%, #fffdf8 60%);
}

.card {
  width: 100%;
  max-width: 600px;
  background: #ffffff;
  border-radius: 24px;
  padding: 36px;
  box-shadow: 0 18px 50px rgba(24, 16, 40, 0.05);
  border: 1px solid rgba(155, 124, 255, 0.08);
  box-sizing: border-box;
}

.card-head {
  text-align: center;
  margin-bottom: 24px;
}

.card-head h1 {
  margin: 0 0 6px;
  color: #2f213f;
  font-size: 28px;
  font-weight: 800;
}

.muted {
  margin: 0;
  color: #78647f;
  font-size: 13px;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 36px;
}
.progress-bar-wrapper {
  flex-grow: 1;
  height: 8px;
  background: #f0ebf8;
  border-radius: 99px;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #b286ff, #ff8ab6);
  border-radius: 99px;
  transition: width 0.3s ease;
}
.progress-text {
  font-size: 13px;
  color: #78647f;
  min-width: 35px;
  text-align: right;
}

.question-box {
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin-bottom: 32px;
}
.question-title {
  font-size: 19px;
  font-weight: 700;
  color: #3b2a49;
  margin-bottom: 28px;
  line-height: 1.4;
}

.option-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
}
.option-card {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 16px 20px;
  border-radius: 16px;
  border: 1px solid #e8dcf8;
  background: #fbf8ff;
  color: #4f3a61;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  transition: all 0.2s ease;
  text-align: left;
  outline: none;
}
.option-card:hover {
  background: #f5eeff;
  border-color: #d1bbf4;
}

.option-card.active {
  border-color: #9b7cff;
  background: rgba(155, 124, 255, 0.04);
  box-shadow: 0 0 12px rgba(155, 124, 255, 0.12);
}

.radio-circle {
  width: 18px;
  height: 18px;
  border: 2px solid #c0aee0;
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
  transition: all 0.2s;
  box-sizing: border-box;
}
.option-card.active .radio-circle {
  border-color: #9b7cff;
  background: #9b7cff;
}
.option-card.active .radio-circle::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  background: #ffffff;
  border-radius: 50%;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}
.btn-prev {
  background: #f3f0f5;
  color: #4f4255;
  border: none;
  padding: 12px 24px;
  border-radius: 14px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-prev:hover {
  background: #e6e1ea;
}
.btn-next {
  background: linear-gradient(90deg, #9b7cff, #ff8ab6);
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(155, 124, 255, 0.2);
  transition: transform 0.2s, opacity 0.2s;
}
.btn-next:hover:not(:disabled) {
  transform: translateY(-2px);
}
.btn-next:disabled {
  background: #ebdff0;
  color: #a394a8;
  box-shadow: none;
  cursor: not-allowed;
}
</style>