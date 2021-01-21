/*
 * @Author: your name
 * @Date: 2020-12-29 11:19:23
 * @LastEditTime: 2021-01-12 16:11:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \docs\frontend\Engineering\sidebar.js
 */
module.exports = [
  {
    title: '前端工程化',
    collapsable: true,
    path: '/frontend/Engineering/',
    children: [
      '/frontend/Engineering/notes/base',
      '/frontend/Engineering/notes/mock',
      '/frontend/Engineering/notes/efficiency',
      '/frontend/Engineering/notes/LowCodeDev',
      '/frontend/Engineering/notes/compileSpeedUp',
      '/frontend/Engineering/notes/buildSpeedUp',
      '/frontend/Engineering/notes/Cache',
      '/frontend/Engineering/notes/IncrementalBuild',
      '/frontend/Engineering/notes/noBundle',
    ]
  }
]