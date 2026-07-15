<template>
  <section class="survey-section">
    <h2>{{ title }}</h2>
    <div class="option-list">
      <label v-for="option in options" :key="option" class="option-card">
        <input
          type="radio"
          :name="groupName"
          :checked="modelValue === option"
          @change="emit('update:modelValue', option)"
        />
        <span>{{ option }}</span>
      </label>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: String,
  options: Array,
  modelValue: String,
  groupName: String
});
const emit = defineEmits(['update:modelValue']);
</script>

<style scoped>
.survey-section { background: rgba(255,255,255,0.86); border:1px solid rgba(155,124,255,0.12); border-radius:20px; padding:20px; box-shadow:0 10px 28px rgba(24,16,40,0.06); }
.survey-section h2 { margin:0 0 12px; font-size:18px; color:#3d2f4d; }
.option-list { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; align-items:center; text-align:center; }
.option-card { display:inline-flex; align-items:center; gap:8px; padding:10px 12px; border-radius:999px; border:1px solid #e8dcf8; background:#fbf8ff; color:#4f3a61; cursor:pointer; }
.option-card input { accent-color:#8d5fe0; }
</style>