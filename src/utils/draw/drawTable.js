import {
  getBaseConfig,
  modifyAggrFeature,
  getColorSizeLabel
} from './baseConfig';
import {
  isArray,
  isDefined,
  notEmpty,
  isEmpty,
} from '../check';
// import { toPx } from '../index';

let drawTableObj = function drawTableProcess ({
  canvasCss,
  data,
  containerSize,
  // chartSize,
  ids,
  featureList
}) {
  let baseConfig = getBaseConfig(canvasCss);
  /**
     * 设置画布容器大小和背景色等
     */
  function setCanvasSizeAndBg () {
    baseConfig.bindto = `#${ids}`;
    baseConfig.container = containerSize;
    baseConfig.size = containerSize;
    baseConfig.table.background = canvasCss.bgCss;
    baseConfig.table.mode = canvasCss.mode;
  }
  /**
     * 设置画布数据 data row column
     */
  let colCat = [];
  let colAggr = [];
  let rowCat = [];
  let rowAggr = [];
  function setCanvasData () {
    baseConfig.data.json = data;
    baseConfig.data.type = 'table';
    setColumn();
    setRow();
    // 获取cat
    function setColumn () {
      let {
        aggr: columnAggr,
        cat: columnCat
      } = setColRowProcess('col');
      baseConfig.data.column.categories = columnCat;
      baseConfig.data.column.aggressions = columnAggr;
      colCat = columnCat;
      colAggr = columnAggr;
    }
    // 获取aggr
    function setRow () {
      let {
        aggr,
        cat
      } = setColRowProcess('row');
      baseConfig.data.row.aggressions = aggr;
      baseConfig.data.row.categories = cat;
      rowAggr = aggr;
      rowCat = cat;
    }
    /**
         * 设置column row 处理过程
         * @param {col row} type
         */
    function setColRowProcess (type) {
      let cat = [];
      let aggr = [];
      // 容错处理
      featureList[type] && featureList[type].forEach((f, i) => {
        let f_name = modifyAggrFeature(f);
        let f_feature = isDefined(f.feature) ? f.feature : f;
        if (isDefined(f_feature.legend)) {
          aggr.push(f_name);
        } else {
          if (isArray(f_name)) {
            f_name.forEach(c => cat.push(c));
          } else cat.push(f_name);
        }
      });
      return {
        aggr,
        cat
      };
    }
  }
  /**
     * 设置标签颜色大小
     */
  let labeled = [];
  let sized = {};
  let colored = {};

  function setColorSizeLabelData () {
    let label = featureList.labels || featureList.label || featureList.text || canvasCss.labeled;
    let color = featureList.color;
    // let size = featureList.size;
    colored = isDefined(color) ? getColorSizeLabel('color', color, baseConfig.data.column.categories, baseConfig.data.row.categories) : {};
    if (isDefined(canvasCss.labeled) && canvasCss.labeled.length) {
      labeled = canvasCss.labeled.map(el => ({
        feature: el
      }));
    } else {
      labeled = isDefined(label) ? getColorSizeLabel('label', label) : [];
    }
    // sized = isDefined(size) ? getColorSizeLabel('size', size) : {};
    // baseConfig.data.sized = sized;
    baseConfig.data.colored = colored;
    baseConfig.data.labeled = labeled.map((l, idx) => {
      return l.feature;
    });
    return baseConfig;
  }
  /**
     * 设置颜色
     */
  function setColorRange () {
    // if (canvasCss.colors.length > 0) {
    //   let arr = canvasCss.colors[0].colorList || [];
    //   baseConfig.color.colors = [arr];
    //   baseConfig.color.schemes = [arr];
    // }
    // if (canvasCss.colors_and_opacities_list.length > 0) {
    //   baseConfig.color.colors = [canvasCss.colors_and_opacities_list[0].schemes.slice(0, 2)];
    //   baseConfig.color.schemes = canvasCss.colors_and_opacities_list[0].schemes;
    //   baseConfig.color.opacity = canvasCss.colors_and_opacities_list[0].opacity;
    // }
    let temp_list = notEmpty(canvasCss.colors_and_opacities_list) ? canvasCss.colors_and_opacities_list : [];
    baseConfig.color.schemes = temp_list.map(c => c.schemes);
    baseConfig.color.opacity = temp_list.map(c => c.opacity / 100);
    baseConfig.color.colors = notEmpty(canvasCss.colors) ? canvasCss.colors.filter(c => c.colorList).map(c => c.colorList) : [];
    // baseConfig.color.range = canvasCss.colorRanges || [];
    baseConfig.data.range.color = notEmpty(canvasCss.colorRanges) ? canvasCss.colorRanges.map(c => c.range) : [];
    // baseConfig.data.range.size = notEmpty(canvasCss.sizeRanges) ? canvasCss.sizeRanges.map(c => c.range) : [];
  }

  function setTableCellSetting () {
    if (canvasCss.tableSetting) {
      let {
        inner,
        outter,
        padding,
        cell
      } = canvasCss.tableSetting;
      let curInner=JSON.parse(JSON.stringify(inner));
      let curOuter=JSON.parse(JSON.stringify(outter));
      let curPadding=JSON.parse(JSON.stringify(padding));
      let curCell=JSON.parse(JSON.stringify(cell));
      baseConfig.table.inner.width =(curInner.width); 
      baseConfig.table.inner.color = inner.color;
      baseConfig.table.outter.width =(curOuter.width); 
      baseConfig.table.outter.color = outter.color;
      baseConfig.table.padding.top = (curPadding.top); 
      baseConfig.table.padding.bottom = (curPadding.bottom); 
      baseConfig.table.padding.left = (curPadding.left); 
      baseConfig.table.padding.right = (curPadding.right); 
      baseConfig.table.body.width =(Number(curCell.width)) ;
    }
  }
  /**
     * 获取表头信息
     */
  function getTableTitleList () {
    let colCat = JSON.parse(JSON.stringify(baseConfig.data.column.categories));
    let colAggr = JSON.parse(JSON.stringify(baseConfig.data.column.aggressions));
    let rowCat = JSON.parse(JSON.stringify(baseConfig.data.row.categories));
    let rowAggr = JSON.parse(JSON.stringify(baseConfig.data.row.aggressions));
    let tableTitleList = [];
    let column_name = notEmpty(colCat) ? [colCat.join(' / ')] : [];
    if (notEmpty(colAggr) || notEmpty(rowAggr)) {
      baseConfig.data.labeled = [];
      tableTitleList = [...colAggr, ...column_name, ...rowAggr, ...rowCat];
    } else {
      tableTitleList = [...column_name, ...rowCat];
    }
    return tableTitleList;
  }
  /**
     * 获取tooltips
     */
  function getTooltipList () {
    let tooltipList = [];
    colAggr.concat(rowAggr).forEach(aggr => {
      if (isArray(aggr)) {
        aggr.forEach(a => tooltipList.push({
          type: 'linear',
          feature: a
        }));
      } else {
        tooltipList.push({
          type: 'linear',
          feature: aggr
        });
      }
    });
    colCat.concat(rowCat).forEach(aggr => {
      tooltipList.push({
        type: 'ordinal',
        feature: aggr
      });
    });
    notEmpty(sized) && tooltipList.push({
      type: 'linear',
      feature: sized.feature
    });
    notEmpty(colored) && tooltipList.push({
      type: colored.type,
      feature: colored.feature
    });
    labeled.forEach(l => {
      tooltipList.push({
        type: l.type,
        feature: l.feature
      });
    });

    let uniqueList = [];
    tooltipList.forEach(t => {
      let exit = uniqueList.filter(old => old.feature === t.feature);
      if (isEmpty(exit)) {
        uniqueList.push(t);
      }
    });
    return uniqueList;
  }

  return {
    setCanvasSizeAndBg,
    setCanvasData,
    getTableTitleList,
    setColorSizeLabelData,
    getTooltipList,
    setColorRange,
    setTableCellSetting,
    

  };
};

let drawTable = function ({
  canvasCss,
  data,
  containerSize,
  ids,
  featureList
}) {
  let drawTableFun = drawTableObj({
    canvasCss,
    data,
    containerSize,
    ids,
    featureList
  });

  // 设置画布比例大小，颜色
  drawTableFun.setCanvasSizeAndBg();

  // 设置数据
  drawTableFun.setCanvasData();
  // 右边栏颜色范围
  drawTableFun.setColorRange();
  // 设置标签颜色
  let baseConfig = drawTableFun.setColorSizeLabelData();

  // 设置表头
  drawTableFun.setTableCellSetting();

  // 画图
  // let chartIns = mc.generate(baseConfig);

  // 获取表头信息
  // let tableTitleList = drawTableFun.getTableTitleList();

  // 获取提示框信息
  let tooltipList = drawTableFun.getTooltipList();
  baseConfig.tooltipList=tooltipList;

  // 获取style
  // let styles = drawTableFun.getStyles(chartIns);
  // return {
  //   chartIns,
  //   tableTitleList,
  //   tooltipList,
  //   styles
  // };
  return baseConfig;
};
export {
  drawTable
};
