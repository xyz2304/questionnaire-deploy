import { createRouter, createWebHistory } from 'vue-router'
import AccueilView from '../views/AccueilView.vue'
import EleveView from '../views/EleveView.vue'
import ParentView from '../views/ParentView.vue'
import ConnexionView from '../views/ConnexionView.vue'
const routes = [
  {
    path: '/',
    redirect: '/accueil'  // Redirige directement la racine vers Accueil
  },
  {
    path: '/accueil',
    name: 'الصفحة الرّئيسية',
    component: AccueilView,
    meta: { jsonName: 'NavBarAccueilData.json' }
  },
  {
    path: '/connexion',
    name: 'تسجيل',
    component: ConnexionView,
    meta: { jsonName: 'NavBarConnexionData.json' }
  },
  {
    path: '/eleve',
    name: 'تلميذ',
    component: EleveView,
    meta: { jsonName: 'NavBarEleveData.json' }
  },
  {
    path: '/parent',
    name: 'وليّ',
    component: ParentView,
    meta: { jsonName: 'NavBarParentData.json' }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
