$home = @'
<template>
  <div class="home-root">
    <header class="hero">
      <img class="hero-img" :src="hero" alt="hero" />
      <div class="hero-overlay">
        <h1>서울, 당신만의 여행지</h1>
        <p style="color: var(--muted); font-weight: 600; text-shadow: 0 1px 2px rgba(255,255,255,0.8);">
  분위기별로 골라보는 추천 코스
</p>
      </div>
    </header>

    <section class="controls">
      <CategoryTabs :tabs="tabs" :selected="activeCategory" @update:selected="activeCategory = $event" />
      <SearchBar :query="query" @update:query="query = $event" />
    </section>

    <section class="list">
      <PlaceCard
        v-for="place in filtered"
        :key="place.id || place.name"
        :place="place"
      />
      <div v-if="!filtered.length" class="empty">검색 결과가 없습니다.</div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import CategoryTabs from '../components/CategoryTabs.vue';
import SearchBar from '../components/SearchBar.vue';
import PlaceCard from '../components/PlaceCard.vue';
import heroImg from '../assets/hero.png';

const hero = heroImg;
const tabs = ['전체', '힐링', '미식', '역사', '쇼핑'];
const activeCategory = ref('전체');
const query = ref('');

const samplePlaces = [
  { id: 1, name: '한강공원', category: '힐링', desc: '강변 산책하기 좋은 곳', img: '' },
  { id: 2, name: '광장시장', category: '미식', desc: '전통 먹거리 가득', img: '' },
  { id: 3, name: '경복궁', category: '역사', desc: '조선의 궁궐', img: '' },
  { id: 4, name: '명동', category: '쇼핑', desc: '쇼핑과 길거리 음식', img: '' }
];

const places = ref(samplePlaces);

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  return places.value.filter(p => {
    const matchCat = activeCategory.value === '전체' || p.category === activeCategory.value;
    const matchQ = !q || (p.name && p.name.toLowerCase().includes(q)) || (p.desc && p.desc.toLowerCase().includes(q));
    return matchCat && matchQ;
  });
});
</script>

<style scoped>
.home-root { padding: 18px; max-width:1100px; margin:0 auto; }
.hero { position:relative; border-radius:12px; overflow:hidden; }
.hero-img { width:100%; height:220px; object-fit:cover; display:block; filter:contrast(1.05); }
.hero-overlay { position:absolute; left:24px; bottom:20px; color:#fff; text-shadow:0 6px 18px rgba(0,0,0,0.35); }
.hero-overlay h1 { margin:0; font-size:28px; }
.controls { display:flex; gap:16px; align-items:center; margin:18px 0; flex-wrap:wrap; }
.list { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:16px; }
.empty { grid-column:1/-1; text-align:center; color:#666; padding:28px 0; }
@media (max-width:760px){ .hero-img{height:160px} .hero-overlay h1{font-size:20px} }
</style>
'@

$home | Out-File -FilePath .\src\Home.vue -Encoding utf8