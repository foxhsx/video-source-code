/*
 * @Author: your name
 * @Date: 2020-12-28 13:46:45
 * @LastEditTime: 2021-01-13 18:32:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \note\docs\.vuepress\nav.js
 */
module.exports = [
  { text: '前端',
    items: [
      { text: 'HTML', link: '/frontend/html/' },
      { text: 'CSS', link: '/frontend/css/' },
      { text: 'JavaScript', link: '/frontend/javascript/' },
      { text: 'Vue', link: '/frontend/vue/' },
      { text: 'React', link: '/frontend/react/' },
      { text: 'Webpack', link: '/frontend/webpack/' },
      { text: 'Engineering', link: '/frontend/Engineering/' },
      // { text: 'node', link: '/baodian/zero/' }
      { text: 'Dried', link: '/summary/' }
    ]
  },
  {
    text: '面试宝典',
    items: [
      { text: '基础面试', link: '/baodian/zero/' },
      { text: '进阶面试', link: '/baodian/high/' },
    ]
  },
  {
    text: '题库',
    items: [
      { text: 'CSS',
        link: '/questionBank/css/'
      },
      { text: 'HTML', 
        link: '/questionBank/html/'
      },
      { text: 'JavaScript', 
        link: '/questionBank/javascript/'
      },
    ]
  },
  {
    text: '其他',
    items: [
      {
        text: '随笔',
        link: '/other/'
      },
      {
        text: '学习',
        link: '/study/'
      },
      {
        text: '读书',
        link: '/books/'
      },
    ]
  },
  { text: 'TimeLine', link: '/timeline/', icon: 'reco-date' }
]