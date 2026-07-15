<template>
  <div class="map-wrapper">
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  },
  // 🌟 [추가] 부모 컴포넌트(Home.vue)에서 리스트 카드를 클릭했을 때 날아갈 좌표 타겟
  activeItem: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['select-item'])

const mapContainer = ref(null)
let mapInstance = null
let markerGroup = null
const markersMap = new Map() // 🌟 마커 객체들을 저장해둘 맵 (동적 팝업 제어용)

const fixDefaultIcon = () => {
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  })
}

const initMap = () => {
  fixDefaultIcon()

  mapInstance = L.map(mapContainer.value).setView([37.5665, 126.9780], 11)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapInstance)

  markerGroup = L.layerGroup().addTo(mapInstance)

  updateMarkers()

  nextTick(() => {
    setTimeout(() => {
      if (mapInstance) {
        mapInstance.invalidateSize()
      }
    }, 200)
  })
}

const updateMarkers = () => {
  if (!mapInstance || !markerGroup) return

  markerGroup.clearLayers()
  markersMap.clear() // 마커 저장소 비우기

  if (!props.items || !props.items.length) return

  const latLngs = []

  props.items.forEach(item => {
    const lat = parseFloat(item.mapy)
    const lng = parseFloat(item.mapx)

    if (isNaN(lat) || !lat || isNaN(lng) || !lng) return

    const marker = L.marker([lat, lng])

    const popupContent = `
      <div style="font-family: sans-serif; padding: 2px; width: 150px;">
        <p style="font-weight: bold; margin: 0 0 4px 0; border-bottom: 1px solid #eee; padding-bottom: 4px; color: #111;">${item.title}</p>
        <p style="color: #666; margin: 0; font-size: 11px;">${item.addr1 || '상세주소 없음'}</p>
      </div>
    `
    marker.bindPopup(popupContent)

    // 마커 클릭 시 동작
    marker.on('click', () => {
      marker.openPopup()
      emit('select-item', item) // 🌟 부모에게 해당 장소 데이터 전달
    })

    markerGroup.addLayer(marker)
    
    // 장소의 고유 ID(없다면 제목)를 Key로 마커 객체 보관
    const uniqueId = item.id || item.title
    markersMap.set(uniqueId, marker)
    
    latLngs.push([lat, lng])
  });

  if (latLngs.length > 0 && !props.activeItem) {
    const bounds = L.latLngBounds(latLngs)
    mapInstance.fitBounds(bounds, { padding: [50, 50] })
  }
}

// 🌟 [인터랙션 고도화] 부모 컴포넌트에서 특정 카드를 눌러 activeItem이 변경되면 지도를 비행(flyTo) 시킵니다.
watch(() => props.activeItem, (newItem) => {
  if (!mapInstance || !newItem) return

  const lat = parseFloat(newItem.mapy)
  const lng = parseFloat(newItem.mapx)

  if (isNaN(lat) || !lat || isNaN(lng) || !lng) return

  // 1. 해당 좌표로 부드럽게 지도를 확대 이동 시킵니다. (좌표, 줌 레벨, 이동 옵션)
  mapInstance.flyTo([lat, lng], 15, {
    animate: true,
    duration: 1.5 // 이동 지속시간 (초 단위)
  })

  // 2. 이동 후 팝업 자동 열기
  const uniqueId = newItem.id || newItem.title
  const targetMarker = markersMap.get(uniqueId)
  if (targetMarker) {
    setTimeout(() => {
      targetMarker.openPopup()
    }, 1500) // 비행이 끝날 때쯤(1.5초 후) 팝업을 열어 깔끔하게 노출
  }
}, { deep: true })

watch(() => props.items, () => {
  updateMarkers()
}, { deep: true })

onMounted(() => {
  initMap()
})
</script>

<style scoped>
.map-wrapper {
  position: relative;
  width: 100%;
  height: 450px;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(155, 124, 255, 0.15);
}

.map-container {
  width: 100%;
  height: 100%;
  min-height: 450px;
  background-color: #f3f4f6;
}
</style>