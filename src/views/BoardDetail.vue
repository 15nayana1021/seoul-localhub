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

      <div v-if="post.image" class="detail-image-container">
        <img :src="post.image" alt="첨부 이미지" class="detail-image" />
      </div>

      <div class="detail-content">
        {{ post.content }}
      </div>

      <div class="share-section">
        <span class="share-title">📢 이 여행기 공유하기</span>
        <div class="share-buttons">
          <button @click="copyLink" class="btn-share copy-btn" title="링크 복사">
            🔗 링크 복사
          </button>
          <button @click="shareToTwitter" class="btn-share twitter-btn" title="X 공유">
            𝕏 공유
          </button>
          <button @click="shareToFacebook" class="btn-share facebook-btn" title="페이스북 공유">
            🔵 페이스북
          </button>
        </div>
      </div>

      <div class="comments-section">
        <h3 class="comments-title">💬 댓글 ({{ post.comments?.length || 0 }})</h3>
        
        <div class="comment-form">
          <div class="comment-form-row">
            <input 
              type="text" 
              v-model="newAuthor" 
              placeholder="익명 닉네임" 
              class="comment-input-author"
            />
          </div>
          <div class="comment-form-row">
            <textarea 
              v-model="newContent" 
              placeholder="따뜻한 댓글을 입력해 주세요." 
              class="comment-input-content"
            ></textarea>
          </div>
          <div class="comment-submit-row">
            <button @click="submitComment" class="btn-comment-submit">댓글 등록</button>
          </div>
        </div>

        <div class="comments-list" v-if="post.comments && post.comments.length > 0">
          <div v-for="comment in post.comments" :key="comment.id" class="comment-item">
            <div class="comment-item-header">
              <span class="comment-item-author">👤 {{ comment.author }}</span>
              <span class="comment-item-date">{{ formatCommentDate(comment.createdAt) }}</span>
            </div>
            <p class="comment-item-content">{{ comment.content }}</p>
          </div>
        </div>
        <div class="comments-empty" v-else>
          아직 등록된 댓글이 없습니다. 첫 댓글을 작성해 보세요!
        </div>
      </div>

      <div class="action-footer">
        <button @click="goList" class="btn-list">📋 목록보기</button>
        <button @click="openDeleteModal" class="btn-delete">❌ 삭제하기</button>
      </div>
    </div>

    <div class="card error-card" v-else>
      <span class="error-icon">⚠️</span>
      <h2>존재하지 않거나 삭제된 게시글입니다.</h2>
      <button @click="goList" class="btn-list">📋 목록으로 돌아가기</button>
    </div>

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
const showDeleteModal = ref(false)
const inputPassword = ref('')

const newAuthor = ref('')
const newContent = ref('')

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

const formatCommentDate = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const openDeleteModal = () => {
  inputPassword.value = ''
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
}

const handleDelete = () => {
  if (!inputPassword.value.trim()) {
    alert('비밀번호를 입력해 주세요!')
    return
  }

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

const copyLink = async () => {
  const currentUrl = window.location.href
  try {
    await navigator.clipboard.writeText(currentUrl)
    alert('게시글 링크가 클립보드에 복사되었습니다! 🔗\n원하는 곳에 붙여넣어 친구들에게 공유해 보세요.')
  } catch (err) {
    const textArea = document.createElement('textarea')
    textArea.value = currentUrl
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('게시글 링크가 복사되었습니다! 🔗')
  }
}

const shareToTwitter = () => {
  const text = `[서울 로컬허브] "${post.value.title}" 여행기를 확인해 보세요!`
  const url = window.location.href
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  window.open(twitterUrl, '_blank', 'width=600,height=400,noopener,noreferrer')
}

const shareToFacebook = () => {
  const url = window.location.href
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  window.open(facebookUrl, '_blank', 'width=600,height=400,noopener,noreferrer')
}

const submitComment = () => {
  if (!newAuthor.value.trim()) {
    alert('닉네임을 입력해 주세요!')
    return
  }
  if (!newContent.value.trim()) {
    alert('댓글 내용을 입력해 주세요!')
    return
  }

  const commentData = {
    id: Date.now(),
    author: newAuthor.value.trim(),
    content: newContent.value.trim(),
    createdAt: new Date().toISOString()
  }

  if (communityStore.addComment) {
    communityStore.addComment(post.value.id, commentData)
  } else {
    if (!post.value.comments) {
      post.value.comments = []
    }
    post.value.comments.push(commentData)
    if (communityStore.savePosts) {
      communityStore.savePosts()
    }
  }

  newAuthor.value = ''
  newContent.value = ''
}

onMounted(() => {
  const id = route.params.id
  const found = communityStore.getPostById(id)
  if (found) {
    post.value = found
    if (!post.value.comments) {
      post.value.comments = []
    }
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
  background: #f5f2f9;
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
  background: #ffffff;
  border-radius: 22px;
  padding: 36px;
  box-shadow: 0 14px 40px rgba(24, 16, 40, 0.08);
  border: 1px solid #ebdff5;
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

.detail-content {
  text-align: left;
  font-size: 15px;
  line-height: 1.8;
  color: #3b3042;
  white-space: pre-wrap;   
  word-break: break-all;   
  min-height: 150px;
}

.share-section {
  margin-top: 40px;
  padding: 20px;
  background: #faf8fd;
  border-radius: 16px;
  border: 1px solid #ebdff5;
  text-align: center;
}
.share-title {
  display: block;
  font-size: 13.5px;
  font-weight: 700;
  color: #615066;
  margin-bottom: 14px;
}
.share-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}
.btn-share {
  border: none;
  padding: 9px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}
.btn-share:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.copy-btn {
  background: #ffffff;
  color: #9b7cff;
  border: 1px solid rgba(155, 124, 255, 0.3);
}
.copy-btn:hover {
  background: rgba(155, 124, 255, 0.04);
  border-color: #9b7cff;
}
.twitter-btn {
  background: #111111;
  color: #ffffff;
}
.twitter-btn:hover {
  background: #2a2a2a;
}
.facebook-btn {
  background: #1877f2;
  color: #ffffff;
}
.facebook-btn:hover {
  background: #166fe5;
}

.comments-section {
  margin-top: 40px;
  border-top: 1px solid #ebdff5;
  padding-top: 30px;
  text-align: left;
}
.comments-title {
  font-size: 18px;
  font-weight: 700;
  color: #2f213f;
  margin-bottom: 20px;
}
.comment-form {
  background: #faf8fd;
  border: 1px solid #ebdff5;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 24px;
}
.comment-form-row {
  margin-bottom: 10px;
}
.comment-input-author {
  width: 180px;
  background: #ffffff;
  border: 1px solid #ebdff5;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  outline: none;
}
.comment-input-author:focus {
  border-color: #9b7cff;
}
.comment-input-content {
  width: 100%;
  height: 70px;
  background: #ffffff;
  border: 1px solid #ebdff5;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13.5px;
  line-height: 1.4;
  resize: none;
  outline: none;
  box-sizing: border-box;
}
.comment-input-content:focus {
  border-color: #9b7cff;
}
.comment-submit-row {
  display: flex;
  justify-content: flex-end;
}
.btn-comment-submit {
  background: linear-gradient(90deg, #9b7cff, #ff8ab6);
  color: #ffffff;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}
.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.comment-item {
  background: #ffffff;
  border: 1px solid #f0ecf5;
  border-radius: 12px;
  padding: 16px;
}
.comment-item-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.comment-item-author {
  font-size: 13.5px;
  font-weight: 700;
  color: #2f213f;
}
.comment-item-date {
  font-size: 11px;
  color: #b5a9ba;
}
.comment-item-content {
  font-size: 13.5px;
  color: #4f4255;
  margin: 0;
  line-height: 1.5;
  white-space: pre-wrap;
}
.comments-empty {
  text-align: center;
  padding: 30px 0;
  font-size: 13.5px;
  color: #b5a9ba;
}

.action-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
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