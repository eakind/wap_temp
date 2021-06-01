import VueRouter from 'vue-router';
import Vue from 'vue';

Vue.use(VueRouter);

let routes = [
  {
    path: '/',
    component: () => import('../views/home.vue'),
    // beforeEnter: (tp, from, next) => {
    //   if (
    //     !localStorage.getItem('projectId') ||
    //     !localStorage.getItem('dcUserToken')
    //   ) {
    //     window.location.href = '/dist-dcee/#/';
    //   }else{
    //      next();
    //   }
    // },
  }, {
    path: '/authority',
    component: () => import('../views/authority.vue')
  }
  , {
    path: '/Login',
    component: () => import('../views/login.vue')
  }
];

const router = new VueRouter({
  routes,
});

export default router;
