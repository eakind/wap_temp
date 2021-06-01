import { axisConfig, labelsConfig, tooltipConfig } from './defaultConfig';
import { setCatName, setAggrName } from './configUtils';
import { setPartStyle } from './axisUtils';
const setConfig = (canvasFeatures, data, canvasCss, isRotated) => {
  let tooltipList = [];
  let colorList = [];
  let scopeList = [];
  // 原始数据是false，自动判断是true
  const obj = {
    origin: false,
    auto: true
  };
  let xList = isRotated ? canvasFeatures.y : canvasFeatures.x;
  let yList = isRotated ? canvasFeatures.x : canvasFeatures.y;
  let { xAxis, xAxisPart } = setXAxisConfig(xList, tooltipList, canvasCss);
  let { yAxis, yAxisPart, labelsList } = setYAxisConfig(yList, tooltipList, colorList, scopeList, data, canvasCss);
  let config = {
    fitModel: canvasCss.fitModel || 'standard',
    id: 'mc_chart',
    click: (d) => {
      sessionStorage.setItem('userClickItem', JSON.stringify(d));
    },
    isCombined: canvasCss.isCombined,
    hasUnit: canvasCss.hasUnit ? obj[canvasCss.hasUnit] : true,
    size: canvasCss.size || 50,
    lineSize: canvasCss.lineSize || 50,
    lineStyle: canvasCss.lineStyle || 'circle',
    xAxis,
    yAxis,
    xAxisPart: xAxisPart.length ? xAxisPart : null,
    yAxisPart: yAxisPart.length ? yAxisPart : null,
    labelsList: labelsList.length ? labelsList : null,
    tooltipList: tooltipList.length ? uniqueList(tooltipList, 'key') : null,
    scopeList: scopeList,
    colorList: colorList.length ? colorList : null
  };
  let newAxisStyle = mergeStyle(config, canvasCss.axis_style);
  mergeScopeList(config, canvasCss.scopeList);
  mergeColor(config, canvasCss.colorList);
  mergeTooltipList(config, canvasCss.tooltipList);
  mergeLabelList(config, canvasCss.labelsList);
  syncYAxisStyle(config.yAxis);
  setPartStyle(config);
  return { config, newAxisStyle };
};

const uniqueList = (tooltipList, key) => {
  let list = [];
  let uniqueList = [];
  for (let i = 0; i < tooltipList.length; i++) {
    if (!uniqueList.includes(tooltipList[i][key])) {
      uniqueList.push(tooltipList[i][key]);
      list.push(tooltipList[i]);
    }
  }
  return JSON.parse(JSON.stringify(list));
};

const setXAxisConfig = (xList, tooltipList, canvasCss) => {
  let xAxis = [];
  let xAxisPart = [];
  let len = xList.length;
  for (let i = 0; i < len; i++) {
    let obj = JSON.parse(JSON.stringify(axisConfig(canvasCss.bgCss)));
    obj.keyId = `${i}-${0}`;
    let tooltipObj = JSON.parse(JSON.stringify(tooltipConfig('CAT')));
    if (xList[i].split instanceof Array) {
      let splitArr = xList[i].split;
      let splitLen = splitArr.length;
      let xListObj = JSON.parse(JSON.stringify(xList[i]));
      if (i === len - 1) {
        delete xListObj.split;
        xListObj.split = splitArr[splitLen - 1];
        obj.key = setCatName(xListObj);
        obj.title.value = obj.key;
        xAxis.push(obj);
        splitLen = splitLen - 1;
        let tempTooltipObj = JSON.parse(JSON.stringify(tooltipObj));
        tempTooltipObj.key = obj.key;
        tempTooltipObj.title = obj.key;
        tooltipList.push(tempTooltipObj);
      }
      for (let j = 0; j < splitLen; j++) {
        let tempObj = JSON.parse(JSON.stringify(axisConfig(canvasCss.bgCss)));
        let tempTooltipObj = JSON.parse(JSON.stringify(tooltipObj));
        xListObj.split = splitArr[j];
        tempObj.key = setCatName(xListObj);
        tempObj.title.value = tempObj.key;
        tempObj.position = 'top';
        xAxisPart.push(tempObj);
        tempTooltipObj.key = tempObj.key;
        tempTooltipObj.title = tempObj.key;
        tooltipList.push(tempTooltipObj);
      }
    } else {
      obj.key = setCatName(xList[i]);
      tooltipObj.key = setCatName(xList[i]);
      tooltipObj.title = tooltipObj.key;
      obj.title.value = obj.key;
      if (i === len - 1) {
        xAxis.push(obj);
      } else {
        obj.position = 'top';
        xAxisPart.push(obj);
      }
      tooltipList.push(tooltipObj);
    }
  }
  return {
    xAxis,
    xAxisPart
  };
};

// 设置yAxisPart对象
const setPartObj = (featureObj, aggrIndex, index, canvasCss) => {
  let obj = JSON.parse(JSON.stringify(axisConfig(canvasCss.bgCss)));
  obj.position = 'left-part';
  obj.key = [setCatName(featureObj)];
  obj.keyId = `${aggrIndex}-${index}`;
  return obj;
};

// 设置yAxis对象
const setYAxisObj = (featureObj, position, aggrIndex, index, canvasCss) => {
  let obj = JSON.parse(JSON.stringify(axisConfig(canvasCss.bgCss)));
  obj.position = position;
  obj.key = [setAggrName(featureObj)];
  obj.type = [featureObj.type || 'bar'];
  obj.title.value = obj.key.join('&');
  obj.keyId = [`${aggrIndex}-${index}`];
  return obj;
};

const setAggrId = (aggrIndex, index) => {
  return `${aggrIndex}-${index}`;
};

// 设置组合特征left跟right中的yAxis对象
const setYAxisList = (list, position, arr, tooltipList, labelsList, colorList, scopeList, index, start, aggrIndex, canvasCss) => {
  let obj = JSON.parse(JSON.stringify(axisConfig(canvasCss.bgCss)));
  obj.position = position;
  obj.key = [];
  obj.keyId = [];
  obj.type = [];
  for (let j = 0; j < list.length; j++) {
    obj.key.push(setAggrName(list[j]));
    obj.keyId.push(setAggrId(aggrIndex, start + j));
    obj.type.push(list[j].type || 'bar');
    let tooltipObj = JSON.parse(JSON.stringify(tooltipConfig('AGGR')));
    tooltipObj.key = setAggrName(list[j]);
    tooltipObj.title = tooltipObj.key;
    // tooltip
    tooltipList.push(tooltipObj);
    tooltipList.push(...setToolTipList(list[j]));
    // 标签
    labelsList.push(...setLabelList(list[j], aggrIndex, start + j, canvasCss));
    // 颜色
    colorList.push(...setColorObj(list[j], aggrIndex, start + j));
  }
  obj.title.value = obj.key.join('&');
  arr.push(obj);
  let scopeObj = {
    key: obj.key,
    keyId: obj.keyId
  };
  scopeList.push(scopeObj);
};

// 设置标签列表
const setLabelList = (featureObj, aggrIndex, index, canvasCss) => {
  if (!featureObj.labels) {
    return [];
  }
  let list = [];
  let labels = featureObj.labels;
  for (let i = 0; i < labels.length; i++) {
    let obj = JSON.parse(JSON.stringify(labelsConfig(labels[i].dtype, canvasCss.bgCss)));
    obj.key = setAggrName(featureObj);
    if (labels[i].dtype === 'CAT') {
      obj.title = setCatName(labels[i]);
    } else {
      obj.title = setAggrName(labels[i]);
    }
    obj.keyId = `${aggrIndex}-${index}`;
    list.push(obj);
  }
  return list;
};

const setTooltipObj = (featureObj) => {
  let obj = JSON.parse(JSON.stringify(tooltipConfig(featureObj.dtype)));
  if (featureObj.dtype === 'CAT') {
    obj.key = setCatName(featureObj);
  } else {
    obj.key = setAggrName(featureObj);
  }
  obj.title = obj.key;
  obj.id = obj.key;
  return obj;
};

const setToolTipList = (featureObj) => {
  let labels = featureObj.labels || [];
  let color = featureObj.color;
  let list = [];
  list.push(setTooltipObj(featureObj));
  for (let i = 0; i < labels.length; i++) {
    list.push(setTooltipObj(labels[i]));
  };
  if (color) {
    list.push(setTooltipObj(color));
  }
  return list;
};

const setColorObj = (featureObj, index, num) => {
  let list = [];
  let keyId = '';
  if (isNaN(num)) {
    keyId = `${index}`;
  } else {
    keyId = `${index}-${num}`;
  }
  // 颜色列表的数据结构
  let colorObj = {
    feature: '', // 对应的颜色特征名
    type: 'none', // ordinal 分类 linear // 线性 none
    key: setAggrName(featureObj), // 对应行列颜色的特征名
    color: '#4284f5', // 没有颜色特征时的默认颜色
    list: [],
    canvasType: featureObj.type || 'bar',
    fillType: 'fill', // 填充类型
    opacity: 100, // 颜色透明度
    keyId: keyId, // 匹配颜色标记
    keyName: featureObj.name // 匹配名称
  };
  if (featureObj.color) {
    if (featureObj.color.dtype === 'CAT') {
      colorObj.type = 'ordinal';
      colorObj.feature = setCatName(featureObj.color);
    } else {
      colorObj.type = 'linear';
      colorObj.feature = setAggrName(featureObj.color);
    }
  }
  list.push(colorObj);
  return list;
};

const setScopeObj = (featureObj, aggrIndex, index) => {
  let obj = {
    key: [setAggrName(featureObj)],
    keyId: [`${aggrIndex}-${index}`]
  };
  return obj;
};

// 设置tooltip，label跟color,yAxis以及yAxisPart
const setYAxisConfig = (yList, tooltipList, colorList, scopeList, data, canvasCss) => {
  let yAxis = [];
  let yAxisPart = [];
  let labelsList = [];
  let aggrIndex = 0;
  for (let i = 0; i < yList.length; i++) {
    if (yList[i].feature) {
      if (yList[i].feature.dtype === 'CAT') {
        yAxisPart.push(setPartObj(yList[i].feature, aggrIndex, i, canvasCss));
      } else {
        yAxis.push([setYAxisObj(yList[i].feature, 'left', aggrIndex, 0, canvasCss)]);
        colorList.push(...setColorObj(yList[i].feature, aggrIndex, 0));
        labelsList.push(...setLabelList(yList[i].feature, aggrIndex, 0, canvasCss));
        scopeList.push(setScopeObj(yList[i].feature, aggrIndex, 0,));
        aggrIndex++;
      }
      tooltipList.push(...setToolTipList(yList[i].feature));
    } else if (yList[i].left || yList[i].right) {
      let left = yList[i].left;
      let right = yList[i].right;
      let list = [];
      setYAxisList(left, 'left', list, tooltipList, labelsList, colorList, scopeList, i, 0, aggrIndex, canvasCss);
      setYAxisList(right, 'right', list, tooltipList, labelsList, colorList, scopeList, i, left.length, aggrIndex, canvasCss);
      aggrIndex++;
      yAxis.push(list);
    } else if (yList[i].pills) {
      let left = yList[i].pills.filter(item => item.status === 'left');
      let right = yList[i].pills.filter(item => item.status === 'right');
      let list = [];
      setYAxisList(left, 'left', list, tooltipList, labelsList, colorList, scopeList, i, 0, aggrIndex, canvasCss);
      setYAxisList(right, 'right', list, tooltipList, labelsList, colorList, scopeList, i, left.length, aggrIndex, canvasCss);
      aggrIndex++;
      yAxis.push(list);
    } else {
      if (yList[i].dtype === 'CAT') {
        yAxisPart.push(setPartObj(yList[i], aggrIndex, i, canvasCss));
      } else {
        yAxis.push([setYAxisObj(yList[i], 'left', aggrIndex, 0, canvasCss)]);
        labelsList.push(...setLabelList(yList[i], aggrIndex, 0, canvasCss));
        colorList.push(...setColorObj(yList[i], aggrIndex, 0));
        scopeList.push(setScopeObj(yList[i], aggrIndex, 0,));
        aggrIndex++;
      }
      tooltipList.push(...setToolTipList(yList[i]));
    }
  }

  // data对应feature
  for (let i = 0; i < yAxis.length; i++) {
    for (let j = 0; j < yAxis[i].length; j++) {
      let leftLen = 0;
      if (yAxis[i][j].position === 'left') {
        leftLen = yAxis[i][j].key.length;
        // 柱状图，线形图，条形图
        if (data[i].left || data[i].feature) {
          yAxis[i][j].data = data[i].left || [data[i].feature];
        } else {
          // 组合图
          if (data[i][0] instanceof Array) {
            yAxis[i][j].data = data[i].splice(0, leftLen);
          } else {
            yAxis[i][j].data = [data[i].splice(0, data[i].length)];
          }
        };
      } else {
        // 柱状图，线形图，条形图
        if (data[i].right) {
          yAxis[i][j].data = data[i].right;
        } else {
          // 组合图
          if (data[i][0] instanceof Array) {
            yAxis[i][j].data = data[i].splice(leftLen, data[i].length);
          } else {
            yAxis[i][j].data = [data[i].splice(leftLen, data[i].length)];
          }
        }
      }
    }
  };
  return {
    yAxis,
    yAxisPart,
    labelsList,
  };
};

const syncYAxisStyle = (list) => {
  let grid = list[0][0].grid;
  let titleStyle = list[0][0].title.style;
  let line = list[0][0].line;
  for (let i = 0, len = list.length; i < len; i++) {
    for (let j = 0; j < list[i].length; j++) {
      list[i][j].grid = grid;
      list[i][j].title.style = titleStyle;
      list[i][j].line = line;
    }
  }
};

const getXAxisStyle = (xAxisObj, axisStyle) => {
  let keyId = xAxisObj.keyId;
  for (let i = 0; i < axisStyle.length; i++) {
    if (keyId === axisStyle[i].keyId) {
      let titleValue = axisStyle[i].title.value;
      let keyValue = axisStyle[i].key;
      axisStyle[i].key = xAxisObj.key;
      if (titleValue === keyValue) {
        axisStyle[i].title.value = xAxisObj.title.value;
      }
      return JSON.parse(JSON.stringify(axisStyle[i]));
    }
  }
  return JSON.parse(JSON.stringify(xAxisObj));
};

const setXAxisStyle = (xAxis, xAxisPart, axisStyle) => {
  let arr = [];
  let xAxisStyle = axisStyle ? axisStyle.filter(item => item.axisType === 'x') : [];
  for (let i = 0; i < xAxis.length; i++) {
    let obj = getXAxisStyle(xAxis[i], xAxisStyle);
    obj.axisType = 'x';
    xAxis[i] = obj;
    arr.push(obj);
  };
  for (let i = 0, len = xAxisPart.length; i < len; i++) {
    let obj = getXAxisStyle(xAxisPart[i], xAxisStyle);
    obj.axisType = 'x';
    xAxisPart[i] = obj;
    arr.push(obj);
  }
  return arr;
};

const getYAxisStyle = (yAxisObj, yAxisStyle) => {
  let keyId = JSON.stringify(yAxisObj.keyId);
  for (let i = 0; i < yAxisStyle.length; i++) {
    if (keyId === JSON.stringify(yAxisStyle[i].keyId)) {
      let titleValue = yAxisStyle[i].title.value;
      let keyValue = yAxisStyle[i].key.join('&');
      yAxisStyle[i].key = yAxisObj.key;
      if (titleValue === keyValue) {
        yAxisStyle[i].title.value = yAxisObj.title.value;
      }
      return JSON.parse(JSON.stringify(yAxisStyle[i]));
    }
  }
  let obj = JSON.parse(JSON.stringify(yAxisObj));
  if (yAxisStyle.length) {
    obj.grid = yAxisStyle[0].grid;
    obj.line = yAxisStyle[0].line;
    obj.title.style = yAxisStyle[0].title.style;
  }
  return obj;
};

const setYAxisStyle = (yAxis, axisStyle) => {
  let arr = [];
  let yAxisStyle = axisStyle ? axisStyle.filter(item => item.axisType === 'y') : [];
  for (let i = 0; i < yAxis.length; i++) {
    for (let j = 0; j < yAxis[i].length; j++) {
      let obj = getYAxisStyle(yAxis[i][j], yAxisStyle);
      delete obj.data;
      obj.axisType = 'y';
      yAxis[i][j].label = obj.label;
      yAxis[i][j].grid = obj.grid;
      yAxis[i][j].line = obj.line;
      yAxis[i][j].title = obj.title;
      arr.push(obj);
    }
  }
  return arr;
};

const mergeStyle = (config, axisStyle) => {
  let xAxisArr = setXAxisStyle(config.xAxis, config.xAxisPart || [], axisStyle);
  let yAxisArr = setYAxisStyle(config.yAxis, axisStyle);
  return [...xAxisArr, ...yAxisArr];
};

const mergeColor = (config, colorList) => {
  let list = config.colorList;
  if (!list || !list.length) return [];
  if (!colorList) return;
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < colorList.length; j++) {
      if (list[i].keyId === colorList[j].keyId && list[i]) {
        colorList[j].key = list[i].key;
        colorList[j].keyName = list[i].keyName;
        colorList[j].canvasType = list[i].canvasType;
        colorList[j].type = list[i].type;
        if (list[i].feature !== colorList[j].feature) {
          colorList[j].list = [];
          colorList[j].fillType = 'fill';
        }
        colorList[j].feature = list[i].feature;
        list.splice(i, 1, colorList[j]);
      }
    }
  };
};

const mergeTooltipList = (config, tooltipList) => {
  let list = config.tooltipList;
  if (!list || !list.length) return [];
  if (!tooltipList) return;
  for (let i = 0, len = list.length; i < len; i++) {
    for (let j = 0, len1 = tooltipList.length; j < len1; j++) {
      if (tooltipList[j].key === list[i].key) {
        let obj = JSON.parse(JSON.stringify(tooltipList[j]));
        obj.key = list[i].key;
        obj.title = list[i].title;
        list.splice(i, 1, obj);
      }
    }
  }
};

const mergeLabelList = (config, labelsList) => {
  let list = config.labelsList;
  if (!list || !list.length) return [];
  if (!labelsList) return;
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < labelsList.length; j++) {
      if (list[i].keyId === labelsList[j].keyId &&
         list[i].key === labelsList[j].key &&
         list[i].title === labelsList[j].title) {
        let obj = JSON.parse(JSON.stringify(labelsList[j]));
        obj.key = list[i].key;
        obj.title = list[i].title;
        obj.type = list[i].type;
        list.splice(i, 1, obj);
      }
    }
  }
};

const mergeScopeList = (config, scopeList) => {
  let list = config.scopeList;
  if (!list || !list.length) return [];
  if (!scopeList) return;
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < scopeList.length; j++) {
      let isKey = JSON.stringify(list[i].key) === JSON.stringify(scopeList[j].key);
      let isKeyId = JSON.stringify(list[i].keyId) === JSON.stringify(scopeList[j].keyId);
      if (isKeyId && isKey) {
        let obj = JSON.parse(JSON.stringify(scopeList[j]));
        obj.key = list[i].key;
        obj.keyId = list[i].keyId;
        list.splice(i, 1, obj);
      }
    }
  }
};

export {
  setConfig
};
