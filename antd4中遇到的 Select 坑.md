# antd4中遇到的 Select 坑

要动态渲染 `Options` 以外，还要设置这个属性：

```javascript
filterOption={false}
```

也就是：

```javascript
import React, { PureComponent, Fragment } from 'react'
import { Select } from 'antd'
import axios from 'axios'
const Option = Select.Option;

export default class AntSelect extends PureComponent{
    ...
    
    handleSearch = (keywords) => {
        //请求后端搜索接口
        axios('http://xxx.com/xxx', {
            keywords,
        }).then(data){
            this.setState({
                list: data
            })
        }
    }
    
    render(){
        const { list } = this.state;
        return(
            <Select
                mode="multiple"         //多选模式
                placeholder="请选择"
                filterOption={false}    //关闭自动筛选
                onSearch={this.handleSearch}
            >
                {
                    list.map((item, index) => (
                        <Option key={index} value={item}>{item}</Option>
                    ))
                }
            </Select>
        )
    }
    ...
}
```

如果不设置会导致即使拿到了最新的数据还是依旧显示无匹配结果

![alt 属性文本](https://img2018.cnblogs.com/blog/1414709/201811/1414709-20181119172211518-1564322203.png)

因为`filterOption`默认为true, 当你输入内容时候,会先在已有选项里面寻找符合项, 无论是否找到，都会重新渲染`Options`,这样你接口请求的数据的渲染被覆盖了, 自然看不到结果了。所以需要把它关掉！