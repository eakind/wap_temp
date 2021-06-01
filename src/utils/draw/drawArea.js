import i18n from '@/i18n';
import { initScaleStyle, initGridStyle, initAxisStyle } from '@/views/drawingboard/middle/utils/canvas.js';

const initAreaCss = function (canvasFeatures, axis_style) {
  let xAxis = getColumnCat(canvasFeatures.x || []);
  let yAxis = getRowAgg(canvasFeatures.x || []);
  let { scaleList, scopeList } = initScaleStyle(xAxis, yAxis, axis_style || {});
  let { grid_style, grid_show } = initGridStyle(axis_style || {});
  let { fontList, axisList } = initAxisStyle(xAxis, yAxis, axis_style || {});
  let axisStyle = {
    scaleList,
    scopeList,
    grid_style,
    grid_show,
    fontList,
    axisList
  };
  return axisStyle;
};

const setAreaTooltip = function (canvasFeatures) {
  let xAxis = getColumnCat(canvasFeatures.x || []);
  let yAxis = getRowAgg(canvasFeatures.x || []);
  let tooltipList = [];
  for (let i = 0; i < xAxis.length; i++) {
    tooltipList.push({
      feature: xAxis[i],
      type: 'ordinal'
    });
  };
  for (let i = 0; i < yAxis.length; i++) {
    tooltipList.push({
      feature: yAxis[i][0],
      type: 'linear'
    });
  }
  return tooltipList;
};

const drawArea = function (configObj) {
  let {
    baseConfig,
    featureData,
    canvasCss,
    canvasFeatures,
    containerSize,
    chartSize,
    chartArr
  } = configObj;
  // 绑定图表DOM
  baseConfig.bindto = `#${chartArr[0].id}`;
  // 设置图表容器大小
  baseConfig.container = containerSize;
  // 设置画布的大小
  baseConfig.size = chartSize;
  // 设置X轴
  setAxis(baseConfig.axis, canvasCss.axis_style);
  // 设置线
  setLine(baseConfig.line);
  // 设置数据
  setData(baseConfig.data, featureData, canvasFeatures, canvasCss);
  // 设置网格线
  setGrid(baseConfig.grid, canvasCss.axis_style);
  // 设置斜线
  setCutOff(baseConfig.cutoff, canvasCss.axis_style);
  // 画图
  const chartIns = mc.generate(baseConfig);
  return chartIns;
};

function setData (data, featureData, canvasFeatures, canvasCss) {
  data.type = 'area';
  data.json = featureData; // 设置json数据

  // 设置column跟row
  data.column.categories = getColumnCat(canvasFeatures.x || []);
  data.row.aggressions = getRowAgg(canvasFeatures.x || []);

  // 设置combined,Y轴
  data.combined = getCombined(featureData, data.row.aggressions, canvasCss, canvasFeatures);
}

function getCombined (data, aggrList, canvasCss, canvasFeatures) {
  let len = data.length;
  let combined = [];
  for (let i = 0; i < len; i++) {
    let item = {
      axis: 'y',
      bars: setBars(aggrList[i], canvasCss, canvasFeatures),
      type: 'area',
      axis_style: setAxisStyle(aggrList[i], canvasCss.axis_style),
      color_style: colorStyle(),
      data: [data[i]]
    };
    combined.push([item]);
  }
  return combined;
}

function colorStyle () {
  let colorStyle = {
    opacity: 1,
    schemes: [],
    colors: [],
    patterns: [],
    range: []
  };
  return colorStyle;
}

function setAxisStyle (aggrList, axisStyleObj) {
  let fontObj = axisStyleObj.fontList.filter((item) => item.feature === aggrList[0])[0];
  let axisObj = axisStyleObj.axisList.filter((item) => item.feature === aggrList[0])[0];
  let tickObj = axisStyleObj.scaleList.filter((item) => item.feature === aggrList[0])[0];
  let scopeObj = axisStyleObj.scopeList.filter((item) => item.feature === aggrList[0])[0];
  let axisStyle = {
    show: true,
    tick: {
      style: {
        fill: tickObj ? tickObj.color : '#424242',
        'font-size': tickObj ? tickObj.fontSize : '12'
      },
      counts: scopeObj.num,
      range: [[20], [800]],
      rotate: Number(tickObj.rotate.split('rotate')[1])
    },
    text: {
      style: {
        fill: fontObj ? fontObj.color : '#424242',
        'font-size': fontObj ? fontObj.fontSize : '#424242'
      },
      title: fontObj ? fontObj.title : '', // aggrList[0],
      show: fontObj ? fontObj.show : true
    },
    line: {
      style: {
        stroke: axisObj ? axisObj.color : '#424242',
        'stroke-width': axisObj ? axisObj.thickness : 1,
        'stroke-dasharray': axisObj.style === 'dot' ? '5,5' : '0,0'
      },
      show: axisObj.show
    }
  };
  return axisStyle;
}
function setBars (aggrList, canvasCss, canvasFeatures) {
  let bars = {
    aggr: aggrList[0],
    colored: {
      feature: canvasFeatures.color ? canvasFeatures.color.name : '',
      type: 'ordinal',
      stacked: true
    },
    labels: canvasCss.isShowLabel ? aggrList : []
  };
  return bars;
}

function getColumnCat (list) {
  let len = list.length;
  let arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(`${list[i].name}-DUMMY`);
  }
  return arr;
}

function getRowAgg (list) {
  let len = list.length;
  let arr = [];
  for (let i = 0; i < len; i++) {
    arr.push([`${list[i].legend.toLocaleLowerCase()}(${list[i].name})`]);
  }
  return arr;
}

function setLine (line) {
  // 设置线的粗细
  line.size = 2;
  // 线上点的形状
  line.pattern = 'circle';
}

function setAxis (axis, axisStyle) {
  let xAxis = axis.x;
  const defaultColor = '#424242';
  xAxis.type = 'numeric';

  let fontObj = axisStyle.fontList.filter((item) => item.axis === i18n.t('message.x_axis'))[0];
  let axisObj = axisStyle.axisList.filter((item) => item.axis === i18n.t('message.x_axis'))[0];
  let tickObj = axisStyle.scaleList.filter((item) => item.axis === i18n.t('message.x_axis'))[0];

  // x轴的刻度
  let xTick = xAxis.tick; // x轴的刻度
  xTick.style = {
    fill: tickObj ? tickObj.color : defaultColor,
    'font-size': tickObj ? tickObj.fontSize : 12
  }; // 设置x轴刻度样式
  xTick.counts = null; // 设置x轴刻度个数
  xTick.range = []; // 设置X轴的刻度范围
  xTick.rotate = tickObj ? Number(tickObj.rotate.split('rotate')[1]) : 0; // 设置x轴的旋转角度

  // x轴的标题
  let xText = xAxis.text;
  xText.style = {
    fill: fontObj ? fontObj.color : defaultColor,
    'font-size': fontObj ? fontObj.fontSize : 12
  }; // x轴的坐标样式
  xText.title = fontObj ? [fontObj.title] : []; // x轴的坐标文字
  xText.show = fontObj ? fontObj.show : true; // 是否显示x轴的标题

  // x轴的坐标轴线
  let xLine = xAxis.line;
  xLine.style = {
    stroke: axisObj ? axisObj.color : defaultColor,
    'stroke-width': axisObj ? axisObj.thickness : 1,
    'stroke-dasharray': axisObj ? axisObj.style === 'dot' ? '5,5' : '0,0' : '0,0'
  }; // x轴线样式
  xLine.show = axisObj ? axisObj.show : true; // 是否显示x轴线
}

function setGrid (grid, axisStyle) {
  grid.show = axisStyle.grid_show;
  grid.style = axisStyle.grid_style;
}

function setCutOff (cutoff, axisStyle) {
  cutoff.style = axisStyle.grid_style;
  cutoff.show = false;
}

export {
  initAreaCss,
  drawArea,
  setAreaTooltip
};
