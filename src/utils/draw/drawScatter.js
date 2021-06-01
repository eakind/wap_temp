import { modifyAggrFeature, defaultConfig } from './baseConfig';

import { pieDrawingChartStyleProcess } from './drawPie';
import { toPx } from '../index';

let {
  axisDefaultStyle: { title, line, label },
} = defaultConfig;

let scatterDrawingChartStyleProcess = function({
  featureList,
  canvasCss,
  chartType,
}) {
  let chartStyle = pieDrawingChartStyleProcess({
    featureList,
    canvasCss,
    chartType,
  });
  let funObj = chartStyleProcess(featureList, canvasCss);

  chartStyle.hasUnit = canvasCss.hasUnit !== 'origin';
  // typeof canvasCss.hasUnit === 'undefined' ? true : canvasCss.hasUnit;

  chartStyle.xAxis = funObj.axisStyleProcess('x');

  chartStyle.yAxis = funObj.axisStyleProcess('y');

  if (!canvasCss.scopeObj) {
    chartStyle.scopeObj = {
      num: 12,
      select: 0,
      tick_counts: '',
      tickRange: [],
      max: 1.1,
      min: 0,
      name: chartStyle.yAxis.key,
      align: true,
      scale: canvasCss.scopeObj ? canvasCss.scopeObj.scale || 1 : 1,
    };
  } else {
    chartStyle.scopeObj = canvasCss.scopeObj;
  }

  return chartStyle;
};

let chartStyleProcess = function(featureList, canvasCss) {
  return {
    tooltipList() {},
    axisStyleProcess: (axisType) => {
      let curFeatureList = featureList[axisType];
      if (curFeatureList.length === 0) {
        return {};
      }

      let curFeatureObj = (canvasCss.axis_style &&
        canvasCss.axis_style.length > 0 &&
        canvasCss.axis_style.find((i) => i.axisType === axisType)) || {
        title: {},
        line: {},
        label: {},
        grid: {},
      };

      let {
        title: { style: titleStyle = title, show: showTitle },
        line: { style: lineStyle = line, show: showLine },
        label: { style: labelStyle = label },
        grid,
      } = curFeatureObj;

      let featureName = modifyAggrFeature(curFeatureList[0]);

      if (canvasCss.bgCss.color) {
        labelStyle.fontColor = canvasCss.bgCss.color;
        titleStyle.fontColor = canvasCss.bgCss.color;
      }

      if (curFeatureObj.key === featureName) {
        return curFeatureObj;
      }

      let curAxisStyle = {
        axisType,
        position: axisType === 'x' ? 'bottom' : 'left',
        key: featureName,
        title: {
          value: featureName,
          show: typeof showTitle === 'undefined' ? true : showTitle,
          style: titleStyle,
        },
        line: {
          show: typeof showLine === 'undefined' ? true : showLine,
          style: lineStyle,
        },
        label: {
          style: labelStyle,
        },
        grid: {
          line: {
            style: grid.line && grid.line.style ? grid.line.style : line,
            show: grid.line && grid.line.show,
          },
        },
        tickLine: {
          style: line,
        },
      };
      return curAxisStyle;
    },
  };
};

export { scatterDrawingChartStyleProcess };
