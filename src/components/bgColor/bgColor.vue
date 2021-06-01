<template>
  <div class="bg-color" 
    :class="this.bgColor.index === 15 ? 'bg-image' : ''"
    :style="[{ opacity: setOpacity}]">
   <div class="bg-content"  :style="[{background: setBgColor}]"></div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { colorTemp } from '@/utils/color';
export default {
  data () {
    return {
    };
  },
  computed: {
    ...mapState('dashboard', ['dashboardCss']),
    bgColor () {
      if (this.dashboardCss.bgColor) {
        return this.dashboardCss.bgColor.background;
      }
      return {};
    },
    setOpacity () {
      if (this.dashboardCss.bgColor) {
        return this.dashboardCss.bgColor.opacity / 100;
      }
      return 1;
    },
    setBgColor () {
      let index = this.bgColor.index;
      if (!this.bgColor.hasOwnProperty('index')) {
        index = 0;
      }
      if (index === -2) {
        return this.bgColor.background.background || this.bgColor.background;
      }
      if (colorTemp[index].backgroundIcon) {
        let setParam = 'repeat right bottom';
        if (index === 15) setParam = 'no-repeat right top 100%';
        if (index === 16) setParam = 'repeat left bottom';
        return 'url(' + colorTemp[index].background + ')' + setParam;
      } else if (colorTemp[index].background === this.bgColor.background) {
        return colorTemp[index].background;
      } else {
        return this.bgColor.background;
      }
    }
  },
  components: {
  },
  mounted(){
  },
  methods: {
  }
};
</script>
<style lang='scss' scoped>
.bg-color {
  height: 100%;
  width: 100%;
  left: 0px;
  top: 0px;
  // z-index: -1;
  position: absolute;
}
.bg-content {
  width: 100%;
  height: 100%;
  // z-index: -1;
}
.bg-image {
  background-image: linear-gradient(
    -180deg,
    #201e1e 0%,
    #2b0b0b 30%,
    #000000 100%
  );
}
</style>