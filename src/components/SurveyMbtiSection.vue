<template>
  <section class="survey-section">
    <h2>MBTI</h2>
    <label class="field-card">
      <span>본인의 MBTI를 입력해 주세요</span>
      <input type="text" :value="modelValue" placeholder="예: ENFP" @input="emit('update:modelValue', $event.target.value)" />
    </label>
  </section>
</template>

<script setup>
defineProps({ modelValue: String });
const emit = defineEmits(['update:modelValue']);
</script>

<style scoped>
.survey-section { background: rgba(255,255,255,0.86); border:1px solid rgba(155,124,255,0.12); border-radius:20px; padding:20px; box-shadow:0 10px 28px rgba(24,16,40,0.06); }
.survey-section h2 { margin:0 0 12px; font-size:18px; color:#3d2f4d; }
.field-card { display:flex; flex-direction:column; gap:8px; font-size:14px; color:#5e506a; align-items:center; }
.field-card input { border:1px solid #e5dff2; border-radius:12px; padding:10px 12px; font:inherit; color:#2f2339; background:#fff; max-width:220px; width:100%; box-sizing:border-box; text-align:center; }
</style>