<template>
  <div class="icon-wrap">
    <div class="icon-box">
      <div class="icon-empty">
        <svg class="icon " aria-hidden="true">
          <use :xlink:href="iconName || comIconName"></use>
        </svg>
      </div>
    </div>
    <div class="tips">暂无数据</div>
  </div>
</template>
<script>
export default {
  props: {
    iconName: {
      type: String,
    },
    chartType: {
      type: String,
    },
  },
  computed: {
    comIconName() {
      let iconList = {
        table: '#icon-db_chartTable',
        bar: '#icon-db_chartColumn',
        'bar-line': '#icon-db_chartCombine',
        'bar-rotated': '#icon-db_chartBar',
        bubble: '#icon-db_chartBubble',
        line: '#icon-db_chartLine',
        map: '#icon-db_chartMap',
        pie: '#icon-db_chartPie',
        scatter: '#icon-db_chartScatter',
      };
      return iconList[this.chartType];
    },
  },
};
</script>
<style lang="scss" scoped>
.chart_bg_tip {
  left: 0px;
  top: 0px;
  z-index: 1;
  position: absolute;
  width: 4rem;
  display: inline-block;
  .title_tip {
    font-size: 0.16rem;
    color: #424242;
    left: 0.35rem;
    top: 0.35rem;
    font-weight: bold;
    position: absolute;
  }
  .txt_tip {
    top: 0.8rem;
    left: 0.35rem;
    width: 1.77rem;
    font-size: 0.14rem;
    color: #424242;
    font-weight: 300;
    display: inline-block;
    position: absolute;
  }
}
.icon-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  // z-index: 1;
  transform: translate(-50%, -50%);
  .icon-box {
    width: 1.2rem;
    height: 0.98rem;
    .icon-empty {
      width: 100%;
      height: 100%;
      display: inline-block;
      vertical-align: middle;
      text-align: center;
    }
    .icon {
      width: .8rem;
      height: .8rem;
      fill: currentColor;
      overflow: hidden;
      color: #b6b6b6;
    }
  }
  .tips {
    color: #b6b6b6;
    text-align: center;
  }
}
</style>
