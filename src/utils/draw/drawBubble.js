import {  pieDrawingChartStyleProcess } from './drawPie';
let bubbleDrawingChartStyleProcess = function ({
  featureList,
  canvasCss,
  chartType,
}) {
  let chartStyle = pieDrawingChartStyleProcess({
    featureList,
    canvasCss,
    chartType,
  });

  chartStyle.orderStyle = typeof canvasCss.orderStyle === 'undefined' ? -1 : canvasCss.orderStyle;
  return chartStyle;
};


export {  bubbleDrawingChartStyleProcess };
