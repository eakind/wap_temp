class Map {
  constructor (data, config) {
    this.data = data;
    this.config = config;
    this.drawInstance = null;
  }

  draw () {
    // eslint-disable-next-line no-undef
    this.drawInstance = chart.GeometryDrawingProcess({
      data: this.data,
      config: this.config,
      chartType: 'map',
    });
    this.drawInstance.draw();
  }

  chartUpdate (type, data) {
    this.config[type] = data;
    this.drawInstance.update(type, data);
  }

  getColorList () {
    return this.drawInstance.getColorList();
  }
}

export default Map;
