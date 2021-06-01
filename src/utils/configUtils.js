import { notEmpty } from '@/utils/check.js';
const setCatName = (feature) => {
  let name = feature.name;
  if (feature.split) {
    if (feature.split instanceof Array) {
      let arr = [];
      let list = feature.split;
      for (let i = 0; i < list.length; i++) {
        arr.push(
            `${name}${' '}${list[i]
              .split(',')
              .join('-')
              .toLocaleLowerCase()}`
        );
      }
      return arr;
    } else {
      name = `${name}${' '}${feature.split
        .split(',')
        .join('-')
        .toLocaleLowerCase()}`;
    }
  }
  return name;
};

const setAggrName = (feature) => {
  if (feature.legend && feature.formulaType !== 'AGGR') {
    let name = `${feature.legend.toLocaleLowerCase()}(${feature.name})`;
    if (feature.legend === 'PERCENTILE') {
      name = `${feature.legend.toLocaleLowerCase()}${feature.probability}(${feature.name})`;
    }
    return aggrName(feature.rate, name);
  } else {
    return aggrName(feature.rate, feature.name);
  }
};

function aggrName (rate, newName) {
  if (notEmpty(rate)) {
    let { type, growth } = rate;
    if (growth) {
      newName = `${
          type === 'RING' ? 'Last Period' : 'Same Period'
        } Growth ${newName}`;
    } else {
      newName = `${type === 'RING' ? 'Last Period' : 'Same Period'} ${newName}`;
    }
  }
  return newName;
}

export {
  setCatName,
  setAggrName
  // isAxisXCatName
};
