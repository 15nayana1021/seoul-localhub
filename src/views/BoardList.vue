<template>
  <div class="board-container">
    <div class="blobs" aria-hidden="true">
      <div class="blob b1"></div>
      <div class="blob b2"></div>
    </div>

    <div class="card board-card">
      <div class="board-hero">
        <img 
          :src="plazaImg" 
          alt="Gwanghwamun Plaza Seoul" 
          class="hero-bg-img" 
        />
        <div class="hero-overlay"></div>
        <div class="hero-text-content">
          <span class="badge-hero">SEOUL TRAVEL HUB</span>
          <h2>💬 여행자 광장</h2>
          <p>서울을 누비는 여행자들의 생생한 발걸음과 꿀팁이 머무는 곳</p>
        </div>
      </div>

      <div class="category-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.value"
          :class="['tab-btn', { active: currentCategory === tab.value }]"
          @click="changeTab(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>

      <transition name="list-fade" mode="out-in">
        <div class="posts-grid" v-if="posts.length > 0" :key="currentCategory">
          <article
            v-for="post in posts"
            :key="post.id"
            @click="goDetail(post.id)"
            class="post-card"
          >
            <div class="post-layout">
              <div v-if="post.image" class="list-thumbnail-container">
                <img 
                  :src="post.image" 
                  alt="썸네일" 
                  class="list-thumbnail" 
                />
              </div>

              <div class="post-body">
                <div class="post-top-info">
                  <span :class="['category-tag', post.category]">{{ getCategoryLabel(post.category) }}</span>
                  <span class="author-badge">👤 {{ post.author || '익명 여행자' }}</span>
                </div>
                
                <h3 class="post-title">{{ post.title }}</h3>
                <p class="post-excerpt">{{ truncateText(post.content, 120) }}</p>
                
                <div class="post-meta-footer">
                  <span class="meta-item">📅 {{ formatDate(post.createdAt) }}</span>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="empty-state" :key="'empty-' + currentCategory">
          <div class="empty-icon">📂</div>
          <p class="muted">아직 이 카테고리에 작성된 게시글이 없습니다.<br>첫 번째 이야기의 주인공이 되어보세요!</p>
        </div>
      </transition>

      <div class="write-action-container">
        <button @click="goWrite" class="btn-write">
          <span class="btn-icon">✍️</span> 새 글 쓰기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCommunityStore } from '../stores/community'

import plazaImg from '../assets/images/gwanghwa.jpg'

const router = useRouter()
const communityStore = useCommunityStore()

const { currentCategory } = storeToRefs(communityStore)
const posts = computed(() => communityStore.filteredPosts)

const tabs = [
  { label: '전체', value: 'all' },
  { label: '관광지', value: 'attraction' },
  { label: '문화/예술', value: 'culture' },
  { label: '축제/행사', value: 'festival' },
  { label: '레포츠', value: 'sports' },
  { label: '숙박', value: 'accommodation' },
  { label: '쇼핑', value: 'shopping' }
]

const changeTab = (tabValue) => {
  communityStore.setCategory(tabValue)
}

const getCategoryLabel = (cat) => {
  const labels = { 
    all: '일반',
    attraction: '관광지', 
    culture: '문화/예술', 
    festival: '축제/행사', 
    sports: '레포츠', 
    accommodation: '숙박', 
    shopping: '쇼핑' 
  }
  return labels[cat] || '일반'
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

const goDetail = (id) => {
  router.push(`/board/${id}`)
}

const goWrite = () => {
  router.push('/board/write')
}
</script>

<style scoped>
.board-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: #f5f2f9;
  position: relative;
  overflow: hidden;
  font-family: 'Noto Sans KR', sans-serif;
  color: #2f213f;
}

.blobs { position: absolute; inset: 0; pointer-events: none; }
.blob { position: absolute; filter: blur(40px); opacity: 0.9; }
.b1 { width: 400px; height: 400px; left: -100px; top: -100px; background: radial-gradient(circle at 30% 30%, rgba(155,124,255,0.35), transparent 50%); }
.b2 { width: 350px; height: 350px; right: -80px; top: 80px; background: radial-gradient(circle at 30% 30%, rgba(255,138,182,0.25), transparent 50%); }

.card {
  width: 100%;
  max-width: 780px;
  background: #ffffff;
  border-radius: 26px;
  padding: 0 40px 40px; 
  box-shadow: 0 16px 45px rgba(24, 16, 40, 0.08);
  border: 1px solid #ebdff5;
  backdrop-filter: blur(8px);
  position: relative;
  z-index: 2;
  overflow: hidden;
}

.board-hero {
  position: relative;
  width: calc(100% + 80px);
  margin-left: -40px;
  height: 200px;
  overflow: hidden;
  margin-bottom: 28px;
}
.hero-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(35, 23, 48, 0.1) 0%, rgba(35, 23, 48, 0.6) 100%);
}
.hero-text-content {
  position: absolute;
  bottom: 24px;
  left: 40px;
  right: 40px;
  text-align: left;
  color: #ffffff;
}
.badge-hero {
  display: inline-block;
  font-size: 10px;
  font-weight: 800;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(4px);
  padding: 4px 10px;
  border-radius: 4px;
  margin-bottom: 8px;
  letter-spacing: 0.8px;
}
.hero-text-content h2 {
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 6px;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.15);
}
.hero-text-content p {
  font-size: 13px;
  margin: 0;
  opacity: 0.9;
  font-weight: 500;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 32px;
}
.tab-btn {
  background: #ffffff;
  border: 1px solid rgba(155, 124, 255, 0.2); 
  color: #615066;
  padding: 9px 18px;
  border-radius: 999px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 2px 6px rgba(155, 124, 255, 0.02);
}
.tab-btn:hover, .tab-btn.active {
  background: linear-gradient(90deg, #9b7cff, #ff8ab6);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 6px 16px rgba(155, 124, 255, 0.22);
  transform: translateY(-1px);
}

.posts-grid {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 28px;
}

.post-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 22px;
  border: 1px solid #ebdff5;
  box-shadow: 0 6px 16px rgba(155, 124, 255, 0.04); 
  cursor: pointer;
  transition: all 280ms cubic-bezier(0.16, 1, 0.3, 1);
}
.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(155, 124, 255, 0.12); 
  border-color: #9b7cff; 
}

.post-layout {
  display: flex;
  gap: 22px;
  align-items: center;
}

.list-thumbnail-container {
  width: 95px;
  height: 95px;
  border-radius: 14px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.06);
  position: relative;
}
.list-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.post-card:hover .list-thumbnail {
  transform: scale(1.06);
}

.post-body {
  flex-grow: 1;
  text-align: left;
  display: flex;
  flex-direction: column;
}

.post-top-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.category-tag {
  display: inline-block;
  font-size: 10.5px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
}
.category-tag.all { color: #736077; background: #f0ecf2; }
.category-tag.attraction { color: #2f66ff; background: rgba(47, 102, 255, 0.08); }
.category-tag.culture { color: #9b7cff; background: rgba(155, 124, 255, 0.08); }
.category-tag.festival { color: #ff7e42; background: rgba(255, 126, 66, 0.08); }
.category-tag.sports { color: #10b981; background: rgba(16, 185, 129, 0.08); }
.category-tag.accommodation { color: #ff5c75; background: rgba(255, 92, 117, 0.08); }
.category-tag.shopping { color: #06b6d4; background: rgba(6, 182, 212, 0.08); }

.author-badge {
  font-size: 11.5px;
  color: #a394a8;
  font-weight: 500;
}

.post-title {
  font-size: 17px;
  font-weight: 800;
  color: #231730;
  margin: 0 0 6px;
  transition: color 0.2s;
}
.post-card:hover .post-title {
  color: #9b7cff;
}

.post-excerpt {
  font-size: 13.5px;
  color: #5e4f63;
  margin: 0 0 10px;
  line-height: 1.5;
}

.post-meta-footer {
  display: flex;
  align-items: center;
  font-size: 11.5px;
  color: #b5a9ba;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
  border: 2px dashed rgba(155, 124, 255, 0.12);
  border-radius: 20px;
  margin-bottom: 28px;
  background: rgba(155, 124, 255, 0.01);
}
.empty-icon {
  font-size: 40px;
  margin-bottom: 12px;
  opacity: 0.6;
}

.write-action-container {
  display: flex;
  justify-content: flex-end;
}
.btn-write {
  background: linear-gradient(90deg, #9b7cff, #ff8ab6);
  color: #ffffff;
  border: none;
  padding: 13px 26px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 14.5px;
  cursor: pointer;
  box-shadow: 0 8px 22px rgba(155, 124, 255, 0.25);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  gap: 6px;
}
.btn-write:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 26px rgba(155, 124, 255, 0.35);
}
.btn-icon {
  font-size: 16px;
}

.list-fade-enter-active,
.list-fade-leave-active {
  transition: opacity 0.25s ease-out, transform 0.25s ease-out;
}

.list-fade-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.list-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>