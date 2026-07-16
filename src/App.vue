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
import TravelChatbot from './components/TravelChatbot.vue';
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

nav.p-4 .nav-link {
  background: linear-gradient(90deg,#9b7cff,#ff8ab6);
  color:#fff;
  text-decoration: none;
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

nav.p-4 .router-link-active {
  box-shadow: 0 4px 12px rgba(155,124,255,0.35);
  filter: brightness(1.05);
}

.p-4 { padding: 1rem; }
</style>