<template>
  <div class="p-10 text-center border mt-10">
    <h1 class="text-2xl font-bold">내 결과는?</h1>
    
    <p class="text-xl mt-4 text-blue-600 font-bold">
      {{ myResult }}
    </p>

    <button @click="saveData" class="mt-4 bg-blue-500 text-white p-2 rounded">
      결과 저장하기
    </button>
    
    <button @click="loadData" class="mt-4 bg-green-500 text-white p-2 rounded ml-2">
      결과 불러오기
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const myResult = ref('아직 아무것도 없어요');

// 저장하는 함수
const saveData = () => {
  localStorage.setItem('result', '서울 로컬 맛집 탐방가!');
  alert('저장 완료!');
};

// 불러오는 함수
const loadData = () => {
  const data = localStorage.getItem('result');
  if (data) {
    myResult.value = data;
  } else {
    myResult.value = '저장된 데이터가 없어요!';
  }
};
</script>

import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify' // 이 줄이 있어야 Vuetify가 작동합니다!

const app = createApp(App)
app.use(vuetify) // Vuetify를 Vue 앱에 연결하는 핵심 코드입니다.
app.mount('#app')