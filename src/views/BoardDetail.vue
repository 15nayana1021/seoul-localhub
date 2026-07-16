<template>
  <div class="detail-container">
    <div class="blobs" aria-hidden="true">
      <div class="blob b1"></div>
      <div class="blob b2"></div>
    </div>

    <div class="card detail-card" v-if="post">
      <header class="detail-header">
        <span class="category-badge">{{ getCategoryLabel(post.category) }}</span>
        <h2 class="detail-title">{{ post.title }}</h2>
        <p class="detail-meta">
          <span>📅 {{ formatDate(post.createdAt) }}</span>
        </p>
      </header>

      <hr class="divider" />

      <!-- 첨부 이미지 영역 -->
      <div v-if="post.image" class="detail-image-container">
        <img :src="post.image" alt="첨부 이미지" class="detail-image" />
      </div>

      <!-- 🌟 [해결] 본문 텍스트 박스: 엔터 줄바꿈과 장문 줄바꿈 자동 적용 완료 -->
      <div class="detail-content">
        {{ post.content }}
      </div>

      <!-- 하단 제어 바 -->
      <div class="action-footer">
        <button @click="goList" class="btn-list">📋 목록보기</button>
        <button @click="openDeleteModal" class="btn-delete">❌ 삭제하기</button>
      </div>
    </div>

    <!-- 글이 존재하지 않을 때 -->
    <div class="card error-card" v-else>
      <span class="error-icon">⚠️</span>
      <h2>존재하지 않거나 삭제된 게시글입니다.</h2>
      <button @click="goList" class="btn-list">📋 목록으로 돌아가기</button>
    </div>

    <!-- 🔒 익명 삭제용 패스워드 검증 모달 창 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="modal-card">
        <h3>🔑 글 삭제 인증</h3>
        <p class="modal-desc">글을 등록할 때 설정했던 익명 비밀번호를 기입해 주세요.</p>
        
        <input 
          type="password" 
          v-model="inputPassword" 
          placeholder="비밀번호 입력" 
          class="modal-input"
          @keyup.enter="handleDelete"
        />

        <div class="modal-actions">
          <button @click="closeDeleteModal" class="btn-modal-cancel">취소</button>
          <button @click="handleDelete" class="btn-modal-confirm">인증 및 삭제</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCommunityStore } from '../stores/community'

const route = useRoute()
const router = useRouter()
const communityStore = useCommunityStore()

const post = ref(null)

// 모달 제어 상태
const showDeleteModal = ref(false)
const inputPassword = ref('')

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

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const openDeleteModal = () => {
  inputPassword.value = ''
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
}

// 🌟 비밀번호 대조 후 실제 데이터 삭제 핸들링
const handleDelete = () => {
  if (!inputPassword.value.trim()) {
    alert('비밀번호를 입력해 주세요!')
    return
  }

  // Pinia Store 내의 deletePost 액션으로 검증 호출
  const result = communityStore.deletePost(post.value.id, inputPassword.value)

  if (result.success) {
    alert('게시글이 깔끔하게 삭제되었습니다. 💨')
    showDeleteModal.value = false
    router.push('/board')
  } else {
    alert(result.message || '비밀번호가 일치하지 않습니다. 다시 확인해 주세요!')
  }
}

const goList = () => {
  router.push('/board')
}

onMounted(() => {
  const id = route.params.id
  const found = communityStore.getPostById(id)
  if (found) {
    post.value = found
  }
})
</script>

<style scoped>
.detail-container {
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
  max-width: 700px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 22px;
  padding: 36px;
  box-shadow: 0 14px 40px rgba(24,16,40,0.08);
  border: 1px solid rgba(155,124,255,0.08);
  backdrop-filter: blur(6px);
  position: relative;
  z-index: 2;
}

.error-card { text-align: center; padding: 60px 20px; }
.error-icon { font-size: 48px; display: block; margin-bottom: 20px; }

.detail-header {
  text-align: left;
}
.category-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: #ff8ab6;
  background: rgba(255, 138, 182, 0.08);
  padding: 4px 12px;
  border-radius: 999px;
  margin-bottom: 12px;
}
.detail-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 12px;
}
.detail-meta {
  font-size: 12px;
  color: #a394a8;
  margin: 0;
}

.divider {
  border: 0;
  height: 1px;
  background: rgba(155, 124, 255, 0.1);
  margin: 20px 0;
}

.detail-image-container {
  width: 100%;
  max-height: 450px;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 24px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}
.detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 🌟 줄바꿈 및 한글 줄넘김 방지 핵심 CSS 스타일링 기법 적용 */
.detail-content {
  text-align: left;
  font-size: 15px;
  line-height: 1.8;
  color: #3b3042;
  white-space: pre-wrap;   /* 엔터 개행 보존 구현 */
  word-break: break-all;   /* 긴 영단어 및 가로 한계 돌파 방지 */
  min-height: 150px;
}

.action-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 36px;
  border-top: 1px solid rgba(155, 124, 255, 0.08);
  padding-top: 20px;
}
.btn-list {
  background: #f3f0f5;
  color: #4f4255;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}
.btn-delete {
  background: rgba(255, 107, 107, 0.08);
  color: #ff6b6b;
  border: 1px solid rgba(255, 107, 107, 0.2);
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-delete:hover {
  background: #ff6b6b;
  color: white;
}

/* 🔒 패스워드 팝업 모달 CSS */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(24, 16, 40, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}
.modal-card {
  width: 90%;
  max-width: 400px;
  background: #ffffff;
  padding: 28px;
  border-radius: 20px;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.15);
  text-align: center;
}
.modal-card h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 10px;
  color: var(--text);
}
.modal-desc {
  font-size: 13px;
  color: #736077;
  line-height: 1.5;
  margin: 0 0 20px;
}
.modal-input {
  width: 100%;
  background: #fbf8ff;
  border: 1px solid #e8dcf8;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  text-align: center;
  outline: none;
  margin-bottom: 20px;
  box-sizing: border-box;
}
.modal-input:focus {
  border-color: #9b7cff;
}
.modal-actions {
  display: flex;
  gap: 10px;
}
.btn-modal-cancel {
  flex: 1;
  background: #f3f0f5;
  color: #4f4255;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}
.btn-modal-confirm {
  flex: 1;
  background: linear-gradient(90deg, #9b7cff, #ff8ab6);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}
</style>