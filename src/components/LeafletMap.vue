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
  activeItem: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['select-item'])

const mapContainer = ref(null)
let mapInstance = null
let markerGroup = null
const markersMap = new Map()

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
  markersMap.clear()

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

    marker.on('click', () => {
      marker.openPopup()
      emit('select-item', item)
    })

    markerGroup.addLayer(marker)
    
    const uniqueId = item.id || item.title
    markersMap.set(uniqueId, marker)
    
    latLngs.push([lat, lng])
  });

  if (latLngs.length > 0 && !props.activeItem) {
    const bounds = L.latLngBounds(latLngs)
    mapInstance.fitBounds(bounds, { padding: [50, 50] })
  }
}

watch(() => props.activeItem, (newItem) => {
  if (!mapInstance || !newItem) return

  const lat = parseFloat(newItem.mapy)
  const lng = parseFloat(newItem.mapx)

  if (isNaN(lat) || !lat || isNaN(lng) || !lng) return

  mapInstance.flyTo([lat, lng], 15, {
    animate: true,
    duration: 1.5
  })

  const uniqueId = newItem.id || newItem.title
  const targetMarker = markersMap.get(uniqueId)
  if (targetMarker) {
    setTimeout(() => {
      targetMarker.openPopup()
    }, 1500)
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