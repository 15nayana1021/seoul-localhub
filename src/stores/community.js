import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCommunityStore = defineStore('community', () => {
  // 1. 로컬스토리지에서 기존 게시글 목록 불러오기 (없으면 빈 배열로 초기화)
  const posts = ref(JSON.parse(localStorage.getItem('localhub_posts')) || [])

  // 2. 현재 선택된 카테고리 필터링을 위한 상태 (기본값: 'all')
  const currentCategory = ref('all')

  // 3. 로컬스토리이에 데이터를 안전하게 동기화(저장)하는 내부 헬퍼 함수
  const saveToLocalStorage = () => {
    localStorage.setItem('localhub_posts', JSON.stringify(posts.value))
  }

  // 4. [조회 - Read] 카테고리별로 필터링된 게시글 목록 (최신순 정렬)
  const filteredPosts = computed(() => {
    let list = [...posts.value]
    
    // 카테고리 필터링 ('all'이 아닐 경우 필터 적용)
    if (currentCategory.value !== 'all') {
      list = list.filter(post => post.category === currentCategory.value)
    }
    
    // 최근에 작성한 글이 가장 위로 오도록 내림차순 정렬 (ID 또는 작성일 기준)
    return list.sort((a, b) => b.createdAt - a.createdAt)
  })

  // 5. [단일 조회 - Read Detail] 특정 게시글 ID로 찾기
  const getPostById = (id) => {
    return posts.value.find(post => post.id === id)
  }

  // 6. [작성 - Create] 신규 익명 게시글 등록
  const createPost = ({ title, content, password, category }) => {
    const newPost = {
      id: Date.now().toString(), // 고유 ID 생성 (타임스탬프 문자열)
      title,
      content,
      password, // 익명 비밀번호 (RFP 요구에 의해 암호화 없이 저장)
      category,
      createdAt: Date.now() // 작성일 타임스탬프
    }

    posts.value.push(newPost)
    saveToLocalStorage()
    return { success: true, post: newPost }
  }

  // 7. [비밀번호 확인 - Password Verification]
  const verifyPassword = (id, inputPassword) => {
    const post = getPostById(id)
    if (!post) return false
    return post.password === inputPassword
  }

  // 8. [수정 - Update] 비밀번호 검증 후 게시글 수정
  const updatePost = (id, { title, content, password }) => {
    const postIndex = posts.value.findIndex(p => p.id === id)
    if (postIndex === -1) {
      return { success: false, message: '존재하지 않는 게시글입니다.' }
    }

    // 비밀번호 일치 여부 확인
    if (posts.value[postIndex].password !== password) {
      return { success: false, message: '비밀번호가 일치하지 않습니다.' }
    }

    // 데이터 업데이트 (카테고리, 작성일, 비밀번호는 기존 정보 유지)
    posts.value[postIndex] = {
      ...posts.value[postIndex],
      title,
      content
    }

    saveToLocalStorage()
    return { success: true }
  }

  // 9. [삭제 - Delete] 비밀번호 검증 후 게시글 삭제
  const deletePost = (id, password) => {
    const postIndex = posts.value.findIndex(p => p.id === id)
    if (postIndex === -1) {
      return { success: false, message: '존재하지 않는 게시글입니다.' }
    }

    // 비밀번호 일치 여부 확인
    if (posts.value[postIndex].password !== password) {
      return { success: false, message: '비밀번호가 일치하지 않습니다.' }
    }

    // 해당 게시글을 제외하고 필터링
    posts.value.splice(postIndex, 1)
    saveToLocalStorage()
    return { success: true }
  }

  // 10. 카테고리 필터 변경 액션
  const setCategory = (category) => {
    currentCategory.value = category
  }

  return {
    posts,
    currentCategory,
    filteredPosts,
    getPostById,
    createPost,
    verifyPassword,
    updatePost,
    deletePost,
    setCategory
  }
})