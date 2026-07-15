<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold text-gray-800 mb-2">LocalHub 종합 기능 테스트 베드 (팀원 B)</h1>
    <p class="text-gray-500 mb-8">익명 게시판 CRUD, AI 챗봇 비동기 통신, 그리고 Leaflet.js 지도 시각화까지 연동 검증합니다.</p>

    <div class="flex flex-wrap gap-2 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <span class="text-sm font-bold text-gray-400 self-center mr-2">데이터 카테고리:</span>
      <button 
        v-for="category in categories" 
        :key="category.key"
        @click="tourStore.changeCategory(category.key)"
        :class="[
          'px-4 py-2 rounded-lg font-semibold text-xs transition-colors',
          tourStore.currentCategory === category.key 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        ]"
      >
        {{ category.name }} ({{ tourStore.tourData[category.key]?.length || 0 }}건)
      </button>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-md mb-8">
      <h2 class="text-xl font-bold text-blue-600 mb-2">📍 서울 {{ getTourCategoryName(tourStore.currentCategory) }} 지도 위치 시각화 (선택 기능)</h2>
      <p class="text-xs text-gray-400 mb-4">* 위 7대 카테고리 탭을 누르면 상위 5개 데이터가 지도 마커로 찍히고 화면이 이동합니다. 마커를 누르면 상세 정보가 표출됩니다.</p>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 h-[450px]">
          <LeafletMap 
            :items="tourStore.currentItems.slice(0, 5)" 
            @select-item="selectedPlace = $event" 
          />
        </div>

        <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col justify-between">
          <div>
            <h3 class="text-xs font-bold text-blue-500 mb-2">🔎 선택한 장소 정보</h3>
            
            <div v-if="!selectedPlace" class="text-gray-400 text-sm py-24 text-center">
              지도에서 마커(핀)를 클릭하시면 상세 정보가 여기에 나타납니다. 🗺️
            </div>

            <div v-else class="space-y-3">
              <h4 class="text-lg font-bold text-gray-800">{{ selectedPlace.title }}</h4>
              <p class="text-xs text-gray-500 bg-white p-2 rounded border leading-relaxed">
                {{ selectedPlace.addr1 }} {{ selectedPlace.addr2 }}
              </p>
              
              <div v-if="selectedPlace.tel" class="text-xs text-gray-600">
                📞 문의처: {{ selectedPlace.tel }}
              </div>
              
              <button 
                @click="askChatbotAboutPlace(selectedPlace.title)"
                class="w-full mt-4 bg-blue-50 text-blue-600 font-bold py-2 rounded-lg text-xs hover:bg-blue-100 transition-colors"
              >
                🤖 이 장소에 대해 AI에게 추천 물어보기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

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
import { ref, watch } from 'vue'
import { useCommunityStore } from './stores/community'
import { useChatbotStore } from './stores/chatbot'
import { useTourStore } from './stores/tour' // 🌟 7대 데이터 스토어 추가 로드
import LeafletMap from './components/LeafletMap.vue' // 🌟 새로 만든 Leaflet 지도 컴포넌트 임포트

const boardStore = useCommunityStore()
const chatbotStore = useChatbotStore()
const tourStore = useTourStore() // 🌟 7대 데이터 스토어 인스턴스 선언

const userInput = ref('')
const selectedPlace = ref(null) // 🌟 사용자가 지도 마커를 눌러 선택한 장소 데이터 상태

// 7대 카테고리 매핑 정보
const categories = [
  { key: 'attraction', name: '관광지' },
  { key: 'culture', name: '문화시설' },
  { key: 'festival', name: '축제/행사' },
  { key: 'course', name: '여행코스' },
  { key: 'sports', name: '레포츠' },
  { key: 'accommodation', name: '숙박' },
  { key: 'shopping', name: '쇼핑' }
]

const tabs = [
  { key: 'all', name: '전체' },
  { key: 'attraction', name: '관광지' },
  { key: 'culture', name: '문화시설' },
  { key: 'festival', name: '축제' },
  { key: 'shopping', name: '쇼핑' }
]

const form = ref({
  title: '',
  content: '',
  password: '',
  category: 'attraction'
})

const modal = ref({
  isOpen: false,
  type: '',
  postId: null,
  passwordInput: '',
  editTitle: '',
  editContent: ''
})

// 카테고리가 다른 곳으로 바뀌면 상세 카드 선택 기록을 지워줍니다.
watch(() => tourStore.currentCategory, () => {
  selectedPlace.value = null
})

// 7대 카테고리 영문 코드를 한글명으로 매핑해주는 헬퍼 함수
const getTourCategoryName = (key) => {
  const target = categories.find(c => c.key === key)
  return target ? target.name : key
}

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

// 🌟 지도의 상세 카드에서 AI 연동 버튼을 눌렀을 때 실행될 헬퍼 함수
const askChatbotAboutPlace = (placeTitle) => {
  userInput.value = `서울에 있는 '${placeTitle}'에 대해서 볼거리나 특징을 자세히 알려줘!`
  handleSend()
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