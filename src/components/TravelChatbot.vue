<template>
  <div class="chatbot-wrapper">
    <button @click="toggleChat" class="chatbot-fab" aria-label="챗봇 열기">
      <span class="fab-icon">🤖</span>
    </button>

    <div v-if="isOpen" class="chatbot-window">
      <header class="chatbot-header">
        <div class="header-info">
          <span class="bot-status-dot"></span>
          <h3>로컬 가이드 AI</h3>
        </div>
        <button @click="toggleChat" class="btn-close-chat">✕</button>
      </header>

      <div class="chatbot-messages" ref="messageContainer">
        <div 
          v-for="(msg, index) in messages" 
          :key="index" 
          :class="['message-bubble-wrapper', msg.sender]"
        >
          <div v-if="msg.sender === 'bot'" class="bot-avatar">🤖</div>
          <div class="message-bubble">
            <p>{{ msg.text }}</p>
          </div>
        </div>

        <div v-if="isLoading" class="message-bubble-wrapper bot">
          <div class="bot-avatar">🤖</div>
          <div class="message-bubble loading-bubble">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </div>

      <div class="quick-replies-container" v-if="messages.length < 3 && !isLoading">
        <button 
          v-for="(reply, idx) in quickReplies" 
          :key="idx" 
          @click="handleQuickReply(reply)" 
          class="btn-quick-reply"
        >
          {{ reply }}
        </button>
      </div>

      <div class="chatbot-input-area">
        <input 
          type="text" 
          v-model="userInput" 
          @keyup.enter="handleSend" 
          placeholder="질문을 입력하세요..." 
          class="chat-input"
          :disabled="isLoading"
        />
        <button @click="handleSend" class="btn-chat-send" :disabled="isLoading">
          보내기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const isOpen = ref(false)
const userInput = ref('')
const isLoading = ref(false)
const messageContainer = ref(null)

const messages = ref([
  { 
    sender: 'bot', 
    text: '안녕하세요! 서울 로컬허브의 AI 가이드입니다. 궁금한 서울 여행 코스나 명소를 물어보세요!' 
  }
])

const quickReplies = ref([
  '🌸 봄에 가기 좋은 서울 코스는?',
  '☔ 오늘 서울 비 오는데 실내 갈만한 곳?',
  '😋 서울의 진짜 현지인 맛집은 어디야?',
  '🗺️ 역사와 전통이 살아있는 힐링 코스 알려줘'
])

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    scrollToBottom()
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}

const handleSend = async () => {
  if (!userInput.value.trim() || isLoading.value) return
  await sendMessage(userInput.value.trim())
}

const handleQuickReply = async (replyText) => {
  if (isLoading.value) return
  await sendMessage(replyText)
}

const sendMessage = async (text) => {
  messages.value.push({ sender: 'user', text })
  userInput.value = ''
  isLoading.value = true
  scrollToBottom()

  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    if (!apiKey) {
      messages.value.push({
        sender: 'bot',
        text: 'API 키가 설정되지 않았습니다. .env 파일을 확인해 주세요.'
      })
      isLoading.value = false
      scrollToBottom()
      return
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: '당신은 서울 여행을 전문으로 안내하는 상냥하고 친절한 로컬 AI 가이드입니다. 서울의 명소, 교통, 축제, 숙박, 숨은 로컬 맛집 정보를 여행자 맞춤형으로 상냥하게 답변해 주세요.'
          },
          ...messages.value.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          }))
        ]
      })
    })

    if (!response.ok) throw new Error('API 호출 실패')

    const data = await response.json()
    const reply = data.choices[0].message.content.trim()

    messages.value.push({ sender: 'bot', text: reply })
  } catch (error) {
    messages.value.push({
      sender: 'bot',
      text: '죄송합니다. 메시지를 전송하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}
</script>

<style scoped>
.chatbot-wrapper {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  font-family: 'Noto Sans KR', sans-serif;
}

.chatbot-fab {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #9b7cff, #ff8ab6);
  border: none;
  color: white;
  box-shadow: 0 8px 24px rgba(155, 124, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.chatbot-fab:hover {
  transform: scale(1.08) rotate(5deg);
  box-shadow: 0 12px 32px rgba(155, 124, 255, 0.5);
}

.fab-icon {
  font-size: 26px;
}

.chatbot-window {
  position: absolute;
  bottom: 76px;
  right: 0;
  width: 360px;
  height: 520px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(24, 16, 40, 0.15);
  border: 1px solid #ebdff5;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chatbot-header {
  background: linear-gradient(90deg, #9b7cff, #ff8ab6);
  padding: 16px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bot-status-dot {
  width: 8px;
  height: 8px;
  background: #2ebd59;
  border-radius: 50%;
  box-shadow: 0 0 8px #2ebd59;
}

.chatbot-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
}

.btn-close-chat {
  background: transparent;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.btn-close-chat:hover {
  opacity: 1;
}

.chatbot-messages {
  flex-grow: 1;
  padding: 16px;
  overflow-y: auto;
  background: #fbf9ff;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-bubble-wrapper {
  display: flex;
  gap: 8px;
  max-width: 85%;
}

.message-bubble-wrapper.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-bubble-wrapper.bot {
  align-self: flex-start;
}

.bot-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #f0ecf8;
  border: 1px solid #ebdff5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.message-bubble {
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 13.5px;
  line-height: 1.5;
  text-align: left;
}

.user .message-bubble {
  background: linear-gradient(135deg, #9b7cff, #ff8ab6);
  color: white;
  border-top-right-radius: 4px;
}

.bot .message-bubble {
  background: #ffffff;
  color: #2f213f;
  border: 1px solid #ebdff5;
  border-top-left-radius: 4px;
}

.loading-bubble {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
}

.loading-bubble .dot {
  width: 6px;
  height: 6px;
  background: #9b7cff;
  border-radius: 50%;
  animation: pulse 1.2s infinite ease-in-out;
}

.loading-bubble .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-bubble .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}

.quick-replies-container {
  padding: 8px 16px;
  background: #fbf9ff;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-top: 1px dashed #ebdff5;
}

.btn-quick-reply {
  background: #ffffff;
  border: 1px solid rgba(155, 124, 255, 0.25);
  color: #615066;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(155, 124, 255, 0.02);
}

.btn-quick-reply:hover {
  background: #f5eeff;
  border-color: #9b7cff;
  color: #9b7cff;
  transform: translateY(-1px);
}

.chatbot-input-area {
  padding: 12px 16px;
  background: #ffffff;
  border-top: 1px solid #ebdff5;
  display: flex;
  gap: 8px;
}

.chat-input {
  flex-grow: 1;
  border: 1px solid #ebdff5;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 13px;
  outline: none;
  background: #faf8fd;
  box-sizing: border-box;
}

.chat-input:focus {
  border-color: #9b7cff;
  background: #ffffff;
}

.btn-chat-send {
  background: linear-gradient(90deg, #9b7cff, #ff8ab6);
  color: white;
  border: none;
  padding: 0 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-chat-send:hover {
  opacity: 0.9;
}

.btn-chat-send:disabled {
  background: #ebdff0;
  color: #a394a8;
  cursor: not-allowed;
}
</style>