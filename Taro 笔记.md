# Taro 笔记

### 分包

分包和微信小程序分包一样，需要在`app.jsx`中去配置`subpackages`选项

```javascript
subpackages: [
    root: 'pages/distributionOrder/',
    name: 'distributionOrder',
    pages: [
    	'index',
         'add/addOrderInfo',
	]
]
```

| 字段        | 类型        | 说明                           |
| ----------- | ----------- | ------------------------------ |
| root        | String      | 分包根目录（src里的）          |
| name        | String      | 分包别名，分包预下载时可以使用 |
| pages       | StringArray | 分包页面路径，相对与分包根目录 |
| independent | Boolean     | 分包是否是独立分包             |

**打包原则**

- 声明`subpackages`后，将按`subpackages`配置路径进行打包，`subpackages`配置路径外的目录将被打包到app（主包）中去
- app（主包）也可以有自己的 pages （即最外层的 pages 字段）
- `subpackage`的根目录不能是另外一个`subpackage`内的子目录
- `tarBar`页面必须在 app（主包）内

**个人理解**

```
不加 subpackage 的时候，项目打包会把 pages 里的文件都打包到app主包里去，加上 subpackage 以后，这里面的分包就相当于是每个小模块（项目），里面的 pages 就对应这个小模块的路由，每个分包都相较于其他的分包都是独立的。你不能在主包里设置了路由`A`，然后又在子分包里设置了一模一样的`A`。
```

### 扫码

调用 `Taro.scanCode`

在官网的API中我们可以看到扫码在设备分类里。用法和小程序里的是一样的。支持`Promise`。

```javascript
import Taro from '@tarojs/taro'

Taro.scanCode(params).then(...)
```

**参数**

| 属性           | 类型           | 默认值               | 必填 | 说明                                     | 最低版本 |
| -------------- | -------------- | -------------------- | ---- | ---------------------------------------- | -------- |
| onlyFromCamera | boolean        | false                | 否   | 是否只能从相机扫码，不允许从相册选择图片 | 1.2.0    |
| scanType       | Array.<string> | ['barCode','qrCode'] | 否   | 扫码类型                                 | 1.7.0    |
| success        | function       |                      | 否   | 接口调用成功的回调函数                   |          |
| fail           | function       |                      | 否   | 接口调用失败的回调                       |          |
| complete       | function       |                      | 否   | 接口调动结束的回调                       |          |

**object.scanType 的合法值**

| 值         | 说明          | 最低版本 |
| ---------- | ------------- | -------- |
| barCode    | 一维码        |          |
| qrCode     | 二维码        |          |
| datamatrix | Data Matrix码 |          |
| pdf417     | PDF417条码    |          |

#### object.success 回调函数

| 属性     | 类型   | 说明                                                         |
| -------- | ------ | ------------------------------------------------------------ |
| result   | string | 扫码内容                                                     |
| scanType | string | 扫码类型                                                     |
| charSet  | string | 扫码的字符集                                                 |
| path     | string | 当所扫的码为当前小程序二维码时，会返回此字段，内容为二维码携带的 path |
| rawData  | string | 原始数据，base64编码                                         |

### 写法

写法上最好统一是箭头函数，在赋值时统一使用解构赋值的写法来进行赋值。目录中统一是文件名下包含`index.jsx`和`index.scss`。只要区别开文件名即可。

```javascript
class Index extends Components {
    state = {
        value: 0
    }

	handleClick = e => {}
    
    render () {
        const { value } = this.state
        return (
        	<div onClick={this.handleCick}>{value}</div>
        )
    }
}
```



### 编译小程序后有子页面叠加限制

官网说不能嵌套10层，但实际上我只写了5层后，就不能再跳转了，这里我在最后一个跳转的页面没有使用 `navigateTo`，而是使用`reLaunch`

```javascript
Taro.reLaunch(params).then(...)
```

### 定位

使用 `Taro` 提供的API

```javascript
// 提前将微信小程序的JSSDK准备好放到项目中
import AAMapWX from '../../../plugins/wxmap/qqmap-wx-jssdk'

Taro.getLocation({
    type: 'wgs84',
    success: function (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        // 获取到经纬度以后调用微信小程序的SDK
        // 实例化API核心类
        var qqmapsdk = new QQMapWX({
            key: '自己申请的腾讯地图key'
        })
        
        // 使用小程序API直接解析获取当前位置
        qqmapsdk.reverseGeocoder({
            location: {
                latitude,
                longitude
            },
            success: function (res) {
                let location = res.result.address
                console.log(loaction)
            }
        })
    }
})
```

### 关于真机调试

在使用微信开发者工具进行真机调试时，首先要配置好自己的appID，然后才可以使用真机调试。

### 下拉上拉加载

Taro 有提供这两种的API，但是兼容性不是很好，有的只支持微信小程序的，不兼容H5的，所以我只找了两个都兼容的。

```javascript
// onScrollToLower 方法在组件 <ScrollView> 上调用，然后可以自定义方法，也可以调用下拉刷新的API

onScrollToLower = (e) => {
    // 计算当前有多少页数
    let pageTotal = Math.ceil(this.state.total / 10);

    // newPageNum 需要传递给后端的 pageNum
    let newPageNum = this.state.pageNum + 1
    // 如果 newPageNum 大于了当前的总页数，说明数据加载完毕
    if (newPageNum > pageTotal) {
        Taro.showToast({
            title: '无更多数据'
        })
    } else {
        distributionList({
            pageNum: newPageNum,
            pageSize: 10
        }).then(res => {
            let rows = res.rows
            Taro.showLoading({title: '加载中'})
            this.setState((prevState) => {
                // 将 tabList[0].orderList 和 请求过来的返回值拼接
                prevState.tabList[0].orderList = prevState.tabList[0].orderList.concat(rows)
                // 重置 pageNum
                prevState.pageNum = newPageNum

                rows.map((item, index) => {
                    if (item.permissionStatus === 1) {  // 无需审批
                        item.url = `pass/arrivalPass`
                        prevState.tabList[2].orderList.push(item)
                    }
                    else if (item.permissionStatus === 2) {  // 待审批
                        item.url = 'detail/orderDetail'
                        prevState.tabList[1].orderList.push(item)
                    }
                    else if (item.permissionStatus === 3) { // 已审批
                        item.url = `pass/arrivalPass`
                        prevState.tabList[2].orderList.push(item)
                    }
                    else {   // 已驳回
                        item.url = 'detail/orderDetail'
                        prevState.tabList[3].orderList.push(item)
                    }
                })

                // 关闭加载动画
                Taro.hideLoading()
            })
        })
    }
}

// 使用框架提供的API
Taro.startPullDownRefresh()
```

#### 在 JSX 中使用条件渲染

```javascript
render () {
    let status = true
    return (
    	{
            status
            ? <div>222</div>
            : <div>333</div>
        }
    )
}
```

#### 动态设置页面标题

```javascript
Taro.setNavigationBarTitle({
    title: 动态变量
})
```

  #### taro 配置

在`config`目录下的`index.js`中去更改相关配置。

### 授权登录

首先小程序在获取用户信息前应先检查微信是否授权登录，这里需要先获取用户的当前设置——`Taro.getSetting`

```javascript
// 使用方法一
import Taro from '@tarojs/taro'

Taro.getSetting({
    success (res) {}
})

// 或者
Taro.getSetting().then(res => {})

// 使用方法二
import Taro, { getSetting } from '@tarojs/taro'
// 同上，去掉前面的Taro
```

调用此方法后判断用户是否授权：

```javascript
import { hideTabBar } from '@tarojs/taro'
getSetting().then(res => {
    let authSetting = res.authSetting
    // 如果没有授权则跳转至授权页面或者唤起授权弹框
    if (!authSetting['scope.userInfo']) {
      // 这里要唤起自定义的授权弹框，因为现在微信上只能通过按钮来触发授权，如果是在 tabBar 的页面，需要先隐藏掉 tabBar
        hideTabBar()
        // 然后唤起弹框
        this.setState({
            authShow: true
        })
    }
})
```

那我们先自定义一个授权弹框在首页：

```javascript
getUserInfo = () => {
    // ...
}

<AtModal isOpened>
  <AtModalHeader>授权登录</AtModalHeader>
  <AtModalContent>
    您还尚未授权，请授权后登录
  </AtModalContent>
  <AtModalAction>
    <Button onClick={this.handleCancel}>取消</Button>
    <Button
	  open-type="getUserInfo"
	  onGetUserInfo={this.getUserInfo}
 	>确定</Button>
  </AtModalAction>
</AtModal>
```

然后如果没有授权就显示这个弹框，然后点击确定就可以授权了。授权后就可以进行下一步操作，比如用户账号绑定，手机号码绑定等等。



### 跨端环境判断

因为项目可能不止是小程序使用，也可能打包成 h5，所以这里我们还需要做环境判断，毕竟在 h5 环境下，有的东西是不兼容的，比如`Taro.login`和`Taro.getSetting()`都是调用不了的。所以这里就有：

```javascript
// 判断是否是小程序
if (process.env.TARO_ENV === 'weapp') {}
```

那么`Taro`在编译时提供了一些内置的环境变量来帮助用户做一些特殊处理。

**process.env.TATO_ENV**

用于判断当前编译类型，目前有`weapp` / `swan` / `alipay` / `h5` / `rn` / `tt` / `qq` / `quickapp` 八个取值，可以通过这个变量来书写对应一些不同环境下的代码，在编译时会将不属于当前编译类型的代码去掉，只保留当前编译类型下的代码。例如小程序和h5：

```javascript
if (process.env.TARO_ENV === 'weapp') {
  require('path/to/weapp/name')
} else if (process.env.TARO_ENV === 'h5') {
  require('path/to/h5/name')
}
```



### 报错 

1. `Some selectors are not allowed in component wxss, including tag name selectors, ID selectors, and attribute selectors.`

为什么会出现这个报错？根据报错意思我们可以知道，在`wxss`中，有的`selectors`是不能使用其设置样式的，通俗一点就是不能直接用标签去设置样式，这样会报错，那清楚这个之后，我们只要给这些标签加`class`和`id`来设置样式即可。

2. taro-ui 的样式在打包成 h5 之后没有转换成 rem

这是因为没有将 `taro-ui`的样式在`app.scss`里引入，导致在编译时无法进入单位之间的转换，只要在`app.scss`里引入即可。

2. 

### 小程序推送消息路径配置

在推送小程序订阅消息时，后端应该配置小程序的路径，而此路径是相对应的页面路径，比如推送消息对应页面为首页，那么就是 `/pages/index/index`。

### 关于 `taro`样式加载问题

当一个文件目录里有多个文件，且这些文件都引用一个css时，打包小程序并发布以后，会有加载不上样式的问题，这个时候，我们需要把文件做模块化处理，每一个文件对应一个文件目录，并创建对应的css样式，不要几个文件都引用相同的css。一个功能模块对应一个文件夹，里面是对应的jsx文件和css文件。这样再次打包发布后，就好了。——如果都使用同一个文件，那么在打包以后，会在项目最外层生成一个common.wxss，这个时候那些文件都会引这个css文件，在开发环境下是OK的，但是发布到线上以后就有问题了。

自定义组件的样式，在被引用以后，父页面是修改不了的，除非在自定义组件里将组件构造器中的`options.addGlobalClass`字段设置为`true`。

```javascript
export default class CustomComp extends Component {
  static options = {
    addGlobalClass: true
  }

  render () {
    return <View className="red-text">这段文本的颜色由组件外的 class 决定</View>
  }
}
```

组件外的样式定义

```javascript
.red-text {
  color: red;
}
```

