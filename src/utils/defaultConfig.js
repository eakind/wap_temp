const axisConfig = (bgCss) => {
  bgCss = bgCss || {};
  return {
    position: 'bottom',
    key: '',
    type: ['bar'],
    line: {
      show: true,
      style: {
        lineWidth: 1,
        fontColor: '#c2c9d1',
        opacity: 1,
        lineDash: [0, 0]
      }
    },
    label: {
      style: {
        fontColor: bgCss.color || '#6B6B6B',
        fontSize: 12,
        fontWeight: 'normal',
        opacity: 1,
        rotate: 0
      },
    },
    title: {
      value: '',
      show: true,
      style: {
        fontColor: bgCss.color || '#6B6B6B',
        fontSize: 12,
        fontStyle: 'normal'
      }
    },
    grid: {
      line: {
        show: false,
        style: {
          fontColor: '#c2c9d1',
          opacity: 0,
          lineDash: [0, 0], // [3,3]
          lineWidth: 1
        }
      }
    }
  };
};

const labelsConfig = (type, bgCss) => {
  bgCss = bgCss || {};
  let format = {
    check: false,
    decimal: 2,
    isPercent: false,
    negative: '-1234',
    prefix: '',
    selectFormat: -1,
    setFlag: true,
    suffix: '',
    unit: '',
    useThousandMark: true,
    zone: '¥ 人民币'
  };
  let text = {
    textAlign: 'left',
    display: 'auto',
    check: false,
    decoration: '',
    fontColor: bgCss.color || '#6B6B6B',
    fontSize: 12,
    fontStyle: 'normal',
    letterSpacing: '0',
    lineHeight: '24',
    setFlag: true
  };
  return {
    type: type === 'AGGR' ? 'linear' : 'ordinal',
    key: '',
    title: '',
    display: 'auto',
    format: type === 'AGGR' ? format : {},
    text: text
  };
};

const tooltipConfig = (type) => {
  let format = {
    check: false,
    decimal: 2,
    isPercent: false,
    negative: '-1234',
    prefix: '',
    selectFormat: -1,
    setFlag: true,
    suffix: '',
    unit: '',
    useThousandMark: true,
    zone: '¥ 人民币'
  };
  let text = {
    textAlign: 'left',
    display: 'auto',
    check: false,
    decoration: '',
    fontColor: '#6B6B6B',
    fontSize: 12,
    fontStyle: 'normal',
    letterSpacing: '0',
    lineHeight: '24',
    setFlag: true
  };
  return {
    type: type === 'AGGR' ? 'linear' : 'ordinal',
    key: '',
    title: '',
    display: 'auto',
    format: type === 'AGGR' ? format : {},
    text: text
  };
};

export {
  axisConfig,
  labelsConfig,
  tooltipConfig
};
