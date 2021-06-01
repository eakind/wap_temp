<template>
  <div class="dashboard-container" :style="setContainerH" ref="dashboardContainer">
    <template v-for="(i, idx) in curLayoutList">
      <div
        class="dashboard-box"
        v-if="!showlargedChart"
        :key="
          projectId +
            '-' +
            dashboardId +
            '-' +
            idx +
            '-' +
            i.worksheetId +
            '-' +
            Number(i.flag)
        "
      >
        <component
          :is="compPare[i.type]"
          :style-obj="i.style"
          :id="i.worksheetId"
          @action="actionCb($event, i.worksheetId)"
          :cur-height="i.mobileHeight || 360"
          :action-flag="i.flag"
          :bg-color="bgColor"
          v-bind="$attrs"
          @largeChart="largeChart"
        ></component>
      </div>
    </template>

    <div
      class="large-chart-box"
      v-if="showlargedChart"
      :style="{ background: bgColor }"
    >
      <large-chart
        :style-obj="curStyle"
        :id="curWorksheetId"
        :chart-id="chartId"
        :cur-height="curMobileHeight"
        :bg-color="bgColor"
        v-bind="$attrs"
        @hide-chart="hideChartProcess"
      ></large-chart>
    </div>
  </div>
</template>
<script>
import canvasChart from './dashboard/canvasChart';
import largeChart from './dashboard/largedCanvasChart';
import textChart from './dashboard/textChart';
import { mapState } from 'vuex';
import { post } from '@/server/http.js';
import { isAndroid } from '@/utils/index.js';
export default {
  components: {
    canvasChart,
    textChart,
    largeChart
  },
  props: {
    layoutList: {
      type: Array,
      default: (_) => [],
    },
    dashboardId: {
      type: String,
      default: '',
    },
    bgColor: {
      type: String,
      default: '#fff',
    },
  },
  computed: {
    ...mapState('dashboard', [
      'actionList',
      'projectId',
      'curDashboardObj',
      'featureList',
      'validAction'
    ]),
    curLayoutList() {
      return this.layoutList.filter(
        (i) => i.type === 'text' || i.type === 'canvas'
      );
    },
    setContainerH () {
      if (this.showlargedChart || this.updateList) {
        return {
          height: '100%'
        };
      } else {
        let headBoxHeight = this.$parent.$el.querySelector('.head-box').getBoundingClientRect().height;
        let listEntryHeight = this.$parent.$el.querySelector('.list-entry').getBoundingClientRect().height;
        let curHeight = `calc(100% - ${parseInt(headBoxHeight) + parseInt(listEntryHeight)}px)`;
        return {
          height: curHeight
        };
      }
    }
  },
  data() {
    return {
      compPare: { text: 'textChart', canvas: 'canvasChart' },
      featureName: '',
      curStyle: {},
      curWorksheetId: '',
      curMobileHeight: 360,
      showlargedChart: false,
      updateList: true,
      scrollTop: 0,
    };
  },
  beforeDestroy() {},
  mounted() {
    this.showlargedChart = false;
    this.updateList = false;
    // let headBoxHeight = this.$parent.$el.querySelector('.head-box').getBoundingClientRect().height;
    // let listEntryHeight = this.$parent.$el.querySelector('.list-entry').getBoundingClientRect().height;
    // let curHeight = `calc(100% - ${parseInt(headBoxHeight) + parseInt(listEntryHeight)}px)`;
    // this.$el.style.height = curHeight;
  },
  methods: {
    scrollDefault(e) {
      e.preventDefault();
    },
    hideChartProcess() {
      document.body.scrollTo(0, this.scrollTop);
      this.showlargedChart = false;
      document.body.style.overflow = '';
      document.body.style.top = '';
      document.removeEventListener('touchmove', this.scrollDefault, {
        passive: false,
      });
      this.$emit('chartZoom', 'small');
    },
    largeChart(curStyle, curWorksheetId, curCanvasType) {
      this.scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop;
      document.body.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
      // let ua = navigator.userAgent,
      //   isTablet = /(?:iPad|PlayBook)/.test(ua);
      if (document.documentElement.scrollTop) {
        document.body.style.top = this.scrollTop + 'px';
      }

      document.body.style.overflow = 'hidden';
      this.curStyle = curStyle;
      this.curWorksheetId = curWorksheetId;
      this.chartId = curWorksheetId + '_large_chart';
      this.curMobileHeight =
        window.screen.height -
        0.36 * parseFloat(getComputedStyle(document.documentElement).fontSize);
      // alert(this.curMobileHeight);
      var u = navigator.userAgent;
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if (curCanvasType === 'pie' && isIOS) {
        this.curMobileHeight = window.screen.height;
      }

      this.showlargedChart = true;
      // let map = {
      //   table: true,
      //   bar: true,
      //   'bar-line': true,
      //   line: true,
      //   'bar-rotated': true
      // };
      // if (!map[curCanvasType]) {
      //   document.addEventListener('touchmove', this.scrollDefault, {
      //     passive: false,
      //   });
      // }
      this.$emit('chartZoom', 'large');
    },
    actionCb(actionInfo, id) {
      if (this.actionList.length === 0) {
        return;
      }
      let currentAction = this.actionList.filter(
        (i) => i.origin_worksheet_id === id
      );
      if (!currentAction.length) return;
      for (let i = 0; i < currentAction.length; i++) {
        let arr = this.validAction[currentAction[i].target_worksheet_id] || [];
        let currentArr = arr.find(item => item.action_id === currentAction[i].action_id);
        let actions = actionInfo ? this.getCatsValue(currentAction[i].actions, actionInfo) : [];
        if (currentArr) {
          currentArr.actions = actions;
        } else {
          arr.push({
            action_id: currentAction[i].action_id,
            actions: actions
          });
        }
        this.validAction[currentAction[i].target_worksheet_id] = arr;
        let targetId = currentAction[i].target_worksheet_id;
        this.layoutList.forEach((item, idx) => {
          if (item.worksheetId === targetId) {
            this.$set(this.layoutList[idx], 'flag', !this.layoutList[idx].flag);
          }
        });
      }
    },
    getCatsValue (actions, actionInfo) {
      actions.forEach((i) => {
        let feature = this.featureList.find(
          (m) => m.feature_idx === i.origin_feature_idx
        );
        i.value = actionInfo&&feature ? actionInfo[feature.feature_name] : '';
      });
      return actions;
    },
    async modifyAction(item, dataObj) {
      let curItem = JSON.parse(JSON.stringify(item));
      delete curItem['origin_worksheet_id'];
      curItem.actions.forEach((i) => {
        let feature = this.featureList.find(
          (m) => m.feature_idx === i.origin_feature_idx
        );

        i.value = dataObj&&feature ? dataObj[feature.feature_name] : '';
      });
      let params = {
        dashboard_id: this.curDashboardObj.dashboard_id,
        project_id: this.projectId,
      };
      Object.assign(params, curItem);
      await post('modifyAction', params);

      let targetId = item.target_worksheet_id;

      this.layoutList.forEach((i, idx) => {
        if (i.worksheetId === targetId) {
          this.$set(this.layoutList[idx], 'flag', !this.layoutList[idx].flag);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.dashboard-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
  .dashboard-box {
    border-top: 1px solid #dedede;
    padding: 0 0rem;
  }
  .dashboard-box + .dashboard-box {
    // margin-top: 0.08rem;
    // padding-top: 0.08rem;
  }
}
.large-chart-box {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  // background-color: #fff;
  z-index: 666;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 0rem 0.04rem 0.04rem 0.04rem;
}
</style>
