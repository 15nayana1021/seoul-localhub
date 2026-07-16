import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useTourStore } from './tour'

export const useChatbotStore = defineStore('chatbot', () => {
  const tourStore = useTourStore()
  
  const messages = ref([
    {
      role: 'assistant',
      content: '안녕하세요! 취향별 서울 여행 가이드 LocalHub AI 비서입니다. 서울의 관광지, 축제, 맛집, 숙박 정보 등 무엇이든 물어보세요! 😊'
    }
  ])
  
  const isLoading = ref(false)

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return
    
    messages.value.push({
      role: 'user',
      content: userMessage
    })

    isLoading.value = true

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY

      if (!apiKey) {
        throw new Error('API Key가 설정되지 않았습니다. .env 파일의 VITE_OPENAI_API_KEY를 확인해 주세요.')
      }

      const systemContext = `
        당신은 서울 여행 전문 가이드 챗봇 'LocalHub AI 비서'입니다.
        사용자가 서울 여행 관련 질문을 던지면 아래의 실제 서울 공공데이터 정보(JSON 데이터 요약)를 기반으로 신뢰성 높은 추천 답변을 제공해야 합니다.
        
        [학습된 서울 공공데이터 요약]
        - 관광지 목록 (총 ${tourStore.tourData.attraction.length}건): ${JSON.stringify(tourStore.tourData.attraction.slice(0, 30).map(p => ({ title: p.title, addr: p.addr1 })))} ...외 다수
        - 축제/공연/행사 목록 (총 ${tourStore.tourData.festival.length}건): ${JSON.stringify(tourStore.tourData.festival.slice(0, 15).map(p => ({ title: p.title, addr: p.addr1 })))} ...외 다수
        - 숙박 목록 (총 ${tourStore.tourData.accommodation.length}건): ${JSON.stringify(tourStore.tourData.accommodation.slice(0, 15).map(p => ({ title: p.title, addr: p.addr1 })))} ...외 다수
        - 쇼핑 목록 (총 ${tourStore.tourData.shopping.length}건): ${JSON.stringify(tourStore.tourData.shopping.slice(0, 15).map(p => ({ title: p.title, addr: p.addr1 })))} ...외 다수
        - 여행코스 (총 ${tourStore.tourData.course.length}건): ${JSON.stringify(tourStore.tourData.course.slice(0, 10).map(p => ({ title: p.title, addr: p.addr1 })))}
        - 레포츠 (총 ${tourStore.tourData.sports.length}건): ${JSON.stringify(tourStore.tourData.sports.slice(0, 10).map(p => ({ title: p.title, addr: p.addr1 })))}

        [답변 원칙]
        1. 친절하고 열정적인 가이드 말투(~요, ~습니다)를 유지해 주세요.
        2. 사용자가 특정 장소나 코스를 추천해 달라고 하면 위 제공된 실제 데이터 위주로 구체적인 명칭과 대략적인 위치를 함께 언급해 주세요.
        3. 만약 제공된 리스트에 없는 장소를 물어볼 경우, 가상의 거짓말(환각 현상)을 지어내지 말고 "데이터를 조회 중이거나 제가 보관 중인 서울 공공데이터 범위 밖의 장소"라고 솔직하게 안내하고 차선책을 제안하세요.
      `

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemContext },
            ...messages.value.map(m => ({ role: m.role, content: m.content }))
          ]
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'API 통신 중 오류가 발생했습니다.')
      }

      const data = await response.json()
      const aiReply = data.choices[0].message.content

      messages.value.push({
        role: 'assistant',
        content: aiReply
      })

    } catch (error) {
      console.error(error)
      messages.value.push({
        role: 'assistant',
        content: `⚠️ 에러 발생: ${error.message}`
      })
    } finally {
      isLoading.value = false
    }
  }

  const clearHistory = () => {
    messages.value = [
      {
        role: 'assistant',
        content: '안녕하세요! 취향별 서울 여행 가이드 LocalHub AI 비서입니다. 서울의 관광지, 축제, 맛집, 숙박 정보 등 무엇이든 물어보세요! 😊'
      }
    ]
  }

  return {
    messages,
    isLoading,
    sendMessage,
    clearHistory
  }
})