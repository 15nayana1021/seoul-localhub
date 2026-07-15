import { createRouter, createWebHistory } from 'vue-router'

// 컴포넌트들을 가져옵니다
import Home from '../views/Home.vue'
import BoardList from '../views/BoardList.vue'
import BoardDetail from '../views/BoardDetail.vue'
import BoardWrite from '../views/BoardWrite.vue'
import SurveyPage from '../views/SurveyPage.vue'
import ResultPage from '../views/ResultPage.vue'
import SurveyParent from '../views/SurveyParent.vue'
import SurveyFollowup from '../views/SurveyFollowup.vue'

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
    /* 🌟 [순서 조정] /board/write가 정적 경로이므로 아래의 동적 ID 와일드카드(:id) 매칭보다 
      상단에 위치하게 배치하여 글쓰기 진입 시 상세 페이지로 오작동하는 불상사를 예방합니다!
    */
    path: '/board/write',
    name: 'board-write',
    component: BoardWrite
  },
  {
    path: '/board/:id',
    name: 'board-detail',
    component: BoardDetail,
    props: true
  },
  {
    path: '/survey',
    name: 'survey',
    component: SurveyParent
  },
  {
    path: '/survey/followup',
    name: 'survey-followup',
    component: SurveyFollowup
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