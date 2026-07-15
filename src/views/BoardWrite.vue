<template>
  <div class="write-wrap">
    <header class="write-head">
      <h2>새 글 작성</h2>
      <p class="muted">제목과 내용을 입력해주세요. 미리보기를 확인한 뒤 저장하세요.</p>
    </header>

    <form @submit.prevent="savePost" class="write-form">
      <label class="field">
        <div class="label">제목</div>
        <input v-model="form.title" type="text" placeholder="글 제목" />
        <div v-if="errors.title" class="error">{{ errors.title }}</div>
      </label>

      <label class="field">
        <div class="label">작성자</div>
        <input v-model="form.author" type="text" placeholder="이름 (선택)" />
      </label>

      <label class="field">
        <div class="label">내용</div>
        <textarea v-model="form.content" rows="8" placeholder="본문을 입력하세요"></textarea>
        <div v-if="errors.content" class="error">{{ errors.content }}</div>
      </label>

      <div class="actions">
        <button type="submit" class="btn-primary">저장</button>
        <button type="button" class="btn-ghost" @click="resetForm">초기화</button>
      </div>
    </form>

    <section class="preview">
      <h3 class="preview-title">미리보기</h3>
      <article class="post-card preview-card" aria-live="polite">
        <div class="post-body">
          <h3 class="post-title">{{ preview.title || '제목 미지정' }}</h3>
          <p class="post-meta">{{ preview.author }} · {{ preview.date }}</p>
          <p class="post-excerpt">{{ preview.content || '내용이 비어 있습니다.' }}</p>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { format } from 'date-fns';

const form = reactive({
  title: '',
  author: '',
  content: ''
});

const errors = reactive({
  title: '',
  content: ''
});

const validate = () => {
  errors.title = form.title.trim() ? '' : '제목은 필수입니다.';
  errors.content = form.content.trim() ? '' : '내용은 필수입니다.';
  return !errors.title && !errors.content;
};

const savePost = () => {
  if (!validate()) return;

  const saved = localStorage.getItem('posts');
  const posts = saved ? JSON.parse(saved) : [];

  const now = new Date();
  const post = {
    title: form.title.trim(),
    author: form.author.trim() || '익명',
    content: form.content.trim(),
    date: now.toISOString().slice(0,10)
  };

  posts.unshift(post);
  localStorage.setItem('posts', JSON.stringify(posts));

  alert('글이 저장되었습니다.');
  resetForm();

  // optionally notify other tabs/windows
  window.dispatchEvent(new Event('storage'));
};

const resetForm = () => {
  form.title = '';
  form.author = '';
  form.content = '';
  errors.title = '';
  errors.content = '';
};

const preview = computed(() => ({
  title: form.title || '',
  author: form.author || '익명',
  content: form.content || '',
  date: new Date().toISOString().slice(0,10)
}));
</script>

<style scoped>
.write-wrap { max-width:900px; margin:20px auto; padding:20px; }
.write-head { margin-bottom:14px; }
.muted { color: #6b7280; margin:4px 0 0; }
.write-form { display:flex; flex-direction:column; gap:14px; }
.field .label { font-weight:600; margin-bottom:6px; }
.field input, .field textarea {
  width:100%; padding:10px 12px; border-radius:10px; border:1px solid rgba(0,0,0,0.08);
  background: linear-gradient(180deg,#fff,#fffaf7);
  outline:none;
}
.error { color:#dc2626; font-size:0.9rem; margin-top:6px; }
.actions { display:flex; gap:10px; margin-top:6px; }
.btn-primary { background:linear-gradient(90deg,#9b7cff,#ff8ab6); color:#fff; border:none; padding:8px 14px; border-radius:10px; cursor:pointer; }
.btn-ghost { background:transparent; border:1px solid rgba(0,0,0,0.06); padding:8px 14px; border-radius:10px; cursor:pointer; }

.preview { margin-top:22px; }
.preview-title { margin:0 0 10px 0; font-size:1rem; color:#444; }
.preview-card {
  background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,250,255,0.9));
  border-radius: 12px; padding:16px; box-shadow: 0 14px 40px rgba(24,16,40,0.06);
}
.post-title { margin:0 0 6px 0; font-weight:700; }
.post-meta { margin:0 0 10px 0; color:#6b7280; font-size:0.9rem; }
.post-excerpt { margin:0; color:#3f3b45; white-space:pre-wrap; }
</style>