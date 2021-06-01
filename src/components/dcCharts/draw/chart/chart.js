import { Chart, getEngine } from '@antv/g2';

import defaultConfig from '../../utils/baseConfig.js';

import { dataProcess, styleProcess } from '../../utils/util.js';

import { notEmpty } from '@/utils/check.js';

let { colorSet, defaultText, defaultFormat } = defaultConfig;
class Geometry {
  constructor(data, config) {
    this.chart = new Chart({
      container: config.id,
      // autoFit: true,
      width: config.width,
      height: config.height,
    });

    this.data = data;
    this.config = config;
    this.hasTwoOrdinal = false;
    this.colorFeatureArr = [];
    // this.dotArr = [];
    let labelOrdinal = this.config.labelFeature.filter(item => item.type === 'ordinal');
    // 如果颜色和标签都有分类特征，需要将颜色标签相同的数据区分开
    if (notEmpty(this.config.colorFeature) && this.config.colorFeature.type === 'ordinal') {
      let index = 0;
      this.data.forEach((i, idx) => {
        // 颜色特征的数据中如果有小数点，标签的显示会有问题：无法使用蜘蛛标签
        if (typeof (i[config.colorFeature.feature]) === 'string') {
          let dotArr = [];
          // i[config.colorFeature.feature] = i[config.colorFeature.feature].replaceAll('.', '');
          i[config.colorFeature.feature] = i[config.colorFeature.feature].replace(/\./g, (item, index) => {
            dotArr.push(index);
            this.data[idx].dotArr = dotArr;
            return 'a';
          });
        }
        if (notEmpty(labelOrdinal)) {
          i[config.colorFeature.feature] = i[config.colorFeature.feature] + 'shulifang' + index++;
        }
        if (this.colorFeatureArr.indexOf(i[config.colorFeature.feature]) < 0) {
          this.colorFeatureArr.push(i[config.colorFeature.feature]);
        }
      });
    }
    this.geometry = null;
    this.timer = null;
  }

  init() {
    // 数据绑定
    this.dataBind();

    // 主题色设置
    this.themeConfig();
  }

  dataBind() {
    this.chart.data(this.data);
  }

  themeConfig() {
    this.chart.theme({
      styleSheet: {
        paletteQualitative10: colorSet.category.slice(0, 10),
        paletteQualitative20: colorSet.category,
      },
    });
  }

  tooltipConfig(list) {
    this.chart.tooltip({
      showMarkers: false,
      lineHeight: 24 * this.config.dpr,
      customContent: (name, data) => {
        const container = document.createElement('div');
        container.className = 'g2-tooltip';
        let listItem = '';
        data.forEach((d) => {
          let curDot = d.data.dotArr || [];
          list.forEach((item) => {
            let prop = item.title;
            let val = d.data[item.key];
            let labelOrdinal = this.config.labelFeature.filter(item => item.type === 'ordinal');
            if (notEmpty(this.config.colorFeature) && this.config.colorFeature.type === 'ordinal' && notEmpty(labelOrdinal) && this.config.colorFeature.feature === item.key) {
              let valIndex = val.indexOf('shulifang');
              if (valIndex >= 0) {
                val = val.slice(0, valIndex);
              }
              if (curDot.length > 0) {
                let valArr = val.split('');
                for (let i = 0; i < curDot.length; i++) {
                  valArr[curDot[i]] = '.';
                }
                val = valArr.join('');
              }
            }
            let { text = defaultText, format = defaultFormat } = item;
            if (item.display !== 'none') {
              let curStyleObj = styleProcess(text);
              let retVal = dataProcess(val, format);
              // Object.assign(curStyleObj, {
              //   display: 'inline-flex',
              //   flex: 1,
              //   justifyContent: 'space-between',
              // });
              //  <span >${prop}:</span>  <span>${retVal}</span>
              // ;display:flex;align-items: center;
              listItem += `<li class="g2-tooltip-list-item" style="line-height:.24rem;margin-bottom:4px;${curStyleObj}">
              ${prop}:${retVal}
            </li>`;
            }
          });
        });
        container.innerHTML = listItem;
        return container;
      },
    });
  }

  labelConfig(list, labelFeature) {
    let G = getEngine('canvas');
    let labelOrdinal = this.config.labelFeature.filter(item => item.type === 'ordinal');
    let colorFeatureMark = false;
    if (notEmpty(this.config.colorFeature) && this.config.colorFeature.type === 'ordinal' && notEmpty(labelOrdinal)) {
      colorFeatureMark = true;
    }
    this.geometry.label(labelFeature, {
      lineHeight: (24 % 100) + 'rem',
      layout: [{ type: 'pie-spider' }, { type: 'hide-overlap' }],
      content: (obj, item) => {
        const group = new G.Group({});
        // 了解 shape 的绘制原理：y0 左下起点 y1 右上起点
        const [y0, y1] = item.y || [0, 0];
        //
        let clientHalfW = this.geometry.canvasRegion.width / 2;
        // let clientH = this.geometry.canvasRegion.height;
        let curRadius = this.geometry.coordinate.polarRadius;
        let remainText = clientHalfW - curRadius - 20;

        const inRight = y0 < y1;
        const textAlign = inRight ? 'left' : 'right';

        list.forEach((i, index) => {
          let { text = defaultText, format = defaultFormat } = i;
          let getCurVal = obj[i.key];
          if (colorFeatureMark && typeof (getCurVal) === 'string') {
            let valIndex = getCurVal.indexOf('shulifang');
            if (valIndex >= 0) {
              getCurVal = getCurVal.slice(0, valIndex);
            }
            let curDot = obj.dotArr || [];
            if (this.config.colorFeature.feature === i.key && curDot.length > 0) {
              let valArr = getCurVal.split('');
              for (let i = 0; i < curDot.length; i++) {
                valArr[curDot[i]] = '.';
              }
              getCurVal = valArr.join('');
            }
          }
          let retVal = dataProcess(getCurVal, format);
          // let retVal = dataProcess(obj[i.key], format);
          //
          let hasCnavasWidth = document.body.querySelector('#canvas-width');
          if (hasCnavasWidth) {
            document.body.removeChild(hasCnavasWidth);
          }
          let canvasDom = document.createElement('svg');
          canvasDom.setAttribute('id', 'canvas-width');
          let textDom = document.createElement('text');
          let textNode = document.createTextNode(retVal);
          textDom.appendChild(textNode);
          canvasDom.appendChild(textDom);
          document.body.appendChild(canvasDom);
          let curTextWidth = canvasDom.offsetWidth;
          if (curTextWidth > remainText) {
            retVal = retVal.slice(0, 1) + '...';
          }
          //
          group.addShape({
            type: 'text',
            attrs: {
              x: 0,
              y: 15 * index * this.config.dpr,
              text: retVal,
              fill: text.fontColor,
              fontSize: text.fontSize,
              textBaseline: 'top',
              textAlign,
              lineHeight: (text.lineHeight % 100) + 'rem',
            },
          });
        });
        setTimeout(() => {
          let hasCnavasWidth = document.body.querySelector('#canvas-width');
          if (hasCnavasWidth) {
            document.body.removeChild(hasCnavasWidth);
          }
        }, 2000);
        if (!inRight) {
          group.translate(group.getBBox().width, 0);
        }
        group.translate(0, 16);
        group.on('click', (e) => {
          this.mobileLabel(e, group, list);
          // if (this.timer) {
          //   clearTimeout(this.timer);
          //   setTimeout(() => {
          //     this.mobileLabel(e, group, list);
          //   }, 400);
          // } else {
          //   setTimeout(() => {
          //     this.mobileLabel(e, group, list);
          //   }, 400);
          // }
        });
        return group;
      },
    });
  }

  draw() {
    this.init();
    this.drawGeometry();
  }

  addEvent() {
    let that = this;
    let config = that.config;
    // this.chart.interaction('element-highlight');
    this.chart.interaction('element-highlight', {
      start: [
        {
          trigger: 'interval:click',
          action: 'element-single-highlight:highlight',
          callback(d) {
            typeof that.config.data_click === 'function' &&
              that.config.data_click(d.event.data.data);
          },
        },
      ],
      // start: [{ trigger: 'interval:click', action: 'element-highlight:highlight' }],
      end: [
        {
          trigger: 'click',
          isEnable(context) {
            if (context && context.event && context.event.data && context.event.data.data && config.click) {
              let curData = context.event.data.data;
              let labelOrdinal = config.labelFeature.filter(item => item.type === 'ordinal');
              if (notEmpty(config.colorFeature) && config.colorFeature.type === 'ordinal' && notEmpty(labelOrdinal)) {
                let curColorData = curData[config.colorFeature.feature];
                let valIndex = curColorData.indexOf('shulifang');
                if (valIndex >= 0) {
                  curColorData = curColorData.slice(0, valIndex);
                }
                let curDot = curData.dotArr || [];
                if (curDot.length > 0) {
                  let valArr = curColorData.split('');
                  for (let i = 0; i < curDot.length; i++) {
                    valArr[curDot[i]] = '.';
                  }
                  curColorData = valArr.join('');
                }
                curData[config.colorFeature.feature] = curColorData;
              }
              config.click(curData);
            }
            let curContext = context;
            if (curContext.event.data) {
              let curEle = curContext.view.ele;
              setTimeout(() => {
                curEle.querySelector('.g2-tooltip').style.visibility = 'visible';
              }, 2400);
            }
            return !context.event.data;
          },
          callback() {
            typeof that.config.data_click === 'function' &&
              that.config.data_click();
          },
          action: 'element-single-highlight:clear',
        },
      ],
    });
  }

  /**
   * 自己实现
   */
  drawGeometry() {}
  /**
   *
   * @param {data color tooltip labels} type
   * @param {新值} newData
   */
  chartUpdate(type, newData) {
    let updateFun = (function() {
      return {
        colorUpdate() {
          this.geometry.color(this.config.colorFeature.feature, newData);
        },
        labelsUpdate() {
          this.labelConfig(newData, this.config.sizeFeature.feature);
        },
        tooltipUpdate() {
          this.tooltipConfig(newData);
        },
        dataUpdate() {
          this.chart.data(newData);
        },
      };
    })();

    if (typeof this[type + 'Update'] === 'function') {
      this[type + 'Update'](type, newData);
    } else {
      typeof updateFun[type + 'Update'] === 'function' &&
        updateFun[type + 'Update'].call(this);
    }
    this.chart.render(); // 更新图表
  }
  // mobile
  mobileLabel (e, group, list) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    let LabelDom = document.querySelector('#canvas_over');
    if (LabelDom) {
      document.body.removeChild(LabelDom);
    }
    let data = group.cfg.element.data;
    let retVal = '';
    list.forEach((i, index) => {
      retVal = `${retVal}
                <p style="font-size: ${i.text.fontSize}px">${data[i.key]}</p>`;
      // let style = i.text;
      // let value = data[i.key];
      // let labelFormat = i.format;
      // retVal = `<div 
      //           style="font-size: ${style.fontSize}px;  
      //           text-align: ${style.align}; 
      //           color: ${style.fontColor}; 
      //           font-style: ${style.fontStyle}; 
      //           text-decoration: ${style.decoration}; 
      //           letter-spacing: ${style.letterSpacing}px; 
      //           background-color:'#fff';
      //           line-height: ${style.lineHeight}px; display: ${style.display || 'auto'}">
      //           ${name}${name === '' ? '' : ': '}${formatNumberFunction(value, labelFormat)} 
      //         </div>`;
    });
    let dDom = document.querySelector('#canvas_over');
    if (dDom) {
      document.body.removeChild(dDom);
    }
    let x = e.clientX;
    let y = e.clientY;
    let bodyClientWidth = document.body.clientWidth;
    let bodyClientHeight = document.body.clientHeight;
    let tooltipPosition = '';
      if (x < bodyClientWidth / 2) {
        tooltipPosition = `${tooltipPosition}; left: ${x - 10}px`;
      } else {
        tooltipPosition = `${tooltipPosition}; right: ${bodyClientWidth - x + 10}px`;
      }
      if (y < bodyClientHeight - 300) {
        tooltipPosition = `${tooltipPosition}; top: ${y + 20}px`;
      } else {
        tooltipPosition = `${tooltipPosition}; bottom: ${bodyClientHeight - y - 20}px`;
      }
    let style = `position: absolute;
                font-size: 12px;
                background-color: #fff;
                border-radius: 4px;
                padding: 4px 8px`;
    if (tooltipPosition) {
      style = `${style}; ${tooltipPosition}`;
    }
    dDom = document.createElement('div');
    dDom.setAttribute('id', 'canvas_over');
    dDom.setAttribute('style', style);
    // let dText = document.createTextNode(retVal);
    // dDom.appendChild(dText);
    dDom.innerHTML = retVal;
    document.body.appendChild(dDom);
    this.timer = setTimeout(() => {
      let dDom = document.querySelector('#canvas_over');
      if (dDom) {
        document.body.removeChild(dDom);
      }
    }, 1000);
  }
}

export default Geometry;
