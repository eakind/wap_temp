class Line {
  constructor (data, config) {
    this.data = data;
    this.config = config;
    this.drawInstance = null;
  }

  draw () {
    this.drawInstance = null;
    this.drawInstance = chart.GeometryDrawingProcess({
      data: this.data,
      config: this.config,
      chartType: 'line',
    });
    this.drawInstance.draw();
  }

  getColorList () {
    return this.drawInstance.getColorList();
  }

  getDomain () {
    return this.drawInstance.getDomain();
  }
}

export default Line;
