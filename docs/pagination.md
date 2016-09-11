# pagination

一个用react实现的简单的分页组件。

## 属性：
     
* count: 总的记录数目,默认为50
* size：每页记录数,默认为10
* current: 当前页码，默认为1
* semiBandWidth: 指的是从当前页码到显示的最大页码或最小页面的距离上限，默认为5。比如，当前页码是3，如果semiBandWidth=5,则lastDigit最大为8。
* onChange:  当页码改变时触发，默认为(page) => { }

## 使用

示例：
```JavaScript
import React from 'react';
import Pagination from 'simple-react-pagination';

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


