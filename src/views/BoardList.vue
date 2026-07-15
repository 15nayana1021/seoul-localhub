<template>
  <div class="board">
    <header class="board-header">
      <h2 class="board-title">게시판 목록</h2>
    </header>

    <section class="posts-grid">
      <article
        v-for="(post, index) in posts"
        :key="index"
        class="post-card"
        role="article"
        aria-label="게시물"
      >
        <div class="post-body">
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-meta">{{ post.author }} · {{ post.date }}</p>
          <p class="post-excerpt">{{ post.content }}</p>
        </div>
      </article>

      <p v-if="!posts.length" class="muted">저장된 글이 없습니다. 새 글을 작성해보세요.</p>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const sample = [
  { title: '첫 번째 게시물', author: '사용자1', date: '2026-07-15', content: '안녕하세요! 반갑습니다. 이 게시물은 예시 텍스트입니다.' },
  { title: 'Vue.js 공부', author: '개발자', date: '2026-07-14', content: 'CSS가 생각보다 중요하네요. 반응형 레이아웃과 그리드를 잘 활용하면 보기 좋아집니다.' }
];

const posts = ref([]);

const loadPosts = () => {
  const saved = localStorage.getItem('posts');
  posts.value = saved ? JSON.parse(saved) : sample.slice();
};

onMounted(() => {
  loadPosts();
  // update when other tabs or manual storage events run
  window.addEventListener('storage', loadPosts);
});

</script>

<style scoped>
:root { --muted:#6b7280; --text:#111827; --card-border: rgba(17,24,39,0.06); }

.board { padding: 24px; max-width:1100px; margin:0 auto; box-sizing:border-box; }
.posts-grid { display:grid; grid-template-columns:1fr; gap:16px; }
@media (min-width:768px) { .posts-grid { grid-template-columns: repeat(2,1fr); gap:20px; } }

.post-card {
  background: linear-gradient(180deg, rgba(255,255,255,0.94), rgba(255,250,255,0.9));
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 14px 40px rgba(24,16,40,0.06);
  border: 1px solid var(--card-border);
  display:flex; flex-direction:column;
}
.post-title { font-weight:600; margin:0 0 8px 0; }
.muted { color:var(--muted); padding:16px 0; }
</style>