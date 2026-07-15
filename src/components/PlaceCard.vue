<template>
  <article class="card">
    <div class="thumb" v-if="place.img">
      <img :src="place.img" :alt="place.name" />
    </div>
    <div class="body">
      <h4 class="name">{{ place.name }}</h4>
      <div class="meta">{{ place.category }} · {{ place.desc }}</div>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  place: { type: Object, required: true }
});
</script>

<style scoped>
.card { background:#fff; border-radius:10px; padding:12px; box-shadow:0 8px 22px rgba(24,16,40,0.04); display:flex; gap:12px; align-items:center; }
.thumb img { width:84px; height:64px; object-fit:cover; border-radius:8px; }
.name { margin:0; font-size:16px; }
.meta { color:#777; font-size:13px; margin-top:6px; }
</style>