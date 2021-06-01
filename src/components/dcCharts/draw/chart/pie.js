import Geometry from './chart.js';
import { rgbToHex } from '@/utils/index.js';
import { toScientificNotation } from '../../utils/util.js';
import colorConfig from '../../utils/baseConfig.js';
import { notEmpty } from '@/utils/check.js';
let { colorSet } = colorConfig;
class Pie extends Geometry {
  // eslint-disable-next-line no-useless-constructor
  constructor (data, config) {
    super(data, config);
  }

  drawGeometry () {
    let radiusObj = {
      radius: this.config.size,
    };
    if (this.config.innerRadius === 1) {
      radiusObj.innerRadius = radiusObj.radius - 0.15;
    }

    let colorList = this.config.colorList;
    let curColorList = colorList.map((i) => i?.color || i);
    // 处理颜色
    if (this.config.colorFeature) {
      let { type, feature } = this.config.colorFeature;
      if (type === 'linear') {
        curColorList = [];
        let sortData = this.data.sort((a, b) => a[feature] - b[feature]);
        let min = sortData[0][feature] || 0;
        let max = sortData[sortData.length - 1][feature] || 0;
        if (notEmpty(this.config.colorList) && this.config.colorList[0].originalVal && this.config.colorList[1].originalVal) {
          if (this.config.colorList[0].check) {
            min = this.config.colorList[0].originalVal;
          }
          if (this.config.colorList[1].check) {
            max = this.config.colorList[1].originalVal;
          }
          // min = this.config.colorList[0].originalVal;
          // max = this.config.colorList[1].originalVal;
        }
        this.data.forEach((i) => {
          curColorList.push(this.getItemColor(i[feature], max, min));
        });
      }
    }

    // 饼图
    this.chart.coordinate('theta', radiusObj);

    this.chart.legend(false);

    this.tooltipConfig(this.config.tooltipList);
    let colorFeature = this.config.colorFeature.feature;
    this.geometry = this.chart
      .interval()
      .adjust('stack')
      .position(this.config.sizeFeature.feature);
    let match = this.config.labelsList.find((i) => i.type === 'ordinal');

    if (colorFeature) {
      // if (this.config.colorFeature.type === 'linear') {
      //   colorFeature = match ? match.key : colorFeature;
      // }
      // this.geometry.color(colorFeature, curColorList);
      if (this.config.colorFeature.type === 'linear') {
        colorFeature = match ? match.key : colorFeature;
        this.geometry.color(colorFeature, curColorList);
      } else {
        let labelOrdinal = this.config.labelFeature.filter(item => item.type === 'ordinal');
        if (notEmpty(this.config.colorFeature) && this.config.colorFeature.type === 'ordinal' && notEmpty(labelOrdinal)) {
          this.geometry.color(colorFeature, (val) => {
            let colorIndex = this.colorFeatureArr.indexOf(val);
            return curColorList[colorIndex];
          });
        } else {
          this.geometry.color(colorFeature, curColorList);
        }
      }
    } else {
      if (match) {
        this.geometry.color(match.key, curColorList[0]);
      }
    }

    if (this.config.labelsList.length > 0) {
      this.labelConfig(this.config.labelsList, this.config.sizeFeature.feature);
    }

    this.chart.render();

    this.addEvent();
  }

  getItemColor (curVal, max, min) {
    if (this.data.length === 1) {
      if (min > 0) {
        min = 0;
      } else {
        max = 0;
      }
    }
    let colorList = this.config.colorList;
    let tempColorList = colorSet.numeric;
    if (colorList && colorList.length > 0) {
      tempColorList = colorList.map((i) => i.color || i);
    }
    // eslint-disable-next-line no-undef
    let startColor = d3.rgb(tempColorList[0]);
    // eslint-disable-next-line no-undef
    let endColor = d3.rgb(tempColorList[1]);
    // eslint-disable-next-line no-undef
    let compute = d3.interpolate(startColor, endColor);
    if (curVal - min < 0) {
      return compute(0);
    }
    if (curVal - min > max - min) {
      return compute(1);
    }
    return compute((curVal - min) / (max - min));
  }

  // 处理颜色
  getColorList () {
    let dataList = this.geometry.dataArray || [];
    let labelOrdinal = this.config.labelFeature.filter(item => item.type === 'ordinal');
    if (notEmpty(this.config.colorFeature) && this.config.colorFeature.type === 'ordinal' && notEmpty(labelOrdinal)) {
      let colorFeaArr = [];
      let newData = [];
      for (let i = 0; i < dataList.length; i++) {
        let pieData = dataList[i][0]._origin[this.config.colorFeature.feature];
        let shuIndex = pieData.indexOf('shulifang');
        let colorFea = pieData.slice(0, shuIndex);
        let colorFeaIndex = colorFeaArr.indexOf(colorFea);
        if (colorFeaIndex < 0) {
          let arrLength = colorFeaArr.length;
          newData[arrLength] = [];
          newData[arrLength].push(dataList[i][0]);
          colorFeaArr.push(colorFea);
        } else {
          newData[colorFeaIndex].push(dataList[i][0]);
        }
      }
      dataList = newData;
    }
    let colorFeature = this.config.colorFeature.feature;
    let colorList = [];
    if (dataList.length > 0 && colorFeature) {
      let obj = {};
      obj.key = colorFeature;
      obj.opacity = this.config.colorOpacity;
      obj.list = [];
      obj.name = colorFeature;
      obj.colored_type = this.config.colorFeature.type;
      obj.dataRange = [];
      dataList.map((d) => {
        let colorDetail = {};
        let color = d[0].color;
        // 转成十六进制
        if (color) {
          colorDetail.color = color;
          // if (color.indexOf('#') > -1) {
          //   colorDetail.color = color;
          // } else {
          //   let { hex, opacity } = rgbToHex(color);
          //   colorDetail.color = hex;
          //   colorDetail.opacity = opacity * 100;
          // }
        }
        colorDetail.originalVal = d[0]._origin[colorFeature];
        if (this.config.colorFeature.type === 'ordinal' && notEmpty(labelOrdinal)) {
          let shuIndex = originalVal.indexOf('shulifang');
          originalVal = originalVal.slice(0, shuIndex);
          let curDot = d[0]._origin.dotArr || [];
          if (curDot.length > 0) {
            originalVal = originalVal.split('');
            for (let i = 0; i < curDot.length; i++) {
              originalVal[curDot[i]] = '.';
            }
            originalVal = originalVal.join('');
          }
        }
        // colorDetail.originalVal = d[0]._origin[colorFeature];
        colorDetail.originalVal = originalVal;
        if (this.config.colorFeature.type === 'linear') {
          colorDetail.rangeType = 'min';
          colorDetail.val = toScientificNotation(colorDetail.originalVal);
        } else {
          colorDetail.val = colorDetail.originalVal;
        }
        obj.list.push(colorDetail);
      });
      if (obj.colored_type === 'linear') {
        let match = this.config.labelsList.find((i) => i.type === 'ordinal');
        if (match) {
          let orderList = obj.list.sort(
            (a, b) => a.originalVal - b.originalVal
          );
          let min = orderList[0];
          min.rangeType = 'min';
          obj.dataRange[0] = orderList[0].originalVal;
          if (notEmpty(this.config.colorList) && this.config.colorList[0].originalVal && this.config.colorList[0].check) {
            min.originalVal = this.config.colorList[0].originalVal;
            min.check = this.config.colorList[0].check;
            min.val = toScientificNotation(min.originalVal);
          }
          let max = orderList[orderList.length - 1];
          max.rangeType = 'max';
          obj.dataRange[1] = orderList[orderList.length - 1].originalVal;
          if (notEmpty(this.config.colorList) && this.config.colorList[1].originalVal && this.config.colorList[1].check) {
            max.originalVal = this.config.colorList[1].originalVal;
            max.check = this.config.colorList[1].check;
            max.val = toScientificNotation(max.originalVal);
          }
          obj.list = [min, max];
        } else {
          let temObj = JSON.parse(JSON.stringify(obj.list[0]));
          temObj.rangeType = 'max';
          obj.list.push(temObj);
        }
      }
      colorList.push(obj);
    }
    return colorList;
  }
}

export default Pie;
