import Vue from 'vue';
import App from './App.vue';
import store from './store/index.js';
import router from './router/index.js';

import './style/common.scss';
import './style/icon/iconfont.js';

import dcLoading from '@/plugin/loading/index.js';

Vue.config.productionTip = false;

Vue.use(dcLoading);

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');
