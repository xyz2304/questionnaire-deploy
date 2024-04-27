import { createRouter, createWebHistory } from 'vue-router'
import AccueilView from '@/views/AccueilView.vue'
import EleveView from '@/views/EleveView.vue'
import ParentView from '@/views/ParentView.vue'
import ConnexionView from '@/views/ConnexionView.vue'
import VideoView from '@/views/VideoView.vue'
const routes = [

  {
    path: '/questionnaire-deploy/',
    name: 'الصفحة الرّئيسية',
    component: AccueilView,
    meta: { jsonName: 'NavBarAccueilData.json' }
  },
  {
    path: '/questionnaire-deploy/connexion',
    name: 'تسجيل',
    component: ConnexionView,
    meta: { jsonName: 'NavBarConnexionData.json' }
  },
  {
    path: '/questionnaire-deploy/eleve',
    name: 'تلميذ',
    component: EleveView,
    meta: { jsonName: 'NavBarEleveData.json' }
  },
  {
    path: '/questionnaire-deploy/parent',
    name: 'وليّ',
    component: ParentView,
    meta: { jsonName: 'NavBarParentData.json' }
  },
  {
    path: '/questionnaire-deploy/video',
    name: 'فيديو',
    component: VideoView,
    meta: { jsonName: 'NavBarEleveData.json' }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
