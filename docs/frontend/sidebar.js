const htmlSideBar = require('./html/sidebar')
const jsSideBar = require('./javascript/sidebar')
const cssSideBar = require('./css/sidebar')
const webpackSideBar = require('./webpack/sidebar')
const EngineeringSideBar = require('./Engineering/sidebar')
const VueSideBar = require('./vue/sidebar')
const ReactSideBar = require('./react/sidebar')
module.exports = [
  ...htmlSideBar,
  ...cssSideBar,
  ...jsSideBar,
  ...webpackSideBar,
  ...EngineeringSideBar,
  ...VueSideBar,
  ...ReactSideBar,
]