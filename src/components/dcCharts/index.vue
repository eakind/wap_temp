<template>
  <div class="dc-chart">
    <component
      v-if="showFlag"
      :class="chartBody"
      :is="currentChart[chartType]"
      :ref="currentChart[chartType]"
      :chartData="chartData"
      :id="chartStyle.id"
    ></component>
    <chart-empty v-else :chartType="chartType" />
  </div>
</template>
<script>
import chartEmpty from 'component/chartEmpty/index.vue';
import PieChart from './components/pieChart.vue';
import mcChart from './components/mcChart.vue';
import GeometryDrawingProcess from './draw/index.js';
// import { getComponents } from './utils/util.js';
export default {
  components: {
    PieChart,
    mcChart,
    chartEmpty
  },
  data() {
    return {
      currentChart: {
        // bar: 'barChart',
        pie: 'pieChart',
        bubble: 'mcChart',
        scatter: 'mcChart',
        table:'mcChart',
        map:'mcChart',
        line: 'mcChart',
        bar: 'mcChart',
        'bar-line': 'mcChart',
        'bar-rotated': 'mcChart',
      },
      instance: null,
      vueCharts: ['pie'],
    };
  },
  props: {
    showFlag:{
      type:Boolean,
      default:true
    },
    // 图表类型
    chartType: {
      type: String,
      default: '',
    },
    // 图表样式
    chartStyle: {
      type: Object,
    },
    // 图表数据
    chartData: {
      type: [Object, Array],
    },
    // 图表特征
    chartFeature: {
      type: [Object],
    },
  },
  computed: {
    chartBody() {
      return this.chartTitle ? 'chart-body' : 'full-body';
    },
  },
  methods: {
    draw() {
      this.$nextTick(() => {
          const chartMap = {
          bar: 'bar',
          barRotated: 'barRotated',
          'bar-rotated': 'barRotated',
          'bar-line': 'barLine',
          barLine: 'barLine',
          map: 'map',
          line: 'line',
          scatter: 'scatter',
          table: 'table',
          bubble: 'bubble',
          pie: 'pie'
        };
        this.instance = GeometryDrawingProcess(
          chartMap[this.chartType],
          this.chartData,
          this.chartStyle
        );
        if (this.instance) {
          this.instance.draw();
        }
      });
    },
    /**
     * type: 更新属性
     * data 如果是更新数据，则需要传入新的数据
     */
    update(type, data) {
      this.instance.chartUpdate(type, data);
    },
    getColorList() {
      return this.instance.getColorList();
    },
  },
};
</script>
<style lang="scss" scoped>
.dc-chart {
  width: 100%;
  height: 100%;
  position: relative;
  .chart-header {
    height: 50px;
    line-height: 50px;
  }
  .chart-body {
    height:100%;// calc(100% - 50px);
    width: 100%;
  }
  .full-body {
    height: 100%;
    width: 100%;
  }
}
</style>
