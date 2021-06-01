let getComponents = function() {};

let dataProcess = function(val, format) {
  if (!val) {
    return val;
  }
  if (typeof format.selectFormat === 'undefined') {
    return val;
  }
  if (!Number(val)) {
    return val;
  }
  let ret = val;

  let negative = -1;
  if (ret < 0) {
    if (format.negative === '(1234)') {
      negative = 0;
    } else if (format.negative === '1234-') {
      negative = 1;
    } else {
      negative = 2;
    }
  }

  ret = unitProcess(ret, format.unit, format.useThousandMark, format);

  ret = displayFormatProcess(ret, format.selectFormat, format.zone, negative);
  ret = prefSuffixProcess(ret, format.prefix, format.suffix, format.isPercent);
  return ret;
};

let unitProcess = function(val, unit, micrometerFlag, format) {
  let unitPare = {
    'K 千': 1000,
    'M 百万': 1000000,
    'G 十亿': 1000000000,
    'T 千亿': 100000000000,
  };
  let ret = val;
  if (unit) {
    ret = val / unitPare[unit];
  }
  if (format.decimal || format.decimal === 0) {
    if (format.isPercent || format.selectFormat === 'percent') {
      ret = ret * 100;
    }
    ret = ret.toFixed(format.decimal);
    if (format.isPercent) {
      ret = ret + '%';
    }
  }

  // let ret = val / unitPare[unit];
  let curRes = micrometerProcess(ret, micrometerFlag);
  return unit ? curRes + unit : curRes;
};

let displayFormatProcess = function(val, format, zone, negative) {
  // if (!format) {
  //   return val;
  // }
  if (negative === 0) {
    val = '(' + val.substring(1) + ')';
  } else if (negative === 1) {
    val = val.substring(1) + '-';
  }
  if (format === 'percent' || format === -1) {
    return val;
  }
  let formatPare = {
    CN: '￥',
    JP: '¥',
    HK: 'HK$',
    US: '＄',
    EUR: '€',
    GBP: '£',
  };
  if (negative === -1) {
    return formatPare[zone] ? formatPare[zone] + val : val;
  }

  return formatPare[zone] ? formatPare[zone] + val : val;
};

let prefSuffixProcess = function(val, prefix, suffix, isPercent) {
  if (prefix) {
    val = prefix + val;
  }
  if (suffix && !isPercent) {
    val = val + suffix;
  } else if (isPercent) {
    if (suffix && suffix.indexOf('%') === 0) {
      val = val + suffix.substr(1);
    }
  }
  return val;
};

let micrometerProcess = function(val, flag) {
  if (!flag || val < 1000) {
    return val;
  }
  let ret = '';
  let list = [];
  let curStr = val.toString().split('.');
  for (let i = curStr[0].length - 1; i >= 0; i--) {
    list.push(curStr[0][i]);
    if ((curStr[0].length - 1 - i) % 3 === 2) {
      ret = ',' + list.reverse().join('') + ret;
      list = [];
    }
  }
  if (ret) {
    ret = list.length === 0 ? ret.substr(1) : ret;
  }
  ret = list.reverse().join('') + ret;
  return curStr.length > 1 ? ret + '.' + curStr[1] : ret;
};

let styleProcess = function(styleObj) {
  return ` text-align: ${styleObj.align || styleObj.textAlign};
  color:  ${styleObj.fontColor};
  font-size:  ${styleObj.fontSize + 'px'};
  font-style:  ${styleObj.fontStyle};
  line-height:  ${styleObj.lineHeight + 'px'};
  letter-spacing:  ${styleObj.letterSpacing + 'px'}`;
};

let toScientificNotation = function(val) {
  if (!val) {
    return;
  }
  let ret = val.toString();
  if (ret.length <= 4) {
    return ret;
  } else if (ret.length <= 6) {
    return (ret / 1000).toFixed(2) + 'K';
  } else if (ret.length <= 9) {
    return (ret / 1000000).toFixed(2) + 'M';
  } else {
    return (ret / 1000000000).toFixed(2) + 'G';
  }
};

export { getComponents, dataProcess, styleProcess, toScientificNotation };
