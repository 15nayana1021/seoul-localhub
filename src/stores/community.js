import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCommunityStore = defineStore('community', () => {
  const posts = ref(JSON.parse(localStorage.getItem('localhub_posts')) || [])

  const currentCategory = ref('all')

  const saveToLocalStorage = () => {
    localStorage.setItem('localhub_posts', JSON.stringify(posts.value))
  }

  const filteredPosts = computed(() => {
    let list = [...posts.value]
    
    if (currentCategory.value !== 'all') {
      list = list.filter(post => post.category === currentCategory.value)
    }
    
    return list.sort((a, b) => b.createdAt - a.createdAt)
  })

  const getPostById = (id) => {
    return posts.value.find(post => post.id === id)
  }

  const createPost = ({ title, content, password, category, image }) => {
    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      password,
      category,
      image: image || '',
      createdAt: Date.now()
    }

    posts.value.push(newPost)
    saveToLocalStorage()
    return { success: true, post: newPost }
  }

  const verifyPassword = (id, inputPassword) => {
    const post = getPostById(id)
    if (!post) return false
    return post.password === inputPassword
  }

  const updatePost = (id, { title, content, password, image }) => {
    const postIndex = posts.value.findIndex(p => p.id === id)
    if (postIndex === -1) {
      return { success: false, message: '존재하지 않는 게시글입니다.' }
    }

    if (posts.value[postIndex].password !== password) {
      return { success: false, message: '비밀번호가 일치하지 않습니다.' }
    }

    posts.value[postIndex] = {
      ...posts.value[postIndex],
      title,
      content,
      image: image !== undefined ? image : posts.value[postIndex].image // 🌟 이미지 업데이트 반영
    }

    saveToLocalStorage()
    return { success: true }
  }

  const deletePost = (id, password) => {
    const postIndex = posts.value.findIndex(p => p.id === id)
    if (postIndex === -1) {
      return { success: false, message: '존재하지 않는 게시글입니다.' }
    }

    if (posts.value[postIndex].password !== password) {
      return { success: false, message: '비밀번호가 일치하지 않습니다.' }
    }

    posts.value.splice(postIndex, 1)
    saveToLocalStorage()
    return { success: true }
  }

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