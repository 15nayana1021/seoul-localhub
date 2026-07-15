<template>
  <div class="survey-root">
    <div class="card">
      <header class="card-head">
        <h1>여행 정보 입력</h1>
        <p>먼저 여행 기본 정보를 입력해 주세요.</p>
      </header>

      <div class="survey-form">
        <SurveyDateSection
          :startDate="startDate"
          :endDate="endDate"
          :stayText="stayText"
          @update:startDate="startDate = $event"
          @update:endDate="endDate = $event"
        />

        <SurveyOptionSection
          title="성별"
          :options="['남성', '여성', '기타']"
          :modelValue="gender"
          groupName="gender"
          @update:modelValue="gender = $event"
        />

        <SurveyOptionSection
          title="나이대"
          :options="['10대', '20대', '30대', '40대', '50대 이상']"
          :modelValue="ageGroup"
          groupName="age"
          @update:modelValue="ageGroup = $event"
        />

        <SurveyOptionSection
          title="동행인"
          :options="['혼자', '친구', '가족', '연인', '동료']"
          :modelValue="companion"
          groupName="companion"
          @update:modelValue="companion = $event"
        />

        <SurveyMbtiSection v-model="mbti" />
      </div>

      <div class="submit-btn-wrapper">
        <button class="submit-btn" @click="submitSurvey">다음</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import SurveyDateSection from './SurveyDateSection.vue';
import SurveyOptionSection from './SurveyOptionSection.vue';
import SurveyMbtiSection from './SurveyMbtiSection.vue';

const router = useRouter();

const startDate = ref('');
const endDate = ref('');
const gender = ref('');
const ageGroup = ref('');
const companion = ref('');
const mbti = ref('');

const stayText = computed(() => {
  if (!startDate.value || !endDate.value) return '출발일과 도착일을 선택해 주세요.';

  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return '날짜를 올바르게 선택해 주세요.';
  }

  if (end < start) {
    return '도착일은 출발일 이후여야 합니다.';
  }

  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
  if (diff <= 0) {
    return '당일 여행입니다.';
  }

  return `${diff}박 ${diff + 1}일`;
});

watch([startDate, endDate], () => {
  if (!startDate.value || !endDate.value) return;
  if (new Date(endDate.value) < new Date(startDate.value)) {
    endDate.value = '';
  }
});

const submitSurvey = () => {
  // 필수 선택값 예외 처리 (선택 안 하면 넘어가기 방지)
  if (!startDate.value || !endDate.value || !gender.value || !ageGroup.value || !companion.value) {
    alert('모든 여행 정보를 빠짐없이 선택 및 입력해 주세요! 😊');
    return;
  }

  const surveyData = {
    startDate: startDate.value,
    endDate: endDate.value,
    gender: gender.value,
    ageGroup: ageGroup.value,
    companion: companion.value,
    mbti: mbti.value || '알 수 없음',
    stayText: stayText.value
  };

  // 로컬스토리지에 안전하게 1단계 데이터 저장
  localStorage.setItem('surveyData', JSON.stringify(surveyData)); //
  
  // 🌟 2단계 성향 질문 페이지(followup)로 유연하게 이동
  router.push({ name: 'survey-followup' }); //
};
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
  max-width: 680px; /* 좀 더 아기자기한 폭으로 조절 */
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 18px 50px rgba(24, 16, 40, 0.05);
  border: 1px solid rgba(155, 124, 255, 0.08);
  position: relative;
}

.card-head {
  text-align: center;
  margin-bottom: 28px;
}

.card-head h1 {
  margin: 0 0 6px;
  color: #2f213f;
  font-size: 32px;
  font-weight: 800;
}

.card-head p {
  margin: 0;
  color: #78647f;
  font-size: 14px;
}

.survey-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 🌟 이미지처럼 버튼을 오른쪽 아래에 배치하기 위한 컨테이너 */
.submit-btn-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

.submit-btn {
  border: none;
  border-radius: 20px;
  padding: 12px 28px;
  background: linear-gradient(90deg, #b286ff, #ff8ab6);
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(178, 134, 255, 0.35);
  transition: transform 0.2s, opacity 0.2s;
}

.submit-btn:hover {
  transform: translateY(-2px);
  opacity: 0.95;
}
.submit-btn:active {
  transform: scale(0.98);
}
</style>  