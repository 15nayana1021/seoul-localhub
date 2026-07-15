import { createRouter, createWebHistory } from 'vue-router'

// 1. 팀원 A님이 만든 뼈대 컴포넌트들을 가져옵니다 (경로에 맞게 수정 필요!)
import Home from '../views/Home.vue'
import BoardList from '../views/BoardList.vue'
import BoardDetail from '../views/BoardDetail.vue'
import BoardWrite from '../views/BoardWrite.vue'
import SurveyPage from '../views/SurveyPage.vue'
import ResultPage from '../views/ResultPage.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/board',
    name: 'board-list',
    component: BoardList
  },
  {
    path: '/board/:id',
    name: 'board-detail',
    component: BoardDetail,
    props: true
  },
  {
    path: '/board/write',
    name: 'board-write',
    component: BoardWrite
  },
  {
    path: '/survey',
    name: 'survey',
    component: SurveyPage
  },
  {
    path: '/result',
    name: 'result',
    component: ResultPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router