<template>
  <div class="board-container">
    <div class="blobs" aria-hidden="true">
      <div class="blob b1"></div>
      <div class="blob b2"></div>
    </div>

    <div class="card board-card">
      <header class="board-header">
        <span class="badge">COMMUNITY</span>
        <h2>💬 여행자 광장</h2>
        <p class="muted">서울을 여행하는 사람들의 생생한 후기와 정보 교환 공간입니다.</p>
      </header>

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

      <div class="posts-grid" v-if="posts.length > 0">
        <article
          v-for="post in posts"
          :key="post.id"
          @click="goDetail(post.id)"
          class="post-card"
        >
          <div class="post-layout">
            <div v-if="post.image" class="list-thumbnail-container">
              <img :src="post.image" alt="썸네일" class="list-thumbnail" />
            </div>

            <div class="post-body">
              <span class="category-tag">{{ getCategoryLabel(post.category) }}</span>
              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-excerpt">{{ truncateText(post.content, 80) }}</p>
              <p class="post-meta">
                📅 {{ formatDate(post.createdAt) }}
              </p>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="empty-state">
        <p class="muted">아직 이 카테고리에 작성된 게시글이 없습니다. 첫 번째 이야기를 들려주세요!</p>
      </div>

      <div class="write-action-container">
        <button @click="goWrite" class="btn-write">✍️ 새 글 쓰기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCommunityStore } from '../stores/community' // 🌟 실제 존재하는 community 스토어 로드!

const router = useRouter()
const communityStore = useCommunityStore() //

// Pinia에서 반응형으로 필터 카테고리 상태 가져오기
const { currentCategory } = storeToRefs(communityStore)

// 🌟 [핵심 해결!] 기존 템플릿의 'posts'가 에러 없이 작동하도록 computed로 바인딩합니다.
// community.js 내부의 filteredPosts를 참조하여 필터링 및 시간순 정렬이 자동 완성됩니다!
const posts = computed(() => communityStore.filteredPosts)

// 카테고리 탭 목록 구성 (중앙 데이터 필터 연동)
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
  communityStore.setCategory(tabValue) //
}

const getCategoryLabel = (cat) => {
  const labels = { 
    all: '전체',
    attraction: '관광지', 
    culture: '문화/예술', 
    festival: '축제/행사', 
    sports: '레포츠', 
    accommodation: '숙박', 
    shopping: '쇼핑' 
  }
  return labels[cat] || '일반'
}

// 본문 내용이 길 때 생략해주는 헬퍼 함수
const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

// 밀리초 타임스탬프를 년.월.일 포맷으로 안전하게 변경하는 함수
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
  max-width: 750px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 22px;
  padding: 32px;
  box-shadow: 0 14px 40px rgba(24,16,40,0.08);
  border: 1px solid rgba(155,124,255,0.08);
  backdrop-filter: blur(6px);
  position: relative;
  z-index: 2;
}

.board-header { text-align: center; margin-bottom: 24px; }
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
.board-header h2 { font-size: 26px; font-weight: 700; color: var(--text); margin: 0; }
.muted { font-size: 13px; color: #736077; margin-top: 8px; }

/* 📂 카테고리 탭 스타일링 */
.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 24px;
}
.tab-btn {
  background: #ffffff;
  border: 1px solid rgba(155, 124, 255, 0.15);
  color: #736077;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.tab-btn:hover, .tab-btn.active {
  background: linear-gradient(90deg, #9b7cff, #ff8ab6);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(155, 124, 255, 0.2);
}

/* 📋 목록 카드 디자인 */
.posts-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}
.post-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 18px;
  border: 1px solid rgba(24,16,40,0.04);
  box-shadow: 0 8px 24px rgba(24,16,40,0.03);
  cursor: pointer;
  transition: all 200ms ease;
}
.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(155, 124, 255, 0.08);
  border-color: rgba(155, 124, 255, 0.2);
}

/* 이미지 레이아웃 */
.post-layout {
  display: flex;
  gap: 18px;
  align-items: center;
}
.list-thumbnail-container {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.list-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-body {
  flex-grow: 1;
  text-align: left;
}
.category-tag {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  color: #ff8ab6;
  background: rgba(255, 138, 182, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
  margin-bottom: 6px;
}
.post-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 6px;
}
.post-excerpt {
  font-size: 13px;
  color: #736077;
  margin: 0 0 8px;
  line-height: 1.4;
}
.post-meta {
  font-size: 11px;
  color: #a394a8;
  margin: 0;
}

.empty-state {
  padding: 48px 20px;
  text-align: center;
  border: 1px dashed rgba(155, 124, 255, 0.15);
  border-radius: 14px;
  margin-bottom: 24px;
}

.write-action-container {
  display: flex;
  justify-content: flex-end;
}
.btn-write {
  background: linear-gradient(90deg, #9b7cff, #ff8ab6);
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(155, 124, 255, 0.15);
  transition: transform 200ms ease;
}
.btn-write:hover {
  transform: translateY(-2px);
}
</style>