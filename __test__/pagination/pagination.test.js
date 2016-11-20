import assert from 'assert';
import renderer from'react-test-renderer';
import React from 'react';
import Pagination from '../../dist/pagination/index.js';
import calculatePaginationInfo  from'../../dist/pagination/utils/calculate-pagination-info.js';

describe("测试分页组件",function(){
    

    describe('测试规定的总数、分页大小和当前页',function(){
        
        const info=calculatePaginationInfo(123,4,8,5);
        const component=renderer.create(<Pagination total={123} size={4} current={8} onChange={()=>{}} />);
        const tree=component.toJSON();

        it("检查最外层元素是否是nav",function(){
            assert.equal(tree.type,"nav","顶级元素是个<nav>");
        });

        it("检查ul、li、a 内容",function(){
            const ul=tree.children[0];
            assert.equal(ul.type,"ul","应该是<ul>");
            ul.children.forEach((e,i)=>{
                assert.equal(e.type,"li","应该嵌套一个<li>元素");
                const a=e.children[0];
                assert.equal(a.type,"a","每个<li>下都包装了一个<a>");
                const content=a.children[0];

                // 测试 firstDigit
                if(i==0){ 
                    assert.equal(content,"«");
                }
                // 测试 lastDigit
                else if(i==(ul.children.length-1)){ 
                    assert.equal(content,"»");
                }
                // 测试 中间的digit
                else{
                    assert.equal(content,info.firstDigit+i-1);
                }
            });
        });

    });


});
