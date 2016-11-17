# simple-react-ui

重复造轮子之用React.js实现简单的UI组件。

1. 自己的狗粮自己一定要吃。
2. 轻量，可配合 Bootstrap.min.css 使用。
2. 适时测试:测试不可或缺，追求覆盖率过犹不及

只是JavaScript轮子，暂时不想考虑各浏览器的CSS兼容情况，所以CSS样式就偷懒复用了 Bootstrap 。
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
import Pagination from 'simple-react-ui/dist/pagination';
```



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
                    count={this.state.count} size={this.state.size} 
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
    lib/        # 源代码
        pagination/  # 分页组件的源代码
    test/       # 测试 
    dist/       # 编译后的文件夹
    doc/        # 文档
```

### 模块的暴露方式

源码本身使用 `typescript` 开发 ，转码后置入 `/dist`，并交由`index.js`暴露给用户。

由于在`package.json`中添加了`prepublish`命令， 发布之前会自动进行 babel 编译：
