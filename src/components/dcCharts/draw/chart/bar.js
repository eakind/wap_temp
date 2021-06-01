class Bar {
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
      chartType: 'bar',
    });
    this.drawInstance.draw();
  }

  getColorList () {
    return this.drawInstance.getColorList();
  }

  getDomain () {
    return this.drawInstance.getDomain();
  }

  //   chartUpdate (type, data) {
  //     this.config[type] = data;
  //     this.drawInstance.update(type, data);
  //   }

//   getColorList () {
//     return this.drawInstance.getColorList();
//   }
}

export default Bar;
