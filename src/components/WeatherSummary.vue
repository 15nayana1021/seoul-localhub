<template>
  <section class="weather-card">
    <div class="weather-header">
      <div>
        <span class="badge">서울 날씨</span>
        <h3>{{ title }}</h3>
      </div>
      <span class="weather-status">{{ statusText }}</span>
    </div>

    <div v-if="loading" class="weather-loading">
      날씨 정보를 불러오는 중입니다...
    </div>

    <div v-else-if="error" class="weather-error">
      {{ error }}
    </div>

    <div v-else class="weather-body">
      <div v-if="isEstimated" class="weather-estimated-notice">
        💡 선택하신 여행 일정은 실시간 예보 범위를 벗어나, 서울의 <strong>평년 기후 통계 데이터</strong>를 기반으로 예상 날씨를 맞춤 구성해 드렸습니다.
      </div>
      <div class="forecast-list">
        <div v-for="day in tripDays" :key="day.date" class="forecast-item">
          <div class="forecast-date">{{ formatDate(day.date) }}</div>
          <div class="forecast-icon">{{ day.icon }}</div>
          <div class="forecast-temp">{{ day.maxTemp }}° / {{ day.minTemp }}°</div>
          <div class="forecast-pop">{{ day.precipitationProbability }}%</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps({
  travelInfo: {
    type: Object,
    default: () => ({})
  }
})

const loading = ref(true)
const error = ref('')
const weatherData = ref(null)

const isEstimated = ref(false)

const title = computed(() => {
  if (props.travelInfo?.startDate && props.travelInfo?.endDate) {
    return '여행 일정 기준 날씨 추천'
  }
  return '실시간 서울 날씨'
})

const statusText = computed(() => {
  if (props.travelInfo?.startDate && props.travelInfo?.endDate) {
    return '여행 일정에 맞춘 예보를 확인해 보세요'
  }
  return '지금 서울의 날씨를 바로 확인해 보세요'
})

const tripDays = computed(() => weatherData.value?.tripDays || [])

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(`${dateString}T00:00:00`)
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short'
  }).format(date)
}

const getWeatherInfo = (code) => {
  const map = {
    0: { label: '맑음', icon: '☀️' },
    1: { label: '대체로 맑음', icon: '🌤️' },
    2: { label: '부분적으로 흐림', icon: '⛅' },
    3: { label: '흐림', icon: '☁️' },
    45: { label: '안개', icon: '🌫️' },
    48: { label: '서리 안개', icon: '🌫️' },
    51: { label: '약한 이슬비', icon: '🌦️' },
    53: { label: '보통 이슬비', icon: '🌦️' },
    55: { label: '강한 이슬비', icon: '🌧️' },
    61: { label: '약한 비', icon: '🌧️' },
    63: { label: '비', icon: '🌧️' },
    65: { label: '강한 비', icon: '⛈️' },
    71: { label: '약한 눈', icon: '🌨️' },
    73: { label: '눈', icon: '❄️' },
    75: { label: '강한 눈', icon: '❄️' },
    95: { label: '천둥번개', icon: '⛈️' },
    96: { label: '뇌우', icon: '⛈️' },
    99: { label: '강한 뇌우', icon: '⛈️' }
  }
  return map[code] || { label: '날씨 정보', icon: '🌈' }
}

const createTripDays = (daily, startDate, endDate) => {
  isEstimated.value = false

  if (!startDate || !endDate) {
    return daily.slice(0, 3).map((item) => ({
      date: item.time,
      icon: getWeatherInfo(item.weathercode).icon,
      description: getWeatherInfo(item.weathercode).label,
      maxTemp: Math.round(item.temperature_2m_max),
      minTemp: Math.round(item.temperature_2m_min),
      precipitationProbability: item.precipitation_probability_mean,
      estimated: false
    }))
  }

  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T00:00:00`)
  const dates = []
  const current = new Date(start)

  let securityCounter = 0
  while (current <= end && securityCounter < 10) {
    securityCounter++
    const dateKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`
    
    const dayData = daily.find((item) => item.time === dateKey)

    if (dayData) {
      const info = getWeatherInfo(dayData.weathercode)
      dates.push({
        date: dateKey,
        icon: info.icon,
        description: info.label,
        maxTemp: Math.round(dayData.temperature_2m_max),
        minTemp: Math.round(dayData.temperature_2m_min),
        precipitationProbability: dayData.precipitation_probability_mean,
        estimated: false
      })
    } else {
      isEstimated.value = true
      
      const monthNum = current.getMonth() + 1
      const dayNum = current.getDate()
      
      const monthlyAverage = {
        1: { min: -6, max: 2, pop: 10 },
        2: { min: -4, max: 5, pop: 15 },
        3: { min: 1, max: 10, pop: 20 },
        4: { min: 8, max: 18, pop: 20 },
        5: { min: 13, max: 24, pop: 25 },
        6: { min: 18, max: 27, pop: 45 },
        7: { min: 22, max: 29, pop: 65 },
        8: { min: 22, max: 30, pop: 50 },
        9: { min: 17, max: 26, pop: 25 },
        10: { min: 10, max: 20, pop: 15 },
        11: { min: 3, max: 12, pop: 20 },
        12: { min: -4, max: 4, pop: 15 }
      }
      
      const avg = monthlyAverage[monthNum] || { min: 15, max: 25, pop: 20 }
      const variance = (dayNum % 3) - 1
      const maxTemp = avg.max + variance
      const minTemp = avg.min + variance
      
      const iconsByMonth = {
        1: [{ i: '❄️', l: '맑고 추움' }, { i: '☁️', l: '추운 겨울날' }, { i: '☀️', l: '건조하고 맑음' }],
        2: [{ i: '🌤️', l: '대체로 맑음' }, { i: '☁️', l: '쌀쌀한 겨울' }, { i: '❄️', l: '가끔 눈' }],
        3: [{ i: '⛅', l: '구름 조금' }, { i: '🌤️', l: '선선한 봄바람' }, { i: '🌦️', l: '봄비 소식' }],
        4: [{ i: '☀️', l: '따뜻하고 맑음' }, { i: '🌤️', l: '쾌청한 봄날씨' }, { i: '⛅', l: '구름 조금' }],
        5: [{ i: '☀️', l: '화창하고 온화함' }, { i: '🌤️', l: '맑고 따뜻함' }, { i: '⛅', l: '쾌적한 구름' }],
        6: [{ i: '🌦️', l: '초여름 소나기' }, { i: '☀️', l: '맑고 무더움' }, { i: '🌧️', l: '흐리고 한때 비' }],
        7: [{ i: '🌧️', l: '장마철 비' }, { i: '⛈️', l: '덥고 습한 소나기' }, { i: '☁️', l: '고온다습 흐림' }],
        8: [{ i: '☀️', l: '한여름 폭염' }, { i: '🌦️', l: '갑작스런 소나기' }, { i: '🌤️', l: '덥고 습함' }],
        9: [{ i: '🌤️', l: '쾌적하고 맑음' }, { i: '☀️', l: '화창한 가을' }, { i: '⛅', l: '구름 조금' }],
        10: [{ i: '☀️', l: '선선하고 맑음' }, { i: '🌤️', l: '쾌청한 가을하늘' }, { i: '🍂', l: '맑고 시원함' }],
        11: [{ i: '☁️', l: '쌀쌀하고 흐림' }, { i: '⛅', l: '찬바람 붊' }, { i: '🌧️', l: '흐리고 가을비' }],
        12: [{ i: '❄️', l: '눈 내리는 추위' }, { i: '☁️', l: '매우 흐림' }, { i: '🌤️', l: '맑고 강추위' }]
      }
      
      const iconList = iconsByMonth[monthNum] || [{ i: '🌈', l: '기후 평균 데이터' }]
      const picked = iconList[dayNum % iconList.length]
      
      dates.push({
        date: dateKey,
        icon: picked.i,
        description: picked.l,
        maxTemp,
        minTemp,
        precipitationProbability: avg.pop,
        estimated: true
      })
    }
    
    current.setDate(current.getDate() + 1)
  }

  return dates
}

const loadWeather = async () => {
  loading.value = true
  error.value = ''

  try {
    const geocodeResponse = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=Seoul&count=1&language=ko&format=json')
    const geocodeData = await geocodeResponse.json()
    const location = geocodeData.results?.[0]

    if (!location) {
      throw new Error('서울 위치를 찾지 못했습니다.')
    }

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&hourly=temperature_2m,weathercode,precipitation_probability,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_mean&timezone=Asia%2FSeoul&forecast_days=7`
    )
    const weatherJson = await weatherResponse.json()

    const daily = weatherJson.daily || {}

    weatherData.value = {
      tripDays: createTripDays(daily.time?.map((time, index) => ({
        time,
        weathercode: daily.weathercode?.[index],
        temperature_2m_max: daily.temperature_2m_max?.[index],
        temperature_2m_min: daily.temperature_2m_min?.[index],
        precipitation_probability_mean: daily.precipitation_probability_mean?.[index]
      })) || [], props.travelInfo?.startDate, props.travelInfo?.endDate)
    }
  } catch (e) {
    console.error(e)
    error.value = '날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadWeather()
})

watch(() => props.travelInfo, () => {
  loadWeather()
}, { deep: true })
</script>

<style scoped>
.weather-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f6ff 100%);
  border: 1px solid rgba(155, 124, 255, 0.16);
  border-radius: 18px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 10px 30px rgba(24, 16, 40, 0.05);
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: #9b7cff;
  background: rgba(155, 124, 255, 0.08);
  padding: 4px 10px;
  border-radius: 999px;
  margin-bottom: 6px;
}

.weather-card h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.weather-status {
  font-size: 12px;
  color: #736077;
}

.weather-loading,
.weather-error {
  font-size: 13px;
  color: #736077;
}

.weather-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.weather-estimated-notice {
  background: rgba(155, 124, 255, 0.04);
  border: 1px dashed rgba(155, 124, 255, 0.25);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 12px;
  line-height: 1.5;
  color: #5e4680;
  text-align: left;
}

.forecast-list {
  display: grid;
  gap: 10px;
}

.forecast-item {
  display: grid;
  grid-template-columns: 1.1fr 0.6fr 1fr 0.5fr;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  font-size: 13px;
}

.forecast-date {
  font-weight: 700;
}

.forecast-icon {
  font-size: 18px;
  text-align: center;
}

.forecast-temp {
  font-weight: 700;
}

.forecast-pop {
  text-align: right;
  color: #736077;
}

@media (max-width: 640px) {
  .weather-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .forecast-item {
    grid-template-columns: 1fr 0.6fr 0.8fr 0.4fr;
    font-size: 12px;
  }
}
</style>