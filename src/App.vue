<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  created() {
    //localStorage.getItem('projectId'); //
    // let projectId =localStorage.getItem('projectId'); //'7fb40088817011eb821a0242ac12000e'; //;
    // localStorage.setItem('projectId', projectId);
    let curLocation = window.location.href;
    let projectId = '';
    if (curLocation.indexOf('aiManager') >=0) {
      projectId = curLocation.split('aiManager=')[1];
      localStorage.setItem('projectId', projectId);
    }
    this.setProjectId(projectId);
  },
  methods: {
    ...mapMutations('dashboard', ['setProjectId']),
  },
};
</script>
<style lang="scss" scoped>
#app {
  width: 100%;
  height: 100%;
}
</style>
