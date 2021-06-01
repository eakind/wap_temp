class Scatter {
  constructor (data, config) {
    this.config = config;
    this.data = data;
    this.drawInstance = null;
  }

  draw () {
    // eslint-disable-next-line no-undef
    this.drawInstance = chart.GeometryDrawingProcess({
      data: this.data,
      config: this.config,
      chartType: 'scatter',
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

export default Scatter;
