import { initLabelsList } from '../../utils/draw/baseConfig';
import dcLoading from './src/index.vue';
dcLoading.install = function(Vue) {
  let Cons = Vue.extend(dcLoading);
  let ins = new Cons();
  ins.$mount(document.createElement('div'));
  document.body.appendChild(ins.$el);
  Vue.prototype.$showLoading = function() {
    ins.show = true;

    setTimeout(() => {
      ins.show = false;
    }, 1500);
  };
  Vue.prototype.$hideLoading = function() {
    ins.show = false;
  };
};
export default dcLoading;
