import pie from './chart/pie.js';
import bubble from './chart/bubble.js';
import scatter from './chart/scatter.js';
import map from './chart/map.js';
import table from './chart/table.js';
import bar from './chart/bar.js';
import line from './chart/line.js';
import barLine from './chart/barLine.js';
import barRotated from './chart/barRotated.js';
let drawClasses = {};
drawClasses.pie = pie;
drawClasses.bubble = bubble;
drawClasses.scatter = scatter;
drawClasses.map = map;
drawClasses.table = table;
drawClasses.bar = bar;
drawClasses.line = line;
drawClasses.barLine = barLine;
drawClasses.barRotated = barRotated;

function GeometryDrawingProcess (chartType, data, config, ...arg) {
  if (!drawClasses[chartType]){
    return null;
  }
  let instance = new drawClasses[chartType](data, config);
  return {
    draw: () => {
      instance.draw();
    },
    chartUpdate: (type, newData) => {
      instance.chartUpdate(type, newData);
    },
    getColorList: () => {
      return instance.getColorList();
    },
    getDomain () {
      return instance.getDomain();
    }
  };
}

export default GeometryDrawingProcess;
