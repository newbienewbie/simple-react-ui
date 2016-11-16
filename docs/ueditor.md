

## 示例

步骤：

* 把UEditor相应的文件包放置在浏览器端可以访问的URL路径下，比如，`/static`
* 引入 simple-react-ui 的 UEditor 组件

这样仅仅是配置好前端；后端仍然需要编写代码，可以使用[express-ueditor](https://www.npmjs.com/package/express-ueditor)充当后端

```JavaScript

import React from 'react';
import UEditor from 'simple-react-ui/dist/ueditor';

const Add=React.createClass({

    render:function () {

        return (<div className="col-sm-9 col-sm-offset-3 col-md-8 col-md-offset-2 main">
            <form action="" method='post' className="container" >
                <input name='title'/>
                <UEditor id="ueditorContainer" name="content" 
                    width={800} height={500} 
                    uconfigSrc='/static/ueditor/ueditor.config.js',
                    ueditorSrc='/static/ueditor/ueditor.all.min.js',
                />
                <input className="btn btn-warning" type='submit' name="提交" value='提交'/>
            </form>
        </div>);
    }
});


export default Add;
```