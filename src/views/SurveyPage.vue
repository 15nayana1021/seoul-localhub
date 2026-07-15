<template>
  <div class="survey-root">
    <div class="blobs" aria-hidden="true">
      <div class="blob b1"></div>
      <div class="blob b2"></div>
      <div class="blob b3"></div>
    </div>

    <div class="card">
      <header class="card-head">
        <h2 class="title">서울 여행 성향 테스트</h2>
        <p class="subtitle">나에게 딱 맞는 여행지를 찾아보세요</p>
      </header>

      <div class="progress-wrap" aria-hidden="true">
        <div class="progress-line">
          <div class="progress-fill" :style="{ width: ((step + 1) / questions.length) * 100 + '%' }"></div>
        </div>
        <div class="progress-text">{{ step + 1 }} / {{ questions.length }}</div>
      </div>

      <main class="question-area">
        <h3 class="question">{{ questions[step].q }}</h3>

        <div class="options" :class="{ 'two-cols': questions[step].options.length === 2 }">
          <button
            v-for="opt in questions[step].options"
            :key="opt"
            :aria-pressed="selected === opt"
            :class="['opt', { selected: selected === opt }]"
            @click="choose(opt)"
            :disabled="choosing"
          >
            <span class="opt-emoji" v-if="opt === 'YES'">✨</span>
            <span class="opt-emoji" v-else-if="opt === 'NO'">🪄</span>
            <span class="opt-text">{{ opt }}</span>
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

const step = ref(0);
const selected = ref(null);
const choosing = ref(false);

const answers = reactive({
  waiting: '',
  vibe: '',
  energy: '',
  sns: '',
  placeType: ''
});

const questions = [
  { key: 'waiting', q: '맛집에 1시간 기다려도 괜찮다?', options: ['YES', 'NO'] },
  { key: 'vibe', q: '어디를 선호하시나요?', options: ['관광객 맛집', '로컬 맛집'] },
  { key: 'energy', q: '선호하는 여행 스타일은?', options: ['2만 보 랜드마크 투어', '5천 보 쉬엄쉬엄 여행'] },
  { key: 'sns', q: '인스타 스토리 10개 이상 올린다?', options: ['YES', 'NO'] },
  { key: 'placeType', q: '어떤 장소를 더 좋아하시나요?', options: ['유명 관광지', '고즈넉한 동네'] }
];

const persist = () => {
  try { localStorage.setItem('userPreferences', JSON.stringify(answers)); } catch (e) {}
};

const handleAnswer = (key, value) => {
  // 안전하게 기록하고 step을 오버플로우하지 않도록 클램프
  answers[key] = value;
  persist();
  if (step.value < questions.length - 1) {
    step.value = Math.min(step.value + 1, questions.length - 1);
  } else {
    // 마지막 문항 도달 시 (원하면 결과 처리 추가)
    // step은 더 이상 증가하지 않음
  }
};

onMounted(() => {
  try {
    const raw = localStorage.getItem('userPreferences');
    if (raw) {
      const obj = JSON.parse(raw);
      Object.keys(answers).forEach(k => { if (obj[k]) answers[k] = obj[k]; });
    }
  } catch (e) {}
  // 만약 저장된 step이 범위를 벗어나면 마지막 항목으로 정리
  if (step.value < 0 || step.value >= questions.length) step.value = Math.max(0, questions.length - 1);
  selected.value = answers[questions[step.value].key] || null;
});

watch(step, (n) => {
  if (n < 0 || n >= questions.length) {
    selected.value = null;
    return;
  }
  selected.value = answers[questions[n].key] || null;
});

const choose = (opt) => {
  // 중복 클릭 보호 및 현재 질문 캡처
  if (choosing.value) return;
  const current = step.value;
  const q = questions[current];
  if (!q) return;

  selected.value = opt;
  choosing.value = true;

  setTimeout(() => {
    // 선택 후 안전하게 기록 (현재 step이 바뀌었더라도 캡처된 key로 처리)
    handleAnswer(q.key, opt);
    choosing.value = false;
  }, 180);
};
</script>

<style scoped>
:root {
  --bg-card: rgba(255,255,255,0.9);
  --accent-1: #ff8ab6;
  --accent-2: #9b7cff;
  --muted: #736077;
  --text: #241a2c;
  --glass: rgba(255,255,255,0.6);
  --shadow-soft: 0 14px 40px rgba(24,16,40,0.08);
  --radius: 16px;
  --gap: 22px;
  --transition: 240ms cubic-bezier(.2,.9,.3,1);
}

.survey-root{
  min-height: 100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:48px 20px;
  background: linear-gradient(180deg, #fff6fb 0%, #fffdf8 60%);
  position:relative;
  overflow:hidden;
  font-family: 'Noto Sans KR', system-ui, -apple-system, sans-serif;
  color:var(--text);
}

/* decorative blobs */
.blobs { position:absolute; inset:0; pointer-events:none; }
.blob { position:absolute; filter: blur(36px); opacity:0.95; transform: translateZ(0); }
.b1 { width:360px; height:360px; left:-80px; top:-60px; background: radial-gradient(circle at 30% 30%, rgba(155,124,255,0.45), transparent 40%); }
.b2 { width:280px; height:280px; right:-60px; top:40px; background: radial-gradient(circle at 30% 30%, rgba(255,138,182,0.28), transparent 40%); }
.b3 { width:220px; height:220px; left:20%; bottom:-80px; background: radial-gradient(circle at 50% 50%, rgba(255,213,174,0.22), transparent 40%); }

/* card */
.card{
  width:100%;
  max-width:760px;
  background: var(--bg-card);
  border-radius: calc(var(--radius) + 6px);
  padding: 32px;
  box-shadow: var(--shadow-soft);
  border: 1px solid rgba(155,124,255,0.08);
  backdrop-filter: blur(6px) saturate(1.05);
  position:relative;
  z-index:2;
}

/* header */
.card-head { text-align:center; margin-bottom:18px; }
.title { font-size:28px; margin:0; letter-spacing:-0.6px; font-weight:700; color:var(--text); }
.subtitle { margin:8px 0 0; color:var(--muted); font-size:13px; }

/* progress */
.progress-wrap { display:flex; align-items:center; gap:12px; margin:16px 0 18px; }
.progress-line { flex:1; height:10px; background:linear-gradient(90deg, rgba(17,17,17,0.06), rgba(17,17,17,0.03)); border-radius:999px; overflow:hidden; }
.progress-fill { height:100%; background: linear-gradient(90deg, var(--accent-2), var(--accent-1)); border-radius:999px; transition: width 320ms cubic-bezier(.2,.9,.3,1); box-shadow:0 6px 18px rgba(155,124,255,0.12); }
.progress-text { font-size:13px; color:var(--muted); min-width:64px; text-align:right; }

/* question */
.question-area { margin-top:8px; }
.question { font-size:20px; margin:0 0 18px; color:var(--text); line-height:1.3; text-align:center; }

/* options layout *//* options layout */
.options {
  display:flex;
  flex-direction:column;
  gap:var(--gap);
  align-items:center;
  justify-content:center;
}
.options.two-cols {
  flex-direction:row;
  gap:28px;
  justify-content:center;
  flex-wrap:wrap;
}

/* option tile */
.opt {
  display:flex;
  align-items:center;
  gap:14px;
  justify-content:center;
  padding:18px 22px;
  border-radius:14px;
  background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,250,255,0.9));
  border:1px solid rgba(20,14,30,0.04);
  box-shadow: 0 10px 26px rgba(24,16,40,0.06);
  font-weight:600;
  font-size:16px;
  color:var(--text);
  cursor:pointer;
  transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition), background var(--transition);
  user-select:none;
}

/* emoji */
.opt-emoji { font-size:20px; display:inline-block; transform:translateY(2px); }

/* disabled style */
.opt[disabled] { opacity:0.6; pointer-events:none; }

/* selected & hover */
.opt:hover { transform: translateY(-6px) scale(1.01); box-shadow: 0 18px 46px rgba(24,16,40,0.1); }
.opt.selected {
  background: linear-gradient(90deg, rgba(155,124,255,0.18), rgba(255,138,182,0.14));
  border-color: rgba(155,124,255,0.28);
  box-shadow: 0 22px 56px rgba(155,124,255,0.12);
  transform: translateY(-8px) scale(1.02);
}

/* responsive */
@media (max-width:760px) {
  .card { padding:20px; margin:0 12px; }
  .options.two-cols { flex-direction:column; }
  .opt { padding:14px; }
}
</style>