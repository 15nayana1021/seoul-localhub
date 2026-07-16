<template>
  <div class="write-container">
    <div class="blobs" aria-hidden="true">
      <div class="blob b1"></div>
      <div class="blob b2"></div>
    </div>

    <div class="card write-card">
      <header class="write-header">
        <h2>✍️ 여행 이야기 기록하기</h2>
        <p>서울에서의 특별했던 추억을 다른 여행자들과 공유해 보세요.</p>
      </header>

      <form @submit.prevent="handleSubmit" class="write-form">
        <div class="form-row">
          <div class="form-group flex-1">
            <label>익명 닉네임</label>
            <input 
              type="text" 
              v-model="author" 
              placeholder="닉네임 입력" 
              required
              class="form-input"
            />
          </div>
          <div class="form-group flex-1">
            <label>비밀번호 (삭제용)</label>
            <input 
              type="password" 
              v-model="password" 
              placeholder="비밀번호 4자리" 
              required
              class="form-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label>카테고리</label>
          <select v-model="category" required class="form-select">
            <option value="attraction">관광지</option>
            <option value="culture">문화/예술</option>
            <option value="festival">축제/행사</option>
            <option value="sports">레포츠</option>
            <option value="accommodation">숙박</option>
            <option value="shopping">쇼핑</option>
          </select>
        </div>

        <div class="form-group">
          <label>제목</label>
          <input 
            type="text" 
            v-model="title" 
            placeholder="제목을 입력해 주세요" 
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label>사진 첨부</label>
          <div class="file-upload-wrapper">
            <label class="file-upload-label">
              <span class="upload-icon">📸</span>
              <span class="upload-text">클릭하여 사진 선택하기</span>
              <input 
                type="file" 
                accept="image/*" 
                @change="handleFileChange" 
                class="file-input-hidden"
              />
            </label>
            <div v-if="imagePreview" class="preview-container">
              <img :src="imagePreview" alt="미리보기" class="image-preview" />
              <button type="button" @click="removeImage" class="btn-remove-img">✕ 사진 지우기</button>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>내용</label>
          <textarea 
            v-model="content" 
            placeholder="서울 여행의 생생한 꿀팁과 경험담을 적어주세요." 
            required
            class="form-textarea"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="button" @click="goBack" class="btn-cancel">취소</button>
          <button type="submit" class="btn-submit">등록하기</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCommunityStore } from '../stores/community'

const router = useRouter()
const communityStore = useCommunityStore()

const author = ref('')
const password = ref('')
const category = ref('attraction')
const title = ref('')
const content = ref('')
const image = ref('')
const imagePreview = ref('')

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      image.value = e.target.result
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  image.value = ''
  imagePreview.value = ''
}

const handleSubmit = () => {
  const newPost = {
    id: Date.now().toString(),
    title: title.value.trim(),
    content: content.value.trim(),
    category: category.value,
    author: author.value.trim(),
    password: password.value.trim(),
    image: image.value,
    createdAt: new Date().toISOString(),
    comments: []
  }

  communityStore.addPost(newPost)
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
  max-width: 680px;
  background: #ffffff;
  border-radius: 26px;
  padding: 40px; 
  box-shadow: 0 16px 45px rgba(24, 16, 40, 0.08);
  border: 1px solid #ebdff5;
  position: relative;
  z-index: 2;
}

.write-header {
  text-align: center;
  margin-bottom: 32px;
}
.write-header h2 {
  font-size: 26px;
  font-weight: 800;
  color: #2f213f;
  margin: 0 0 8px;
}
.write-header p {
  font-size: 14px;
  color: #736077;
  margin: 0;
}

.write-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
}

.form-row {
  display: flex;
  gap: 16px;
}
.flex-1 {
  flex: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-group label {
  font-size: 14px;
  font-weight: 700;
  color: #4f4255;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  background: #faf8fd;
  border: 1px solid #ebdff5;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 14px;
  color: #2f213f;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: #9b7cff;
}

.file-upload-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.file-upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #faf8fd;
  border: 2px dashed #ebdff5;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.file-upload-label:hover {
  border-color: #9b7cff;
  background: #f5eeff;
}
.upload-icon {
  font-size: 24px;
  margin-bottom: 6px;
}
.upload-text {
  font-size: 13.5px;
  font-weight: 600;
  color: #736077;
}
.file-input-hidden {
  display: none;
}
.preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #faf8fd;
  border: 1px solid #ebdff5;
  border-radius: 10px;
}
.image-preview {
  max-width: 100%;
  max-height: 240px;
  border-radius: 8px;
  object-fit: contain;
}
.btn-remove-img {
  background: rgba(255, 107, 107, 0.08);
  color: #ff6b6b;
  border: 1px solid rgba(255, 107, 107, 0.2);
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-remove-img:hover {
  background: #ff6b6b;
  color: #ffffff;
}

.form-textarea {
  height: 200px;
  resize: none;
  line-height: 1.6;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}

.btn-cancel {
  background: #f3f0f5;
  color: #4f4255;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}
.btn-submit {
  background: linear-gradient(90deg, #9b7cff, #ff8ab6);
  color: #ffffff;
  border: none;
  padding: 12px 28px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(155, 124, 255, 0.2);
}
</style>