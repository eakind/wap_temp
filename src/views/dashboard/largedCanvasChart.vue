<template>
  <div class="mc-chart-wrap" :style="canvasStyle" ref="largeChart">
    <div class="title-box flex">
      <div class="title" :style="[canvasTitleStyle, setFontColor]">{{ chartTitle }}</div>
      <!-- <div class="icon-box"> -->
      <span class="iconfont icon-db_stretch"  @click="hideLargeChart"></span>
      <!-- </div> -->
    </div>
    <div class="mc-chart-box">
         <mc-chart
        :chart-type="canvasType"
        :chart-style="chartStyle"
        :chart-data="chartData"
        :ref="refName"
        :show-flag="showFlag"
        v-bind="$attrs"
      ></mc-chart>
    </div>
  </div>
</template>
<script>
import mcChart from 'component/dcCharts/index';
import { drawMixin } from './mixins/draw';
import { drawAxisMixin } from './mixins/drawAxis';
import { retStyleObj } from '@/utils/index';
import { mapState } from 'vuex';

export default {
  mixins: [drawMixin, drawAxisMixin],
  components: {
    mcChart,
  },
  props: {
    styleObj: {
      type: Object,
      default: (_) => {},
    },
    id: {
      type: String,
      default: '',
    },
    chartId: {
      type: String,
      default: '',
    },
    curHeight: {
      type: [String, Number],
      default: '',
    },
    actionCb: {
      type: Function,
    },
    actionFlag: {
      type: Boolean,
      default: false,
    },
    bgColor: {
      type: String,
      default: '#fff',
    },
    requestFlag: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      largeChartShow: false,
      largeFlag: false,
      showFlag: true,
    };
  },
  computed: {
    ...mapState('dashboard', ['dashboardCss']),
    refName () {
      const isMap = {
        bar: true,
        line: true,
        'bar-line': true,
        'bar-rotated': true
      };
      if (isMap[this.canvasType]) {
        return `large_${this.canvasType}_${this.worksheetId}`;
      }
      return `${this.canvasType}Chart`;
    },
    canvasStyle() {
      if (!this.styleObj) return {};
      let {
        chart: { bgColor = null },
        global: { border = null, padding = null },
      } = this.styleObj;
      let style = retStyleObj({ bgColor, border, padding });
      
      // style.height = 0.36 + this.curHeight / 100 + 'rem';

      // alert(0.36 + this.curHeight / 100 + 'rem');

      // alert(getComputedStyle(document.documentElement).fontSize);

      if (!style.background) {
        style.background = this.bgColor;
      }
      return style;
    },
    canvasTitleStyle() {
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
      return retStyleObj({
        bgColor: titleBgColor,
        border: titleBorder,
        padding: titlePadding,
        fontSize,
        fontStyle,
        fontColor: colorStyle,
        textAlign,
      });
    },
    setFontColor () {
      let bgColor = this.dashboardCss.bgColor;
      if (!bgColor) return {};
      let background = bgColor.background;
      if (!background || !background.color) return {};
      return {
        color: `${background.color}!important`
      };
    }
  },
  mounted() {
    setTimeout(() => {
      this.fetchWorksheetDetail();
    }, 800);
    // this.fetchWorksheetDetail();
  },
  methods: {
    hideLargeChart() {
      this.$emit('hide-chart');
    },
  },
};
</script>
<style lang="scss" scoped>
.mc-chart-wrap {
  width: 100%;
  height: 90%;
  overflow-x: auto;
  overflow-y: hidden;
  box-sizing: border-box;
  .title-box {
    height: 0.36rem;
    // line-height: 0.36rem;
    // padding: 0px 0.16rem;
    justify-content: space-between;
    .title {
      width: calc(100% - 0.36rem);
      @include ellipsis;
    }
    .icon-box {
      position: relative;
      width: 0.36rem;
      height: 0.36rem;
      display: inline-block;
      vertical-align: middle;
      text-align: center;
    }
  }
  .mc-chart-box {
    position: relative;
    width: 100%;
    // height: 100%;
    height: calc(100% - 0.8rem);
  }
}
</style>
