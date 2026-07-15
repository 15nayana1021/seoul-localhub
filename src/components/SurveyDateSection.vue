<template>
  <section class="survey-section">
    <h2>여행 일자</h2>
    <div class="date-grid">
      <label class="field-card">
        <span>출발일</span>
        <input type="date" v-model="localStart" />
      </label>
      <label class="field-card">
        <span>도착일</span>
        <input type="date" v-model="localEnd" />
      </label>
    </div>
    <p class="stay-summary">{{ stayText }}</p>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  startDate: String,
  endDate: String,
  stayText: String
});

const emit = defineEmits(['update:startDate', 'update:endDate']);

const localStart = computed({
  get: () => props.startDate ?? '',
  set: (val) => emit('update:startDate', val)
});

const localEnd = computed({
  get: () => props.endDate ?? '',
  set: (val) => emit('update:endDate', val)
});
</script>

<style scoped>
.survey-section { background: rgba(255,255,255,0.86); border:1px solid rgba(155,124,255,0.12); border-radius:20px; padding:20px; box-shadow:0 10px 28px rgba(24,16,40,0.06); }
.survey-section h2 { margin:0 0 12px; font-size:18px; color:#3d2f4d; }
.date-grid { display:grid; gap:14px; grid-template-columns:repeat(2,minmax(0,1fr)); justify-items:center; }
.field-card { display:flex; flex-direction:column; gap:8px; font-size:14px; color:#5e506a; align-items:center; }
.field-card input[type="date"] { border:1px solid #e5dff2; border-radius:12px; padding:10px 12px; background:#fff; cursor:pointer; }
.field-card input[type="date"]::-webkit-calendar-picker-indicator { cursor:pointer; }
.stay-summary { margin:12px 0 0; font-size:15px; font-weight:700; color:#8d5fe0; }
@media (max-width:640px){ .date-grid{ grid-template-columns:1fr; } }
</style>