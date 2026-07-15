<template>
  <div class="chatbot-wrapper">
    <button @click="toggleChat" class="chatbot-trigger-btn" aria-label="AI 비서 열기">
      <span v-if="!isOpen">💬 AI 가이드</span>
      <span v-else>❌ 닫기</span>
    </button>

    <div v-if="isOpen" class="chat-window">
      <header class="chat-header">
        <div class="header-info">
          <span class="bot-avatar">🤖</span>
          <div>
            <h3>LocalHub AI 비서</h3>
            <p class="status">실시간 데이터 추천 중</p>
          </div>
        </div>
        <button @click="chatbotStore.clearHistory" class="clear-btn" title="대화 초기화">초기화</button>
      </header>

      <main ref="msgArea" class="chat-messages">
        <div 
          v-for="(msg, idx) in chatbotStore.messages" 
          :key="idx" 
          :class="['message-bubble', msg.role]"
        >
          <div class="bubble-content">{{ msg.content }}</div>
        </div>
        
        <div v-if="chatbotStore.isLoading" class="message-bubble assistant loading">
          <div class="bubble-content">
            <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
          </div>
        </div>
      </main>

      <form @submit.prevent="handleSend" class="chat-input-form">
        <input 
          v-model="userInput" 
          type="text" 
          placeholder="가고 싶은 여행 테마나 코스를 물어보세요" 
          :disabled="chatbotStore.isLoading"
          ref="inputField"
        />
        <button type="submit" :disabled="chatbotStore.isLoading || !userInput.trim()">
          보내기
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue';
import { useChatbotStore } from '../stores/chatbot'; // 🌟 스토어 경로 연동

const chatbotStore = useChatbotStore();
const isOpen = ref(false);
const userInput = ref('');
const msgArea = ref(null);
const inputField = ref(null);

// 대화창 토글 및 자동 포커스 처리
const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    scrollToBottom();
    nextTick(() => inputField.value?.focus());
  }
};

// 최신 메시지가 항상 화면 하단에 오도록 스크롤 제어
const scrollToBottom = () => {
  nextTick(() => {
    if (msgArea.value) {
      msgArea.value.scrollTop = msgArea.value.scrollHeight;
    }
  });
};

// 메시지 전송 로직
const handleSend = async () => {
  if (!userInput.value.trim() || chatbotStore.isLoading) return;
  const msg = userInput.value;
  userInput.value = ''; // 전송 버튼을 누르는 즉시 입력창 초기화
  
  // 🌟 스토어의 sendMessage 액션을 호출하여 비동기 API 통신 시작
  await chatbotStore.sendMessage(msg);
  scrollToBottom();
};

// 새로운 답변이나 질문이 배열에 쌓이면 자동으로 하단 스크롤 동기화
watch(() => chatbotStore.messages.length, () => {
  scrollToBottom();
});
</script>

<style scoped>
.chatbot-wrapper {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  font-family: var(--sans);
}

/* 플로팅 버튼 디자인 */
.chatbot-trigger-btn {
  width: 100px;
  height: 48px;
  border-radius: 999px;
  /* 🌟 테마 변수가 로드되지 않더라도 확실히 보이도록 백업 색상(#9b7cff, #ff8ab6)을 추가합니다! */
  background: linear-gradient(135deg, var(--accent-2, #9b7cff), var(--accent-1, #ff8ab6));
  color: white;
  border: none;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(155, 124, 255, 0.3);
  /* 🌟 트랜지션 시간 변수에도 백업값(240ms)을 지정해 안정성을 높입니다. */
  transition: transform var(--transition, 240ms), box-shadow var(--transition, 240ms);
} 
.chatbot-trigger-btn:hover {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 12px 30px rgba(155, 124, 255, 0.45);
}

/* 대화 수납창 본체 */
.chat-window {
  position: absolute;
  bottom: 64px;
  right: 0;
  width: 360px;
  height: 480px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 12px 42px rgba(24, 16, 40, 0.15);
  border: 1px solid rgba(155, 124, 255, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.25s cubic-bezier(0.2, 0.9, 0.3, 1);
}

@keyframes slideUp {
  from { transform: translateY(15px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* 헤더 상단 */
.chat-header {
  /* 🌟 여기도 마찬가지로 백업 그라데이션 색상을 넣어줍니다. */
  background: linear-gradient(90deg, var(--accent-2, #9b7cff), var(--accent-1, #ff8ab6));
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}
.header-info { display: flex; gap: 8px; align-items: center; text-align: left; }
.bot-avatar { font-size: 22px; }
.header-info h3 { margin: 0; font-size: 13px; font-weight: 700; }
.header-info p { margin: 1px 0 0; font-size: 10px; opacity: 0.85; }
.clear-btn {
  background: rgba(255, 255, 255, 0.18);
  border: none;
  color: white;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.clear-btn:hover { background: rgba(255, 255, 255, 0.3); }

/* 대화 리스트 뷰 영역 */
.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #fdfcff;
}

/* 말풍선 공통 스타일 */
.message-bubble {
  display: flex;
  max-width: 85%;
}
.bubble-content {
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 13px;
  line-height: 1.5;
  text-align: left;
}

/* 내 질문 (우측) */
.message-bubble.user {
  align-self: flex-end;
}
.message-bubble.user .bubble-content {
  background: var(--accent-2);
  color: white;
  border-bottom-right-radius: 2px;
  box-shadow: 0 4px 12px rgba(155, 124, 255, 0.15);
}

/* AI 가이드 답변 (좌측) */
.message-bubble.assistant {
  align-self: flex-start;
}
.message-bubble.assistant .bubble-content {
  background: white;
  color: var(--text);
  border: 1px solid rgba(155, 124, 255, 0.08);
  border-bottom-left-radius: 2px;
  box-shadow: 0 4px 12px rgba(24, 16, 40, 0.02);
  white-space: pre-line; /* AI가 던져주는 마크다운 문단 개행을 깨끗하게 표현합니다. */
}

/* 생각 중... 애니메이션 닷 스키마 */
.loading .dot {
  animation: dots 1.4s infinite;
  display: inline-block;
  font-weight: bold;
}
.loading .dot:nth-child(2) { animation-delay: 0.2s; }
.loading .dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes dots {
  0%, 100% { opacity: 0.2; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-3px); }
}

/* 하단 입력 폼 */
.chat-input-form {
  display: flex;
  padding: 10px 12px;
  background: white;
  border-top: 1px solid rgba(155, 124, 255, 0.1);
  gap: 8px;
}
.chat-input-form input {
  flex: 1;
  border: 1px solid rgba(155, 124, 255, 0.15);
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  outline: none;
}
.chat-input-form input:focus { border-color: var(--accent-2); }
.chat-input-form button {
  background: linear-gradient(90deg, var(--accent-2), var(--accent-1));
  color: white;
  border: none;
  padding: 0 16px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.chat-input-form button:disabled {
  background: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}
</style>