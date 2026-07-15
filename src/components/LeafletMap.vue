<template>
  <div class="map-wrapper">
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, defineProps, defineEmits } from 'vue'
import L from 'leaflet'
// Leaflet 스타일시트 직접 임포트 (지도 타일이 깨지지 않게 해줍니다)
import 'leaflet/dist/leaflet.css'

// 부모 컴포넌트로부터 전달받을 좌표 아이템 리스트 (서울 공공데이터 items)
const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  }
})

// 부모(App.vue)에게 클릭된 장소를 전달하기 위한 Emit 정의
const emit = defineEmits(['select-item'])

const mapContainer = ref(null)
let mapInstance = null
let markerGroup = null // 마커들을 묶어서 관리할 레이어 그룹

// 💡 Leaflet 기본 마커 아이콘이 깨지는 고질적인 버그를 해결하는 설정입니다.
const fixDefaultIcon = () => {
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  })
}

// 1. 지도 초기화 함수
const initMap = () => {
  fixDefaultIcon()

  // 서울 시청 좌표 기준(37.5665, 126.9780)으로 지도 생성
  mapInstance = L.map(mapContainer.value).setView([37.5665, 126.9780], 11)

  // 전세계 오픈 소스 지도 타일(OpenStreetMap) 추가
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapInstance)

  // 마커들을 담을 레이어 그룹 생성 및 지도에 탑재
  markerGroup = L.layerGroup().addTo(mapInstance)

  // 최초 데이터가 넘어왔다면 마커 그리기 실행
  updateMarkers()

  // 🌟 [안전장치] Vue 렌더링 타이밍 차이로 지도가 회색으로 깨져 보일 때 크기를 강제 재조정합니다.
  nextTick(() => {
    setTimeout(() => {
      if (mapInstance) {
        mapInstance.invalidateSize()
      }
    }, 200)
  })
}

// 2. 공공데이터 위/경도를 마커로 지도 위에 핀 꼽기
const updateMarkers = () => {
  if (!mapInstance || !markerGroup) return

  // 기존에 그려진 마커들 싹 지우기
  markerGroup.clearLayers()

  if (!props.items || !props.items.length) return

  const latLngs = []

  props.items.forEach(item => {
    // 공공데이터 스키마의 mapy(위도), mapx(경도) 추출
    const lat = parseFloat(item.mapy)
    const lng = parseFloat(item.mapx)

    if (isNaN(lat) || !lat || isNaN(lng) || !lng) return

    // Leaflet 전용 좌표 객체 생성 및 마커 생성
    const marker = L.marker([lat, lng])

    // 마커 클릭 시 띄울 팝업(인포윈도우) 세팅 및 이벤트 바인딩
    const popupContent = `
      <div style="font-family: sans-serif; padding: 2px;">
        <p style="font-weight: bold; margin: 0 0 4px 0; border-bottom: 1px solid #eee; padding-bottom: 4px; color: #111;">${item.title}</p>
        <p style="color: #666; margin: 0; font-size: 11px;">${item.addr1 || '상세주소 없음'}</p>
      </div>
    `
    marker.bindPopup(popupContent)

    // 마커 클릭 시 동작 정의
    marker.on('click', () => {
      marker.openPopup()
      emit('select-item', item)
    })

    // 마커를 그룹 레이어에 추가
    markerGroup.addLayer(marker)
    latLngs.push([lat, lng])
  });

  // 3. 생성된 마커 핀들이 모두 한 화면에 알맞게 들어오도록 줌 레벨 자동 조정
  if (latLngs.length > 0) {
    const bounds = L.latLngBounds(latLngs)
    mapInstance.fitBounds(bounds, { padding: [50, 50] })
  }
}

// 카테고리가 바뀌어 리스트가 변경되면 마커 재렌더링
watch(() => props.items, () => {
  updateMarkers()
}, { deep: true })

onMounted(() => {
  initMap()
})
</script>

<style scoped>
/* 🟢 테일윈드 대신 사용할 표준 CSS 높이 설정 */
.map-wrapper {
  position: relative;
  width: 100%;
  height: 450px; /* 지도가 보일 확실한 세로 높이 고정! */
  border-radius: 14px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(155, 124, 255, 0.15);
}

.map-container {
  width: 100%;
  height: 100%;
  min-height: 450px;
  background-color: #f3f4f6; /* 지도 로드 전 연회색 배경 처리 */
}
</style>