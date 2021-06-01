import { setConfig } from '@/utils/baseConfig.js';
export const drawAxisMixin = {
  data() {
    return {
    };
  },
  methods: {
    drawAxis () {
      let devicePixelRatio = window.devicePixelRatio;
      let dpr = 1;
      if (devicePixelRatio >= 3) {
        dpr = 3;
      } else if (devicePixelRatio >= 2) {
        dpr = 2;
      } else {
        dpr = 1;
      }
      var ua = navigator.userAgent,
        isTablet = /(?:iPad|PlayBook)/.test(ua);
      if (!this.chartId || isTablet ) {
        dpr = parseInt(getComputedStyle(document.documentElement).fontSize) / 100;
      }
      let css = JSON.parse(JSON.stringify(this.canvasCss));
      let { background } = this.dashboardCss.bgColor;
      if (background.color) {
        this.setCanvasStyle(background.color || '#6b6b6b', css.labelsList || [], css.axis_style, {});
      }
      if (dpr !== 1) {
        this.setCanvasFont(dpr, css.labelsList || [], css.axis_style, css.tooltipList, {});
      }
      let { config } = setConfig(this.featureList, this.chartData, css, this.canvasType === 'bar-rotated');
      config.id = `${this.refName}_${this.worksheetId}`;
      if (this.styleObj.chart) {
        config.fitModel = this.styleObj.chart.mode;
      }
      if (background.color) {
        this.setCanvasStyle(background.color || '#6b6b6b', [], [], config);
      }
      if (dpr !== 1) {
        this.setCanvasFont(dpr, [], [], [], config);
      }
      config.click = (d) => {
        sessionStorage.setItem('userClickItem', JSON.stringify(d));
        this.$emit('action', d);
      };
      config.isMobile = true;
      this.chartStyle = config;
      console.log(config);
      let domContainer = this.$refs[this.refName];
      if (!domContainer) return;
      let dom = domContainer.$el.querySelector('div');
      if (dom) {
        dom.innerHTML = '';
      }
      // alert(dpr);
      domContainer.draw();
      // this.$nextTick(() => {
      //   // dom.querySelector('.mc-middle').style.overflow = 'auto';
      // });
      this.$hideLoading();
    },
    setCanvasStyle (color, labels, axisList, config) {
      for (let i = 0; i < labels.length; i++) {
        labels[i].text.fontColor = color;
      }
      for (let i = 0; i < axisList.length; i++) {
        axisList[i].label.style.fontColor = color;
        axisList[i].title.style.fontColor = color;
      }
      let yAxisPart = config.yAxisPart || [];
      let xAxisPart = config.xAxisPart || [];
      for (let i = 0; i < yAxisPart.length; i++) {
        yAxisPart[i].label.style.fontColor = color;
        yAxisPart[i].title.style.fontColor = color;
      };
      for (let i = 0; i < xAxisPart.length; i++) {
        xAxisPart[i].label.style.fontColor = color;
        xAxisPart[i].title.style.fontColor = color;
      };
    },
    setCanvasFont (dpr, labels, axisList, tooltipList, config) {
      for (let i = 0; i < labels.length; i++) {
        let fontSize = labels[i].text.fontSize;
        labels[i].text.fontSize = fontSize * dpr;
      }
      for (let i = 0; i < axisList.length; i++) {
        let fontSize =  axisList[i].label.style.fontSize;
        axisList[i].label.style.fontSize = fontSize * dpr;
        axisList[i].title.style.fontSize = fontSize * dpr;
      }
      for (let i = 0; i < tooltipList.length; i++) {
        let fontSize =  tooltipList[i].text.fontSize;
        tooltipList[i].text.fontSize = fontSize * dpr;
      }
      let yAxisPart = config.yAxisPart || [];
      // let xAxisPart = config.xAxisPart || [];
      for (let i = 0; i < yAxisPart.length; i++) {
        let fontSize =  yAxisPart[i].label.style.fontSize;
        yAxisPart[i].label.style.fontSize = fontSize * dpr;
        yAxisPart[i].title.style.fontSize = fontSize * dpr;
      };
      // for (let i = 0; i < xAxisPart.length; i++) {
      //   let fontSize =  xAxisPart[i].label.style.fontSize;
      //   xAxisPart[i].label.style.fontSize = fontSize * dpr;
      //   xAxisPart[i].title.style.fontSize = fontSize * dpr;
      // };
    }
  },
};
