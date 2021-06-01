<template>
  <div class="mc-chart" :id="id"></div>
</template>
<script>
export default {
  props: ['id'],
};
</script>
<style lang="scss" scoped>
.mc-chart{
  // overflow: hidden;
  position: relative;
}
</style>