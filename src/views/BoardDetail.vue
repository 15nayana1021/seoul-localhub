<template>
  <div class="p-6 max-w-xl mx-auto border rounded shadow">
    <h1 class="text-2xl font-bold">제목이 여기 들어옵니다</h1>
    <p class="text-gray-500 mt-2">작성일: 2026-07-14</p>
    <div class="mt-6">내용이 아주 상세하게 들어올 자리입니다.</div>
    <button @click="$emit('back')" class="mt-6 bg-gray-200 px-4 py-2 rounded">목록으로</button>
  </div>
</template>