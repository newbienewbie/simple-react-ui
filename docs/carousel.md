

## 示例

```JavaScript
import Carousel from 'simple-react-ui/dist/carousel';
import React from 'react';
import ReactDOM from 'react-dom';


ReactDOM.render(
    <Carousel 
        style={{
            height:'400',
        }} 
        items={[
            {caption:'xxxxxxxx',imgSrc:'upload/image/20160907/6360887246932449087951059.jpg',href:"http://www.baidu.com"},
            {caption:'yyyyyyyy',imgSrc:''},
            {caption:'zzzzzzzz',imgSrc:'upload/image/20160907/6360887246973009157008961.jpg'},
        ]} 
    />, 
    document.getElementById('container') 
)
```