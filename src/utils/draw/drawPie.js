import {
  getBaseConfig,
  getColorSizeLabel,
  chartStyleProcessFun,
} from './baseConfig';

let pieDrawingChartStyleProcess = function({
  featureList,
  canvasCss,
  chartType,
}) {
  let obj = {};
  let funObj = chartStyleProcessFun(featureList, canvasCss, chartType);

  // 处理颜色
  let colorObj = funObj.colorListProcess();

  obj.colorList = colorObj.color;
  obj.colorOpacity = colorObj.opacity;

  // 处理标签
  obj.labelsList = funObj.labelsProcess(canvasCss.bgCss.color) || [];
  // 处理tooltip

  obj.tooltipList = funObj.tooltipProcess();

  let { sized, labeled, colored } = funObj.features();

  obj.sizeFeature = sized;
  obj.labelFeature = labeled;
  obj.colorFeature = colored;

  let referTo = !canvasCss.innerRadius ? 120 : 100;
  obj.size =
    ((canvasCss.size ? canvasCss.size : 70) * 0.85) / referTo.toFixed(2);
  obj.innerRadius = canvasCss.innerRadius;

  // if (obj.labelsList.length > 0) {
  //   obj.size = obj.size * 0.8;
  //   obj.innerRadius = obj.innerRadius * 0.75;
  // }

  return obj;
};

export { pieDrawingChartStyleProcess };
