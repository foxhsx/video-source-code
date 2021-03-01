/*
 * @Author: your name
 * @Date: 2020-12-28 13:46:45
 * @LastEditTime: 2021-01-13 18:15:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \note\docs\.vuepress\config.js
 */
module.exports = {
  title: '小和尚的博客',
  description: '不积跬步无以至千里',
  dest: './dist',  // 默认在 vuepress 下
  base: '/hsxblog/', // 设置站点根路径
  port: '8888',
  head: [
    [ 'link', { rel: 'icon', href: '/yoyuxi.jpg' } ],
    [ 'link', { rel: 'stylesheet', href: '/css/style.css' } ],
    [ 'script', { href: '/js/main.js' } ],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
  ],
  markdown: {
    lineNumbers: true
  },
  theme: 'reco',
  themeConfig: {
    type: 'blog',
    nav: require('./nav.js'),
    sidebar: require('./sidebar.js'),
    sidebarDepth:2,
    lastUpdated: 'Last Updated',
    searchMaxSuggestions: 10,
    subSidebar: 'auto',
    serviceWorker: {
      updatePOPUP: {
        message: '有新的内容',
        buttonText: '更新'
      }
    },
    // 博客配置
    blogConfig: {
      category: {
        location: 2,     // 在导航栏菜单中所占的位置，默认2
        text: 'Category' // 默认文案 “分类”
      },
      tag: {
        location: 3,     // 在导航栏菜单中所占的位置，默认3
        text: 'Tag'      // 默认文案 “标签”
      }
    },
    // 评论设置
    valineConfig: {
      appId: 'xSKbsz5sQWvUn1Ouq8CQagx8-gzGzoHsz',// your appId
      appKey: '3Fg245ORUo8oJA9p92rbQyv3', // your appKey
    },
    editLinks: true,
    editLinkText: '在 Github 上编辑此页！',
    author: 'cecil_he',
    // 右侧信息头像
    authorAvatar: '/img/shehui.jpg',
    // 友链
    friendLink: [
      {
        title: 'vuepress-theme-reco',
        desc: 'A simple and beautiful vuepress Blog & Doc theme.',
        logo: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        link: 'https://vuepress-theme-reco.recoluan.com'
      },
      {
        title: '午后南杂',
        desc: 'Enjoy when you can, and endure when you must.',
        email: 'recoluan@qq.com',
        link: 'https://www.recoluan.com'
      },
      {
        title: '百变鹏仔',
        desc: '共享博客，专注前端行业精选',
        email: '',
        link: 'http://sharedblog.cn/'
      },
    ],
    plugins: ['mermaidjs'],
    activeHeaderLinks: false,
    displayAllHeaders: true
  }
}