<template>
  <div class="write-container">
    <div class="blobs" aria-hidden="true">
      <div class="blob b1"></div>
      <div class="blob b2"></div>
    </div>

    <div class="card write-card">
      <header class="write-header">
        <span class="badge">COMMUNITY</span>
        <h2>✍️ 여행 이야기 기록하기</h2>
        <p class="muted">서울 여행의 소중한 추억과 꿀팁을 공유해 주세요.</p>
      </header>

      <form @submit.prevent="handleSubmit" class="write-form">
        <div class="form-group">
          <label for="category">카테고리</label>
          <select id="category" v-model="category" class="select-input" required>
            <option value="all">일반/전체</option>
            <option value="attraction">관광지</option>
            <option value="culture">문화/예술</option>
            <option value="festival">축제/행사</option>
            <option value="sports">레포츠</option>
            <option value="accommodation">숙박</option>
            <option value="shopping">쇼핑</option>
          </select>
        </div>

        <div class="form-group">
          <label for="title">제목</label>
          <input 
            type="text" 
            id="title" 
            v-model="title" 
            placeholder="제목을 입력해 주세요 (최대 30자)" 
            maxlength="30"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">수정/삭제 비밀번호</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="수정 및 삭제 시 인증에 사용할 비밀번호" 
            required
          />
        </div>

        <div class="form-group">
          <label>사진 첨부</label>
          <div class="file-upload-wrapper">
            <input 
              type="file" 
              id="image-input" 
              accept="image/*" 
              @change="handleImageUpload" 
              style="display: none;"
            />
            <button 
              type="button" 
              class="btn-file-select" 
              @click="triggerFileInput"
            >
              🖼️ 사진 선택하기
            </button>
            <span v-if="imageName" class="file-name">{{ imageName }}</span>
          </div>

          <div v-if="imagePreview" class="preview-container">
            <img :src="imagePreview" alt="미리보기" class="image-preview" />
            <button type="button" class="btn-remove-img" @click="removeImage">❌ 삭제</button>
          </div>
        </div>

        <div class="form-group">
          <label for="content">내용</label>
          <textarea 
            id="content" 
            v-model="content" 
            rows="8" 
            placeholder="따뜻한 여행 후기나 유용한 정보들을 자유롭게 적어주세요." 
            required
          ></textarea>
        </div>

        <div class="action-buttons">
          <button type="button" @click="goBack" class="btn-back">취소</button>
          <button type="submit" class="btn-submit">등록하기</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCommunityStore } from '../stores/community' //

const router = useRouter()
const communityStore = useCommunityStore() //

const title = ref('')
const content = ref('')
const category = ref('all')
const password = ref('')

const imagePreview = ref('')
const imageName = ref('')

const triggerFileInput = () => {
  document.getElementById('image-input').click()
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    alert('이미지 파일은 최대 2MB까지만 업로드할 수 있습니다.')
    event.target.value = ''
    return
  }

  imageName.value = file.name

  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  imagePreview.value = ''
  imageName.value = ''
  document.getElementById('image-input').value = ''
}

const handleSubmit = () => {
  if (!title.value.trim() || !content.value.trim() || !password.value.trim()) return

  // 🌟 [해결] createPost 메서드명 일치 및 세부 필수 오브젝트 데이터 전송!
  communityStore.createPost({
    title: title.value,
    content: content.value,
    password: password.value,
    category: category.value,
    image: imagePreview.value // community.js에 추가한 이미지 속성
  })

  router.push('/board')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.write-container {
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
  max-width: 650px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 22px;
  padding: 32px;
  box-shadow: 0 14px 40px rgba(24,16,40,0.08);
  border: 1px solid rgba(155,124,255,0.08);
  backdrop-filter: blur(6px);
  position: relative;
  z-index: 2;
}

.write-header { text-align: center; margin-bottom: 24px; }
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
.write-header h2 { font-size: 24px; font-weight: 700; color: var(--text); margin: 0; }
.muted { font-size: 13px; color: #736077; margin-top: 8px; }

.write-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-group label {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
}

.form-group input[type="text"], 
.form-group input[type="password"], 
.form-group textarea,
.select-input {
  background: #ffffff;
  border: 1px solid rgba(155, 124, 255, 0.15);
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  color: var(--text);
  outline: none;
  transition: border-color 0.2s;
}
.form-group input[type="text"]:focus, 
.form-group input[type="password"]:focus, 
.form-group textarea:focus,
.select-input:focus {
  border-color: #9b7cff;
}

.file-upload-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}
.btn-file-select {
  background: #ffffff;
  border: 1px solid #9b7cff;
  color: #9b7cff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-file-select:hover {
  background: rgba(155, 124, 255, 0.05);
}
.file-name {
  font-size: 13px;
  color: #736077;
}

.preview-container {
  position: relative;
  width: 140px;
  height: 140px;
  margin-top: 8px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(155, 124, 255, 0.15);
}
.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.btn-remove-img {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 12px;
}
.btn-back {
  background: #f3f0f5;
  color: #4f4255;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}
.btn-submit {
  background: linear-gradient(90deg, #9b7cff, #ff8ab6);
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}
</style>