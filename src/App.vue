<template>
  <div class="app-root">
    <nav class="p-4">
      <RouterLink to="/" class="nav-link">{{ langStore.t('home') }}</RouterLink>
      <RouterLink to="/survey" class="nav-link">{{ langStore.t('survey') }}</RouterLink>
      <RouterLink to="/board" class="nav-link">{{ langStore.t('board') }}</RouterLink>
      <RouterLink to="/board/write" class="nav-link">{{ langStore.t('write') }}</RouterLink>
      
      <button @click="langStore.toggleLanguage" class="btn-lang-toggle">
        🌐 {{ langStore.t('toggleBtn') }}
      </button>
    </nav>

    <div class="p-4">
      <RouterView v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </div>

    <TravelChatbot />
  </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { useLanguageStore } from './stores/language'
import TravelChatbot from './components/TravelChatbot.vue'

const langStore = useLanguageStore()
</script>

<style>
.app-root {
  min-height: 100vh;
  background: linear-gradient(180deg, var(--bg-1, #fffaf6), #fffdf8);
  font-family: var(--sans, system-ui, -apple-system, sans-serif);
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
nav.p-4 {
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  padding: 18px;
  background: linear-gradient(90deg, rgba(255,255,255,0.35), rgba(255,255,255,0.12));
  backdrop-filter: blur(6px);
  border-bottom: 1px solid rgba(155,124,255,0.07);
}

nav.p-4 .nav-link {
  background: linear-gradient(90deg, #9b7cff, #ff8ab6);
  color: #fff;
  text-decoration: none;
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
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

.btn-lang-toggle {
  background: #ffffff;
  border: 1px solid rgba(155, 124, 255, 0.2);
  color: #615066;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(155, 124, 255, 0.05);
}

.btn-lang-toggle:hover {
  background: #fdfbff;
  border-color: #9b7cff;
  transform: translateY(-1px);
}

.p-4 { padding: 1rem; }

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>