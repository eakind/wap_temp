import {
  getBaseConfig,
  modifyAggrFeature,
  getColorSizeLabel,
} from './baseConfig';
import { isDefined, notEmpty, isEmpty } from '../check';
let drawMapObj = function({ canvasCss, data, featureList, mapChange, ids }) {
  let baseConfig = getBaseConfig(canvasCss);
  /**
   * 设置画布大小
   */
  function setCanvasSize() {
    baseConfig.map.change = mapChange;
    baseConfig.map.showLatLong = true;
  }

  /**
   * 设置画布数据
   */
  let colAggr = [];
  let rowAggr = [];
  function setCanvasData() {
    baseConfig.data.type = 'map';
    setColumn();
    // 获取cat
    function setColumn() {
      colAggr = ['latitude'];
      rowAggr = ['longitude'];
      baseConfig.data.column.aggressions = colAggr;
      baseConfig.data.row.aggressions = JSON.parse(JSON.stringify(rowAggr));
    }
  }
  /**
   * 设置颜色范围
   */
  function setColorRange() {
    let temp_list = notEmpty(canvasCss.colors_and_opacities_list)
      ? canvasCss.colors_and_opacities_list
      : [];
    baseConfig.color.schemes = temp_list.map((c) => c.schemes);
    baseConfig.color.opacity = temp_list.map((c) => c.opacity / 100);
    let colors = notEmpty(canvasCss.colors)
      ? canvasCss.colors.filter((c) => c.colorList).map((c) => c.colorList)
      : [];
    baseConfig.color.colors = colors;
    baseConfig.data.range.color = notEmpty(canvasCss.colorRanges)
      ? canvasCss.colorRanges.map((c) => c.range)
      : [];
    baseConfig.data.range.size = notEmpty(canvasCss.sizeRanges)
      ? canvasCss.sizeRanges.map((c) => c.range)
      : [];
  }

  /**
   *设置大小标签等等
   */
  let labeled = [];
  let sized = {};
  let colored = {};
  function setColorSizeLabelData() {
    let label =
      featureList.labels ||
      featureList.label ||
      featureList.text ||
      canvasCss.labeled;
    let color = featureList.color;
    let size = featureList.size;
    colored = isDefined(color)
      ? getColorSizeLabel(
          'color',
          color,
          baseConfig.data.column.categories,
          baseConfig.data.row.categories
        )
      : {};
    if (isDefined(canvasCss.labeled) && canvasCss.labeled.length) {
      labeled = canvasCss.labeled.map((el) => ({
        feature: el,
      }));
    } else {
      labeled = isDefined(label) ? getColorSizeLabel('label', label) : [];
    }
    sized = isDefined(size) ? getColorSizeLabel('size', size) : {};
    baseConfig.data.sized = sized;
    baseConfig.data.colored = colored;
    baseConfig.data.labeled = labeled.map((l) => l.feature);
    return baseConfig;
  }
  /**
   * 获取提示框数据
   */
  function getTooltipList() {
    let tooltipList = [];
    let name = [];
    let areas = isDefined(featureList.area)
      ? featureList.area.map((v) => v.name)
      : [];
    areas.forEach((a) => {
      tooltipList.push({
        type: 'ordinal',
        feature: a,
      });
      name.push(a);
    });

    notEmpty(sized) &&
      tooltipList.push({
        type: 'linear',
        feature: sized.feature,
      });

    notEmpty(colored) &&
      tooltipList.push({
        type: 'linear',
        feature: colored.feature,
      });

    notEmpty(sized) && name.push(sized.feature);

    notEmpty(colored) && name.push(colored.feature);

    notEmpty(featureList.labels) &&
      featureList.labels.forEach((l) => {
        let tempName = modifyAggrFeature(l);
        tooltipList.push({
          feature: tempName,
          type: l.dtype === 'AGGR' ? 'linear' : 'ordinal',
        });
        name.push(tempName);
      });

    let uniqueList = [];
    let uniqueName = [];
    tooltipList.forEach((t) => {
      let exit = uniqueList.filter((old) => old.feature === t.feature);
      name.filter((i) => i === t.feature);
      if (isEmpty(exit)) {
        uniqueList.push(t);
        uniqueName.push(t.feature);
      }
    });
    // baseConfig.tooltip.name = name;
    return { uniqueList, uniqueName };
  }
  /**
   * 获取color
   */
  function getStyles(ins) {
    let list = [];
    let size = [];
    list = list.concat(ins.getColorList());
    size = size.concat(ins.getSizeList());
    list.forEach((c) => {
      c.list.forEach((l) => {
        l.id = c.id;
        l.aggr = c.aggr;
        l.type = c.type;
        l.key_id = c.key_id;
      });
    });
    let obj = {
      colors: list,
      sizes: size,
      ids: ids,
    };
    return obj;
  }

  function setCanvasId () {
    canvasCss.id = ids;
  }
 
  return {
    setCanvasSize,
    setCanvasData,
    setColorRange,
    setColorSizeLabelData,
    getTooltipList,
    getStyles,
    setCanvasId
  };
};

let drawMap = function({ canvasCss, featureList, ids }) {
  let drawMapFun = drawMapObj({
    canvasCss,
    featureList,
    ids
  });
  drawMapFun.setCanvasId();
  // // 设置画布数据
  drawMapFun.setCanvasData();
  // // 右边栏
  drawMapFun.setColorRange();

  // 设置颜色大小label
  let baseConfig = drawMapFun.setColorSizeLabelData();
  // 获取tooltipsList
  let {
    uniqueList: tooltipList,
    uniqueName: name,
  } = drawMapFun.getTooltipList();
  baseConfig.tooltip.name = name;

  // canvasCss.labelFeature = tooltipList;
  // canvasCss.point = baseConfig.point;
  // canvasCss.column = baseConfig.data.column;
  // canvasCss.row = baseConfig.data.row;
  // canvasCss.colorFeature = baseConfig.data.colored;
  // canvasCss.sizeFeature = baseConfig.data.sized;
  // canvasCss.tooltipList =tooltipList;

  return canvasCss;
};
export { drawMap };
