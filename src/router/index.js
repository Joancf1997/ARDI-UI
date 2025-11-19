import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue';

const routes = [
  { path: '/auth/login', name: 'login', component: () => import('@/views/pages/auth/loginView.vue'), meta: {requiresAuth: false} },
  { path: '/pages/notfound', name: 'notfound', component: () => import('@/views/pages/NotFound.vue'), meta: {requiresAuth: false} },
  { path: '/auth/access', name: 'accessDenied', component: () => import('@/views/pages/auth/Access.vue'), meta: {requiresAuth: false} },
  { path: '/auth/error', name: 'error', component: () => import('@/views/pages/auth/Error.vue'), meta: {requiresAuth: false} },
  {
    path: '/',
    component: AppLayout,
    name: 'Home',
    children: [
      { path: '/chats', name: 'chats', component: () => import('@/views/chats.vue'), meta: {requiresAuth: true} },
      { path: '/users', name: 'users', component: () => import('@/views/users.vue'), meta: {requiresAuth: true} },
      { path: '/userSegments', name: 'userSegments', component: () => import('@/views/UserSegments.vue'), meta: { requiresAuth: true } },
      { path: '/datasetEvaluation', name: 'datasetEvaluation', component: () => import('@/views/DatasetEvaluation.vue'), meta: { requiresAuth: true } },
      { path: '/userSegmentsDetails/:id', name: 'userSegmentsDetails', component: () => import('@/views/UserSegmentsDetail.vue'), meta: {requiresAuth: true} }
    ]
  }


]

const router = createRouter({
  history: createWebHistory(),
  routes
})

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}


// Guard the routes 
router.beforeEach((to, _) => {

  var userauth = JSON.parse(window.localStorage.getItem('ardiUserData'));
  // Validar token existente
  if (userauth) {
    const jwtPayload = parseJwt(userauth.token);
    if (jwtPayload.exp < Date.now()/1000) {
      window.localStorage.removeItem('ardiUserData')
      router.push({name: 'login'});
    }
  } else {
    if(to.name != "login"){ 
      router.push({name: 'login'});
      return;
    }
  }
})

export default router
