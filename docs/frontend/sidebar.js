const htmlSideBar = require('./html/sidebar')
const jsSideBar = require('./javascript/sidebar')
const cssSideBar = require('./css/sidebar')
const webpackSideBar = require('./webpack/sidebar')
module.exports = [
  ...htmlSideBar,
  ...cssSideBar,
  ...jsSideBar,
  ...webpackSideBar
]