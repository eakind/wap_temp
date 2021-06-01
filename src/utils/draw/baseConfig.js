import {
  isDefined,
  isFunction,
  isString,
  notEmpty,
  isArray,
  inArray,
  dcDeepClone,
  isEmpty,
} from '@/utils/check.js';
import { hexToRgba,toPx } from '../index.js';
const getBaseConfig = function (canvasCss) {
  let config = {
    // 画布id
    bindto: '',
    // svg大小
    size: {
      width: '', // 1080
      height: '', // 600
    },
    // 固定y, y2轴的时候需要
    container: {
      width: '', // 1080
      height: '', // 600
    },
    // 图表缩放因素会影响到鼠标事件中的位置
    scale: 1,
    // smallMultiplePadding: {left: 10, right: 18, top: 10, bottom: 10},
    // 除了标签之外图表中其他元素的字体
    font: {
      size: canvasCss.fontSize || 12,
      color: canvasCss.bgCss ? canvasCss.bgCss.color : '#424242',
    },
    /** *
        1. label_format 格式
        [{
          name: 'sum(sales)',
          'sum(sales)': {
            decimal: 2,
            negative: -1, ['-1234', '(1234)', '1234-'] => [-1, 0, 1]
            prefix: "",
            selectFormat: 'digit', ['digit', 'percent', 'currency']
            suffix: "",
            unit: "", ['', 'k', 'M', 'G', 'T']
            useThousandMark: true,
            zone: '', ['', 'CN', 'JP', 'HK', 'US', 'EUR', 'GBP']
          },
          'sum(profits)': {...}
        }]
        2. label_text 格式
        [{
          name: 'sum(sales)',
          'sum(sales)': {
            align: "right", [left, right, center]
            decoration: "underline",
            fontColor: "#AB1717",
            fontSize: 12,
            fontStyle: "",
            letterSpacing: "0",
            lineHeight: "16.5",
          },
          'sum(profits)': {...}
        }]
        ***/
    label: {
      // 标签的显示：使用千分符、百分比格式、货币格式、数值格式（小数位数、负值显示、单位、前缀后缀，货币的话有区域设置）
      format: canvasCss.labelList
        ? JSON.parse(JSON.stringify(canvasCss.labelList))
        : [],
      // 标签的样式：字体大小、颜色、行距、decoration
      text: canvasCss.textSettings
        ? JSON.parse(JSON.stringify(canvasCss.textSettings))
        : [],
    },
    tooltip: {
      // tooltip的显示：使用千分符、百分比格式、货币格式、数值格式（小数位数、负值显示、单位、前缀后缀，货币的话有区域设置）
      format: canvasCss.tooltipNumberFormat || {},
      // tooltip的样式：字体大小、颜色、行距、decoration
      text: canvasCss.tooltipTextFormat || {},
      show: canvasCss.tooltipShow === undefined ? true : canvasCss.tooltipShow,
      name: [],
    },
    color: {
      // 每个aggression所应用的色板[[], [], ...]
      schemes: [],
      // 每个aggression的透明度[1, 0.9, 0.6,...]
      opacity: [],
      // 每个aggression所对应的颜色[{}, {}, ...]
      colors: [],
      // 每个aggression所对应的填充[{}, {}, ...]
      patterns: [],
    },
    data: {
      type: '',
      // 当combined已有数据时json数组可为空
      json: [],
      // 颜色对象，包括feature, type, stacked这些key (该属性柱、线、或其组合不可用)
      colored: {},
      // 标签数组 (该属性柱、线、或其组合不可用)
      labeled: [],
      // 大小对象 (该属性柱、线、或其组合不可用)
      sized: {},
      // 用户自定义颜色或大小范围
      range: {
        // 每个aggression所对应的大小范围[[], [], ...]，气泡图、地图有
        size: [],
        // 每个aggression所对应的颜色范围[[], [], ...]，颜色为渐变时有
        color: [],
      },
      // 行列数据
      row: {
        categories: [],
        aggressions: [],
      },
      column: {
        categories: [],
        aggressions: [],
      },
      // funnel only, 对比数据
      compare: [],
      compareSized: {},
      compareColored: {},
      /***
            combined 格式 (该属性只有柱、线、或其组合可用)
            [
            {
              axis: 'y',
              bars: {
                aggr: 'sum(Installs)',
                colored: {
                feature: 'Category',
                type: 'ordinal',
                stacked: false
                },
                labels: ['sum(Installs)']
              },
              type: 'bar'
             },
             {
              axis: 'y2',
              bars: {
                aggr: 'sum(Reviews)',
                colored: {
                feature: 'sum(Reviews)',
                type: 'linear',
                stacked: false
                },
                labels: ['sum(Reviews)']
              },
              type: 'line'
             }
            ]
            ***/
      combined: [],
      click: clickElement,
    },
    bar: {
      // 柱子间的距离
      padding: {
        inner: 0.01,
        outter:
          (1 - (isDefined(canvasCss.size) ? canvasCss.size : 50) / 100) / 2,
      },
    },
    line: {
      // 线粗细+点大小
      size: canvasCss.size_line / 25 || 2,
      // 点形状
      pattern: canvasCss.point_style || 'circle', // cross, cross45, triangle, triangle180, star, diamond, square, wye
    },
    // 画坐标轴
    axis: {
      combined: false,
      rotated: false,
      x: {
        show: true,
        type: canvasCss.x_dataType || 'category', // bin, category, numeric, (timeseries: 暂未实现)
        tick: {
          style: {},
          counts: null,
          range: [],
          rotate: undefined,
        },
        text: {
          style: {},
          title: '',
          show: true,
        },
        line: {
          style: {},
          show: true,
        },
        percent: false, // 按照百分比展示
      },
      // 这几个跟zoom axis有关
      zoom: {
        scale: 1,
        translate: undefined,
        panning: undefined,
        enable: canvasCss.selectFromChart || false,
      },
    },
    grid: {
      style: {},
      show: true,
    },
    cutoff: {
      style: {},
      show: true,
    },
    divide: {
      column: {
        text: {
          style: {},
          title: '',
          show: false,
        },
        tick: {
          styleList: [],
          rotate: 0,
        },
      },
      row: {
        text: {
          style: {},
          title: '',
          show: false,
        },
        tick: {
          styleList: [],
          rotate: 0,
        },
      },
    },
    // table
    table: {
      mode: 'standard',
      // 外边框
      outter: isDefined(canvasCss.tableSetting)
        ? canvasCss.tableSetting.outter
        : {
          color: '#C2C9D1', // '#424242',
          width: 2,
        },
      // 内边框
      inner: isDefined(canvasCss.tableSetting)
        ? canvasCss.tableSetting.inner
        : {
          color: '#C2C9D1', // '#a4a4a4',
          width: 1,
        },
      // 边距
      padding: isDefined(canvasCss.tableSetting)
        ? canvasCss.tableSetting.padding
        : {
          top: 0,
          left: 3,
          bottom: 0,
          right: 3,
        },
      // 表头
      header: {
        top: {
          height: 35,
        },
        left: {
          width: [], // auto为true时可不提供
        },
        auto: true,
      },
      // cell
      body: {
        width:
          isDefined(canvasCss.tableSetting) &&
          isDefined(canvasCss.tableSetting.cell)
            ? canvasCss.tableSetting.cell.width
            : 100,
        height: 24,
        auto:
          canvasCss.dashboard_viewMode === 'fitWidth' ||
          canvasCss.dashboard_viewMode === 'full', // true:忽略width
      },
      title: canvasCss.tableTitleDataFormat || [],
      background: canvasCss.bgCss,
      /* table_text 格式
            {
              key: '',
              style: {},
              title: '',
              show: true
            }
            */
    },
    // funnel 漏斗图
    funnel: {
      type: 'data', // data 根据数据绘制, smooth, smooth_invert 直接无视数据等差绘制
      shape: 'trapezium', // rect 矩形, trapezium  梯形 | 三角形, 由 minwidth 控制
      minwidth: 200, // 最小宽度，设为0表现为三角形
      sort: 0, // -1, 0, 1 数据排序
      gap: 2, // 行间距
      align: 'center', // 对齐 left,center,right
      rowMinHeight: 40, // 最小行高
      innerPaddingLeft: 120, // 漏斗图的内padding，避免 label 超出
      innerPaddingRight: 120,
      labelPosition: 'middle', // left, middle, right
      conversion: true,
      conversionColor: '#424242',
      conversionFontsize: 12,
      compare: {
        type: 'data',
        layout: 'horizontal', // inner, horizontal, (vertical 暂时废弃)
        labelPosition: 'middle',
      },
    },
    // map
    map: {
      // 放大倍数
      level: canvasCss.mapZoom || undefined,
      // 中心点
      center: canvasCss.mapCenter || [],
      // zoom对应的事件
      change: undefined,
      showLatLong: false,
    },
    // map, scatter 点最小直径
    point: {
      size: canvasCss.size / 25 || 2,
    },
    // bubble and pie 直径
    arc: {
      size: canvasCss.size || 70,
      innerRadius: canvasCss.innerRadius || 0,
    },
    // bubble
    order: {
      style: isDefined(canvasCss.orderStyle) ? canvasCss.orderStyle : -1,
    },
    area: {
      opacity: canvasCss.isFillArea ? 0.25 : 0,
    },
  };
  return dcDeepClone(config);
};

function clickElement (element) {
  sessionStorage.setItem('userClickItem', JSON.stringify(element));
}
function modifyAggrFeature (feature_name, returnObj) {
  if (!feature_name) return feature_name;
  let f_name = isDefined(feature_name.feature)
    ? feature_name.feature
    : feature_name;
  let new_name = f_name.name;
  let f_splits = f_name.split;
  let f_legend = f_name.legend;
  let f_prop = f_name.probability || '';
  let f_rate = f_name.rate || {};
  if (isDefined(f_splits) && !isFunction(f_splits)) {
    if (isString(f_splits)) {
      let temp_str = f_splits
        .split(',')
        .map((e) => e.toLowerCase())
        .join('-');
      new_name = `${f_name.name} ${temp_str}`;
    } else {
      let temp_arr = [];
      f_splits.forEach((v) =>
        temp_arr.push(`${f_name.name} ${v.toLowerCase()}`)
      );
      new_name = temp_arr;
    }
  }
  if (isDefined(f_legend)) {
    let val = f_legend.toLowerCase();
    if (feature_name.formulaType === 'AGGR') {
      new_name = f_name.name;
    } else {
      new_name = `${val}${f_prop}(${f_name.name})`;
    }

    // 同比环比
    if (notEmpty(f_rate)) {
      let { type, growth } = f_rate;
      if (growth) {
        new_name = `${
          type === 'RING' ? 'Last Period' : 'Same Period'
        } Growth ${new_name}`;
      } else {
        new_name = `${
          type === 'RING' ? 'Last Period' : 'Same Period'
        } ${new_name}`;
      }
    }
  }

  return returnObj
    ? {
      name: new_name,
      percent: notEmpty(f_rate),
    }
    : new_name;
}

function getColorSizeLabel (type, list, x_cat_list, y_cat_list) {
  let processObj = (function () {
    return {
      colorProcess () {
        let color_feature = {};
        let new_feature = list && isDefined(list.feature) ? list.feature : list;
        let feature_name = '';
        let f_name = modifyAggrFeature(new_feature);
        feature_name = isArray(f_name) ? f_name[0] : f_name;

        color_feature.feature = feature_name;
        if (
          inArray(x_cat_list, feature_name) ||
          inArray(y_cat_list, feature_name)
        ) {
          color_feature.type = 'ordinal';
          color_feature.stacked = false;
        } else {
          color_feature.type =
            new_feature && isDefined(new_feature.legend) ? 'linear' : 'ordinal';
          color_feature.stacked = color_feature.type === 'ordinal';
        }
        return color_feature;
      },
      labelProcess () {
        return list.map((v) => {
          let new_feature = isDefined(v.feature) ? v.feature : v;
          let temp = '';
          let f_name = modifyAggrFeature(new_feature);
          temp = isArray(f_name) ? f_name[0] : f_name;
          return {
            type: isDefined(new_feature.legend) ? 'linear' : 'ordinal',
            feature: temp,
          };
        });
      },
      sizeProcess () {
        let size_feature = {};
        let temp = '';
        let f_name = modifyAggrFeature(list);
        temp = isArray(f_name) ? f_name[0] : f_name;
        size_feature.feature = temp;
        return size_feature;
      },
    };
  })();
  return (
    typeof processObj[type + 'Process'] === 'function' &&
    processObj[type + 'Process']()
  );
}

function initTooltipList ({ sized, labeled, colored, chartType, x, y }) {
  let tooltipList = [];
  notEmpty(x) &&
    x.forEach((l) => {
      let { dtype, name } = l;
      dtype = dtype === 'AGGR' ? 'linear' : 'ordinal';
      name = modifyAggrFeature(l);
      tooltipList.push(retTooltipLabelItemObj(l, dtype, name));
    });

  notEmpty(y) &&
    y.forEach((l) => {
      let { dtype, name } = l;
      name = modifyAggrFeature(l);
      dtype = dtype === 'AGGR' ? 'linear' : 'ordinal';
      tooltipList.push(retTooltipLabelItemObj(l, dtype, name));
    });

  notEmpty(sized) && tooltipList.push(retTooltipLabelItemObj(sized, 'linear'));
  if (chartType === 'pie') {
    tooltipList.push(
      retTooltipLabelItemObj(sized, 'linear', `${sized.feature} percent`, true)
    );
  }
  notEmpty(colored) && tooltipList.push(retTooltipLabelItemObj(colored));
  labeled.forEach((l) => {
    tooltipList.push(retTooltipLabelItemObj(l));
  });

  // 去重
  let uniqueList = [];
  tooltipList.forEach((t) => {
    let exit = uniqueList.filter((old) => old.key === t.key);
    if (isEmpty(exit)) {
      uniqueList.push(t);
    }
  });
  return uniqueList;
}

function retTooltipLabelItemObj (item, type, feature, isPercent) {
  let format = isPercent
    ? defaultConfig.defaultPercentFormat
    : defaultConfig.defaultFormat;
  type = type || item.type;
  let textObj=JSON.parse(JSON.stringify(defaultConfig.defaultText));
  textObj.fontSize=toPx(textObj.fontSize);
  textObj.lineHeight=toPx(textObj.lineHeight);
  return {
    type: type,
    key: feature || item.feature,
    title: feature || item.feature,
    display: 'auto',
    format: type === 'linear' ? format : {},
    text: textObj,
  };
}

function initLabelsList (list) {
  let retList = [];
  retList = list.map((i) => retTooltipLabelItemObj(i));
  return retList;
}

let defaultConfig = {
  colorSet: {
    category: [
      '#4284F5',
      '#03B98C',
      '#FACC14',
      '#F5282D',
      '#8543E0',
      '#3FAECC',
      '#3110D0',
      '#E88F00',
      '#DE2393',
      '#91BA38',
      '#99B4BF',
      '#216A58',
      '#AB9438',
      '#F4999B',
      '#C9BFE1',
      '#055166',
      '#1F135A',
      '#43140A',
      '#96005A',
      '#8D8D8D',
    ], // 分类特征默认颜色
    numeric: ['#7AC9F5', '#2A5783'],
  },
  defaultText: {
    fontColor: '#6b6b6b',
    fontSize: 12,
    textAlign: 'left',
    lineHeight: 24,
    display: 'auto',
  },
  defaultFormat: {
    selectFormat: -1,
    decimal: 2,
    negative: '-1',
    unit: '',
    prefix: '',
    suffix: '',
    zone: 'CN',
    useThousandMark: true,
  },
  defaultPercentFormat: {
    selectFormat: 'percent',
    decimal: 2,
    prefix: '',
    suffix: '%',
    isPercent: true,
  },
  axisDefaultStyle: {
    title: {
      fontSize: 12,
      fontColor: '#6b6b6b',
      rotate: 0,
    },
    line: {
      fontColor: '#dedede',
      lineWidth: 1,
      lineDash: [0, 0],
    },
    label: {
      fontSize: 12,
      fontColor: '#6b6b6b',
      rotate: 0,
    },
  },
};

let chartStyleProcessFun = function (featureList, canvasCss, chartType) {
  let { tooltipList = [], labelsList = [], colorList = [] } = canvasCss;
  let { color = [], size = [], labels = [], x = [], y = [] } = featureList;
  let colored = isDefined(color)
    ? getColorSizeLabel('color', color, [], [])
    : {};

  let sized = isDefined(size) ? getColorSizeLabel('size', size) : {};

  let labeled = isDefined(labels)
    ? getColorSizeLabel('label', labels) || []
    : [];

  return {
    tooltipProcess () {
      // 初始化tooltip
      let curList = initTooltipList({
        colored,
        sized,
        labeled,
        chartType,
        x,
        y,
      });
      if (tooltipList.length === 0) {
        return curList;
      }
      // 比较
      curList = curList.map((curItem) => {
        let exit = tooltipList.find((t) => t.key === curItem.key);
        if (exit) {
          curItem.format = exit.format;
          curItem.text = exit.text;
          curItem.display = exit.display;
        }
        curItem.text.fontSize=toPx(curItem.text.fontSize);
        curItem.text.lineHeight=toPx(curItem.text.lineHeight);
        return curItem;
      });
      return curList.filter((i) => i.key);
    },
    labelsProcess (fontColor) {
      // 1. 过滤掉size
      let labelNotContainSize = labeled.filter(
        (i) => i.feature !== sized.feature
      );
      let retList = initLabelsList(labelNotContainSize) || [];

      // 判断 是否显示百分比
      if (canvasCss.checked) {
        retList.unshift(
          retTooltipLabelItemObj(
            sized,
            'linear',
            `${sized.feature} percent`,
            true
          )
        );
      }
      // 判断是否显示原数据
      if (canvasCss.originalChecked) {
        retList.unshift(retTooltipLabelItemObj(sized, 'linear'));
      }
      if (chartType === 'scatter' || chartType === 'pie' || chartType === 'bubble') {
        for (let i = 0; i < retList.length; i++) {
          if (fontColor) {
            retList[i].text.fontColor = fontColor;
          }
        }
      }
      if (labelsList.length === 0) {
        return retList;
      }

      retList.map((curItem) => {
        let exit = labelsList.find((t) => t.key === curItem.key);
        if (exit) {
          curItem.format = exit.format;
          curItem.text = exit.text;
          curItem.display = exit.display;
        }
        curItem.text.fontSize=toPx(curItem.text.fontSize);
        curItem.text.lineHeight=toPx(curItem.text.lineHeight);
        return curItem;
      });

      if (chartType === 'scatter' || chartType === 'pie' || chartType === 'bubble') {
        for (let i = 0; i < retList.length; i++) {
          if (fontColor) {
            retList[i].text.fontColor = fontColor;
          }
        }
      }

      return retList;
    },
    features () {
      return {
        sized,
        labeled,
        colored,
      };
    },
    colorListProcess () {
      let color = [];
      let opacity = 100;
      if (colorList && colorList.length > 0) {
        color = colorList[0].list.map((i) => {
          let opacity = i.opacity || colorList[0].opacity || 100;
          if (i.color.indexOf('#') || opacity === 100) {
            return i;
          }
          return {
            color: hexToRgba(i.color, opacity),
            val: i.val
          };
        });
        opacity = colorList[0].opacity || 100;
      } else {
        color = defaultConfig.colorSet.category;
        if (colored.type === 'linear') {
          color = defaultConfig.colorSet.numeric;
        }
      }
      return { color, opacity };
    },
  };
};

export {
  getBaseConfig,
  modifyAggrFeature,
  getColorSizeLabel,
  initTooltipList,
  initLabelsList,
  retTooltipLabelItemObj,
  defaultConfig,
  chartStyleProcessFun,
};
