# simple-react-ui

重复造轮子之用React.js实现简单的UI组件。

1. 自己的狗粮自己吃。
2. 轻量，可配合 Bootstrap.min.css 使用。不追求大而全。

只是JavaScript轮子，暂时不想考虑各浏览器的CSS兼容情况，所以`Pagination`组件的CSS样式就偷懒复用了 Bootstrap 。
换言之，在页面引入 Bootstrap的css 和这里相应的轮子，即可展示出同样的效果，不再需要 bootstrap.min.js 或者 jquery.min.js。

## 安装

```
npm install simple-react-ui --save
```

## 使用

可以一次性全部导入所有SimpleUI组件

```JavaScript
import SimpleUI from 'simple-react-ui';
```

大多时候可以按需导入：


```JavaScript

// 只导入 Pagination
import Pagination from 'simple-react-ui/dist/pagination';

// 只导入 BaiduMap
import BaiduMap from 'simple-react-ui/dist/baidumap';

// 其他...
```


### 分页

示例：

```JavaScript
import React from 'react';
import Pagination from 'simple-react-ui/dist/pagination';

const Posts=React.createClass({
    getInitialState(){
        return {
            page:1,
            rows:[
                {/**/},
            ],
            current:1,
            size:5,
            count:10,
            semiBandWidth:5,
        };
    },

    fetchData(){ /*fetData  and set state*/ },

    componentDidMount(){
        this.fetchData(this.state.page,this.state.size);
    },

    render:function(){
        return (
            <div>
                <div>
                    /* list posts here according to {this.state.rows} */
                </div>

                <Pagination 
                    total={this.state.count} size={this.state.size} 
                    current={this.state.current} 
                    semiBandWidth={this.state.semiBandWidth} 
                    onChange={(page)=>{ 
                        this.setState(
                            { page:page , current:page, } ,
                            ()=>{ this.fetchData(page,this.state.size) }
                        );
                    }}
                />                
            </div>
        );
    }
});
```


### UEditor 

提供两种模式， *受控模式* 和 *非受控模式* ，请参见文档。

在受控模式下，用户可以通过
* `value`属性：父组件可以通过`value`属性来动态设置编辑器的内容
* `onChange(content)` 事件处理函数，当编辑器的内容发生变化以`onChange(content)`的方式通知父组件

在非受控模式下，用户主要通过
* `initialContent` 属性来提供初始值
* `afterInit(ue)` 回调函数来与 `UEditor` 互动，其中`ue`参数是`UE.getEditor('id')`返回的编辑器实例。

`afterInit(ue)`在某种程度上类似于原生`React`组件的`ref`回调，我们可以把`ue`传递给父组件，从而可以在父组件中来做任何`UEditor`可以做的事儿。

更多请参见 [文档](https://github.com/newbienewbie/simple-react-ui/blob/master/docs/ueditor.md)

## 开发

### 构建

```
> # 克隆仓库
> git clone https://github.com/newbienewbie/simple-react-ui

> # 安装
> npm install 

> # 构建
> npm run build

> # 测试
> npm run test
```

### 文件夹结构

```
simple-react-ui/
    index.js    # 入口文件，作用是引入经过 babel 转换的ES5文件
    lib/        # 源代码，采用TypeScript编写
        pagination/  # 分页组件的源代码
        ...          # 其他组件的源代码
    __test__/       # 测试 
    dist/       # 编译后的文件夹
    doc/        # 文档
```

### 模块的暴露方式

源码本身使用 `typescript` 开发 ，转码后置入 `/dist`，并交由`index.js`暴露给用户。

## 目前已经实现的组件

- [X] Pagination : 分页组件
- [X] Carousel
- [X] UEditor : 百度`UEditor`的`React`封装
- [X] BaiduMap: 百度地图的`React`封装
- [X] Tree: 树形菜单
- [X] Icon:图标