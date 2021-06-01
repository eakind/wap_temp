import { mapState, mapMutations } from 'vuex';
import { get, post } from '@/server/http.js';
import { pieDrawingChartStyleProcess } from '@/utils/draw/drawPie.js';
import { bubbleDrawingChartStyleProcess } from '@/utils/draw/drawBubble.js';
import { scatterDrawingChartStyleProcess } from '@/utils/draw/drawScatter.js';
import { drawTable } from '@/utils/draw/drawTable.js';
import { drawMap } from '@/utils/draw/drawMap.js';
let drawFunObj = {
  pie: pieDrawingChartStyleProcess,
  bubble: bubbleDrawingChartStyleProcess,
  scatter: scatterDrawingChartStyleProcess,
  table: drawTable,
  map: drawMap,
};
export let drawMixin = {
  data() {
    return {
      worksheetType: '',
      chartTitle: '',
      featureList: [],
      canvasCss: {},
      canvasType: '',
      chartStyle: {},
      chartData: [],
      funKeyVal: {
        pie: 'pieDrawProcess',
        bubble: 'pieDrawProcess',
        scatter: 'pieDrawProcess',
      },
    };
  },
  computed: {
    ...mapState('dashboard', [
      'projectId',
      'curDashboardObj',
      'worksheetTypes',
      'dashboardCss',
      'validAction'
    ]),
  },
  methods: {
    async fetchWorksheetDetail() {
      this.$showLoading();
      let param = {
        project_id: this.projectId,
        worksheet_id: this.id,
      };
      let res = await get('worksheetDetail', param);
      if (res && res.code === 0) {
        this.chartTitle = res.worksheet_title;
        this.canvasCss = res.css || {};
        this.featureList = res.features || [];
        this.worksheetType = res.worksheet_type;
        this.worksheetId = res.worksheet_id;
        this.canvasType = this.worksheetTypes[res.worksheet_type];
        this.$set(
          this.chartStyle,
          'id',
          `mc_${this.canvasType}_${this.chartId || this.id}`
        );
        this.drawChart();
      }
    },
    async fetchDataProcess(param) {
      let featureData = await this.fetchFeatureData(param).finally(() => {
        this.showLoading = false;
      });
      
      if (!featureData) {
        return {};
      }
      return JSON.parse(JSON.stringify(featureData));
    },

    // 获取绘图数据
    async fetchFeatureData(param) {
      if (!param) {
        param = {
          limit: 9999,
          offset: 0,
          project_id: this.projectId,
          worksheet_id: this.id,
          action_list: JSON.stringify(this.validAction[this.id]),
          dashboard_id: this.curDashboardObj.dashboard_id,
          // features: this.featureList,
        };
      }
      Object.assign(param, this.retRowColCount());

      let dataRes = await get('reviseCanvasFeature', param);

      // if (this.canvasType === 'table' && typeof(dataRes) === 'string') {
      //   debugger;
      //   dataRes = eval('(' + dataRes + ')');
      // }
      
      return dataRes && dataRes.features_data;
    },
    // 画图
    async drawChart(param) {
      let newData = await this.fetchDataProcess(param);
      if (!newData || !newData.length) {
        this.showFlag = false;
        return;
      }
      this.showFlag = true;

      this.chartData = newData || [];
      const chartMap = {
        bar: true,
        line: true,
        'bar-line': true,
        'bar-rotated': true
      };
      if (chartMap[this.canvasType]) {
        this.drawAxis();
      } else {
        this.drawCanvas();
      }
    },

    drawCanvas() {
      if (typeof drawFunObj[this.canvasType] !== 'function') {
        return;
      }
      let css = JSON.parse(JSON.stringify(this.canvasCss));
      let devicePixelRatio = window.devicePixelRatio;
      let dpr = 1; // parseInt(getComputedStyle(document.documentElement).fontSize) / 100; //1;
      let curHeight = this.curHeight;
      let curWidth = document
        .querySelector('.mc-chart-box')
        .getBoundingClientRect().width; // window.innerWidth;
      if (devicePixelRatio >= 3) {
        dpr = 3;
      } else if (devicePixelRatio >= 2) {
        dpr = 2;
      } else {
        dpr = 1;
      }

      if (this.canvasType === 'table') {
        css = this.getDashboardStyle(css);
      }

      var ua = navigator.userAgent,
        isTablet = /(?:iPad|PlayBook)/.test(ua);
      if (!this.chartId || isTablet ) {
        dpr =
          parseInt(getComputedStyle(document.documentElement).fontSize) / 100;
      }
      let u = navigator.userAgent;
      let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if (!this.chartId) {
        curHeight = this.curHeight * dpr;
      } else {
        curHeight = this.curHeight * devicePixelRatio;
      }
      // alert(curHeight);
      if (this.canvasType === 'pie' && isIOS && this.$refs.largeChart) {
        curHeight = this.curHeight * devicePixelRatio / 1.5;
      }
      if (this.dashboardCss.bgColor.bgSelected) {
        css.bgCss = this.dashboardCss.bgColor.background;
      }
      let chartStyle = drawFunObj[this.canvasType]({
        featureList: this.featureList,
        canvasCss: css, // 画布CSS
        chartType: this.canvasType,
        data: this.chartData,
        containerSize: { width: curWidth, height: curHeight },
        ids: `mc_${this.canvasType}_${this.chartId || this.id}`,
      });

      if (this.canvasType === 'map') {
        let that = this;
        chartStyle.mapChange = () => {
          return function(type, value) {
            if (type === 'zoom') {
              that.canvasCss.mapZoom = value;
            }
            if (type === 'move') {
              that.canvasCss.mapCenter = value;
            }
            that.saveData('css', that.canvasCss, true);
          };
        };

        this.chartData = this.chartData.filter((item) => {
          return item.latitude && item.longitude;
        });

        if (curHeight >= window.innerHeight - 20) {
          curHeight = window.innerHeight - 40 * dpr;
        }
      }

      let dom = document.getElementById(
        `mc_${this.canvasType}_${this.chartId || this.id}`
      );
      if (dom) {
        dom.innerHTML = '';
      }
      Object.assign(this.chartStyle, chartStyle);
      // if (!this.chartStyle.opacity) {
      //   this.chartStyle.opacity = 1;
      // }
      if (this.canvasType === 'table') {
        this.$set(this.chartStyle.table, 'mode', this.handlerChartMode());
      } else {
        this.$set(this.chartStyle, 'mode', this.handlerChartMode());
      }

      this.$set(this.chartStyle, 'dpr', dpr);
      this.$set(this.chartStyle, 'width', curWidth);
      this.$set(this.chartStyle, 'height', curHeight);
      this.$set(this.chartStyle, 'data_click', (e) => {
        this.$emit('action', e);
      });
      this.$refs[`${this.canvasType}Chart`].draw();
      this.$hideLoading();
    },
    actionDraw() {
      this.$showLoading();
      if (this.requestFlag) {
        this.fetchWorksheetDetail();
      } else {
        this.drawCanvas();
      }
    },

    handlerChartMode() {
      // let match = this.workSheetList.find((i) => curId === i.worksheet_id);
      let mode = 'fitWidth';
      let workSheetType = this.worksheetType;
      // let full = ['06', '07', '08'];
      // if (full.indexOf(workSheetType) > -1) {
      //   mode = 'full';
      //   return mode;
      // }
      // let fitHeight = ['02', '03', '04', '05', '01', '09'];
      // if (fitHeight.indexOf(workSheetType) > -1) {
      //   mode = 'fitHeight';
      //   if (workSheetType === '09') {
      //     mode = 'full';
      //   }
      // }
      if (workSheetType === '01') {
        mode = 'standard';
      }
      return mode;
    },

    retRowColCount() {
      let obj = {
        nrows: 1000,
        n: 1000,
      };
      if (this.canvasType !== 'scatter') {
        obj.nrows = 1000;
      }
      if (this.canvasType === 'table') {
        obj.ncols = 100;
      }
      let axisTypeMap = {
        line: true,
        bar: true,
        'bar-line': true
      };
      if (axisTypeMap[this.canvasType]) {
        obj.ncols = 1000;
      }
      let data_setting = this.canvasCss.data_setting;
      if (data_setting && data_setting.length > 0) {
        let match = data_setting.find((i) => i.selected);
        if (match) {
          let content = match.values ? match.values || null : match.content || null;
          if (this.canvasType === 'table') {
            obj.nrows = content ? content[1].val : 1000;
            obj.ncols = content ? content[0].val : 100;
          } else if (
            this.canvasType === 'pie' ||
            this.canvasType === 'bubble' ||
            this.canvasType === 'scatter'
          ) {
            obj.n = content ? content[0].val : 1000;
          } else if (this.canvasType === 'map') {
            obj.n = content ? content[0].val : 1000;
            obj.nrows = content ? content[0].val : 1000;
          } else {
            switch (this.canvasType) {
              case 'bar-rotated':
                obj.nrows = content ? content[0].val : 1000;
                break;
              case 'scatter':
                obj.n = content ? content[0].val : 1000;
                break;
              default:
                obj.ncols = content ? content[0].val : 1000;
                break;
            }
          }
        }
      }
      return obj;
    },
    getDashboardStyle (css) {
      console.log(this.dashboardCss);
      // css.bgCss = this.styleObj.chart.bgColor.bgSelected
      //   ? {
      //     background: this.styleObj.chart.bgColor.background.background,
      //     opacity: this.styleObj.chart.bgColor.opacity
      //   }
      //   : {
      //     background: '#fff',
      //     opacity: 100,
      //   };
      // return css;
      let { background } = this.dashboardCss.bgColor;
      let dashboardBg =
        this.dashboardCss &&
        this.dashboardCss.bgColor.bgSelected
          ? typeof background === 'object'
            ? background
            : this.dashboardCss.bgColor
          : null;

      css.dashboardBgCss = this.styleObj.chart.bgColor.bgSelected
        ? this.styleObj.chart.bgColor
        : dashboardBg && typeof this.styleObj.chart.bgColor.index !== 'undefined' ? dashboardBg : {
          background: '#fff',
          opacity: 100,
        };

      css.bgCss = this.styleObj.chart.bgColor.bgSelected
        ? this.styleObj.chart.bgColor
        : dashboardBg && typeof this.styleObj.chart.bgColor.index !== 'undefined' ? dashboardBg : {
          background: dashboardBg ? dashboardBg.background : '#fff',
          opacity: 100,
        };

      if (dashboardBg) {
        css.dashboardBgCss.color = dashboardBg.color || '';
      }

      css = this.bgCssProcess(css);

      return css;
    },
    bgCssProcess (css) {
      let canvasCss = JSON.parse(JSON.stringify(css));
      let bgCssObj = css.dashboardBgCss; // || this.currentDashboardDetail.dashboard.bgColor.background;// canvasCss.bgCss;
      canvasCss.bgCss.background = typeof canvasCss.bgCss.background === 'object' ? canvasCss.bgCss.background.background : canvasCss.bgCss.background;
      //  canvasCss.bgCss = JSON.parse(JSON.stringify(bgCssObj));
      if (bgCssObj.color) {
        let titleCss = {
          color: bgCssObj.color,
        };
        canvasCss.titleCss = titleCss;
      }
      if (this.canvasType === 'map') {
        canvasCss.bgCss.color = '#6b6b6b';
      }
      let { textSettings } = canvasCss;
      if (textSettings && bgCssObj.color) {
        for (let index = 0; index < textSettings.length; index++) {
          textSettings[index].list.forEach((i) => {
            i.format.fontColor = bgCssObj.color;
          });
        }
        canvasCss.textSettings = textSettings;
      }
      return canvasCss;
    },
  },
};
