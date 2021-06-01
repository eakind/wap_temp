<template>
  <div></div>
</template>
<script>
import { getQueryVariable } from '@/utils/check.js';
export default {
  data () {
    return {};
  },
  mounted () {
    const authorization = getQueryVariable('Authorization');
    const curRouter = getQueryVariable('route');
    if (authorization) {
      localStorage.setItem('dcBIUserToken', authorization);
    }
    if (curRouter) {
      window.location.assign(decodeURIComponent(curRouter));
    }
  }
};
</script>