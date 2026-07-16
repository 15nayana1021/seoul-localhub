import { createRouter, createWebHistory } from 'vue-router'

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