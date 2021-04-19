const jsSideBar = require('./js.sidebar');
const vueSideBar = require('./vue.sidebar');
const webpackSideBar = require('./webpack.sidebar');
const cssSideBar = require('./css.sidebar');

module.exports = [
  ...cssSideBar,
  ...jsSideBar,
  ...vueSideBar,
  ...webpackSideBar,
]