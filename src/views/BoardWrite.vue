<template>
  <div class="write-wrap">
    <header class="write-head">
      <h2>새 글 작성</h2>
      <p class="muted">카테고리를 선택하고 제목과 내용을 입력해주세요. 저장 후 목록에서 확인할 수 있습니다.</p>
    </header>

    <form @submit.prevent="savePost" class="write-form">
      <label class="field">
        <div class="label">카테고리</div>
        <select v-model="form.category" class="select-input">
          <option value="attraction">관광지 추천</option>
          <option value="local">동네 후기</option>
          <option value="free">자유 소통</option>
        </select>
        <div v-if="errors.category" class="error">{{ errors.category }}</div>
      </label>

      <label class="field">
        <div class="label">제목</div>
        <input v-model="form.title" type="text" placeholder="글 제목을 입력하세요" />
        <div v-if="errors.title" class="error">{{ errors.title }}</div>
      </label>

      <label class="field">
        <div class="label">비밀번호 (수정 및 삭제 시 사용)</div>
        <input v-model="form.password" type="password" placeholder="비밀번호 입력 (4자리 이상 권장)" />
        <div v-if="errors.password" class="error">{{ errors.password }}</div>
      </label>

      <label class="field">
        <div class="label">내용</div>
        <textarea v-model="form.content" rows="8" placeholder="서울 여행에 대한 따뜻한 소통을 남겨주세요"></textarea>
        <div v-if="errors.content" class="error">{{ errors.content }}</div>
      </label>

      <div class="actions">
        <button type="submit" class="btn-primary">저장하기</button>
        <button type="button" class="btn-ghost" @click="resetForm">초기화</button>
      </div>
    </form>

    <section class="preview">
      <h3 class="preview-title">실시간 미리보기</h3>
      <article class="post-card preview-card" aria-live="polite">
        <div class="post-body">
          <span class="preview-category-tag">{{ getCategoryLabel(preview.category) }}</span>
          <h3 class="post-title">{{ preview.title || '제목 미지정' }}</h3>
          <p class="post-meta">익명 · 방금 전</p>
          <p class="post-excerpt">{{ preview.content || '내용이 비어 있습니다.' }}</p>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCommunityStore } from '../stores/community'; // 🌟 Pinia 스토어 로드

const router = useRouter();
const communityStore = useCommunityStore(); // 🌟 스토어 사용

// 입력 폼 바인딩 상태
const form = reactive({
  category: 'free', // 기본값: 자유 소통
  title: '',
  password: '',
  content: ''
});

// 유효성 에러 상태
const errors = reactive({
  category: '',
  title: '',
  password: '',
  content: ''
});

// UI에 보여줄 카테고리 한글명 변환기
const getCategoryLabel = (catValue) => {
  const labels = { attraction: '관광지 추천', local: '동네 후기', free: '자유 소통' };
  return labels[catValue] || '일반';
};

// 필수 입력값 유효성 검사
const validate = () => {
  errors.category = form.category ? '' : '카테고리를 선택해주세요.';
  errors.title = form.title.trim() ? '' : '제목은 필수입니다.';
  errors.password = form.password.trim() ? '' : '비밀번호는 필수입니다.';
  errors.content = form.content.trim() ? '' : '본문 내용은 필수입니다.';
  
  return !errors.category && !errors.title && !errors.password && !errors.content;
};

// 🌟 게시글 저장 처리 (Pinia 연동)
const savePost = () => {
  if (!validate()) return;

  // Pinia 스토어의 createPost 액션을 사용하여 안전하게 등록
  const result = communityStore.createPost({
    title: form.title.trim(),
    content: form.content.trim(),
    password: form.password.trim(),
    category: form.category
  });

  if (result.success) {
    alert('글이 성공적으로 등록되었습니다! 🎉');
    resetForm();
    router.push('/board'); // 🌟 저장 완료 후 즉시 게시판 목록 화면으로 부드럽게 이동!
  } else {
    alert('글 등록 중 오류가 발생했습니다.');
  }
};

// 폼 초기화
const resetForm = () => {
  form.category = 'free';
  form.title = '';
  form.password = '';
  form.content = '';
  Object.keys(errors).forEach(key => errors[key] = '');
};

// 실시간 미리보기 바인딩 계산
const preview = computed(() => ({
  category: form.category,
  title: form.title,
  content: form.content
}));
</script>

<style scoped>
.write-wrap { max-width:900px; margin:20px auto; padding:20px; text-align: left; }
.write-head { margin-bottom:18px; border-bottom: 1px solid rgba(155, 124, 255, 0.1); padding-bottom: 12px; }
.muted { color: var(--muted); margin:4px 0 0; font-size: 13px; }
.write-form { display:flex; flex-direction:column; gap:16px; }

.field { display: flex; flex-direction: column; }
.field .label { font-weight:600; margin-bottom:6px; color: var(--text); font-size: 14px; }
.field input, .field textarea, .select-input {
  width:100%; padding:10px 12px; border-radius:10px; border:1px solid rgba(155, 124, 255, 0.15);
  background: #fff;
  outline:none;
  font-size: 14px;
  font-family: var(--sans);
  transition: border-color var(--transition);
}
.field input:focus, .field textarea:focus, .select-input:focus {
  border-color: var(--accent-2);
}

.error { color:#dc2626; font-size:0.85rem; margin-top:4px; }
.actions { display:flex; gap:10px; margin-top:8px; }
.btn-primary { background:linear-gradient(90deg, var(--accent-2), var(--accent-1)); color:#fff; border:none; padding:10px 18px; border-radius:10px; cursor:pointer; font-weight: 600; box-shadow: var(--shadow-soft); }
.btn-ghost { background:transparent; border:1px solid rgba(0,0,0,0.06); padding:10px 18px; border-radius:10px; cursor:pointer; color: var(--muted); }

/* 미리보기 디자인 */
.preview { margin-top:32px; border-top: 1px dashed rgba(155,124,255,0.2); padding-top: 24px; }
.preview-title { margin:0 0 12px 0; font-size:1.1rem; color: var(--text); font-weight: 700; }
.preview-card {
  background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,250,255,0.9));
  border-radius: 12px; padding:16px; box-shadow: var(--shadow-soft); border: 1px solid var(--card-border);
}
.preview-category-tag {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  color: var(--accent-2);
  background: rgba(155, 124, 255, 0.08);
  padding: 1px 6px;
  border-radius: 4px;
  margin-bottom: 6px;
}
.post-title { margin:0 0 6px 0; font-weight:700; color: var(--text); }
.post-meta { margin:0 0 10px 0; color: var(--muted); font-size:0.85rem; }
.post-excerpt { margin:0; color:#3f3b45; white-space:pre-wrap; font-size: 13px; line-height: 1.5; }
</style>