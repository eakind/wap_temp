const filterFeaList = (list, name) => {
  if (!name || !list) {
    return list;
  }
  let arr = [];
  for (let i = 0; i < list.length; i++) {
    if (!list[i]) {
      continue;
    }
    if (list[i].left || list[i].right) {
      let left = list[i].left;
      let right = list[i].right;
      let obj = {
        left: [],
        right: []
      };
      for (let j = 0; j < left.length; j++) {
        if (left[j] && left[j].name !== name) {
          obj.left.push(left[j]);
        }
      }
      for (let j = 0; j < right.length; j++) {
        if (right[j] && right[j].name !== name) {
          obj.right.push(right[j]);
        }
      }
      if (!obj.left.length || !obj.right.length) {
        arr.push(...obj.left, ...obj.right);
      } else {
        arr.push(obj);
      }
    } else {
      if (list[i].name !== name) {
        arr.push(list[i]);
      }
    }
  }
  return arr;
};

const mergeLeftRight = (left, right) => {
  let list = [];
  if (left.length >= right.length) list = left;
  else list = right;
  let arr = [];
  for (let i = 0, len = list.length; i < len; i++) {
    for (let j = 0, childLen = list[i].length; j < childLen; j++) {
      let obj = {};
      obj = Object.assign(obj, list[i][j], right[i] ? right[i][j] : {});
      arr.push(obj);
    }
  }
  return arr;
};

const setFeatureData = (list) => {
  let arr = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i].feature) {
      arr.push(...list[i].feature);
    } else if (list[i].left || list[i].right) {
      arr.push(...mergeLeftRight(list[i].left, list[i].right));
    }
  }
  return [arr];
};

const setYStyle = (yAxis, newYaxis) => {
  for (let i = 0; i < yAxis.length; i++) {
    for (let j = 0; j < yAxis[i].length; j++) {
      let keyId = JSON.stringify(newYaxis.keyId);
      let yKeyId = JSON.stringify(yAxis[i][j].keyId);
      if (keyId === yKeyId) {
        let { line, title, grid, label } = newYaxis;
        yAxis[i][j].line = line;
        yAxis[i][j].title = title;
        yAxis[i][j].grid = grid;
        yAxis[i][j].label = label;
      }
    }
  }
};

const setYAxisStyle = (newYAxis, yAxis) => {
  for (let i = 0; i < newYAxis.length; i++) {
    setYStyle(yAxis, newYAxis[i]);
  }
};

const setPartStyle = (config) => {
  let { xAxisPart, yAxisPart, yAxis } = config;
  if (yAxis) {
    setYAxisGrid(yAxis, yAxis[0][0].grid.line);
  }
  if (xAxisPart) {
    setXPartLine(xAxisPart, yAxis[0][0].line);
  }
  if (yAxisPart) {
    setPartLine(yAxisPart, yAxis[0][0].grid.line);
  }
};

const setXPartLine = (list, line) => {
  for (let i = 0; i < list.length; i++) {
    list[i].line.style = line.style;
    list[i].grid.line.style = line.style;
  }
};

const setYAxisGrid = (list, line) => {
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list[i].length; j++) {
      list[i][j].grid.line = line;
    }
  }
};

const setPartLine = (list, line) => {
  for (let i = 0; i < list.length; i++) {
    list[i].grid.line.style = line.style;
  }
};

const setXAxisStyle = (xAxisTemp, config) => {
  let { xAxis, xAxisPart } = config;
  for (let i = 0; i < xAxisTemp.length; i++) {
    for (let j = 0; j < xAxis.length; j++) {
      if (xAxisTemp[i].key === xAxis[j].key && xAxisTemp[i].keyId === xAxis[j].keyId) {
        xAxis[j] = JSON.parse(JSON.stringify(xAxisTemp[i]));
      }
    }
    if (!xAxisPart) return;
    for (let j = 0; j < xAxisPart.length; j++) {
      if (xAxisTemp[i].key === xAxisPart[j].key && xAxisTemp[i].keyId === xAxisPart[j].keyId) {
        xAxisPart[j] = JSON.parse(JSON.stringify(xAxisTemp[i]));
      }
    }
  }
};

export {
  filterFeaList,
  setFeatureData,
  setYAxisStyle,
  setPartStyle,
  setXAxisStyle
};
