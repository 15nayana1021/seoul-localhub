<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold text-gray-800 mb-2">LocalHub 종합 기능 테스트 베드 (팀원 B)</h1>
    <p class="text-gray-500 mb-8">익명 게시판 CRUD와 AI 챗봇 비동기 통신 로직을 통합 검증합니다.</p>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      
      <div class="xl:col-span-2 space-y-6">
        <div class="bg-white p-6 rounded-xl shadow-md">
          <h2 class="text-xl font-bold text-blue-600 mb-4">📢 익명 게시글 등록</h2>
          <form @submit.prevent="handleCreate" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">카테고리</label>
                <select v-model="form.category" class="w-full p-2 border border-gray-300 rounded-lg">
                  <option value="attraction">관광지</option>
                  <option value="culture">문화시설</option>
                  <option value="festival">축제/행사</option>
                  <option value="shopping">쇼핑</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">비밀번호</label>
                <input v-model="form.password" type="password" required class="w-full p-2 border border-gray-300 rounded-lg" placeholder="암호 4자리">
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">제목</label>
              <input v-model="form.title" type="text" required class="w-full p-2 border border-gray-300 rounded-lg" placeholder="제목을 입력하세요">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">내용</label>
              <textarea v-model="form.content" required rows="3" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="내용을 입력하세요"></textarea>
            </div>
            <button type="submit" class="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors">
              게시글 등록
            </button>
          </form>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-md">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-blue-600">📋 게시글 목록</h2>
            <div class="flex gap-1 bg-gray-100 p-1 rounded-lg text-xs">
              <button v-for="tab in tabs" :key="tab.key" @click="boardStore.setCategory(tab.key)"
                :class="['px-3 py-1 rounded-md font-medium transition-colors', boardStore.currentCategory === tab.key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800']">
                {{ tab.name }}
              </button>
            </div>
          </div>

          <p v-if="boardStore.filteredPosts.length === 0" class="text-gray-500 text-center py-8">등록된 게시글이 없습니다.</p>
          <div v-else class="space-y-4">
            <div v-for="post in boardStore.filteredPosts" :key="post.id" class="p-4 border border-gray-200 rounded-lg">
              <div class="flex justify-between mb-2">
                <span class="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-0.5 rounded">{{ getCategoryName(post.category) }}</span>
                <span class="text-xs text-gray-400">{{ formatTitleDate(post.createdAt) }}</span>
              </div>
              <h3 class="font-bold text-gray-800 text-base mb-1">{{ post.title }}</h3>
              <p class="text-gray-600 text-sm whitespace-pre-wrap">{{ post.content }}</p>
              <div class="flex justify-end gap-2 mt-2 text-xs">
                <button @click="openModal(post.id, 'update')" class="text-amber-600 hover:underline">수정</button>
                <button @click="openModal(post.id, 'delete')" class="text-red-600 hover:underline">삭제</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-md flex flex-col h-[600px]">
        <div class="flex justify-between items-center border-b pb-3 mb-4">
          <h2 class="text-xl font-bold text-blue-600 flex items-center gap-2">
            🤖 LocalHub AI 비서
          </h2>
          <button @click="chatbotStore.clearHistory" class="text-xs text-gray-400 hover:text-red-500 underline">
            대화 리셋
          </button>
        </div>

        <div class="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
          <div 
            v-for="(msg, index) in chatbotStore.messages" 
            :key="index"
            :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']"
          >
            <div 
              :class="[
                'max-w-[85%] rounded-lg px-4 py-2.5 text-sm whitespace-pre-wrap shadow-sm',
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              ]"
            >
              {{ msg.content }}
            </div>
          </div>
          
          <div v-if="chatbotStore.isLoading" class="flex justify-start">
            <div class="bg-gray-100 text-gray-400 rounded-lg px-4 py-2.5 text-sm rounded-bl-none animate-pulse">
              AI 비서가 실제 데이터를 분석하며 고민 중입니다... 💬
            </div>
          </div>
        </div>

        <form @submit.prevent="handleSend" class="flex gap-2">
          <input 
            v-model="userInput" 
            type="text" 
            :disabled="chatbotStore.isLoading"
            placeholder="서울 야경 맛집 추천해줘!" 
            class="flex-1 p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button 
            type="submit" 
            :disabled="chatbotStore.isLoading"
            class="bg-blue-600 text-white px-4 rounded-lg font-bold text-sm hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
          >
            전송
          </button>
        </form>
      </div>

    </div>

    <div v-if="modal.isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h3 class="text-lg font-bold text-gray-800 mb-2">
          {{ modal.type === 'update' ? '게시글 수정' : '게시글 삭제' }} 비밀번호 확인
        </h3>
        <input v-model="modal.passwordInput" type="password" class="w-full p-2 border border-gray-300 rounded-lg mb-4" placeholder="비밀번호 입력">
        <div v-if="modal.type === 'update'" class="space-y-3 mb-4 border-t pt-4">
          <input v-model="modal.editTitle" type="text" class="w-full p-2 border border-gray-300 rounded-lg text-sm">
          <textarea v-model="modal.editContent" rows="3" class="w-full p-2 border border-gray-300 rounded-lg text-sm"></textarea>
        </div>
        <div class="flex justify-end gap-2">
          <button @click="closeModal" class="px-4 py-2 bg-gray-100 rounded-lg text-sm">취소</button>
          <button @click="handleConfirm" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">확인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCommunityStore } from './stores/community'
import { useChatbotStore } from './stores/chatbot' // 👈 챗봇 스토어 로드

const boardStore = useCommunityStore()
const chatbotStore = useChatbotStore()

const userInput = ref('')

// 글 작성 폼 상태
const form = ref({
  title: '',
  content: '',
  password: '',
  category: 'attraction'
})

const tabs = [
  { key: 'all', name: '전체' },
  { key: 'attraction', name: '관광지' },
  { key: 'culture', name: '문화시설' },
  { key: 'festival', name: '축제' },
  { key: 'shopping', name: '쇼핑' }
]

const modal = ref({
  isOpen: false,
  type: '',
  postId: null,
  passwordInput: '',
  editTitle: '',
  editContent: ''
})

const getCategoryName = (key) => {
  const target = tabs.find(t => t.key === key)
  return target ? target.name : key
}

const formatTitleDate = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

const handleCreate = () => {
  boardStore.createPost({
    title: form.value.title,
    content: form.value.content,
    password: form.value.password,
    category: form.value.category
  })
  form.value.title = ''
  form.value.content = ''
  form.value.password = ''
  alert('등록되었습니다!')
}

// 챗봇 발송 핸들러
const handleSend = async () => {
  if (!userInput.value.trim()) return
  const tempInput = userInput.value
  userInput.value = ''
  await chatbotStore.sendMessage(tempInput)
}

const openModal = (id, type) => {
  const post = boardStore.getPostById(id)
  if (!post) return
  modal.value.isOpen = true
  modal.value.type = type
  modal.value.postId = id
  modal.value.passwordInput = ''
  if (type === 'update') {
    modal.value.editTitle = post.title
    modal.value.editContent = post.content
  }
}

const closeModal = () => {
  modal.value.isOpen = false
}

const handleConfirm = () => {
  if (modal.value.type === 'update') {
    const result = boardStore.updatePost(modal.value.postId, {
      title: modal.value.editTitle,
      content: modal.value.editContent,
      password: modal.value.passwordInput
    })
    if (result.success) {
      alert('수정되었습니다.')
      closeModal()
    } else {
      alert(result.message)
    }
  } else if (modal.value.type === 'delete') {
    const result = boardStore.deletePost(modal.value.postId, modal.value.passwordInput)
    if (result.success) {
      alert('삭제되었습니다.')
      closeModal()
    } else {
      alert(result.message)
    }
  }
}
</script>