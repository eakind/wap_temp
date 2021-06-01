<template>
  <div class="mc-chart-wrap" ref="chartWrap" :style="canvasStyle">
    <div class="title-box flex" :style="[canvasTitleStyle]">
      <div class="icon-box" @click.stop="largeChart">
        <span class="iconfont icon-db_menuDot"></span>
        <tooltip-bar
          v-if="largeChartShow"
          @largeChart="largeChartProcess"
        ></tooltip-bar>
      </div>
      <div
        class="title"
        :style="[setFontColor]"
        v-if="styleObj.title && styleObj.title.showFlag"
      >
        {{ chartTitle }}
      </div>
    </div>
    <div class="mc-chart-box" @click="tableActionHandle">
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
import tooltipBar from './canvasChart/tooltipBar.vue';
import { drawMixin } from './mixins/draw';
import { drawAxisMixin } from './mixins/drawAxis';
import { retStyleObj } from '@/utils/index';
import { mapState } from 'vuex';

export default {
  mixins: [drawMixin, drawAxisMixin],
  components: {
    mcChart,
    tooltipBar,
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
  watch: {
    actionFlag(val) {
      this.actionDraw();
    },
  },
  data() {
    return {
      largeChartShow: false,
      showFlag: true,
      scrollTop: 0,
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
        return `mc_${this.canvasType}_${this.worksheetId}`;
      }
      return `${this.canvasType}Chart`;
    },
    canvasStyle() {
      let {
        chart: { bgColor = null },
        global: { border = null, padding = null },
      } = this.styleObj;
      let style = retStyleObj({ bgColor, border, padding });
      style.height = 0.36 + this.curHeight / 100 + 'rem';
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
      let color = background.color;
      if (this.styleObj.title.colorStyle.bgSelected) {
        color = this.styleObj.title.colorStyle.background;
      }
      console.log(this.dashboardCss);
      return {
        color: `${color}!important`
      };
    }
  },
  beforeDestroy() {
    document.body.removeEventListener('click', this.clkProcess, false);
  },
  mounted() {
    this.fetchWorksheetDetail();
    document.body.removeEventListener('click', this.clkProcess, false);
    document.body.addEventListener('click', this.clkProcess, false);
  },
  methods: {
    largeChart() {
      this.largeChartShow = !this.largeChartShow;
    },
    largeChartProcess() {
      this.largeChartShow = false;
      this.$emit('largeChart', this.styleObj, this.id, this.canvasType);
    },
    clkProcess(e) {
      if (
        !document.querySelector('.mc-chart-wrap .icon-box').contains(e.target)
      ) {
        this.largeChartShow = false;
      }
    },
    tableActionHandle (e) {
      if (this.canvasType === 'title' && !document.querySelector(this.chartStyle.bindto).contains(e.target)) {
        this.$emit('action', {});
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.mc-chart-wrap {
  width: 100%;

  // height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  box-sizing: border-box;

  .title-box {
    // height: 0.36rem;
    line-height: 0.36rem;
    // padding: 0px 0.16rem;
    justify-content: space-between;
    flex-direction: row-reverse;
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
    height: calc(100% - 0.36rem);
  }
}

.mc-chart-wrap.large-box {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 6;
  .mc-chart-box {
    position: absolute;
    top: 0.36rem;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    padding: 0 0;
  }
  .title-box {
    padding: 0 0rem;
  }
  .icon-box {
    .icon-db_stretch {
      color: #a4a4a4;
    }
  }
}
</style>
