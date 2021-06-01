const path = require('path');

module.exports = {
  publicPath: './',
  outputDir: 'dist-biwap',
  css:{
    loaderOptions:{
      sass:{
        additionalData:'@import "@/style/variable.scss";'
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@':path.resolve(__dirname,'src'),
        'view': path.resolve(__dirname, 'src/views'),
        'component': path.resolve(__dirname, 'src/components'),
      },
      extensions: ['.js', '.vue'],
      modules: [path.resolve(__dirname, 'node_modules')],
    },
  },
  chainWebpack: (config) => {
    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
          name: 'commons',
          priority:1,
        },
        vueBase: {
          chunks:'initial',
          test: (module) => {
            return /vue|vuex|vue-router/.test(module.context);
          },
          name: 'vueBase',
          priority:10
        },
      },
    });
  },
  devServer: {
    host: '0.0.0.0',
    proxy: {
      '/dccp': {
        target: 'http://192.168.1.222', // 'https://cloud.datacube.hk/',
        ws: true,
        changeOrigin: true,
        pathWrite: {},
      },
      '/bi': {
        target: 'http://192.168.1.222', // 'https://cloud.datacube.hk/',
        ws: true,
        changeOrigin: true,
        pathWrite: {},
      },
    },
  },
};
