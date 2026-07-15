<template>
  <div class="board">
    <header class="board-header">
      <h2 class="board-title">커뮤니티 게시판</h2>
      <button @click="goToWrite" class="write-btn">새 글 작성</button>
    </header>

    <div class="category-filters">
      <button 
        v-for="cat in categories" 
        :key="cat.value"
        :class="['filter-btn', { active: communityStore.currentCategory === cat.value }]"
        @click="communityStore.setCategory(cat.value)"
      >
        {{ cat.label }}
      </button>
    </div>

    <section class="posts-grid">
      <article
        v-for="post in communityStore.filteredPosts"
        :key="post.id"
        class="post-card clickable"
        role="article"
        aria-label="게시물"
        @click="goToDetail(post.id)"
      >
        <div class="post-body">
          <span class="post-category-tag">{{ getCategoryLabel(post.category) }}</span>
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-meta">익명 · {{ formatDate(post.createdAt) }}</p>
          <p class="post-excerpt">{{ post.content }}</p>
        </div>
      </article>

      <p v-if="!communityStore.filteredPosts.length" class="muted">
        등록된 게시글이 없습니다. 첫 번째 이야기를 들려주세요!
      </p>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useCommunityStore } from '../stores/community'; // 🌟 Pinia 스토어 임포트
import { format } from 'date-fns'; // 🌟 날짜 포맷 라이브러리 임포트

const router = useRouter();
const communityStore = useCommunityStore();

// UI 표시용 카테고리 목록 정의
const categories = [
  { label: '전체', value: 'all' },
  { label: '관광지 추천', value: 'attraction' },
  { label: '동네 후기', value: 'local' },
  { label: '자유 소통', value: 'free' }
];

// 카테고리 영문 코드를 한글 라벨로 치환하는 헬퍼 함수
const getCategoryLabel = (catValue) => {
  const found = categories.find(c => c.value === catValue);
  return found ? found.label : '일반';
};

// 타임스탬프를 'yyyy-MM-dd HH:mm' 포맷으로 변경
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  return format(new Date(timestamp), 'yyyy-MM-dd HH:mm');
};

// 글쓰기 페이지 이동
const goToWrite = () => {
  router.push('/board/write'); // 라우터 경로에 맞게 설정
};

// 상세 페이지 이동
const goToDetail = (id) => {
  router.push(`/board/${id}`); // 라우터 상세 경로에 맞게 설정
};
</script>

<style scoped>
.board { padding: 24px; max-width:1100px; margin:0 auto; box-sizing:border-box; }
.board-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
.board-title { font-size:1.5rem; margin:0; color:var(--text); font-family: var(--sans); font-weight: 700; }

/* 새 글 작성 버튼 */
.write-btn {
  background: linear-gradient(90deg, var(--accent-2), var(--accent-1));
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow-soft);
  transition: transform var(--transition);
}
.write-btn:hover {
  transform: translateY(-2px);
}

/* 카테고리 필터 디자인 */
.category-filters {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.filter-btn {
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid rgba(155, 124, 255, 0.15);
  background: #fff;
  color: var(--muted);
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all var(--transition);
}
.filter-btn.active {
  background: var(--accent-2);
  color: #fff;
  border-color: transparent;
}

/* 게시글 그리드 및 카드 */
.posts-grid { display:grid; grid-template-columns:1fr; gap:16px; }
@media (min-width:768px) { .posts-grid { grid-template-columns: repeat(2,1fr); gap:20px; } }

.post-card {
  background: linear-gradient(180deg, rgba(255,255,255,0.94), rgba(255,250,255,0.9));
  border-radius: 14px;
  padding: 20px;
  box-shadow: var(--shadow-soft);
  border: 1px solid var(--card-border);
  display:flex; 
  flex-direction:column;
  text-align: left;
  transition: transform var(--transition), box-shadow var(--transition);
}
.post-card.clickable {
  cursor: pointer;
}
.post-card.clickable:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 40px rgba(155, 124, 255, 0.12);
}

.post-category-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: var(--accent-2);
  background: rgba(155, 124, 255, 0.08);
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
  width: fit-content;
}

.post-title { font-weight:600; margin:0 0 8px 0; color: var(--text); font-size: 1.1rem; }
.post-meta { font-size: 12px; color: var(--muted); margin-bottom: 12px; }
.post-excerpt { font-size: 13px; color: #555; line-height: 1.5; margin: 0; }
.muted { color:var(--muted); padding:16px 0; text-align: center; width: 100%; grid-column: 1 / -1; }
</style>