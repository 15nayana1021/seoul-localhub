<template>
  <div class="p-6 max-w-xl mx-auto border rounded shadow detail-card" v-if="post">
    <span class="category-tag">{{ getCategoryLabel(post.category) }}</span>
    <h1 class="text-2xl font-bold">{{ post.title }}</h1>
    <p class="text-gray-500 mt-2 text-sm">작성일: {{ formatDate(post.createdAt) }}</p>
    <div class="mt-6 content-area">{{ post.content }}</div>
    
    <div class="btn-group">
      <button @click="goBack" class="mt-6 bg-gray-200 px-4 py-2 rounded back-btn">목록으로</button>
      <button @click="handleDelete" class="mt-6 delete-btn">삭제</button>
    </div>
  </div>
  
  <div v-else class="p-6 text-center muted">
    <p>존재하지 않거나 삭제된 게시글입니다.</p>
    <button @click="goBack" class="mt-4 back-btn">목록으로 돌아가기</button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCommunityStore } from '../stores/community'; // 🌟 스토어 임포트
import { format } from 'date-fns';

const route = useRoute();
const router = useRouter();
const communityStore = useCommunityStore();

// 라우터 패러미터 ID를 기반으로 스토어에서 특정 글 가져오기
const post = computed(() => {
  return communityStore.getPostById(route.params.id);
});

const getCategoryLabel = (category) => {
  const labels = { attraction: '관광지 추천', local: '동네 후기', free: '자유 소통' };
  return labels[category] || '일반';
};

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  return format(new Date(timestamp), 'yyyy-MM-dd HH:mm');
};

const goBack = () => {
  router.push('/board'); // 목록으로 이동
};

// 간단 삭제 예시 (비밀번호 확인창 탑재)
const handleDelete = () => {
  const pwd = prompt('게시글 등록 시 설정한 비밀번호를 입력해주세요:');
  if (!pwd) return;
  
  const result = communityStore.deletePost(post.value.id, pwd);
  if (result.success) {
    alert('게시글이 안전하게 삭제되었습니다.');
    goBack();
  } else {
    alert(result.message || '비밀번호가 일치하지 않습니다.');
  }
};
</script>

<style scoped>
.detail-card {
  background: #fff;
  border-radius: 14px;
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-soft);
  text-align: left;
  margin-top: 40px;
}
.category-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: var(--accent-1);
  background: rgba(255, 138, 182, 0.08);
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 12px;
}
.content-area {
  min-height: 200px;
  line-height: 1.6;
  color: var(--text);
  white-space: pre-line; /* 작성할 때 넣은 줄바꿈 엔터를 그대로 표현해 줍니다. */
}
.btn-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.back-btn {
  background: #f3f4f6;
  color: #4b5563;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.back-btn:hover { background: #e5e7eb; }
.delete-btn {
  background: #fee2e2;
  color: #ef4444;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 24px;
  transition: background 0.2s;
}
.delete-btn:hover { background: #fca5a5; }
</style>