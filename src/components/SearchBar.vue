<template>
  <div class="search-bar-container">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      placeholder="장소 이름 또는 설명으로 검색"
      class="search-input"
    />
    <button 
      type="button" 
      @click="$emit('clear')" 
      class="clear-button"
    >
      초기화
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue', 'clear']);
</script>

<style scoped>
.search-bar-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.search-input {
  padding: 8px 16px;
  border: 1px solid rgba(155, 124, 255, 0.2);
  border-radius: 999px;
  font-size: 14px;
  outline: none;
  background-color: #fff;
  transition: all 0.2s ease;
  width: 240px;
}

.search-input:focus {
  border-color: #9b7cff;
  box-shadow: 0 0 0 2px rgba(155, 124, 255, 0.15);
  outline: none;
}

.clear-button {
  background: #f3f4f6;
  color: #4b5563;
  border: none;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.clear-button:hover {
  background: #e5e7eb;
}
</style>