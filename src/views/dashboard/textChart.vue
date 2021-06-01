<template>
  <div class="text-chart-wrap" :style="curStyle" v-html="styleObj.value">
    <!-- <div class="text-chart" ></div> -->
  </div>
</template>
<script>
import { retStyleObj } from '@/utils/index';
export default {
  name: 'textChart',
  props: ['styleObj','curHeight'],
  computed: {
    curStyle() {
      let {
        title: {
          bgColor: titleBgColor = null,
          border: titleBorder = null,
          colorStyle = null,
          fontSize,
          fontStyle,
          textAlign = 'left',
          padding: titlePadding,
        },
      } = this.styleObj;
      let style= retStyleObj({
        bgColor: titleBgColor,
        border: titleBorder,
        padding: titlePadding,
        fontSize,
        fontStyle,
        fontColor: colorStyle,
        textAlign,
      });
      style.height = this.curHeight / 100 + 'rem';
      return style;
    },
  },
};
</script>
<style lang="scss" scoped>
.text-chart-wrap {
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
  overflow-x: hidden;
  // @include scroll;
  outline: none;
  padding: 8px;
  box-sizing: border-box;
  word-break: break-word;
  word-wrap: break-word;
  white-space: pre-wrap;
  // width: 100%;
  // height: 100%;
  // overflow-y: hidden;
  // &:hover {
  //   overflow-y: auto;
  // }
}

.text-chart {
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
  overflow-x: hidden;
  // @include scroll;
  outline: none;
  padding: 8px;
  box-sizing: border-box;
  word-break: break-word;
  word-wrap: break-word;
  white-space: pre-wrap;
  &:hover {
    overflow-y: auto;
  }
}
</style>
