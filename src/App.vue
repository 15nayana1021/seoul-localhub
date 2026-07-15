<template>
  <div class="app-root">
    <nav class="p-4">
      <RouterLink to="/" class="nav-link">홈</RouterLink>
      <RouterLink to="/survey" class="nav-link">설문지</RouterLink>
      <RouterLink to="/board" class="nav-link">게시판 목록</RouterLink>
      <RouterLink to="/board/write" class="nav-link">글쓰기</RouterLink>
    </nav>

    <div class="p-4">
      <RouterView />
    </div>

    <TravelChatbot />
  </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router';
import TravelChatbot from './components/TravelChatbot.vue'; // 정상적으로 가져오고 있습니다!
</script>

<style>
.app-root {
  min-height: 100vh;
  background: linear-gradient(180deg, var(--bg-1, #fffaf6), #fffdf8);
  font-family: var(--sans, system-ui, -apple-system, sans-serif);
  display:flex;
  flex-direction:column;
  align-items:stretch;
}
nav.p-4 {
  display:flex;
  gap:12px;
  justify-content:center;
  padding:18px;
  background: linear-gradient(90deg, rgba(255,255,255,0.35), rgba(255,255,255,0.12));
  backdrop-filter: blur(6px);
  border-bottom: 1px solid rgba(155,124,255,0.07);
}

/* 💡 [스타일 보존] '.nav-link' 클래스로 선택자를 수정하여 
   팀원 A님이 깎아둔 세련된 그라데이션 라운드 버튼 디자인을 그대로 살렸습니다. */
nav.p-4 .nav-link {
  background: linear-gradient(90deg,#9b7cff,#ff8ab6);
  color:#fff;
  text-decoration: none; /* <a> 태그의 기본 밑줄 제거 */
  padding:8px 14px;
  border-radius:999px;
  cursor:pointer;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  transition: opacity 0.2s ease, transform 0.1s ease;
}

nav.p-4 .nav-link:hover {
  opacity: 0.9;
}

nav.p-4 .nav-link:active {
  transform: scale(0.97);
}

/* 🌟 [보너스 효과] 현재 머무르고 있는 활성화 페이지의 메뉴 버튼만 자동으로 부각해주는 라우터 활성 효과 추가 */
nav.p-4 .router-link-active {
  box-shadow: 0 4px 12px rgba(155,124,255,0.35);
  filter: brightness(1.05);
}

.p-4 { padding: 1rem; }
</style>